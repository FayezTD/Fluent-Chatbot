import React, { useState, useEffect } from 'react';

const Sidebar = ({ onNewChat, activeChatId }) => {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });
  
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Default to open on larger screens, closed on mobile
    return window.innerWidth >= 768;
  });

  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    return localStorage.getItem('sidebarCollapsed') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', sidebarCollapsed.toString());
  }, [sidebarCollapsed]);
  
  // Listen for window resize to automatically adjust sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [sidebarOpen]);

  return (
    <>
      {/* Hamburger menu button - visible only on small screens */}
      {/* <button 
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className={`fixed top-4 left-4 z-50 md:hidden p-2 rounded-md shadow-md transition ${
          darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
        }`}
      >
        {sidebarOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button> */}
      
      {/* Sidebar */}
      <div 
        className={`fixed md:static h-full z-40 transition-all duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${darkMode ? 'bg-gray-900 border-gray-700 text-white' : 'bg-white border-gray-200 text-black'} border-r ${
          sidebarCollapsed ? 'w-16' : 'w-64'
        } flex flex-col`}
      >
        <button 
  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
  className={`absolute right-0 top-4 transform translate-x-1/2 flex items-center justify-center z-50 h-8 w-8 rounded-full shadow-md transition ${
    darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'
  }`}
>
  {sidebarCollapsed ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
    </svg>
  )}
</button>


        <div className={`p-4 flex justify-between items-center ${sidebarCollapsed ? 'justify-center' : ''}`}>
          <button
            onClick={onNewChat}
            className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium transition duration-150 ${
              darkMode ? 'bg-blue-300 hover:bg-blue-400 text-white' : 'bg-blue-300 hover:bg-blue-400 text-black'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${sidebarCollapsed ? '' : 'mr-2'}`} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            {!sidebarCollapsed && "New Chat"}
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {/* Placeholder for chat history - can be expanded in the future */}
          <div className={`p-2 rounded-md cursor-pointer transition ${
            activeChatId === 'current' ? (darkMode ? 'bg-gray-700' : 'bg-gray-100') : (darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50')
          }`}>
            {sidebarCollapsed ? (
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
            ) : (
              <>
                <div className="text-sm font-medium truncate">Current Chat</div>
                <div className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>AI-driven workplace assistant</div>
              </>
            )}
          </div>
        </div>

        <div className={`p-4 border-t flex items-center ${sidebarCollapsed ? 'justify-center' : 'justify-between'}`} style={{ borderColor: darkMode ? 'rgb(55, 65, 81)' : 'rgb(229, 231, 235)' }}>
          {!sidebarCollapsed && (
            <div className={`text-xs transition ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              AIDW Assistant v1.0
            </div>
          )}
          
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-md transition hover:bg-opacity-20"
          >
            {darkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a8 8 0 107.938 6.732A7 7 0 0110 18a8 8 0 000-16z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zM4.222 5.222a1 1 0 011.414 0l.707.707a1 1 0 01-1.414 1.414l-.707-.707a1 1 0 010-1.414zM3 10a1 1 0 011-1h1a1 1 0 110 2H4a1 1 0 01-1-1zm11-6a1 1 0 011 1v1a1 1 0 11-2 0V4a1 1 0 011-1zm3.778 1.778a1 1 0 010 1.414l-.707.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM16 10a1 1 0 011-1h1a1 1 0 110 2h-1a1 1 0 01-1-1zm-3.778 6.222a1 1 0 01-1.414 0l-.707-.707a1 1 0 011.414-1.414l.707.707a1 1 0 010 1.414zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM4.222 14.778a1 1 0 000 1.414l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
          </button>
        </div>
      </div>
      
      {/* Overlay to close sidebar when clicking outside (mobile only) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;