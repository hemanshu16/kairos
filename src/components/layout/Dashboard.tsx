import React, { useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import Navigation from './Navigation';
import DashboardPanel from './DashboardPanel';
import TodoPanel from '../productivity/TodoPanel';
import HabitPanel from '../productivity/HabitPanel';
import NotesPanel from '../productivity/NotesPanel';
import FocusPanel from '../productivity/FocusPanel';
import Starfield from '../effects/Starfield';
import SunMoonOrb from '../effects/SunMoonOrb';
import FABMenu from '../fab/FABMenu';
import { getTheme, applyTheme, getTimeDecimal } from '../../utils/skyTheme';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { activePanel } = useApp();

  // Dynamic sky gradient effect
  useEffect(() => {
    const updateTheme = () => {
      const timeFloat = getTimeDecimal();
      const theme = getTheme(timeFloat);
      const customBg = localStorage.getItem('tc-custom-bg');
      applyTheme(theme, customBg);
    };

    updateTheme();
    const interval = setInterval(updateTheme, 50);
    return () => clearInterval(interval);
  }, []);

  const renderPanel = () => {
    switch (activePanel) {
      case 'dashboard':
        return <DashboardPanel />;
      case 'todos':
        return <TodoPanel />;
      case 'habits':
        return <HabitPanel />;
      case 'notes':
        return <NotesPanel />;
      case 'focus':
        return <FocusPanel />;
      default:
        return <DashboardPanel />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <Starfield />
      <SunMoonOrb />
      <Navigation />
      <main className={styles.main}>{renderPanel()}</main>
      <FABMenu />
    </div>
  );
};

export default Dashboard;
