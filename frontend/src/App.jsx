import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/AuthPage';
import VotingDashboard from './components/VotingDashboard';
import AdminPanel from './components/AdminPanel';
import Header from './components/Header';
import LoadingSpinner from './components/LoadingSpinner';
import { checkBackendHealth } from './api';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

// Main App Content Component
const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState(null);
  const [checkingBackend, setCheckingBackend] = useState(true);

  // Check backend connectivity on app start
  useEffect(() => {
    const checkBackend = async () => {
      setCheckingBackend(true);
      const isHealthy = await checkBackendHealth(); // No auth needed
      setBackendStatus(isHealthy);
      setCheckingBackend(false);
    };
    
    checkBackend();
    
    const interval = setInterval(checkBackend, 30000); // Every 30 seconds
    return () => clearInterval(interval);
  }, []);

  if (loading || checkingBackend) {
    return (
      <LoadingSpinner 
        message={checkingBackend ? "Connecting to server..." : "Loading application..."} 
      />
    );
  }

  if (backendStatus === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-8 text-center max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <WifiOff className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Backend Unavailable</h2>
          <p className="text-gray-600 mb-4">
            Cannot connect to the voting server. Ensure the Spring Boot backend is running on port 8080.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.location.reload()}
            className="btn-primary flex items-center space-x-2 mx-auto"
          >
            <Wifi className="w-5 h-5" />
            <span>Retry Connection</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen">
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      {/* Backend Status Indicator */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`px-4 py-2 text-center text-sm ${
          backendStatus 
            ? 'bg-green-500/20 text-green-100' 
            : 'bg-yellow-500/20 text-yellow-100'
        }`}
      >
        <div className="flex items-center justify-center space-x-2">
          {backendStatus ? (
            <>
              <Wifi className="w-4 h-4" />
              <span>Connected to voting server</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              <span>Connection issues - some features may not work</span>
            </>
          )}
        </div>
      </motion.div>

      {/* Main Content */}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {currentView === 'dashboard' && <VotingDashboard />}
            {currentView === 'admin' && <AdminPanel />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};

// Main App Component with Auth Provider
const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
