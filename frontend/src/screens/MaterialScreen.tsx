import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  FlatList,
  TextInput,
  StatusBar,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import Svg, { Path, G, Defs, ClipPath, Rect } from 'react-native-svg';

const { width: screenWidth } = Dimensions.get('window');

// 搜索图标组件
const SearchIcon = ({ size = 20 }) => (
  <Svg width={size} height={size} viewBox="0 0 23 24" fill="none">
    <G clipPath="url(#clip0_223_791)">
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M20.6426 22.8163C20.9113 23.085 21.2655 23.2194 21.632 23.2194C22.4259 23.2194 23 22.6086 23 21.8269C23 21.4605 22.8778 21.1185 22.6091 20.8497L16.8561 15.0845C18.0653 13.4966 18.786 11.5301 18.786 9.3925C18.786 4.22574 14.5597 -0.000488281 9.39299 -0.000488281C4.21401 -0.000488281 0 4.22574 0 9.3925C0 14.5592 4.21401 18.7855 9.39299 18.7855C11.4206 18.7855 13.3139 18.1259 14.8529 17.0266L20.6426 22.8163ZM9.39299 2.02762C13.4238 2.02762 16.7584 5.36219 16.7584 9.39299C16.7584 13.4238 13.4238 16.7584 9.39299 16.7584C5.34997 16.7584 2.02762 13.4238 2.02762 9.39299C2.02762 5.36219 5.34997 2.02762 9.39299 2.02762Z"
        fill="#999"
      />
    </G>
    <Defs>
      <ClipPath id="clip0_223_791">
        <Rect width="23" height="23.2199" fill="white"/>
      </ClipPath>
    </Defs>
  </Svg>
);

// 返回按钮图标组件
const BackIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 33 33" fill="none">
    <Path
      d="M20.625 6.875L12.375 16.5L20.625 26.125"
      stroke="black"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 简单爱心图标组件
const SimpleHeartIcon = ({ size = 24, filled = false }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill={filled ? "#000" : "none"}
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 播放按钮图标组件 - 使用您提供的play.svg
const PlayIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 23 23" fill="none">
    <Path
      d="M2.8728 11.4908V18.1621C2.8728 20.3741 5.29928 21.7712 7.27474 20.6978L10.3418 19.0297M2.8728 7.6605V4.81939C2.8728 2.60741 5.29928 1.21032 7.27474 2.28375L19.5431 8.95608C20.003 9.20066 20.3877 9.56576 20.656 10.0123C20.9243 10.4588 21.066 10.9699 21.066 11.4908C21.066 12.0117 20.9243 12.5228 20.656 12.9693C20.3877 13.4158 20.003 13.7809 19.5431 14.0254L13.4089 17.3616"
      stroke="black"
      strokeWidth="1.43635"
      strokeLinecap="round"
    />
  </Svg>
);

// 垃圾桶图标组件 - 使用您提供的trash-bin.svg
const TrashIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6.52401C3 6.12901 3.327 5.81001 3.73 5.81001H8.518C8.524 4.96801 8.616 3.81501 9.45 3.01701C10.137 2.36178 11.0506 1.9974 12 2.00001C12.9494 1.9974 13.863 2.36178 14.55 3.01701C15.384 3.81501 15.476 4.96801 15.482 5.81001H20.27C20.673 5.81001 21 6.13001 21 6.52401C20.9992 6.61891 20.9797 6.71271 20.9425 6.80003C20.9054 6.88735 20.8513 6.96646 20.7835 7.03281C20.7156 7.09916 20.6353 7.15145 20.5472 7.18667C20.4591 7.22189 20.3649 7.23934 20.27 7.23801H3.73C3.63511 7.23934 3.5409 7.22189 3.45278 7.18667C3.36466 7.15145 3.28437 7.09916 3.21653 7.03281C3.14869 6.96646 3.09463 6.88735 3.05747 6.80003C3.02031 6.71271 3.00078 6.61891 3 6.52401ZM11.607 22H12.394C15.101 22 16.454 22 17.334 21.137C18.214 20.274 18.305 18.857 18.485 16.026L18.745 11.946C18.843 10.409 18.891 9.64001 18.45 9.15401C18.008 8.66701 17.263 8.66701 15.771 8.66701H8.23C6.739 8.66701 5.993 8.66701 5.551 9.15401C5.11 9.64001 5.159 10.409 5.256 11.945L5.516 16.025C5.696 18.858 5.786 20.274 6.666 21.137C7.546 22 8.9 22 11.607 22Z"
      fill="white"
    />
  </Svg>
);

