import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
  PanResponder,
  ActivityIndicator,
  Alert,
  Easing,
  Modal,
  Platform,
} from 'react-native';
import Svg, { Path } from 'react-native-svg';
import LoadingIcon from '../components/LoadingIcon';
import { GLMService } from '../services/glmService';
import { launchImageLibrary, launchCamera, MediaType, ImagePickerResponse } from 'react-native-image-picker';
import RNFS from 'react-native-fs';
import { PermissionManager } from '../utils/permissions';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width * 0.75; // 稍微减小宽度，从80%改为75%
const CARD_HEIGHT = height * 0.55; // 稍微减小高度，从60%改为55%

// 云图标组件
const CloudIcon = ({ size = 24, color = '#333' }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M11.4699 15.47C11.6105 15.3295 11.8012 15.2507 11.9999 15.2507C12.1987 15.2507 12.3893 15.3295 12.5299 15.47L14.5299 17.47C14.6036 17.5387 14.6627 17.6215 14.7037 17.7135C14.7447 17.8055 14.7667 17.9048 14.7685 18.0055C14.7703 18.1062 14.7518 18.2062 14.714 18.2996C14.6763 18.393 14.6202 18.4778 14.5489 18.549C14.4777 18.6203 14.3929 18.6764 14.2995 18.7141C14.2061 18.7518 14.1061 18.7704 14.0054 18.7686C13.9047 18.7668 13.8054 18.7448 13.7134 18.7038C13.6214 18.6628 13.5386 18.6037 13.4699 18.53L12.7499 17.81V22C12.7499 22.1989 12.6709 22.3897 12.5302 22.5303C12.3896 22.671 12.1988 22.75 11.9999 22.75C11.801 22.75 11.6102 22.671 11.4696 22.5303C11.3289 22.3897 11.2499 22.1989 11.2499 22V17.81L10.5299 18.53C10.4612 18.6037 10.3784 18.6628 10.2864 18.7038C10.1944 18.7448 10.0951 18.7668 9.99443 18.7686C9.89373 18.7704 9.7937 18.7518 9.70031 18.7141C9.60692 18.6764 9.52209 18.6203 9.45087 18.549C9.37965 18.4778 9.32351 18.393 9.28579 18.2996C9.24807 18.2062 9.22954 18.1062 9.23132 18.0055C9.23309 17.9048 9.25514 17.8055 9.29613 17.7135C9.33712 17.6215 9.39622 17.5387 9.46991 17.47L11.4699 15.47Z"
      fill={color}
    />
    <Path
      d="M12.476 3.75C9.726 3.75 7.512 5.95 7.512 8.647C7.512 9.109 7.577 9.556 7.697 9.978C8.194 10.122 8.66 10.338 9.08 10.618C9.16639 10.6703 9.24132 10.7396 9.3003 10.8216C9.35927 10.9036 9.40108 10.9966 9.4232 11.0952C9.44533 11.1938 9.44732 11.2958 9.42906 11.3951C9.41079 11.4944 9.37265 11.5891 9.31692 11.6733C9.26118 11.7576 9.18901 11.8297 9.10472 11.8853C9.02044 11.941 8.92578 11.9791 8.82642 11.9972C8.72706 12.0154 8.62506 12.0133 8.52652 11.9911C8.42799 11.9689 8.33495 11.927 8.253 11.868C7.66992 11.4817 6.98546 11.2767 6.286 11.279C4.325 11.279 2.75 12.849 2.75 14.765C2.75 16.681 4.325 18.25 6.286 18.25C6.48491 18.25 6.67568 18.329 6.81633 18.4697C6.95698 18.6103 7.036 18.8011 7.036 19C7.036 19.1989 6.95698 19.3897 6.81633 19.5303C6.67568 19.671 6.48491 19.75 6.286 19.75C3.513 19.75 1.25 17.526 1.25 14.765C1.25 12.06 3.42 9.872 6.114 9.782C6.04632 9.40745 6.01218 9.02761 6.012 8.647C6.012 5.106 8.914 2.25 12.476 2.25C15.634 2.25 18.272 4.494 18.831 7.471C21.131 8.448 22.75 10.709 22.75 13.353C22.75 16.427 20.562 18.984 17.657 19.606C17.4625 19.6476 17.2594 19.6103 17.0924 19.5022C16.9254 19.3941 16.8081 19.224 16.7665 19.0295C16.7249 18.835 16.7622 18.6319 16.8703 18.4649C16.9784 18.2979 17.1485 18.1806 17.343 18.139C19.583 17.659 21.25 15.693 21.25 13.353C21.25 11.216 19.86 9.391 17.912 8.725C17.3887 8.54567 16.8392 8.45443 16.286 8.455C15.703 8.455 15.146 8.555 14.628 8.735C14.4414 8.79593 14.2383 8.78126 14.0624 8.69415C13.8865 8.60704 13.7517 8.45443 13.6871 8.26909C13.6224 8.08374 13.633 7.88043 13.7166 7.7028C13.8001 7.52516 13.95 7.38737 14.134 7.319C15.1037 6.97978 16.1401 6.87526 17.158 7.014C16.8087 6.05402 16.1715 5.22531 15.3335 4.6411C14.4955 4.05689 13.4975 3.74568 12.476 3.75Z"
      fill={color}
    />
  </Svg>
);

