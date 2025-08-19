# DancingAI - React Native App

AI驱动的舞蹈教学移动应用，支持Android和iOS平台。

## 🎯 项目特色

- **AI智能分析**：使用智谱GLM-4.5V API分析舞蹈视频
- **节拍识别**：自动识别舞蹈节拍和节奏
- **动作解析**：关键动作识别和文字指导
- **视频分段**：智能识别主歌、副歌、间奏等段落
- **个性化教学**：循环练习、镜面模式、速度控制

## 🚀 技术栈

- **前端框架**：Taro 4.x + React 18 + TypeScript
- **小程序平台**：抖音小程序
- **AI服务**：智谱GLM-4.5V API
- **样式**：SCSS
- **构建工具**：Webpack 5

## 📱 功能模块

### 首页
- 快速开始舞蹈分析
- 继续上次学习
- 功能特色展示

### 分析页面
- 舞蹈视频上传
- AI智能分析（节拍、动作、分段）
- 分析结果展示

### 学习页面
- 循环练习模式
- 镜面模式
- 速度控制
- 去BGM功能
- 练习记录

### 个人中心
- 用户信息展示
- 学习统计
- 成就系统
- 设置选项

## 🛠️ 开发环境

### 系统要求
- Node.js >= 16.0.0
- npm >= 8.0.0
- 抖音开发者工具

### 安装依赖
```bash
npm install
```

### 开发模式
```bash
# 启动开发服务器
npm start

# 构建抖音小程序
npm run build:tt

# 构建H5版本
npm run build:h5
```

## 📁 项目结构

```
src/
├── app.ts                 # 应用入口
├── app.config.ts         # 应用配置
├── app.scss              # 全局样式
├── pages/                # 页面组件
│   ├── index/           # 首页
│   ├── analysis/        # 分析页面
│   ├── learning/        # 学习页面
│   └── profile/         # 个人中心
├── components/           # 公共组件
├── services/            # API服务
│   └── glmApi.ts       # GLM API服务
├── types/               # TypeScript类型定义
└── utils/               # 工具函数
```

## 🔧 配置说明

### GLM API配置
在 `src/services/glmApi.ts` 中配置你的智谱API Key：

```typescript
const GLM_API_CONFIG = {
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  apiKey: 'your_api_key_here', // 替换为你的API Key
  model: 'glm-4o-mini'
}
```

### 小程序配置
在 `project.config.json` 中配置你的小程序信息：

```json
{
  "appid": "your_app_id_here",
  "projectname": "dancingai-miniprogram"
}
```

## 📱 预览方式

### 抖音小程序
1. 使用抖音开发者工具打开项目
2. 配置小程序AppID
3. 点击预览，生成二维码
4. 使用抖音App扫描二维码预览

### H5版本
1. 运行 `npm run build:h5`
2. 在浏览器中打开 `dist/h5/index.html`

## 🎨 UI设计

- 采用现代化设计风格
- 支持深色/浅色主题
- 响应式布局设计
- 流畅的动画效果

## 📋 开发计划

- [x] 项目基础架构搭建
- [x] 页面路由和导航
- [x] 基础UI组件
- [x] GLM API集成
- [ ] 视频上传功能
- [ ] 实时分析结果展示
- [ ] 练习模式实现
- [ ] 用户数据持久化
- [ ] 性能优化
- [ ] 测试用例

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交代码
4. 创建Pull Request

## 📄 许可证

MIT License

## 📞 联系方式

如有问题或建议，请提交Issue或联系开发团队。

---

**注意**：本项目仅包含前端代码，后端服务需要单独部署或使用第三方服务。
