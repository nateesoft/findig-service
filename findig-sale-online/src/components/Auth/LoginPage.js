import React, { useContext, useEffect, useState } from 'react';
import { ShoppingCart } from 'lucide-react';

import { validateLogin } from "../../api/userLoginApi"
import { themes, getThemeClasses } from '../../utils/themes';
import { AppContext } from '../../contexts';
import { Modal } from '../Modals';
import { loadAllBranch } from '../../api/branchApi';

const LoginPage = ( { onLogin, setUser }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [branchFile, setBranchFile] = useState([])

  const { appData, setAppData } = useContext(AppContext)
  const { currentTheme, branchCode } = appData

  const [loginData, setLoginData] = useState({ username: '', password: '', branchCode: branchCode || '' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    if(!loginData.branchCode){
      return;
    }
    e.preventDefault();
    setLoading(true);

    const { data: userInfo, error } = await validateLogin({
      username: loginData.username,
      password: loginData.password
    })

    if(userInfo) {
      localStorage.setItem('userInfo', JSON.stringify(userInfo))
      localStorage.setItem('branchCode', loginData.branchCode)

      setAppData(prevData => ({
        ...prevData,
        userInfo: userInfo,
        branchCode: loginData.branchCode
      }))

      setUser({
        id: 1,
        username: loginData.username,
        fullName: 'Admin',
        role: 'admin'
      })

      onLogin()
    } else {
      setLoading(false);
      setActiveModal({
        type: 'error',
        title: 'เข้าสู่ระบบล้มเหลว',
        message: error || 'Username/Password ไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
        actions: [
          {
            label: 'ตกลง',
            onClick: () => setActiveModal(null)
          }
        ]
      });
    }
  };

  useEffect(()=> {
    async function initLoad() {
      const { data, error } = await loadAllBranch()
      if(data) {
        setBranchFile(data)
        setLoginData({
          ...loginData,
          branchCode: branchCode
        })
      }else{
        setActiveModal({
          type: 'error',
          title: 'แสดงข้อมูลสาขาทั้งหมด',
          message: error || 'พบปัญหาในการแสดงรายการสาขาทั้งหมด',
          actions: [
            {
              label: 'ตกลง',
              onClick: () => setActiveModal(null)
            }
          ]
        });
      }
    }
    
    initLoad()
  }, [])

  const loginThemeClasses = currentTheme === 'sunset' ? 'bg-gradient-to-br from-orange-100 via-pink-100 to-red-100' :
                            currentTheme === 'ocean' ? 'bg-gradient-to-br from-cyan-100 via-blue-100 to-indigo-100' :
                            currentTheme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' :
                            currentTheme === 'contrast' ? 'bg-white' :
                            `bg-gradient-to-br from-${themes[currentTheme].primary}-50 to-${themes[currentTheme].primary}-100`;

  return (
    <div
      className={`min-h-screen ${loginThemeClasses} flex items-center justify-center p-4 relative overflow-hidden`}
    >
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={`absolute top-1/4 left-1/4 w-64 h-64 ${
            currentTheme === "sunset"
              ? "bg-orange-300"
              : currentTheme === "ocean"
              ? "bg-cyan-300"
              : `bg-${themes[currentTheme].primary}-300`
          } rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse`}
        ></div>
        <div
          className={`absolute top-3/4 right-1/4 w-64 h-64 ${
            currentTheme === "sunset"
              ? "bg-pink-300"
              : currentTheme === "ocean"
              ? "bg-blue-300"
              : `bg-${themes[currentTheme].primary}-200`
          } rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000`}
        ></div>
        <div
          className={`absolute bottom-1/4 left-1/3 w-64 h-64 ${
            currentTheme === "sunset"
              ? "bg-red-300"
              : currentTheme === "ocean"
              ? "bg-indigo-300"
              : `bg-${themes[currentTheme].primary}-400`
          } rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-2000`}
        ></div>
      </div>

      <div
        className={`relative ${getThemeClasses(
          "cardBg",
          currentTheme
        )} rounded-2xl shadow-2xl w-full max-w-md p-8 backdrop-blur-sm ${
          currentTheme !== "contrast" ? "bg-opacity-90" : ""
        } border ${getThemeClasses("cardBorder", currentTheme)}`}
      >
        <div className="text-center mb-8">
          <div
            className={`mx-auto w-16 h-16 bg-gradient-to-r ${
              themes[currentTheme].gradient
            } rounded-full flex items-center justify-center mb-4 shadow-lg ${getThemeClasses(
              "transition",
              currentTheme
            )}`}
          >
            <ShoppingCart className="w-8 h-8 text-white" />
          </div>
          <h1
            className={`text-3xl font-bold ${getThemeClasses(
              "textPrimary",
              currentTheme
            )} mb-2`}
          >
            ระบบบันทึกการขาย
          </h1>
          <p
            className={`${getThemeClasses("textSecondary", currentTheme)} mt-2`}
          >
            กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <select
              value={loginData.branchCode}
              onChange={(e) =>
                setLoginData({ ...loginData, branchCode: e.target.value })
              }
              className={`w-full px-4 py-3 border rounded-lg text-center text-sm ${getThemeClasses(
                "input",
                currentTheme
              )}`}
            >
              <option value="">เลือกสาขา</option>
              {branchFile && branchFile.map(item=>
                <option key={item.Code} value={item.Code}>{item.Code}-{item.Name}</option>
              )}
            </select>
          </div>
          <div>
            <label
              className={`block text-sm font-medium ${getThemeClasses(
                "textSecondary",
                currentTheme
              )} mb-2`}
            >
              ชื่อผู้ใช้งาน
            </label>
            <input
              type="text"
              id="txtFormUser"
              value={loginData.username}
              onChange={(e) =>
                setLoginData({ ...loginData, username: e.target.value })
              }
              className={`w-full px-4 py-3 border rounded-lg ${getThemeClasses(
                "input",
                currentTheme
              )} ${getThemeClasses("transition", currentTheme)}`}
              placeholder="admin"
              autoComplete="new-user"
              onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
            />
          </div>

          <div>
            <label
              className={`block text-sm font-medium ${getThemeClasses(
                "textSecondary",
                currentTheme
              )} mb-2`}
            >
              รหัสผ่าน
            </label>
            <input
              type="password"
              id="txtFormPass"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className={`w-full px-4 py-3 border rounded-lg ${getThemeClasses(
                "input",
                currentTheme
              )} ${getThemeClasses("transition", currentTheme)}`}
              placeholder="password"
              autoComplete="new-password"
              onKeyPress={(e) => e.key === "Enter" && handleLogin(e)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full text-white py-3 rounded-lg font-medium ${getThemeClasses(
              "primaryBtn",
              currentTheme
            )} ${getThemeClasses(
              "transition",
              currentTheme
            )} disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg`}
          >
            {loading ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>กำลังเข้าสู่ระบบ...</span>
              </div>
            ) : (
              "เข้าสู่ระบบ"
            )}
          </button>
        </div>

        <div className="mt-4 text-center">
          <div
            className={`text-xs ${getThemeClasses(
              "textMuted",
              currentTheme
            )} p-3 rounded-lg ${
              currentTheme === "dark" ? "bg-gray-800" : "bg-gray-50"
            } border ${getThemeClasses("cardBorder", currentTheme)}`}
          >
            <div className="font-medium mb-2 flex items-center justify-center space-x-1">
              <span>🔐</span>
              <span>ความปลอดภัยของระบบ</span>
            </div>
            <div className="space-y-1 text-xs">
              <div>⏰ ออกจากระบบอัตโนมัติภายใน 5 นาทีหากไม่มีการใช้งาน</div>
              <div>⚠️ เตือนล่วงหน้า 1 นาทีก่อนออกจากระบบ</div>
              <div>🔄 สามารถต่ออายุเซสชันได้จากแจ้งเตือน</div>
            </div>
          </div>
        </div>
      </div>
      {activeModal && (
        <Modal
          isOpen={!!activeModal}
          onClose={() => setActiveModal(null)}
          type={activeModal.type}
          title={activeModal.title}
          message={activeModal.message}
          confirmText={activeModal.confirmText}
          cancelText={activeModal.cancelText}
          showCancel={activeModal.showCancel}
          onConfirm={() => {
            setActiveModal(null)
          }}
        />
      )}
    </div>
  )
};

export default LoginPage;