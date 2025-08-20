# 🎭 DancingAI

**AI驱动的智能舞蹈学习平台**

一个集成GLM-4.5V多模态大模型和GVHMR人体运动恢复技术的智能舞蹈学习应用。

## 🌟 项目特色

- 🤖 **AI智能分析**: 基于GLM-4.5V的专业舞蹈动作分析
- 🎯 **个性化指导**: 四种分析维度（综合/技术/节拍/表现力）
- 📱 **跨平台应用**: React Native开发，支持iOS和Android
- 🎬 **视频处理**: GVHMR算法驱动的人体运动分析
- ✨ **实时指导**: AI实时提示和多种练习模式
- 🎨 **精美UI**: 现代化设计，流畅的用户体验

## 🚀 技术栈

### 前端技术
- **框架**: React Native + TypeScript
- **导航**: React Navigation 6
- **AI集成**: GLM-4.5V API
- **图标**: React Native Vector Icons
- **动画**: React Native Reanimated

### 后端技术
- **算法**: GVHMR (人体运动恢复)
- **语言**: Python
- **深度学习**: PyTorch
- **视频处理**: OpenCV

## 📁 项目结构

```
DancingAI/
├── 📱 frontend/          # React Native前端应用
│   ├── src/             # 源代码
│   ├── android/         # Android平台
│   ├── ios/             # iOS平台
│   └── package.json     # 依赖配置
├── 🤖 backend/GVHMR/     # Python后端服务
│   ├── hmr4d/           # 核心算法
│   ├── tools/           # 工具脚本
│   └── README.md        # GVHMR文档
├── 📚 docs/              # 项目文档
└── 🚀 scripts/           # 脚本文件
```

详细结构请查看 [PROJECT_STRUCTURE.md](PROJECT_STRUCTURE.md)

## 📱 核心功能

### 🏠 首页功能
- **视频卡片展示**: 精选舞蹈视频轮播
- **智能对比**: GLM-4.5V驱动的视频分析
- **测试视频集成**: 本地测试文件支持

### 🎬 视频详情页
- **视频播放**: 高清视频播放器
- **AI分析**: 四种专业分析类型
- **实时指导**: AI提示和练习模式
- **专业评分**: 0-100分评分系统

### 👤 个人资料
- **用户信息**: 个人资料管理
- **练习统计**: 学习进度跟踪
- **设置中心**: 个性化配置

### 🤖 AI分析功能
- **综合分析**: 全面评估舞蹈表现
- **技术分析**: 动作准确性评估
- **节拍分析**: 音乐感和节拍把握
- **表现力分析**: 情感表达评估

## 🛠️ 快速开始

### 前端开发

#### 环境要求
- Node.js >= 16.0.0
- React Native CLI
- Android Studio (Android开发)
- Xcode (iOS开发)

#### 安装和运行
```bash
# 进入前端目录
cd frontend

# 安装依赖
npm install

# 运行Android版本
npx react-native run-android

# 运行iOS版本
npx react-native run-ios
```

### 后端开发

#### 环境要求
- Python >= 3.8
- PyTorch
- CUDA (可选，用于GPU加速)

#### 安装和运行
```bash
# 进入后端目录
cd backend/GVHMR

# 按照GVHMR的README.md进行环境配置
# 详细说明请查看 backend/GVHMR/README.md
```

## 🔧 配置说明

### GLM API配置
1. 获取GLM-4.5V API密钥
2. 编辑 `frontend/src/config/api.ts`
3. 替换 `API_KEY` 为您的实际密钥

```typescript
export const API_CONFIG = {
  GLM: {
    API_KEY: 'your-actual-api-key-here',
    // ...
  }
};
```

### 测试视频配置
测试视频文件位于 `frontend/src/assets/test.mp4`，用于验证AI分析功能。

## 📚 文档

- [项目结构说明](PROJECT_STRUCTURE.md)
- [GLM API集成指南](docs/GLM_API_SETUP.md)
- [测试视频配置](docs/TEST_VIDEO_SETUP.md)
- [视频播放功能](docs/VIDEO_PLAYBACK_SETUP.md)
- [Git配置说明](docs/GITIGNORE_GUIDE.md)

## 🎯 功能演示

### AI分析流程
1. **上传视频** → 选择本地视频或使用测试视频
2. **选择分析类型** → 综合/技术/节拍/表现力
3. **AI处理** → GLM-4.5V分析视频内容
4. **查看结果** → 评分、反馈、改进建议

### 实时指导
1. **开启AI指导** → 激活实时提示功能
2. **选择练习模式** → 跟练/对比/学习
3. **跟随提示** → 根据AI建议改进动作

## 🤝 贡献指南

1. Fork 本仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- [GLM-4.5V](https://open.bigmodel.cn/) - 智谱AI多模态大模型
- [GVHMR](https://github.com/zju3dv/GVHMR) - 人体运动恢复算法
- [React Native](https://reactnative.dev/) - 跨平台移动应用框架

---

**🎭 DancingAI - 让每个人都能享受专业的舞蹈指导！**
