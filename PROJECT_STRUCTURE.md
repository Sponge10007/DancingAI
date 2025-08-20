# DancingAI 项目结构

## 📁 项目目录结构

```
DancingAI/
├── 📱 frontend/                    # React Native 前端应用
│   ├── src/                       # 源代码目录
│   │   ├── screens/              # 页面组件
│   │   │   ├── HomeScreen.tsx    # 首页（智能对比功能）
│   │   │   ├── VideoDetailScreen.tsx # 视频详情页（AI分析）
│   │   │   ├── ProfileScreen.tsx # 个人资料页
│   │   │   └── RegisterScreen.tsx # 注册页面
│   │   ├── components/           # 通用组件
│   │   │   └── LoadingIcon.tsx   # 加载图标
│   │   ├── services/             # API服务层
│   │   │   ├── glmService.ts     # GLM-4.5V API服务
│   │   │   └── videoAnalysisService.ts # 视频分析服务
│   │   ├── config/               # 配置文件
│   │   │   └── api.ts            # API配置（包含GLM密钥）
│   │   ├── utils/                # 工具函数
│   │   │   └── permissions.ts    # 权限管理
│   │   └── assets/               # 静态资源
│   │       ├── images/           # 图片资源
│   │       ├── icons/            # 图标资源
│   │       └── test.mp4          # 测试视频文件
│   ├── android/                  # Android平台代码
│   ├── ios/                      # iOS平台代码
│   ├── node_modules/             # 前端依赖包
│   ├── package.json              # 前端依赖配置
│   ├── package-lock.json         # 依赖锁定文件
│   ├── babel.config.js           # Babel配置
│   ├── metro.config.js           # Metro打包配置
│   ├── tsconfig.json             # TypeScript配置
│   └── index.js                  # 应用入口文件
│
├── 🤖 backend/                     # Python 后端服务
│   └── GVHMR/                    # GVHMR人体运动恢复模块
│       ├── hmr4d/                # 核心算法模块
│       ├── tools/                # 工具脚本
│       ├── inputs/               # 输入数据目录
│       ├── outputs/              # 输出结果目录
│       ├── docs/                 # GVHMR文档
│       ├── LICENSE               # 许可证
│       └── README.md             # GVHMR说明文档
│
├── 📚 docs/                        # 项目文档
│   ├── DEVELOPMENT.md            # 开发指南
│   ├── GITIGNORE_GUIDE.md        # Git忽略文件说明
│   ├── GLM_API_SETUP.md          # GLM API集成说明
│   ├── TEST_VIDEO_SETUP.md       # 测试视频配置说明
│   └── VIDEO_PLAYBACK_SETUP.md   # 视频播放功能说明
│
├── 🚀 scripts/                     # 脚本文件
│   └── preview.sh                # 预览脚本
│
├── 📋 README.md                    # 项目主说明文档
├── 🚫 .gitignore                   # Git忽略文件配置
└── 📝 PROJECT_STRUCTURE.md        # 本文件
```
