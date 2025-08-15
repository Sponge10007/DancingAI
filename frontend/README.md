# 舞蹈视频分析系统 - 前端

这是舞蹈视频分析系统的前端界面，基于 React + Ant Design 构建。

## 功能特性

- 🎨 **现代化UI设计** - 使用 Ant Design 组件库，界面美观易用
- 📱 **响应式布局** - 适配各种屏幕尺寸，支持移动端访问
- 🎭 **舞蹈主题** - 专为舞蹈分析场景设计的视觉风格
- ⚡ **实时分析** - 支持实时显示分析进度和结果
- 📊 **数据可视化** - 直观展示节拍、动作和分析结果

## 页面结构

- **首页** (`/`) - 视频上传和功能介绍
- **分析页面** (`/analysis/:videoId`) - 实时分析进度展示
- **结果页面** (`/result/:videoId`) - 详细分析结果展示

## 技术栈

- **React 18** - 前端框架
- **Ant Design 5** - UI组件库
- **React Router 6** - 路由管理
- **Axios** - HTTP客户端
- **CSS3** - 样式和动画

## 快速开始

### 环境要求

- Node.js 16+
- npm 或 yarn

### 安装依赖

```bash
cd frontend
npm install
```

### 启动开发服务器

```bash
npm start
```

服务器将在 http://localhost:3000 启动

### 环境变量

创建 `.env` 文件（可选）：

```env
REACT_APP_API_URL=http://localhost:8000
PORT=3000
```

## 项目结构

```
frontend/
├── public/                 # 静态资源
│   ├── index.html         # HTML模板
│   └── manifest.json      # PWA配置
├── src/
│   ├── components/        # 可复用组件
│   │   └── Header.js      # 页面头部
│   ├── pages/            # 页面组件
│   │   ├── HomePage.js    # 首页
│   │   ├── AnalysisPage.js # 分析页面
│   │   └── ResultPage.js   # 结果页面
│   ├── services/         # API服务
│   │   └── api.js        # API接口封装
│   ├── App.js            # 主应用组件
│   ├── App.css           # 应用样式
│   ├── index.js          # 入口文件
│   └── index.css         # 全局样式
├── package.json          # 项目配置
└── README.md            # 说明文档
```

## 主要功能

### 1. 视频上传
- 支持拖拽上传
- 文件格式验证
- 上传进度显示
- 错误处理

### 2. 分析进度
- 实时进度条
- 步骤指示器
- 错误重试机制
- 取消操作

### 3. 结果展示
- 多标签页展示
- 数据可视化
- 导出功能
- 响应式设计

## 样式特色

### 设计风格
- **渐变背景** - 紫色渐变主题
- **毛玻璃效果** - 现代化的半透明卡片
- **流畅动画** - 页面切换和交互动画
- **舞蹈元素** - 专业的舞蹈相关图标和配色

### 响应式设计
- 桌面端：1200px+ 多列布局
- 平板端：768px-1199px 自适应布局  
- 移动端：<768px 单列布局

## API集成

前端通过 `src/services/api.js` 与后端API通信：

- 视频上传和管理
- 分析任务提交
- 实时进度查询
- 结果数据获取

## 开发说明

### 添加新页面
1. 在 `src/pages/` 创建新组件
2. 在 `src/App.js` 添加路由
3. 更新导航菜单

### 添加新API
1. 在 `src/services/api.js` 添加接口方法
2. 在组件中导入使用
3. 添加错误处理

### 自定义样式
- 全局样式：`src/index.css`
- 组件样式：`src/App.css`
- Ant Design主题：`src/index.js`

## 构建部署

### 生产构建
```bash
npm run build
```

构建文件将生成在 `build/` 目录

### 部署选项
- 静态文件服务器（Nginx、Apache）
- CDN部署
- Docker容器化
- Vercel、Netlify等平台

## 故障排除

### 常见问题

1. **依赖安装失败**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **端口占用**
   ```bash
   # 修改端口
   PORT=3001 npm start
   ```

3. **API连接失败**
   - 检查后端服务是否启动
   - 确认API地址配置正确
   - 检查CORS设置

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
