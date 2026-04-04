import React, { useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import Navigation from './Navigation';
import DashboardPanel from './DashboardPanel';
import TodoPanel from '../productivity/TodoPanel';
import HabitPanel from '../productivity/HabitPanel';
import NotesPanel from '../productivity/NotesPanel';
import WorklogModal from '../productivity/WorklogModal';
import FocusSetupModal from '../productivity/FocusSetupModal';
import FocusProgressModal from '../productivity/FocusProgressModal';
import Starfield from '../effects/Starfield';
import SunMoonOrb from '../effects/SunMoonOrb';
import FABMenu from '../fab/FABMenu';
import StatsStrip from './StatsStrip';
import NotifyModal from '../productivity/NotifyModal';
import MusicModal from '../productivity/MusicModal';
import { getTheme, applyTheme, getTimeDecimal } from '../../utils/skyTheme';
import { useFocusManager } from '../../hooks/useFocusManager';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { activePanel, setActivePanel } = useApp();
  const { startSession, isRunning, timeLeft, session, stopSession } = useFocusManager();

  // Dynamic sky gradient effect
  useEffect(() => {
    const updateTheme = () => {
      const timeFloat = getTimeDecimal();
      const theme = getTheme(timeFloat);
      const customBg = localStorage.getItem('tc-custom-bg');
      applyTheme(theme, customBg);
    };

    updateTheme();
    const interval = setInterval(updateTheme, 1000); // Check once per second
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
      case 'worklog':
      case 'focus':
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
      
      {/* Modals */}
      {activePanel === 'worklog' && (
        <WorklogModal onClose={() => setActivePanel('dashboard')} />
      )}
      
      {activePanel === 'focus' && (
        isRunning ? (
          <FocusProgressModal 
            task={session?.task || ''} 
            timeLeft={timeLeft} 
            onClose={() => setActivePanel('dashboard')} 
            onStop={() => {
              stopSession();
              setActivePanel('dashboard');
            }}
          />
        ) : (
          <FocusSetupModal 
            onClose={() => setActivePanel('dashboard')} 
            onStart={(dur, prompt, task) => {
               startSession(dur, prompt, task);
               setActivePanel('dashboard');
            }} 
          />
        )
      )}

      {activePanel === 'notifications' && (
        <NotifyModal onClose={() => setActivePanel('dashboard')} />
      )}

      {activePanel === 'music' && (
        <MusicModal onClose={() => setActivePanel('dashboard')} />
      )}

      <FABMenu />
      <StatsStrip />
    </div>
  );
};

export default Dashboard;
