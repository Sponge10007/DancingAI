from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
import logging

from ...services.pose_detection import pose_detector
from ...services.action_analysis import action_analyzer
from ...services.video_service import video_processor
from ...models.schemas import PoseFrame, ActionDescription

logger = logging.getLogger(__name__)

router = APIRouter()


@router.post("/{video_id}/detect", response_model=List[PoseFrame])
async def detect_poses(
    video_id: str,
    fps: Optional[int] = Query(default=None, description="帧提取率"),
    start_time: float = Query(default=0.0, ge=0.0, description="开始时间（秒）"),
    end_time: Optional[float] = Query(default=None, ge=0.0, description="结束时间（秒）")
):
    """检测视频中的姿态"""
    
    try:
        # 首先提取视频帧
        frame_paths = video_processor.extract_frames(
            video_id=video_id,
            fps=fps,
            start_time=start_time,
            end_time=end_time
        )
        
        if not frame_paths:
            raise HTTPException(status_code=400, detail="无法提取视频帧")
        
        # 检测姿态
        pose_frames = await pose_detector.detect_poses_from_video(video_id, frame_paths)
        
        logger.info(f"视频 {video_id} 姿态检测完成: {len(pose_frames)} 帧")
        return pose_frames
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"姿态检测失败: {e}")
        raise HTTPException(status_code=500, detail="姿态检测失败")


@router.get("/{video_id}/analysis")
async def analyze_poses(video_id: str):
    """分析视频姿态序列"""
    
    try:
        # 提取帧
        frame_paths = video_processor.extract_frames(video_id)
        
        # 检测姿态
        pose_frames = await pose_detector.detect_poses_from_video(video_id, frame_paths)
        
        if not pose_frames:
            raise HTTPException(status_code=400, detail="未检测到有效姿态")
        
        # 分析姿态序列
        analysis_result = pose_detector.analyze_pose_sequence(pose_frames)
        
        return {
            "video_id": video_id,
            "pose_analysis": analysis_result,
            "total_frames_analyzed": len(pose_frames)
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"姿态分析失败: {e}")
        raise HTTPException(status_code=500, detail="姿态分析失败")


@router.post("/{video_id}/actions", response_model=List[ActionDescription])
async def analyze_actions(video_id: str):
    """分析视频中的舞蹈动作"""
    
    try:
        # 提取帧
        frame_paths = video_processor.extract_frames(video_id)
        
        # 检测姿态
        pose_frames = await pose_detector.detect_poses_from_video(video_id, frame_paths)
        
        if not pose_frames:
            raise HTTPException(status_code=400, detail="未检测到有效姿态")
        
        # 分析动作
        actions = await action_analyzer.analyze_actions_from_poses(
            pose_frames, frame_paths, video_id
        )
        
        logger.info(f"视频 {video_id} 动作分析完成: {len(actions)} 个动作")
        return actions
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"动作分析失败: {e}")
        raise HTTPException(status_code=500, detail="动作分析失败")


@router.get("/{video_id}/actions/summary")
async def get_actions_summary(video_id: str):
    """获取动作分析摘要"""
    
    try:
        # 提取帧
        frame_paths = video_processor.extract_frames(video_id)
        
        # 检测姿态
        pose_frames = await pose_detector.detect_poses_from_video(video_id, frame_paths)
        
        if not pose_frames:
            raise HTTPException(status_code=400, detail="未检测到有效姿态")
        
        # 分析动作
        actions = await action_analyzer.analyze_actions_from_poses(
            pose_frames, frame_paths, video_id
        )
        
        # 生成摘要
        total_duration = sum(action.end_time - action.start_time for action in actions)
        avg_difficulty = sum(action.difficulty_level for action in actions) / len(actions) if actions else 0
        
        difficulty_distribution = {}
        for action in actions:
            level = action.difficulty_level
            difficulty_distribution[level] = difficulty_distribution.get(level, 0) + 1
        
        return {
            "video_id": video_id,
            "total_actions": len(actions),
            "total_duration": total_duration,
            "average_difficulty": avg_difficulty,
            "difficulty_distribution": difficulty_distribution,
            "action_names": [action.action_name for action in actions]
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"获取动作摘要失败: {e}")
        raise HTTPException(status_code=500, detail="获取动作摘要失败")


@router.get("/{video_id}/poses/at-time")
async def get_pose_at_time(
    video_id: str,
    timestamp: float = Query(..., ge=0.0, description="时间戳（秒）")
):
    """获取指定时间点的姿态"""
    
    try:
        # 提取帧
        frame_paths = video_processor.extract_frames(video_id)
        
        # 检测姿态
        pose_frames = await pose_detector.detect_poses_from_video(video_id, frame_paths)
        
        if not pose_frames:
            raise HTTPException(status_code=400, detail="未检测到有效姿态")
        
        # 找到最接近的姿态帧
        closest_frame = min(
            pose_frames,
            key=lambda frame: abs(frame.timestamp - timestamp)
        )
        
        time_diff = abs(closest_frame.timestamp - timestamp)
        
        return {
            "video_id": video_id,
            "requested_timestamp": timestamp,
            "actual_timestamp": closest_frame.timestamp,
            "time_difference": time_diff,
            "pose_frame": closest_frame
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"获取时间点姿态失败: {e}")
        raise HTTPException(status_code=500, detail="获取时间点姿态失败")


@router.get("/{video_id}/keypoints/stability")
async def analyze_keypoint_stability(video_id: str):
    """分析关键点稳定性"""
    
    try:
        # 提取帧
        frame_paths = video_processor.extract_frames(video_id)
        
        # 检测姿态
        pose_frames = await pose_detector.detect_poses_from_video(video_id, frame_paths)
        
        if not pose_frames:
            raise HTTPException(status_code=400, detail="未检测到有效姿态")
        
        # 分析稳定性
        stability_analysis = pose_detector._analyze_keypoint_stability(pose_frames)
        
        # 计算整体稳定性得分
        overall_stability = sum(stability_analysis.values()) / len(stability_analysis) if stability_analysis else 0
        
        # 找出最稳定和最不稳定的关键点
        if stability_analysis:
            most_stable = max(stability_analysis.items(), key=lambda x: x[1])
            least_stable = min(stability_analysis.items(), key=lambda x: x[1])
        else:
            most_stable = least_stable = None
        
        return {
            "video_id": video_id,
            "overall_stability": overall_stability,
            "keypoint_stability": stability_analysis,
            "most_stable_keypoint": most_stable,
            "least_stable_keypoint": least_stable,
            "total_frames": len(pose_frames)
        }
        
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail="视频不存在")
    except Exception as e:
        logger.error(f"关键点稳定性分析失败: {e}")
        raise HTTPException(status_code=500, detail="关键点稳定性分析失败")
