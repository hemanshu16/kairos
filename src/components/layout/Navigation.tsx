import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  const { activePanel, setActivePanel } = useApp();
  const { user, signOut } = useAuth();
  const [isLogoHovered, setIsLogoHovered] = useState<boolean>(false);

  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || '';

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (err) {
      console.error('Error signing out:', err);
    }
  };

  const navItems = [
    { 
      id: 'dashboard', 
      label: 'HOME', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    { 
      id: 'todos', 
      label: 'TODO', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
        </svg>
      )
    },
    { 
      id: 'habits', 
      label: 'HABITS', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
        </svg>
      )
    },
    { 
      id: 'notes', 
      label: 'NOTES', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      )
    },
    { 
      id: 'analysis', 
      label: 'ANALYSIS', 
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M3 3v18h18" />
          <path d="M18 9l-5 5-3-3-4 4" />
        </svg>
      )
    },
  ];

  return (
    <nav className={styles.nav}>
      <div
        className={styles.navLogoGroup}
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => setIsLogoHovered(false)}
        onClick={() => setActivePanel('dashboard')}
      >
        <div className={styles.navBrand}>KAIROS</div>
        <div className={styles.navMeaning}>
          {isLogoHovered ? '/ˈkīräs/ • the precise, critical, or opportune moment' : 'Master your time'}
        </div>
      </div>

      <div className={styles.navLinks}>
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`${styles.navTab} ${activePanel === item.id ? styles.active : ''}`}
            onClick={() => setActivePanel(item.id)}
          >
            {item.icon}
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.navActions}>
        <div className={styles.tzSelector}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
          <span>Local Time</span>
        </div>
        
        <button className={styles.proBtn}>LIFETIME PRO</button>

        {displayName && <span className={styles.username}>Hi, {displayName}</span>}
        <button className={styles.logoutBtn} onClick={handleSignOut}>
          LOGOUT
        </button>
      </div>
    </nav>
  );
};

export default Navigation;

