import React from 'react';
import { 
  Typography, 
  Row, 
  Col, 
  Card, 
  Button, 
  Space,
  Divider,
  Avatar,
  Tag,
  Timeline,
  Statistic
} from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  RocketOutlined,
  TeamOutlined,
  BulbOutlined,
  HeartOutlined,
  GithubOutlined,
  MailOutlined,
  TrophyOutlined,
  StarOutlined,
  CodeOutlined,
  ExperimentOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AboutPage = () => {
  const navigate = useNavigate();

  const teamMembers = [
    {
      name: 'AI算法团队',
      role: '核心算法开发',
      avatar: '🤖',
      description: '负责深度学习模型的设计与优化，专注于计算机视觉和音频处理技术'
    },
    {
      name: '舞蹈专家团队',
      role: '专业指导',
      avatar: '💃',
      description: '提供专业的舞蹈知识和教学经验，确保分析结果的实用性和准确性'
    },
    {
      name: '产品开发团队',
      role: '产品设计与开发',
      avatar: '👨‍💻',
      description: '负责用户界面设计和系统架构，打造流畅的用户体验'
    }
  ];

  const technologies = [
    { name: 'MediaPipe', description: '谷歌开源的姿态检测框架', color: '#4285f4' },
    { name: 'Librosa', description: '专业的音频分析库', color: '#ff6b6b' },
    { name: 'OpenCV', description: '计算机视觉处理库', color: '#5cb85c' },
    { name: 'FastAPI', description: '高性能Web框架', color: '#009688' },
    { name: 'React', description: '现代化前端框架', color: '#61dafb' },
    { name: 'TensorFlow', description: '机器学习平台', color: '#ff6f00' }
  ];

  const milestones = [
    {
      title: '项目启动',
      description: '确定项目目标和技术方案',
      date: '2024年1月'
    },
    {
      title: '核心算法开发',
      description: '完成姿态检测和节拍分析算法',
      date: '2024年3月'
    },
    {
      title: '系统集成',
      description: '整合前后端系统，完成基础功能',
      date: '2024年6月'
    },
    {
      title: '测试优化',
      description: '进行大量测试，优化算法性能',
      date: '2024年8月'
    },
    {
      title: '正式发布',
      description: '系统正式上线，开始为用户服务',
      date: '2024年8月'
    }
  ];

  return (
    <div className="page-container fade-in">
      {/* 页面标题 */}
      <div style={{ textAlign: 'center', marginBottom: 64 }}>
        <Title level={1} className="page-title slide-in-up">
          <HeartOutlined style={{ marginRight: 16, color: '#ff4d4f' }} />
          关于我们
        </Title>
        <Paragraph className="page-subtitle slide-in-up" style={{ fontSize: 18, maxWidth: 800, margin: '0 auto' }}>
          我们致力于将人工智能技术与舞蹈艺术相结合，为舞蹈爱好者和专业人士提供智能化的学习和训练工具
        </Paragraph>
      </div>

      {/* 项目愿景 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 64 }}>
        <Col xs={24} lg={12}>
          <Card className="glass-card slide-in-up" style={{ height: '100%' }}>
            <Title level={3}>
              <BulbOutlined style={{ marginRight: 8, color: '#faad14' }} />
              我们的愿景
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              让每个人都能享受到专业级的舞蹈指导。通过AI技术，我们希望打破传统舞蹈教学的时空限制，
              让舞蹈学习变得更加智能、高效和有趣。
            </Paragraph>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              无论您是初学者还是专业舞者，我们的系统都能为您提供个性化的分析和建议，
              帮助您在舞蹈的道路上不断进步。
            </Paragraph>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card className="glass-card slide-in-up" style={{ animationDelay: '0.1s', height: '100%' }}>
            <Title level={3}>
              <RocketOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              技术创新
            </Title>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              我们采用最前沿的深度学习技术，结合计算机视觉和音频处理算法，
              实现了对舞蹈动作的精确识别和音乐节拍的智能分析。
            </Paragraph>
            <Paragraph style={{ fontSize: 16, lineHeight: 1.8 }}>
              系统能够实时处理视频数据，提供准确的姿态检测、节拍同步分析，
              并生成专业的教学指导建议。
            </Paragraph>
          </Card>
        </Col>
      </Row>

      {/* 核心数据 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 64 }}>
        <Col span={24}>
          <Card className="glass-card slide-in-up" style={{ animationDelay: '0.2s' }}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
              <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
              项目成果
            </Title>
            <Row gutter={[24, 24]} justify="center">
              <Col xs={12} sm={6}>
                <Statistic
                  title="支持视频格式"
                  value={5}
                  suffix="种"
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="检测关键点"
                  value={33}
                  suffix="个"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="处理速度"
                  value={30}
                  suffix="FPS"
                  valueStyle={{ color: '#722ed1' }}
                />
              </Col>
              <Col xs={12} sm={6}>
                <Statistic
                  title="分析准确率"
                  value={95}
                  suffix="%"
                  valueStyle={{ color: '#fa541c' }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 技术栈 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 64 }}>
        <Col span={24}>
          <Card className="glass-card slide-in-up" style={{ animationDelay: '0.3s' }}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
              <CodeOutlined style={{ marginRight: 8, color: '#52c41a' }} />
              技术栈
            </Title>
            <Row gutter={[16, 16]} justify="center">
              {technologies.map((tech, index) => (
                <Col key={tech.name} xs={12} sm={8} md={6} lg={4}>
                  <div style={{ textAlign: 'center' }}>
                    <Tag 
                      color={tech.color} 
                      style={{ 
                        fontSize: 14, 
                        padding: '8px 16px',
                        borderRadius: 20,
                        marginBottom: 8
                      }}
                    >
                      {tech.name}
                    </Tag>
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {tech.description}
                      </Text>
                    </div>
                  </div>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* 团队介绍 */}
      <Row gutter={[24, 24]} style={{ marginBottom: 64 }}>
        <Col span={24}>
          <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
            <TeamOutlined style={{ marginRight: 8, color: '#722ed1' }} />
            团队介绍
          </Title>
        </Col>
        
        {teamMembers.map((member, index) => (
          <Col xs={24} md={8} key={member.name}>
            <Card 
              className="glass-card slide-in-up" 
              style={{ 
                animationDelay: `${0.4 + index * 0.1}s`,
                height: '100%',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 16 }}>
                {member.avatar}
              </div>
              <Title level={4}>{member.name}</Title>
              <Tag color="blue" style={{ marginBottom: 16 }}>
                {member.role}
              </Tag>
              <Paragraph>{member.description}</Paragraph>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 发展历程 */}
      <Row justify="center" style={{ marginBottom: 64 }}>
        <Col xs={24} lg={16}>
          <Card className="glass-card slide-in-up" style={{ animationDelay: '0.7s' }}>
            <Title level={3} style={{ textAlign: 'center', marginBottom: 32 }}>
              <ExperimentOutlined style={{ marginRight: 8, color: '#fa541c' }} />
              发展历程
            </Title>
            
            <Timeline
              mode="left"
              items={milestones.map((milestone, index) => ({
                dot: <StarOutlined style={{ color: '#faad14' }} />,
                color: 'blue',
                children: (
                  <div>
                    <Title level={5}>{milestone.title}</Title>
                    <Text type="secondary">{milestone.date}</Text>
                    <Paragraph style={{ marginTop: 8 }}>
                      {milestone.description}
                    </Paragraph>
                  </div>
                )
              }))}
            />
          </Card>
        </Col>
      </Row>

      {/* 联系我们 */}
      <Row justify="center">
        <Col xs={24} sm={16} md={12} lg={10}>
          <Card className="glass-card slide-in-up" style={{ animationDelay: '0.8s', textAlign: 'center' }}>
            <Title level={3} style={{ marginBottom: 16 }}>
              联系我们
            </Title>
            <Paragraph style={{ marginBottom: 24 }}>
              如果您有任何问题、建议或合作意向，欢迎与我们联系
            </Paragraph>
            <Space size="large">
              <Button 
                type="primary" 
                icon={<MailOutlined />}
                size="large"
              >
                发送邮件
              </Button>
              <Button 
                icon={<GithubOutlined />}
                size="large"
              >
                GitHub
              </Button>
              <Button 
                size="large"
                onClick={() => navigate('/demo')}
              >
                查看演示
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AboutPage;
