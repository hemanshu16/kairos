import React from 'react';
import { useApp } from '../../contexts/AppContext';
import Navigation from './Navigation';
import DashboardPanel from './DashboardPanel';
import TodoPanel from '../productivity/TodoPanel';
import HabitPanel from '../productivity/HabitPanel';
import NotesPanel from '../productivity/NotesPanel';
import FocusSetupModal from '../productivity/FocusSetupModal';
import FocusProgressModal from '../productivity/FocusProgressModal';
import SkyBackground from '../effects/SkyBackground';
import FABMenu from '../fab/FABMenu';
import StatsStrip from './StatsStrip';
import NotifyModal from '../productivity/NotifyModal';
import QuotesModal from '../productivity/QuotesModal';
import ThemesModal from '../productivity/ThemesModal';
import GlobalReminderPopup from '../productivity/GlobalReminderPopup';
import { useFocusManager } from '../../hooks/useFocusManager';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { activePanel, setActivePanel } = useApp();
  const { startSession, isRunning, timeLeft, session, stopSession, isBreak, breakTimeLeft, startBreak, endBreak } = useFocusManager();

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
      default:
        return <DashboardPanel />;
    }
  };

  return (
    <div className={styles.dashboard}>
      <SkyBackground />
      <Navigation />
      <main className={styles.main}>{renderPanel()}</main>
      
      {/* Modals */}
      
      {activePanel === 'focus' && (
        isRunning ? (
          <FocusProgressModal 
            task={session?.task || ''} 
            timeLeft={timeLeft} 
            isBreak={isBreak}
            breakTimeLeft={breakTimeLeft}
            onStartBreak={(mins: number) => startBreak(mins)}
            onEndBreak={endBreak}
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
               // Timer will immediately render because activePanel remains 'focus' and isRunning becomes true
            }} 
          />
        )
      )}

      {activePanel === 'notifications' && (
        <NotifyModal onClose={() => setActivePanel('dashboard')} />
      )}

      {activePanel === 'quotes' && (
        <QuotesModal onClose={() => setActivePanel('dashboard')} />
      )}

      {activePanel === 'themes' && (
        <ThemesModal onClose={() => setActivePanel('dashboard')} />
      )}

      <GlobalReminderPopup />
      <FABMenu />
      <StatsStrip />
    </div>
  );
};

export default Dashboard;
