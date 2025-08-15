# 🕺 舞蹈视频分析系统

基于AI的智能舞蹈视频分析系统，提供专业的节拍检测、姿态识别和动作分析功能。

## ✨ 功能特点

- 🎵 **智能节拍检测** - 自动分析音乐BPM和节拍模式
- 🤸 **精确姿态识别** - 33个关键点的人体姿态检测
- 📊 **动作分析** - AI驱动的舞蹈动作识别和指导
- 🎯 **实时处理** - 快速视频分析和结果生成
- 📱 **现代化界面** - 响应式Web界面，支持多设备
- 🔧 **易于部署** - 一键安装和启动

## 🚀 快速开始

### 系统要求

- **Python** 3.8+
- **Node.js** 14+
- **npm** 6+
- **Git**

### 一键安装

#### Linux/Mac 用户

```bash
# 1. 克隆项目
git clone https://github.com/your-username/dance-analysis.git
cd dance-analysis

# 2. 运行安装脚本
chmod +x setup.sh
./setup.sh

# 3. 配置API密钥（必需）
cp backend/.env.example backend/.env
nano backend/.env  # 设置你的GLM_API_KEY

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

# 3. 配置API密钥（必需）
copy backend\.env.example backend\.env
notepad backend\.env  # 设置你的GLM_API_KEY

# 4. 启动开发环境
start_dev.bat
```

### 手动安装

如果自动安装脚本不工作，可以手动安装：

#### 后端设置

```bash
# 创建虚拟环境
python3 -m venv venv
source venv/bin/activate  # Linux/Mac
# 或 venv\Scripts\activate  # Windows

# 安装依赖
cd backend
pip install -r requirements.txt

# 配置环境变量
cp .env.example .env
# 编辑 .env 文件，设置API密钥

# 启动后端服务
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

#### 前端设置

```bash
# 安装依赖
cd frontend
npm install

# 启动前端服务
npm start
```

## 🔧 配置说明

### 环境变量配置

在 `backend/.env` 文件中配置以下变量：

```env
# 智谱GLM-4.5V API配置
GLM_API_KEY=your_api_key_here

# 应用配置
DEBUG=true
APP_NAME=舞蹈视频分析系统
VERSION=1.0.0

# 文件上传配置
MAX_FILE_SIZE=524288000  # 500MB
UPLOAD_DIR=uploads

# 视频处理配置
MAX_VIDEO_DURATION=600  # 10分钟
FRAME_EXTRACTION_FPS=30
AUDIO_SAMPLE_RATE=22050
```

### API密钥获取

1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账号并创建API密钥
3. 将密钥填入 `.env` 文件的 `GLM_API_KEY` 字段

## 📖 使用指南

### 基本使用流程

1. **上传视频** - 支持 MP4, AVI, MOV, MKV, FLV 格式
2. **自动分析** - 系统自动进行节拍检测和姿态识别
3. **查看结果** - 获得详细的分析报告和改进建议

### 支持的视频格式

- **格式**: MP4, AVI, MOV, MKV, FLV
- **大小**: 最大 500MB
- **时长**: 最长 10分钟
- **分辨率**: 建议 720p 以上

## 🏗️ 技术架构

- **后端**: Python + FastAPI
- **前端**: React + Ant Design
- **AI服务**: 智谱GLM-4.5V API
- **视频处理**: OpenCV + FFmpeg
- **音频分析**: librosa
- **姿态检测**: MediaPipe

## 🏗️ 项目结构

```
dance-analysis/
├── backend/                 # 后端服务
│   ├── app/                # 应用代码
│   │   ├── api/           # API路由
│   │   ├── core/          # 核心配置
│   │   ├── models/        # 数据模型
│   │   ├── services/      # 业务服务
│   │   └── utils/         # 工具函数
│   ├── main.py            # 应用入口
│   ├── requirements.txt   # Python依赖
│   └── .env.example       # 环境变量模板
├── frontend/               # 前端应用
│   ├── src/               # 源代码
│   │   ├── components/    # React组件
│   │   ├── pages/         # 页面组件
│   │   ├── services/      # API服务
│   │   └── App.js         # 应用入口
│   ├── public/            # 静态资源
│   └── package.json       # Node.js依赖
├── docs/                   # 文档
├── scripts/                # 脚本文件
├── tests/                  # 测试文件
├── uploads/                # 上传文件目录
├── setup.sh               # 安装脚本
├── start_dev.sh           # 启动脚本
└── README.md              # 项目说明
```

## 🔗 访问地址

启动成功后，可以访问以下地址：

- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:8000
- **API文档**: http://localhost:8000/docs
- **健康检查**: http://localhost:8000/health

## 🛠️ 开发指南

### 开发环境启动

```bash
# 启动所有服务
./start_dev.sh

# 停止所有服务
./stop_dev.sh
```

### 单独启动服务

```bash
# 仅启动后端
source venv/bin/activate
cd backend
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# 仅启动前端
cd frontend
npm start
```

## 🚨 常见问题

### 1. 安装依赖失败

```bash
# 更新pip
pip install --upgrade pip

# 使用国内镜像
pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/
```

### 2. 端口被占用

```bash
# 查看端口占用
lsof -i :3000
lsof -i :8000

# 停止占用进程
./stop_dev.sh
```

### 3. API密钥配置错误

确保在 `backend/.env` 文件中正确配置了 `GLM_API_KEY`。

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

- [MediaPipe](https://mediapipe.dev/) - 姿态检测
- [Librosa](https://librosa.org/) - 音频分析
- [FastAPI](https://fastapi.tiangolo.com/) - 后端框架
- [React](https://reactjs.org/) - 前端框架
- [Ant Design](https://ant.design/) - UI组件库
