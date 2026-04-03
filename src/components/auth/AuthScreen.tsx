import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AuthScreen.module.css';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signIn') {
        const { error } = await signIn(email, password);
        if (error) throw error;
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        // Supabase might require email confirmation, you might want to show a message here
        setError('Check your email for a confirmation link!');
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authScreen}>
      <div className={styles.bgGlow} />
      <div className={styles.bgGlow2} />

      <div className={styles.container}>
        <div className={styles.branding}>
          <h1 className={styles.logo}>KAIROS</h1>
          <p className={styles.tagline}>See your life passing, beautifully.</p>
          <p className={styles.meaning}>
            /ˈkīräs/ — <em>the precise, critical, or opportune moment</em>
          </p>
        </div>

        <div className={styles.authCard}>
          <div className={styles.modeToggle}>
            <button
              className={`${styles.toggleBtn} ${mode === 'signIn' ? styles.active : ''}`}
              onClick={() => {
                setMode('signIn');
                setError(null);
              }}
            >
              Sign In
            </button>
            <button
              className={`${styles.toggleBtn} ${mode === 'signUp' ? styles.active : ''}`}
              onClick={() => {
                setMode('signUp');
                setError(null);
              }}
            >
              Sign Up
            </button>
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <form className={styles.formWrapper} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                className={styles.inputField}
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                className={styles.inputField}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? 'Processing...' : mode === 'signIn' ? 'Enter Kairos' : 'Create Account'}
            </button>
          </form>

          <div className={styles.authFooter}>
            {mode === 'signIn' ? (
              <p>
                Don&apos;t have an account?{' '}
                <button className={styles.linkBtn} onClick={() => setMode('signUp')}>
                  Sign up
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button className={styles.linkBtn} onClick={() => setMode('signIn')}>
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
