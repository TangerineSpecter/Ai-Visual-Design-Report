// src/layout/menuConfig.js - 统一配置系统
import { Icons } from '../components/Icons';
// 懒加载所有页面组件
const HomeView = () => import('../views/home/Index.jsx');
const N8nReportView = () => import('../views/report/N8nReport.jsx');
const DollarHegemonyReportView = () => import('../views/report/DollarHegemonyReport.jsx');
const CatFoodAnalysisView = () => import('../views/tools/CatFoodAnalysis.jsx');
const PosterGeneratorView = () => import('../views/tools/PosterGenerator.jsx');
const SettingView = () => import('../views/settings/Index.jsx');
const CatFoodReportView = () => import('../views/report/CatFoodReport.jsx');
const LangChain_1_0_ReportView = () => import('../views/report/LangChain_1.0_Report.jsx');
const EconomicMachineReportView = () => import('../views/report/EconomicMachineReport.jsx');
const IslandReportView = () => import('../views/report/IslandKnowledgeReport.jsx');
const MacdKnowledgeView = () => import('../views/report/MacdKnowledge.jsx');
const TechnicalAnalysisReportView = () => import('../views/report/TechnicalIndicatorsMisconception.jsx');


// 统一配置 - 只需要在这里配置一次！
export const unifiedConfig = {
  // 菜单配置
  menuItems: [
    {
      id: 'home',
      label: '控制台首页',
      icon: Icons.Layout,
      component: HomeView,
      componentType: 'home'
    },
    {
      id: 'report',
      label: 'AI 报告',
      icon: Icons.FileText,
      children: [
        {
          id: 'n8n-report',
          label: 'n8n 工作流',
          component: N8nReportView,
          componentType: 'report'
        },
        {
          id: 'dollar-hegemony-report',
          label: '美元霸权解析',
          component: DollarHegemonyReportView,
          componentType: 'report'
        },
        {
          id: 'cat-food-report',
          label: '猫粮科学指南',
          component: CatFoodReportView,
          componentType: 'report'
        },
        {
          id: 'langchain-1.0-report',
          label: 'LangChain 1.0 解析',
          component: LangChain_1_0_ReportView,
          componentType: 'report'
        },
        {
          id: 'economic-machine-report',
          label: '经济机器解析',
          component: EconomicMachineReportView,
          componentType: 'report'
        },
        {
          id: 'island-report',
          label: '小岛经济学',
          component: IslandReportView,
          componentType: 'report'
        },
        {
          id: 'macd-knowledge',
          label: 'MACD 知识',
          component: MacdKnowledgeView,
          componentType: 'report'
        },
        {
          id: 'technical-analysis-report',
          label: '技术指标误区',
          component: TechnicalAnalysisReportView,
          componentType: 'report'
        },
      ]
    },
    {
      id: 'tools',
      label: 'AI 工具',
      icon: Icons.Wrench,
      children: [
        {
          id: 'cat-food-analysis',
          label: '猫粮成分分析',
          component: CatFoodAnalysisView,
          componentType: 'tools'
        },
        {
          id: 'poster-generator',
          label: '海报生成器',
          component: PosterGeneratorView,
          componentType: 'tools'
        }
      ]
    },
    {
      id: 'settings',
      label: '全局设置',
      icon: Icons.Settings,
      component: SettingView,
      componentType: 'settings',
      disabled: false
    }
  ]
};

// 工具函数：扁平化菜单项（用于搜索等功能）
export const flattenMenuItems = (items) => {
  const result = [];
  items.forEach(item => {
    if (item.component) {
      result.push(item);
    }
    if (item.children) {
      result.push(...flattenMenuItems(item.children));
    }
  });
  return result;
};

// 工具函数：根据ID查找菜单项
export const findMenuItem = (items, id) => {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findMenuItem(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

// 工具函数：获取面包屑路径
export const getBreadcrumbs = (items, id) => {
  const path = [];
  const findPath = (items, targetId, currentPath) => {
    for (const item of items) {
      const newPath = [...currentPath, item];
      if (item.id === targetId) {
        return newPath;
      }
      if (item.children) {
        const result = findPath(item.children, targetId, newPath);
        if (result) return result;
      }
    }
    return null;
  };

  const result = findPath(items, id, []);
  return result || [];
};

// 导出便利变量
export const menuItems = unifiedConfig.menuItems;
export const pageComponents = flattenMenuItems(menuItems);