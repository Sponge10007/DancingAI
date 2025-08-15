#!/bin/bash

# ===================================
# 舞蹈视频分析系统 - 安装验证脚本
# ===================================

set -e

echo "🔍 验证项目设置..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

ERRORS=0

# 检查函数
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓ $1 存在${NC}"
    else
        echo -e "${RED}✗ $1 不存在${NC}"
        ((ERRORS++))
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓ $1/ 目录存在${NC}"
    else
        echo -e "${RED}✗ $1/ 目录不存在${NC}"
        ((ERRORS++))
    fi
}

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓ $1 已安装${NC}"
    else
        echo -e "${RED}✗ $1 未安装${NC}"
        ((ERRORS++))
    fi
}

echo -e "\n${BLUE}1. 检查必要工具...${NC}"
check_command "python3"
check_command "node"
check_command "npm"
check_command "git"

echo -e "\n${BLUE}2. 检查项目文件...${NC}"
check_file "setup.sh"
check_file "start_dev.sh"
check_file "stop_dev.sh"
check_file "backend/requirements.txt"
check_file "backend/.env.example"
check_file "backend/main.py"
check_file "frontend/package.json"
check_file "frontend/src/App.js"
check_file "README.md"

echo -e "\n${BLUE}3. 检查目录结构...${NC}"
check_dir "backend"
check_dir "frontend"
check_dir "uploads"
check_dir "uploads/videos"
check_dir "uploads/audio"
check_dir "uploads/frames"
check_dir "uploads/temp"
check_dir "backend/uploads"
check_dir "backend/uploads/videos"
check_dir "backend/uploads/audio"
check_dir "backend/uploads/frames"
check_dir "backend/uploads/temp"
check_dir "logs"

echo -e "\n${BLUE}4. 检查Python环境...${NC}"
if [ -d "venv" ]; then
    echo -e "${GREEN}✓ Python虚拟环境存在${NC}"
    
    # 激活虚拟环境并检查依赖
    source venv/bin/activate
    
    echo -e "${BLUE}检查Python依赖...${NC}"
    PYTHON_DEPS=("fastapi" "uvicorn" "opencv-python" "librosa" "mediapipe")
    
    for dep in "${PYTHON_DEPS[@]}"; do
        if python -c "import $dep" 2>/dev/null; then
            echo -e "${GREEN}✓ $dep 已安装${NC}"
        else
            echo -e "${YELLOW}⚠ $dep 未安装或有问题${NC}"
        fi
    done
    
    deactivate
else
    echo -e "${YELLOW}⚠ Python虚拟环境不存在，请运行 ./setup.sh${NC}"
fi

echo -e "\n${BLUE}5. 检查Node.js环境...${NC}"
if [ -d "frontend/node_modules" ]; then
    echo -e "${GREEN}✓ Node.js依赖已安装${NC}"
else
    echo -e "${YELLOW}⚠ Node.js依赖未安装，请运行 ./setup.sh${NC}"
fi

echo -e "\n${BLUE}6. 检查配置文件...${NC}"
if [ -f "backend/.env" ]; then
    echo -e "${GREEN}✓ 环境配置文件存在${NC}"
    
    # 检查API密钥是否配置
    if grep -q "GLM_API_KEY=your_glm_api_key_here" backend/.env; then
        echo -e "${YELLOW}⚠ 请配置GLM_API_KEY${NC}"
    elif grep -q "GLM_API_KEY=" backend/.env; then
        echo -e "${GREEN}✓ GLM_API_KEY已配置${NC}"
    else
        echo -e "${RED}✗ GLM_API_KEY配置有问题${NC}"
        ((ERRORS++))
    fi
else
    echo -e "${YELLOW}⚠ 环境配置文件不存在，请复制 backend/.env.example 到 backend/.env${NC}"
fi

echo -e "\n${BLUE}7. 检查端口占用...${NC}"
if lsof -Pi :8000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠ 端口8000已被占用${NC}"
else
    echo -e "${GREEN}✓ 端口8000可用${NC}"
fi

if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null 2>&1; then
    echo -e "${YELLOW}⚠ 端口3000已被占用${NC}"
else
    echo -e "${GREEN}✓ 端口3000可用${NC}"
fi

# 总结
echo -e "\n${BLUE}=== 验证结果 ===${NC}"
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}🎉 项目设置验证通过！${NC}"
    echo -e "${GREEN}可以运行 ./start_dev.sh 启动开发环境${NC}"
else
    echo -e "${RED}❌ 发现 $ERRORS 个问题${NC}"
    echo -e "${YELLOW}请先解决上述问题，或运行 ./setup.sh 重新安装${NC}"
fi

echo -e "\n${BLUE}📋 下一步操作:${NC}"
echo -e "1. 确保配置了 backend/.env 文件中的API密钥"
echo -e "2. 运行 ${YELLOW}./start_dev.sh${NC} 启动开发环境"
echo -e "3. 访问 ${YELLOW}http://localhost:3000${NC} 查看前端"
echo -e "4. 访问 ${YELLOW}http://localhost:8000/docs${NC} 查看API文档"
