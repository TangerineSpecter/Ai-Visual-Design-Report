// src/App.jsx
import { useState } from 'react';
import MainLayout from './layout/MainLayout';
import HomeView from './views/home/Index';
import N8nReportView from './views/report/N8nReport';
import SettingView from './views/settings/Index';
import DollarHegemonyReportView from './views/report/DollarHegemonyReport';
import CatFoodAnalysisView from './views/tools/CatFoodAnalysis';
import PosterGeneratorView from './views/tools/PosterGenerator';



function App() {
    const [currentView, setCurrentView] = useState('home');

    const renderContent = () => {
        switch (currentView) {
            case 'home':
                return <HomeView onNavigate={setCurrentView} />;
            case 'settings':
                return <SettingView onNavigate={setCurrentView} />;

            // 处理所有子菜单 ID
            case 'n8n-report':
                return <N8nReportView activeTab={currentView} />;
            case 'dollar-hegemony-report':
                return <DollarHegemonyReportView activeTab={currentView} />;
            case 'report': // 保留这个以防万一
                // 这里你可以把 currentView 传给 ReportView，让它决定显示什么
                return <N8nReportView activeTab={currentView} />;
            // 处理所有子菜单 ID
            case 'cat-food-analysis':
                return <CatFoodAnalysisView activeTab={currentView} />;
            case 'poster-generator':
                return <PosterGeneratorView activeTab={currentView} />;

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