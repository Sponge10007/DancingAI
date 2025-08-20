import { Platform, Alert, Linking } from 'react-native';

// 权限管理工具类
export class PermissionManager {
  
  // 检查并请求相机权限
  static async requestCameraPermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        // Android权限检查逻辑
        // 注意：这里需要在AndroidManifest.xml中添加相应权限
        return true; // 简化处理，实际应用中需要使用react-native-permissions
      } catch (error) {
        console.error('相机权限请求失败:', error);
        return false;
      }
    } else {
      // iOS权限检查逻辑
      return true; // 简化处理
    }
  }

  // 检查并请求存储权限
  static async requestStoragePermission(): Promise<boolean> {
    if (Platform.OS === 'android') {
      try {
        // Android存储权限检查
        return true; // 简化处理
      } catch (error) {
        console.error('存储权限请求失败:', error);
        return false;
      }
    } else {
      // iOS不需要额外的存储权限
      return true;
    }
  }

  // 显示权限被拒绝的提示
  static showPermissionDeniedAlert(permissionType: string) {
    Alert.alert(
      '权限被拒绝',
      `需要${permissionType}权限才能使用此功能。请在设置中开启权限。`,
      [
        { text: '取消', style: 'cancel' },
        { 
          text: '去设置', 
          onPress: () => {
            Linking.openSettings();
          }
        }
      ]
    );
  }

  // 检查视频文件权限
  static async checkVideoFilePermissions(): Promise<boolean> {
    const cameraPermission = await this.requestCameraPermission();
    const storagePermission = await this.requestStoragePermission();
    
    if (!cameraPermission) {
      this.showPermissionDeniedAlert('相机');
      return false;
    }
    
    if (!storagePermission) {
      this.showPermissionDeniedAlert('存储');
      return false;
    }
    
    return true;
  }
}
