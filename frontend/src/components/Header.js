import React from 'react';
import { Layout, Typography, Space, Button } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  HomeOutlined, 
  BarChartOutlined, 
  PlayCircleOutlined,
  GithubOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';

const { Header: AntHeader } = Layout;
const { Title } = Typography;

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
      path: '/'
    },
    {
      key: '/demo',
      icon: <PlayCircleOutlined />,
      label: '演示',
      path: '/demo'
    },
    {
      key: '/about',
      icon: <QuestionCircleOutlined />,
      label: '关于',
      path: '/about'
    }
  ];

  return (
    <AntHeader style={{ 
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: 'none',
      borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
      padding: '0 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      {/* Logo 和标题 */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          cursor: 'pointer' 
        }}
        onClick={() => navigate('/')}
      >
        <div style={{
          width: 40,
          height: 40,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
        }}>
          <PlayCircleOutlined style={{ color: 'white', fontSize: 20 }} />
        </div>
        <Title 
          level={3} 
          style={{ 
            color: 'white', 
            margin: 0,
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
          }}
        >
          舞蹈分析系统
        </Title>
      </div>

      {/* 导航菜单 */}
      <Space size="large">
        {menuItems.map(item => (
          <Button
            key={item.key}
            type={location.pathname === item.path ? 'primary' : 'text'}
            icon={item.icon}
            onClick={() => navigate(item.path)}
            style={{
              color: location.pathname === item.path ? 'white' : 'rgba(255, 255, 255, 0.8)',
              border: 'none',
              background: location.pathname === item.path 
                ? 'rgba(255, 255, 255, 0.2)' 
                : 'transparent',
              borderRadius: 8,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.color = 'white';
              }
            }}
            onMouseLeave={(e) => {
              if (location.pathname !== item.path) {
                e.target.style.background = 'transparent';
                e.target.style.color = 'rgba(255, 255, 255, 0.8)';
              }
            }}
          >
            {item.label}
          </Button>
        ))}
        
        {/* GitHub 链接 */}
        <Button
          type="text"
          icon={<GithubOutlined />}
          href="https://github.com"
          target="_blank"
          style={{
            color: 'rgba(255, 255, 255, 0.8)',
            border: 'none',
            background: 'transparent',
            borderRadius: 8,
            height: 36,
            width: 36,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'transparent';
            e.target.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
        />
      </Space>
    </AntHeader>
  );
};

export default Header;
