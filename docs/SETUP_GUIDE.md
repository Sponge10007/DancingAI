# 🚀 项目设置指南

本指南将帮助你从GitHub克隆项目后快速设置开发环境。

## 📋 前置要求

### 必需软件

- **Python 3.8+** - [下载地址](https://python.org)
- **Node.js 14+** - [下载地址](https://nodejs.org)
- **Git** - [下载地址](https://git-scm.com)

### 推荐软件

- **VS Code** - 代码编辑器
- **Postman** - API测试工具

## 🔧 快速设置

### 方法一：自动安装（推荐）

#### Linux/Mac 用户

```bash
# 1. 克隆项目
git clone https://github.com/your-username/dance-analysis.git
cd dance-analysis

# 2. 运行安装脚本
chmod +x setup.sh
./setup.sh

# 3. 配置API密钥
nano backend/.env  # 或使用你喜欢的编辑器

# 4. 启动开发环境
./start_dev.sh
```

#### Windows 用户

```cmd
# 1. 克隆项目
git clone https://github.com/your-username/dance-analysis.git
cd dance-analysis

# 2. 运行安装脚本
setup.bat

# 3. 配置API密钥
notepad backend\.env

# 4. 启动开发环境
start_dev.bat
```

### 方法二：手动安装

如果自动安装脚本不工作，请按以下步骤手动安装：

#### 1. 克隆项目

```bash
git clone https://github.com/your-username/dance-analysis.git
cd dance-analysis
```

#### 2. 设置Python环境

```bash
# 创建虚拟环境
python3 -m venv venv

# 激活虚拟环境
# Linux/Mac:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# 安装Python依赖
cd backend
pip install --upgrade pip
pip install -r requirements.txt
cd ..
```

#### 3. 设置Node.js环境

```bash
cd frontend
npm install
cd ..
```

#### 4. 创建必要目录

```bash
mkdir -p uploads/{videos,frames,audio,temp}
mkdir -p backend/uploads/{videos,frames,audio,temp}
mkdir -p logs
```

#### 5. 配置环境变量

```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑配置文件
nano backend/.env  # 或使用你喜欢的编辑器
```

#### 6. 启动服务

```bash
# 启动后端（新终端窗口）
source venv/bin/activate
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# 启动前端（新终端窗口）
cd frontend
npm start
```

## ⚙️ 配置说明

### API密钥配置

1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账号并创建API密钥
3. 在 `backend/.env` 文件中设置：

```env
GLM_API_KEY=你的实际API密钥
```

### 其他重要配置

```env
# 调试模式（开发时设为true）
DEBUG=true

# 文件上传限制
MAX_FILE_SIZE=524288000  # 500MB
MAX_VIDEO_DURATION=600   # 10分钟

# 视频处理参数
FRAME_EXTRACTION_FPS=30
AUDIO_SAMPLE_RATE=22050
```

## 🔍 验证安装

### 1. 检查后端服务

访问以下地址确认后端正常运行：

- **健康检查**: http://localhost:8000/health
- **API文档**: http://localhost:8000/docs

### 2. 检查前端应用

访问 http://localhost:3000 确认前端正常运行。

### 3. 测试完整流程

1. 上传一个测试视频
2. 查看分析过程
3. 检查结果页面

## 🚨 常见问题

### Python相关问题

**问题**: `python: command not found`
**解决**: 确保Python已安装并添加到PATH，或尝试使用 `python3`

**问题**: 虚拟环境创建失败
**解决**: 
```bash
# Ubuntu/Debian
sudo apt install python3-venv

# CentOS/RHEL
sudo yum install python3-venv
```

**问题**: pip安装依赖失败
**解决**: 使用国内镜像
```bash
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/
```

### Node.js相关问题

**问题**: `npm install` 失败
**解决**: 
```bash
# 清理缓存
npm cache clean --force

# 使用国内镜像
npm config set registry https://registry.npmmirror.com/

# 重新安装
npm install
```

**问题**: 端口被占用
**解决**: 
```bash
# 查看端口占用
lsof -i :3000
lsof -i :8000

# 杀死占用进程
kill -9 <PID>
```

### 权限问题

**问题**: Linux/Mac上脚本无法执行
**解决**: 
```bash
chmod +x setup.sh
chmod +x start_dev.sh
chmod +x stop_dev.sh
```

### API密钥问题

**问题**: 分析功能不工作
**解决**: 
1. 检查 `.env` 文件中的 `GLM_API_KEY` 是否正确
2. 确认API密钥有足够的额度
3. 检查网络连接

## 📚 开发工具推荐

### VS Code 扩展

- **Python** - Python语言支持
- **ES7+ React/Redux/React-Native snippets** - React代码片段
- **Prettier** - 代码格式化
- **ESLint** - JavaScript代码检查
- **GitLens** - Git增强工具

### 调试工具

- **后端调试**: 使用VS Code的Python调试器
- **前端调试**: 使用浏览器开发者工具
- **API测试**: 使用Postman或访问 http://localhost:8000/docs

## 🔄 更新项目

```bash
# 拉取最新代码
git pull origin main

# 更新Python依赖
source venv/bin/activate
cd backend
pip install -r requirements.txt
cd ..

# 更新Node.js依赖
cd frontend
npm install
cd ..

# 重启服务
./stop_dev.sh
./start_dev.sh
```

## 🤝 获取帮助

如果遇到问题：

1. 查看本文档的常见问题部分
2. 检查项目的 [Issues](https://github.com/your-username/dance-analysis/issues)
3. 创建新的Issue描述你的问题
4. 联系项目维护者

## 📝 下一步

设置完成后，建议阅读：

- [开发指南](development_guide.md)
- [API文档](http://localhost:8000/docs)
- [贡献指南](../README.md#贡献指南)
