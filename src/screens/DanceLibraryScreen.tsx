import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';

const {width: screenWidth} = Dimensions.get('window');

export default function DanceLibraryScreen() {
  const [activeTab, setActiveTab] = useState('recent'); // recent, create, favorite
  const [searchText, setSearchText] = useState('');

  const tabs = [
    {id: 'recent', name: '最近'},
    {id: 'create', name: '创建'},
    {id: 'favorite', name: '收藏'},
  ];

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  // 渲染不同标签页的内容
  const renderTabContent = () => {
    switch (activeTab) {
      case 'recent':
        return (
          <ScrollView style={styles.tabContent}>
            {/* 搜索栏 */}
            <View style={styles.searchSection}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search"
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={handleSearch}
              />
            </View>

            {/* 快捷卡片 */}
            <View style={styles.quickCards}>
              <TouchableOpacity style={[styles.card, styles.recentPractice]}>
                <Text style={styles.cardTitle}>最近练习</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.card, styles.heartPlaylist]}>
                <Text style={styles.cardTitle}>红心舞单</Text>
              </TouchableOpacity>
            </View>

            {/* 续播提示 */}
            <View style={styles.continueSection}>
              <Text style={styles.continueText}>
                从上次的《不知道啥》续起？
              </Text>
            </View>

            {/* 内容网格 */}
            <View style={styles.contentGrid}>
              {/* 第一行：左侧大卡片 + 右侧两个小卡片 */}
              <View style={styles.gridRow}>
                <View style={[styles.gridItem, styles.large]} />
                <View style={styles.gridColumn}>
                  <View style={[styles.gridItem, styles.small]} />
                  <View style={[styles.gridItem, styles.small]} />
                </View>
              </View>

              {/* 第二行：三个卡片 */}
              <View style={styles.gridRow}>
                <View style={[styles.gridItem, styles.medium]} />
                <View style={[styles.gridItem, styles.medium]} />
                <View style={[styles.gridItem, styles.medium]} />
              </View>
            </View>
          </ScrollView>
        );
      case 'create':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.placeholderText}>创建页面内容待开发</Text>
          </View>
        );
      case 'favorite':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.placeholderText}>收藏页面内容待开发</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* 顶部导航栏 */}
      <View style={styles.topNavigation}>
        <Text style={styles.navIcon}>💎</Text>
        <Text style={styles.navTitle}>资源页导航</Text>
      </View>

      {/* 标签页导航 */}
      <View style={styles.tabNavigation}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.id}
            style={styles.tabItem}
            onPress={() => handleTabChange(tab.id)}>
            <Text
              style={[
                styles.tabText,
                activeTab === tab.id && styles.tabTextActive,
              ]}>
              {tab.name}
            </Text>
            {activeTab === tab.id && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        ))}
      </View>

      {/* 标签页内容 */}
      {renderTabContent()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  topNavigation: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingTop: 50, // 为状态栏留空间
  },
  navIcon: {
    fontSize: 18,
    color: '#8B5CF6',
  },
  navTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#8B5CF6',
  },
  tabNavigation: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 15,
    position: 'relative',
  },
  tabText: {
    fontSize: 16,
    color: '#999',
  },
  tabTextActive: {
    color: '#333',
    fontWeight: '500',
  },
  tabUnderline: {
    position: 'absolute',
    bottom: 0,
    width: 30,
    height: 2,
    backgroundColor: '#333',
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  searchSection: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    fontSize: 14,
    color: '#333',
  },
  quickCards: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 20,
  },
  card: {
    flex: 1,
    height: 80,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recentPractice: {
    backgroundColor: '#B3E5A3',
  },
  heartPlaylist: {
    backgroundColor: '#FFB366',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  continueSection: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
  },
  continueText: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
  },
  contentGrid: {
    gap: 15,
  },
  gridRow: {
    flexDirection: 'row',
    gap: 15,
    marginBottom: 15,
  },
  gridItem: {
    backgroundColor: '#ccc',
    borderRadius: 12,
  },
  large: {
    flex: 1,
    height: 250,
  },
  medium: {
    flex: 1,
    height: 120,
  },
  small: {
    height: 120,
  },
  gridColumn: {
    flex: 1,
    gap: 15,
    marginLeft: 15,
  },
  placeholderText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 16,
    marginTop: 50,
  },
});
