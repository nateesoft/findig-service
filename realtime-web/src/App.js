import React, { useState, useEffect, useContext } from "react"
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation
} from "react-router-dom"

import { getThemeClasses } from "./utils/themes"
import { SESSION_TIMEOUT, WARNING_TIME } from "./utils/constants"
import { getUserFromToken, getBranchFromToken, clearAuthCookie } from "./utils/auth"

import LoginPage from "./components/Auth/LoginPage"
import Sidebar from "./components/Layout/Sidebar"
import Header from "./components/Layout/Header"
import SessionWarningModal from "./components/Modals/SessionWarningModal"
import LogoutConfirmModal from "./components/Modals/LogoutConfirmModal"
import SessionIndicator from "./components/Common/SessionIndicator"
import ProtectedRoute from "./components/Auth/ProtectedRoute"

import Dashboard from "./pages/Dashboard"

import StockIn from "./pages/stock-in"
import StockOut from "./pages/stock-out"
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

const LoginRoute = ({ user, currentTheme, setUser, navigate }) => {
  const location = useLocation()
  if (user) {
    const params = new URLSearchParams(location.search)
    const redirect = params.get('redirect')
    return <Navigate to={redirect || '/dashboard'} replace />
  }
  return (
    <LoginPage
      currentTheme={currentTheme}
      setUser={setUser}
      onLogin={() => {
        const params = new URLSearchParams(location.search)
        const redirect = params.get('redirect')
        navigate(redirect || '/dashboard')
      }}
    />
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

  // initialize user จาก JWT cookie
  useEffect(() => {
    const isValidUser = (u) => u && (u.username || u.UserName || u.id)

    // ตรวจสอบ userInfo จาก context ก่อน (set โดย initContext หรือ login)
    if (userInfo && isValidUser(userInfo)) {
      setUser(userInfo)
      setIsInitialized(true)
      return
    }

    // fallback: อ่านจาก JWT cookie โดยตรง
    const tokenUser = getUserFromToken()
    if (tokenUser && isValidUser(tokenUser)) {
      setUser(tokenUser)
      setAppData(prevData => ({
        ...prevData,
        userInfo: tokenUser,
        branchCode: tokenUser.branchCode || prevData.branchCode
      }))
    }

    setIsInitialized(true)
  }, [setAppData, userInfo])

  // sync user state เมื่อ userInfo ใน context เป็น null (logout)
  useEffect(() => {
    if (!userInfo && user) {
      setUser(null)
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
      clearAuthCookie()
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

    clearAuthCookie()

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
            <LoginRoute user={user} currentTheme={currentTheme} setUser={setUser} navigate={navigate} />
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
          path="/stock-in"
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
                <StockIn
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
          path="/stock-out"
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
                <StockOut
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

const initContext = {
  branchCode: getBranchFromToken() || localStorage.getItem('branchCode') || '',
  userInfo: getUserFromToken(),
  currentTheme: localStorage.getItem("currentTheme") || "sunset"
}

const App = () => {
  const [appData, setAppData] = useState(initContext)

  return (
    <Router basename="realtime-web">
      <AppContext.Provider value={{ appData, setAppData}}>
        <AppContent />
      </AppContext.Provider>
    </Router>
  )
}

export default App
