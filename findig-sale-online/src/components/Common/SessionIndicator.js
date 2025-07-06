import React, { useState, useEffect } from 'react';
import { getThemeClasses } from '../../utils/themes';
import { SESSION_TIMEOUT } from '../../utils/constants';

const SessionIndicator = ({ 
  user, 
  lastActivity, 
  showSessionWarning, 
  currentTheme 
}) => {
  const [timeRemaining, setTimeRemaining] = useState(SESSION_TIMEOUT);

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - lastActivity;
      const remaining = Math.max(0, SESSION_TIMEOUT - elapsed);
      setTimeRemaining(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [user, lastActivity]);

  if (!user || showSessionWarning) return null;

  const percentage = (timeRemaining / SESSION_TIMEOUT) * 100;
  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  return (
    <div className="fixed bottom-4 right-4 z-40 hidden lg:block">
      <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-lg border ${getThemeClasses('cardBorder', currentTheme)} p-3 min-w-48`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div 
              className={`w-8 h-8 rounded-full border-4 ${
                percentage > 50 ? 'border-green-200' : 
                percentage > 25 ? 'border-yellow-200' : 'border-red-200'
              }`}
            >
              <div 
                className={`absolute inset-0 rounded-full border-4 border-transparent ${
                  percentage > 50 ? 'border-t-green-500' : 
                  percentage > 25 ? 'border-t-yellow-500' : 'border-t-red-500'
                }`}
                style={{
                  transform: `rotate(${(percentage / 100) * 360 - 90}deg)`,
                  transformOrigin: 'center'
                }}
              />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs">⏱️</span>
            </div>
          </div>
          
          <div>
            <div className={`text-xs font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
              Session
            </div>
            <div className={`text-xs ${getThemeClasses('textSecondary', currentTheme)}`}>
              {minutes}:{seconds.toString().padStart(2, '0')} เหลือ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionIndicator;