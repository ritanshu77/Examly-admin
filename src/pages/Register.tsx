import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config';

const Register = () => {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [usernameSuggestions, setUsernameSuggestions] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const value = username.trim();
    if (!value) {
      setUsernameStatus('idle');
      setUsernameSuggestions([]);
      return;
    }
    if (value.length < 3) {
      setUsernameStatus('idle');
      setUsernameSuggestions([]);
      return;
    }

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        setUsernameStatus('checking');
        const res = await axios.get(`${API_BASE_URL}/admin/username/check`, {
          params: { username: value },
          signal: controller.signal,
        });
        if (res.data.available) {
          setUsernameStatus('available');
          setUsernameSuggestions([]);
        } else {
          setUsernameStatus('taken');
          setUsernameSuggestions(res.data.suggestions || []);
        }
      } catch (err) {
        if ((err as any)?.name !== 'CanceledError') {
          setUsernameStatus('idle');
        }
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [username]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!username) {
        setError('Username is required');
        return;
      }
      if (usernameStatus === 'taken') {
        setError('Please choose a different username');
        return;
      }
      await axios.post(`${API_BASE_URL}/admin/register`, { name, username, email, password });
      alert('Registration successful! Please login.');
      navigate('/login');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="login-page">
      <div className="card login-card" style={{ maxWidth: '460px' }}>
        <div className="login-header">
          <h2>Admin Register</h2>
          <p>Create an admin account with email and optional username.</p>
        </div>
        {error && <div className="alert alert-danger" style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        <form onSubmit={handleRegister}>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            />
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setUsernameStatus(e.target.value ? 'checking' : 'idle');
              }}
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            />
            {username && (
              <div style={{ marginTop: '6px', fontSize: '0.8rem' }}>
                {usernameStatus === 'checking' && <span style={{ color: '#6b7280' }}>Checking availability...</span>}
                {usernameStatus === 'available' && <span style={{ color: '#16a34a' }}>Username is available</span>}
                {usernameStatus === 'taken' && <span style={{ color: '#dc2626' }}>Username already taken</span>}
              </div>
            )}
            {usernameSuggestions.length > 0 && usernameStatus === 'taken' && (
              <div style={{ marginTop: '8px', fontSize: '0.8rem' }}>
                <span style={{ display: 'block', marginBottom: '4px', color: '#6b7280' }}>Suggestions:</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {usernameSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => {
                        setUsername(s);
                        setUsernameStatus('checking');
                      }}
                      style={{
                        borderRadius: '999px',
                        border: '1px solid #e5e7eb',
                        padding: '4px 10px',
                        background: '#f9fafb',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>Register</button>
        </form>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
          <Link to="/login">Already have an account? Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
