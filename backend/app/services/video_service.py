import cv2
import numpy as np
import librosa
import ffmpeg
import os
import uuid
from typing import Tuple, List, Optional, Dict, Any
from pathlib import Path
import tempfile
import logging
import asyncio
from concurrent.futures import ThreadPoolExecutor

from ..core.config import settings
from ..models.schemas import VideoUploadResponse

logger = logging.getLogger(__name__)


class VideoProcessor:
    """视频处理服务"""
    
    def __init__(self):
        self.upload_dir = Path(settings.UPLOAD_DIR)
        self.upload_dir.mkdir(exist_ok=True)
        
        # 创建子目录
        (self.upload_dir / "videos").mkdir(exist_ok=True)
        (self.upload_dir / "frames").mkdir(exist_ok=True)
        (self.upload_dir / "audio").mkdir(exist_ok=True)
        (self.upload_dir / "temp").mkdir(exist_ok=True)
    
    async def save_uploaded_video(self, file_content: bytes, filename: str) -> VideoUploadResponse:
        """保存上传的视频文件"""
        
        # 生成唯一的视频ID
        video_id = str(uuid.uuid4())
        
        # 获取文件扩展名
        file_ext = Path(filename).suffix.lower()
        if file_ext not in settings.ALLOWED_VIDEO_EXTENSIONS:
            raise ValueError(f"不支持的视频格式: {file_ext}")
        
        # 保存文件
        video_path = self.upload_dir / "videos" / f"{video_id}{file_ext}"
        
        with open(video_path, "wb") as f:
            f.write(file_content)
        
        # 获取视频信息
        duration = self._get_video_duration(str(video_path))
        
        if duration > settings.MAX_VIDEO_DURATION:
            # 删除文件
            os.remove(video_path)
            raise ValueError(f"视频时长超过限制 ({settings.MAX_VIDEO_DURATION}秒)")
        
        return VideoUploadResponse(
            video_id=video_id,
            filename=filename,
            file_size=len(file_content),
            duration=duration
        )
    
    def _get_video_duration(self, video_path: str) -> float:
        """获取视频时长"""
        try:
            cap = cv2.VideoCapture(video_path)
            fps = cap.get(cv2.CAP_PROP_FPS)
            frame_count = cap.get(cv2.CAP_PROP_FRAME_COUNT)
            cap.release()
            
            if fps > 0:
                return frame_count / fps
            else:
                # 使用ffmpeg作为备选方案
                probe = ffmpeg.probe(video_path)
                duration = float(probe['streams'][0]['duration'])
                return duration
                
        except Exception as e:
            logger.error(f"获取视频时长失败: {e}")
            return 0.0
    
    def extract_frames(
        self, 
        video_id: str, 
        fps: Optional[int] = None,
        start_time: float = 0.0,
        end_time: Optional[float] = None
    ) -> List[str]:
        """提取视频帧"""
        
        video_path = self._get_video_path(video_id)
        if not video_path.exists():
            raise FileNotFoundError(f"视频文件不存在: {video_id}")
        
        frames_dir = self.upload_dir / "frames" / video_id
        frames_dir.mkdir(exist_ok=True)
        
        cap = cv2.VideoCapture(str(video_path))
        
        # 获取视频信息
        original_fps = cap.get(cv2.CAP_PROP_FPS)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        
        # 设置提取帧率
        if fps is None:
            fps = settings.FRAME_EXTRACTION_FPS
        
        # 计算帧间隔
        frame_interval = max(1, int(original_fps / fps))
        
        # 设置开始和结束帧
        start_frame = int(start_time * original_fps)
        end_frame = int(end_time * original_fps) if end_time else total_frames
        
        cap.set(cv2.CAP_PROP_POS_FRAMES, start_frame)
        
        frame_paths = []
        frame_number = start_frame
        extracted_count = 0
        
        try:
            while frame_number < end_frame:
                ret, frame = cap.read()
                if not ret:
                    break
                
                if frame_number % frame_interval == 0:
                    # 保存帧
                    timestamp = frame_number / original_fps
                    frame_filename = f"frame_{extracted_count:06d}_{timestamp:.3f}s.jpg"
                    frame_path = frames_dir / frame_filename
                    
                    cv2.imwrite(str(frame_path), frame)
                    frame_paths.append(str(frame_path))
                    extracted_count += 1
                
                frame_number += 1
                
        finally:
            cap.release()
        
        logger.info(f"提取了 {len(frame_paths)} 帧，视频ID: {video_id}")
        return frame_paths
    
    def extract_audio(self, video_id: str) -> str:
        """提取视频音频"""
        
        video_path = self._get_video_path(video_id)
        if not video_path.exists():
            raise FileNotFoundError(f"视频文件不存在: {video_id}")
        
        audio_dir = self.upload_dir / "audio"
        audio_path = audio_dir / f"{video_id}.wav"
        
        try:
            # 使用ffmpeg提取音频
            (
                ffmpeg
                .input(str(video_path))
                .output(
                    str(audio_path),
                    acodec='pcm_s16le',
                    ar=settings.AUDIO_SAMPLE_RATE,
                    ac=1  # 单声道
                )
                .overwrite_output()
                .run(quiet=True)
            )
            
            logger.info(f"音频提取完成: {audio_path}")
            return str(audio_path)
            
        except Exception as e:
            logger.error(f"音频提取失败: {e}")
            raise
    
    def get_video_info(self, video_id: str) -> Dict[str, Any]:
        """获取视频详细信息"""
        
        video_path = self._get_video_path(video_id)
        if not video_path.exists():
            raise FileNotFoundError(f"视频文件不存在: {video_id}")
        
        cap = cv2.VideoCapture(str(video_path))
        
        try:
            info = {
                "video_id": video_id,
                "width": int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)),
                "height": int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT)),
                "fps": cap.get(cv2.CAP_PROP_FPS),
                "frame_count": int(cap.get(cv2.CAP_PROP_FRAME_COUNT)),
                "duration": cap.get(cv2.CAP_PROP_FRAME_COUNT) / cap.get(cv2.CAP_PROP_FPS),
                "file_path": str(video_path),
                "file_size": video_path.stat().st_size
            }
            
            return info
            
        finally:
            cap.release()
    
    def resize_frame(
        self, 
        frame: np.ndarray, 
        target_width: int = 640, 
        target_height: int = 480
    ) -> np.ndarray:
        """调整帧大小"""
        return cv2.resize(frame, (target_width, target_height))
    
    def normalize_frame(self, frame: np.ndarray) -> np.ndarray:
        """标准化帧数据"""
        # 转换为RGB格式
        if len(frame.shape) == 3 and frame.shape[2] == 3:
            frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        
        # 归一化到0-1范围
        return frame.astype(np.float32) / 255.0
    
    def _get_video_path(self, video_id: str) -> Path:
        """获取视频文件路径"""
        videos_dir = self.upload_dir / "videos"
        
        # 查找匹配的视频文件
        for ext in settings.ALLOWED_VIDEO_EXTENSIONS:
            video_path = videos_dir / f"{video_id}{ext}"
            if video_path.exists():
                return video_path
        
        raise FileNotFoundError(f"找不到视频文件: {video_id}")
    
    def get_video_info(self, video_id: str) -> Dict[str, Any]:
        """获取视频信息"""
        video_path = self._get_video_path(video_id)
        if not video_path.exists():
            raise FileNotFoundError(f"视频文件不存在: {video_id}")

        # 获取文件信息
        file_stat = video_path.stat()
        duration = self._get_video_duration(str(video_path))

        # 获取视频详细信息
        cap = cv2.VideoCapture(str(video_path))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        cap.release()

        return {
            "video_id": video_id,
            "filename": video_path.name,
            "file_size": file_stat.st_size,
            "duration": duration,
            "width": width,
            "height": height,
            "fps": fps,
            "frame_count": frame_count,
            "upload_time": file_stat.st_mtime
        }

    def cleanup_temp_files(self, video_id: str):
        """清理临时文件"""
        try:
            # 清理帧文件
            frames_dir = self.upload_dir / "frames" / video_id
            if frames_dir.exists():
                for frame_file in frames_dir.glob("*.jpg"):
                    frame_file.unlink()
                frames_dir.rmdir()

            # 清理音频文件
            audio_file = self.upload_dir / "audio" / f"{video_id}.wav"
            if audio_file.exists():
                audio_file.unlink()

            logger.info(f"临时文件清理完成: {video_id}")

        except Exception as e:
            logger.error(f"清理临时文件失败: {e}")


# 创建全局服务实例
video_processor = VideoProcessor()
