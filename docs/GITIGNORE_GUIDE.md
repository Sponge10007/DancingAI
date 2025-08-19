# .gitignore 配置说明

## 概述
为DancingAI项目配置的完整.gitignore文件，确保敏感信息和不必要的文件不会被提交到版本控制系统。

## 🔒 **重要安全配置**

### API密钥保护
```gitignore
# API Keys and Secrets (重要：保护GLM API密钥)
src/config/secrets.ts
src/config/keys.ts
*.key
*.pem
*.p12
*.mobileprovision

# GLM API Configuration (保护API密钥)
src/config/api.ts.backup
**/api-keys.json
**/secrets.json
```

### 环境变量
```gitignore
# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

## 📱 **React Native 特定配置**

### iOS相关
```gitignore
# Xcode
build/
*.pbxuser
*.mode1v3
*.mode2v3
*.perspectivev3
xcuserdata
*.xccheckout
*.moved-aside
DerivedData
*.hmap
*.ipa
*.xcuserstate
ios/.xcode.env.local

# Ruby / CocoaPods
/ios/Pods/
/vendor/bundle/

# Flipper
ios/Pods/Flipper
ios/Pods/Flipper-*
ios/Pods/FlipperKit
```

### Android相关
```gitignore
# Android/IntelliJ
build/
.idea
.gradle
local.properties
*.iml
*.hprof
.cxx/
*.keystore
!debug.keystore

# Keystore files
*.jks
*.keystore

# External native build folder
.externalNativeBuild

# Google Services
google-services.json
```

### Metro和Bundle
```gitignore
# Temporary files created by Metro
.metro-health-check*

# Bundle artifacts
*.jsbundle

# Hermes
android/app/build/generated/assets/react/*/index.android.bundle*
android/app/build/generated/res/react/*/drawable-*
android/app/build/generated/source/buildConfig/*/com/*/BuildConfig.java
```

## 🗂️ **开发工具配置**

### Node.js和包管理
```gitignore
# node.js
node_modules/
npm-debug.log
yarn-error.log

# Yarn
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache
```

### TypeScript
```gitignore
# TypeScript cache
*.tsbuildinfo
```

### 编辑器配置
```gitignore
# Editor directories and files
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
*.swp
*.swo
*~
```

## 📁 **文件类型过滤**

### 日志文件
```gitignore
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
lerna-debug.log*
```

### 临时文件
```gitignore
# Temporary folders
tmp/
temp/

# Backup files
*.bak
*.backup
*.old
*.orig
```

### 操作系统文件
```gitignore
# OSX
.DS_Store

# OS generated files
Thumbs.db
ehthumbs.db
Desktop.ini
```

## 🎬 **DancingAI 项目特定配置**

### 测试视频文件
```gitignore
# Test videos and large assets (可选 - 如果不想提交大文件)
# src/assets/videos/
# src/assets/test.mp4
```

**注意**: 目前测试视频文件被注释掉了，如果您不想将大型视频文件提交到Git，可以取消注释这些行。

### API配置文件
```gitignore
# DancingAI项目特定文件
# 如果您不想提交API密钥，请取消注释下面这行
# src/config/api.ts
```

**重要**: 如果您要将代码推送到公共仓库，强烈建议取消注释 `src/config/api.ts` 行，以保护您的GLM API密钥。

## 🔧 **使用建议**

### 1. API密钥安全
- ✅ **永远不要提交API密钥**到版本控制
- ✅ **使用环境变量**存储敏感信息
- ✅ **创建示例配置文件**供其他开发者参考

### 2. 大文件管理
- ✅ **考虑使用Git LFS**处理大型视频文件
- ✅ **将测试文件放在本地**，不提交到仓库
- ✅ **使用CDN或云存储**存储媒体文件

### 3. 团队协作
- ✅ **保持.gitignore文件更新**
- ✅ **添加项目特定的忽略规则**
- ✅ **定期检查是否有敏感文件被意外提交**

## 📋 **检查清单**

在提交代码前，请确认：

- [ ] API密钥已被正确忽略
- [ ] 没有提交node_modules目录
- [ ] 没有提交构建输出文件
- [ ] 没有提交IDE特定的配置文件
- [ ] 没有提交临时文件和日志
- [ ] 大型媒体文件已被适当处理

## 🚨 **紧急情况处理**

如果意外提交了敏感信息：

1. **立即更改API密钥**
2. **使用git filter-branch移除历史记录**
3. **强制推送更新的历史**
4. **通知团队成员更新本地仓库**

```bash
# 移除敏感文件的历史记录
git filter-branch --force --index-filter \
'git rm --cached --ignore-unmatch src/config/api.ts' \
--prune-empty --tag-name-filter cat -- --all

# 强制推送
git push origin --force --all
```

---

**记住**: 安全第一！永远不要将API密钥、密码或其他敏感信息提交到版本控制系统。