interface HomeScreenProps {
  navigation: any;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [availableCards, setAvailableCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const translateX = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const [userName] = useState('黄智慧');
  const [isDragging, setIsDragging] = useState(false);
  const [likedCards, setLikedCards] = useState<Set<string>>(new Set()); // 记录收藏的卡片ID

  // 智能对比相关状态
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [uploadedVideo, setUploadedVideo] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // 自定义Modal状态
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfig, setModalConfig] = useState({
    title: '',
    message: '',
    buttons: [] as Array<{text: string, onPress?: () => void, style?: 'default' | 'cancel' | 'destructive'}>
  });

  // 自定义Alert函数
  const showCustomAlert = (title: string, message: string, buttons: Array<{text: string, onPress?: () => void, style?: 'default' | 'cancel' | 'destructive'}> = [{text: '确定'}]) => {
    setModalConfig({ title, message, buttons });
    setModalVisible(true);
  };



  // 数据接口 - 获取推荐视频卡片
  const fetchRecommendedVideos = async () => {
    try {
      setIsLoading(true);

      // TODO: 替换为实际的API调用
      // const response = await fetch('/api/videos/recommended');
      // const data = await response.json();

      // 模拟API延迟
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 模拟数据 - 实际应该从后端获取
      const mockData = [
        {
          id: '0',
          title: '【测试视频】【AI分析专用】',
          subtitle: '本地测试文件 - test.mp4',
          videoUrl: 'D:\\Files\\DancingAI\\src\\assets\\test.mp4',
          thumbnailUrl: 'https://via.placeholder.com/300x400/E8FFBD/333333?text=测试视频',
          type: 'test',
          progress: 0,
          bgColor: '#E8FFBD',
          duration: '02:15',
          difficulty: 'test',
          tags: ['测试', 'AI分析', '本地文件'],
          description: '用于测试AI分析功能的本地视频文件',
          avatar: 'https://via.placeholder.com/50x50/E8FFBD/333?text=🤖',
          likes: 999,
          comments: 88,
          views: 1888,
        },
        {
          id: '1',
          title: '【自用】【数拍子版】【0.75倍速】',
          subtitle: 'More! Jump! More!',
          videoUrl: 'https://example.com/video1.mp4',
          thumbnailUrl: 'https://via.placeholder.com/300x400/ff9a9e/ffffff?text=最近常练',
          type: 'recent',
          progress: 75,
          bgColor: '#ff9a9e',
          duration: '00:30/03:26',
          difficulty: 'intermediate',
          tags: ['自用', '数拍子版', '0.75倍速'],
          description: 'More! Jump! More!',
          avatar: 'https://via.placeholder.com/50x50/333/fff?text=A',
          likes: 1234,
          comments: 567,
          views: 666,
        },
        {
          id: '2',
          title: '推荐练习',
          subtitle: 'NewJeans - Get Up',
          videoUrl: 'https://example.com/video2.mp4',
          thumbnailUrl: 'https://via.placeholder.com/300x400/a8edea/ffffff?text=推荐练习',
          type: 'recommended',
          progress: 0,
          bgColor: '#a8edea',
          duration: '03:30',
          difficulty: 'beginner',
          tags: ['K-pop', '简单'],
          description: 'NewJeans - Get Up 舞蹈教学',
          avatar: 'https://via.placeholder.com/50x50/333/fff?text=B',
          likes: 2345,
          comments: 890,
          views: 1234,
        },
        {
          id: '3',
          title: '收藏舞蹈',
          subtitle: 'BLACKPINK - Pink Venom',
          videoUrl: 'https://example.com/video3.mp4',
          thumbnailUrl: 'https://via.placeholder.com/300x400/ffecd2/ffffff?text=收藏舞蹈',
          type: 'favorite',
          progress: 60,
          bgColor: '#ffecd2',
          duration: '03:15',
          difficulty: 'advanced',
          tags: ['女团', '高难度'],
          description: 'BLACKPINK - Pink Venom 完整版',
          avatar: 'https://via.placeholder.com/50x50/333/fff?text=C',
          likes: 3456,
          comments: 1234,
          views: 2345,
        },
        {
          id: '4',
          title: '新发现',
          subtitle: 'IVE - LOVE DIVE',
          videoUrl: 'https://example.com/video4.mp4',
          thumbnailUrl: 'https://via.placeholder.com/300x400/d4a5ff/ffffff?text=新发现',
          type: 'new',
          progress: 0,
          bgColor: '#d4a5ff',
          duration: '02:45',
          difficulty: 'intermediate',
          tags: ['女团', '优雅'],
          description: 'IVE - LOVE DIVE 舞蹈分解',
          avatar: 'https://via.placeholder.com/50x50/333/fff?text=D',
          likes: 4567,
          comments: 1567,
          views: 3456,
        },
        {
          id: '5',
          title: '热门推荐',
          subtitle: 'aespa - Spicy',
          videoUrl: 'https://example.com/video5.mp4',
          thumbnailUrl: 'https://via.placeholder.com/300x400/ffb3ba/ffffff?text=热门推荐',
          type: 'trending',
          progress: 0,
          bgColor: '#ffb3ba',
          duration: '03:20',
          difficulty: 'advanced',
          tags: ['女团', '力量'],
          description: 'aespa - Spicy 镜面教学',
          avatar: 'https://via.placeholder.com/50x50/333/fff?text=E',
          likes: 5678,
          comments: 2345,
          views: 4567,
        },
      ];

      setAvailableCards(mockData);
      console.log('视频卡片数据已加载:', mockData.length, '个视频');
      console.log('测试视频卡片:', mockData[0]); // 打印测试视频信息
    } catch (error) {
      console.error('获取推荐视频失败:', error);
      // 设置默认数据或显示错误状态
      setAvailableCards([]);
    } finally {
      setIsLoading(false);
    }
  };

