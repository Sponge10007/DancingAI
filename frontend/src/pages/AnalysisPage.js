import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  Progress,
  Space,
  Button,
  Alert,
  Row,
  Col,
  Spin,
  Steps,
  message
} from 'antd';
import {
  LoadingOutlined,
  CheckCircleOutlined,
  SoundOutlined,
  UserOutlined,
  PlayCircleOutlined,
  FileTextOutlined
} from '@ant-design/icons';
import { performFullAnalysis, getVideoInfo } from '../services/api';

const { Title, Paragraph } = Typography;
const { Step } = Steps;

const AnalysisPage = ({ video, onAnalysisComplete }) => {
  const { videoId } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [analysisData, setAnalysisData] = useState(null);
  const [error, setError] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analysisSteps = [
    {
      title: '视频信息',
      description: '获取视频基本信息',
      icon: <PlayCircleOutlined />,
      key: 'video_info'
    },
    {
      title: '节拍检测',
      description: '分析音乐节拍和BPM',
      icon: <SoundOutlined />,
      key: 'beat_detection'
    },
    {
      title: '姿态识别',
      description: '检测舞蹈姿态和动作',
      icon: <UserOutlined />,
      key: 'pose_detection'
    },
    {
      title: '动作分析',
      description: '生成动作描述和指导',
      icon: <FileTextOutlined />,
      key: 'action_analysis'
    }
  ];

  const [videoInfo, setVideoInfo] = useState(null);

  useEffect(() => {
    if (videoId) {
      // 首先获取视频信息
      fetchVideoInfo();
      if (!analysisData) {
        startAnalysis();
      }
    }
  }, [videoId]);

  const fetchVideoInfo = async () => {
    try {
      const info = await getVideoInfo(videoId);
      setVideoInfo(info);
    } catch (error) {
      console.error('获取视频信息失败:', error);
      setError('获取视频信息失败');
    }
  };

  const startAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    
    try {
      const results = await performFullAnalysis(videoId, (progressInfo) => {
        const { step, progress: currentProgress } = progressInfo;
        
        // 更新进度
        setProgress(currentProgress);
        
        // 更新当前步骤
        const stepIndex = analysisSteps.findIndex(s => s.key === step);
        if (stepIndex !== -1) {
          setCurrentStep(stepIndex);
        }
        
        // 如果完成，跳转到结果页面
        if (step === 'complete') {
          setAnalysisData(results);
          onAnalysisComplete(results);
          message.success('分析完成！');
          setTimeout(() => {
            navigate(`/result/${videoId}`);
          }, 1000);
        }
      });
      
    } catch (err) {
      setError(err.message || '分析过程中出现错误');
      message.error('分析失败，请重试');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRetry = () => {
    setCurrentStep(0);
    setProgress(0);
    setError(null);
    startAnalysis();
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="page-container fade-in">
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <Title level={2} className="page-title">
            正在分析您的舞蹈视频
          </Title>
          <Paragraph className="page-subtitle">
            请稍候，我们的AI正在为您分析视频内容...
          </Paragraph>
        </div>

        {/* 分析进度卡片 */}
        <Card className="glass-card" style={{ marginBottom: 32 }}>
          {/* 进度条 */}
          <div style={{ marginBottom: 32 }}>
            <Progress
              percent={progress}
              status={error ? 'exception' : isAnalyzing ? 'active' : 'success'}
              strokeColor={{
                '0%': '#667eea',
                '100%': '#764ba2',
              }}
              trailColor="rgba(255, 255, 255, 0.1)"
              strokeWidth={8}
              showInfo={true}
              format={(percent) => `${percent}%`}
            />
          </div>

          {/* 步骤指示器 */}
          <Steps
            current={currentStep}
            status={error ? 'error' : 'process'}
            direction="vertical"
            size="small"
          >
            {analysisSteps.map((step, index) => (
              <Step
                key={step.key}
                title={step.title}
                description={step.description}
                icon={
                  index < currentStep ? (
                    <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  ) : index === currentStep && isAnalyzing ? (
                    <LoadingOutlined spin />
                  ) : (
                    step.icon
                  )
                }
              />
            ))}
          </Steps>
        </Card>

        {/* 错误信息 */}
        {error && (
          <Alert
            message="分析失败"
            description={error}
            type="error"
            showIcon
            style={{ marginBottom: 24 }}
            action={
              <Space>
                <Button size="small" onClick={handleRetry}>
                  重试
                </Button>
                <Button size="small" type="text" onClick={handleCancel}>
                  取消
                </Button>
              </Space>
            }
          />
        )}

        {/* 视频信息卡片 */}
        {(videoInfo || video) && (
          <Card
            className="glass-card"
            title="视频信息"
            style={{ marginBottom: 32 }}
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div>
                  <strong>文件名：</strong>
                  <br />
                  {videoInfo ? videoInfo.filename : video.filename}
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>文件大小：</strong>
                  <br />
                  {((videoInfo ? videoInfo.file_size : video.file_size) / 1024 / 1024).toFixed(2)} MB
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>视频时长：</strong>
                  <br />
                  {(() => {
                    const duration = videoInfo ? videoInfo.duration : video.duration;
                    return `${Math.floor(duration / 60)}:${Math.floor(duration % 60).toString().padStart(2, '0')}`;
                  })()}
                </div>
              </Col>
              <Col span={12}>
                <div>
                  <strong>上传时间：</strong>
                  <br />
                  {videoInfo ?
                    new Date(videoInfo.upload_time * 1000).toLocaleString() :
                    new Date(video.upload_timestamp).toLocaleString()
                  }
                </div>
              </Col>
            </Row>
          </Card>
        )}

        {/* 分析说明 */}
        <Card className="glass-card" title="分析内容说明">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <SoundOutlined style={{ color: '#667eea', marginRight: 8 }} />
              <strong>节拍检测：</strong>
              分析音频信号，识别音乐的节拍点和BPM，为舞蹈节奏提供精确参考
            </div>
            <div>
              <UserOutlined style={{ color: '#667eea', marginRight: 8 }} />
              <strong>姿态识别：</strong>
              使用MediaPipe技术检测人体关键点，分析舞蹈动作的姿态变化
            </div>
            <div>
              <FileTextOutlined style={{ color: '#667eea', marginRight: 8 }} />
              <strong>动作分析：</strong>
              结合AI技术生成动作描述，提供专业的舞蹈教学指导和技巧要点
            </div>
            <div>
              <PlayCircleOutlined style={{ color: '#667eea', marginRight: 8 }} />
              <strong>视频分段：</strong>
              自动识别音乐结构，划分主歌、副歌、间奏等段落，便于分段学习
            </div>
          </Space>
        </Card>

        {/* 操作按钮 */}
        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <Space>
            <Button onClick={handleCancel}>
              返回首页
            </Button>
            {error && (
              <Button type="primary" onClick={handleRetry}>
                重新分析
              </Button>
            )}
          </Space>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;
