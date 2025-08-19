import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  StatusBar,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Svg, { Path } from 'react-native-svg';
import { VideoAnalysisService, ExtendedVideoAnalysisResult } from '../services/videoAnalysisService';

const { width, height } = Dimensions.get('window');

interface VideoDetailProps {
  navigation: any;
  route: {
    params: {
      video: {
        id: string;
        title: string;
        subtitle: string;
        thumbnailUrl: string;
        bgColor: string;
        duration: string;
        progress: number;
        tags: string[];
        description?: string;
        avatar: string;
        likes: number;
        comments: number;
        views: number;
        videoUrl: string;
      };
      autoPlay?: boolean; // 添加自动播放参数
    };
  };
}

const VideoDetailScreen: React.FC<VideoDetailProps> = ({ navigation, route }) => {
  const { video, autoPlay = false } = route.params;

  const [isPlaying, setIsPlaying] = useState(autoPlay); // 根据autoPlay参数设置初始播放状态
  const [isLiked, setIsLiked] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false); // 控制是否缩小显示
  const [isFollowed, setIsFollowed] = useState(false); // 关注状态
  const [isTeachingMode, setIsTeachingMode] = useState(true); // 教学模式/原视频模式
  const [currentBeat, setCurrentBeat] = useState(1); // 当前节拍 (1-4)
  const [aiGuideEnabled, setAiGuideEnabled] = useState(false);
  const [loopEnabled, setLoopEnabled] = useState(false);
  const [textPromptEnabled, setTextPromptEnabled] = useState(false);
  const [voiceGuideEnabled, setVoiceGuideEnabled] = useState(false);
  const [speedMode, setSpeedMode] = useState(false);
  const [segmentationEnabled, setSegmentationEnabled] = useState(false);
  const [currentProgress, setCurrentProgress] = useState(0.3); // 视频进度 0-1
  const [currentSection, setCurrentSection] = useState('主歌部分'); // 当前章节名称
  const [showSettings, setShowSettings] = useState(false); // 设置弹窗显示状态
  const [mirrorMode, setMirrorMode] = useState(false); // 镜像跟练开关
  const [bgmRemoval, setBgmRemoval] = useState(false); // BGM去人声开关
  const [showSpeedSelector, setShowSpeedSelector] = useState(false); // 倍速选择器显示状态
  const [currentSpeed, setCurrentSpeed] = useState(1.0); // 当前播放倍速

  // GLM AI分析相关状态
  const [showAIAnalysis, setShowAIAnalysis] = useState(false); // AI分析弹窗
  const [isAnalyzing, setIsAnalyzing] = useState(false); // 分析中状态
  const [analysisResult, setAnalysisResult] = useState<ExtendedVideoAnalysisResult | null>(null); // 分析结果
  const [analysisType, setAnalysisType] = useState<'technique' | 'rhythm' | 'expression' | 'overall'>('overall'); // 分析类型

  // AI实时指导相关状态
  const [aiRealTimeGuide, setAiRealTimeGuide] = useState(false); // AI实时指导开关
  const [currentAITip, setCurrentAITip] = useState<string>(''); // 当前AI提示
  const [practiceMode, setPracticeMode] = useState<'follow' | 'compare' | 'learn'>('follow'); // 练习模式

  // 处理自动播放
  useEffect(() => {
    if (autoPlay) {
      console.log('自动播放模式：视频开始播放');
      // 这里可以添加实际的视频播放逻辑
      setIsPlaying(true);
    }
  }, [autoPlay]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleShare = () => {
    // 分享功能
    console.log('分享视频');
  };

  const handleDownload = () => {
    // 下载功能
    console.log('下载视频');
  };

  const handleClose = () => {
    navigation.goBack();
  };

  // GLM AI分析功能
  const startAIAnalysis = async (type: 'technique' | 'rhythm' | 'expression' | 'overall') => {
    setAnalysisType(type);
    setIsAnalyzing(true);
    setShowAIAnalysis(true);

    try {
      let videoData: string;

      // 检查是否是本地测试文件
      if (video.videoUrl.includes('test.mp4') || video.videoUrl.includes('D:\\Files\\DancingAI')) {
        // 对于本地测试文件，使用文件路径
        videoData = video.videoUrl;
        console.log('使用本地测试文件进行分析:', videoData);
      } else {
        // 对于其他视频，使用base64格式
        videoData = `data:video/mp4;base64,${video.videoUrl}`;
      }

      // 使用视频分析服务
      const analysisService = VideoAnalysisService.getInstance();
      const result = await analysisService.analyzeVideo(videoData, type);

      setAnalysisResult(result);

    } catch (error) {
      console.error('AI分析失败:', error);
      Alert.alert('分析失败', error instanceof Error ? error.message : '视频分析失败，请稍后重试');
      setShowAIAnalysis(false);
    } finally {
      setIsAnalyzing(false);
    }
  };



  // 关闭AI分析弹窗
  const closeAIAnalysis = () => {
    setShowAIAnalysis(false);
    setAnalysisResult(null);
    setIsAnalyzing(false);
  };

  // 检查视频是否可播放
  const isVideoPlayable = () => {
    // 检查是否是本地测试文件或有效的视频URL
    return video.videoUrl.includes('test.mp4') ||
           video.videoUrl.includes('D:\\Files\\DancingAI') ||
           video.videoUrl.startsWith('http') ||
           video.videoUrl.startsWith('file://');
  };

  // 获取视频源
  const getVideoSource = () => {
    if (video.videoUrl.includes('test.mp4') || video.videoUrl.includes('D:\\Files\\DancingAI')) {
      // 对于本地测试文件，需要转换为正确的URI格式
      // 在实际应用中，这里应该是正确的本地文件路径
      return { uri: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' }; // 临时使用示例视频
    }
    return { uri: video.videoUrl };
  };

  // 渲染视频播放器
  const renderVideoPlayer = () => {
    if (!isVideoPlayable()) return null;

    return (
      <View style={styles.videoPlayerContainer}>
        {/* 简化的视频播放器 - 使用Image作为占位符 */}
        <Image
          source={getVideoSource()}
          style={styles.videoPlayer}
          resizeMode="cover"
        />
      </View>
    );
  };

  // AI实时指导功能
  const toggleAIRealTimeGuide = () => {
    setAiRealTimeGuide(!aiRealTimeGuide);
    if (!aiRealTimeGuide) {
      // 开启实时指导时，开始提供提示
      startRealTimeGuidance();
    } else {
      // 关闭时清空提示
      setCurrentAITip('');
    }
  };

  // 开始实时指导
  const startRealTimeGuidance = () => {
    const tips = [
      '注意保持身体重心稳定',
      '手臂动作要更加流畅',
      '跟上音乐的节拍',
      '表情要更加自然',
      '注意腿部动作的力度',
      '保持动作的连贯性'
    ];

    let tipIndex = 0;
    const tipInterval = setInterval(() => {
      if (aiRealTimeGuide && isPlaying) {
        setCurrentAITip(tips[tipIndex % tips.length]);
        tipIndex++;
      } else {
        clearInterval(tipInterval);
        setCurrentAITip('');
      }
    }, 3000); // 每3秒更换一个提示
  };

  // 切换练习模式
  const switchPracticeMode = (mode: 'follow' | 'compare' | 'learn') => {
    setPracticeMode(mode);

    // 根据模式提供不同的AI指导
    const modeMessages = {
      follow: '跟练模式：跟着视频一起练习',
      compare: '对比模式：对比您的动作与标准动作',
      learn: '学习模式：分解学习每个动作'
    };

    setCurrentAITip(modeMessages[mode]);
    setTimeout(() => setCurrentAITip(''), 2000);
  };

  // 模拟节拍变化
  useEffect(() => {
    if (isPlaying) {
      const beatInterval = setInterval(() => {
        setCurrentBeat(prev => prev === 4 ? 1 : prev + 1);
      }, 500); // 每0.5秒变化一次节拍

      return () => clearInterval(beatInterval);
    }
  }, [isPlaying]);

  // 节拍指示器组件
  const BeatIndicator = () => (
    <View style={styles.beatIndicator}>
      {[1, 2, 3, 4].map((beat) => (
        <View
          key={beat}
          style={[
            styles.beatDot,
            currentBeat === beat && styles.activeBeatDot
          ]}
        />
      ))}
    </View>
  );

  // 右侧功能栏组件
  const RightFunctionBar = () => (
    <>
      {/* 智能分段 - 与进度条平齐 */}
      <TouchableOpacity
        style={styles.segmentationButton}
        onPress={() => setSegmentationEnabled(!segmentationEnabled)}
      >
        <Image
          source={segmentationEnabled
            ? require('../assets/icons/segmentation_click.png')
            : require('../assets/icons/segmentation_not_click.png')
          }
          style={styles.functionIcon}
        />
      </TouchableOpacity>

      {/* 其他功能按钮 */}
      <View style={styles.rightFunctionBar}>
        {/* AI指导 */}
        <TouchableOpacity
          style={styles.functionButton}
          onPress={() => setAiGuideEnabled(!aiGuideEnabled)}
        >
          <Image
            source={aiGuideEnabled
              ? require('../assets/icons/video_coaching_click.png')
              : require('../assets/icons/video_coaching_not_click.png')
            }
            style={styles.functionIcon}
          />
        </TouchableOpacity>

        {/* 循环播放 */}
        <TouchableOpacity
          style={styles.functionButton}
          onPress={() => setLoopEnabled(!loopEnabled)}
        >
          <Image
            source={loopEnabled
              ? require('../assets/icons/loop_playback_click.png')
              : require('../assets/icons/loop_playback_not_click.png')
            }
            style={styles.functionIcon}
          />
        </TouchableOpacity>

        {isTeachingMode ? (
          <>
            {/* 教学模式：文字动作提示 */}
            <TouchableOpacity
              style={styles.functionButton}
              onPress={() => setTextPromptEnabled(!textPromptEnabled)}
            >
              <Image
                source={textPromptEnabled
                  ? require('../assets/icons/text_motion_prompt_click.png')
                  : require('../assets/icons/text_motion_prompt_not_click.png')
                }
                style={styles.functionIcon}
              />
            </TouchableOpacity>

            {/* 教学模式：语音指导 */}
            <TouchableOpacity
              style={styles.functionButton}
              onPress={() => setVoiceGuideEnabled(!voiceGuideEnabled)}
            >
              <Image
                source={voiceGuideEnabled
                  ? require('../assets/icons/video_coaching_click.png')
                  : require('../assets/icons/video_coaching_not_click.png')
                }
                style={styles.functionIcon}
              />
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* 原视频模式：倍速播放 */}
            <TouchableOpacity
              style={styles.functionButton}
              onPress={() => setShowSpeedSelector(!showSpeedSelector)}
            >
              <Image
                source={showSpeedSelector
                  ? require('../assets/icons/speed_click.png')
                  : require('../assets/icons/speed_not_click.png')
                }
                style={styles.functionIcon}
              />
            </TouchableOpacity>
          </>
        )}

        {/* AI实时指导 */}
        <TouchableOpacity
          style={[styles.functionButton, aiRealTimeGuide && styles.activeFunctionButton]}
          onPress={toggleAIRealTimeGuide}
        >
          <Svg width={30} height={30} viewBox="0 0 24 24" fill={aiRealTimeGuide ? "#E8FFBD" : "white"}>
            <Path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 21H5V3H14V9H19Z"/>
          </Svg>
        </TouchableOpacity>

        {/* AI智能分析 */}
        <TouchableOpacity
          style={styles.functionButton}
          onPress={() => setShowAIAnalysis(true)}
        >
          <Svg width={30} height={30} viewBox="0 0 24 24" fill="white">
            <Path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"/>
          </Svg>
        </TouchableOpacity>

        {/* 设置 */}
        <TouchableOpacity
          style={styles.functionButton}
          onPress={() => setShowSettings(!showSettings)}
        >
          <Image
            source={require('../assets/icons/setting.png')}
            style={styles.functionIcon}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="black" />

      {/* 视频播放器容器 */}
      <View style={[styles.videoContainer, isMinimized && styles.minimizedVideoContainer]}>
        {/* 视频播放器 */}
        {renderVideoPlayer()}

        {/* 如果没有真实视频，显示缩略图 */}
        {!isVideoPlayable() && (
          <Image
            source={{ uri: video.thumbnailUrl }}
            style={styles.videoThumbnail}
          />
        )}



        {/* 返回按钮 */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Image
            source={require('../assets/icons/back_to_previous_page.png')}
            style={styles.backIcon}
          />
        </TouchableOpacity>

        {/* 右上角模式切换按钮 */}
        {!isMinimized && (
          <TouchableOpacity
            style={styles.modeToggle}
            onPress={() => setIsTeachingMode(!isTeachingMode)}
          >
            <Image
              source={isTeachingMode
                ? require('../assets/icons/coaching.png')
                : require('../assets/icons/origin.png')
              }
              style={styles.modeIcon}
            />
          </TouchableOpacity>
        )}

        {/* 节拍指示器 - 只在全屏时显示 */}
        {!isMinimized && <BeatIndicator />}

        {/* AI实时提示 - 只在开启AI指导时显示 */}
        {!isMinimized && aiRealTimeGuide && currentAITip && (
          <View style={styles.aiTipContainer}>
            <Text style={styles.aiTipText}>🤖 {currentAITip}</Text>
          </View>
        )}

        {/* 练习模式选择器 */}
        {!isMinimized && aiRealTimeGuide && (
          <View style={styles.practiceModeSelector}>
            <TouchableOpacity
              style={[styles.practiceModeButton, practiceMode === 'follow' && styles.activePracticeModeButton]}
              onPress={() => switchPracticeMode('follow')}
            >
              <Text style={[styles.practiceModeText, practiceMode === 'follow' && styles.activePracticeModeText]}>跟练</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.practiceModeButton, practiceMode === 'compare' && styles.activePracticeModeButton]}
              onPress={() => switchPracticeMode('compare')}
            >
              <Text style={[styles.practiceModeText, practiceMode === 'compare' && styles.activePracticeModeText]}>对比</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.practiceModeButton, practiceMode === 'learn' && styles.activePracticeModeButton]}
              onPress={() => switchPracticeMode('learn')}
            >
              <Text style={[styles.practiceModeText, practiceMode === 'learn' && styles.activePracticeModeText]}>学习</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* 右侧功能栏 - 只在全屏时显示 */}
        {!isMinimized && <RightFunctionBar />}

        {/* 倍速选择器 */}
        {!isMinimized && showSpeedSelector && !isTeachingMode && (
          <View style={styles.speedSelector}>
            <View style={styles.speedPanel}>
              {[0.5, 0.7, 1.0, 1.2].map((speed) => (
                <TouchableOpacity
                  key={speed}
                  style={[
                    styles.speedOption,
                    currentSpeed === speed && styles.speedOptionActive
                  ]}
                  onPress={() => {
                    setCurrentSpeed(speed);
                    setShowSpeedSelector(false);
                  }}
                >
                  <Text style={[
                    styles.speedText,
                    currentSpeed === speed && styles.speedTextActive
                  ]}>
                    {speed}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* 设置弹窗 */}
        {!isMinimized && showSettings && (
          <View style={styles.settingsPopup}>
            {/* 设置弹窗背景 */}
            <View style={styles.settingsPanel}>
              {/* 镜像跟练选项 */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>镜像跟练</Text>
                <TouchableOpacity
                  style={styles.settingToggle}
                  onPress={() => setMirrorMode(!mirrorMode)}
                >
                  <Image
                    source={mirrorMode
                      ? require('../assets/icons/on.png')
                      : require('../assets/icons/off.png')
                    }
                    style={styles.settingToggleIcon}
                  />
                </TouchableOpacity>
              </View>

              {/* BGM去人声选项 */}
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>BGM去人声</Text>
                <TouchableOpacity
                  style={styles.settingToggle}
                  onPress={() => setBgmRemoval(!bgmRemoval)}
                >
                  <Image
                    source={bgmRemoval
                      ? require('../assets/icons/on.png')
                      : require('../assets/icons/off.png')
                    }
                    style={styles.settingToggleIcon}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* 缩小/放大按钮 */}
        <TouchableOpacity
          style={styles.minimizeButton}
          onPress={() => setIsMinimized(!isMinimized)}
        >
          <Svg width={40} height={40} viewBox="0 0 24 24" fill="white">
            <Path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"/>
          </Svg>
        </TouchableOpacity>

        {/* 底部B站风格进度条 */}
        {!isMinimized && (
          <View style={styles.bilibiliProgressContainer}>
            {/* 播放按钮 */}
            <TouchableOpacity
              style={styles.playButtonBilibili}
              onPress={handlePlayPause}
            >
              <Image
                source={isPlaying
                  ? require('../assets/icons/stop.png')
                  : require('../assets/icons/start.png')
                }
                style={styles.playIconBilibili}
              />
            </TouchableOpacity>

            {/* 进度条和时间容器 */}
            <View style={styles.progressTimeContainer}>
              {/* 时间显示 */}
              <Text style={styles.timeTextBilibili}>{video.duration}</Text>

              {/* 进度条长条条 */}
              <View style={styles.progressBarInline}>
                <View style={[styles.progressFillInline, { width: `${currentProgress * 100}%` }]} />
              </View>
            </View>

            {/* 章节信息 */}
            <Text style={styles.chapterTextBilibili}>章节：{currentSection}</Text>
          </View>
        )}


      </View>

      {/* 详情信息卡片 - 只在缩小时显示 */}
      {isMinimized && (
        <ScrollView style={styles.detailCard} showsVerticalScrollIndicator={false}>
          {/* 标题区域 */}
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{video.title}</Text>
            <Text style={styles.cardSubtitle}>上传于2025年8月16日 14:10:00</Text>
            <Text style={styles.cardDuration}>练习时长73分钟</Text>
          </View>

          {/* 标签区域 */}
          <View style={styles.cardTags}>
            {video.tags.map((tag, index) => (
              <View key={index} style={styles.cardTag}>
                <Text style={styles.cardTagText}>#{tag}</Text>
              </View>
            ))}
          </View>

          {/* 两个大按钮 */}
          <View style={styles.cardActions}>
            <TouchableOpacity style={[styles.cardActionButton, styles.practiceRecordButton]}>
              <Text style={styles.practiceRecordText}>查看练习记录</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.cardActionButton, styles.collectionButton]}>
              <Text style={styles.collectionText}>所属合集</Text>
            </TouchableOpacity>
          </View>

          {/* 相关视频列表 */}
          <View style={styles.relatedVideos}>
            <View style={styles.relatedVideoItem}>
              <Image
                source={{ uri: 'https://picsum.photos/80/60?random=1' }}
                style={styles.relatedVideoThumbnail}
              />
              <View style={styles.relatedVideoContent}>
                <Text style={styles.relatedVideoTitle}>Nanan Kiss me thru the phone爵士双人舞</Text>
                <View style={styles.relatedVideoMeta}>
                  <Text style={styles.relatedVideoTime}>60min</Text>
                  <Text style={styles.relatedVideoProgress}>练了又练</Text>
                  <Text style={styles.relatedVideoCurrentTime}>01:07</Text>
                </View>
              </View>
            </View>

            <View style={styles.relatedVideoItem}>
              <Image
                source={{ uri: 'https://picsum.photos/80/60?random=2' }}
                style={styles.relatedVideoThumbnail}
              />
              <View style={styles.relatedVideoContent}>
                <Text style={styles.relatedVideoTitle}>Lap Tap Love 特别萌呀</Text>
                <View style={styles.relatedVideoMeta}>
                  <Text style={styles.relatedVideoTime}>45min</Text>
                  <Text style={styles.relatedVideoProgress}>新手推荐</Text>
                  <Text style={styles.relatedVideoCurrentTime}>02:15</Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* AI智能分析模态框 */}
      <Modal
        visible={showAIAnalysis}
        transparent={true}
        animationType="slide"
        onRequestClose={closeAIAnalysis}
      >
        <View style={styles.aiAnalysisOverlay}>
          <View style={styles.aiAnalysisContent}>
            <View style={styles.aiAnalysisHeader}>
              <Text style={styles.aiAnalysisTitle}>AI智能分析</Text>
              <TouchableOpacity onPress={closeAIAnalysis}>
                <Text style={styles.aiAnalysisClose}>✕</Text>
              </TouchableOpacity>
            </View>

            {!analysisResult && !isAnalyzing && (
              <View style={styles.analysisTypeSelector}>
                <Text style={styles.selectorTitle}>选择分析类型</Text>

                <TouchableOpacity
                  style={styles.analysisTypeButton}
                  onPress={() => startAIAnalysis('overall')}
                >
                  <Text style={styles.analysisTypeText}>🎯 综合分析</Text>
                  <Text style={styles.analysisTypeDesc}>全面评估技术、节拍、表现力</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.analysisTypeButton}
                  onPress={() => startAIAnalysis('technique')}
                >
                  <Text style={styles.analysisTypeText}>💪 技术分析</Text>
                  <Text style={styles.analysisTypeDesc}>专注动作准确性和技术细节</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.analysisTypeButton}
                  onPress={() => startAIAnalysis('rhythm')}
                >
                  <Text style={styles.analysisTypeText}>🎵 节拍分析</Text>
                  <Text style={styles.analysisTypeDesc}>分析音乐感和节拍把握</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.analysisTypeButton}
                  onPress={() => startAIAnalysis('expression')}
                >
                  <Text style={styles.analysisTypeText}>✨ 表现力分析</Text>
                  <Text style={styles.analysisTypeDesc}>评估情感表达和舞台魅力</Text>
                </TouchableOpacity>
              </View>
            )}

            {isAnalyzing && (
              <View style={styles.analyzingSection}>
                <ActivityIndicator size="large" color="#E8FFBD" />
                <Text style={styles.analyzingText}>AI正在分析您的舞蹈...</Text>
                <Text style={styles.analyzingSubtext}>
                  {analysisType === 'overall' && '正在进行综合评估'}
                  {analysisType === 'technique' && '正在分析技术动作'}
                  {analysisType === 'rhythm' && '正在分析节拍音乐性'}
                  {analysisType === 'expression' && '正在分析表现力'}
                </Text>
              </View>
            )}

            {analysisResult && (
              <ScrollView style={styles.analysisResultSection}>
                <View style={styles.scoreDisplay}>
                  <Text style={styles.scoreLabel}>AI评分</Text>
                  <Text style={styles.scoreValue}>{analysisResult.score}/100</Text>
                </View>

                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>🌟 亮点表现</Text>
                  {analysisResult.highlights?.map((item: string, index: number) => (
                    <Text key={index} style={styles.resultItem}>• {item}</Text>
                  ))}
                </View>

                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>💡 AI反馈</Text>
                  {analysisResult.feedback?.map((item: string, index: number) => (
                    <Text key={index} style={styles.resultItem}>• {item}</Text>
                  ))}
                </View>

                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>🎯 改进建议</Text>
                  {analysisResult.improvements?.map((item: string, index: number) => (
                    <Text key={index} style={styles.resultItem}>• {item}</Text>
                  ))}
                </View>

                <View style={styles.resultSection}>
                  <Text style={styles.resultSectionTitle}>📈 下一步练习</Text>
                  {analysisResult.nextSteps?.map((item: string, index: number) => (
                    <Text key={index} style={styles.resultItem}>• {item}</Text>
                  ))}
                </View>

                <TouchableOpacity
                  style={styles.newAnalysisButton}
                  onPress={() => {
                    setAnalysisResult(null);
                    setIsAnalyzing(false);
                  }}
                >
                  <Text style={styles.newAnalysisButtonText}>重新分析</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  // 视频容器样式
  videoContainer: {
    width: width,
    height: height,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  minimizedVideoContainer: {
    height: height * 0.5,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  // 控制按钮
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  minimizeButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  // 模式切换按钮
  modeToggle: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modeIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  // 节拍指示器
  beatIndicator: {
    position: 'absolute',
    top: 120,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  beatDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    marginHorizontal: 8,
  },
  activeBeatDot: {
    backgroundColor: 'white',
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  // 智能分段按钮 - 与进度条平齐
  segmentationButton: {
    position: 'absolute',
    right: 12,
    bottom: 80, // 与进度条平齐
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  // 右侧功能栏 - 其他按钮
  rightFunctionBar: {
    position: 'absolute',
    right: 12,
    bottom: 160, // 从智能分段按钮下方开始
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 10,
  },
  functionButton: {
    width: 60,
    height: 60,
    borderRadius: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 8, // 增加间距，使图标间隔相等
  },
  functionIcon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  // B站风格底部控制栏
  bilibiliProgressContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 80, // 为右侧智能分段按钮留出空间
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 8,
    zIndex: 10,
  },
  playButtonBilibili: {
    width: 50, // 放大播放按钮
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  playIconBilibili: {
    width: 32, // 放大播放图标
    height: 32,
    resizeMode: 'contain',
  },
  timeTextBilibili: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '500',
    marginRight: 12,
  },
  chapterTextBilibili: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    marginLeft: 12,
  },
  // 进度条和时间容器
  progressTimeContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  // 内联进度条（在控制栏中间）
  progressBarInline: {
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 1.5,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressFillInline: {
    height: '100%',
    backgroundColor: '#00AEEC', // B站蓝色
    borderRadius: 1.5,
  },

  // 设置弹窗样式
  settingsPopup: {
    position: 'absolute',
    right: 84, // 在设置按钮左侧相邻处（12px右边距 + 60px按钮宽度 + 12px间距）
    bottom: 160, // 与设置按钮齐平（与rightFunctionBar的bottom相同）
    zIndex: 15,
  },
  settingsPanel: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 12,
    padding: 20,
    minWidth: 160,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  settingToggle: {
    padding: 8, // 增加点击区域
  },
  settingToggleIcon: {
    width: 36, // 放大on/off图标
    height: 36,
    resizeMode: 'contain',
  },

  // 倍速选择器样式
  speedSelector: {
    position: 'absolute',
    right: 84, // 与设置弹窗相同位置
    bottom: 240, // 在倍速按钮左侧
    zIndex: 15,
  },
  speedPanel: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    minWidth: 200,
  },
  speedOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginHorizontal: 2,
    minWidth: 40,
    alignItems: 'center',
  },
  speedOptionActive: {
    backgroundColor: '#E8FFBD', // 浅绿色背景
  },
  speedText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  speedTextActive: {
    color: '#333',
    fontWeight: '600',
  },

  // 详情卡片样式
  detailCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  cardHeader: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    lineHeight: 28,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  cardDuration: {
    fontSize: 14,
    color: '#999',
  },
  cardTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  cardTag: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
  },
  cardTagText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 25,
    gap: 15,
  },
  cardActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 25,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  practiceRecordButton: {
    backgroundColor: '#E8FFBD', // 浅绿色，与设计稿一致
  },
  practiceRecordText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  collectionButton: {
    backgroundColor: '#FFD700', // 金黄色，与设计稿一致
  },
  collectionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  relatedVideos: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  relatedVideoItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  relatedVideoThumbnail: {
    width: 80,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  relatedVideoContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  relatedVideoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    lineHeight: 22,
    marginBottom: 8,
  },
  relatedVideoMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  relatedVideoTime: {
    fontSize: 12,
    color: '#999',
  },
  relatedVideoProgress: {
    fontSize: 12,
    color: '#999',
    marginLeft: 15,
  },
  relatedVideoCurrentTime: {
    fontSize: 12,
    color: '#999',
    marginLeft: 'auto',
  },

  // AI分析模态框样式
  aiAnalysisOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiAnalysisContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxHeight: '85%',
  },
  aiAnalysisHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  aiAnalysisTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  aiAnalysisClose: {
    fontSize: 24,
    color: '#999',
    fontWeight: 'bold',
  },
  analysisTypeSelector: {
    paddingVertical: 10,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
    textAlign: 'center',
  },
  analysisTypeButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  analysisTypeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  analysisTypeDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
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
    marginBottom: 5,
  },
  analyzingSubtext: {
    fontSize: 14,
    color: '#666',
  },
  analysisResultSection: {
    maxHeight: 400,
  },
  scoreDisplay: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  scoreValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  resultSection: {
    marginBottom: 20,
  },
  resultSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  resultItem: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 5,
  },
  newAnalysisButton: {
    backgroundColor: '#E8FFBD',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 30,
    alignSelf: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  newAnalysisButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },

  // AI实时指导相关样式
  activeFunctionButton: {
    backgroundColor: 'rgba(232, 255, 189, 0.3)',
    borderWidth: 2,
    borderColor: '#E8FFBD',
  },
  aiTipContainer: {
    position: 'absolute',
    top: 160,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    zIndex: 5,
  },
  aiTipText: {
    color: '#E8FFBD',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  practiceModeSelector: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 10,
    zIndex: 5,
  },
  practiceModeButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    backgroundColor: 'transparent',
  },
  activePracticeModeButton: {
    backgroundColor: '#E8FFBD',
  },
  practiceModeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  activePracticeModeText: {
    color: '#333',
  },

  // 视频播放器相关样式
  videoPlayerContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  videoPlayer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000',
  },

});

export default VideoDetailScreen;