  // 组件初始化时获取数据
  useEffect(() => {
    fetchRecommendedVideos();
  }, []);

  // AI总结数据
  const aiSummary = {
    title: '这里应该放一些',
    content: '对上一次使用的总结',
    suggestion: '以及一点鼓励',
    note: '但是我编不出来了我就先这么写',
  };

  // 划走当前卡片
  const swipeAwayCurrentCard = (direction: 'left' | 'right' = 'left') => {
    if (availableCards.length > 0) {
      // 先播放飞出动画
      const targetX = direction === 'left' ? -width * 1.5 : width * 1.5;

      Animated.parallel([
        Animated.timing(translateX, {
          toValue: targetX,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start(() => {
        // 动画完成后立即移除卡片并重置
        setAvailableCards(prev => {
          const newCards = [...prev];
          newCards.shift(); // 移除第一张卡片
          console.log(`卡片已划走，剩余: ${newCards.length} 张`);

          // 如果卡片用完了，重新加载
          if (newCards.length <= 3) {
            loadMoreCards();
          }

          return newCards;
        });

        // 重置动画值到初始状态
        translateX.setValue(0);
        scale.setValue(1);
        opacity.setValue(1);
      });
    }
  };

  // 返回当前卡片（向右滑动）
  const returnCurrentCard = () => {
    // 回弹动画
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: 0,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.spring(scale, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: false,
      }),
    ]).start();
  };

  // 加载更多卡片
  const loadMoreCards = async () => {
    try {
      // TODO: 调用API获取更多推荐视频
      // const response = await fetch('/api/videos/recommended?offset=' + availableCards.length);
      // const newCards = await response.json();

      // 模拟加载更多数据
      const moreCards = [
        {
          id: Date.now() + 1,
          title: '新推荐',
          subtitle: 'LE SSERAFIM - UNFORGIVEN',
          videoUrl: 'https://example.com/video_new1.mp4',
          thumbnailUrl: 'https://via.placeholder.com/300x400/bae1ff/ffffff?text=新推荐',
          type: 'new',
          progress: 0,
          bgColor: '#bae1ff',
          duration: 175,
          difficulty: 'intermediate',
          tags: ['女团', '西部'],
        },
        {
          id: Date.now() + 2,
          title: '热门新作',
          subtitle: 'NewJeans - ETA',
          videoUrl: 'https://example.com/video_new2.mp4',
          thumbnailUrl: 'https://via.placeholder.com/300x400/c7ceea/ffffff?text=热门新作',
          type: 'trending',
          progress: 0,
          bgColor: '#c7ceea',
          duration: 190,
          difficulty: 'beginner',
          tags: ['清新', '简单'],
        },
      ];

      setAvailableCards(prev => [...prev, ...moreCards]);
    } catch (error) {
      console.error('加载更多卡片失败:', error);
    }
  };

  // 点击卡片进入视频页面
  const handleCardPress = (card: any) => {
    console.log('卡片点击事件触发，isDragging:', isDragging);
    if (!isDragging) {
      console.log('导航到视频详情页面，卡片:', card.title);
      navigation.navigate('VideoDetail', {
        video: card
      });
    } else {
      console.log('拖拽状态中，忽略点击');
    }
  };

  // 处理播放按钮点击
  const handlePlayPress = (card: any, event: any) => {
    event.stopPropagation(); // 阻止事件冒泡
    console.log('播放按钮点击，跳转到视频页面并自动播放');
    console.log('视频信息:', {
      id: card.id,
      title: card.title,
      videoUrl: card.videoUrl,
      isTestVideo: card.videoUrl.includes('test.mp4')
    });
    navigation.navigate('VideoDetail', {
      video: card,
      autoPlay: true // 传递自动播放参数
    });
  };

  // 处理收藏/喜欢
  const handleLikePress = (card: any, event: any) => {
    event.stopPropagation();
    const isLiked = likedCards.has(card.id);

    if (isLiked) {
      // 取消收藏
      setLikedCards(prev => {
        const newSet = new Set(prev);
        newSet.delete(card.id);
        return newSet;
      });
      showCustomAlert('取消收藏', `已将 "${card.title}" 从收藏中移除`);
    } else {
      // 添加收藏
      setLikedCards(prev => new Set(prev).add(card.id));
      showCustomAlert('收藏', `已将 "${card.title}" 添加到收藏`);
    }
  };

  // 处理分享
  const handleSharePress = (card: any, event: any) => {
    event.stopPropagation();
    showCustomAlert(
      '分享舞蹈',
      `分享 "${card.title}" 给朋友`,
      [
        { text: '复制链接', onPress: () => showCustomAlert('复制', '链接已复制到剪贴板') },
        { text: '分享到微信', onPress: () => showCustomAlert('微信', '打开微信分享') },
        { text: '分享到QQ', onPress: () => showCustomAlert('QQ', '打开QQ分享') },
        { text: '取消', style: 'cancel' }
      ]
    );
  };

  // 处理AI总结点击
  const handleSummaryPress = () => {
    showCustomAlert(
      'AI 练习总结',
      '查看详细的练习分析和建议',
      [
        { text: '查看详情', onPress: () => showCustomAlert('详情', '打开详细分析页面') },
        { text: '新总结', onPress: () => showCustomAlert('生成', '正在生成新的AI总结...') },
        { text: '取消', style: 'cancel' }
      ]
    );
  };

  // 处理刷新
  const handleRefresh = () => {
    console.log('手动刷新视频数据');
    setIsLoading(true);
    setAvailableCards([]); // 清空当前数据
    fetchRecommendedVideos(); // 重新加载数据
    showCustomAlert('刷新', '正在获取最新推荐...', [
      { text: '确定' }
    ]);
  };

  // 处理智能对比点击
  const handleSmartCompare = () => {
    setShowCompareModal(true);
  };

  // 选择视频文件
  const selectVideo = async () => {
    // 检查权限
    const hasPermission = await PermissionManager.checkVideoFilePermissions();
    if (!hasPermission) {
      return;
    }

    Alert.alert(
      '选择视频',
      '请选择要分析的舞蹈视频',
      [
        { text: '从相册选择', onPress: () => selectFromGallery() },
        { text: '拍摄视频', onPress: () => recordVideo() },
        { text: '取消', style: 'cancel' }
      ]
    );
  };

  // 从相册选择视频
  const selectFromGallery = () => {
    Alert.alert(
      '选择视频源',
      '请选择视频来源',
      [
        { text: '使用测试视频', onPress: () => useTestVideo() },
        { text: '从相册选择', onPress: () => selectFromLibrary() },
        { text: '取消', style: 'cancel' }
      ]
    );
  };

  // 使用测试视频
  const useTestVideo = () => {
    // 使用本地测试文件路径
    const localTestPath = 'D:\\Files\\DancingAI\\src\\assets\\test.mp4';

    setUploadedVideo(localTestPath);
    Alert.alert('成功', `测试视频已选择: test.mp4\n点击"开始AI分析"进行分析`);
  };

  // 从相册选择
  const selectFromLibrary = () => {
    const options = {
      mediaType: 'video' as MediaType,
      videoQuality: 'medium' as const,
      durationLimit: 300, // 5分钟限制
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('用户取消选择');
        return;
      }

      if (response.errorMessage) {
        console.error('选择视频错误:', response.errorMessage);
        Alert.alert('错误', '选择视频失败，请重试');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const videoUri = asset.uri;
        const fileSize = asset.fileSize || 0;
        const fileName = asset.fileName || 'video.mp4';

        // 验证文件大小 (50MB限制)
        if (fileSize > 50 * 1024 * 1024) {
          Alert.alert('文件过大', '请选择小于50MB的视频文件');
          return;
        }

        // 验证文件格式
        const extension = fileName.split('.').pop()?.toLowerCase();
        if (!extension || !['mp4', 'mov', 'avi', 'mkv'].includes(extension)) {
          Alert.alert('格式不支持', '请选择MP4、MOV、AVI或MKV格式的视频');
          return;
        }

        if (videoUri) {
          setUploadedVideo(videoUri);
          Alert.alert('成功', `视频已选择: ${fileName}\n文件大小: ${(fileSize / 1024 / 1024).toFixed(2)}MB\n点击"开始AI分析"进行分析`);
        }
      }
    });
  };

  // 录制视频
  const recordVideo = () => {
    const options = {
      mediaType: 'video' as MediaType,
      videoQuality: 'medium' as const,
      durationLimit: 300, // 5分钟限制
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchCamera(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.log('用户取消录制');
        return;
      }

      if (response.errorMessage) {
        console.error('录制视频错误:', response.errorMessage);
        Alert.alert('错误', '录制视频失败，请重试');
        return;
      }

      if (response.assets && response.assets.length > 0) {
        const asset = response.assets[0];
        const videoUri = asset.uri;
        const fileSize = asset.fileSize || 0;

        if (videoUri) {
          setUploadedVideo(videoUri);
          Alert.alert('成功', `视频录制完成\n文件大小: ${(fileSize / 1024 / 1024).toFixed(2)}MB\n点击"开始AI分析"进行分析`);
        }
      }
    });
  };

  // 开始AI分析 - 使用GLM-4.5V API
  const startAnalysis = async () => {
    if (!uploadedVideo) {
      Alert.alert('提示', '请先选择视频');
      return;
    }

    setIsAnalyzing(true);

    try {
      // 验证视频格式
      if (!GLMService.validateVideoFile(uploadedVideo)) {
        Alert.alert('错误', '不支持的视频格式，请选择MP4、MOV、AVI或MKV格式的视频');
        return;
      }

      // 将视频转换为可分析的格式
      const videoData = await convertVideoToBase64(uploadedVideo);

      // 调用GLM服务进行分析
      const glmService = GLMService.getInstance();
      const analysisResult = await glmService.analyzeVideo(videoData);

      setAnalysisResult(analysisResult);

    } catch (error) {
      console.error('GLM-4.5V分析错误:', error);
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      Alert.alert('分析失败', `${errorMessage}\n\n请检查网络连接或稍后重试`);
    } finally {
      setIsAnalyzing(false);
    }
  };



  // 将视频转换为base64
  const convertVideoToBase64 = async (videoPath: string): Promise<string> => {
    try {
      console.log('开始转换视频:', videoPath);

      // 检查是否是本地测试文件
      if (videoPath.includes('test.mp4') || videoPath.includes('D:\\Files\\DancingAI')) {
        console.log('检测到本地测试文件，直接返回路径');
        return videoPath; // 对于本地测试文件，直接返回路径
      }

      // 对于其他文件，读取并转换为base64
      const base64String = await RNFS.readFile(videoPath, 'base64');

      // 返回完整的data URL格式
      const dataUrl = `data:video/mp4;base64,${base64String}`;

      console.log('视频转换完成，大小:', base64String.length);
      return dataUrl;

    } catch (error) {
      console.error('视频转换失败:', error);

      // 如果是本地测试文件转换失败，提供友好提示
      if (videoPath.includes('test.mp4')) {
        console.log('本地测试文件处理失败，使用模拟数据');
        return videoPath; // 仍然返回路径，让后续处理决定如何处理
      }

      throw new Error('视频文件读取失败，请重新选择视频');
    }
  };



  // 关闭对比模态框
  const closeCompareModal = () => {
    setShowCompareModal(false);
    setUploadedVideo(null);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  // 切换到下一张卡片
  const handleNextCard = () => {
    // 移除当前卡片
    setAvailableCards(prev => {
      const newCards = [...prev];
      newCards.shift(); // 移除第一张卡片

      // 如果卡片用完了，重新加载
      if (newCards.length <= 2) {
        loadMoreCards();
      }

      return newCards;
    });

    // 延迟重置动画值，确保DOM更新完成
    setTimeout(() => {
      translateX.setValue(0);
      scale.setValue(1);
      opacity.setValue(1);
      rotate.setValue(0);
      setIsDragging(false);
    }, 50);
  };

  // 处理卡片滑动手势 - 更丝滑的版本
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // 非常宽松的手势检测
        return Math.abs(gestureState.dx) > 1;
      },
      onPanResponderGrant: () => {
        setIsDragging(true);
        // @ts-ignore
        translateX.setOffset(translateX._value);
      },
      onPanResponderMove: (_, gestureState) => {
        // 实时跟随手指移动
        translateX.setValue(gestureState.dx);

        // 计算旋转角度（探探风格）
        const rotationAngle = (gestureState.dx / CARD_WIDTH) * 15; // 最大15度旋转

        // 根据滑动距离调整透明度和缩放
        const progress = Math.abs(gestureState.dx) / CARD_WIDTH;
        const clampedProgress = Math.min(progress, 1);

        opacity.setValue(1 - clampedProgress * 0.3);
        scale.setValue(1 - clampedProgress * 0.05); // 减少缩放幅度

        // 添加旋转效果
        rotate.setValue(rotationAngle);
      },
      onPanResponderRelease: (_, gestureState) => {
        setIsDragging(false);
        translateX.flattenOffset();

        // 探探风格判断：计算滑动面积比例
        const swipeRatio = Math.abs(gestureState.dx) / CARD_WIDTH;
        const velocityThreshold = 0.1; // 进一步降低速度阈值
        const distanceThreshold = 0.15; // 进一步降低到15%的卡片宽度

        if (swipeRatio >= distanceThreshold || Math.abs(gestureState.vx) > velocityThreshold) {
          // 滑动距离或速度足够，执行卡片切换
          const finalX = gestureState.dx > 0 ? CARD_WIDTH * 1.2 : -CARD_WIDTH * 1.2;
          const finalRotation = gestureState.dx > 0 ? 20 : -20;

          Animated.parallel([
            Animated.timing(translateX, {
              toValue: finalX,
              duration: 250,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(scale, {
              toValue: 0.9,
              duration: 250,
              useNativeDriver: true,
            }),
            Animated.timing(rotate, {
              toValue: finalRotation,
              duration: 250,
              useNativeDriver: true,
            })
          ]).start(() => {
            // 动画完成后切换卡片
            handleNextCard();
          });
        } else {
          // 回弹动画
          Animated.parallel([
            Animated.spring(translateX, {
              toValue: 0,
              useNativeDriver: true,
              tension: 120,
              friction: 8,
            }),
            Animated.spring(scale, {
              toValue: 1,
              useNativeDriver: true,
              tension: 120,
              friction: 8,
            }),
            Animated.spring(opacity, {
              toValue: 1,
              useNativeDriver: true,
              tension: 120,
              friction: 8,
            }),
            Animated.spring(rotate, {
              toValue: 0,
              useNativeDriver: true,
              tension: 120,
              friction: 8,
            })
          ]).start();
        }
      },
    })
  ).current;

  // 渲染单个卡片 - 重叠式布局，只显示前几张
  const renderCard = (card: any, index: number) => {
    // 只渲染前3张卡片
    if (index > 2) return null;

    const isActive = index === 0;
    const isNext = index === 1;
    const isThird = index === 2;

    // 计算卡片的位置和样式
    let cardTranslateX = 0;
    let cardTranslateY = 0;
    let cardScale = 0.85;
    let cardOpacity = 0.6;
    let cardZIndex = 1;
    let cardRotation = 0;

    if (isActive) {
      cardTranslateX = 0;
      cardTranslateY = 0;
      cardScale = 1;
      cardOpacity = 1;
      cardZIndex = 10;
      cardRotation = 0;
    } else if (isNext) {
      cardTranslateX = 5; // 稍微向右偏移，让用户看到下一张卡片
      cardTranslateY = 8;
      cardScale = 0.96;
      cardOpacity = 0.85;
      cardZIndex = 5;
      cardRotation = 1; // 轻微旋转
    } else if (isThird) {
      cardTranslateX = 10; // 更多向右偏移
      cardTranslateY = 16;
      cardScale = 0.92;
      cardOpacity = 0.7;
      cardZIndex = 2;
      cardRotation = 2; // 更多旋转
    }

    return (
      <Animated.View
        key={card.id}
        style={[
          styles.card,
          {
            transform: [
              {
                translateX: isActive ? translateX : cardTranslateX
              },
              {
                translateY: cardTranslateY
              },
              {
                scale: isActive ? scale : cardScale
              },
              {
                rotate: isActive ? rotate.interpolate({
                  inputRange: [-15, 0, 15],
                  outputRange: ['-15deg', '0deg', '15deg'],
                  extrapolate: 'clamp'
                }) : `${cardRotation}deg`
              }
            ],
            opacity: isActive ? opacity : cardOpacity,
            zIndex: cardZIndex,
          }
        ]}
        {...(isActive ? panResponder.panHandlers : {})} // 只在活动卡片上应用手势
      >
          <TouchableOpacity
            activeOpacity={0.95}
            onPress={() => handleCardPress(card)}
            disabled={!isActive || isDragging} // 拖拽时禁用点击
            style={{ flex: 1 }}
          >
            <View style={[styles.cardContent, { backgroundColor: card.bgColor }]}>
              <Image source={{ uri: card.thumbnailUrl }} style={styles.cardImage} />
              <View style={styles.cardOverlay}>
                {/* 顶部区域：推荐数量和操作按钮 */}
                <View style={styles.cardTopRow}>
                  <View style={styles.cardTopCenter}>
                    {availableCards.length > 1 && (
                      <View style={styles.recommendationBadge}>
                        <Text style={styles.recommendationText}>
                          还有 {availableCards.length - 1} 个推荐
                        </Text>
                      </View>
                    )}
                  </View>
                  <View style={styles.cardTopActions}>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => handleLikePress(card, e)}
                    >
                      <Text style={[
                        styles.actionIcon,
                        likedCards.has(card.id) && styles.likedIcon
                      ]}>
                        {likedCards.has(card.id) ? '❤️' : '🤍'}
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={(e) => handleSharePress(card, e)}
                    >
                      <Text style={styles.actionIcon}>↗</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* 中间播放按钮 */}
                <View style={styles.cardCenter}>
                  <TouchableOpacity
                    style={styles.playButton}
                    onPress={(e) => handlePlayPress(card, e)}
                  >
                    <Text style={styles.playIcon}>▶</Text>
                  </TouchableOpacity>
                </View>

                {/* 时长显示在底部 */}
                <View style={styles.durationContainer}>
                  <Text style={styles.durationText}>
                    {typeof card.duration === 'string' ? card.duration :
                     `${Math.floor(card.duration / 60)}:${(card.duration % 60).toString().padStart(2, '0')}`}
                  </Text>
                </View>

                {/* 底部信息区域 */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{card.title}</Text>
                  <Text style={styles.cardSubtitle}>{card.subtitle}</Text>
                  {card.progress > 0 && (
                    <View style={styles.progressContainer}>
                      <View style={styles.progressBar}>
                        <View
                          style={[
                            styles.progressFill,
                            { width: `${card.progress}%` }
                          ]}
                        />
                      </View>
                      <Text style={styles.progressText}>{card.progress}%</Text>
                    </View>
                  )}
                  <View style={styles.cardTags}>
                    {card.tags?.slice(0, 2).map((tag: string, tagIndex: number) => (
                      <View key={tagIndex} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>
    );
  };

  // 主页面
  return (
    <View style={styles.container}>
      {/* 背景渐变 */}
      <View style={styles.backgroundGradient} />

      {/* 主要内容区域 - 使用flex布局垂直排列 */}
      <View style={styles.mainContent}>
        {/* 卡片轮播区域 */}
        <View style={styles.cardsContainer}>
          {isLoading ? (
            // 加载状态
            <View style={styles.loadingContainer}>
              <LoadingIcon size={120} />
              <Text style={styles.loadingText}>正在为你推荐精彩内容...</Text>
            </View>
          ) : availableCards.length === 0 ? (
            // 空状态
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🎭</Text>
              <Text style={styles.emptyTitle}>暂无推荐内容</Text>
              <Text style={styles.emptySubtitle}>请稍后再试</Text>
              <TouchableOpacity
                style={styles.refreshButton}
                onPress={handleRefresh}
              >
                <Text style={styles.refreshButtonText}>刷新</Text>
              </TouchableOpacity>
            </View>
          ) : (
            // 卡片内容
            <>
              {availableCards.slice().reverse().map((card, index) => {
                // 因为我们反转了数组，需要重新计算原始索引
                const originalIndex = availableCards.length - 1 - index;
                return renderCard(card, originalIndex);
              })}

              {/* 卡片计数器 */}
              {availableCards.length > 0 && (
                <View style={styles.cardCounter}>
                  <Text style={styles.counterText}>
                    还有 {availableCards.length} 个推荐
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        {/* AI总结区域 */}
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>{aiSummary.title}</Text>
          <Text style={styles.summaryContent}>{aiSummary.content}</Text>
          <Text style={styles.summarySuggestion}>{aiSummary.suggestion}</Text>
          <Text style={styles.summaryNote}>{aiSummary.note}</Text>
        </View>

        {/* 智能对比框 */}
        <View style={styles.smartCompareWrapper}>
          <TouchableOpacity style={styles.smartCompareContainer} onPress={handleSmartCompare}>
            <CloudIcon size={24} color="#333" />
            <Text style={styles.smartCompareText}>智能比对</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 自定义Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{modalConfig.title}</Text>
              <Text style={styles.modalMessage}>{modalConfig.message}</Text>
              <View style={styles.modalButtonContainer}>
                {modalConfig.buttons.map((button, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalButton,
                      button.style === 'cancel' && styles.modalCancelButton,
                      button.style === 'destructive' && styles.modalDestructiveButton,
                    ]}
                    onPress={() => {
                      setModalVisible(false);
                      button.onPress && button.onPress();
                    }}
                  >
                    <Text style={[
                      styles.modalButtonText,
                      button.style === 'cancel' && styles.modalCancelButtonText,
                      button.style === 'destructive' && styles.modalDestructiveButtonText,
                    ]}>
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* 智能对比模态框 */}
      <Modal
        visible={showCompareModal}
        transparent={true}
        animationType="slide"
        onRequestClose={closeCompareModal}
      >
        <View style={styles.compareModalOverlay}>
          <View style={styles.compareModalContent}>
            <View style={styles.compareModalHeader}>
              <Text style={styles.compareModalTitle}>智能对比分析</Text>
              <TouchableOpacity onPress={closeCompareModal}>
                <Text style={styles.compareModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {!uploadedVideo && !analysisResult && (
              <View style={styles.uploadSection}>
                <View style={styles.uploadArea}>
                  <CloudIcon size={48} color="#999" />
                  <Text style={styles.uploadText}>上传您的舞蹈视频</Text>
                  <Text style={styles.uploadSubtext}>AI将分析您的动作并给出专业建议</Text>
                  <Text style={styles.uploadRequirements}>
                    • 支持格式: MP4, MOV, AVI, MKV{'\n'}
                    • 文件大小: 最大50MB{'\n'}
                    • 视频时长: 建议5分钟内{'\n'}
                    • 画面清晰，包含完整舞蹈动作
                  </Text>
                </View>
                <TouchableOpacity style={styles.selectVideoButton} onPress={selectVideo}>
                  <Text style={styles.selectVideoButtonText}>选择视频</Text>
                </TouchableOpacity>
              </View>
            )}

            {uploadedVideo && !analysisResult && !isAnalyzing && (
              <View style={styles.uploadSection}>
                <View style={styles.videoSelected}>
                  <Text style={styles.videoSelectedText}>✓ 视频已选择</Text>
                  <Text style={styles.videoPath}>
                    {uploadedVideo.split('/').pop() || '视频文件'}
                  </Text>
                  <Text style={styles.videoInfo}>
                    文件路径: {uploadedVideo.length > 50 ? '...' + uploadedVideo.slice(-50) : uploadedVideo}
                  </Text>
                </View>
                <View style={styles.buttonGroup}>
                  <TouchableOpacity style={styles.reSelectButton} onPress={selectVideo}>
                    <Text style={styles.reSelectButtonText}>重新选择</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.analyzeButton} onPress={startAnalysis}>
                    <Text style={styles.analyzeButtonText}>开始AI分析</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isAnalyzing && (
              <View style={styles.analyzingSection}>
                <ActivityIndicator size="large" color="#E8FFBD" />
                <Text style={styles.analyzingText}>AI正在分析您的舞蹈...</Text>
                <Text style={styles.analyzingSubtext}>请稍候，这可能需要几分钟</Text>
              </View>
            )}

            {analysisResult && (
              <View style={styles.resultSection}>
                <Text style={styles.resultTitle}>分析结果</Text>
                <View style={styles.scoreSection}>
                  <Text style={styles.scoreLabel}>综合评分</Text>
                  <Text style={styles.scoreValue}>{analysisResult.score}/100</Text>
                </View>

                <View style={styles.feedbackSection}>
                  <Text style={styles.feedbackTitle}>AI反馈</Text>
                  {analysisResult.feedback.map((item: string, index: number) => (
                    <Text key={index} style={styles.feedbackItem}>• {item}</Text>
                  ))}
                </View>

                <View style={styles.improvementSection}>
                  <Text style={styles.improvementTitle}>改进建议</Text>
                  {analysisResult.improvements.map((item: string, index: number) => (
                    <Text key={index} style={styles.improvementItem}>• {item}</Text>
                  ))}
                </View>

                <TouchableOpacity style={styles.newAnalysisButton} onPress={() => {
                  setUploadedVideo(null);
                  setAnalysisResult(null);
                }}>
                  <Text style={styles.newAnalysisButtonText}>分析新视频</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#f8f9fa',
  },
  mainContent: {
    flex: 1,
    flexDirection: 'column',
  },
  cardsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 120, // 增加顶部间距，给天空留更多白
    paddingBottom: 20,
    minHeight: height * 0.5, // 稍微减少最小高度，为顶部留白腾出空间
  },
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 15,
    },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
    backgroundColor: '#fff',
    position: 'absolute',
    alignSelf: 'center',
  },
  cardContent: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'space-between',
    padding: 20,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '100%',
  },
  cardTopCenter: {
    flex: 1,
    alignItems: 'center',
  },
  recommendationBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  recommendationText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  cardCenter: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -30 }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardActions: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    color: '#333',
    fontSize: 24,
    marginLeft: 3, // 微调播放图标位置，让它看起来更居中
  },
  durationContainer: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cardInfo: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  cardSubtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  summaryContainer: {
    marginHorizontal: 40,
    marginTop: 20,
    marginBottom: 15, // 与智能对比框的间距
    paddingVertical: 10,
    alignItems: 'center',
  },
  summaryTitle: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
    fontWeight: '500',
  },
  summaryContent: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  summarySuggestion: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 8,
  },
  summaryNote: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },

  // 加载状态样式
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    color: '#333', // 改为深色文字，适配浅色背景
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
  // 空状态样式
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 20,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  emptySubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 16,
    marginBottom: 30,
  },
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  // 卡片计数器样式
  cardCounter: {
    marginTop: 20, // 减少顶部间距
    marginBottom: 15, // 减少底部间距，配合总结区域的负margin
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  counterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // 进度条样式
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginRight: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#fff',
    borderRadius: 2,
  },
  progressText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
    minWidth: 35,
  },
  // 标签样式
  cardTags: {
    flexDirection: 'row',
    marginTop: 8,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '500',
  },
  // 新增交互样式
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  cardTopActions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionIcon: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  likedIcon: {
    color: '#ff6b6b',
  },
  // 自定义Modal样式
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 0, // 移除padding，让我们单独控制内容区域的padding
    margin: 20,
    minWidth: 280,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden', // 确保子元素不会超出圆角边界
  },
  modalContent: {
    padding: 24, // 内容区域的padding
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    minWidth: 80,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#FFE66E',
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalCancelButton: {
    backgroundColor: '#f0f0f0',
  },
  modalCancelButtonText: {
    color: '#666',
  },
  modalDestructiveButton: {
    backgroundColor: '#ff6b6b',
  },
  modalDestructiveButtonText: {
    color: '#fff',
  },

  // 智能对比框包装器
  smartCompareWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 20, // 距离底部的间距
    paddingTop: 10, // 与AI总结区域的间距
  },
  // 智能对比框样式
  smartCompareContainer: {
    backgroundColor: '#E8FFBD', // 浅绿色背景，与设计图一致
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  smartCompareText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },

  // 智能对比模态框样式
  compareModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  compareModalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '80%',
  },
  compareModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  compareModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  compareModalClose: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  uploadSection: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  uploadArea: {
    alignItems: 'center',
    paddingVertical: 40,
    borderWidth: 2,
    borderColor: '#E8FFBD',
    borderStyle: 'dashed',
    borderRadius: 15,
    width: '100%',
    marginBottom: 20,
  },
  uploadText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
  },
  uploadSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    textAlign: 'center',
  },
  uploadRequirements: {
    fontSize: 12,
    color: '#888',
    marginTop: 15,
    textAlign: 'left',
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  selectVideoButton: {
    backgroundColor: '#E8FFBD',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  selectVideoButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  videoSelected: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 20,
  },
  videoSelectedText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 10,
  },
  videoPath: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 5,
  },
  videoInfo: {
    fontSize: 11,
    color: '#888',
    textAlign: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  reSelectButton: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 0.4,
  },
  reSelectButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
  },
  analyzeButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    flex: 0.55,
  },
  analyzeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
    textAlign: 'center',
  },
  analyzingSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  analyzingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 15,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  resultSection: {
    paddingVertical: 10,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  scoreLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  feedbackSection: {
    marginBottom: 15,
  },
  feedbackTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  feedbackItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
  improvementSection: {
    marginBottom: 20,
  },
  improvementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  improvementItem: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
    lineHeight: 20,
  },
  newAnalysisButton: {
    backgroundColor: '#E8FFBD',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'center',
  },
  newAnalysisButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },

});
