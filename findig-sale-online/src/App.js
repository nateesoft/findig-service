import { useState, useEffect, useContext } from "react"
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
import Sales from "./pages/Sales"
import UserGroups from "./pages/UserGroups"
import Products from "./pages/Products"
import Customers from "./pages/Customers"
import Reports from "./pages/Reports"
import InventoryReport from "./pages/InventoryReport"
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
          getThemeClasses={getThemeClasses}
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

  useEffect(() => {
    if (!user) return;

    let warningTimer;
    let logoutTimer;
    let countdownInterval;

    const resetTimers = () => {
      if (warningTimer) clearTimeout(warningTimer)
      if (logoutTimer) clearTimeout(logoutTimer)
      if (countdownInterval) clearInterval(countdownInterval)

      console.log('resetTimers')

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
      console.log('handleAutoLogout:', user)
      if (warningTimer) clearTimeout(warningTimer)
      if (logoutTimer) clearTimeout(logoutTimer)
      if (countdownInterval) clearInterval(countdownInterval)

      setAppData({ ...appData, userInfo: null })
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

      console.log("Activity detected:", e.type)
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
  }, [showLogoutConfirm, showSessionWarning, navigate]);

  const extendSession = () => {
    setShowSessionWarning(false)
    setLastActivity(Date.now())
  }

  const handleLogout = () => {
    setAppData({ ...appData, userInfo: null })
    localStorage.setItem('userInfo', null)

    setUser(null);
    navigate('/login');
    setShowLogoutConfirm(false);
    setSelectedCustomer(null);
    setSidebarOpen(false);
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
            <ProtectedRoute user={user}>
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
            <ProtectedRoute user={user}>
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
          path="/user-groups"
          element={
            <ProtectedRoute user={user}>
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
          path="/products"
          element={
            <ProtectedRoute user={user}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <Products
                  currentTheme={currentTheme}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/customers"
          element={
            <ProtectedRoute user={user}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <Customers
                  currentTheme={currentTheme}
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute user={user}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <Reports currentTheme={currentTheme} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory-report"
          element={
            <ProtectedRoute user={user}>
              <AppLayout
                user={user}
                currentTheme={currentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <InventoryReport currentTheme={currentTheme} />
              </AppLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/system-settings"
          element={
            <ProtectedRoute user={user}>
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
            <ProtectedRoute user={user}>
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
  db: localStorage.getItem('db') || '',
  userInfo: localStorage.getItem("userInfo") || null,
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
