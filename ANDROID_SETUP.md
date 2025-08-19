# 🤖 Android 运行指南

## ✅ 项目状态

DancingAI React Native项目已经完全配置好，包含：
- ✅ 完整的Android项目结构
- ✅ 所有必要的配置文件
- ✅ Gradle构建脚本
- ✅ Kotlin源代码
- ✅ 应用图标和资源

## 🛠️ 环境要求

### 必需软件
1. **Java JDK 11+**
   ```bash
   # 检查Java版本
   java -version
   ```

2. **Android Studio** 
   - 下载地址: https://developer.android.com/studio
   - 安装Android SDK (API Level 34)
   - 配置Android SDK路径

3. **Android SDK环境变量**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/emulator
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

## 📱 运行方式

### 方式1: 使用Android模拟器
1. **启动Android Studio**
2. **创建AVD (Android Virtual Device)**
   - Tools → AVD Manager
   - Create Virtual Device
   - 选择设备型号 (推荐: Pixel 4)
   - 选择系统镜像 (API Level 34)
   - 启动模拟器

3. **运行应用**
   ```bash
   # 启动Metro服务器
   npm start
   
   # 在新终端运行Android应用
   npm run android
   ```

### 方式2: 使用真机调试
1. **启用开发者选项**
   - 设置 → 关于手机 → 连续点击版本号7次
   - 返回设置 → 开发者选项
   - 启用"USB调试"

2. **连接设备**
   ```bash
   # 检查设备连接
   adb devices
   ```

3. **运行应用**
   ```bash
   npm run android
   ```

## 🔧 故障排除

### 常见问题

#### 1. Java版本问题
```bash
# 如果Java版本不对，安装OpenJDK 11
sudo apt install openjdk-11-jdk
```

#### 2. Android SDK未找到
```bash
# 设置ANDROID_HOME环境变量
export ANDROID_HOME=$HOME/Android/Sdk
```

#### 3. 模拟器启动失败
- 确保已安装Intel HAXM或AMD处理器虚拟化
- 在BIOS中启用虚拟化技术

#### 4. Gradle构建失败
```bash
# 清理并重新构建
cd android
./gradlew clean
./gradlew assembleDebug
```

#### 5. Metro服务器端口冲突
```bash
# 使用不同端口启动
npx react-native start --port 8082
```

## 🎯 快速验证

### 检查环境
```bash
# 运行React Native环境检查
npx react-native doctor
```

### 手动构建测试
```bash
# 进入android目录
cd android

# 构建debug APK
./gradlew assembleDebug

# APK位置: android/app/build/outputs/apk/debug/app-debug.apk
```

## 📱 应用特性

### 已配置功能
- ✅ **应用名称**: DancingAI
- ✅ **包名**: com.dancingai
- ✅ **最低SDK**: API Level 21 (Android 5.0)
- ✅ **目标SDK**: API Level 34 (Android 14)
- ✅ **架构支持**: armeabi-v7a, arm64-v8a, x86, x86_64
- ✅ **JavaScript引擎**: Hermes (默认启用)

### 权限配置
- ✅ **网络访问**: android.permission.INTERNET

## 🚀 下一步

1. **安装Android Studio和SDK**
2. **创建Android模拟器或连接真机**
3. **运行 `npm run android`**
4. **享受DancingAI应用！**

## 💡 提示

- 首次运行可能需要下载Gradle依赖，请耐心等待
- 建议使用真机调试以获得最佳性能体验
- 如遇到问题，可以运行 `npx react-native doctor` 检查环境配置

---

**🎉 DancingAI React Native应用已准备就绪！**
