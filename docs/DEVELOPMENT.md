# DancingAI React Native 开发指南

## 项目结构

```
DancingAI/
├── src/                    # 源代码
│   ├── components/        # 可复用组件
│   ├── screens/          # 页面组件
│   ├── services/         # AI服务
│   ├── types/            # TypeScript类型定义
│   ├── utils/            # 工具函数
│   ├── hooks/            # 自定义Hooks
│   ├── store/            # 状态管理
│   └── App.tsx           # 主应用组件
├── assets/                # 静态资源
├── docs/                  # 项目文档
└── scripts/               # 构建脚本
```

## 技术栈

- **前端**: React Native (TypeScript + React Navigation)
- **AI服务**: 智谱GLM-4.5V API
- **状态管理**: Zustand + React Query
- **UI组件**: 原生组件 + 自定义样式
- **架构模式**: 组件化 + 函数式编程

## 开发环境要求

- Node.js 16+
- npm 或 yarn
- React Native CLI (通过npx使用)
- 可选：Android Studio (用于模拟器)

## 快速开始

1. 克隆项目
2. 安装依赖：`npm install`
3. 启动开发服务器：`npm start`
4. 配置智谱GLM-4.5V API密钥
5. 使用Expo Go或模拟器预览应用

## 代码规范

- 使用TypeScript编码规范
- 遵循React Native最佳实践
- 使用函数式组件和Hooks
- 实现响应式编程模式

## 测试

- 单元测试: Jest
- UI测试: React Native Testing Library
- 集成测试: 待定

## 部署

- 开发环境: 本地开发
- 测试环境: 待定
- 生产环境: 待定

## 与后端协作

- 后端由团队成员独立开发
- 通过RESTful API进行数据交互
- 使用统一的API接口规范
- 定期同步API文档和数据结构
