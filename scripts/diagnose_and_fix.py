#!/usr/bin/env python3
"""
问题诊断和修复脚本
"""

import os
import sys
import subprocess
import requests
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))


def check_glm_api_key():
    """检查GLM API密钥配置"""
    env_file = project_root / "backend" / ".env"
    
    if not env_file.exists():
        print("❌ .env文件不存在")
        return False
    
    with open(env_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    if "GLM_API_KEY=your_glm_api_key_here" in content:
        print("❌ GLM API密钥未配置")
        print("请编辑 backend/.env 文件，将 GLM_API_KEY 设置为你的实际API密钥")
        print("获取API密钥: https://open.bigmodel.cn/")
        return False
    elif "GLM_API_KEY=" not in content:
        print("❌ GLM API密钥配置缺失")
        return False
    else:
        print("✅ GLM API密钥已配置")
        return True


def test_backend_connection():
    """测试后端连接"""
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            print("✅ 后端服务运行正常")
            data = response.json()
            print(f"   应用名称: {data.get('app_name')}")
            print(f"   版本: {data.get('version')}")
            return True
        else:
            print(f"❌ 后端服务响应异常: {response.status_code}")
            return False
    except requests.exceptions.ConnectionError:
        print("❌ 无法连接到后端服务 (http://localhost:8000)")
        print("请确保后端服务正在运行: python scripts/start_dev.py backend")
        return False
    except Exception as e:
        print(f"❌ 连接测试失败: {e}")
        return False


def test_api_endpoints():
    """测试API端点"""
    base_url = "http://localhost:8000"
    
    endpoints = [
        "/",
        "/health",
        "/docs",
        "/api/v1/videos/upload",  # 这个会返回405 Method Not Allowed，但说明端点存在
    ]
    
    print("\n🔍 测试API端点:")
    for endpoint in endpoints:
        try:
            response = requests.get(f"{base_url}{endpoint}", timeout=5)
            if response.status_code in [200, 405, 422]:  # 405和422是预期的
                print(f"✅ {endpoint} - 状态码: {response.status_code}")
            else:
                print(f"⚠️  {endpoint} - 状态码: {response.status_code}")
        except Exception as e:
            print(f"❌ {endpoint} - 错误: {e}")


def check_dependencies():
    """检查关键依赖"""
    print("\n🔍 检查关键依赖:")
    
    dependencies = [
        ("fastapi", "FastAPI Web框架"),
        ("uvicorn", "ASGI服务器"),
        ("cv2", "OpenCV计算机视觉"),
        ("librosa", "音频处理"),
        ("mediapipe", "姿态检测"),
        ("numpy", "数值计算"),
        ("httpx", "HTTP客户端")
    ]
    
    for module, description in dependencies:
        try:
            if module == "cv2":
                import cv2
            else:
                __import__(module)
            print(f"✅ {module} - {description}")
        except ImportError:
            print(f"❌ {module} - {description} (未安装)")


def check_file_structure():
    """检查文件结构"""
    print("\n🔍 检查项目文件结构:")
    
    required_files = [
        "backend/main.py",
        "backend/requirements.txt",
        "backend/.env",
        "backend/app/core/config.py",
        "backend/app/services/video_service.py",
        "backend/app/services/beat_detection.py",
        "backend/app/services/pose_detection.py",
        "backend/app/api/v1/api.py",
        "scripts/start_dev.py"
    ]
    
    for file_path in required_files:
        full_path = project_root / file_path
        if full_path.exists():
            print(f"✅ {file_path}")
        else:
            print(f"❌ {file_path} (缺失)")


def check_directories():
    """检查必要目录"""
    print("\n🔍 检查必要目录:")
    
    required_dirs = [
        "uploads",
        "uploads/videos",
        "uploads/frames",
        "uploads/audio",
        "uploads/temp"
    ]
    
    for dir_path in required_dirs:
        full_path = project_root / dir_path
        if full_path.exists():
            print(f"✅ {dir_path}")
        else:
            print(f"❌ {dir_path} (缺失)")
            # 自动创建目录
            full_path.mkdir(parents=True, exist_ok=True)
            print(f"   已创建目录: {dir_path}")


def test_video_processing():
    """测试视频处理功能"""
    print("\n🔍 测试视频处理功能:")
    
    try:
        from backend.app.services.video_service import video_processor
        
        # 测试基本功能
        import numpy as np
        test_frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
        
        resized = video_processor.resize_frame(test_frame, 320, 240)
        if resized.shape == (240, 320, 3):
            print("✅ 帧大小调整功能正常")
        else:
            print("❌ 帧大小调整功能异常")
        
        normalized = video_processor.normalize_frame(test_frame)
        if normalized.dtype == np.float32 and 0 <= normalized.min() <= normalized.max() <= 1:
            print("✅ 帧标准化功能正常")
        else:
            print("❌ 帧标准化功能异常")
            
    except Exception as e:
        print(f"❌ 视频处理功能测试失败: {e}")


def test_beat_detection():
    """测试节拍检测功能"""
    print("\n🔍 测试节拍检测功能:")
    
    try:
        from backend.app.services.beat_detection import beat_detector
        
        # 创建测试音频数据
        import numpy as np
        duration = 2.0
        sample_rate = 22050
        t = np.linspace(0, duration, int(duration * sample_rate))
        audio = np.sin(2 * np.pi * 440 * t) * (np.sin(2 * np.pi * 2 * t) > 0)
        
        beat_infos, bpm = beat_detector.detect_beats_from_audio_data(audio, sample_rate)
        
        if len(beat_infos) > 0 and bpm > 0:
            print(f"✅ 节拍检测功能正常 (检测到 {len(beat_infos)} 个节拍, BPM: {bpm:.1f})")
        else:
            print("❌ 节拍检测功能异常")
            
    except Exception as e:
        print(f"❌ 节拍检测功能测试失败: {e}")


def test_pose_detection():
    """测试姿态检测功能"""
    print("\n🔍 测试姿态检测功能:")
    
    try:
        from backend.app.services.pose_detection import pose_detector
        
        # 创建测试图像
        import numpy as np
        test_frame = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
        
        result = pose_detector.detect_pose_from_frame(test_frame, 0.0, 0)
        print("✅ 姿态检测功能可以正常调用")
        
    except Exception as e:
        print(f"❌ 姿态检测功能测试失败: {e}")


def main():
    print("🔍 舞蹈视频分析系统 - 问题诊断")
    print("=" * 50)
    
    # 检查文件结构
    check_file_structure()
    
    # 检查目录
    check_directories()
    
    # 检查依赖
    check_dependencies()
    
    # 检查GLM API密钥
    check_glm_api_key()
    
    # 测试后端连接
    test_backend_connection()
    
    # 测试API端点
    test_api_endpoints()
    
    # 测试核心功能
    test_video_processing()
    test_beat_detection()
    test_pose_detection()
    
    print("\n" + "=" * 50)
    print("🎯 诊断完成！")
    print("\n📋 下一步建议:")
    print("1. 如果GLM API密钥未配置，请编辑 backend/.env 文件")
    print("2. 如果后端服务未运行，请执行: python scripts/start_dev.py backend")
    print("3. 访问 http://localhost:8000/docs 查看API文档")
    print("4. 使用 http://localhost:8000/health 检查服务状态")


if __name__ == "__main__":
    main()
