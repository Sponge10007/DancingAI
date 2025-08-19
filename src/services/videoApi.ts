// 视频API服务
// 用于管理视频数据的获取、上传等操作

export interface VideoCard {
  id: number;
  title: string;
  subtitle: string;
  videoUrl: string;
  thumbnailUrl: string;
  type: 'recent' | 'recommended' | 'favorite' | 'new' | 'trending';
  progress: number; // 学习进度 0-100
  bgColor: string;
  duration: number; // 视频时长（秒）
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  createdAt?: string;
  updatedAt?: string;
  viewCount?: number;
  likeCount?: number;
  isLiked?: boolean;
  isFavorited?: boolean;
}

export interface VideoApiResponse {
  success: boolean;
  data: VideoCard[];
  message?: string;
  total?: number;
  hasMore?: boolean;
}

class VideoApiService {
  private baseUrl = 'https://your-api-domain.com/api'; // TODO: 替换为实际的API地址
  
  // 获取推荐视频
  async getRecommendedVideos(offset: number = 0, limit: number = 10): Promise<VideoApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/recommended?offset=${offset}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证头
          // 'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('获取推荐视频失败:', error);
      return {
        success: false,
        data: [],
        message: '获取推荐视频失败',
      };
    }
  }

  // 获取用户最近练习的视频
  async getRecentVideos(userId: string): Promise<VideoApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/recent/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证头
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('获取最近视频失败:', error);
      return {
        success: false,
        data: [],
        message: '获取最近视频失败',
      };
    }
  }

  // 获取收藏的视频
  async getFavoriteVideos(userId: string): Promise<VideoApiResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/favorites/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证头
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('获取收藏视频失败:', error);
      return {
        success: false,
        data: [],
        message: '获取收藏视频失败',
      };
    }
  }

  // 更新视频学习进度
  async updateVideoProgress(videoId: number, progress: number, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/${videoId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证头
        },
        body: JSON.stringify({
          userId,
          progress,
          timestamp: new Date().toISOString(),
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('更新视频进度失败:', error);
      return false;
    }
  }

  // 收藏/取消收藏视频
  async toggleVideoFavorite(videoId: number, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/${videoId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证头
        },
        body: JSON.stringify({
          userId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('切换收藏状态失败:', error);
      return false;
    }
  }

  // 点赞/取消点赞视频
  async toggleVideoLike(videoId: number, userId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/${videoId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证头
        },
        body: JSON.stringify({
          userId,
        }),
      });

      return response.ok;
    } catch (error) {
      console.error('切换点赞状态失败:', error);
      return false;
    }
  }

  // 上传用户视频
  async uploadUserVideo(videoFile: any, metadata: Partial<VideoCard>): Promise<VideoApiResponse> {
    try {
      const formData = new FormData();
      formData.append('video', videoFile);
      formData.append('metadata', JSON.stringify(metadata));

      const response = await fetch(`${this.baseUrl}/videos/upload`, {
        method: 'POST',
        headers: {
          // 不设置 Content-Type，让浏览器自动设置
          // TODO: 添加认证头
        },
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('上传视频失败:', error);
      return {
        success: false,
        data: [],
        message: '上传视频失败',
      };
    }
  }

  // 搜索视频
  async searchVideos(query: string, filters?: {
    difficulty?: string;
    tags?: string[];
    duration?: { min: number; max: number };
  }): Promise<VideoApiResponse> {
    try {
      const params = new URLSearchParams({
        q: query,
        ...(filters?.difficulty && { difficulty: filters.difficulty }),
        ...(filters?.tags && { tags: filters.tags.join(',') }),
        ...(filters?.duration && { 
          minDuration: filters.duration.min.toString(),
          maxDuration: filters.duration.max.toString(),
        }),
      });

      const response = await fetch(`${this.baseUrl}/videos/search?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证头
        },
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('搜索视频失败:', error);
      return {
        success: false,
        data: [],
        message: '搜索视频失败',
      };
    }
  }
}

// 导出单例实例
export const videoApi = new VideoApiService();
export default videoApi;
