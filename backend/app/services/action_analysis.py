import cv2
import numpy as np
from typing import List, Dict, Any, Optional, Tuple
import logging
import asyncio
from pathlib import Path

from ..models.schemas import PoseFrame, ActionDescription
from ..services.glm_service import glm_service
from ..services.pose_detection import pose_detector

logger = logging.getLogger(__name__)


class ActionAnalyzer:
    """动作分析器"""
    
    def __init__(self):
        self.min_action_duration = 1.0  # 最小动作持续时间（秒）
        self.max_action_duration = 10.0  # 最大动作持续时间（秒）
        self.motion_threshold = 0.02  # 运动阈值
    
    async def analyze_actions_from_poses(
        self, 
        pose_frames: List[PoseFrame],
        frame_paths: List[str],
        video_id: str
    ) -> List[ActionDescription]:
        """从姿态序列分析动作"""
        
        if not pose_frames:
            logger.warning("没有姿态数据可供分析")
            return []
        
        try:
            # 1. 分割动作序列
            action_segments = self._segment_actions(pose_frames)
            
            # 2. 为每个动作段生成描述
            actions = []
            for i, segment in enumerate(action_segments):
                action = await self._analyze_action_segment(
                    segment, frame_paths, video_id, i
                )
                if action:
                    actions.append(action)
            
            logger.info(f"视频 {video_id} 动作分析完成: {len(actions)} 个动作")
            return actions
            
        except Exception as e:
            logger.error(f"动作分析失败: {e}")
            return []
    
    def _segment_actions(self, pose_frames: List[PoseFrame]) -> List[List[PoseFrame]]:
        """分割动作序列"""
        
        if len(pose_frames) < 2:
            return [pose_frames]
        
        # 计算运动强度
        motion_intensities = self._calculate_motion_intensities(pose_frames)
        
        # 找到动作边界
        segments = []
        current_segment = [pose_frames[0]]
        
        for i in range(1, len(pose_frames)):
            current_segment.append(pose_frames[i])
            
            # 检查是否应该结束当前段落
            should_end_segment = False
            
            # 基于时间长度
            segment_duration = pose_frames[i].timestamp - current_segment[0].timestamp
            if segment_duration >= self.max_action_duration:
                should_end_segment = True
            
            # 基于运动强度变化
            if i < len(motion_intensities):
                if (motion_intensities[i] < self.motion_threshold and 
                    segment_duration >= self.min_action_duration):
                    should_end_segment = True
            
            if should_end_segment:
                segments.append(current_segment)
                current_segment = [pose_frames[i]]
        
        # 添加最后一个段落
        if current_segment:
            segments.append(current_segment)
        
        # 过滤太短的段落
        filtered_segments = []
        for segment in segments:
            duration = segment[-1].timestamp - segment[0].timestamp
            if duration >= self.min_action_duration:
                filtered_segments.append(segment)
        
        return filtered_segments if filtered_segments else [pose_frames]
    
    def _calculate_motion_intensities(self, pose_frames: List[PoseFrame]) -> List[float]:
        """计算运动强度序列"""
        
        intensities = [0.0]  # 第一帧强度为0
        
        for i in range(1, len(pose_frames)):
            intensity = self._calculate_frame_motion_intensity(
                pose_frames[i-1], pose_frames[i]
            )
            intensities.append(intensity)
        
        return intensities
    
    def _calculate_frame_motion_intensity(self, prev_frame: PoseFrame, curr_frame: PoseFrame) -> float:
        """计算两帧之间的运动强度"""
        
        dt = curr_frame.timestamp - prev_frame.timestamp
        if dt <= 0:
            return 0.0
        
        total_motion = 0.0
        count = 0
        
        # 重点关注的关键点（手、脚、躯干）
        key_points = [
            'left_wrist', 'right_wrist', 'left_ankle', 'right_ankle',
            'left_shoulder', 'right_shoulder', 'left_hip', 'right_hip'
        ]
        
        for point_name in key_points:
            if (point_name in prev_frame.keypoints and 
                point_name in curr_frame.keypoints):
                
                prev_kp = prev_frame.keypoints[point_name]
                curr_kp = curr_frame.keypoints[point_name]
                
                # 计算位移
                dx = curr_kp.x - prev_kp.x
                dy = curr_kp.y - prev_kp.y
                
                # 计算速度
                velocity = np.sqrt(dx*dx + dy*dy) / dt
                
                # 加权（手部运动权重更高）
                weight = 2.0 if 'wrist' in point_name else 1.0
                total_motion += velocity * weight
                count += weight
        
        return total_motion / count if count > 0 else 0.0
    
    async def _analyze_action_segment(
        self, 
        segment: List[PoseFrame], 
        frame_paths: List[str],
        video_id: str,
        action_index: int
    ) -> Optional[ActionDescription]:
        """分析单个动作段落"""
        
        try:
            start_time = segment[0].timestamp
            end_time = segment[-1].timestamp
            
            # 选择代表性帧进行GLM分析
            representative_frame = self._select_representative_frame(segment)
            
            # 获取对应的图像帧
            frame_image = self._get_frame_image(representative_frame, frame_paths)
            
            if frame_image is None:
                logger.warning(f"无法获取动作 {action_index} 的图像帧")
                return self._create_fallback_action(start_time, end_time, action_index, segment)
            
            # 使用GLM分析动作
            context = self._build_analysis_context(segment, action_index)
            
            glm_response = await glm_service.analyze_dance_action(
                frame_image, representative_frame, context
            )
            
            if glm_response:
                return self._parse_glm_response(
                    glm_response, start_time, end_time, action_index
                )
            else:
                return self._create_fallback_action(start_time, end_time, action_index, segment)
                
        except Exception as e:
            logger.error(f"分析动作段落失败: {e}")
            return self._create_fallback_action(
                segment[0].timestamp, segment[-1].timestamp, action_index, segment
            )
    
    def _select_representative_frame(self, segment: List[PoseFrame]) -> PoseFrame:
        """选择代表性帧"""
        
        # 选择置信度最高的帧
        best_frame = max(segment, key=lambda frame: frame.pose_confidence)
        return best_frame
    
    def _get_frame_image(self, pose_frame: PoseFrame, frame_paths: List[str]) -> Optional[bytes]:
        """获取帧图像数据"""
        
        try:
            # 根据时间戳找到对应的帧文件
            target_timestamp = pose_frame.timestamp
            best_match = None
            min_diff = float('inf')
            
            for frame_path in frame_paths:
                # 从文件名提取时间戳
                filename = Path(frame_path).name
                if '_' in filename and 's.jpg' in filename:
                    try:
                        timestamp_str = filename.split('_')[-1].replace('s.jpg', '')
                        timestamp = float(timestamp_str)
                        diff = abs(timestamp - target_timestamp)
                        
                        if diff < min_diff:
                            min_diff = diff
                            best_match = frame_path
                    except ValueError:
                        continue
            
            if best_match and min_diff < 0.5:  # 时间差小于0.5秒
                with open(best_match, 'rb') as f:
                    return f.read()
            
        except Exception as e:
            logger.error(f"获取帧图像失败: {e}")
        
        return None
    
    def _build_analysis_context(self, segment: List[PoseFrame], action_index: int) -> str:
        """构建分析上下文"""
        
        duration = segment[-1].timestamp - segment[0].timestamp
        avg_confidence = np.mean([frame.pose_confidence for frame in segment])
        
        # 分析运动特征
        motion_analysis = pose_detector.analyze_pose_sequence(segment)
        
        context = f"""
这是舞蹈视频中的第 {action_index + 1} 个动作段落。

时间信息：
- 开始时间: {segment[0].timestamp:.1f}秒
- 结束时间: {segment[-1].timestamp:.1f}秒  
- 持续时间: {duration:.1f}秒

姿态信息：
- 帧数: {len(segment)}
- 平均置信度: {avg_confidence:.3f}
- 整体运动强度: {motion_analysis.get('motion_analysis', {}).get('overall_activity', 0):.3f}

请分析这个舞蹈动作，重点关注：
1. 动作的类型和名称
2. 身体各部位的协调配合
3. 动作的技术要点
4. 适合的学习建议
"""
        
        return context
    
    def _parse_glm_response(
        self, 
        glm_response: str, 
        start_time: float, 
        end_time: float, 
        action_index: int
    ) -> ActionDescription:
        """解析GLM响应"""
        
        try:
            # 简单的文本解析（实际项目中可能需要更复杂的解析）
            lines = glm_response.strip().split('\n')
            
            action_name = f"舞蹈动作 {action_index + 1}"
            description = glm_response
            difficulty_level = 3  # 默认中等难度
            key_points = []
            common_mistakes = []
            
            # 尝试提取结构化信息
            for line in lines:
                line = line.strip()
                if line.startswith('动作名称') or line.startswith('1.'):
                    action_name = line.split('：')[-1].split('.')[-1].strip()
                elif '要点' in line or '技巧' in line:
                    key_points.append(line)
                elif '错误' in line or '注意' in line:
                    common_mistakes.append(line)
                elif '难度' in line:
                    # 尝试提取难度等级
                    for i in range(1, 6):
                        if str(i) in line:
                            difficulty_level = i
                            break
            
            # 如果没有提取到要点，使用默认值
            if not key_points:
                key_points = ["保持身体协调", "注意节拍配合", "动作要流畅自然"]
            
            return ActionDescription(
                start_time=start_time,
                end_time=end_time,
                action_name=action_name,
                description=description,
                difficulty_level=difficulty_level,
                key_points=key_points,
                common_mistakes=common_mistakes
            )
            
        except Exception as e:
            logger.error(f"解析GLM响应失败: {e}")
            return self._create_fallback_action(start_time, end_time, action_index, [])
    
    def _create_fallback_action(
        self, 
        start_time: float, 
        end_time: float, 
        action_index: int,
        segment: List[PoseFrame]
    ) -> ActionDescription:
        """创建备用动作描述"""
        
        duration = end_time - start_time
        
        # 基于持续时间和运动强度推测动作类型
        if duration < 2.0:
            action_type = "快速动作"
        elif duration > 5.0:
            action_type = "缓慢动作"
        else:
            action_type = "标准动作"
        
        return ActionDescription(
            start_time=start_time,
            end_time=end_time,
            action_name=f"{action_type} {action_index + 1}",
            description=f"这是一个持续 {duration:.1f} 秒的{action_type}，包含了身体的协调运动。",
            difficulty_level=3,
            key_points=[
                "保持身体平衡",
                "注意动作的连贯性",
                "配合音乐节拍"
            ],
            common_mistakes=[
                "动作过于僵硬",
                "节拍不准确"
            ]
        )


# 创建全局服务实例
action_analyzer = ActionAnalyzer()
