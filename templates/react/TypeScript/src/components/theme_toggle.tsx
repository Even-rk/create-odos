import { useState, useEffect } from 'react';
import './theme_toggle.css';

/**
 * 主题切换组件
 * 用于在暗色和亮色主题之间切换
 */
export function ThemeToggle() {
  const [theme, set_theme] = useState<'light' | 'dark'>('light');
  
  // 监听主题变化
  useEffect(() => {
    // 设置 HTML 根元素的 data-theme 属性
    document.documentElement.setAttribute('data-theme', theme);
    
    // 保存用户选择到 localStorage
    localStorage.setItem('theme-preference', theme);
  }, [theme]);
  
  // 切换主题
  const toggle_theme = () => {
    set_theme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  return (
    <button 
      className="theme-toggle" 
      onClick={toggle_theme}
      aria-label={`切换到 ${theme === 'light' ? '暗色' : '亮色'} 主题`}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
} 