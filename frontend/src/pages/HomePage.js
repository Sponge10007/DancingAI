import React, { useState } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Upload, 
  Button, 
  message, 
  Space,
  Statistic,
  Divider
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  InboxOutlined,
  PlayCircleOutlined,
  SoundOutlined,
  UserOutlined,
  BookOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';
import { uploadVideo } from '../services/api';

const { Title, Paragraph } = Typography;
const { Dragger } = Upload;

const HomePage = ({ onVideoUpload, currentVideo }) => {
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async (file) => {
    setUploading(true);
    try {
      const response = await uploadVideo(file);
      onVideoUpload(response);
      message.success('视频上传成功！');
      navigate(`/analysis/${response.video_id}`);
    } catch (error) {
      message.error('视频上传失败，请重试');
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
    return false; // 阻止默认上传行为
  };

  const uploadProps = {
    name: 'file',
    multiple: false,
    accept: '.mp4,.avi,.mov,.mkv,.flv',
    beforeUpload: handleUpload,
    showUploadList: false,
  };

  const features = [
    {
      icon: <SoundOutlined />,
      title: '智能节拍检测',
      description: '自动识别音乐节拍，精确标记每个拍点，帮助你掌握舞蹈节奏'
    },
    {
      icon: <UserOutlined />,
      title: '动作识别分析',
      description: '基于AI技术识别舞蹈动作，分解每个关键姿态和动作要点'
    },
    {
      icon: <BookOutlined />,
      title: '智能教学指导',
      description: '生成详细的文字教学指导，包含技巧要点和常见错误纠正'
    },
    {
      icon: <PlayCircleOutlined />,
      title: '视频分段分析',
      description: '自动识别主歌、副歌、间奏等段落，便于分段学习练习'
    }
  ];

  const stats = [
    { title: '支持格式', value: '5+', suffix: '种' },
    { title: '分析精度', value: '95', suffix: '%' },
    { title: '处理速度', value: '< 2', suffix: '分钟' },
    { title: '用户满意度', value: '98', suffix: '%' }
  ];

  return (
    <div className="page-container fade-in">
      {/* 主标题区域 */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <Title level={1} className="page-title slide-in-up">
          AI驱动的舞蹈视频分析系统
        </Title>
        <Paragraph className="page-subtitle slide-in-up" style={{ fontSize: 18, maxWidth: 600, margin: '0 auto 32px' }}>
          上传你的舞蹈视频，让AI为你分析节拍、识别动作、生成专业的教学指导
        </Paragraph>
        
        {/* 统计数据 */}
        <Row gutter={[24, 24]} style={{ maxWidth: 800, margin: '0 auto 48px' }}>
          {stats.map((stat, index) => (
            <Col xs={12} sm={6} key={index}>
              <div className="stat-card slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <Statistic
                  value={stat.value}
                  suffix={stat.suffix}
                  valueStyle={{ color: 'white', fontSize: 24, fontWeight: 700 }}
                />
                <div className="stat-label">{stat.title}</div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 上传区域 */}
      <Row justify="center" style={{ marginBottom: 64 }}>
        <Col xs={24} sm={20} md={16} lg={12}>
          <Card className="glass-card slide-in-up" style={{ animationDelay: '0.3s' }}>
            <Dragger {...uploadProps} className="upload-area" disabled={uploading}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.8)' }} />
              </p>
              <p className="ant-upload-text" style={{ fontSize: 18, fontWeight: 500 }}>
                {uploading ? '正在上传...' : '点击或拖拽视频文件到此区域'}
              </p>
              <p className="ant-upload-hint" style={{ fontSize: 14 }}>
                支持 MP4, AVI, MOV, MKV, FLV 格式，文件大小不超过 500MB
              </p>
            </Dragger>
            
            <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.2)', margin: '24px 0' }} />
            
            <Space direction="vertical" size="small" style={{ width: '100%', textAlign: 'center' }}>
              <div style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                安全上传，数据加密保护
              </div>
              <div style={{ color: 'rgba(0, 0, 0, 0.6)' }}>
                <ClockCircleOutlined style={{ color: '#1890ff', marginRight: 8 }} />
                通常在2分钟内完成分析
              </div>
            </Space>
          </Card>
        </Col>
      </Row>

      {/* 功能特性 */}
      <div style={{ marginBottom: 64 }}>
        <Title level={2} style={{ textAlign: 'center', color: 'white', marginBottom: 48 }}>
          <RocketOutlined style={{ marginRight: 12 }} />
          核心功能
        </Title>
        
        <Row gutter={[24, 24]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <div 
                className="feature-card slide-in-up" 
                style={{ animationDelay: `${0.5 + index * 0.1}s` }}
              >
                <div className="feature-icon">{feature.icon}</div>
                <Title level={4} className="feature-title">{feature.title}</Title>
                <Paragraph className="feature-description">
                  {feature.description}
                </Paragraph>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 使用步骤 */}
      <div style={{ textAlign: 'center' }}>
        <Title level={2} style={{ color: 'white', marginBottom: 48 }}>
          使用步骤
        </Title>
        
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} sm={8}>
            <div className="feature-card slide-in-up" style={{ animationDelay: '0.8s' }}>
              <div style={{ 
                width: 60, 
                height: 60, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 24,
                fontWeight: 'bold',
                color: 'white'
              }}>
                1
              </div>
              <Title level={4} className="feature-title">上传视频</Title>
              <Paragraph className="feature-description">
                选择你的舞蹈视频文件，支持多种常见格式
              </Paragraph>
            </div>
          </Col>
          
          <Col xs={24} sm={8}>
            <div className="feature-card slide-in-up" style={{ animationDelay: '0.9s' }}>
              <div style={{ 
                width: 60, 
                height: 60, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 24,
                fontWeight: 'bold',
                color: 'white'
              }}>
                2
              </div>
              <Title level={4} className="feature-title">AI分析</Title>
              <Paragraph className="feature-description">
                系统自动分析节拍、动作和结构，生成详细报告
              </Paragraph>
            </div>
          </Col>
          
          <Col xs={24} sm={8}>
            <div className="feature-card slide-in-up" style={{ animationDelay: '1.0s' }}>
              <div style={{ 
                width: 60, 
                height: 60, 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: 24,
                fontWeight: 'bold',
                color: 'white'
              }}>
                3
              </div>
              <Title level={4} className="feature-title">获取指导</Title>
              <Paragraph className="feature-description">
                查看分析结果和专业的舞蹈教学指导建议
              </Paragraph>
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default HomePage;
