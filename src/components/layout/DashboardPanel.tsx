import React, { useState, useEffect } from 'react';
import { useApp } from '../../contexts/AppContext';
import { useTime } from '../../hooks/useTime';
import ProgressRing from '../time/ProgressRing';
import WeekBars from '../time/WeekBars';
import MonthGrid from '../time/MonthGrid';
import YearRing from '../time/YearRing';
import styles from './DashboardPanel.module.css';

const defaultQuotes: string[] = [
  "Stars can't shine without darkness",
  "Time is the most valuable thing you can spend",
  "Every moment is a fresh beginning",
  "The future depends on what you do today",
  "Progress, not perfection",
  "Small steps every day",
  "Your time is limited, don't waste it",
  "Today is a gift",
  "Make each day your masterpiece",
  "Time flies, but you're the pilot"
];

const DashboardPanel: React.FC = () => {
  const { username, birthDate, lifeExpectancy, setActivePanel } = useApp();
  const timeData = useTime(birthDate, lifeExpectancy);
  const [showQuote, setShowQuote] = useState<boolean>(false);
  const [currentQuote, setCurrentQuote] = useState<number>(0);

  // Quote rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setShowQuote(prev => !prev);
      if (showQuote) {
        setCurrentQuote(prev => (prev + 1) % defaultQuotes.length);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [showQuote]);

  // Hour markers: 00, 15, 30, 45
  const hourMarkers = [
    { position: 0, label: '00' },
    { position: 25, label: '15' },
    { position: 50, label: '30' },
    { position: 75, label: '45' }
  ];

  // Day markers: 00, 06, 12, 18
  const dayMarkers = [
    { position: 0, label: '00' },
    { position: 25, label: '06' },
    { position: 50, label: '12' },
    { position: 75, label: '18' }
  ];

  // Format time for HOUR ring (MM:SS) and DAY ring (HH:MM)
  const timeParts = timeData.time.split(':');
  const minSec = `${timeParts[1]}:${timeParts[2]}`;
  const hourMin = `${timeParts[0]}:${timeParts[1]}`;

  return (
    <div className={styles.panel}>
      {/* Clock Section */}
      <div 
        className={styles.clockSection} 
        onClick={() => setActivePanel('dashboard')}
        title="Return to Dashboard"
      >
        <div className={styles.digitalClock}>{timeData.time}</div>
        <div className={styles.dateStr}>{timeData.date}</div>
        <div className={styles.greetingContainer}>
          <div className={`${styles.greetingText} ${showQuote ? styles.quote : ''}`}>
            {showQuote ? defaultQuotes[currentQuote] : `${timeData.greeting}${username ? `, ${username}` : ''}`}
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className={styles.dashboardGrid}>
        {/* Hour Ring */}
        <ProgressRing
          percentage={timeData.hour.percentage}
          value={minSec}
          label="HOUR"
          showHand={true}
          timeMarkers={hourMarkers}
        />

        {/* Day Ring */}
        <ProgressRing
          percentage={timeData.day.percentage}
          value={hourMin}
          label="DAY"
          showHand={true}
          timeMarkers={dayMarkers}
        />

        {/* Week Bars */}
        <WeekBars timeData={timeData} />

        {/* Month Grid */}
        <MonthGrid />

        {/* Year Ring */}
        <YearRing />
      </div>
    </div>
  );
};


export default DashboardPanel;

