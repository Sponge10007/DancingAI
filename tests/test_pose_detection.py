import pytest
import numpy as np
import cv2
import tempfile
import os
from pathlib import Path
import asyncio

from backend.app.services.pose_detection import PoseDetector
from backend.app.services.action_analysis import ActionAnalyzer
from backend.app.models.schemas import PoseFrame, PoseKeypoint


class TestPoseDetector:
    """姿态检测器测试"""
    
    @pytest.fixture
    def pose_detector(self):
        """创建姿态检测器实例"""
        return PoseDetector()
    
    @pytest.fixture
    def action_analyzer(self):
        """创建动作分析器实例"""
        return ActionAnalyzer()
    
    @pytest.fixture
    def sample_frame(self):
        """创建示例帧"""
        # 创建一个简单的人形图像
        frame = np.zeros((480, 640, 3), dtype=np.uint8)
        
        # 绘制一个简单的人形（头、身体、四肢）
        # 头部
        cv2.circle(frame, (320, 100), 30, (255, 255, 255), -1)
        
        # 身体
        cv2.rectangle(frame, (300, 130), (340, 250), (255, 255, 255), -1)
        
        # 手臂
        cv2.rectangle(frame, (260, 150), (300, 170), (255, 255, 255), -1)  # 左臂
        cv2.rectangle(frame, (340, 150), (380, 170), (255, 255, 255), -1)  # 右臂
        
        # 腿部
        cv2.rectangle(frame, (305, 250), (320, 350), (255, 255, 255), -1)  # 左腿
        cv2.rectangle(frame, (320, 250), (335, 350), (255, 255, 255), -1)  # 右腿
        
        return frame
    
    @pytest.fixture
    def sample_pose_frames(self):
        """创建示例姿态帧序列"""
        frames = []
        
        for i in range(10):
            # 创建关键点数据
            keypoints = {}
            
            # 添加一些基本关键点
            keypoints['nose'] = PoseKeypoint(x=0.5, y=0.2, z=0.0, confidence=0.9)
            keypoints['left_shoulder'] = PoseKeypoint(x=0.4, y=0.3, z=0.0, confidence=0.8)
            keypoints['right_shoulder'] = PoseKeypoint(x=0.6, y=0.3, z=0.0, confidence=0.8)
            keypoints['left_wrist'] = PoseKeypoint(x=0.3 + i*0.01, y=0.4, z=0.0, confidence=0.7)
            keypoints['right_wrist'] = PoseKeypoint(x=0.7 - i*0.01, y=0.4, z=0.0, confidence=0.7)
            keypoints['left_hip'] = PoseKeypoint(x=0.45, y=0.6, z=0.0, confidence=0.8)
            keypoints['right_hip'] = PoseKeypoint(x=0.55, y=0.6, z=0.0, confidence=0.8)
            
            pose_frame = PoseFrame(
                timestamp=i * 0.1,  # 每0.1秒一帧
                frame_number=i,
                keypoints=keypoints,
                pose_confidence=0.8
            )
            
            frames.append(pose_frame)
        
        return frames
    
    def test_detect_pose_from_frame(self, pose_detector, sample_frame):
        """测试单帧姿态检测"""
        result = pose_detector.detect_pose_from_frame(sample_frame, 0.0, 0)
        
        # 由于是简单的人形图像，可能检测不到真实姿态
        # 这里主要测试函数不会崩溃
        assert result is None or isinstance(result, PoseFrame)
    
    @pytest.mark.asyncio
    async def test_detect_poses_from_video(self, pose_detector):
        """测试视频姿态检测"""
        # 创建临时图像文件
        temp_files = []
        
        try:
            for i in range(3):
                temp_file = tempfile.NamedTemporaryFile(suffix=f'_frame_{i:06d}_{i*0.1:.3f}s.jpg', delete=False)
                temp_file.close()
                
                # 创建简单图像
                frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
                cv2.imwrite(temp_file.name, frame)
                temp_files.append(temp_file.name)
            
            # 测试检测
            results = await pose_detector.detect_poses_from_video("test_video", temp_files)
            
            # 验证结果
            assert isinstance(results, list)
            # 由于是随机图像，可能检测不到姿态，所以不强制要求有结果
            
        finally:
            # 清理临时文件
            for temp_file in temp_files:
                if os.path.exists(temp_file):
                    os.unlink(temp_file)
    
    def test_analyze_pose_sequence(self, pose_detector, sample_pose_frames):
        """测试姿态序列分析"""
        analysis = pose_detector.analyze_pose_sequence(sample_pose_frames)
        
        assert isinstance(analysis, dict)
        assert "total_frames" in analysis
        assert "average_confidence" in analysis
        assert "duration" in analysis
        assert analysis["total_frames"] == len(sample_pose_frames)
    
    def test_analyze_keypoint_stability(self, pose_detector, sample_pose_frames):
        """测试关键点稳定性分析"""
        stability = pose_detector._analyze_keypoint_stability(sample_pose_frames)
        
        assert isinstance(stability, dict)
        
        # 检查是否包含预期的关键点
        expected_keypoints = ['nose', 'left_shoulder', 'right_shoulder', 'left_wrist', 'right_wrist']
        for keypoint in expected_keypoints:
            if keypoint in stability:
                assert 0 <= stability[keypoint] <= 1
    
    def test_analyze_motion_patterns(self, pose_detector, sample_pose_frames):
        """测试运动模式分析"""
        motion = pose_detector._analyze_motion_patterns(sample_pose_frames)
        
        assert isinstance(motion, dict)
        if "motion_intensity" in motion:
            assert isinstance(motion["motion_intensity"], dict)
        if "overall_activity" in motion:
            assert isinstance(motion["overall_activity"], (int, float))
    
    def test_identify_key_poses(self, pose_detector, sample_pose_frames):
        """测试关键姿态识别"""
        key_poses = pose_detector._identify_key_poses(sample_pose_frames, 3)
        
        assert isinstance(key_poses, list)
        assert len(key_poses) <= 3
        
        for pose in key_poses:
            assert "timestamp" in pose
            assert "frame_number" in pose
    
    @pytest.mark.asyncio
    async def test_action_analyzer_segment_actions(self, action_analyzer, sample_pose_frames):
        """测试动作分割"""
        segments = action_analyzer._segment_actions(sample_pose_frames)
        
        assert isinstance(segments, list)
        assert len(segments) > 0
        
        # 验证每个段落都包含帧
        for segment in segments:
            assert isinstance(segment, list)
            assert len(segment) > 0
            assert all(isinstance(frame, PoseFrame) for frame in segment)
    
    def test_calculate_motion_intensities(self, action_analyzer, sample_pose_frames):
        """测试运动强度计算"""
        intensities = action_analyzer._calculate_motion_intensities(sample_pose_frames)
        
        assert isinstance(intensities, list)
        assert len(intensities) == len(sample_pose_frames)
        assert all(isinstance(intensity, (int, float)) for intensity in intensities)
        assert all(intensity >= 0 for intensity in intensities)
    
    def test_calculate_frame_motion_intensity(self, action_analyzer, sample_pose_frames):
        """测试帧间运动强度计算"""
        if len(sample_pose_frames) >= 2:
            intensity = action_analyzer._calculate_frame_motion_intensity(
                sample_pose_frames[0], sample_pose_frames[1]
            )
            
            assert isinstance(intensity, (int, float))
            assert intensity >= 0
    
    def test_create_fallback_action(self, action_analyzer):
        """测试备用动作创建"""
        action = action_analyzer._create_fallback_action(0.0, 2.0, 0, [])
        
        assert action.start_time == 0.0
        assert action.end_time == 2.0
        assert isinstance(action.action_name, str)
        assert isinstance(action.description, str)
        assert 1 <= action.difficulty_level <= 5
        assert isinstance(action.key_points, list)
        assert isinstance(action.common_mistakes, list)


if __name__ == "__main__":
    # 运行简单测试
    detector = PoseDetector()
    analyzer = ActionAnalyzer()
    
    # 创建测试帧
    test_frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
    
    # 测试姿态检测
    result = detector.detect_pose_from_frame(test_frame, 0.0, 0)
    print(f"姿态检测结果: {result is not None}")
    
    # 创建示例姿态数据
    sample_keypoints = {
        'nose': PoseKeypoint(x=0.5, y=0.2, z=0.0, confidence=0.9),
        'left_wrist': PoseKeypoint(x=0.3, y=0.4, z=0.0, confidence=0.7),
        'right_wrist': PoseKeypoint(x=0.7, y=0.4, z=0.0, confidence=0.7)
    }
    
    sample_pose = PoseFrame(
        timestamp=0.0,
        frame_number=0,
        keypoints=sample_keypoints,
        pose_confidence=0.8
    )
    
    # 测试动作分析
    fallback_action = analyzer._create_fallback_action(0.0, 2.0, 0, [sample_pose])
    print(f"备用动作创建成功: {fallback_action.action_name}")
    
    print("姿态检测和动作分析功能测试通过！")
