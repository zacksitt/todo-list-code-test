import React, { useState } from 'react';
import authService from '../services/authService';
import './AuthForms.css';

interface LoginFormProps {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await authService.login(formData);
      console.log('🔍 Login response:', response);
      console.log('🔍 Response data:', response.data);
      
      // The backend wraps responses in { status, message, data }
      const authData = response.data;
      console.log('🔍 Auth data:', authData);
      console.log('🔍 Auth token:', authData.token);
      
      authService.setToken(authData.token);
      onLoginSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <button type="submit" disabled={loading} className="auth-button">
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="auth-switch">
        <p>
          Don't have an account?{' '}
          <button type="button" onClick={onSwitchToRegister} className="switch-button">
            Register here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
