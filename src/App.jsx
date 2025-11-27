// src/App.jsx
import { useState } from 'react';
import MainLayout from './layout/MainLayout';
import HomeView from './views/home/Index';
import ReportView from './views/report/Index';

function App() {
  // 默认视图状态，初始化为 'home'
  const [currentView, setCurrentView] = useState('home');

  // 渲染当前视图的逻辑
  const renderContent = () => {
    switch (currentView) {
      case 'report':
        return <ReportView />;
      case 'home':
      default:
        // 传入 setCurrentView 允许 Home 页内部跳转到 Report
        return <HomeView onNavigate={setCurrentView} />;
    }
  };

  return (
    <MainLayout currentView={currentView} onViewChange={setCurrentView}>
      {renderContent()}
    </MainLayout>
  );
}

export default App;