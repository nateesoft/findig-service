import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';

import { getThemeClasses } from './utils/themes';
import { SESSION_TIMEOUT, WARNING_TIME } from './utils/constants';

// Import Components
import LoginPage from './components/Auth/LoginPage';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import SessionWarningModal from './components/Modals/SessionWarningModal';
import LogoutConfirmModal from './components/Modals/LogoutConfirmModal';
import SessionIndicator from './components/Common/SessionIndicator';
import ProtectedRoute from './components/Auth/ProtectedRoute';

// Import Pages
import Dashboard from './pages/Dashboard';
import Sales from './pages/Sales';
import UserGroups from './pages/UserGroups';
import Products from './pages/Products';
import Customers from './pages/Customers';
import Reports from './pages/Reports';
import InventoryReport from './pages/InventoryReport';
import SystemSettings from './pages/SystemSettings';
import BranchInfo from './pages/BranchInfo';

// Layout Component สำหรับหน้าที่ล็อกอินแล้ว
const AppLayout = ({ children, user, currentTheme, setCurrentTheme, setSidebarOpen, setShowLogoutConfirm, expandedMenus, setExpandedMenus, sidebarOpen }) => {
  return (
    <div className={`flex h-screen ${getThemeClasses('mainBg', currentTheme)}`}>
      {/* Sidebar */}
      <Sidebar 
        user={user}
        currentTheme={currentTheme}
        setShowLogoutConfirm={setShowLogoutConfirm}
        expandedMenus={expandedMenus}
        setExpandedMenus={setExpandedMenus}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          currentTheme={currentTheme}
          setCurrentTheme={setCurrentTheme}
          setSidebarOpen={setSidebarOpen}
          getThemeClasses={getThemeClasses}
        />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

// Main App Component
const AppContent = () => {
  // User and Authentication States
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  
  // UI States
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('sunset');
  
  // Sales Related States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [cart, setCart] = useState([]);
  
  // Modal States
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showSessionWarning, setShowSessionWarning] = useState(false);
  
  // Menu States
  const [expandedMenus, setExpandedMenus] = useState({
    sales: true,
    reports: false,
    settings: false
  });
  
  // Session Management States
  const [sessionCountdown, setSessionCountdown] = useState(60);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Auto logout system
  useEffect(() => {
    if (!user) return;

    let warningTimer;
    let logoutTimer;
    let countdownInterval;

    const resetTimers = () => {
      // Clear existing timers
      if (warningTimer) clearTimeout(warningTimer);
      if (logoutTimer) clearTimeout(logoutTimer);
      if (countdownInterval) clearInterval(countdownInterval);
      
      // Reset warning modal
      setShowSessionWarning(false);
      setSessionCountdown(60);
      
      // Set warning timer (4 minutes from now)
      warningTimer = setTimeout(() => {
        setShowSessionWarning(true);
        
        // Start countdown
        let countdown = 60;
        setSessionCountdown(countdown);
        
        countdownInterval = setInterval(() => {
          countdown--;
          setSessionCountdown(countdown);
          
          if (countdown <= 0) {
            clearInterval(countdownInterval);
            handleAutoLogout();
          }
        }, 1000);
        
        // Auto logout timer (5 minutes from now)
        logoutTimer = setTimeout(() => {
          if (countdownInterval) clearInterval(countdownInterval);
          handleAutoLogout();
        }, WARNING_TIME);
        
      }, SESSION_TIMEOUT - WARNING_TIME);
    };

    const handleAutoLogout = () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (logoutTimer) clearTimeout(logoutTimer);
      if (countdownInterval) clearInterval(countdownInterval);
      
      setUser(null);
      navigate('/login');
      setShowSessionWarning(false);
      setShowLogoutConfirm(false);
      // Reset states
      setCart([]);
      setSelectedCustomer(null);
      setSidebarOpen(false);
      
      // Show notification
      alert('🕐 เซสชันหมดอายุ กรุณาเข้าสู่ระบบใหม่');
    };

    const handleActivity = (e) => {
      // Don't interfere with menu clicks or if modals are open
      if (showLogoutConfirm || showSessionWarning) return;
      
      // Only reset on meaningful user activity, not synthetic events
      if (e.isTrusted === false) return;
      
      console.log('Activity detected:', e.type);
      const now = Date.now();
      setLastActivity(now);
      resetTimers();
    };

    // Use more specific activity events that don't interfere with clicks
    const events = [
      { type: 'keydown', options: { passive: true } },
      { type: 'scroll', options: { passive: true } },
      { type: 'touchstart', options: { passive: true } },
      { type: 'mousemove', options: { passive: true } }
    ];
    
    // Add listeners with throttling to avoid too many calls
    let lastActivityTime = 0;
    const throttledHandleActivity = (e) => {
      const now = Date.now();
      if (now - lastActivityTime > 1000) { // Throttle to once per second
        lastActivityTime = now;
        handleActivity(e);
      }
    };
    
    events.forEach(({ type, options }) => {
      document.addEventListener(type, throttledHandleActivity, options);
    });

    // Initial timer setup
    resetTimers();

    // Cleanup
    return () => {
      if (warningTimer) clearTimeout(warningTimer);
      if (logoutTimer) clearTimeout(logoutTimer);
      if (countdownInterval) clearInterval(countdownInterval);
      events.forEach(({ type }) => {
        document.removeEventListener(type, throttledHandleActivity);
      });
    };
  }, [user, showLogoutConfirm, showSessionWarning, navigate]);

  // Handle session extension
  const extendSession = () => {
    console.log('Session extended');
    setShowSessionWarning(false);
    setLastActivity(Date.now());
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null);
    navigate('/login');
    setShowLogoutConfirm(false);
    setCart([]);
    setSelectedCustomer(null);
    setSidebarOpen(false);
  };

  return (
    <>
      <Routes>
        {/* Login Route */}
        <Route 
          path="/login" 
          element={
            user ? 
            <Navigate to="/dashboard" replace /> : 
            <LoginPage 
              currentTheme={currentTheme}
              setCurrentTheme={setCurrentTheme}
              setUser={setUser}
              onLogin={() => navigate('/dashboard')}
            />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={user}>
              <AppLayout 
                user={user}
                currentTheme={currentTheme}
                setCurrentTheme={setCurrentTheme}
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
                setCurrentTheme={setCurrentTheme}
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
                setCurrentTheme={setCurrentTheme}
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
                setCurrentTheme={setCurrentTheme}
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
                setCurrentTheme={setCurrentTheme}
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
                setCurrentTheme={setCurrentTheme}
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
                setCurrentTheme={setCurrentTheme}
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
                setCurrentTheme={setCurrentTheme}
                setSidebarOpen={setSidebarOpen}
                setShowLogoutConfirm={setShowLogoutConfirm}
                expandedMenus={expandedMenus}
                setExpandedMenus={setExpandedMenus}
                sidebarOpen={sidebarOpen}
              >
                <SystemSettings 
                  currentTheme={currentTheme}
                  setCurrentTheme={setCurrentTheme}
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
                setCurrentTheme={setCurrentTheme}
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
        
        {/* Default redirect */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
        <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Routes>
      
      {/* Session Indicator - แสดงเฉพาะเมื่อล็อกอินแล้ว */}
      {user && (
        <SessionIndicator 
          user={user}
          lastActivity={lastActivity}
          showSessionWarning={showSessionWarning}
          currentTheme={currentTheme}
        />
      )}
      
      {/* Session Warning Modal */}
      <SessionWarningModal 
        showSessionWarning={showSessionWarning}
        sessionCountdown={sessionCountdown}
        user={user}
        currentTheme={currentTheme}
        extendSession={extendSession}
        onLogout={handleLogout}
        setShowSessionWarning={setShowSessionWarning}
        setCart={setCart}
        setSelectedCustomer={setSelectedCustomer}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        showLogoutConfirm={showLogoutConfirm}
        setShowLogoutConfirm={setShowLogoutConfirm}
        onLogout={handleLogout}
        setCart={setCart}
        setSelectedCustomer={setSelectedCustomer}
        setSidebarOpen={setSidebarOpen}
        user={user}
        currentTheme={currentTheme}
      />
    </>
  );
};

// Root App Component
const App = () => {
  return (
    <Router basename='findig-sale-online'>
      <AppContent />
    </Router>
  );
};

export default App;