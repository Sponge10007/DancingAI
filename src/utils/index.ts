// 格式化时间
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

// 格式化文件大小
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 节流函数
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean = false
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
}

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// 验证视频文件
export const validateVideoFile = (file: any): boolean => {
  const allowedTypes = ['video/mp4', 'video/mov', 'video/avi', 'video/mkv']
  const maxSize = 100 * 1024 * 1024 // 100MB
  
  return allowedTypes.includes(file.type) && file.size <= maxSize
}

// React Native 原生API
import { Alert, Dimensions, Platform } from 'react-native'

// 显示提示信息 - 使用React Native Alert
export const showToast = (title: string, icon: 'success' | 'error' | 'loading' | 'none' = 'none') => {
  Alert.alert('提示', title)
}

// 显示加载提示
export const showLoading = (title: string = '加载中...') => {
  console.log(`Loading: ${title}`)
  // React Native中可以使用第三方库如react-native-loading-spinner-overlay
}

// 隐藏加载提示
export const hideLoading = () => {
  console.log('Hide loading')
}

// 确认对话框
export const showConfirm = (title: string, content: string): Promise<boolean> => {
  return new Promise((resolve) => {
    Alert.alert(
      title,
      content,
      [
        {
          text: '取消',
          style: 'cancel',
          onPress: () => resolve(false)
        },
        {
          text: '确定',
          onPress: () => resolve(true)
        }
      ]
    )
  })
}

// 获取系统信息
export const getSystemInfo = () => {
  const { width, height } = Dimensions.get('window')
  return {
    platform: Platform.OS,
    version: Platform.Version.toString(),
    screenWidth: width,
    screenHeight: height
  }
}
