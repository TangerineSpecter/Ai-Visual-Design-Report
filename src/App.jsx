// src/App.jsx
import { useState, useEffect } from 'react';
import MainLayout from './layout/MainLayout';
import { unifiedConfig, findMenuItem } from './layout/menuConfig';

function App() {
    const [currentView, setCurrentView] = useState('home');
    const [lazyComponent, setLazyComponent] = useState(null);

    useEffect(() => {
        const loadComponent = async () => {
            const pageConfig = findMenuItem(unifiedConfig.menuItems, currentView);
            if (pageConfig && pageConfig.component) {
                try {
                    const module = await pageConfig.component();
                    setLazyComponent(() => module.default || module);
                } catch (error) {
                    console.error('Failed to load component:', error);
                    // 回退到首页
                    const homeConfig = findMenuItem(unifiedConfig.menuItems, 'home');
                    if (homeConfig && homeConfig.component) {
                        const homeModule = await homeConfig.component();
                        setLazyComponent(() => homeModule.default || homeModule);
                    }
                }
            } else {
                // 默认回退到首页
                const homeConfig = findMenuItem(unifiedConfig.menuItems, 'home');
                if (homeConfig && homeConfig.component) {
                    const homeModule = await homeConfig.component();
                    setLazyComponent(() => homeModule.default || homeModule);
                }
            }
        };

        loadComponent();
    }, [currentView]);

    const renderContent = () => {
        if (lazyComponent) {
            const Component = lazyComponent;
            return (
                <div className="h-full w-full">
                    <Component />
                </div>
            );
        }
        
        return <div className="p-8 text-center text-slate-500">加载中...</div>;
    };

    return (
        <MainLayout currentView={currentView} onViewChange={setCurrentView}>
            {renderContent()}
        </MainLayout>
    );
}

export default App;