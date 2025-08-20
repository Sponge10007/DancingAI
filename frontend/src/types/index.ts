// 舞蹈视频相关类型
export interface DanceVideo {
  id: string
  title: string
  url: string
  duration: number
  uploadTime: string
  analysisStatus: AnalysisStatus
}

export enum AnalysisStatus {
  PENDING = 'pending',
  ANALYZING = 'analyzing',
  COMPLETED = 'completed',
  FAILED = 'failed'
}

// AI分析结果类型
export interface DanceAnalysisResult {
  videoId: string
  beats: Beat[]
  actions: DanceAction[]
  sections: DanceSection[]
  summary: string
}

export interface Beat {
  time: number
  confidence: number
  type: 'strong' | 'weak'
}

export interface DanceAction {
  id: string
  name: string
  startTime: number
  endTime: number
  description: string
  difficulty: Difficulty
  tips: string[]
}

export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export interface DanceSection {
  id: string
  name: string
  type: SectionType
  startTime: number
  endTime: number
  description: string
}

export enum SectionType {
  INTRO = 'intro',
  VERSE = 'verse',
  CHORUS = 'chorus',
  BRIDGE = 'bridge',
  DANCE_BREAK = 'dance_break',
  OUTRO = 'outro'
}

// 用户相关类型
export interface UserProfile {
  id: string
  username: string
  level: string
  totalPracticeTime: number
  completedCourses: number
  learningDays: number
}

export interface UserProgress {
  videoId: string
  progress: number
  lastPracticeTime: string
  practiceCount: number
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  code?: number
}

// GLM API相关类型
export interface GLMAnalysisRequest {
  videoUrl: string
  analysisType: 'beat' | 'action' | 'section' | 'all'
  options?: {
    language?: 'zh' | 'en'
    detailLevel?: 'basic' | 'detailed'
  }
}

export interface GLMAnalysisResponse {
  requestId: string
  status: 'processing' | 'completed' | 'failed'
  result?: DanceAnalysisResult
  error?: string
}
