#!/bin/bash

# ===================================
# 舞蹈视频分析系统 - 项目设置脚本
# ===================================

set -e  # 遇到错误时退出

echo "🚀 开始设置舞蹈视频分析系统..."

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 检查操作系统
OS="$(uname -s)"
case "${OS}" in
    Linux*)     MACHINE=Linux;;
    Darwin*)    MACHINE=Mac;;
    CYGWIN*)    MACHINE=Cygwin;;
    MINGW*)     MACHINE=MinGw;;
    *)          MACHINE="UNKNOWN:${OS}"
esac

echo -e "${BLUE}检测到操作系统: ${MACHINE}${NC}"

# 1. 检查必要的工具
echo -e "\n${YELLOW}📋 检查必要工具...${NC}"

check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✓ $1 已安装${NC}"
        return 0
    else
        echo -e "${RED}✗ $1 未安装${NC}"
        return 1
    fi
}

MISSING_TOOLS=()

if ! check_command "python3"; then
    MISSING_TOOLS+=("python3")
fi

if ! check_command "node"; then
    MISSING_TOOLS+=("node")
fi

if ! check_command "npm"; then
    MISSING_TOOLS+=("npm")
fi

if ! check_command "git"; then
    MISSING_TOOLS+=("git")
fi

if [ ${#MISSING_TOOLS[@]} -ne 0 ]; then
    echo -e "\n${RED}❌ 缺少必要工具: ${MISSING_TOOLS[*]}${NC}"
    echo -e "${YELLOW}请先安装这些工具后再运行此脚本${NC}"
    exit 1
fi

# 2. 创建Python虚拟环境
echo -e "\n${YELLOW}🐍 设置Python环境...${NC}"

if [ ! -d "venv" ]; then
    echo "创建Python虚拟环境..."
    python3 -m venv venv
    echo -e "${GREEN}✓ 虚拟环境创建成功${NC}"
else
    echo -e "${GREEN}✓ 虚拟环境已存在${NC}"
fi

# 激活虚拟环境
source venv/bin/activate
echo -e "${GREEN}✓ 虚拟环境已激活${NC}"

# 3. 安装Python依赖
echo -e "\n${YELLOW}📦 安装Python依赖...${NC}"
cd backend
pip install --upgrade pip
pip install -r requirements.txt
echo -e "${GREEN}✓ Python依赖安装完成${NC}"
cd ..

# 4. 安装Node.js依赖
echo -e "\n${YELLOW}📦 安装Node.js依赖...${NC}"
cd frontend
npm install
echo -e "${GREEN}✓ Node.js依赖安装完成${NC}"
cd ..

# 5. 创建必要目录
echo -e "\n${YELLOW}📁 创建必要目录...${NC}"
mkdir -p uploads/{videos,frames,audio,temp}
mkdir -p backend/uploads/{videos,frames,audio,temp}
mkdir -p logs
echo -e "${GREEN}✓ 目录结构创建完成${NC}"

# 6. 配置环境变量
echo -e "\n${YELLOW}⚙️  配置环境变量...${NC}"

if [ ! -f "backend/.env" ]; then
    cp backend/.env.example backend/.env
    echo -e "${GREEN}✓ 环境配置文件已创建${NC}"
    echo -e "${YELLOW}⚠️  请编辑 backend/.env 文件，配置你的API密钥${NC}"
    echo -e "${BLUE}   主要需要配置: GLM_API_KEY${NC}"
else
    echo -e "${GREEN}✓ 环境配置文件已存在${NC}"
fi

# 7. 检查端口占用
echo -e "\n${YELLOW}🔍 检查端口占用...${NC}"

check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null 2>&1; then
        echo -e "${YELLOW}⚠️  端口 $1 已被占用${NC}"
        return 1
    else
        echo -e "${GREEN}✓ 端口 $1 可用${NC}"
        return 0
    fi
}

check_port 3000
check_port 8000

# 8. 创建启动脚本
echo -e "\n${YELLOW}📝 创建启动脚本...${NC}"

# 创建开发环境启动脚本
cat > start_dev.sh << 'EOF'
#!/bin/bash

# 启动开发环境

echo "🚀 启动舞蹈视频分析系统开发环境..."

# 检查虚拟环境
if [ ! -d "venv" ]; then
    echo "❌ 虚拟环境不存在，请先运行 ./setup.sh"
    exit 1
fi

# 检查配置文件
if [ ! -f "backend/.env" ]; then
    echo "❌ 配置文件不存在，请先运行 ./setup.sh"
    exit 1
fi

# 启动后端服务
echo "启动后端服务..."
source venv/bin/activate
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
cd ..

# 等待后端启动
sleep 3

# 启动前端服务
echo "启动前端服务..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo "✅ 服务启动完成!"
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:8000"
echo "📚 API文档: http://localhost:8000/docs"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
EOF

chmod +x start_dev.sh
echo -e "${GREEN}✓ 启动脚本创建完成${NC}"

# 9. 创建停止脚本
cat > stop_dev.sh << 'EOF'
#!/bin/bash

echo "🛑 停止开发服务..."

# 停止端口上的进程
pkill -f "uvicorn main:app" 2>/dev/null || true
pkill -f "npm start" 2>/dev/null || true
pkill -f "react-scripts start" 2>/dev/null || true

echo "✅ 所有服务已停止"
EOF

chmod +x stop_dev.sh
echo -e "${GREEN}✓ 停止脚本创建完成${NC}"

# 10. 完成设置
echo -e "\n${GREEN}🎉 项目设置完成!${NC}"
echo -e "\n${BLUE}📋 下一步操作:${NC}"
echo -e "1. 编辑 ${YELLOW}backend/.env${NC} 文件，配置你的API密钥"
echo -e "2. 运行 ${YELLOW}./start_dev.sh${NC} 启动开发环境"
echo -e "3. 访问 ${YELLOW}http://localhost:3000${NC} 查看应用"
echo -e "\n${BLUE}📚 其他命令:${NC}"
echo -e "• ${YELLOW}./stop_dev.sh${NC} - 停止所有服务"
echo -e "• ${YELLOW}source venv/bin/activate${NC} - 激活Python环境"
echo -e "\n${YELLOW}⚠️  重要提醒:${NC}"
echo -e "• 请不要将 .env 文件提交到版本控制"
echo -e "• 请确保配置了正确的API密钥"
echo -e "• 首次运行可能需要下载AI模型，请耐心等待"

deactivate 2>/dev/null || true
