import librosa
import numpy as np
from typing import List, Tuple, Dict, Any, Optional
import logging
from pathlib import Path

from ..core.config import settings
from ..models.schemas import BeatInfo

logger = logging.getLogger(__name__)


class BeatDetector:
    """节拍检测器"""
    
    def __init__(self):
        self.sample_rate = settings.AUDIO_SAMPLE_RATE
        self.bpm_min = settings.BPM_MIN
        self.bpm_max = settings.BPM_MAX
    
    def detect_beats_from_audio_file(self, audio_path: str) -> Tuple[List[BeatInfo], float]:
        """从音频文件检测节拍"""
        
        if not Path(audio_path).exists():
            raise FileNotFoundError(f"音频文件不存在: {audio_path}")
        
        try:
            # 加载音频文件
            y, sr = librosa.load(audio_path, sr=self.sample_rate)
            
            return self.detect_beats_from_audio_data(y, sr)
            
        except Exception as e:
            logger.error(f"从音频文件检测节拍失败: {e}")
            raise
    
    def detect_beats_from_audio_data(self, audio_data: np.ndarray, sample_rate: int) -> Tuple[List[BeatInfo], float]:
        """从音频数据检测节拍"""
        
        try:
            # 1. 估算整体BPM
            tempo, beats = librosa.beat.beat_track(
                y=audio_data,
                sr=sample_rate,
                start_bpm=120,
                units='time'
            )
            
            logger.info(f"检测到BPM: {tempo:.1f}, 节拍数: {len(beats)}")
            
            # 2. 创建节拍信息列表
            beat_infos = []
            for i, beat_time in enumerate(beats):
                # 计算每个节拍的置信度（基于能量）
                confidence = self._calculate_beat_confidence(
                    audio_data, sample_rate, beat_time
                )
                
                beat_info = BeatInfo(
                    timestamp=float(beat_time),
                    beat_number=i + 1,
                    confidence=confidence,
                    tempo=tempo
                )
                beat_infos.append(beat_info)
            
            # 3. 动态BPM分析（可选）
            if len(beats) > 4:
                beat_infos = self._analyze_dynamic_tempo(beat_infos, audio_data, sample_rate)
            
            return beat_infos, float(tempo)
            
        except Exception as e:
            logger.error(f"节拍检测失败: {e}")
            raise
    
    def _calculate_beat_confidence(self, audio_data: np.ndarray, sample_rate: int, beat_time: float) -> float:
        """计算节拍置信度"""
        
        try:
            # 获取节拍时间点附近的音频片段
            start_sample = max(0, int((beat_time - 0.05) * sample_rate))
            end_sample = min(len(audio_data), int((beat_time + 0.05) * sample_rate))
            
            if start_sample >= end_sample:
                return 0.5
            
            segment = audio_data[start_sample:end_sample]
            
            # 计算能量
            energy = np.sum(segment ** 2)
            
            # 计算频谱质心
            stft = librosa.stft(segment)
            spectral_centroids = librosa.feature.spectral_centroid(S=np.abs(stft))
            centroid_mean = np.mean(spectral_centroids)
            
            # 基于能量和频谱特征计算置信度
            confidence = min(1.0, energy * 1000 + centroid_mean / 10000)
            
            return max(0.1, confidence)
            
        except Exception:
            return 0.5
    
    def _analyze_dynamic_tempo(self, beat_infos: List[BeatInfo], audio_data: np.ndarray, sample_rate: int) -> List[BeatInfo]:
        """分析动态节拍变化"""
        
        try:
            # 计算相邻节拍间的时间间隔
            intervals = []
            for i in range(1, len(beat_infos)):
                interval = beat_infos[i].timestamp - beat_infos[i-1].timestamp
                intervals.append(interval)
            
            if not intervals:
                return beat_infos
            
            # 使用滑动窗口分析局部BPM变化
            window_size = min(8, len(intervals))
            
            for i in range(len(beat_infos)):
                # 计算当前位置的局部BPM
                start_idx = max(0, i - window_size // 2)
                end_idx = min(len(intervals), start_idx + window_size)
                
                if start_idx < end_idx:
                    local_intervals = intervals[start_idx:end_idx]
                    avg_interval = np.mean(local_intervals)
                    local_bpm = 60.0 / avg_interval if avg_interval > 0 else beat_infos[i].tempo
                    
                    # 更新局部BPM
                    beat_infos[i].tempo = local_bpm
            
            return beat_infos
            
        except Exception as e:
            logger.warning(f"动态节拍分析失败: {e}")
            return beat_infos
    
    def get_beat_grid(self, beat_infos: List[BeatInfo], grid_resolution: float = 0.25) -> List[float]:
        """生成节拍网格（用于可视化）"""
        
        if not beat_infos:
            return []
        
        # 计算平均节拍间隔
        if len(beat_infos) > 1:
            intervals = [
                beat_infos[i].timestamp - beat_infos[i-1].timestamp
                for i in range(1, len(beat_infos))
            ]
            avg_interval = np.mean(intervals)
        else:
            avg_interval = 60.0 / beat_infos[0].tempo
        
        # 生成网格
        grid = []
        start_time = beat_infos[0].timestamp
        end_time = beat_infos[-1].timestamp
        
        current_time = start_time
        while current_time <= end_time:
            grid.append(current_time)
            current_time += avg_interval * grid_resolution
        
        return grid
    
    def analyze_rhythm_pattern(self, beat_infos: List[BeatInfo]) -> Dict[str, Any]:
        """分析节奏模式"""
        
        if len(beat_infos) < 4:
            return {"pattern": "unknown", "confidence": 0.0}
        
        try:
            # 计算节拍间隔
            intervals = [
                beat_infos[i].timestamp - beat_infos[i-1].timestamp
                for i in range(1, len(beat_infos))
            ]
            
            # 分析间隔的稳定性
            interval_std = np.std(intervals)
            interval_mean = np.mean(intervals)
            stability = 1.0 - min(1.0, interval_std / interval_mean)
            
            # 检测常见节拍模式
            pattern = "steady"
            if interval_std / interval_mean > 0.1:
                pattern = "variable"
            elif interval_mean < 0.4:  # 快节拍
                pattern = "fast"
            elif interval_mean > 1.0:   # 慢节拍
                pattern = "slow"
            
            # 分析强弱拍模式
            strong_beats = self._detect_strong_beats(beat_infos)
            
            return {
                "pattern": pattern,
                "stability": stability,
                "average_interval": interval_mean,
                "interval_std": interval_std,
                "strong_beats": strong_beats,
                "confidence": stability
            }
            
        except Exception as e:
            logger.error(f"节奏模式分析失败: {e}")
            return {"pattern": "unknown", "confidence": 0.0}
    
    def _detect_strong_beats(self, beat_infos: List[BeatInfo]) -> List[int]:
        """检测强拍位置"""
        
        # 基于置信度检测强拍
        confidences = [beat.confidence for beat in beat_infos]
        threshold = np.mean(confidences) + np.std(confidences) * 0.5
        
        strong_beats = []
        for i, beat in enumerate(beat_infos):
            if beat.confidence > threshold:
                strong_beats.append(i)
        
        return strong_beats
    
    def get_beat_at_time(self, beat_infos: List[BeatInfo], timestamp: float) -> Optional[BeatInfo]:
        """获取指定时间点最近的节拍"""
        
        if not beat_infos:
            return None
        
        # 找到最接近的节拍
        closest_beat = min(
            beat_infos,
            key=lambda beat: abs(beat.timestamp - timestamp)
        )
        
        # 如果时间差太大，返回None
        if abs(closest_beat.timestamp - timestamp) > 1.0:
            return None
        
        return closest_beat


# 创建全局服务实例
beat_detector = BeatDetector()
