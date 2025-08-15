from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import logging

from ...services.beat_detection import beat_detector
from ...services.video_service import video_processor
from ...models.schemas import BeatInfo

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/{video_id}/detect", response_model=List[BeatInfo])
async def detect_beats(video_id: str):
    """检测视频的节拍"""
    
    try:
        # 首先提取音频
        audio_path = video_processor.extract_audio(video_id)
        
        # 检测节拍
        beat_infos, average_bpm = beat_detector.detect_beats_from_audio_file(audio_path)
        
        logger.info(f"视频 {video_id} 节拍检测完成: {len(beat_infos)} 个节拍, 平均BPM: {average_bpm:.1f}")
        
        return beat_infos
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"节拍检测失败: {e}")
        raise HTTPException(status_code=500, detail="节拍检测失败")


@router.get("/{video_id}/info")
async def get_beat_info(video_id: str):
    """获取视频的节拍信息摘要"""
    
    try:
        # 提取音频
        audio_path = video_processor.extract_audio(video_id)
        
        # 检测节拍
        beat_infos, average_bpm = beat_detector.detect_beats_from_audio_file(audio_path)
        
        # 分析节奏模式
        rhythm_pattern = beat_detector.analyze_rhythm_pattern(beat_infos)
        
        # 生成节拍网格
        beat_grid = beat_detector.get_beat_grid(beat_infos)
        
        return {
            "video_id": video_id,
            "total_beats": len(beat_infos),
            "average_bpm": average_bpm,
            "rhythm_pattern": rhythm_pattern,
            "beat_grid_count": len(beat_grid),
            "first_beat_time": beat_infos[0].timestamp if beat_infos else None,
            "last_beat_time": beat_infos[-1].timestamp if beat_infos else None
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"获取节拍信息失败: {e}")
        raise HTTPException(status_code=500, detail="获取节拍信息失败")


@router.get("/{video_id}/grid")
async def get_beat_grid(
    video_id: str,
    resolution: float = Query(default=0.25, ge=0.1, le=1.0, description="网格分辨率")
):
    """获取节拍网格（用于可视化）"""
    
    try:
        # 提取音频
        audio_path = video_processor.extract_audio(video_id)
        
        # 检测节拍
        beat_infos, _ = beat_detector.detect_beats_from_audio_file(audio_path)
        
        # 生成网格
        grid = beat_detector.get_beat_grid(beat_infos, resolution)
        
        return {
            "video_id": video_id,
            "resolution": resolution,
            "grid": grid,
            "grid_count": len(grid)
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"获取节拍网格失败: {e}")
        raise HTTPException(status_code=500, detail="获取节拍网格失败")


@router.get("/{video_id}/at-time")
async def get_beat_at_time(
    video_id: str,
    timestamp: float = Query(..., ge=0.0, description="时间戳（秒）")
):
    """获取指定时间点的节拍信息"""
    
    try:
        # 提取音频
        audio_path = video_processor.extract_audio(video_id)
        
        # 检测节拍
        beat_infos, _ = beat_detector.detect_beats_from_audio_file(audio_path)
        
        # 获取指定时间的节拍
        beat_at_time = beat_detector.get_beat_at_time(beat_infos, timestamp)
        
        if beat_at_time is None:
            return {
                "video_id": video_id,
                "timestamp": timestamp,
                "beat_found": False,
                "message": "在指定时间附近未找到节拍"
            }
        
        return {
            "video_id": video_id,
            "timestamp": timestamp,
            "beat_found": True,
            "beat_info": beat_at_time
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"获取时间点节拍失败: {e}")
        raise HTTPException(status_code=500, detail="获取时间点节拍失败")


@router.get("/{video_id}/rhythm-analysis")
async def analyze_rhythm(video_id: str):
    """分析视频的节奏模式"""
    
    try:
        # 提取音频
        audio_path = video_processor.extract_audio(video_id)
        
        # 检测节拍
        beat_infos, average_bpm = beat_detector.detect_beats_from_audio_file(audio_path)
        
        # 分析节奏模式
        rhythm_analysis = beat_detector.analyze_rhythm_pattern(beat_infos)
        
        return {
            "video_id": video_id,
            "average_bpm": average_bpm,
            "total_beats": len(beat_infos),
            "rhythm_analysis": rhythm_analysis
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"节奏分析失败: {e}")
        raise HTTPException(status_code=500, detail="节奏分析失败")
