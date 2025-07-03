// src/App.jsx
import React, { useState, useEffect } from 'react';
import { getThemeClasses } from './utils/themes';
import { SESSION_TIMEOUT, WARNING_TIME } from './utils/constants';

// Import Components
import LoginPage from './components/Auth/LoginPage';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import QuickThemeSelector from './components/Layout/QuickThemeSelector';
import SessionWarningModal from './components/Modals/SessionWarningModal';
import LogoutConfirmModal from './components/Modals/LogoutConfirmModal';
import SessionIndicator from './components/Common/SessionIndicator';

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

const App = () => {
  // User and Authentication States
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('login');
  
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
      setCurrentPage('login');
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
  }, [user, showLogoutConfirm, showSessionWarning]);

  // Handle session extension
  const extendSession = () => {
    console.log('Session extended');
    setShowSessionWarning(false);
    setLastActivity(Date.now());
  };

  // Render different pages based on currentPage
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard currentTheme={currentTheme} />;
      case 'sales':
        return (
          <Sales 
            currentTheme={currentTheme}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            cart={cart}
            setCart={setCart}
          />
        );
      case 'user-groups':
        return <UserGroups currentTheme={currentTheme} />;
      case 'products':
        return (
          <Products 
            currentTheme={currentTheme}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        );
      case 'customers':
        return (
          <Customers 
            currentTheme={currentTheme}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        );
      case 'reports':
        return <Reports currentTheme={currentTheme} />;
      case 'inventory-report':
        return <InventoryReport currentTheme={currentTheme} />;
      case 'system-settings':
        return (
          <SystemSettings 
            currentTheme={currentTheme}
            setCurrentTheme={setCurrentTheme}
          />
        );
      case 'branch-info':
        return <BranchInfo currentTheme={currentTheme} />;
      default:
        return <Dashboard currentTheme={currentTheme} />;
    }
  };

  // If user is not logged in, show login page
  if (!user) {
    return (
      <LoginPage 
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
        setUser={setUser}
        setCurrentPage={setCurrentPage}
      />
    );
  }

  // Main App Layout
  return (
    <div className={`flex h-screen ${getThemeClasses('mainBg', currentTheme)}`}>
      {/* Sidebar */}
      <Sidebar 
        user={user}
        currentTheme={currentTheme}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        setSidebarOpen={setSidebarOpen}
        setShowLogoutConfirm={setShowLogoutConfirm}
        expandedMenus={expandedMenus}
        setExpandedMenus={setExpandedMenus}
        sidebarOpen={sidebarOpen}
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
          {renderPage()}
        </main>
      </div>
      
      {/* Quick Theme Selector */}
      {/* <QuickThemeSelector 
        currentTheme={currentTheme}
        setCurrentTheme={setCurrentTheme}
      /> */}
      
      {/* Session Indicator */}
      <SessionIndicator 
        user={user}
        lastActivity={lastActivity}
        showSessionWarning={showSessionWarning}
        currentTheme={currentTheme}
      />
      
      {/* Session Warning Modal */}
      <SessionWarningModal 
        showSessionWarning={showSessionWarning}
        sessionCountdown={sessionCountdown}
        user={user}
        currentTheme={currentTheme}
        extendSession={extendSession}
        setUser={setUser}
        setCurrentPage={setCurrentPage}
        setShowSessionWarning={setShowSessionWarning}
        setCart={setCart}
        setSelectedCustomer={setSelectedCustomer}
        setSidebarOpen={setSidebarOpen}
      />
      
      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal 
        showLogoutConfirm={showLogoutConfirm}
        setShowLogoutConfirm={setShowLogoutConfirm}
        setUser={setUser}
        setCurrentPage={setCurrentPage}
        setCart={setCart}
        setSelectedCustomer={setSelectedCustomer}
        setSidebarOpen={setSidebarOpen}
        user={user}
        currentTheme={currentTheme}
      />
    </div>
  );
};

export default App;