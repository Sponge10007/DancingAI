import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function PracticeLogScreen() {
  const navigation = useNavigation();
  const [selectedDate, setSelectedDate] = useState(new Date());

  const practiceData = [
    {
      id: 1,
      date: '2024-01-15',
      title: 'NewJeans - Get Up',
      duration: 25,
      score: 85,
      thumbnail: 'https://via.placeholder.com/60x60/FFB6C1/000000?text=NJ',
      notes: '今天的练习感觉不错，节拍掌握得更好了'
    },
    {
      id: 2,
      date: '2024-01-15',
      title: 'BLACKPINK - Pink Venom',
      duration: 30,
      score: 92,
      thumbnail: 'https://via.placeholder.com/60x60/DDA0DD/000000?text=BP',
      notes: '手部动作还需要加强练习'
    },
    {
      id: 3,
      date: '2024-01-14',
      title: 'IVE - LOVE DIVE',
      duration: 20,
      score: 78,
      thumbnail: 'https://via.placeholder.com/60x60/98FB98/000000?text=IVE',
      notes: '整体表现良好，继续保持'
    }
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 80) return '#FF9800';
    if (score >= 70) return '#2196F3';
    return '#9E9E9E';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
  };

  const getTotalStats = () => {
    const totalDuration = practiceData.reduce((sum, item) => sum + item.duration, 0);
    const averageScore = practiceData.reduce((sum, item) => sum + item.score, 0) / practiceData.length;
    return { totalDuration, averageScore: Math.round(averageScore) };
  };

  const { totalDuration, averageScore } = getTotalStats();

  return (
    <View style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>练习日志</Text>
        <TouchableOpacity>
          <Text style={styles.addButton}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 统计卡片 */}
        <View style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{totalDuration}</Text>
              <Text style={styles.statLabel}>总时长(分钟)</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{practiceData.length}</Text>
              <Text style={styles.statLabel}>练习次数</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{averageScore}</Text>
              <Text style={styles.statLabel}>平均分数</Text>
            </View>
          </View>
        </View>

        {/* 日期选择器 */}
        <View style={styles.dateSelector}>
          <Text style={styles.dateTitle}>选择日期</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['今天', '昨天', '1月13日', '1月12日', '1月11日'].map((date, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.dateButton, index === 0 && styles.dateButtonActive]}
              >
                <Text style={[styles.dateText, index === 0 && styles.dateTextActive]}>
                  {date}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* 练习记录列表 */}
        <View style={styles.practiceList}>
          <Text style={styles.listTitle}>今日练习记录</Text>
          {practiceData.map((item) => (
            <TouchableOpacity key={item.id} style={styles.practiceItem}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumbnail} />
              
              <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemDuration}>{item.duration}分钟</Text>
                <Text style={styles.itemNotes} numberOfLines={2}>
                  {item.notes}
                </Text>
              </View>

              <View style={styles.itemRight}>
                <View style={[styles.scoreContainer, { backgroundColor: getScoreColor(item.score) }]}>
                  <Text style={styles.scoreText}>{item.score}</Text>
                </View>
                <Text style={styles.itemTime}>15:30</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* 添加练习按钮 */}
        <TouchableOpacity style={styles.addPracticeButton}>
          <Text style={styles.addPracticeText}>+ 添加新的练习记录</Text>
        </TouchableOpacity>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    fontSize: 24,
    color: '#333333',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  addButton: {
    fontSize: 24,
    color: '#1890ff',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    margin: 20,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666666',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 15,
  },
  dateSelector: {
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  dateTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  dateButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    marginRight: 10,
  },
  dateButtonActive: {
    backgroundColor: '#1890ff',
  },
  dateText: {
    fontSize: 14,
    color: '#666666',
  },
  dateTextActive: {
    color: '#ffffff',
  },
  practiceList: {
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8f9fa',
  },
  practiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  itemContent: {
    flex: 1,
    marginLeft: 12,
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  itemDuration: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 4,
  },
  itemNotes: {
    fontSize: 12,
    color: '#999999',
    lineHeight: 16,
  },
  itemRight: {
    alignItems: 'center',
  },
  scoreContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  itemTime: {
    fontSize: 10,
    color: '#999999',
  },
  addPracticeButton: {
    backgroundColor: '#1890ff',
    marginHorizontal: 20,
    marginTop: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  addPracticeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
  bottomSpacer: {
    height: 20,
  },
});
