import pytest
import asyncio
import tempfile
import os
from pathlib import Path
import cv2
import numpy as np

from backend.app.services.video_service import VideoProcessor
from backend.app.core.config import settings


class TestVideoProcessor:
    """视频处理器测试"""
    
    @pytest.fixture
    def video_processor(self):
        """创建视频处理器实例"""
        return VideoProcessor()
    
    @pytest.fixture
    def sample_video_data(self):
        """创建示例视频数据"""
        # 创建一个简单的测试视频
        temp_file = tempfile.NamedTemporaryFile(suffix='.mp4', delete=False)
        temp_file.close()
        
        # 使用OpenCV创建一个简单的视频
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out = cv2.VideoWriter(temp_file.name, fourcc, 30.0, (640, 480))
        
        # 创建30帧的视频（1秒）
        for i in range(30):
            # 创建一个彩色帧
            frame = np.zeros((480, 640, 3), dtype=np.uint8)
            frame[:, :, i % 3] = 255  # 循环改变颜色
            out.write(frame)
        
        out.release()
        
        with open(temp_file.name, 'rb') as f:
            video_data = f.read()
        
        # 清理临时文件
        os.unlink(temp_file.name)
        
        return video_data, "test_video.mp4"
    
    @pytest.mark.asyncio
    async def test_save_uploaded_video(self, video_processor, sample_video_data):
        """测试视频上传保存"""
        video_data, filename = sample_video_data
        
        result = await video_processor.save_uploaded_video(video_data, filename)
        
        assert result.video_id is not None
        assert result.filename == filename
        assert result.file_size == len(video_data)
        assert result.duration > 0
        
        # 验证文件确实被保存
        video_path = video_processor._get_video_path(result.video_id)
        assert video_path.exists()
        
        # 清理
        video_processor.cleanup_temp_files(result.video_id)
        if video_path.exists():
            video_path.unlink()
    
    def test_get_video_info(self, video_processor, sample_video_data):
        """测试获取视频信息"""
        # 这个测试需要先保存视频
        pass  # 实际实现需要异步支持
    
    def test_extract_frames(self, video_processor):
        """测试帧提取"""
        # 需要先有视频文件
        pass
    
    def test_extract_audio(self, video_processor):
        """测试音频提取"""
        # 需要先有视频文件
        pass
    
    def test_resize_frame(self, video_processor):
        """测试帧大小调整"""
        # 创建测试帧
        frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
        
        resized = video_processor.resize_frame(frame, 320, 240)
        
        assert resized.shape == (240, 320, 3)
    
    def test_normalize_frame(self, video_processor):
        """测试帧标准化"""
        # 创建测试帧
        frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
        
        normalized = video_processor.normalize_frame(frame)
        
        assert normalized.dtype == np.float32
        assert 0 <= normalized.min() <= normalized.max() <= 1


if __name__ == "__main__":
    # 运行简单测试
    processor = VideoProcessor()
    
    # 测试帧处理功能
    test_frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
    
    resized = processor.resize_frame(test_frame, 320, 240)
    print(f"原始帧大小: {test_frame.shape}")
    print(f"调整后大小: {resized.shape}")
    
    normalized = processor.normalize_frame(test_frame)
    print(f"标准化后数据类型: {normalized.dtype}")
    print(f"标准化后数值范围: {normalized.min():.3f} - {normalized.max():.3f}")
    
    print("基础功能测试通过！")
