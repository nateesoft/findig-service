import React, { useState } from 'react';
import { getThemeClasses, themes } from '../utils/themes';
import { DEFAULT_SETTINGS } from '../utils/constants';

const SystemSettings = ({ currentTheme, setCurrentTheme }) => {
  const [settings, setSettings] = useState({
    ...DEFAULT_SETTINGS,
    theme: currentTheme
  });

  const handleThemeChange = (newTheme) => {
    setCurrentTheme(newTheme);
    setSettings({...settings, theme: newTheme});
  };

  return (
    <div className="space-y-6">
      <h1 className={`text-2xl font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>ปรับแต่งระบบ</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-4`}>การตั้งค่าทั่วไป</h3>
          
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                ชื่อบริษัท
              </label>
              <input
                type="text"
                value={settings.companyName}
                onChange={(e) => setSettings({...settings, companyName: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                อัตราภาษี (%)
              </label>
              <input
                type="number"
                value={settings.taxRate}
                onChange={(e) => setSettings({...settings, taxRate: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                สกุลเงิน
              </label>
              <select
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
              >
                <option value="THB">บาท (THB)</option>
                <option value="USD">ดอลลาร์ (USD)</option>
                <option value="EUR">ยูโร (EUR)</option>
              </select>
            </div>

            <div>
              <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                ภาษา
              </label>
              <select
                value={settings.language}
                onChange={(e) => setSettings({...settings, language: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
              >
                <option value="th">ไทย</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>

        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-4 flex items-center`}>
            🎨 ธีมสีของระบบ
          </h3>
          
          <div className="space-y-6">
            <div>
              <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-3`}>
                เลือกธีม
              </label>
              
              {/* Basic Themes */}
              <div className="mb-4">
                <div className={`text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} mb-2`}>🌟 ธีมพื้นฐาน</div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(themes).slice(0, 5).map(([themeKey, theme]) => (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeChange(themeKey)}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-all ${getThemeClasses('transition', currentTheme)} ${
                        currentTheme === themeKey
                          ? `border-${theme.accent} bg-${theme.primary}-50 shadow-md ${getThemeClasses('glow', currentTheme)}`
                          : `border-gray-300 hover:border-${theme.accent} ${getThemeClasses('hover', currentTheme)}`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full bg-${theme.accent} shadow-sm`}></div>
                        <span className={`font-medium ${getThemeClasses('textPrimary', currentTheme)} text-sm`}>
                          {theme.name}
                        </span>
                      </div>
                      {currentTheme === themeKey && (
                        <div className={`w-4 h-4 rounded-full bg-${theme.accent} flex items-center justify-center`}>
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Colorful Themes */}
              <div className="mb-4">
                <div className={`text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} mb-2`}>🌈 ธีมสีสัน</div>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(themes).slice(5, 9).map(([themeKey, theme]) => (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeChange(themeKey)}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-all ${getThemeClasses('transition', currentTheme)} ${
                        currentTheme === themeKey
                          ? `border-${theme.accent} bg-${theme.primary}-50 shadow-md ${getThemeClasses('glow', currentTheme)}`
                          : `border-gray-300 hover:border-${theme.accent} ${getThemeClasses('hover', currentTheme)}`
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full bg-${theme.accent} shadow-sm`}></div>
                        <span className={`font-medium ${getThemeClasses('textPrimary', currentTheme)} text-sm`}>
                          {theme.name}
                        </span>
                      </div>
                      {currentTheme === themeKey && (
                        <div className={`w-4 h-4 rounded-full bg-${theme.accent} flex items-center justify-center`}>
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <div className={`text-xs font-medium ${getThemeClasses('textMuted', currentTheme)} mb-2`}>✨ ธีมพิเศษ</div>
                <div className="grid grid-cols-1 gap-3">
                  {Object.entries(themes).slice(9).map(([themeKey, theme]) => (
                    <button
                      key={themeKey}
                      onClick={() => handleThemeChange(themeKey)}
                      className={`flex items-center justify-between p-4 border rounded-lg transition-all ${getThemeClasses('transition', currentTheme)} ${
                        currentTheme === themeKey
                          ? `border-${theme.accent === 'black' ? 'gray-800' : theme.accent} ${themeKey === 'sunset' ? 'bg-gradient-to-r from-orange-50 to-pink-50' : themeKey === 'ocean' ? 'bg-gradient-to-r from-cyan-50 to-blue-50' : `bg-${theme.primary}-50`} shadow-lg`
                          : `border-gray-300 hover:shadow-md ${getThemeClasses('hover', currentTheme)}`
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <div 
                          className="w-8 h-8 rounded-lg shadow-md"
                          style={{
                            background: themeKey === 'sunset' ? 'linear-gradient(45deg, #F97316, #EC4899)' :
                                       themeKey === 'ocean' ? 'linear-gradient(45deg, #06B6D4, #3B82F6)' :
                                       themeKey === 'contrast' ? '#000000' : `#${theme.accent.replace('-', '')}`
                          }}
                        ></div>
                        <div>
                          <span className={`font-semibold ${getThemeClasses('textPrimary', currentTheme)}`}>
                            {theme.name}
                          </span>
                          <div className={`text-xs ${getThemeClasses('textMuted', currentTheme)} mt-1`}>
                            {themeKey === 'contrast' && 'เพื่อการเข้าถึงที่ดีขึ้น'}
                            {themeKey === 'sunset' && 'ไล่สีอบอุ่น'}
                            {themeKey === 'ocean' && 'ไล่สีเซีย'}
                          </div>
                        </div>
                      </div>
                      {currentTheme === themeKey && (
                        <div className="flex items-center space-x-2">
                          <span className={`text-xs ${getThemeClasses('success', currentTheme)} px-2 py-1 rounded-full`}>
                            ใช้งานอยู่
                          </span>
                          <div className={`w-4 h-4 rounded-full ${themeKey === 'contrast' ? 'bg-black' : `bg-${theme.accent}`} flex items-center justify-center`}>
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-3`}>
                🔍 ตัวอย่างธีม
              </label>
              <div className={`p-6 border rounded-xl ${getThemeClasses('cardBg', currentTheme)} ${getThemeClasses('cardBorder', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`text-lg font-bold ${getThemeClasses('textPrimary', currentTheme)}`}>
                      🏪 ร้านค้าตัวอย่าง
                    </div>
                    <div className={`px-3 py-1 text-xs rounded-full ${getThemeClasses('success', currentTheme)}`}>
                      เปิดบริการ
                    </div>
                  </div>
                  
                  <div className={`text-sm ${getThemeClasses('textSecondary', currentTheme)}`}>
                    ยินดีต้อนรับสู่ระบบขายของเรา ด้วยธีม{themes[currentTheme].name}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button className={`px-4 py-2 text-sm text-white rounded-lg ${getThemeClasses('primaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}>
                      ปุ่มหลัก
                    </button>
                    <button className={`px-4 py-2 text-sm border rounded-lg ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)}`}>
                      ปุ่มรอง
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className={`p-2 rounded ${getThemeClasses('success', currentTheme)}`}>สำเร็จ</div>
                    <div className={`p-2 rounded ${getThemeClasses('warning', currentTheme)}`}>คำเตือน</div>
                    <div className={`p-2 rounded ${getThemeClasses('danger', currentTheme)}`}>ข้อผิดพลาด</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => {
                  const randomThemes = Object.keys(themes);
                  const randomTheme = randomThemes[Math.floor(Math.random() * randomThemes.length)];
                  handleThemeChange(randomTheme);
                }}
                className={`flex-1 px-4 py-2 text-sm border rounded-lg ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center justify-center space-x-2`}
              >
                <span>🎲</span>
                <span>สุ่มธีม</span>
              </button>
              
              <button
                onClick={() => handleThemeChange('light')}
                className={`flex-1 px-4 py-2 text-sm border rounded-lg ${getThemeClasses('secondaryBtn', currentTheme)} ${getThemeClasses('transition', currentTheme)} flex items-center justify-center space-x-2`}
              >
                <span>🔄</span>
                <span>รีเซ็ต</span>
              </button>
            </div>
          </div>
        </div>

        <div className={`${getThemeClasses('cardBg', currentTheme)} rounded-lg shadow-sm border ${getThemeClasses('cardBorder', currentTheme)} p-6`}>
          <h3 className={`text-lg font-semibold ${getThemeClasses('textPrimary', currentTheme)} mb-4 flex items-center`}>
            🔔 การแจ้งเตือนและความปลอดภัย
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <label className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>
                  สำรองข้อมูลอัตโนมัติ
                </label>
                <p className={`text-xs ${getThemeClasses('textMuted', currentTheme)} mt-1`}>
                  สำรองข้อมูลทุกชั่วโมง
                </p>
              </div>
              <button
                onClick={() => setSettings({...settings, autoBackup: !settings.autoBackup})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.autoBackup ? `bg-${themes[currentTheme].accent}` : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.autoBackup ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <label className={`text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)}`}>
                  แจ้งเตือนทางอีเมล
                </label>
                <p className={`text-xs ${getThemeClasses('textMuted', currentTheme)} mt-1`}>
                  รับแจ้งเตือนผ่านอีเมล
                </p>
              </div>
              <button
                onClick={() => setSettings({...settings, emailNotifications: !settings.emailNotifications})}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? `bg-${themes[currentTheme].accent}` : 'bg-gray-200'
                }`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`} />
              </button>
            </div>

            <div className={`p-4 rounded-lg ${currentTheme === 'dark' ? 'bg-blue-900 bg-opacity-30 border-blue-700' : 'bg-blue-50 border-blue-200'} border`}>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <span className="text-lg">🔐</span>
                </div>
                <div>
                  <p className={`text-sm font-medium ${currentTheme === 'dark' ? 'text-blue-200' : 'text-blue-800'}`}>
                    ออกจากระบบอัตโนมัติ
                  </p>
                  <p className={`text-xs mt-1 ${currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-700'}`}>
                    ระบบจะออกจากระบบอัตโนมัติหลังไม่มีการใช้งาน 5 นาที
                  </p>
                  <div className={`mt-2 text-xs ${currentTheme === 'dark' ? 'text-blue-300' : 'text-blue-600'} space-y-1`}>
                    <div>• เตือนล่วงหน้า 1 นาทีก่อนออกจากระบบ</div>
                    <div>• สามารถต่ออายุเซสชันได้จาก popup</div>
                    <div>• ดูสถานะเซสชันที่มุมขวาล่าง (เดสก์ท็อป)</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                แจ้งเตือนสินค้าใกล้หมด (ชิ้น)
              </label>
              <input
                type="number"
                value={settings.lowStockAlert}
                onChange={(e) => setSettings({...settings, lowStockAlert: e.target.value})}
                className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
              />
            </div>

            <div>
              <label className={`block text-sm font-medium ${getThemeClasses('textSecondary', currentTheme)} mb-2`}>
                ข้อความท้ายใบเสร็จ
              </label>
              <textarea
                value={settings.receiptFooter}
                onChange={(e) => setSettings({...settings, receiptFooter: e.target.value})}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg ${getThemeClasses('input', currentTheme)}`}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => alert('บันทึกการตั้งค่าเรียบร้อย')}
          className={`text-white px-6 py-2 rounded-lg font-medium transition-colors ${getThemeClasses('primaryBtn', currentTheme)}`}
        >
          บันทึกการตั้งค่า
        </button>
      </div>
    </div>
  );
};

export default SystemSettings;