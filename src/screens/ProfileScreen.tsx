import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Alert,
  Modal,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


import { useAuth } from '../contexts/AuthContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const [userInfo, setUserInfo] = useState({
    nickname: user?.username || '我是黄智慧',
    location: '杭州',
    userId: user?.id || '12345678',
  });

  const [showEditModal, setShowEditModal] = useState(false);
  const [showPracticeDetail, setShowPracticeDetail] = useState(false);

  // 日历数据
  const calendarData = [
    [27, 28, 29, 30, 31, 1, 2],
    [3, 4, 5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14, 15, 16],
    [17, 18, 19, 20, 21, 22, 23],
  ];

  const practiceData = {
    totalMinutes: 115,
    totalDances: 17,
    todayMinutes: 30,
  };

  // 处理头像点击
  const handleAvatarPress = () => {
    Alert.alert(
      '更换头像',
      '选择头像来源',
      [
        { text: '拍照', onPress: () => Alert.alert('拍照', '打开相机功能') },
        { text: '从相册选择', onPress: () => Alert.alert('相册', '打开相册选择') },
        { text: '取消', style: 'cancel' }
      ]
    );
  };

  // 处理编辑资料
  const handleEditProfile = () => {
    setShowEditModal(true);
  };

  // 处理日历日期点击
  const handleDatePress = (day: number) => {
    if (day === 7 || day === 8) {
      Alert.alert('练习记录', `${day}号的练习记录：\n• 练习时长：30分钟\n• 练习舞蹈：现代舞基础\n• 完成度：85%`);
    } else {
      Alert.alert('练习提醒', `${day}号还没有练习记录，要开始练习吗？`);
    }
  };

  // 处理统计卡片点击
  const handleStatsPress = () => {
    setShowPracticeDetail(true);
  };

  // 处理练习日志
  const handlePracticeLog = () => {
    Alert.alert(
      '练习日志',
      '查看详细练习记录',
      [
        { text: '本周记录', onPress: () => Alert.alert('本周记录', '本周练习了5天，累计180分钟') },
        { text: '本月记录', onPress: () => Alert.alert('本月记录', '本月练习了18天，累计720分钟') },
        { text: '全部记录', onPress: () => Alert.alert('全部记录', '总计练习115小时，完成17支舞蹈') },
        { text: '取消', style: 'cancel' }
      ]
    );
  };

  // 处理上传总结
  const handleUploadSummary = () => {
    Alert.alert(
      '上传练习总结',
      '分享你的练习心得',
      [
        { text: '录制视频', onPress: () => Alert.alert('录制视频', '打开摄像头录制练习视频') },
        { text: '写文字总结', onPress: () => Alert.alert('文字总结', '打开编辑器写练习总结') },
        { text: '取消', style: 'cancel' }
      ]
    );
  };

  // 处理今日练习卡片点击
  const handleTodayPractice = () => {
    Alert.alert(
      '今日练习',
      `今天已练习 ${practiceData.todayMinutes} 分钟`,
      [
        { text: '继续练习', onPress: () => Alert.alert('继续练习', '开始新的练习session') },
        { text: '查看详情', onPress: () => Alert.alert('练习详情', '今日练习：基础芭蕾 30分钟') },
        { text: '取消', style: 'cancel' }
      ]
    );
  };

  // 处理退出登录
  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出当前账号吗？',
      [
        {
          text: '取消',
          style: 'cancel'
        },
        {
          text: '确定退出',
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              Alert.alert('提示', '已成功退出登录');
            } catch (error) {
              Alert.alert('错误', '退出登录失败，请重试');
            }
          }
        }
      ]
    );
  };

  // 处理设置
  const handleSettings = () => {
    Alert.alert(
      '设置',
      '选择设置选项',
      [
        { text: '账号设置', onPress: () => Alert.alert('账号设置', '管理账号信息和安全设置') },
        { text: '通知设置', onPress: () => Alert.alert('通知设置', '管理推送通知和提醒') },
        { text: '隐私设置', onPress: () => Alert.alert('隐私设置', '管理隐私和数据设置') },
        { text: '关于应用', onPress: () => Alert.alert('关于', 'DancingAI v1.0.0\n让舞蹈更智能') },
        { text: '退出登录', style: 'destructive', onPress: handleLogout },
        { text: '取消', style: 'cancel' }
      ]
    );
  };

  // 关闭编辑模态框
  const closeEditModal = () => {
    setShowEditModal(false);
  };

  // 关闭练习详情模态框
  const closePracticeDetail = () => {
    setShowPracticeDetail(false);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5DC" />

      {/* 黄绿渐变背景区域 */}
      <LinearGradient
        colors={['#FFD66E', '#E8FFBD']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 1}}
        style={styles.gradientBackground}
      />

      {/* 头像 - 跨越黄色和白色区域 */}
      <TouchableOpacity style={styles.avatarContainer} onPress={handleAvatarPress}>
        <View style={styles.avatar} />
      </TouchableOpacity>

      {/* 白色内容区域 */}
      <View style={styles.whiteContent}>
        {/* 用户信息 */}
        <View style={styles.userInfoSection}>
          <View style={styles.userInfoLeft}>
            <Text style={styles.nickname}>{userInfo.nickname}</Text>
            <Text style={styles.userDetails}>
              IP : {userInfo.location}　　ID : {userInfo.userId}
            </Text>
          </View>
          <View style={styles.userActions}>
            <TouchableOpacity style={styles.editBtn} onPress={handleEditProfile}>
              <Text style={styles.editBtnText}>编辑资料</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutBtnText}>退出登录</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 日历和统计合并区域 */}
        <View style={styles.calendarStatsSection}>
          {/* 日历区域 */}
          <View style={styles.calendarArea}>
            {calendarData.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.calendarWeek}>
                {week.map((day, dayIndex) => (
                  <TouchableOpacity
                    key={dayIndex}
                    style={[
                      styles.calendarDay,
                      (day === 7 || day === 8) && styles.calendarDayActive,
                    ]}
                    onPress={() => handleDatePress(day)}
                  >
                    <Text
                      style={[
                        styles.calendarDayText,
                        (day === 7 || day === 8) && styles.calendarDayTextActive,
                      ]}
                    >
                      {day}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* 统计卡片 */}
          <TouchableOpacity style={styles.statsCard} onPress={handleStatsPress}>
            <View style={styles.statsContent}>
              <View style={styles.statLeft}>
                <View style={styles.statRow}>
                  <Text style={styles.statNumber}>{practiceData.totalMinutes}</Text>
                  <Text style={styles.statUnit}>min</Text>
                  <View style={styles.statLabelColumn}>
                    <Text style={styles.statLabel}>累计</Text>
                    <Text style={styles.statLabel}>时长</Text>
                  </View>
                </View>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statRight}>
                <View style={styles.statRow}>
                  <Text style={styles.statNumber}>{practiceData.totalDances}</Text>
                  <Text style={styles.statUnit}>支舞</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* 功能按钮区域 */}
        <TouchableOpacity style={styles.functionsRow}>
          <TouchableOpacity style={styles.practiceCard} onPress={handlePracticeLog}>
            <View style={styles.practiceContent}>
              <View style={styles.bookIcon}>
                <View style={styles.bookBack} />
                <View style={styles.bookFront} />
                <View style={styles.bookSpine} />
                <View style={styles.bookPages} />
              </View>
              <View style={styles.practiceTitleContainer}>
                <Text style={styles.practiceTitle}>练习</Text>
                <Text style={styles.practiceTitle}>日志</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadSummary}>
              <Text style={styles.uploadBtnText}>上周总结</Text>
            </TouchableOpacity>
          </TouchableOpacity>

          <View style={styles.rightColumn}>
            <TouchableOpacity style={styles.todayCard} onPress={handleTodayPractice}>
              <Text style={styles.todayLabel}>今日练习</Text>
              <Text style={styles.todayTime}>{practiceData.todayMinutes}min</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsCard} onPress={handleSettings}>
              <Text style={styles.settingsIcon}>⚙️</Text>
              <Text style={styles.settingsTitle}>设置</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        {/* 底部留白 */}
        <View style={styles.bottomSpacing} />
      </View>

      {/* 编辑资料模态框 */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>编辑资料</Text>
            <View style={styles.editForm}>
              <View style={styles.editField}>
                <Text style={styles.editLabel}>昵称</Text>
                <Text style={styles.editValue}>{userInfo.nickname}</Text>
              </View>
              <View style={styles.editField}>
                <Text style={styles.editLabel}>地区</Text>
                <Text style={styles.editValue}>{userInfo.location}</Text>
              </View>
              <View style={styles.editField}>
                <Text style={styles.editLabel}>用户ID</Text>
                <Text style={styles.editValue}>{userInfo.userId}</Text>
              </View>
            </View>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.editModalButton]}
                onPress={() => {
                  Alert.alert('编辑', '打开编辑界面');
                  closeEditModal();
                }}
              >
                <Text style={styles.editModalButtonText}>编辑</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelModalButton]}
                onPress={closeEditModal}
              >
                <Text style={styles.cancelModalButtonText}>取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 练习详情模态框 */}
      <Modal
        visible={showPracticeDetail}
        transparent={true}
        animationType="slide"
        onRequestClose={closePracticeDetail}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>练习统计详情</Text>
            <View style={styles.practiceDetailContent}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>累计练习时长</Text>
                <Text style={styles.detailValue}>{practiceData.totalMinutes} 分钟</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>完成舞蹈数量</Text>
                <Text style={styles.detailValue}>{practiceData.totalDances} 支</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>今日练习</Text>
                <Text style={styles.detailValue}>{practiceData.todayMinutes} 分钟</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>本周练习</Text>
                <Text style={styles.detailValue}>180 分钟</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>平均每日</Text>
                <Text style={styles.detailValue}>25 分钟</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[styles.modalButton, styles.closeButton]}
              onPress={closePracticeDetail}
            >
              <Text style={styles.closeButtonText}>关闭</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5DC',
  },


  gradientBackground: {
    height: 120, // 减小高度为原来的120px
    paddingHorizontal: 20,
    position: 'relative',
  },
  avatarContainer: {
    position: 'absolute',
    left: 30,
    top: 60, // 调整到合适的位置，让头像跨越渐变背景和白色区域
    zIndex: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#C4C4C4',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  whiteContent: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 50,
    marginTop: -30, // 让白色区域稍微重叠渐变区域，创造层次感
  },
  userInfoSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
    marginLeft: 20, // 为头像留出空间
    marginTop: 10, // 调整垂直位置
  },
  userInfoLeft: {
    flex: 0,
  },
  userActions: {
    flexDirection: 'column',
    gap: 6,
  },
  nickname: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  userDetails: {
    fontSize: 12,
    color: '#999',
    lineHeight: 16,
  },
  editBtn: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  editBtnText: {
    fontSize: 12,
    color: '#666',
  },
  logoutBtn: {
    backgroundColor: '#ffebee',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ffcdd2',
  },
  logoutBtnText: {
    fontSize: 12,
    color: '#d32f2f',
    fontWeight: '500',
  },
  // 日历和统计合并区域
  calendarStatsSection: {
    backgroundColor: '#f8f8f8',
    borderRadius: 20,
    padding: 15,
    marginBottom: 20,
  },
  calendarArea: {
    marginBottom: 20,
  },
  calendarWeek: {
    flexDirection: 'row',
    justifyContent: 'space-around', // 改为均匀分布，配合marginHorizontal
    marginBottom: 6, // 减小行间距
  },
  calendarDay: {
    width: 35,
    height: 35,
    borderRadius: 12, // 增大圆角半径
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // 白色背景
    borderWidth: 1,
    borderColor: '#e0e0e0', // 灰色外边线
    marginHorizontal: 2, // 减小框之间的间距
  },
  calendarDayActive: {
    backgroundColor: '#E8FFBD',
    borderColor: '#E8FFBD',
  },
  calendarDayText: {
    fontSize: 16, // 增大字号
    color: '#333',
    fontWeight: '600', // 稍微加粗
  },
  calendarDayTextActive: {
    color: '#333',
    fontWeight: 'bold',
  },
  // 统计卡片样式
  statsCard: {
    backgroundColor: '#000',
    borderRadius: 25,
    overflow: 'hidden',
  },
  statsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
  },
  statLeft: {
    flex: 1,
    alignItems: 'center',
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  statNumber: {
    fontSize: 40, // 数字字号大
    fontWeight: 'bold',
    color: '#fff',
  },
  statUnit: {
    fontSize: 20, // 单位字号小于数字
    color: '#fff',
  },
  statLabel: {
    fontSize: 17, // 标签字号小于数字
    color: '#fff',
    lineHeight: 20,
  },
  statLabelColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 4,
  },
  statDivider: {
    width: 1,
    height: 50,
    backgroundColor: '#444',
    marginHorizontal: 30,
  },
  statRight: {
    flex: 0.6,
    alignItems: 'center',
  },
  // 功能按钮区域
  functionsRow: {
    flexDirection: 'row',
    gap: 15,
    height: 180,
  },
  practiceCard: {
    backgroundColor: '#FFD66E',
    borderRadius: 20,
    padding: 20,
    flex: 1,
    position: 'relative',
    justifyContent: 'space-between',
  },
  rightColumn: {
    flex: 1,
    gap: 15,
    backgroundColor: '#f8f8f8', // 稍微灰一点的背景
    borderRadius: 20,
    padding: 8,
  },
  todayCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 15,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  todayLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  todayTime: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  // 练习日志内容区域
  practiceContent: {
    flex: 0.8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  // 书本图标
  bookIcon: {
    width: 80,
    height: 80,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookBack: {
    width: 60,
    height: 70,
    backgroundColor: '#444',
    borderRadius: 8,
    position: 'absolute',
    transform: [{ rotate: '5deg' }],
  },
  bookFront: {
    width: 60,
    height: 70,
    backgroundColor: '#333',
    borderRadius: 8,
    position: 'absolute',
    zIndex: 2,
  },
  bookSpine: {
    width: 6,
    height: 70,
    backgroundColor: '#222',
    position: 'absolute',
    left: 10,
    borderRadius: 3,
    zIndex: 3,
  },
  bookPages: {
    width: 54,
    height: 64,
    backgroundColor: '#fff',
    borderRadius: 6,
    position: 'absolute',
    top: 3,
    left: 3,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  // 上传按钮
  uploadBtn: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
    alignSelf: 'stretch',
  },
  uploadBtnText: {
    fontSize: 17,
    color: '#666',
    textAlign: 'center',
  },
  practiceTitleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  practiceTitle: {
    fontSize: 32, // 大幅放大字号
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 36,
    textAlign: 'center',
  },
  // 设置卡片
  settingsCard: {
    backgroundColor: '#E8FFBD',
    borderRadius: 20,
    padding: 15,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  settingsIcon: {
    fontSize: 18,
  },
  settingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  // 模态框样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    margin: 40, // 增加margin让Modal更小
    maxHeight: '70%', // 减少最大高度
    width: '75%', // 设置固定宽度而不是minWidth
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#333',
  },
  editForm: {
    marginBottom: 20,
  },
  editField: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  editLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  editValue: {
    fontSize: 16,
    color: '#666',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10, // 减少垂直padding
    borderRadius: 8, // 减少圆角
    alignItems: 'center',
  },
  editModalButton: {
    backgroundColor: '#FFE66E',
  },
  editModalButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  cancelModalButton: {
    backgroundColor: '#f0f0f0',
  },
  cancelModalButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  practiceDetailContent: {
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: '#E8FFBD',
  },
  closeButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  // 底部留白
  bottomSpacing: {
    height: 80, // 底部留白高度
  },
});
