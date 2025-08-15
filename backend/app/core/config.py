from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """应用配置"""
    
    # 应用基础配置
    APP_NAME: str = "舞蹈视频分析系统"
    VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    # API配置
    API_V1_STR: str = "/api/v1"
    
    # 智谱GLM-4.5V API配置
    GLM_API_KEY: Optional[str] = None
    GLM_BASE_URL: str = "https://open.bigmodel.cn/api/paas/v4/"
    GLM_MODEL: str = "glm-4v"
    
    # 文件上传配置
    MAX_FILE_SIZE: int = 500 * 1024 * 1024  # 500MB
    UPLOAD_DIR: str = "uploads"
    ALLOWED_VIDEO_EXTENSIONS: set = {".mp4", ".avi", ".mov", ".mkv", ".flv"}
    
    # 视频处理配置
    MAX_VIDEO_DURATION: int = 600  # 10分钟
    FRAME_EXTRACTION_FPS: int = 30
    AUDIO_SAMPLE_RATE: int = 22050
    
    # 节拍检测配置
    BPM_MIN: int = 60
    BPM_MAX: int = 200
    BEAT_TRACK_UNITS: str = "time"
    
    # 姿态检测配置
    POSE_CONFIDENCE_THRESHOLD: float = 0.5
    POSE_DETECTION_MODEL: str = "mediapipe"
    
    # 数据库配置（可选）
    DATABASE_URL: Optional[str] = None
    
    # CORS配置
    BACKEND_CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:8000",
    ]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# 创建全局配置实例
settings = Settings()

# 确保上传目录存在
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
