import React, { useState } from 'react';
import { SignIn, SignUp } from '@clerk/react';
import styles from './AuthScreen.module.css';

const AuthScreen: React.FC = () => {
  const [mode, setMode] = useState<string>('signIn'); // 'signIn' or 'signUp'

  return (
    <div className={styles.authScreen}>
      {/* Background effects */}
      <div className={styles.bgGlow} />
      <div className={styles.bgGlow2} />

      <div className={styles.container}>
        {/* Branding */}
        <div className={styles.branding}>
          <h1 className={styles.logo}>KAIROS</h1>
          <p className={styles.tagline}>See your life passing, beautifully.</p>
          <p className={styles.meaning}>
            /ˈkīräs/ — <em>the precise, critical, or opportune moment</em>
          </p>
        </div>

        {/* Auth Card */}
        <div className={styles.authCard}>
          {/* Mode Toggle */}
          <div className={styles.modeToggle}>
            <button
              className={`${styles.toggleBtn} ${mode === 'signIn' ? styles.active : ''}`}
              onClick={() => setMode('signIn')}
            >
              Sign In
            </button>
            <button
              className={`${styles.toggleBtn} ${mode === 'signUp' ? styles.active : ''}`}
              onClick={() => setMode('signUp')}
            >
              Sign Up
            </button>
          </div>

          {/* Clerk Components */}
          <div className={styles.clerkWrapper}>
            {mode === 'signIn' ? (
              <SignIn
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: { width: '100%' },
                    card: {
                      boxShadow: 'none',
                      border: 'none',
                      backgroundColor: 'transparent',
                      width: '100%',
                    },
                    header: { display: 'none' },
                    footer: { display: 'none' },
                  },
                }}
              />
            ) : (
              <SignUp
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: { width: '100%' },
                    card: {
                      boxShadow: 'none',
                      border: 'none',
                      backgroundColor: 'transparent',
                      width: '100%',
                    },
                    header: { display: 'none' },
                    footer: { display: 'none' },
                  },
                }}
              />
            )}
          </div>

          {/* Footer toggle */}
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
