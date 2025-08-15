import pytest
import numpy as np
import tempfile
import os
from pathlib import Path
import librosa

from backend.app.services.beat_detection import BeatDetector
from backend.app.core.config import settings


class TestBeatDetector:
    """节拍检测器测试"""
    
    @pytest.fixture
    def beat_detector(self):
        """创建节拍检测器实例"""
        return BeatDetector()
    
    @pytest.fixture
    def sample_audio_data(self):
        """创建示例音频数据"""
        # 生成一个简单的节拍音频（120 BPM）
        duration = 4.0  # 4秒
        sample_rate = 22050
        t = np.linspace(0, duration, int(duration * sample_rate))
        
        # 创建120 BPM的节拍（每0.5秒一拍）
        beat_times = np.arange(0, duration, 0.5)
        audio = np.zeros_like(t)
        
        for beat_time in beat_times:
            # 在每个节拍时间点添加一个短促的音调
            beat_start = int(beat_time * sample_rate)
            beat_end = min(len(audio), beat_start + int(0.1 * sample_rate))
            
            if beat_start < len(audio):
                # 添加440Hz的音调
                beat_t = np.linspace(0, 0.1, beat_end - beat_start)
                beat_signal = np.sin(2 * np.pi * 440 * beat_t) * np.exp(-beat_t * 10)
                audio[beat_start:beat_end] = beat_signal
        
        return audio, sample_rate
    
    @pytest.fixture
    def sample_audio_file(self, sample_audio_data):
        """创建示例音频文件"""
        audio_data, sample_rate = sample_audio_data
        
        # 创建临时文件
        temp_file = tempfile.NamedTemporaryFile(suffix='.wav', delete=False)
        temp_file.close()
        
        # 保存音频
        librosa.output.write_wav(temp_file.name, audio_data, sample_rate)
        
        yield temp_file.name
        
        # 清理
        if os.path.exists(temp_file.name):
            os.unlink(temp_file.name)
    
    def test_detect_beats_from_audio_data(self, beat_detector, sample_audio_data):
        """测试从音频数据检测节拍"""
        audio_data, sample_rate = sample_audio_data
        
        beat_infos, average_bpm = beat_detector.detect_beats_from_audio_data(audio_data, sample_rate)
        
        # 验证结果
        assert len(beat_infos) > 0
        assert 100 <= average_bpm <= 140  # 应该接近120 BPM
        
        # 验证节拍信息结构
        for beat in beat_infos:
            assert beat.timestamp >= 0
            assert beat.beat_number > 0
            assert 0 <= beat.confidence <= 1
            assert beat.tempo > 0
    
    def test_detect_beats_from_audio_file(self, beat_detector, sample_audio_file):
        """测试从音频文件检测节拍"""
        beat_infos, average_bpm = beat_detector.detect_beats_from_audio_file(sample_audio_file)
        
        assert len(beat_infos) > 0
        assert average_bpm > 0
    
    def test_get_beat_grid(self, beat_detector, sample_audio_data):
        """测试节拍网格生成"""
        audio_data, sample_rate = sample_audio_data
        
        beat_infos, _ = beat_detector.detect_beats_from_audio_data(audio_data, sample_rate)
        grid = beat_detector.get_beat_grid(beat_infos, grid_resolution=0.25)
        
        assert len(grid) > 0
        assert all(isinstance(t, float) for t in grid)
        assert grid == sorted(grid)  # 应该是排序的
    
    def test_analyze_rhythm_pattern(self, beat_detector, sample_audio_data):
        """测试节奏模式分析"""
        audio_data, sample_rate = sample_audio_data
        
        beat_infos, _ = beat_detector.detect_beats_from_audio_data(audio_data, sample_rate)
        
        if len(beat_infos) >= 4:
            pattern = beat_detector.analyze_rhythm_pattern(beat_infos)
            
            assert "pattern" in pattern
            assert "confidence" in pattern
            assert "stability" in pattern
            assert 0 <= pattern["confidence"] <= 1
    
    def test_get_beat_at_time(self, beat_detector, sample_audio_data):
        """测试获取指定时间的节拍"""
        audio_data, sample_rate = sample_audio_data
        
        beat_infos, _ = beat_detector.detect_beats_from_audio_data(audio_data, sample_rate)
        
        if beat_infos:
            # 测试获取第一个节拍附近的时间点
            target_time = beat_infos[0].timestamp + 0.1
            beat_at_time = beat_detector.get_beat_at_time(beat_infos, target_time)
            
            assert beat_at_time is not None
            assert abs(beat_at_time.timestamp - beat_infos[0].timestamp) < 1.0
    
    def test_calculate_beat_confidence(self, beat_detector, sample_audio_data):
        """测试节拍置信度计算"""
        audio_data, sample_rate = sample_audio_data
        
        # 测试在有音频信号的时间点
        confidence = beat_detector._calculate_beat_confidence(audio_data, sample_rate, 0.5)
        
        assert 0 <= confidence <= 1
    
    def test_file_not_found_error(self, beat_detector):
        """测试文件不存在的错误处理"""
        with pytest.raises(FileNotFoundError):
            beat_detector.detect_beats_from_audio_file("nonexistent_file.wav")


if __name__ == "__main__":
    # 运行简单测试
    detector = BeatDetector()
    
    # 创建测试音频
    duration = 2.0
    sample_rate = 22050
    t = np.linspace(0, duration, int(duration * sample_rate))
    
    # 简单的节拍音频
    audio = np.sin(2 * np.pi * 440 * t) * (np.sin(2 * np.pi * 2 * t) > 0)
    
    try:
        beat_infos, bpm = detector.detect_beats_from_audio_data(audio, sample_rate)
        print(f"检测到 {len(beat_infos)} 个节拍")
        print(f"平均BPM: {bpm:.1f}")
        
        if beat_infos:
            print(f"第一个节拍时间: {beat_infos[0].timestamp:.3f}s")
            print(f"第一个节拍置信度: {beat_infos[0].confidence:.3f}")
        
        print("节拍检测功能测试通过！")
        
    except Exception as e:
        print(f"测试失败: {e}")
