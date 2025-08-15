import cv2
import mediapipe as mp
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
import logging
from pathlib import Path
import asyncio
from concurrent.futures import ThreadPoolExecutor

from ..core.config import settings
from ..models.schemas import PoseFrame, PoseKeypoint
from ..services.glm_service import glm_service

logger = logging.getLogger(__name__)


class PoseDetector:
    """姿态检测器"""
    
    def __init__(self):
        # 初始化MediaPipe
        self.mp_pose = mp.solutions.pose
        self.mp_drawing = mp.solutions.drawing_utils
        self.mp_drawing_styles = mp.solutions.drawing_styles
        
        # 创建姿态检测器
        self.pose = self.mp_pose.Pose(
            static_image_mode=False,
            model_complexity=1,
            smooth_landmarks=True,
            enable_segmentation=False,
            smooth_segmentation=True,
            min_detection_confidence=settings.POSE_CONFIDENCE_THRESHOLD,
            min_tracking_confidence=settings.POSE_CONFIDENCE_THRESHOLD
        )
        
        # 关键点名称映射
        self.landmark_names = [
            'nose', 'left_eye_inner', 'left_eye', 'left_eye_outer',
            'right_eye_inner', 'right_eye', 'right_eye_outer',
            'left_ear', 'right_ear', 'mouth_left', 'mouth_right',
            'left_shoulder', 'right_shoulder', 'left_elbow', 'right_elbow',
            'left_wrist', 'right_wrist', 'left_pinky', 'right_pinky',
            'left_index', 'right_index', 'left_thumb', 'right_thumb',
            'left_hip', 'right_hip', 'left_knee', 'right_knee',
            'left_ankle', 'right_ankle', 'left_heel', 'right_heel',
            'left_foot_index', 'right_foot_index'
        ]
        
        # 线程池用于并行处理
        self.executor = ThreadPoolExecutor(max_workers=4)
    
    def detect_pose_from_frame(self, frame: np.ndarray, timestamp: float, frame_number: int) -> Optional[PoseFrame]:
        """从单帧检测姿态"""
        
        try:
            # 转换颜色空间
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            
            # 检测姿态
            results = self.pose.process(rgb_frame)
            
            if results.pose_landmarks is None:
                return None
            
            # 提取关键点
            keypoints = {}
            landmarks = results.pose_landmarks.landmark
            
            for i, landmark in enumerate(landmarks):
                if i < len(self.landmark_names):
                    keypoint = PoseKeypoint(
                        x=landmark.x,
                        y=landmark.y,
                        z=landmark.z,
                        confidence=landmark.visibility
                    )
                    keypoints[self.landmark_names[i]] = keypoint
            
            # 计算整体姿态置信度
            pose_confidence = np.mean([kp.confidence for kp in keypoints.values()])
            
            return PoseFrame(
                timestamp=timestamp,
                frame_number=frame_number,
                keypoints=keypoints,
                pose_confidence=pose_confidence
            )
            
        except Exception as e:
            logger.error(f"姿态检测失败: {e}")
            return None
    
    async def detect_poses_from_video(self, video_id: str, frame_paths: List[str]) -> List[PoseFrame]:
        """从视频帧序列检测姿态"""
        
        pose_frames = []
        
        # 并行处理帧
        tasks = []
        for i, frame_path in enumerate(frame_paths):
            task = asyncio.create_task(
                self._process_frame_async(frame_path, i)
            )
            tasks.append(task)
        
        # 等待所有任务完成
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        # 收集有效结果
        for result in results:
            if isinstance(result, PoseFrame):
                pose_frames.append(result)
            elif isinstance(result, Exception):
                logger.warning(f"帧处理失败: {result}")
        
        # 按时间戳排序
        pose_frames.sort(key=lambda x: x.timestamp)
        
        logger.info(f"视频 {video_id} 姿态检测完成: {len(pose_frames)} 帧")
        return pose_frames
    
    async def _process_frame_async(self, frame_path: str, frame_index: int) -> Optional[PoseFrame]:
        """异步处理单帧"""
        
        loop = asyncio.get_event_loop()
        return await loop.run_in_executor(
            self.executor,
            self._process_frame_sync,
            frame_path,
            frame_index
        )
    
    def _process_frame_sync(self, frame_path: str, frame_index: int) -> Optional[PoseFrame]:
        """同步处理单帧"""
        
        try:
            # 从文件名提取时间戳
            filename = Path(frame_path).name
            if '_' in filename and 's.jpg' in filename:
                timestamp_str = filename.split('_')[-1].replace('s.jpg', '')
                timestamp = float(timestamp_str)
            else:
                timestamp = frame_index * (1.0 / 30.0)  # 假设30fps
            
            # 读取图像
            frame = cv2.imread(frame_path)
            if frame is None:
                return None
            
            return self.detect_pose_from_frame(frame, timestamp, frame_index)
            
        except Exception as e:
            logger.error(f"处理帧失败 {frame_path}: {e}")
            return None
    
    def analyze_pose_sequence(self, pose_frames: List[PoseFrame]) -> Dict[str, Any]:
        """分析姿态序列"""
        
        if not pose_frames:
            return {"error": "没有有效的姿态数据"}
        
        try:
            # 计算基本统计信息
            confidences = [frame.pose_confidence for frame in pose_frames]
            avg_confidence = np.mean(confidences)
            
            # 分析关键点稳定性
            stability_analysis = self._analyze_keypoint_stability(pose_frames)
            
            # 检测动作变化
            motion_analysis = self._analyze_motion_patterns(pose_frames)
            
            # 识别关键姿态
            key_poses = self._identify_key_poses(pose_frames)
            
            return {
                "total_frames": len(pose_frames),
                "average_confidence": avg_confidence,
                "duration": pose_frames[-1].timestamp - pose_frames[0].timestamp,
                "stability_analysis": stability_analysis,
                "motion_analysis": motion_analysis,
                "key_poses": key_poses
            }
            
        except Exception as e:
            logger.error(f"姿态序列分析失败: {e}")
            return {"error": str(e)}
    
    def _analyze_keypoint_stability(self, pose_frames: List[PoseFrame]) -> Dict[str, float]:
        """分析关键点稳定性"""
        
        stability_scores = {}
        
        for keypoint_name in self.landmark_names:
            positions = []
            
            for frame in pose_frames:
                if keypoint_name in frame.keypoints:
                    kp = frame.keypoints[keypoint_name]
                    positions.append([kp.x, kp.y])
            
            if len(positions) > 1:
                positions = np.array(positions)
                # 计算位置变化的标准差
                std_dev = np.std(positions, axis=0)
                stability = 1.0 / (1.0 + np.mean(std_dev))
                stability_scores[keypoint_name] = stability
        
        return stability_scores
    
    def _analyze_motion_patterns(self, pose_frames: List[PoseFrame]) -> Dict[str, Any]:
        """分析运动模式"""
        
        if len(pose_frames) < 2:
            return {"error": "帧数不足"}
        
        # 计算关键点速度
        velocities = {}
        
        for i in range(1, len(pose_frames)):
            dt = pose_frames[i].timestamp - pose_frames[i-1].timestamp
            if dt <= 0:
                continue
            
            for keypoint_name in self.landmark_names:
                if (keypoint_name in pose_frames[i].keypoints and 
                    keypoint_name in pose_frames[i-1].keypoints):
                    
                    curr_kp = pose_frames[i].keypoints[keypoint_name]
                    prev_kp = pose_frames[i-1].keypoints[keypoint_name]
                    
                    dx = curr_kp.x - prev_kp.x
                    dy = curr_kp.y - prev_kp.y
                    
                    velocity = np.sqrt(dx*dx + dy*dy) / dt
                    
                    if keypoint_name not in velocities:
                        velocities[keypoint_name] = []
                    velocities[keypoint_name].append(velocity)
        
        # 计算平均速度和运动强度
        motion_intensity = {}
        for keypoint_name, vel_list in velocities.items():
            if vel_list:
                motion_intensity[keypoint_name] = {
                    "average_velocity": np.mean(vel_list),
                    "max_velocity": np.max(vel_list),
                    "motion_variance": np.var(vel_list)
                }
        
        return {
            "motion_intensity": motion_intensity,
            "overall_activity": np.mean([
                data["average_velocity"] 
                for data in motion_intensity.values()
            ]) if motion_intensity else 0
        }
    
    def _identify_key_poses(self, pose_frames: List[PoseFrame], num_key_poses: int = 5) -> List[Dict[str, Any]]:
        """识别关键姿态"""
        
        if len(pose_frames) < num_key_poses:
            return [{"timestamp": frame.timestamp, "frame_number": frame.frame_number} 
                   for frame in pose_frames]
        
        # 使用简单的均匀采样策略
        indices = np.linspace(0, len(pose_frames) - 1, num_key_poses, dtype=int)
        
        key_poses = []
        for idx in indices:
            frame = pose_frames[idx]
            key_poses.append({
                "timestamp": frame.timestamp,
                "frame_number": frame.frame_number,
                "confidence": frame.pose_confidence,
                "description": f"关键姿态 {len(key_poses) + 1}"
            })
        
        return key_poses
    
    def draw_pose_on_frame(self, frame: np.ndarray, pose_frame: PoseFrame) -> np.ndarray:
        """在帧上绘制姿态"""
        
        try:
            # 创建MediaPipe landmarks对象
            landmarks = []
            for name in self.landmark_names:
                if name in pose_frame.keypoints:
                    kp = pose_frame.keypoints[name]
                    landmark = type('Landmark', (), {
                        'x': kp.x, 'y': kp.y, 'z': kp.z, 'visibility': kp.confidence
                    })()
                    landmarks.append(landmark)
            
            if landmarks:
                # 创建pose_landmarks对象
                pose_landmarks = type('PoseLandmarks', (), {'landmark': landmarks})()
                
                # 绘制姿态
                annotated_frame = frame.copy()
                self.mp_drawing.draw_landmarks(
                    annotated_frame,
                    pose_landmarks,
                    self.mp_pose.POSE_CONNECTIONS,
                    landmark_drawing_spec=self.mp_drawing_styles.get_default_pose_landmarks_style()
                )
                
                return annotated_frame
            
        except Exception as e:
            logger.error(f"绘制姿态失败: {e}")
        
        return frame
    
    def __del__(self):
        """清理资源"""
        if hasattr(self, 'pose'):
            self.pose.close()
        if hasattr(self, 'executor'):
            self.executor.shutdown(wait=True)


# 创建全局服务实例
pose_detector = PoseDetector()
