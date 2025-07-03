// src/components/Layout/QuickThemeSelector.jsx
import React, { useState } from 'react';
import { X, Settings } from 'lucide-react';
import { getThemeClasses, themes } from '../../utils/themes';

const QuickThemeSelector = ({ currentTheme, setCurrentTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const themeColors = {
    light: '#3B82F6',
    dark: '#374151', 
    red: '#EF4444',
    green: '#10B981',
    blue: '#2563EB',
    pink: '#EC4899',
    purple: '#8B5CF6',
    orange: '#F97316',
    teal: '#14B8A6',
    contrast: '#000000',
    sunset: 'linear-gradient(45deg, #F97316, #EC4899)',
    ocean: 'linear-gradient(45deg, #06B6D4, #3B82F6)'
  };

  return (
    <div className="fixed top-4 right-4 z-50 hidden lg:block">
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-xl shadow-xl border ${getThemeClasses('cardBorder', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}>
        <div className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className={`text-sm font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>🎨 เปลี่ยนธีม</div>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-1 rounded-lg ${getThemeClasses('sidebarHover', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
            </button>
          </div>
          
          {/* Current Theme Display */}
          <div className={`text-xs ${getThemeClasses('textSecondary', currentTheme)} mb-3 flex items-center`}>
            <span>ปัจจุบัน: </span>
            <span className={`ml-1 px-2 py-1 rounded-full text-xs ${getThemeClasses('info', currentTheme)}`}>
              {themes[currentTheme].name}
            </span>
          </div>
          
          {/* Quick Color Dots */}
          <div className={`grid grid-cols-4 gap-2 ${isOpen ? 'mb-4' : ''}`}>
            {Object.entries(themes).slice(0, 8).map(([themeKey, theme]) => (
              <button
                key={themeKey}
                onClick={() => setCurrentTheme(themeKey)}
                className={`w-8 h-8 rounded-full ${getThemeClasses('transition', currentTheme)} hover:scale-110 relative ${
                  currentTheme === themeKey ? 'ring-2 ring-offset-2 ring-gray-400 shadow-lg' : 'hover:shadow-md'
                }`}
                style={{ 
                  background: themeColors[themeKey],
                  backgroundImage: themeKey === 'sunset' || themeKey === 'ocean' ? themeColors[themeKey] : undefined
                }}
                title={theme.name}
              >
                {currentTheme === themeKey && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-white shadow-sm"></div>
                  </div>
                )}
              </button>
            ))}
          </div>
          
          {/* Extended Theme Options */}
          {isOpen && (
            <div className={`border-t ${getThemeClasses('cardBorder', currentTheme)} pt-4 space-y-3`}>
              <div className={`text-xs font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                🌟 ธีมพิเศษ
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(themes).slice(8).map(([themeKey, theme]) => (
                  <button
                    key={themeKey}
                    onClick={() => setCurrentTheme(themeKey)}
                    className={`flex items-center space-x-2 p-2 rounded-lg ${getThemeClasses('transition', currentTheme)} ${
                      currentTheme === themeKey 
                        ? `bg-${theme.primary}-100 border-2 border-${theme.accent}` 
                        : `${getThemeClasses('sidebarHover', currentTheme)}`
                    }`}
                  >
                    <div 
                      className="w-4 h-4 rounded-full flex-shrink-0"
                      style={{ 
                        background: themeColors[themeKey],
                        backgroundImage: themeKey === 'sunset' || themeKey === 'ocean' ? themeColors[themeKey] : undefined
                      }}
                    />
                    <span className={`text-xs ${getThemeClasses('textSecondary', currentTheme)} truncate`}>
                      {theme.name.replace('ธีม', '')}
                    </span>
                  </button>
                ))}
              </div>
              
              {/* Theme Actions */}
              <div className={`border-t ${getThemeClasses('cardBorder', currentTheme)} pt-3 space-y-2`}>
                <button
                  onClick={() => {
                    const randomThemes = Object.keys(themes);
                    const randomTheme = randomThemes[Math.floor(Math.random() * randomThemes.length)];
                    setCurrentTheme(randomTheme);
                  }}
                  className={`w-full text-xs px-3 py-2 rounded-lg ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center justify-center space-x-1`}
                >
                  <span>🎲</span>
                  <span>สุ่มธีม</span>
                </button>
                
                <button
                  onClick={() => setCurrentTheme('light')}
                  className={`w-full text-xs px-3 py-2 rounded-lg ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center justify-center space-x-1`}
                >
                  <span>🔄</span>
                  <span>รีเซ็ต</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuickThemeSelector;