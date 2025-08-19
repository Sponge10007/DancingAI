import { API_CONFIG, validateAPIConfig } from '../config/api';

// GLM API响应类型定义
interface GLMResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// 视频分析结果类型
export interface VideoAnalysisResult {
  score: number;
  feedback: string[];
  improvements: string[];
}

// GLM服务类
export class GLMService {
  private static instance: GLMService;
  
  public static getInstance(): GLMService {
    if (!GLMService.instance) {
      GLMService.instance = new GLMService();
    }
    return GLMService.instance;
  }

  // 分析视频
  async analyzeVideo(videoData: string): Promise<VideoAnalysisResult> {
    if (!validateAPIConfig()) {
      throw new Error('GLM API配置无效');
    }

    try {
      const response = await this.callGLMAPI(videoData);
      return this.parseAnalysisResult(response);
    } catch (error) {
      console.error('GLM视频分析失败:', error);
      throw error;
    }
  }

  // 调用GLM API
  private async callGLMAPI(videoData: string): Promise<GLMResponse> {
    const url = `${API_CONFIG.GLM.BASE_URL}${API_CONFIG.GLM.ENDPOINTS.CHAT_COMPLETIONS}`;
    
    const requestBody = {
      model: API_CONFIG.GLM.MODEL,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: API_CONFIG.VIDEO_ANALYSIS.ANALYSIS_PROMPT
            },
            {
              type: "video_url",
              video_url: {
                url: videoData
              }
            }
          ]
        }
      ],
      temperature: 0.7,
      max_tokens: 1500,
      stream: false
    };

    // 重试机制
    let lastError: Error | null = null;
    for (let attempt = 1; attempt <= API_CONFIG.REQUEST.MAX_RETRIES; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.REQUEST.TIMEOUT);

        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_CONFIG.GLM.API_KEY}`,
            'User-Agent': 'DancingAI/1.0'
          },
          body: JSON.stringify(requestBody),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`API请求失败 (${response.status}): ${errorText}`);
        }

        const data: GLMResponse = await response.json();
        
        if (!data.choices || data.choices.length === 0) {
          throw new Error('API返回数据格式错误');
        }

        return data;

      } catch (error) {
        lastError = error as Error;
        console.warn(`GLM API调用失败 (尝试 ${attempt}/${API_CONFIG.REQUEST.MAX_RETRIES}):`, error);
        
        if (attempt < API_CONFIG.REQUEST.MAX_RETRIES) {
          await this.delay(API_CONFIG.REQUEST.RETRY_DELAY * attempt);
        }
      }
    }

    throw lastError || new Error('GLM API调用失败');
  }

  // 解析分析结果
  private parseAnalysisResult(response: GLMResponse): VideoAnalysisResult {
    const content = response.choices[0].message.content;
    
    try {
      // 尝试解析JSON格式的响应
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          score: Math.max(0, Math.min(100, parsed.score || 0)),
          feedback: Array.isArray(parsed.feedback) ? parsed.feedback : ['分析完成'],
          improvements: Array.isArray(parsed.improvements) ? parsed.improvements : ['继续练习']
        };
      }
    } catch (parseError) {
      console.warn('JSON解析失败，使用文本解析:', parseError);
    }

    // 备用文本解析
    return this.parseTextResponse(content);
  }

  // 文本响应解析
  private parseTextResponse(text: string): VideoAnalysisResult {
    const lines = text.split('\n').filter(line => line.trim());
    
    let score = 75; // 默认分数
    const feedback: string[] = [];
    const improvements: string[] = [];
    
    // 提取分数
    const scorePatterns = [
      /评分[：:]?\s*(\d+)/i,
      /得分[：:]?\s*(\d+)/i,
      /(\d+)\s*分/,
      /(\d+)\/100/
    ];
    
    for (const pattern of scorePatterns) {
      const match = text.match(pattern);
      if (match) {
        score = Math.max(0, Math.min(100, parseInt(match[1])));
        break;
      }
    }
    
    // 提取反馈和建议
    lines.forEach(line => {
      const cleanLine = line.replace(/^[•\-\*\d\.]\s*/, '').trim();
      if (!cleanLine) return;
      
      if (line.includes('优点') || line.includes('表现') || line.includes('不错') || 
          line.includes('流畅') || line.includes('准确') || line.includes('协调')) {
        feedback.push(cleanLine);
      } else if (line.includes('建议') || line.includes('改进') || line.includes('练习') ||
                 line.includes('注意') || line.includes('加强') || line.includes('提高')) {
        improvements.push(cleanLine);
      }
    });
    
    // 确保有内容
    if (feedback.length === 0) {
      feedback.push('AI已完成视频分析，整体表现良好');
    }
    if (improvements.length === 0) {
      improvements.push('继续保持练习，注意动作的准确性和流畅性');
    }
    
    return { score, feedback, improvements };
  }

  // 延迟函数
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // 验证视频格式
  static validateVideoFile(filePath: string): boolean {
    const extension = filePath.split('.').pop()?.toLowerCase();
    return extension ? API_CONFIG.VIDEO_ANALYSIS.SUPPORTED_FORMATS.includes(extension) : false;
  }

  // 检查文件大小（需要实际文件信息）
  static validateFileSize(fileSize: number): boolean {
    return fileSize <= API_CONFIG.VIDEO_ANALYSIS.MAX_FILE_SIZE;
  }
}
