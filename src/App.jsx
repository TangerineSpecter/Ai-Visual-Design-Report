// src/App.jsx
import { useState } from 'react';
import MainLayout from './layout/MainLayout';
import HomeView from './views/home/Index';
import ReportView from './views/report/Index';

function App() {
  const [currentView, setCurrentView] = useState('home');

  const renderContent = () => {
    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={setCurrentView} />;
        
      // 处理所有子菜单 ID
      case 'report-basic':
      case 'report-rag':
      case 'report-agent':
      case 'report': // 保留这个以防万一
        // 这里你可以把 currentView 传给 ReportView，让它决定显示什么
        return <ReportView activeTab={currentView} />;
        
      default:
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