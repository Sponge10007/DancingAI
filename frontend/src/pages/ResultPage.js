import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Typography,
  Card,
  Row,
  Col,
  Tabs,
  Timeline,
  Tag,
  Statistic,
  Button,
  Space,
  Divider,
  Alert,
  Empty
} from 'antd';
import {
  SoundOutlined,
  UserOutlined,
  PlayCircleOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  TrophyOutlined,
  BookOutlined,
  DownloadOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;

const ResultPage = ({ video, analysisData }) => {
  const { videoId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');

  // 如果没有分析数据，显示空状态
  if (!analysisData) {
    return (
      <div className="page-container fade-in">
        <div style={{ textAlign: 'center', maxWidth: 600, margin: '0 auto' }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无分析数据"
          >
            <Button type="primary" href="/">
              返回首页
            </Button>
          </Empty>
        </div>
      </div>
    );
  }

  const { videoInfo, beats, beatInfo, actions, actionsSummary, poses, poseAnalysis } = analysisData;

  // 渲染概览标签页
  const renderOverview = () => (
    <Row gutter={[24, 24]}>
      {/* 基本统计 */}
      <Col xs={24} lg={8}>
        <Card className="glass-card" title="基本信息">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Statistic
              title="视频时长"
              value={videoInfo?.duration || 0}
              suffix="秒"
              prefix={<ClockCircleOutlined />}
            />
            <Statistic
              title="平均BPM"
              value={beatInfo?.average_bpm || 0}
              precision={1}
              prefix={<SoundOutlined />}
            />
            <Statistic
              title="检测到的动作"
              value={actionsSummary?.total_actions || 0}
              suffix="个"
              prefix={<UserOutlined />}
            />
            <Statistic
              title="平均难度"
              value={actionsSummary?.average_difficulty || 0}
              precision={1}
              suffix="/5"
              prefix={<TrophyOutlined />}
            />
          </Space>
        </Card>
      </Col>

      {/* 节拍信息 */}
      <Col xs={24} lg={8}>
        <Card className="glass-card" title="节拍分析">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>节拍总数：</Text>
              <Text>{beatInfo?.total_beats || 0} 个</Text>
            </div>
            <div>
              <Text strong>节奏模式：</Text>
              <Tag color="blue">{beatInfo?.rhythm_pattern?.pattern || '未知'}</Tag>
            </div>
            <div>
              <Text strong>节拍稳定性：</Text>
              <Text>{((beatInfo?.rhythm_pattern?.stability || 0) * 100).toFixed(1)}%</Text>
            </div>
            <div>
              <Text strong>首个节拍：</Text>
              <Text>{beatInfo?.first_beat_time?.toFixed(2) || 0}s</Text>
            </div>
          </Space>
        </Card>
      </Col>

      {/* 动作统计 */}
      <Col xs={24} lg={8}>
        <Card className="glass-card" title="动作分析">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <div>
              <Text strong>总时长：</Text>
              <Text>{actionsSummary?.total_duration?.toFixed(1) || 0}s</Text>
            </div>
            <div>
              <Text strong>难度分布：</Text>
              <div style={{ marginTop: 8 }}>
                {Object.entries(actionsSummary?.difficulty_distribution || {}).map(([level, count]) => (
                  <Tag key={level} className={`difficulty-${level}`} style={{ margin: '2px' }}>
                    {level}级: {count}个
                  </Tag>
                ))}
              </div>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  );

  // 渲染节拍标签页
  const renderBeats = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24} lg={16}>
        <Card className="glass-card" title="节拍时间轴">
          {beats && beats.length > 0 ? (
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              <Timeline mode="left">
                {beats.slice(0, 20).map((beat, index) => (
                  <Timeline.Item
                    key={index}
                    label={`${beat.timestamp.toFixed(2)}s`}
                    color={beat.confidence > 0.8 ? 'green' : beat.confidence > 0.5 ? 'blue' : 'orange'}
                  >
                    <div>
                      <Text strong>第 {beat.beat_number} 拍</Text>
                      <br />
                      <Text type="secondary">
                        置信度: {(beat.confidence * 100).toFixed(1)}%
                        {beat.tempo && ` | BPM: ${beat.tempo.toFixed(1)}`}
                      </Text>
                    </div>
                  </Timeline.Item>
                ))}
                {beats.length > 20 && (
                  <Timeline.Item color="gray">
                    <Text type="secondary">还有 {beats.length - 20} 个节拍...</Text>
                  </Timeline.Item>
                )}
              </Timeline>
            </div>
          ) : (
            <Empty description="暂无节拍数据" />
          )}
        </Card>
      </Col>

      <Col xs={24} lg={8}>
        <Card className="glass-card" title="节拍统计">
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            <Statistic
              title="平均BPM"
              value={beatInfo?.average_bpm || 0}
              precision={1}
              prefix={<SoundOutlined />}
            />
            <Statistic
              title="节拍总数"
              value={beatInfo?.total_beats || 0}
              suffix="个"
            />
            <Statistic
              title="节拍网格数"
              value={beatInfo?.beat_grid_count || 0}
              suffix="个"
            />
            <Divider />
            <div>
              <Text strong>节奏特征：</Text>
              <br />
              <Tag color="blue">{beatInfo?.rhythm_pattern?.pattern || '未知'}</Tag>
            </div>
            <div>
              <Text strong>稳定性评分：</Text>
              <br />
              <Text>{((beatInfo?.rhythm_pattern?.stability || 0) * 100).toFixed(1)}%</Text>
            </div>
          </Space>
        </Card>
      </Col>
    </Row>
  );

  // 渲染动作标签页
  const renderActions = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24}>
        <Card className="glass-card" title="动作序列">
          {actions && actions.length > 0 ? (
            <div className="action-list">
              {actions.map((action, index) => (
                <div key={index} className="action-item">
                  <div className="action-time">
                    {action.start_time.toFixed(1)}s - {action.end_time.toFixed(1)}s
                  </div>
                  <div className="action-name">
                    {action.action_name}
                    <Tag className={`difficulty-${action.difficulty_level}`} style={{ marginLeft: 8 }}>
                      难度 {action.difficulty_level}
                    </Tag>
                  </div>
                  <div className="action-description">
                    {action.description}
                  </div>
                  {action.key_points && action.key_points.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <Text strong>要点：</Text>
                      <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                        {action.key_points.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {action.common_mistakes && action.common_mistakes.length > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <Text strong>常见错误：</Text>
                      <ul style={{ margin: '4px 0', paddingLeft: 20 }}>
                        {action.common_mistakes.map((mistake, idx) => (
                          <li key={idx} style={{ color: '#ff4d4f' }}>{mistake}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Empty description="暂无动作数据" />
          )}
        </Card>
      </Col>
    </Row>
  );

  // 渲染教学指导标签页
  const renderGuide = () => (
    <Row gutter={[24, 24]}>
      <Col xs={24}>
        <Alert
          message="AI生成的教学指导"
          description="以下内容由AI分析生成，仅供参考。建议结合专业教师指导进行学习。"
          type="info"
          showIcon
          style={{ marginBottom: 24 }}
        />
        
        <Card className="glass-card" title="综合教学指导">
          <div style={{ lineHeight: 1.8, fontSize: 16 }}>
            {analysisData.teaching_guide ? (
              <div dangerouslySetInnerHTML={{ __html: analysisData.teaching_guide.replace(/\n/g, '<br />') }} />
            ) : (
              <div>
                <Title level={4}>学习建议</Title>
                <Paragraph>
                  基于对您舞蹈视频的分析，我们为您提供以下学习建议：
                </Paragraph>
                
                <Title level={5}>1. 节拍掌握</Title>
                <Paragraph>
                  您的舞蹈平均BPM为 {beatInfo?.average_bpm?.toFixed(1) || 'N/A'}，
                  建议先熟悉音乐节拍，可以跟着节拍器练习基础步伐。
                </Paragraph>
                
                <Title level={5}>2. 动作练习</Title>
                <Paragraph>
                  检测到 {actionsSummary?.total_actions || 0} 个主要动作，
                  平均难度为 {actionsSummary?.average_difficulty?.toFixed(1) || 'N/A'} 级。
                  建议从简单动作开始，逐步提高难度。
                </Paragraph>
                
                <Title level={5}>3. 分段练习</Title>
                <Paragraph>
                  建议将舞蹈分段练习，每次专注于一个动作序列，
                  熟练后再连接整套动作。
                </Paragraph>
              </div>
            )}
          </div>
        </Card>
      </Col>
    </Row>
  );

  return (
    <div className="page-container fade-in">
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* 页面标题 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={2} className="page-title">
            分析结果
          </Title>
          <Paragraph className="page-subtitle">
            {video?.filename || '舞蹈视频'} 的详细分析报告
          </Paragraph>
        </div>

        {/* 操作按钮 */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Space>
            <Button icon={<DownloadOutlined />}>
              导出报告
            </Button>
            <Button type="primary" href="/">
              分析新视频
            </Button>
          </Space>
        </div>

        {/* 结果标签页 */}
        <Card className="glass-card">
          <Tabs activeKey={activeTab} onChange={setActiveTab} size="large">
            <TabPane
              tab={
                <span>
                  <FileTextOutlined />
                  概览
                </span>
              }
              key="overview"
            >
              {renderOverview()}
            </TabPane>
            
            <TabPane
              tab={
                <span>
                  <SoundOutlined />
                  节拍分析
                </span>
              }
              key="beats"
            >
              {renderBeats()}
            </TabPane>
            
            <TabPane
              tab={
                <span>
                  <UserOutlined />
                  动作分解
                </span>
              }
              key="actions"
            >
              {renderActions()}
            </TabPane>
            
            <TabPane
              tab={
                <span>
                  <BookOutlined />
                  教学指导
                </span>
              }
              key="guide"
            >
              {renderGuide()}
            </TabPane>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default ResultPage;
