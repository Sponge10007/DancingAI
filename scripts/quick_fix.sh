#!/bin/bash

# 舞蹈视频分析系统 - 快速修复脚本

echo "🔧 舞蹈视频分析系统 - 快速修复"
echo "=================================="

# 检查是否在项目根目录
if [ ! -f "backend/main.py" ]; then
    echo "❌ 请在项目根目录运行此脚本"
    exit 1
fi

# 1. 检查GLM API密钥配置
echo "🔍 检查GLM API密钥配置..."
if grep -q "GLM_API_KEY=your_glm_api_key_here" backend/.env; then
    echo "⚠️  GLM API密钥未配置"
    echo "📝 请手动编辑 backend/.env 文件："
    echo "   1. 访问 https://open.bigmodel.cn/ 获取API密钥"
    echo "   2. 将 GLM_API_KEY=your_glm_api_key_here 改为实际密钥"
    echo ""
    read -p "是否现在配置API密钥？(y/n): " configure_api
    if [ "$configure_api" = "y" ] || [ "$configure_api" = "Y" ]; then
        read -p "请输入你的GLM API密钥: " api_key
        if [ ! -z "$api_key" ]; then
            sed -i "s/GLM_API_KEY=your_glm_api_key_here/GLM_API_KEY=$api_key/" backend/.env
            echo "✅ API密钥已配置"
        fi
    fi
else
    echo "✅ GLM API密钥已配置"
fi

# 2. 检查conda环境
echo ""
echo "🔍 检查conda环境..."
if command -v conda &> /dev/null; then
    echo "✅ conda已安装"
    
    # 检查是否在base环境中
    if [[ "$CONDA_DEFAULT_ENV" == "base" ]]; then
        echo "✅ 当前在conda base环境中"
    else
        echo "⚠️  当前不在conda base环境中"
        echo "请运行: conda activate base"
    fi
else
    echo "❌ conda未安装或未在PATH中"
fi

# 3. 检查依赖
echo ""
echo "🔍 检查Python依赖..."
python -c "
import sys
try:
    import fastapi, uvicorn, cv2, librosa, mediapipe
    print('✅ 所有依赖都已安装')
except ImportError as e:
    print(f'❌ 缺少依赖: {e}')
    print('请运行: pip install -r backend/requirements.txt')
    sys.exit(1)
"

# 4. 创建必要目录
echo ""
echo "🔍 创建必要目录..."
mkdir -p uploads/{videos,frames,audio,temp}
echo "✅ 目录结构已创建"

# 5. 检查端口占用
echo ""
echo "🔍 检查端口8000占用情况..."
if lsof -i :8000 &> /dev/null; then
    echo "⚠️  端口8000已被占用"
    echo "当前占用进程:"
    lsof -i :8000
    echo ""
    read -p "是否终止占用进程？(y/n): " kill_process
    if [ "$kill_process" = "y" ] || [ "$kill_process" = "Y" ]; then
        lsof -ti :8000 | xargs kill -9
        echo "✅ 已终止占用进程"
    fi
else
    echo "✅ 端口8000可用"
fi

# 6. 提供启动命令
echo ""
echo "🚀 系统修复完成！"
echo "=================================="
echo ""
echo "📋 下一步操作："
echo "1. 确保在conda环境中:"
echo "   conda activate base"
echo ""
echo "2. 启动后端服务:"
echo "   python scripts/start_dev.py backend"
echo ""
echo "3. 在新终端中测试服务:"
echo "   curl http://localhost:8000/health"
echo ""
echo "4. 访问API文档:"
echo "   http://localhost:8000/docs"
echo ""
echo "5. 运行完整测试:"
echo "   python scripts/diagnose_and_fix.py"

# 7. 询问是否立即启动服务
echo ""
read -p "是否现在启动后端服务？(y/n): " start_service
if [ "$start_service" = "y" ] || [ "$start_service" = "Y" ]; then
    echo "🚀 启动后端服务..."
    python scripts/start_dev.py backend
fi
