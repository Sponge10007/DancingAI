#!/bin/bash

echo "🎭 DancingAI 小程序预览启动脚本"
echo "=================================="

# 检查预览文件是否存在
if [ ! -f "preview.html" ]; then
    echo "❌ 预览文件 preview.html 不存在"
    exit 1
fi

echo "✅ 找到预览文件"
echo "🌐 正在启动预览..."

# 获取当前目录的绝对路径
CURRENT_DIR=$(pwd)
PREVIEW_FILE="$CURRENT_DIR/preview.html"

# 尝试使用不同的浏览器打开
if command -v google-chrome &> /dev/null; then
    echo "🚀 使用 Google Chrome 打开预览"
    google-chrome "$PREVIEW_FILE" &
elif command -v chromium-browser &> /dev/null; then
    echo "🚀 使用 Chromium 打开预览"
    chromium-browser "$PREVIEW_FILE" &
elif command -v firefox &> /dev/null; then
    echo "🚀 使用 Firefox 打开预览"
    firefox "$PREVIEW_FILE" &
elif command -v xdg-open &> /dev/null; then
    echo "🚀 使用默认浏览器打开预览"
    xdg-open "$PREVIEW_FILE" &
else
    echo "❌ 未找到可用的浏览器"
    echo "💡 请手动在浏览器中打开: $PREVIEW_FILE"
    exit 1
fi

echo ""
echo "🎯 预览说明："
echo "  1. 预览文件已在浏览器中打开"
echo "  2. 使用顶部导航切换不同页面"
echo "  3. 所有页面都是响应式设计"
echo "  4. 可以测试交互效果和动画"
echo ""
echo "📱 预览特色："
echo "  ✅ 启动页面 - 精美的Logo和加载动画"
echo "  ✅ 登录页面 - 完整的表单和验证"
echo "  ✅ 首页 - 个性化欢迎和快速操作"
echo "  ✅ 分析页面 - 视频上传和AI功能"
echo "  ✅ 学习页面 - 多种练习模式"
echo "  ✅ 个人中心 - 用户信息和统计"
echo ""
echo "💡 提示："
echo "  - 预览文件模拟了真实的小程序体验"
echo "  - 可以在不同设备尺寸下测试响应式效果"
echo "  - 所有交互都有动画反馈"
echo "  - 这是纯前端预览，不包含后端功能"
echo ""
echo "🔗 文件位置: $PREVIEW_FILE"
