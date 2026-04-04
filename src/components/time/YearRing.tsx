import React, { useMemo } from 'react';
import { useTime } from '../../hooks/useTime';
import { useApp } from '../../contexts/AppContext';
import styles from './YearRing.module.css';

const YearRing: React.FC = () => {
  const { birthDate, lifeExpectancy } = useApp();
  const timeData = useTime(birthDate, lifeExpectancy);

  const { year, daysLeft, currentMonth } = useMemo(() => {
    const now = timeData.now;
    const year = now.getFullYear();
    const startOfNextYear = new Date(year + 1, 0, 1);
    const diffMs = startOfNextYear.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    
    return { 
      year, 
      daysLeft, 
      currentMonth: now.getMonth()
    };
  }, [timeData.now]);

  const labels = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];
  const segments = useMemo(() => {
    const r1 = 52; /* Increased radius */
    const r2 = 78;
    const items = [];
    const centerX = 90;
    const centerY = 90;

    for (let i = 0; i < 12; i++) {
      const angleStart = (i * 30) - 90 + 2;
      const angleEnd = ((i + 1) * 30) - 90 - 2;
      
      const x1 = centerX + r1 * Math.cos(angleStart * Math.PI / 180);
      const y1 = centerY + r1 * Math.sin(angleStart * Math.PI / 180);
      const x2 = centerX + r2 * Math.cos(angleStart * Math.PI / 180);
      const y2 = centerY + r2 * Math.sin(angleStart * Math.PI / 180);
      const x3 = centerX + r2 * Math.cos(angleEnd * Math.PI / 180);
      const y3 = centerY + r2 * Math.sin(angleEnd * Math.PI / 180);
      const x4 = centerX + r1 * Math.cos(angleEnd * Math.PI / 180);
      const y4 = centerY + r1 * Math.sin(angleEnd * Math.PI / 180);

      const path = `M ${x1} ${y1} L ${x2} ${y2} A ${r2} ${r2} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${r1} ${r1} 0 0 0 ${x1} ${y1} Z`;

      let fill = 'rgba(255, 255, 255, 0.15)'; // Increased visibility from 0.05
      if (i < currentMonth) fill = 'rgba(146, 110, 43, 0.6)';
      else if (i === currentMonth) fill = 'var(--gold)';

      // Label positioning
      const lR = 88;
      const lA = (i * 30) - 90 + 15;
      const lx = centerX + lR * Math.cos(lA * Math.PI / 180);
      const ly = centerY + lR * Math.sin(lA * Math.PI / 180);

      items.push({ path, fill, lx, ly, label: labels[i], isCurrent: i === currentMonth });
    }
    return items;
  }, [currentMonth]);

  return (
    <div className={styles.cleanWidget}>
      <div className={styles.cardTitle}>THIS YEAR</div>
      <div className={styles.yearRingWrap}>
        <svg className={styles.ringSvg} viewBox="0 0 180 180">
          {segments.map((seg, i) => (
            <React.Fragment key={i}>
              <path d={seg.path} fill={seg.fill} />
              <text
                x={seg.lx}
                y={seg.ly}
                className={`${styles.monthLabel} ${seg.isCurrent ? styles.currentMonthLabel : ''}`}
                textAnchor="middle"
                dominantBaseline="central"
              >
                {seg.label}
              </text>
            </React.Fragment>
          ))}
        </svg>
        <div className={styles.yearCenter}>
          <div className={styles.yearNum}>{year}</div>
          <div className={styles.yearDaysLeftBanner}>{daysLeft} days left</div>
        </div>
      </div>
    </div>
  );
};


export default YearRing;

