// src/components/Modals/LogoutConfirmModal.jsx
import React from 'react';
import { LogOut, X } from 'lucide-react';
import { getThemeClasses, themes } from '../../utils/themes';

const LogoutConfirmModal = ({ 
  showLogoutConfirm, 
  setShowLogoutConfirm, 
  onLogout, 
  setCart, 
  setSelectedCustomer, 
  setSidebarOpen, 
  user, 
  currentTheme 
}) => {
  if (!showLogoutConfirm) return null;

  const handleLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
    // Reset states when logging out
    setCart([]);
    setSelectedCustomer(null);
    setSidebarOpen(false);
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div 
        className={`${getThemeClasses('cardBg', currentTheme)} rounded-xl shadow-2xl w-full max-w-md ${getThemeClasses('transition', currentTheme)} transform animate-scale-in`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`p-6 border-b ${getThemeClasses('cardBorder', currentTheme)}`}>
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 bg-red-100 rounded-full flex items-center justify-center ${currentTheme === 'dark' ? 'bg-red-900 bg-opacity-50' : ''}`}>
              <LogOut className={`w-6 h-6 ${currentTheme === 'dark' ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div>
              <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>
                ยืนยันการออกจากระบบ
              </h3>
              <p className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                กรุณายืนยันการดำเนินการ
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="space-y-4">
            <div className={`p-4 rounded-lg ${currentTheme === 'dark' ? 'bg-yellow-900 bg-opacity-30 border-yellow-700' : 'bg-yellow-50 border-yellow-200'} border`}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-xl">⚠️</span>
                </div>
                <div>
                  <p className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-yellow-200' : 'text-yellow-800'}`}>
                    คุณต้องการออกจากระบบใช่หรือไม่?
                  </p>
                  <p className={`text-xs mt-1 ${currentTheme === 'dark' ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    ข้อมูลที่ยังไม่ได้บันทึกอาจจะหายไป
                  </p>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg ${getThemeClasses('cardBg', currentTheme)} border ${getThemeClasses('cardBorder', currentTheme)}`}>
              <div className="flex items-center space-x-3">
                <div className={`w-10 h-10 bg-${themes[currentTheme].accent} rounded-full flex items-center justify-center shadow-sm`}>
                  <span className="text-white text-sm font-medium">
                    {user?.fullName?.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className={`text-sm font-medium ${getThemeClasses('textPrimary', currentTheme)}`}>
                    {user?.fullName}
                  </p>
                  <p className={`text-xs ${getThemeClasses('textMuted', currentTheme)} flex items-center space-x-1`}>
                    <span>👤 {user?.role}</span>
                    <span>•</span>
                    <span>🟢 เข้าสู่ระบบแล้ว</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={`p-6 border-t ${getThemeClasses('cardBorder', currentTheme)} flex justify-end space-x-3`}>
          <button
            onClick={() => setShowLogoutConfirm(false)}
            className={`px-6 py-2 border rounded-lg font-medium ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center space-x-2 hover:shadow-md`}
          >
            <X className="w-4 h-4" />
            <span>ยกเลิก</span>
          </button>
          <button
            onClick={handleLogout}
            className={`px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 ${getThemeClasses('transition', currentTheme)} hover:shadow-lg transform hover:scale-105 flex items-center space-x-2 focus:ring-2 focus:ring-red-300`}
          >
            <LogOut className="w-4 h-4" />
            <span>ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Click outside to close */}
      <div 
        className="absolute inset-0 -z-10"
        onClick={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
};

export default LogoutConfirmModal;