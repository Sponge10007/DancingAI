import Taro from '@tarojs/taro'
import { GLMAnalysisRequest, GLMAnalysisResponse, DanceAnalysisResult } from '../types'

// GLM API配置
const GLM_API_CONFIG = {
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  apiKey: '', // 需要用户配置自己的API Key
  model: 'glm-4o-mini' // 使用GLM-4o-mini模型
}

// 获取API Key
const getApiKey = (): string => {
  // TODO: 从用户配置或环境变量获取
  return GLM_API_CONFIG.apiKey
}

// 上传视频到GLM
export const uploadVideoToGLM = async (filePath: string): Promise<string> => {
  try {
    // 这里需要根据GLM API的具体要求实现文件上传
    // 可能需要先上传到自己的服务器，然后传递URL给GLM
    console.log('Uploading video:', filePath)
    
    // 模拟上传过程
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // 返回模拟的视频URL
    return `https://example.com/videos/${Date.now()}.mp4`
  } catch (error) {
    console.error('Video upload failed:', error)
    throw new Error('视频上传失败')
  }
}

// 调用GLM API分析舞蹈视频
export const analyzeDanceVideo = async (
  request: GLMAnalysisRequest
): Promise<GLMAnalysisResponse> => {
  try {
    const apiKey = getApiKey()
    if (!apiKey) {
      throw new Error('请先配置GLM API Key')
    }

    // 构建GLM API请求
    const prompt = buildAnalysisPrompt(request)
    
    // 使用fetch API替代Taro.request以支持多端
    const response = await fetch(`${GLM_API_CONFIG.baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: GLM_API_CONFIG.model,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: prompt
              },
              {
                type: 'video',
                video_url: {
                  url: request.videoUrl
                }
              }
            ]
          }
        ],
        max_tokens: 4000,
        temperature: 0.1
      })
    })

    if (response.ok) {
      const data = await response.json()
      return parseGLMResponse(data)
    } else {
      throw new Error(`API请求失败: ${response.statusCode}`)
    }
  } catch (error) {
    console.error('GLM API call failed:', error)
    throw error
  }
}

// 构建分析提示词
const buildAnalysisPrompt = (request: GLMAnalysisRequest): string => {
  const basePrompt = `
请分析这个舞蹈视频，并提供以下信息：

1. 节拍分析：识别舞蹈的节拍点和节奏模式
2. 动作解析：识别关键舞蹈动作，提供文字描述和指导
3. 视频分段：识别主歌、副歌、间奏等不同段落
4. 整体总结：舞蹈风格、难度评估、学习建议

请以JSON格式返回结果，包含以下结构：
{
  "beats": [{"time": 秒数, "confidence": 置信度, "type": "strong/weak"}],
  "actions": [{"name": "动作名称", "startTime": 开始时间, "endTime": 结束时间, "description": "描述", "difficulty": "easy/medium/hard", "tips": ["提示1", "提示2"]}],
  "sections": [{"name": "段落名称", "type": "intro/verse/chorus/bridge/dance_break/outro", "startTime": 开始时间, "endTime": 结束时间, "description": "描述"}],
  "summary": "整体总结"
}
`

  if (request.analysisType === 'beat') {
    return basePrompt + '\n\n请重点分析节拍和节奏。'
  } else if (request.analysisType === 'action') {
    return basePrompt + '\n\n请重点分析舞蹈动作。'
  } else if (request.analysisType === 'section') {
    return basePrompt + '\n\n请重点分析视频分段。'
  }
  
  return basePrompt
}

// 解析GLM API响应
const parseGLMResponse = (response: any): GLMAnalysisResponse => {
  try {
    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('API响应格式错误')
    }

    // 尝试解析JSON内容
    const result = JSON.parse(content)
    
    return {
      requestId: response.id || Date.now().toString(),
      status: 'completed',
      result: result as DanceAnalysisResult
    }
  } catch (error) {
    console.error('Failed to parse GLM response:', error)
    return {
      requestId: response.id || Date.now().toString(),
      status: 'failed',
      error: '响应解析失败'
    }
  }
}

// 检查分析状态
export const checkAnalysisStatus = async (requestId: string): Promise<GLMAnalysisResponse> => {
  try {
    // 这里应该调用GLM API检查任务状态
    // 目前返回模拟结果
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return {
      requestId,
      status: 'completed',
      result: {
        videoId: 'mock-video-id',
        beats: [],
        actions: [],
        sections: [],
        summary: '分析完成'
      }
    }
  } catch (error) {
    console.error('Status check failed:', error)
    throw error
  }
}
