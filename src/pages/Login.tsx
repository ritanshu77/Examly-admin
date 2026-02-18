import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { API_BASE_URL } from '../config';

const Login = () => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const isEmail = identifier.includes('@');
      const payload = isEmail
        ? { email: identifier, password }
        : { username: identifier, password };

      const res = await axios.post(`${API_BASE_URL}/admin/login`, payload);
      localStorage.setItem('admin_token', res.data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(res.data.admin));
      toast.success('Login successful');
      navigate('/');
    } catch (err: any) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader-container">
            <div className="loader-spinner" />
            <div>
              <div className="loader-text-title">Logging you in</div>
              <div className="loader-text-subtitle">Securely verifying admin credentials...</div>
            </div>
            <div className="loader-pulse-dot" />
          </div>
        </div>
      )}
      <div className="card login-card">
        <div className="login-header">
          <h2>Admin Login</h2>
          <p>Login with your email or username to manage exams.</p>
        </div>
        {error && <div className="alert alert-danger" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Email or Username</label>
            <input
              type="text"
              className="form-control"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            />
          </div>
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>Login</button>
        </form>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <Link to="/register">Register new admin</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
