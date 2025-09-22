import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  LogOut, 
  Vote, 
  Settings, 
  User, 
  Menu, 
  X,
  Shield
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header = ({ currentView, setCurrentView }) => {
  const { user, logout, isAdmin } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    setShowMobileMenu(false);
  };

  const navItems = [
    { id: 'dashboard', label: 'Voting', icon: Vote, admin: false },
    ...(isAdmin() ? [{ id: 'admin', label: 'Admin Panel', icon: Settings, admin: true }] : [])
  ];

  return (
    <header className="bg-white border-b border-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-3"
          >
            <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
              <Vote className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-black">VoteApp</h1>
              <p className="text-xs text-gray-600">Democratic Voting Platform</p>
            </div>
          </motion.div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentView(item.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                  currentView === item.id
                    ? 'bg-white/20 text-white'
                    : 'text-blue-100 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
                {item.admin && <Shield className="w-4 h-4" />}
              </motion.button>
            ))}
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-3 text-white">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-medium">{user?.username}</p>
                <p className="text-xs text-blue-100">{user?.role}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500/20 text-red-100 hover:bg-red-500/30 rounded-lg transition-all duration-200"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="md:hidden p-2 text-white hover:bg-white/10 rounded-lg"
          >
            {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        {showMobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-white/20"
          >
            <div className="space-y-2">
              {/* User Info */}
              <div className="flex items-center space-x-3 p-3 bg-white/10 rounded-lg mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-medium text-white">{user?.username}</p>
                  <p className="text-sm text-blue-100">{user?.role}</p>
                </div>
              </div>

              {/* Navigation Links */}
              {navItems.map((item) => (
                <motion.button
                  key={item.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setCurrentView(item.id);
                    setShowMobileMenu(false);
                  }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-white/20 text-white'
                      : 'text-blue-100 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                  {item.admin && <Shield className="w-4 h-4 ml-auto" />}
                </motion.button>
              ))}

              {/* Logout Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-3 bg-red-500/20 text-red-100 hover:bg-red-500/30 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;