// 简单爱心图标组件 - 移除加号
const HeartPlusIcon = ({ size = 24 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      stroke="#000"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

// 火焰图标组件
const FireIcon = ({ size = 40 }) => (
  <Svg width={size} height={size} viewBox="0 0 80 80" fill="none">
    <Path
      d="M42.7733 72.67C53.1933 70.5833 66.6667 63.0867 66.6667 43.7033C66.6667 26.0667 53.7567 14.32 44.4733 8.92333C42.41 7.72333 40 9.29999 40 11.6833V17.7767C40 22.5833 37.98 31.3567 32.3667 35.0067C29.5 36.87 26.4 34.08 26.0533 30.68L25.7667 27.8867C25.4333 24.64 22.1267 22.67 19.5333 24.65C14.87 28.2 10 34.4333 10 43.7C10 67.4033 27.63 73.3333 36.4433 73.3333C36.9589 73.3333 37.4967 73.3167 38.0567 73.2833C39.5433 73.0967 38.0567 73.6133 42.7733 72.6667"
      fill="#181C02"
    />
    <Path
      d="M26.6666 61.48C26.6666 70.2134 33.7033 72.9134 38.0566 73.2867C39.5433 73.1 38.0566 73.6167 42.7733 72.67C46.2366 71.4467 50 68.3067 50 61.48C50 57.1567 47.27 54.4867 45.1333 53.2367C44.48 52.8534 43.72 53.3367 43.6633 54.09C43.4766 56.4834 41.1766 58.39 39.6133 56.57C38.23 54.9634 37.6466 52.6134 37.6466 51.11V49.1434C37.6466 47.9634 36.4566 47.1767 35.4366 47.7834C31.65 50.0267 26.6666 54.6467 26.6666 61.48Z"
      fill="#FFD66E"
    />
  </Svg>
);

// 爱心图标组件
const HeartsIcon = ({ size = 40 }) => (
  <Svg width={size} height={size} viewBox="0 0 92 92" fill="none">
    <Path
      d="M13.9468 46.2613C18.2464 60.5306 32.3329 64.5791 43.0167 68.7855C46.7857 70.268 50.4016 71.6462 53.3359 70.7621C56.2702 69.878 58.5237 66.7344 60.8445 63.4106C67.4306 54.007 76.9317 42.848 72.6331 28.5816C68.3345 14.3152 49.1448 9.05175 40.0748 26.751C22.7364 17.0089 9.64731 31.9919 13.9468 46.2613Z"
      fill="white"
    />
    <Path
      d="M60.1629 45.6186C50.4992 39.8373 43.3949 48.3921 45.8917 56.6785C48.155 64.1902 54.7819 66.9144 60.4238 69.2377L60.5847 69.3044L62.1471 69.9539C64.2425 70.8429 66.2524 71.6711 67.8663 71.1849C69.4801 70.6986 70.6979 68.8978 71.9534 66.9992C75.5101 61.6162 80.6663 55.2423 78.1686 46.953C77.349 44.233 75.6498 42.0564 73.5615 40.7236C69.3011 38.0033 63.427 38.797 60.1629 45.6186Z"
      fill="black"
    />
  </Svg>
);

export default function MaterialScreen() {
  const [searchText, setSearchText] = useState('');
  const [currentView, setCurrentView] = useState('main'); // 'main', 'recent', 'favorites', 'single'
  const [selectedPlaylist, setSelectedPlaylist] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [songToDelete, setSongToDelete] = useState<any>(null);
  const [favoriteSongs, setFavoriteSongs] = useState<Set<string>>(new Set(['1', '3'])); // 默认收藏歌曲1和3
  const [swipedItem, setSwipedItem] = useState<string | null>(null); // 当前滑动的项目
  const [songs, setSongs] = useState([
    {
      id: '1',
      title: 'Gee',
      subtitle: 'Girls’ Generation',
      date: '2025年8月18日',
      duration: '00:37:13',
      isLiked: true,
      color: '#E8FFBD',
    },
    {
      id: '2',
      title: 'Gangnam Style',
      subtitle: 'PSY',
      date: '2025年8月18日',
      duration: '00:37:13',
      isLiked: false,
      color: '#FFE66E',
    },
    {
      id: '3',
      title: 'I Am the Best',
      subtitle: '2NE1',
      date: '2025年8月18日',
      duration: '00:37:13',
      isLiked: false,
      color: '#FFE66E',
    },
    {
      id: '4',
      title: 'Loseur',
      subtitle: 'BIGBANG / Lies',
      date: '2025年8月18日',
      duration: '00:37:13',
      isLiked: true,
      color: '#333',
    },
    {
      id: '5',
      title: 'Dynamite',
      subtitle: 'BTS',
      date: '2025年8月18日',
      duration: '00:37:13',
      isLiked: true,
      color: '#FFE66E',
    },
  ]);

  // 处理收藏切换
  const toggleFavorite = (songId: string) => {
    const newFavorites = new Set(favoriteSongs);
    if (newFavorites.has(songId)) {
      newFavorites.delete(songId);
      Alert.alert('取消收藏', '已从红心舞单中移除');
    } else {
      newFavorites.add(songId);
      Alert.alert('添加收藏', '已添加到红心舞单');
    }
    setFavoriteSongs(newFavorites);
  };

  // 处理播放歌曲
  const handlePlaySong = (song: any) => {
    Alert.alert('开始播放', `正在播放: ${song.title}—${song.subtitle}`);
  };

  // 处理搜索
  const handleSearch = () => {
    if (searchText.trim()) {
      Alert.alert('搜索', `搜索内容: ${searchText}`);
    } else {
      Alert.alert('搜索', '请输入搜索内容');
    }
  };

  // 处理新建舞单
  const handleNewPlaylist = () => {
    Alert.alert('新建舞单', '创建新的舞单功能');
  };

  // 处理新建歌曲
  const handleNewSong = () => {
    Alert.alert('添加歌曲', '添加新歌曲到舞单');
  };

  // 处理编辑
  const handleEdit = () => {
    Alert.alert('编辑', '进入编辑模式');
  };

  // 处理删除歌曲
  const handleDeleteSong = (song: any) => {
    setSongToDelete(song);
    setShowDeleteModal(true);
  };

  // 确认删除
  const confirmDelete = () => {
    if (songToDelete) {
      // 从歌曲列表中删除
      setSongs(prevSongs => prevSongs.filter(song => song.id !== songToDelete.id));
      // 从收藏中删除
      const newFavorites = new Set(favoriteSongs);
      newFavorites.delete(songToDelete.id);
      setFavoriteSongs(newFavorites);

      Alert.alert('删除成功', `"${songToDelete.title}" 已被删除`);
    }
    setShowDeleteModal(false);
    setSongToDelete(null);
  };

  // 取消删除
  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSongToDelete(null);
  };

  // 舞蹈列表数据
  const playlists = [
    {
      id: '1',
      title: 'Hip-Hop',
      songCount: 13,
      lastUpdated: '最近更新3天前',
      color: '#E8FFBD',
    },
    {
      id: '2',
      title: 'K-pop',
      songCount: 13,
      lastUpdated: '最近更新3天前',
      color: '#E8FFBD',
    },
    {
      id: '3',
      title: '芭蕾舞',
      songCount: 13,
      lastUpdated: '最近更新3天前',
      color: '#FFE66E',
    },
    {
      id: '4',
      title: '拉丁舞',
      songCount: 13,
      lastUpdated: '最近更新3天前',
      color: '#333',
    },
  ];



  // 渲染主页面
  const renderMainView = () => (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* 搜索栏 */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <SearchIcon size={18} />
          <TextInput
            style={styles.searchInput}
            placeholder="搜索舞单・舞蹈"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* 快捷按钮 */}
      <View style={styles.quickButtonsContainer}>
        <TouchableOpacity
          style={[styles.quickButton, { backgroundColor: '#E8FFBD' }]}
          onPress={() => setCurrentView('recent')}
        >
          <View style={styles.quickButtonIcon}>
            <FireIcon size={50} />
          </View>
          <Text style={styles.quickButtonText}>最近{'\n'}常练</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.quickButton, { backgroundColor: '#FFE66E' }]}
          onPress={() => setCurrentView('favorites')}
        >
          <View style={styles.quickButtonIcon}>
            <HeartsIcon size={50} />
          </View>
          <Text style={styles.quickButtonText}>红心{'\n'}舞单</Text>
        </TouchableOpacity>
      </View>

      {/* Dancelist 标题 */}
      <View style={styles.dancelistHeader}>
        <Text style={styles.dancelistTitle}>Dancelist</Text>
        <TouchableOpacity style={styles.newButton} onPress={handleNewPlaylist}>
          <Text style={styles.newButtonText}>+New</Text>
        </TouchableOpacity>
      </View>

      {/* 舞蹈列表 */}
      <View style={styles.playlistContainer}>
        {playlists.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.playlistItem}
            onPress={() => {
              setSelectedPlaylist(item);
              setCurrentView('single');
            }}
          >
            <View style={[styles.playlistThumbnail, { backgroundColor: item.color }]} />
            <View style={styles.playlistInfo}>
              <Text style={styles.playlistTitle}>{item.title}</Text>
              <Text style={styles.playlistMeta}>{item.songCount}首歌</Text>
              <Text style={styles.playlistMeta}>{item.lastUpdated}</Text>
            </View>
            <TouchableOpacity style={styles.playlistAction}>
              <Text style={styles.actionIcon}>↗</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
        
        {/* 查看全部按钮 */}
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>全部</Text>
          <Text style={styles.viewAllArrow}>{'>'}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  // 渲染最近常练页面
  const renderRecentView = () => (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.subPageHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentView('main')}
        >
          <BackIcon size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <SearchIcon size={18} />
        </TouchableOpacity>
      </View>

      {/* 标题区域 */}
      <View style={styles.pageTitle}>
        <View style={styles.pageTitleIcon}>
          <FireIcon size={40} />
        </View>
        <Text style={styles.pageTitleText}>最近常练</Text>
      </View>

      {/* 歌曲列表 */}
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={item => item.id}
        style={styles.songList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  // 渲染红心舞单页面
  const renderFavoritesView = () => (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.subPageHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentView('main')}
        >
          <BackIcon size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <SearchIcon size={18} />
        </TouchableOpacity>
      </View>

      {/* 标题区域 */}
      <View style={styles.pageTitle}>
        <View style={styles.pageTitleIcon}>
          <HeartsIcon size={40} />
        </View>
        <Text style={styles.pageTitleText}>红心舞单</Text>
        <Text style={styles.songCount}>13首</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>编辑</Text>
        </TouchableOpacity>
      </View>

      {/* +New 按钮 */}
      <TouchableOpacity style={styles.newSongButton} onPress={handleNewSong}>
        <Text style={styles.newSongButtonText}>+New</Text>
      </TouchableOpacity>

      {/* 歌曲列表 */}
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={item => item.id}
        style={styles.songList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  // 渲染单个舞蹈页面
  const renderSingleView = () => (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.subPageHeader}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => setCurrentView('main')}
        >
          <BackIcon size={24} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <SearchIcon size={18} />
        </TouchableOpacity>
      </View>

      {/* 背景图片区域 */}
      <View style={styles.singlePageBanner}>
        <View style={styles.bannerOverlay}>
          <Text style={styles.bannerTitle}>RED VELVET</Text>
        </View>
      </View>

      {/* 舞蹈信息 */}
      <View style={styles.singlePageInfo}>
        <Text style={styles.singlePageTitle}>{selectedPlaylist?.title || '偶尔跳一下'}</Text>
        <Text style={styles.singlePageMeta}>13首</Text>
        <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
          <Text style={styles.editButtonText}>编辑</Text>
        </TouchableOpacity>
      </View>

      {/* +New 按钮 */}
      <TouchableOpacity style={styles.newSongButton} onPress={handleNewSong}>
        <Text style={styles.newSongButtonText}>+New</Text>
      </TouchableOpacity>

      {/* 歌曲列表 */}
      <FlatList
        data={songs}
        renderItem={renderSongItem}
        keyExtractor={item => item.id}
        style={styles.songList}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  // 可滑动歌曲项组件
  const SwipeableSongItem = ({ item }: { item: any }) => {
    const isFavorited = favoriteSongs.has(item.id);
    const isSwipedOpen = swipedItem === item.id;

    const handleSwipe = () => {
      if (isSwipedOpen) {
        setSwipedItem(null);
      } else {
        setSwipedItem(item.id);
      }
    };

    const handleDelete = () => {
      handleDeleteSong(item);
      setSwipedItem(null);
    };

    return (
      <View style={styles.swipeContainer}>
        {/* 删除按钮背景 */}
        {isSwipedOpen && (
          <TouchableOpacity
            style={styles.deleteBackground}
            onPress={handleDelete}
          >
            <TrashIcon size={24} />
          </TouchableOpacity>
        )}

        {/* 歌曲内容 */}
        <TouchableOpacity
          style={[
            styles.songItem,
            isSwipedOpen && styles.songItemSwiped
          ]}
          onPress={handleSwipe}
          activeOpacity={1}
        >
          <View style={[styles.songThumbnail, { backgroundColor: item.color }]} />
          <View style={styles.songInfo}>
            <Text style={styles.songTitle}>{item.title}—{item.subtitle}</Text>
            <View style={styles.songMetaRow}>
              <Text style={styles.songMeta}>{item.date}</Text>
              <Text style={styles.songMeta}>{item.duration}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.songActionButton}
            onPress={() => toggleFavorite(item.id)}
          >
            {isFavorited ? (
              <SimpleHeartIcon size={24} filled={true} />
            ) : (
              <HeartPlusIcon size={24} />
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.songActionButton}
            onPress={() => handlePlaySong(item)}
          >
            <PlayIcon size={24} />
          </TouchableOpacity>
        </TouchableOpacity>
      </View>
    );
  };

  // 渲染歌曲项
  const renderSongItem = ({ item }: { item: any }) => {
    return <SwipeableSongItem item={item} />;
  };

  // 主渲染函数
  const renderCurrentView = () => {
    switch (currentView) {
      case 'recent':
        return renderRecentView();
      case 'favorites':
        return renderFavoritesView();
      case 'single':
        return renderSingleView();
      default:
        return renderMainView();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      {renderCurrentView()}

      {/* 删除确认弹窗 */}
      <Modal
        visible={showDeleteModal}
        transparent={true}
        animationType="fade"
        onRequestClose={cancelDelete}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            <Text style={styles.deleteModalTitle}>删除</Text>
            <Text style={styles.deleteModalText}>
              "{songToDelete?.title}" 将被永久删除。确定吗？
            </Text>
            <View style={styles.deleteModalButtons}>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.confirmButton]}
                onPress={confirmDelete}
              >
                <Text style={styles.confirmButtonText}>是，删除</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.deleteModalButton, styles.cancelButton]}
                onPress={cancelDelete}
              >
                <Text style={styles.cancelButtonText}>否，取消</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // 搜索栏样式
  searchContainer: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingRight: 15,
    height: 50,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  // 快捷按钮样式
  quickButtonsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    gap: 15,
  },
  quickButton: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  quickButtonIcon: {
    marginBottom: 10,
  },
  quickButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Dancelist 标题样式
  dancelistHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  dancelistTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  newButton: {
    backgroundColor: '#000',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  newButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  // 播放列表样式
  playlistContainer: {
    paddingHorizontal: 20,
  },
  playlistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  playlistThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 15,
  },
  playlistInfo: {
    flex: 1,
  },
  playlistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  playlistMeta: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  playlistAction: {
    padding: 10,
  },
  actionIcon: {
    fontSize: 18,
    color: '#333',
  },
  viewAllButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  viewAllText: {
    fontSize: 16,
    color: '#333',
    marginRight: 5,
  },
  viewAllArrow: {
    fontSize: 16,
    color: '#333',
  },
  // 子页面头部样式
  subPageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 10,
  },

  searchButton: {
    padding: 10,
  },
  // 页面标题样式
  pageTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  pageTitleIcon: {
    marginRight: 15,
  },
  pageTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  songCount: {
    fontSize: 14,
    color: '#999',
    marginRight: 15,
  },
  editButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  editButtonText: {
    fontSize: 14,
    color: '#333',
  },
  // 新歌曲按钮样式
  newSongButton: {
    backgroundColor: '#000',
    borderRadius: 25,
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  newSongButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // 单个舞蹈页面样式
  singlePageBanner: {
    height: 200,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  singlePageInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  singlePageTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  singlePageMeta: {
    fontSize: 14,
    color: '#999',
    marginRight: 15,
  },
  // 歌曲列表样式
  songList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  songThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  songMetaRow: {
    flexDirection: 'row',
    gap: 20,
  },
  songMeta: {
    fontSize: 12,
    color: '#999',
  },
  songLikeButton: {
    padding: 10,
    marginRight: 5,
  },
  likeIcon: {
    fontSize: 20,
  },
  songPlayButton: {
    padding: 10,
  },
  playIcon: {
    fontSize: 16,
    color: '#333',
  },
  songActionButton: {
    padding: 12,
    marginLeft: 8,
  },
  // 滑动相关样式
  swipeContainer: {
    position: 'relative',
    overflow: 'hidden',
  },
  deleteBackground: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  songItemSwiped: {
    transform: [{ translateX: -80 }],
  },

  // 删除确认弹窗样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteModal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 30,
    margin: 20,
    minWidth: 300,
    alignItems: 'center',
  },
  deleteModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#000',
  },
  deleteModalText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 20,
  },
  deleteModalButtons: {
    flexDirection: 'row',
    gap: 15,
  },
  deleteModalButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    minWidth: 80,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#FFE66E',
  },
  cancelButton: {
    backgroundColor: '#E8FFBD',
  },
  confirmButtonText: {
    color: '#000',
    fontWeight: '500',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
});
