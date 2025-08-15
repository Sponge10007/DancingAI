#!/usr/bin/env python3
"""
开发环境启动脚本
"""

import os
import sys
import subprocess
import argparse
from pathlib import Path

# 添加项目根目录到Python路径
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))


def check_dependencies():
    """检查依赖是否安装"""
    try:
        import fastapi
        import uvicorn
        import cv2
        import librosa
        import numpy
        print("✓ 所有依赖已安装")
        return True
    except ImportError as e:
        print(f"✗ 缺少依赖: {e}")
        print("请运行: pip install -r backend/requirements.txt")
        return False


def check_environment():
    """检查环境配置"""
    env_file = project_root / "backend" / ".env"
    
    if not env_file.exists():
        print("✗ 未找到 .env 文件")
        print("请复制 .env.example 到 .env 并配置GLM API密钥")
        return False
    
    # 检查GLM API密钥
    with open(env_file, 'r', encoding='utf-8') as f:
        content = f.read()
        if "GLM_API_KEY=your_glm_api_key_here" in content or "GLM_API_KEY=" not in content:
            print("⚠ GLM API密钥未配置，某些功能可能无法使用")
        else:
            print("✓ GLM API密钥已配置")
    
    return True


def create_directories():
    """创建必要的目录"""
    dirs = [
        project_root / "uploads",
        project_root / "uploads" / "videos",
        project_root / "uploads" / "frames", 
        project_root / "uploads" / "audio",
        project_root / "uploads" / "temp"
    ]
    
    for dir_path in dirs:
        dir_path.mkdir(exist_ok=True)
    
    print("✓ 目录结构已创建")


def run_tests():
    """运行测试"""
    print("运行测试...")
    
    test_files = [
        project_root / "tests" / "test_video_processing.py",
        project_root / "tests" / "test_beat_detection.py"
    ]
    
    for test_file in test_files:
        if test_file.exists():
            print(f"运行 {test_file.name}...")
            try:
                result = subprocess.run([
                    sys.executable, str(test_file)
                ], capture_output=True, text=True, cwd=project_root)
                
                if result.returncode == 0:
                    print(f"✓ {test_file.name} 通过")
                else:
                    print(f"✗ {test_file.name} 失败:")
                    print(result.stdout)
                    print(result.stderr)
            except Exception as e:
                print(f"✗ 运行 {test_file.name} 时出错: {e}")


def start_backend(port=8000, reload=True):
    """启动后端服务"""
    print(f"启动后端服务 (端口: {port})...")
    
    backend_dir = project_root / "backend"
    
    cmd = [
        sys.executable, "-m", "uvicorn",
        "main:app",
        "--host", "0.0.0.0",
        "--port", str(port)
    ]
    
    if reload:
        cmd.append("--reload")
    
    try:
        subprocess.run(cmd, cwd=backend_dir)
    except KeyboardInterrupt:
        print("\n后端服务已停止")


def start_frontend(port=3000):
    """启动前端服务"""
    print(f"启动前端服务 (端口: {port})...")

    frontend_dir = project_root / "frontend"

    if not frontend_dir.exists():
        print("✗ 前端目录不存在")
        return False

    if not (frontend_dir / "node_modules").exists():
        print("安装前端依赖...")
        try:
            subprocess.run(["npm", "install"], cwd=frontend_dir, check=True)
        except subprocess.CalledProcessError:
            print("✗ 前端依赖安装失败")
            return False

    try:
        env = os.environ.copy()
        env["PORT"] = str(port)
        env["REACT_APP_API_URL"] = "http://localhost:8000"
        subprocess.run(["npm", "start"], cwd=frontend_dir, env=env)
    except KeyboardInterrupt:
        print("\n前端服务已停止")
    except FileNotFoundError:
        print("✗ npm 未找到，请确保已安装 Node.js")
        return False

    return True


def main():
    parser = argparse.ArgumentParser(description="舞蹈视频分析系统开发工具")
    parser.add_argument("command", choices=["check", "test", "backend", "frontend", "full"], 
                       help="要执行的命令")
    parser.add_argument("--port", type=int, default=8000, help="后端端口号")
    parser.add_argument("--no-reload", action="store_true", help="禁用自动重载")
    
    args = parser.parse_args()
    
    if args.command == "check":
        print("检查开发环境...")
        if check_dependencies() and check_environment():
            create_directories()
            print("✓ 开发环境检查完成")
        else:
            print("✗ 开发环境检查失败")
            sys.exit(1)
    
    elif args.command == "test":
        if not check_dependencies():
            sys.exit(1)
        run_tests()
    
    elif args.command == "backend":
        if not check_dependencies() or not check_environment():
            sys.exit(1)
        create_directories()
        start_backend(args.port, not args.no_reload)
    
    elif args.command == "frontend":
        if not start_frontend():
            sys.exit(1)

    elif args.command == "full":
        if not check_dependencies() or not check_environment():
            sys.exit(1)
        create_directories()
        print("🚀 启动完整系统")
        print("请在不同终端中分别运行:")
        print(f"  python scripts/start_dev.py backend --port {args.port}")
        print("  python scripts/start_dev.py frontend")
        print("")
        print("或者使用以下命令同时启动（需要额外终端）:")
        print("  # 终端1: 启动后端")
        print(f"  python scripts/start_dev.py backend --port {args.port}")
        print("  # 终端2: 启动前端")
        print("  python scripts/start_dev.py frontend")


if __name__ == "__main__":
    main()
