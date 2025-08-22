import React, { useState, useEffect, useContext } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom"

import { getThemeClasses } from "./utils/themes"
import { SESSION_TIMEOUT, WARNING_TIME } from "./utils/constants"

import LoginPage from "./components/Auth/LoginPage"
import Sidebar from "./components/Layout/Sidebar"
import Header from "./components/Layout/Header"
import SessionWarningModal from "./components/Modals/SessionWarningModal"
import LogoutConfirmModal from "./components/Modals/LogoutConfirmModal"
import SessionIndicator from "./components/Common/SessionIndicator"
import ProtectedRoute from "./components/Auth/ProtectedRoute"

import Dashboard from "./pages/Dashboard"

import Sales from "./pages/sale"
import StcardPage from "./pages/stcard"
import StkfilePage from "./pages/stkfile"

/* REPORTS */
import ReportSales from "./pages/report-sales"
import ReportStcard from "./pages/report-stcard"
import ReportStkfile from "./pages/report-stkfile"
import ReportSummary from "./pages/report-summary"

import UserGroups from "./pages/posuser"
import SystemSettings from "./pages/SystemSettings"
import BranchInfo from "./pages/BranchInfo"

import { AppContext } from './contexts'

const AppLayout = ({
  children,
  user,
  currentTheme,
  setSidebarOpen,
  setShowLogoutConfirm,
  expandedMenus,
  setExpandedMenus,
  sidebarOpen
}) => {
  return (
    <div className={`flex h-screen ${getThemeClasses("mainBg", currentTheme)}`}>
      <Sidebar
        user={user}
        currentTheme={currentTheme}
        setShowLogoutConfirm={setShowLogoutConfirm}
        expandedMenus={expandedMenus}
        setExpandedMenus={setExpandedMenus}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          currentTheme={currentTheme}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

const AppContent = () => {
  const { appData, setAppData } = useContext(AppContext)
  const { userInfo, currentTheme } = appData
  const [user, setUser] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false); // เพิ่ม flag สำหรับตรวจสอบว่า app initialize แล้วหรือยัง
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [cart, setCart] = useState([])

  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showSessionWarning, setShowSessionWarning] = useState(false)

  const [expandedMenus, setExpandedMenus] = useState({
    sales: true,
    reports: false,
    settings: false
  })

  const [sessionCountdown, setSessionCountdown] = useState(60)
  const [lastActivity, setLastActivity] = useState(Date.now())

  // เพิ่ม useEffect สำหรับ initialize user จาก localStorage และ context
  useEffect(() => {
    let userFound = false;
    
    // ตรวจสอบ userInfo จาก context ก่อน
    if (userInfo && userInfo !== 'null' && userInfo !== 'undefined') {
      if (typeof userInfo === 'string') {
        try {
          const parsedUserInfo = JSON.parse(userInfo)
          if (parsedUserInfo && parsedUserInfo.id) {
            setUser(parsedUserInfo)
            userFound = true;
          }
        } catch (error) {
          console.error('Error parsing userInfo from context:', error)
        }
      } else if (userInfo && userInfo.id) {
        setUser(userInfo)
        userFound = true;
      }
    }

    // ถ้าไม่มีใน context ให้ตรวจสอบ localStorage
    if (!userFound) {
      const storedUserInfo = localStorage.getItem('userInfo')
      
      if (storedUserInfo && storedUserInfo !== 'null' && storedUserInfo !== 'undefined') {
        try {
          const parsedUserInfo = JSON.parse(storedUserInfo)
          if (parsedUserInfo && parsedUserInfo.id) {
            setUser(parsedUserInfo)
            // อัพเดท context ด้วย
            setAppData(prevData => ({
              ...prevData,
              userInfo: parsedUserInfo
            }))
            userFound = true;
          }
        } catch (error) {
          console.error('Error parsing userInfo from localStorage:', error)
          localStorage.removeItem('userInfo') // ลบข้อมูลที่เสียหาย
        }
      }
    }
    
    // set initialized เมื่อเสร็จแล้ว (ไม่ว่าจะมี user หรือไม่)
    setIsInitialized(true)
  }, [setAppData, userInfo])

  // ทำให้ user state sync กับ userInfo จาก context (เมื่อ context เปลี่ยน)
  useEffect(() => {
    // ถ้า context มี userInfo และ local user state ยังไม่มี หรือไม่ตรงกัน
    if (userInfo && userInfo !== 'null' && userInfo !== 'undefined') {
      if (typeof userInfo === 'string') {
        try {
          const parsedUserInfo = JSON.parse(userInfo)
          if (parsedUserInfo && parsedUserInfo.id && (!user || user.id !== parsedUserInfo.id)) {
            setUser(parsedUserInfo)
          }
        } catch (error) {
          console.error('Error parsing userInfo:', error)
        }
      } else if (userInfo && userInfo.id && (!user || user.id !== userInfo.id)) {
        setUser(userInfo)
      }
    } else if (!userInfo || userInfo === 'null') {
      // ถ้า context ไม่มี userInfo แต่ local state มี ให้เคลียร์ local state
      if (user) {
        setUser(null)
      }
    }
  }, [userInfo, user])

  useEffect(() => {
    if (!user) return;

    let warningTimer;
    let logoutTimer;
    let countdownInterval;

    const resetTimers = () => {
      if (warningTimer) clearTimeout(warningTimer)
      if (logoutTimer) clearTimeout(logoutTimer)
      if (countdownInterval) clearInterval(countdownInterval)

      // setShowSessionWarning(false)
      setSessionCountdown(60)

      warningTimer = setTimeout(() => {
        setShowSessionWarning(true)

        let countdown = 60
        setSessionCountdown(countdown)

        countdownInterval = setInterval(() => {
          countdown--
          setSessionCountdown(countdown)

          if (countdown <= 0) {
            clearInterval(countdownInterval)
            handleAutoLogout()
          }
        }, 1000)

        logoutTimer = setTimeout(() => {
          if (countdownInterval) clearInterval(countdownInterval)
          handleAutoLogout()
        }, WARNING_TIME)
      }, SESSION_TIMEOUT - WARNING_TIME)
    }

    const handleAutoLogout = () => {
      if (warningTimer) clearTimeout(warningTimer)
      if (logoutTimer) clearTimeout(logoutTimer)
      if (countdownInterval) clearInterval(countdownInterval)

      setAppData(prevData => ({
        ...prevData,
        userInfo: null
      }))
      localStorage.setItem('userInfo', null)
      setUser(null);
      navigate("/login")
      setShowSessionWarning(false)
      setShowLogoutConfirm(false)

      setSelectedCustomer(null)
      setSidebarOpen(false)

      alert("🕐 เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่")
    }

    const handleActivity = (e) => {
      if (showLogoutConfirm || showSessionWarning) return
      if (e.isTrusted === false) return

      const now = Date.now()
      setLastActivity(now)
      resetTimers()
    }

    const events = [
      { type: "keydown", options: { passive: true } },
      { type: "scroll", options: { passive: true } },
      { type: "touchstart", options: { passive: true } },
      { type: "mousemove", options: { passive: true } }
    ]

    let lastActivityTime = 0
    const throttledHandleActivity = (e) => {
      const now = Date.now()
      if (now - lastActivityTime > 1000) {
        lastActivityTime = now
        handleActivity(e)
      }
    }

    events.forEach(({ type, options }) => {
      document.addEventListener(type, throttledHandleActivity, options)
    })

    resetTimers()

    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (logoutTimer) clearTimeout(logoutTimer);
      if (countdownInterval) clearInterval(countdownInterval);
      events.forEach(({ type }) => {
        document.removeEventListener(type, throttledHandleActivity)
      })
    }
  }, [user, showLogoutConfirm, showSessionWarning, navigate]);

  const extendSession = () => {
    setShowSessionWarning(false)
    setLastActivity(Date.now())
  }

  const handleLogout = () => {
    setAppData(prevData => ({
      ...prevData,
      userInfo: null
    }))

    localStorage.setItem('userInfo', null)

    setUser(null);
    navigate('/login');
    setShowLogoutConfirm(false);
    setSelectedCustomer(null);
    setSidebarOpen(false);
  }

  // แสดง loading จนกว่า app จะ initialize เสร็จ
  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
          <div>กำลังโหลด...</div>
        </div>
      </div>
    )
  }

  return (
    <>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage 
                currentTheme={currentTheme}
                setUser={setUser} 
                onLogin={() => navigate("/dashboard")} />
            )
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute user={user} isInitialized={isInitialized}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <Dashboard currentTheme={currentTheme} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/sales"
          element={
            <ProtectedRoute user={user} isInitialized={isInitialized}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <Sales
                  currentTheme={currentTheme}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  cart={cart}
                  setCart={setCart}
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stcard"
          element={
            <ProtectedRoute user={user} isInitialized={isInitialized}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <StcardPage
                  currentTheme={currentTheme}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  cart={cart}
                  setCart={setCart}
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/stkfile"
          element={
            <ProtectedRoute user={user} isInitialized={isInitialized}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <StkfilePage
                  currentTheme={currentTheme}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  cart={cart}
                  setCart={setCart}
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/user-groups"
          element={
            <ProtectedRoute user={user} isInitialized={isInitialized}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <UserGroups currentTheme={currentTheme} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/system-settings"
          element={
            <ProtectedRoute user={user} isInitialized={isInitialized}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <SystemSettings
                  currentTheme={currentTheme}
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/branch-info"
          element={
            <ProtectedRoute user={user} isInitialized={isInitialized}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <BranchInfo currentTheme={currentTheme} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-summary"
          element={
            <ProtectedRoute user={user} isInitialized={isInitialized}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <ReportSummary
                  currentTheme={currentTheme}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  cart={cart}
                  setCart={setCart}
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-stkfile"
          element={
            <ProtectedRoute user={user} isInitialized={isInitialized}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <ReportStkfile
                  currentTheme={currentTheme}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  cart={cart}
                  setCart={setCart}
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-sales"
          element={
            <ProtectedRoute user={user} isInitialized={isInitialized}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <ReportSales
                  currentTheme={currentTheme}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  cart={cart}
                  setCart={setCart}
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/report-stcard"
          element={
            <ProtectedRoute user={user} isInitialized={isInitialized}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <ReportStcard
                  currentTheme={currentTheme}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  cart={cart}
                  setCart={setCart}
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/login"} replace />}
        />
      </Routes>

      {userInfo && (
        <SessionIndicator
          user={user}
          lastActivity={lastActivity}
          showSessionWarning={showSessionWarning}
          currentTheme={currentTheme}
        />
      )}

      <SessionWarningModal
        showSessionWarning={showSessionWarning}
        sessionCountdown={sessionCountdown}
        user={user}
        setUser={setUser}
        currentTheme={currentTheme}
        extendSession={extendSession}
        onLogout={handleLogout}
        setShowSessionWarning={setShowSessionWarning}
        setCart={setCart}
        setSelectedCustomer={setSelectedCustomer}
        setSidebarOpen={setSidebarOpen}
      />

      <LogoutConfirmModal
        showLogoutConfirm={showLogoutConfirm}
        setShowLogoutConfirm={setShowLogoutConfirm}
        onLogout={handleLogout}
        setCart={setCart}
        setSelectedCustomer={setSelectedCustomer}
        setSidebarOpen={setSidebarOpen}
        userInfo={userInfo}
        currentTheme={currentTheme}
      />
    </>
  )
}

const getInitialUserInfo = () => {
  const stored = localStorage.getItem("userInfo")
  if (!stored || stored === 'null' || stored === 'undefined') {
    return null
  }
  try {
    return JSON.parse(stored)
  } catch (error) {
    console.error('Error parsing userInfo from localStorage:', error)
    return null
  }
}

const initContext = {
  branchCode: localStorage.getItem('branchCode') || '',
  userInfo: getInitialUserInfo(),
  currentTheme: localStorage.getItem("currentTheme") || "sunset"
}

const App = () => {
  const [appData, setAppData] = useState(initContext)

  return (
    <Router basename="findig-sale-online">
      <AppContext.Provider value={{ appData, setAppData}}>
        <AppContent />
      </AppContext.Provider>
    </Router>
  )
}

export default App
