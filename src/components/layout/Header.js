import React from 'react';
import { useAuth } from '../auth/AuthProvider';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="bg-gradient-to-r from-gray-700 to-blue-400 shadow-md w-full">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 text-xl sm:text-2xl font-bold text-white">
            AIDW Assistant
          </div>
          <div className="flex-grow"></div> {/* Spacer to push items apart */}
          {isAuthenticated && (
            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="text-white text-sm sm:text-base truncate max-w-[150px] sm:max-w-none">{user.email}</span>
              <button 
                onClick={logout} 
                className="bg-blue-400 font-bold text-white px-3 py-1 rounded hover:bg-blue-500 text-sm sm:text-base"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
