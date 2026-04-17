import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import axios from 'axios';
import { UserRole } from '@crowza/shared';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { loginProvider } = useAuth();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'register') {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // Note: For real environment, call the backend Auth-Service 
        // to assign the MANAGER role and create user profile.
        loginProvider(await cred.user.getIdToken(), {
          id: cred.user.uid,
          firebaseUid: cred.user.uid,
          email: email,
          displayName: name,
          role: UserRole.MANAGER, // Default newly registered user as MANAGER
        });
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        // Mock token validation against auth-service
        loginProvider(await cred.user.getIdToken(), {
          id: cred.user.uid,
          firebaseUid: cred.user.uid,
          email: email,
          role: UserRole.MANAGER, 
        });
      }
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper flex items-center justify-center">
      <div className="ambient-glow glow-1 animate-pulse-slow"></div>
      
      <div className="card-glass auth-card animate-fade-in">
        <div className="text-center mb-8">
          <div className="auth-logo mx-auto mb-4"></div>
          <h2>{mode === 'login' ? 'System Authorization' : 'Initialize Command Account'}</h2>
          <p className="text-muted mt-4">
            {mode === 'login' 
              ? 'Enter credentials to access the Organizer Command Hub.' 
              : 'Register your organization to deploy real-time management.'}
          </p>
        </div>

        {error && (
          <div className="error-box mb-4">
            <p className="text-error text-sm font-semibold">{error}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="flex-col gap-4">
          {mode === 'register' && (
            <div className="input-group">
              <label className="input-label">Organizer Name</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="HQ Command" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                required 
              />
            </div>
          )}

          <div className="input-group">
            <label className="input-label">Terminal Email</label>
            <input 
              type="email" 
              className="input-field" 
              placeholder="commander@venue.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="input-group">
            <label className="input-label">Access Code (Password)</label>
            <input 
              type="password" 
              className="input-field" 
              placeholder="••••••••" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary mt-4" disabled={loading}>
            {loading ? 'PROCESSING...' : mode === 'login' ? 'AUTHORIZE' : 'INITIALIZE ACCOUNT'}
          </button>
        </form>

        <div className="text-center mt-8 cursor-pointer" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
          <p className="text-secondary text-sm font-semibold">
            {mode === 'login' ? "NO ACCOUNT? REGISTER HERE" : "RETURNING COMMANDER? SIGN IN"}
          </p>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .auth-wrapper {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 24px;
        }

        .auth-card {
          width: 100%;
          max-width: 480px;
          padding: 48px 32px;
        }

        .auth-logo {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
          box-shadow: 0 0 20px var(--color-secondary-glow);
        }

        .error-box {
          background: rgba(255, 23, 68, 0.1);
          border: 1px solid rgba(255, 23, 68, 0.3);
          padding: 12px;
          border-radius: var(--border-radius-sm);
        }

        .cursor-pointer { cursor: pointer; }
      `}} />
    </div>
  );
};

export default AuthPage;
