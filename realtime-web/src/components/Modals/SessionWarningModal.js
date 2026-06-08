import React from 'react';
import { LogOut } from 'lucide-react';
import { getThemeClasses, themes } from '../../utils/themes';

const SessionWarningModal = ({ 
  showSessionWarning, 
  sessionCountdown, 
  user, 
  currentTheme, 
  extendSession, 
  setUser, 
  setShowSessionWarning, 
  setCart, 
  setSelectedCustomer, 
  setSidebarOpen 
}) => {
  if (!showSessionWarning) return null;

  const minutes = Math.floor(sessionCountdown / 60);
  const seconds = sessionCountdown % 60;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className={`${getThemeClasses('cardBg', currentTheme)} rounded-xl shadow-2xl w-full max-w-md ${getThemeClasses('transition', currentTheme)} transform animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center ${currentTheme === 'dark' ? 'bg-orange-900 bg-opacity-50' : ''} animate-pulse`}>
              <span className="text-2xl">⏰</span>
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>
                เซสชันกำลังจะหมดอายุ
              </h3>
              <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                ระบบจะออกจากระบบอัตโนมัติ
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${currentTheme === 'dark' ? 'bg-orange-900 bg-opacity-30' : 'bg-orange-100'} mb-4`}>
                <div className="text-center">
                  <div className={`text-2xl font-bold ${currentTheme === 'dark' ? 'text-orange-400' : 'text-orange-600'}`}>
                    {minutes}:{seconds.toString().padStart(2, '0')}
                  </div>
                  <div className={`text-xs ${currentTheme === 'dark' ? 'text-orange-300' : 'text-orange-500'}`}>
                    นาที
                  </div>
                </div>
              </div>
              
              <p className={`text-sm ${getThemeClasses('textPrimary', currentTheme)} font-medium`}>
                เวลาที่เหลือก่อนออกจากระบบ
              </p>
            </div>

            <div className={`p-4 rounded-lg ${currentTheme === 'dark' ? 'bg-red-900 bg-opacity-30 border-red-700' : 'bg-red-50 border-red-200'} border`}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-lg">🚨</span>
                </div>
                <div>
                  <p className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-red-200' : 'text-red-800'}`}>
                    การไม่มีกิจกรรมการใช้งาน
                  </p>
                  <p className={`text-xs mt-1 ${currentTheme === 'dark' ? 'text-red-300' : 'text-red-700'}`}>
                    ไม่พบการใช้งานเป็นเวลา 4 นาที ระบบจะออกจากระบบอัตโนมัติเพื่อความปลอดภัย
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${themes[currentTheme].accent} rounded-full flex items-center justify-center shadow-sm`}>
                  <span className="text-white text-sm font-medium">
                    {(user?.fullName || user?.Name || user?.UserName)?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className={`text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {user?.fullName || user?.Name || user?.UserName}
                  </p>
                  <p className={`text-xs ${getThemeClasses('textMuted', currentTheme)} flex items-center space-x-1`}>
                    <span>🔒 เซสชันที่เริ่ม:</span>
                    <span>{new Date().toLocaleTimeString('th-TH')}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className={`text-center p-3 rounded-lg ${currentTheme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
              <div className="flex items-center justify-center space-x-2 text-xs">
                <span className={`${getThemeClasses('textMuted', currentTheme)}`}>💡 เคล็ดลับ:</span>
                <span className={`${getThemeClasses('textSecondary', currentTheme)}`}>
                  เลื่อนเมาส์ คลิก หรือกดปุ่มใดก็ได้เพื่อรีเซ็ตเวลา
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 border-t ${getThemeClasses('cardBorder', currentTheme)} flex justify-between items-center`}>
          <div className={`text-xs ${getThemeClasses('textMuted', currentTheme)}`}>
            เซสชันจะหมดอายุอัตโนมัติ
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => {
                setUser(null);
                setShowSessionWarning(false);
                setCart([]);
                setSelectedCustomer(null);
                setSidebarOpen(false);
              }}
              className={`px-4 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center space-x-2 text-sm`}
            >
              <LogOut className="w-4 h-4" />
              <span>ออกเลย</span>
            </button>
            <button
              onClick={extendSession}
              className={`px-6 py-2 text-white rounded-lg font-medium ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} hover:shadow-lg transform hover:scale-105 flex items-center space-x-2 text-sm`}
            >
              <span>🔄</span>
              <span>ต่ออายุเซสชัน</span>
            </button>
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200">
        <div 
          className="h-full bg-orange-500 transition-all duration-1000 ease-linear"
          style={{ width: `${(sessionCountdown / 60) * 100}%` }}
        />
      </div>
    </div>
  );
};

export default SessionWarningModal;