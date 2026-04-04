import React from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './FABMenu.module.css';

const FABMenu: React.FC = () => {
  const { setActivePanel } = useApp();

  const fabItems = [
    {
      id: 'focus',
      label: 'Focus',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      )
    },
    {
      id: 'notifications',
      label: 'Notify',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      )
    },
    {
      id: 'music',
      label: 'Music',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18V5l12-2v13" />
          <circle cx="6" cy="18" r="3" />
          <circle cx="18" cy="16" r="3" />
        </svg>
      )
    },
    {
      id: 'quotes',
      label: 'Quotes',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 2.5 1 4 3 6M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 2.5 1 4 3 6" />
        </svg>
      )
    },
    {
      id: 'themes',
      label: 'Themes',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="3" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      )
    }
  ];

  return (
    <div className={styles.fabArea}>
      <div className={styles.fabGroup}>
        {fabItems.map((item) => (
          <button
            key={item.id}
            className={styles.fabBtn}
            onClick={() => setActivePanel(item.id as any)}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default FABMenu;

