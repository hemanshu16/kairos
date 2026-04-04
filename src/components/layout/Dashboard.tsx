import React, { useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import Navigation from './Navigation';
import DashboardPanel from './DashboardPanel';
import TodoPanel from '../productivity/TodoPanel';
import HabitPanel from '../productivity/HabitPanel';
import NotesPanel from '../productivity/NotesPanel';
import FocusSetupModal from '../productivity/FocusSetupModal';
import FocusProgressModal from '../productivity/FocusProgressModal';
import Starfield from '../effects/Starfield';
import SunMoonOrb from '../effects/SunMoonOrb';
import Clouds from '../effects/Clouds';
import FABMenu from '../fab/FABMenu';
import StatsStrip from './StatsStrip';
import NotifyModal from '../productivity/NotifyModal';
import MusicianModal from '../productivity/MusicModal';
import QuotesModal from '../productivity/QuotesModal';
import ThemesModal from '../productivity/ThemesModal';
import GlobalReminderPopup from '../productivity/GlobalReminderPopup';
import { getTheme, applyTheme, getTimeDecimal } from '../../utils/skyTheme';
import { getZonedTime } from '../../utils/timeUtils';
import { useFocusManager } from '../../hooks/useFocusManager';
import styles from './Dashboard.module.css';

const Dashboard: React.FC = () => {
  const { activePanel, setActivePanel, timezone, customBg } = useApp();
  const { startSession, isRunning, timeLeft, session, stopSession, isBreak, breakTimeLeft, startBreak, endBreak } = useFocusManager();
  const [timeFloat, setTimeFloat] = React.useState(() => getTimeDecimal(getZonedTime(timezone)));

  // Dynamic sky gradient effect
  useEffect(() => {
    const updateTheme = () => {
      const currentZonedTime = getZonedTime(timezone);
      const newTimeFloat = getTimeDecimal(currentZonedTime);
      setTimeFloat(newTimeFloat);
      
      const theme = getTheme(newTimeFloat);
      applyTheme(theme, customBg);
    };

    updateTheme();
    const interval = setInterval(updateTheme, 1000); // Check once per second
    return () => clearInterval(interval);
  }, [timezone, customBg]);

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
      <Starfield timeFloat={timeFloat} />
      <Clouds timeFloat={timeFloat} />
      <SunMoonOrb timeFloat={timeFloat} />
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

      {activePanel === 'music' && (
        <MusicianModal onClose={() => setActivePanel('dashboard')} />
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
