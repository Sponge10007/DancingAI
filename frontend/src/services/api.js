import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证token等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // 服务器返回错误状态码
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          throw new Error(data.detail || '请求参数错误');
        case 404:
          throw new Error('请求的资源不存在');
        case 500:
          throw new Error('服务器内部错误');
        default:
          throw new Error(data.detail || `请求失败 (${status})`);
      }
    } else if (error.request) {
      // 网络错误
      throw new Error('网络连接失败，请检查网络设置');
    } else {
      // 其他错误
      throw new Error(error.message || '未知错误');
    }
  }
);

// API方法

// 健康检查
export const healthCheck = () => {
  return api.get('/health');
};

// 视频相关API
export const uploadVideo = (file) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return api.post('/api/v1/videos/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    timeout: 60000, // 上传超时时间设置为60秒
  });
};

export const getVideoInfo = (videoId) => {
  return api.get(`/api/v1/videos/${videoId}/info`);
};

export const extractFrames = (videoId, options = {}) => {
  return api.post(`/api/v1/videos/${videoId}/extract-frames`, {}, {
    params: options
  });
};

export const extractAudio = (videoId) => {
  return api.post(`/api/v1/videos/${videoId}/extract-audio`);
};

export const deleteVideo = (videoId) => {
  return api.delete(`/api/v1/videos/${videoId}`);
};

// 节拍检测API
export const detectBeats = (videoId) => {
  return api.post(`/api/v1/beats/${videoId}/detect`);
};

export const getBeatInfo = (videoId) => {
  return api.get(`/api/v1/beats/${videoId}/info`);
};

export const getBeatGrid = (videoId, resolution = 0.25) => {
  return api.get(`/api/v1/beats/${videoId}/grid`, {
    params: { resolution }
  });
};

export const getBeatAtTime = (videoId, timestamp) => {
  return api.get(`/api/v1/beats/${videoId}/at-time`, {
    params: { timestamp }
  });
};

export const analyzeRhythm = (videoId) => {
  return api.get(`/api/v1/beats/${videoId}/rhythm-analysis`);
};

// 姿态检测API
export const detectPoses = (videoId, options = {}) => {
  return api.post(`/api/v1/poses/${videoId}/detect`, {}, {
    params: options
  });
};

export const analyzePoses = (videoId) => {
  return api.get(`/api/v1/poses/${videoId}/analysis`);
};

export const analyzeActions = (videoId) => {
  return api.post(`/api/v1/poses/${videoId}/actions`);
};

export const getActionsSummary = (videoId) => {
  return api.get(`/api/v1/poses/${videoId}/actions/summary`);
};

export const getPoseAtTime = (videoId, timestamp) => {
  return api.get(`/api/v1/poses/${videoId}/poses/at-time`, {
    params: { timestamp }
  });
};

export const analyzeKeypointStability = (videoId) => {
  return api.get(`/api/v1/poses/${videoId}/keypoints/stability`);
};

// 综合分析API（组合多个分析步骤）
export const performFullAnalysis = async (videoId, onProgress) => {
  const results = {};
  
  try {
    // 1. 获取视频信息
    if (onProgress) onProgress({ step: 'video_info', progress: 10 });
    results.videoInfo = await getVideoInfo(videoId);
    
    // 2. 节拍检测
    if (onProgress) onProgress({ step: 'beat_detection', progress: 30 });
    results.beats = await detectBeats(videoId);
    results.beatInfo = await getBeatInfo(videoId);
    
    // 3. 姿态检测
    if (onProgress) onProgress({ step: 'pose_detection', progress: 60 });
    results.poses = await detectPoses(videoId);
    results.poseAnalysis = await analyzePoses(videoId);
    
    // 4. 动作分析
    if (onProgress) onProgress({ step: 'action_analysis', progress: 80 });
    results.actions = await analyzeActions(videoId);
    results.actionsSummary = await getActionsSummary(videoId);
    
    // 5. 完成
    if (onProgress) onProgress({ step: 'complete', progress: 100 });
    
    return results;
  } catch (error) {
    console.error('Full analysis failed:', error);
    throw error;
  }
};

// 工具函数
export const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export default api;
