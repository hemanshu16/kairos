import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './AuthScreen.module.css';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp, signInWithGoogle } = useAuth();

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

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
    } catch (err: any) {
      setError(err.message || 'An error occurred during Google authentication');
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

          <button 
            className={styles.googleBtn} 
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className={styles.googleIcon} viewBox="0 0 24 24">
              <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="currentColor" d="M5.84 14.1c-.22-.66-.35-1.39-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94L5.84 14.1z"/>
              <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            Continue with Google
          </button>

          <div className={styles.divider}>
            <div className={styles.dividerLine} />
            <span className={styles.dividerText}>or continue with email</span>
            <div className={styles.dividerLine} />
          </div>

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
