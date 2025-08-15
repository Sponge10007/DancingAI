# 舞蹈视频分析系统开发指南

## 开发环境搭建

### 1. 环境要求
- Python 3.9+
- Node.js 16+
- FFmpeg
- Redis (可选，用于任务队列)

### 2. 后端环境搭建

```bash
# 进入后端目录
cd backend

# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows
venv\Scripts\activate
# Linux/Mac
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 复制环境配置文件
cp .env.example .env

# 编辑 .env 文件，填入你的GLM API密钥
# GLM_API_KEY=your_api_key_here
```

### 3. 前端环境搭建

```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 或使用yarn
yarn install
```

### 4. 获取智谱GLM-4.5V API密钥

1. 访问 [智谱AI开放平台](https://open.bigmodel.cn/)
2. 注册账号并完成认证
3. 创建API密钥
4. 将密钥填入 `backend/.env` 文件中的 `GLM_API_KEY`

### 5. 运行项目

#### 方式一：分别启动
```bash
# 启动后端
cd backend
python main.py

# 启动前端（新终端）
cd frontend
npm start
```

#### 方式二：使用Docker Compose
```bash
# 在项目根目录
docker-compose up -d
```

## 开发流程

### 阶段1：项目架构设计与环境搭建 ✅
- [x] 技术栈选择
- [x] 项目结构设计
- [x] 基础配置文件
- [x] GLM API集成准备

### 阶段2：视频处理基础模块开发
- [ ] 视频上传功能
- [ ] 视频格式转换
- [ ] 帧提取功能
- [ ] 音频分离

### 阶段3：节拍检测功能实现
- [ ] 音频特征提取
- [ ] BPM检测算法
- [ ] 节拍时间点标记
- [ ] 节拍可视化

### 阶段4：动作识别与解析模块
- [ ] MediaPipe姿态检测集成
- [ ] 关键动作识别
- [ ] GLM-4.5V动作描述生成
- [ ] 动作序列分析

### 阶段5：视频分段功能开发
- [ ] 音乐结构分析
- [ ] 段落自动分类
- [ ] 段落边界检测
- [ ] GLM辅助段落描述

### 阶段6：文字指导生成系统
- [ ] 动作教学文本生成
- [ ] 分段教学计划
- [ ] 个性化指导建议
- [ ] 多语言支持

### 阶段7：用户界面开发
- [ ] 视频播放器组件
- [ ] 分析结果展示
- [ ] 交互式时间轴
- [ ] 响应式设计

### 阶段8：系统集成与测试
- [ ] 端到端测试
- [ ] 性能优化
- [ ] 错误处理
- [ ] 部署准备

## API设计

### 核心接口
- `POST /api/v1/videos/upload` - 视频上传
- `POST /api/v1/analysis/start` - 开始分析
- `GET /api/v1/analysis/{video_id}/status` - 查询分析状态
- `GET /api/v1/analysis/{video_id}/result` - 获取分析结果

## 注意事项

1. **GLM API调用限制**：注意API调用频率限制，合理使用缓存
2. **视频文件大小**：限制上传文件大小，建议500MB以内
3. **处理时间**：长视频处理时间较长，需要异步处理和进度反馈
4. **资源管理**：及时清理临时文件，避免磁盘空间不足

## 下一步计划

完成当前架构搭建后，将开始第二阶段的视频处理基础模块开发。
