import React from 'react';
import styles from './FABMenu.module.css';

interface FABButton {
  id: string;
  icon: string;
  title: string;
  active?: boolean;
}

const FABMenu: React.FC = () => {
  const fabButtons: FABButton[] = [
    { id: 'clock', icon: '⏰', title: 'Dashboard', active: true },
    { id: 'focus', icon: '⏱', title: 'Focus Timer' },
    { id: 'bell', icon: '🔔', title: 'Reminders' },
    { id: 'music', icon: '🎵', title: 'Ambient Music' },
    { id: 'quotes', icon: '💬', title: 'Quotes' },
    { id: 'themes', icon: '🎨', title: 'Themes' },
  ];

  return (
    <div className={styles.fabBar}>
      {fabButtons.map((button) => (
        <button
          key={button.id}
          className={`${styles.fabButton} ${button.active ? styles.active : ''}`}
          title={button.title}
        >
          <span className={styles.fabIcon}>{button.icon}</span>
        </button>
      ))}
    </div>
  );
};

export default FABMenu;
