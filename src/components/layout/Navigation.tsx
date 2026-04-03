import React, { useState } from 'react';
import { UserButton, useUser } from '@clerk/react';
import { useApp } from '../../contexts/AppContext';
import styles from './Navigation.module.css';

const Navigation: React.FC = () => {
  const { activePanel, setActivePanel } = useApp();
  const { user } = useUser();
  const [isLogoHovered, setIsLogoHovered] = useState<boolean>(false);

  const displayName = user?.firstName || user?.username || '';

  const navItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: '⏰' },
    { id: 'todos', label: 'TODOS', icon: '✓' },
    { id: 'habits', label: 'HABITS', icon: '◉' },
    { id: 'notes', label: 'NOTES', icon: '📝' },
    { id: 'focus', label: 'FOCUS', icon: '⏱' },
  ];

  return (
    <nav className={styles.nav}>
      <div
        className={styles.navLogoGroup}
        onMouseEnter={() => setIsLogoHovered(true)}
        onMouseLeave={() => setIsLogoHovered(false)}
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
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        ))}
      </div>

      <div className={styles.navActions}>
        {displayName && <span className={styles.username}>Hi, {displayName}</span>}
        <UserButton
          appearance={{
            elements: {
              avatarBox: {
                width: '36px',
                height: '36px',
                border: '2px solid rgba(245, 166, 35, 0.3)',
              },
              userButtonPopoverCard: {
                backgroundColor: 'rgba(17, 19, 30, 0.95)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(245, 166, 35, 0.15)',
              },
            },
          }}
        />
      </div>
    </nav>
  );
};

export default Navigation;
