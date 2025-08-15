import React, { useState } from 'react';
import { Layout, Typography, Space } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import AnalysisPage from './pages/AnalysisPage';
import ResultPage from './pages/ResultPage';
import DemoPage from './pages/DemoPage';
import AboutPage from './pages/AboutPage';
import './App.css';

const { Content, Footer } = Layout;
const { Text } = Typography;

function App() {
  const [currentVideo, setCurrentVideo] = useState(null);
  const [analysisData, setAnalysisData] = useState(null);

  return (
    <Router>
      <div className="app-container">
        <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
          <Header />
          
          <Content className="main-content">
            <Routes>
              <Route 
                path="/" 
                element={
                  <HomePage 
                    onVideoUpload={setCurrentVideo}
                    currentVideo={currentVideo}
                  />
                } 
              />
              <Route 
                path="/analysis/:videoId" 
                element={
                  <AnalysisPage 
                    video={currentVideo}
                    onAnalysisComplete={setAnalysisData}
                  />
                } 
              />
              <Route
                path="/result/:videoId"
                element={
                  <ResultPage
                    video={currentVideo}
                    analysisData={analysisData}
                  />
                }
              />
              <Route
                path="/demo"
                element={<DemoPage />}
              />
              <Route
                path="/about"
                element={<AboutPage />}
              />
            </Routes>
          </Content>
          
          <Footer style={{ 
            textAlign: 'center', 
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.8)',
            padding: '24px 0'
          }}>
            <Space direction="vertical" size="small">
              <Text style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                舞蹈视频分析系统 ©2024 - 基于AI的智能舞蹈教学平台
              </Text>
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
                Powered by GLM-4.5V • MediaPipe • React
              </Text>
            </Space>
          </Footer>
        </Layout>
      </div>
    </Router>
  );
}

export default App;
