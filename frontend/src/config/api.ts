// API配置文件
export const API_CONFIG = {
  // GLM-4.5V API配置
  GLM: {
    API_KEY: '634bc543a0c940d283cf51a706e9c082.mQ6Vp2sP6gfPGzT0', // 请替换为您的实际API密钥
    BASE_URL: 'https://open.bigmodel.cn/api/paas/v4',
    MODEL: 'glm-4v-plus',
    ENDPOINTS: {
      CHAT_COMPLETIONS: '/chat/completions'
    }
  },
  
  // 请求配置
  REQUEST: {
    TIMEOUT: 30000, // 30秒超时
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000 // 1秒重试延迟
  },
  
  // 视频分析配置
  VIDEO_ANALYSIS: {
    MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
    SUPPORTED_FORMATS: ['mp4', 'mov', 'avi', 'mkv'],
    MAX_DURATION: 300, // 5分钟
    ANALYSIS_PROMPT: `请分析这个舞蹈视频，从以下几个方面给出专业评价：

1. 节拍感和音乐配合度 (0-25分)
2. 动作的准确性和流畅性 (0-25分) 
3. 身体协调性和平衡感 (0-25分)
4. 表情和舞台表现力 (0-25分)

请给出：
- 综合评分（0-100分）
- 具体的优点和需要改进的地方（3-5条）
- 针对性的练习建议（3-5条）

请严格按照以下JSON格式返回结果：
{
  "score": 数字,
  "feedback": ["反馈1", "反馈2", "反馈3"],
  "improvements": ["建议1", "建议2", "建议3"]
}`
  }
};

// 环境变量检查
export const validateAPIConfig = () => {
  if (!API_CONFIG.GLM.API_KEY || API_CONFIG.GLM.API_KEY === 'your-glm-api-key-here') {
    console.warn('⚠️ GLM API密钥未配置，请在src/config/api.ts中设置您的API密钥');
    return false;
  }
  return true;
};
