@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

REM ===================================
REM 舞蹈视频分析系统 - Windows安装脚本
REM ===================================

echo 🚀 开始设置舞蹈视频分析系统...

REM 1. 检查必要的工具
echo.
echo 📋 检查必要工具...

where python >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python 未安装或未添加到PATH
    echo 请从 https://python.org 下载并安装Python 3.8+
    pause
    exit /b 1
) else (
    echo ✅ Python 已安装
)

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js 未安装或未添加到PATH
    echo 请从 https://nodejs.org 下载并安装Node.js 14+
    pause
    exit /b 1
) else (
    echo ✅ Node.js 已安装
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm 未安装
    echo 请重新安装Node.js
    pause
    exit /b 1
) else (
    echo ✅ npm 已安装
)

where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Git 未安装或未添加到PATH
    echo 请从 https://git-scm.com 下载并安装Git
    pause
    exit /b 1
) else (
    echo ✅ Git 已安装
)

REM 2. 创建Python虚拟环境
echo.
echo 🐍 设置Python环境...

if not exist "venv" (
    echo 创建Python虚拟环境...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo ❌ 虚拟环境创建失败
        pause
        exit /b 1
    )
    echo ✅ 虚拟环境创建成功
) else (
    echo ✅ 虚拟环境已存在
)

REM 激活虚拟环境
call venv\Scripts\activate.bat
if %errorlevel% neq 0 (
    echo ❌ 虚拟环境激活失败
    pause
    exit /b 1
)
echo ✅ 虚拟环境已激活

REM 3. 安装Python依赖
echo.
echo 📦 安装Python依赖...
cd backend
python -m pip install --upgrade pip
pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo ❌ Python依赖安装失败
    echo 尝试使用国内镜像...
    pip install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple/
    if %errorlevel% neq 0 (
        echo ❌ Python依赖安装失败
        pause
        exit /b 1
    )
)
echo ✅ Python依赖安装完成
cd ..

REM 4. 安装Node.js依赖
echo.
echo 📦 安装Node.js依赖...
cd frontend
npm install
if %errorlevel% neq 0 (
    echo ❌ Node.js依赖安装失败
    echo 尝试清理缓存...
    npm cache clean --force
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Node.js依赖安装失败
        pause
        exit /b 1
    )
)
echo ✅ Node.js依赖安装完成
cd ..

REM 5. 创建必要目录
echo.
echo 📁 创建必要目录...
if not exist "uploads" mkdir uploads
if not exist "uploads\videos" mkdir uploads\videos
if not exist "uploads\frames" mkdir uploads\frames
if not exist "uploads\audio" mkdir uploads\audio
if not exist "uploads\temp" mkdir uploads\temp
if not exist "backend\uploads" mkdir backend\uploads
if not exist "backend\uploads\videos" mkdir backend\uploads\videos
if not exist "backend\uploads\frames" mkdir backend\uploads\frames
if not exist "backend\uploads\audio" mkdir backend\uploads\audio
if not exist "backend\uploads\temp" mkdir backend\uploads\temp
if not exist "logs" mkdir logs
echo ✅ 目录结构创建完成

REM 6. 配置环境变量
echo.
echo ⚙️ 配置环境变量...
if not exist "backend\.env" (
    copy "backend\.env.example" "backend\.env"
    echo ✅ 环境配置文件已创建
    echo ⚠️ 请编辑 backend\.env 文件，配置你的API密钥
    echo    主要需要配置: GLM_API_KEY
) else (
    echo ✅ 环境配置文件已存在
)

REM 7. 创建启动脚本
echo.
echo 📝 创建启动脚本...

REM 创建开发环境启动脚本
echo @echo off > start_dev.bat
echo chcp 65001 ^>nul >> start_dev.bat
echo setlocal enabledelayedexpansion >> start_dev.bat
echo. >> start_dev.bat
echo echo 🚀 启动舞蹈视频分析系统开发环境... >> start_dev.bat
echo. >> start_dev.bat
echo REM 检查虚拟环境 >> start_dev.bat
echo if not exist "venv" ^( >> start_dev.bat
echo     echo ❌ 虚拟环境不存在，请先运行 setup.bat >> start_dev.bat
echo     pause >> start_dev.bat
echo     exit /b 1 >> start_dev.bat
echo ^) >> start_dev.bat
echo. >> start_dev.bat
echo REM 检查配置文件 >> start_dev.bat
echo if not exist "backend\.env" ^( >> start_dev.bat
echo     echo ❌ 配置文件不存在，请先运行 setup.bat >> start_dev.bat
echo     pause >> start_dev.bat
echo     exit /b 1 >> start_dev.bat
echo ^) >> start_dev.bat
echo. >> start_dev.bat
echo REM 启动后端服务 >> start_dev.bat
echo echo 启动后端服务... >> start_dev.bat
echo call venv\Scripts\activate.bat >> start_dev.bat
echo start "后端服务" cmd /k "cd backend && python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload" >> start_dev.bat
echo. >> start_dev.bat
echo REM 等待后端启动 >> start_dev.bat
echo timeout /t 5 /nobreak ^>nul >> start_dev.bat
echo. >> start_dev.bat
echo REM 启动前端服务 >> start_dev.bat
echo echo 启动前端服务... >> start_dev.bat
echo start "前端服务" cmd /k "cd frontend && npm start" >> start_dev.bat
echo. >> start_dev.bat
echo echo ✅ 服务启动完成! >> start_dev.bat
echo echo 📱 前端地址: http://localhost:3000 >> start_dev.bat
echo echo 🔧 后端地址: http://localhost:8000 >> start_dev.bat
echo echo 📚 API文档: http://localhost:8000/docs >> start_dev.bat
echo echo. >> start_dev.bat
echo echo 关闭此窗口将停止所有服务 >> start_dev.bat
echo pause >> start_dev.bat

echo ✅ 启动脚本创建完成

REM 8. 创建停止脚本
echo @echo off > stop_dev.bat
echo chcp 65001 ^>nul >> stop_dev.bat
echo echo 🛑 停止开发服务... >> stop_dev.bat
echo taskkill /f /im "python.exe" 2^>nul >> stop_dev.bat
echo taskkill /f /im "node.exe" 2^>nul >> stop_dev.bat
echo echo ✅ 所有服务已停止 >> stop_dev.bat
echo pause >> stop_dev.bat

echo ✅ 停止脚本创建完成

REM 9. 完成设置
echo.
echo 🎉 项目设置完成!
echo.
echo 📋 下一步操作:
echo 1. 编辑 backend\.env 文件，配置你的API密钥
echo 2. 双击 start_dev.bat 启动开发环境
echo 3. 访问 http://localhost:3000 查看应用
echo.
echo 📚 其他命令:
echo • 双击 stop_dev.bat - 停止所有服务
echo • 运行 venv\Scripts\activate.bat - 激活Python环境
echo.
echo ⚠️ 重要提醒:
echo • 请不要将 .env 文件提交到版本控制
echo • 请确保配置了正确的API密钥
echo • 首次运行可能需要下载AI模型，请耐心等待
echo.
pause
