import { useContext, useState } from 'react';
import { Menu } from 'lucide-react';

import { getThemeClasses, themes } from '../../utils/themes';
import { AppContext } from '../../contexts';

const Header = ({ 
  currentTheme, 
  setSidebarOpen, 
  getThemeClasses: getClasses 
}) => {
  const { appData, setAppData } = useContext(AppContext)
  const [showMobileThemes, setShowMobileThemes] = useState(false);
  
  const handleMobileMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Mobile menu button clicked');
    setSidebarOpen(true);
  };

  const handleMobileThemeSelect = (themeKey) => {
    setAppData({ ...appData, currentTheme: themeKey })
    setShowMobileThemes(false);
  };
  
  return (
    <header className={`shadow-sm border-b ${getThemeClasses('cardBg', currentTheme)} ${getThemeClasses('cardBorder', currentTheme)} lg:hidden relative`}>
      <div className="flex items-center justify-between px-4 py-3">
        <button
          type="button"
          onClick={handleMobileMenuClick}
          style={{ 
            pointerEvents: 'auto',
            cursor: 'pointer',
            userSelect: 'none'
          }}
          className={`p-2 rounded-md ${getThemeClasses('textMuted', currentTheme)} hover:${getThemeClasses('textSecondary', currentTheme)} ${getThemeClasses('sidebarHover', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}
        >
          <Menu className="w-6 h-6 pointer-events-none" />
        </button>
        
        <h1 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>
          ระบบบันทึกการขาย
        </h1>
        
        <div className="relative">
          {showMobileThemes && (
            <div className={`absolute top-full right-0 mt-2 ${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-xl border ${getThemeClasses('cardBorder', currentTheme)} z-50 w-64 max-h-96 overflow-y-auto`}>
              <div className="p-4">
                <div className={`text-sm font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-3`}>🎨 เลือกธีม</div>
                
                <div className="space-y-3">
                  <div>
                    <div className={`text-xs ${getThemeClasses('textMuted', currentTheme)} mb-2`}>เลือกด่วน</div>
                    <div className="grid grid-cols-6 gap-2">
                      {Object.entries(themes).slice(0, 6).map(([themeKey, theme]) => (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleMobileThemeSelect(themeKey);
                          }}
                          style={{ 
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                            background: themeKey === 'dark' ? '#374151' :
                                       themeKey === 'red' ? '#EF4444' :
                                       themeKey === 'green' ? '#10B981' :
                                       themeKey === 'blue' ? '#2563EB' :
                                       themeKey === 'pink' ? '#EC4899' :
                                       '#3B82F6'
                          }}
                          className={`w-8 h-8 rounded-full ${getThemeClasses('transition', currentTheme)} hover:scale-110 ${
                            currentTheme === themeKey ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                          }`}
                          title={theme.name}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <div className={`text-xs ${getThemeClasses('textMuted', currentTheme)} mb-2`}>ธีมพิเศษ</div>
                    <div className="space-y-2">
                      {Object.entries(themes).slice(6).map(([themeKey, theme]) => (
                        <button
                          key={themeKey}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleMobileThemeSelect(themeKey);
                          }}
                          style={{ 
                            pointerEvents: 'auto',
                            cursor: 'pointer'
                          }}
                          className={`w-full flex items-center space-x-3 p-2 rounded-lg ${getThemeClasses('transition', currentTheme)} ${
                            currentTheme === themeKey 
                              ? `bg-${theme.primary}-100 border border-${theme.accent}` 
                              : `${getThemeClasses('sidebarHover', currentTheme)}`
                          }`}
                        >
                          <div 
                            className="w-5 h-5 rounded-full flex-shrink-0 pointer-events-none"
                            style={{
                              background: themeKey === 'sunset' ? 'linear-gradient(45deg, #F97316, #EC4899)' :
                                         themeKey === 'ocean' ? 'linear-gradient(45deg, #06B6D4, #3B82F6)' :
                                         themeKey === 'contrast' ? '#000000' :
                                         themeKey === 'purple' ? '#8B5CF6' :
                                         themeKey === 'orange' ? '#F97316' :
                                         themeKey === 'teal' ? '#14B8A6' :
                                         '#3B82F6'
                            }}
                          />
                          <span className={`text-sm ${getThemeClasses('textPrimary', currentTheme)} pointer-events-none`}>
                            {theme.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showMobileThemes && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowMobileThemes(false)}
        />
      )}
    </header>
  );
};

export default Header;