import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import authService from './services/authService';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogin, setShowLogin] = useState(true);

  useEffect(() => {
    // Check if user is already authenticated
    console.log('🔍 App useEffect - Checking authentication...');
    console.log('🔍 localStorage token:', localStorage.getItem('token'));
    
    if (authService.isAuthenticated()) {
      console.log('✅ User is authenticated, showing TaskList');
      // Ensure token is set in axios headers for existing sessions
      const token = authService.getToken();
      if (token) {
        // Import and set token in api headers
        import('./services/api').then(({ default: api }) => {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('🔐 Token restored in axios headers');
        });
      }
      setIsAuthenticated(true);
    } else {
      console.log('❌ User is not authenticated, showing login form');
      // Clear any existing token if it's invalid
      authService.removeToken();
    }
  }, []);

  const handleAuthSuccess = () => {
    console.log('🎉 Authentication successful, switching to TaskList');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.removeToken();
    setIsAuthenticated(false);
    setShowLogin(true);
  };

  if (isAuthenticated) {
    return (
      <div className="App">
        <header className="app-header">
          <h1>Task Management System</h1>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </header>
        <TaskList />
      </div>
    );
  }

  return (
    <div className="App">
      {showLogin ? (
        <LoginForm
          onLoginSuccess={handleAuthSuccess}
          onSwitchToRegister={() => setShowLogin(false)}
        />
      ) : (
        <RegisterForm
          onRegisterSuccess={handleAuthSuccess}
          onSwitchToLogin={() => setShowLogin(true)}
        />
      )}
    </div>
  );
}

export default App;
