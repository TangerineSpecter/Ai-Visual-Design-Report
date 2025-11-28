// src/layout/menuConfig.js
import { Icons } from '../components/Icons';

export const menuItems = [
  {
    id: 'home',
    label: '控制台首页',
    icon: Icons.Layout
  },
  {
    id: 'report',
    label: 'AI 报告',
    icon: Icons.FileText,
    children: [
      { id: 'n8n-report', label: 'n8n工作流' },
      { id: 'dollar-hegemony-report', label: '美元霸权报告' }
    ]
  },
  {
    id: 'tools',
    label: 'AI 工具',
    icon: Icons.Wrench,
    children: [
      { id: 'cat-food-analysis', label: '猫粮成分分析' },
      { id: 'poster-generator', label: '海报生成器' }
    ]
  },
  {
    id: 'settings',
    label: '全局设置',
    icon: Icons.Settings,
    disabled: false
  }
];
