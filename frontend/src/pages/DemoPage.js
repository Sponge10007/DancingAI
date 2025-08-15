import React, { useState } from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Space,
  Divider,
  Timeline,
  Tag,
  Image,
  Alert
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  PlayCircleOutlined,
  SoundOutlined,
  UserOutlined,
  FileTextOutlined,
  RocketOutlined,
  CheckCircleOutlined,
  ExperimentOutlined,
  BulbOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const DemoPage = () => {
  const navigate = useNavigate();
  const [activeDemo, setActiveDemo] = useState(null);

  const demoFeatures = [
    {
      id: 'beat-detection',
      title: '节拍检测',
      icon: <SoundOutlined />,
      description: '智能分析音乐节拍，识别BPM和节奏模式',
      color: '#1890ff',
      details: [
        '自动检测音乐的BPM（每分钟节拍数）',
        '识别节拍的强弱模式',
        '生成节拍网格，帮助对齐动作',
        '支持复杂节奏和变速音乐'
      ]
    },
    {
      id: 'pose-detection',
      title: '姿态识别',
      icon: <UserOutlined />,
      description: '精确识别人体关键点和舞蹈姿态',
      color: '#52c41a',
      details: [
        '检测33个人体关键点',
        '实时跟踪身体姿态变化',
        '分析动作的流畅性和稳定性',
        '识别舞蹈中的经典姿势'
      ]
    },
    {
      id: 'action-analysis',
      title: '动作分析',
      icon: <FileTextOutlined />,
      description: '智能分析舞蹈动作，生成专业指导',
      color: '#722ed1',
      details: [
        '自动识别舞蹈动作类型',
        '分析动作的技术要点',
        '提供改进建议和常见错误',
        '生成个性化教学指导'
      ]
    },
    {
      id: 'comprehensive',
      title: '综合分析',
      icon: <RocketOutlined />,
      description: '结合多种AI技术，提供全面的舞蹈分析',
      color: '#fa541c',
      details: [
        '音乐与动作的同步性分析',
        '舞蹈表现力评估',
        '学习进度跟踪',
        '个性化训练建议'
      ]
    }
  ];

  const analysisSteps = [
    {
      title: '视频上传',
      description: '上传您的舞蹈视频文件',
      icon: <PlayCircleOutlined />,
      status: 'finish'
    },
    {
      title: '音频提取',
      description: '从视频中提取音频信号',
      icon: <SoundOutlined />,
      status: 'finish'
    },
    {
      title: '节拍检测',
      description: '分析音乐节拍和BPM',
      icon: <SoundOutlined />,
      status: 'finish'
    },
    {
      title: '姿态识别',
      description: '检测人体关键点和姿态',
      icon: <UserOutlined />,
      status: 'finish'
    },
    {
      title: '动作分析',
      description: '生成动作描述和教学指导',
      icon: <FileTextOutlined />,
      status: 'finish'
    },
    {
      title: '结果生成',
      description: '整合分析结果，生成报告',
      icon: <CheckCircleOutlined />,
      status: 'finish'
    }
  ];

  return (
    <div className="page-container fade-in">
      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: 48 }}>
        <Title level={1} className="page-title slide-in-up">
          <ExperimentOutlined style={{ marginRight: 16, color: '#1890ff' }} />
          功能演示
        </Title>
        <Paragraph className="page-subtitle slide-in-up" style={{ fontSize: 18, maxWidth: 800, margin: '0 auto' }}>
          探索我们的AI舞蹈分析系统的强大功能，了解如何通过先进的计算机视觉和音频处理技术来提升您的舞蹈技能
        </Paragraph>
      </div>

      {/* 核心功能展示 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 64 }}>
        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
            <BulbOutlined style={{ marginRight: 8, color: '#faad14' }} />
            核心功能
          </Title>
        </Col>
        
        {demoFeatures.map((feature, index) => (
          <Col xs={24} sm={12} lg={6} key={feature.id}>
            <Card
              className="glass-card feature-demo-card slide-in-up"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                height: '100%',
                cursor: 'pointer',
                border: activeDemo === feature.id ? `2px solid ${feature.color}` : '1px solid rgba(255,255,255,0.1)'
              }}
              hoverable
              onClick={() => setActiveDemo(activeDemo === feature.id ? null : feature.id)}
            >
              <div style={{ textAlign: 'center', marginBottom: 16 }}>
                <div style={{
                  width: 60,
                  height: 60,
                  background: `linear-gradient(135deg, ${feature.color}, ${feature.color}aa)`,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto',
                  fontSize: 24,
                  color: 'white'
                }}>
                  {feature.icon}
                </div>
              </div>
              
              <Title level={4} style={{ textAlign: 'center', marginBottom: 12 }}>
                {feature.title}
              </Title>
              
              <Paragraph style={{ textAlign: 'center', marginBottom: 16 }}>
                {feature.description}
              </Paragraph>
              
              {activeDemo === feature.id && (
                <div className="fade-in">
                  <Divider />
                  <ul style={{ paddingLeft: 20, margin: 0 }}>
                    {feature.details.map((detail, idx) => (
                      <li key={idx} style={{ marginBottom: 8 }}>
                        <Text>{detail}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          </Col>
        ))}
      </Row>

      {/* 分析流程 */}
      <Row justify="center" style={{ marginBottom: 64 }}>
        <Col xs={24} lg={16}>
          <Card className="glass-card slide-in-up" style={{ animationDelay: '0.4s' }}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
              分析流程
            </Title>
            
            <Timeline
              mode="left"
              items={analysisSteps.map((step, index) => ({
                dot: step.icon,
                color: step.status === 'finish' ? 'green' : 'blue',
                children: (
                  <div>
                    <Title level={5}>{step.title}</Title>
                    <Paragraph>{step.description}</Paragraph>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* 技术特点 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 64 }}>
        <Col span={24}>
          <Title level={2} style={{ textAlign: 'center', marginBottom: 32 }}>
            技术特点
          </Title>
        </Col>
        
        <Col xs={24} md={8}>
          <Card className="glass-card slide-in-up" style={{ animationDelay: '0.5s', height: '100%' }}>
            <Title level={4}>
              <RocketOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              先进AI算法
            </Title>
            <Paragraph>
              采用最新的深度学习模型，包括MediaPipe姿态检测、Librosa音频分析等业界领先技术，确保分析结果的准确性和可靠性。
            </Paragraph>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card className="glass-card slide-in-up" style={{ animationDelay: '0.6s', height: '100%' }}>
            <Title level={4}>
              <CheckCircleOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              实时处理
            </Title>
            <Paragraph>
              优化的算法架构支持快速视频处理，通常在几分钟内完成完整的舞蹈分析，让您快速获得反馈和指导。
            </Paragraph>
          </Card>
        </Col>
        
        <Col xs={24} md={8}>
          <Card className="glass-card slide-in-up" style={{ animationDelay: '0.7s', height: '100%' }}>
            <Title level={4}>
              <BulbOutlined style={{ marginRight: 8, color: '#faad14' }} />
              智能指导
            </Title>
            <Paragraph>
              不仅提供技术分析，还结合舞蹈教学经验，生成个性化的学习建议和改进方案，帮助您更好地提升舞蹈技能。
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* 开始体验 */}
      <Row justify="center">
        <Col xs={24} sm={16} md={12} lg={8}>
          <Card className="glass-card slide-in-up" style={{ animationDelay: '0.8s', textAlign: 'center' }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              准备开始了吗？
            </Title>
            <Paragraph style={{ marginBottom: 24 }}>
              上传您的舞蹈视频，体验AI驱动的专业分析
            </Paragraph>
            <Space>
              <Button 
                type="primary" 
                size="large" 
                icon={<RocketOutlined />}
                onClick={() => navigate('/')}
              >
                开始分析
              </Button>
              <Button 
                size="large" 
                onClick={() => navigate('/about')}
              >
                了解更多
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DemoPage;
