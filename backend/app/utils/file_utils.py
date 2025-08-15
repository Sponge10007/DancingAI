import os
import hashlib
from pathlib import Path
from typing import Optional


def get_file_hash(file_path: str, algorithm: str = "md5") -> str:
    """计算文件哈希值"""
    hash_func = hashlib.new(algorithm)
    
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(4096), b""):
            hash_func.update(chunk)
    
    return hash_func.hexdigest()


def ensure_dir_exists(dir_path: str) -> Path:
    """确保目录存在"""
    path = Path(dir_path)
    path.mkdir(parents=True, exist_ok=True)
    return path


def get_file_size_mb(file_path: str) -> float:
    """获取文件大小（MB）"""
    return os.path.getsize(file_path) / (1024 * 1024)


def is_video_file(filename: str) -> bool:
    """检查是否为视频文件"""
    video_extensions = {'.mp4', '.avi', '.mov', '.mkv', '.flv', '.wmv', '.webm'}
    return Path(filename).suffix.lower() in video_extensions


def is_audio_file(filename: str) -> bool:
    """检查是否为音频文件"""
    audio_extensions = {'.mp3', '.wav', '.flac', '.aac', '.ogg', '.m4a'}
    return Path(filename).suffix.lower() in audio_extensions


def clean_filename(filename: str) -> str:
    """清理文件名，移除特殊字符"""
    import re
    # 移除或替换特殊字符
    cleaned = re.sub(r'[<>:"/\\|?*]', '_', filename)
    # 移除多余的空格
    cleaned = re.sub(r'\s+', ' ', cleaned).strip()
    return cleaned


def get_temp_file_path(suffix: str = "", prefix: str = "temp_") -> str:
    """生成临时文件路径"""
    import tempfile
    import uuid
    
    temp_dir = tempfile.gettempdir()
    filename = f"{prefix}{uuid.uuid4().hex[:8]}{suffix}"
    return os.path.join(temp_dir, filename)
