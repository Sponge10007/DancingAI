from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import JSONResponse
from typing import List, Optional
import logging

from ...services.video_service import video_processor
from ...models.schemas import VideoUploadResponse
from ...core.config import settings

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/upload", response_model=VideoUploadResponse)
async def upload_video(file: UploadFile = File(...)):
    """上传视频文件"""
    
    # 检查文件类型
    if not file.filename:
        raise HTTPException(status_code=400, detail="文件名不能为空")
    
    file_ext = file.filename.split('.')[-1].lower()
    if f".{file_ext}" not in settings.ALLOWED_VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400, 
            detail=f"不支持的文件格式。支持的格式: {', '.join(settings.ALLOWED_VIDEO_EXTENSIONS)}"
        )
    
    # 检查文件大小
    file_content = await file.read()
    if len(file_content) > settings.MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400, 
            detail=f"文件大小超过限制 ({settings.MAX_FILE_SIZE / 1024 / 1024:.1f}MB)"
        )
    
    try:
        # 保存视频文件
        result = await video_processor.save_uploaded_video(file_content, file.filename)
        
        logger.info(f"视频上传成功: {result.video_id}, 文件名: {result.filename}")
        return result
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"视频上传失败: {e}")
        raise HTTPException(status_code=500, detail="视频上传失败")


@router.get("/{video_id}/info")
async def get_video_info(video_id: str):
    """获取视频信息"""
    
    try:
        info = video_processor.get_video_info(video_id)
        return info
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"获取视频信息失败: {e}")
        raise HTTPException(status_code=500, detail="获取视频信息失败")


@router.post("/{video_id}/extract-frames")
async def extract_frames(
    video_id: str,
    fps: Optional[int] = None,
    start_time: float = 0.0,
    end_time: Optional[float] = None
):
    """提取视频帧"""
    
    try:
        frame_paths = video_processor.extract_frames(
            video_id=video_id,
            fps=fps,
            start_time=start_time,
            end_time=end_time
        )
        
        return {
            "video_id": video_id,
            "frame_count": len(frame_paths),
            "frame_paths": frame_paths[:10],  # 只返回前10个路径作为示例
            "total_frames": len(frame_paths)
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"提取视频帧失败: {e}")
        raise HTTPException(status_code=500, detail="提取视频帧失败")


@router.post("/{video_id}/extract-audio")
async def extract_audio(video_id: str):
    """提取视频音频"""
    
    try:
        audio_path = video_processor.extract_audio(video_id)
        
        return {
            "video_id": video_id,
            "audio_path": audio_path,
            "message": "音频提取成功"
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"提取音频失败: {e}")
        raise HTTPException(status_code=500, detail="提取音频失败")


@router.delete("/{video_id}")
async def delete_video(video_id: str):
    """删除视频及相关文件"""
    
    try:
        # 清理所有相关文件
        video_processor.cleanup_temp_files(video_id)
        
        # 删除原视频文件
        video_path = video_processor._get_video_path(video_id)
        if video_path.exists():
            video_path.unlink()
        
        return {"message": f"视频 {video_id} 删除成功"}
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"删除视频失败: {e}")
        raise HTTPException(status_code=500, detail="删除视频失败")
