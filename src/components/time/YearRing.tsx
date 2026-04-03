import React, { useMemo } from 'react';
import styles from './YearRing.module.css';

interface YearSegment {
  month: string;
  startAngle: number;
  endAngle: number;
  isPast: boolean;
  isCurrent: boolean;
}

const YearRing: React.FC = () => {
  const { segments, year, daysLeft } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const year = now.getFullYear();

    // Calculate days left in year
    const startOfNextYear = new Date(year + 1, 0, 1);
    const diffMs = startOfNextYear.getTime() - now.getTime();
    const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const monthNames = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

    const segments: YearSegment[] = monthNames.map((month, index) => {
      const startAngle = (index * 30 - 90) * (Math.PI / 180);
      const endAngle = ((index + 1) * 30 - 90) * (Math.PI / 180);

      return {
        month,
        startAngle,
        endAngle,
        isPast: index < currentMonth,
        isCurrent: index === currentMonth
      };
    });

    return { segments, year, daysLeft };
  }, []);

  const cx = 100;
  const cy = 100;
  const innerRadius = 65;
  const outerRadius = 88;
  const labelRadius = 96;

  // Generate SVG path for each segment
  const createSegmentPath = (startAngle: number, endAngle: number, ir: number, or: number) => {
    const x1 = cx + Math.cos(startAngle) * ir;
    const y1 = cy + Math.sin(startAngle) * ir;
    const x2 = cx + Math.cos(endAngle) * ir;
    const y2 = cy + Math.sin(endAngle) * ir;
    const x3 = cx + Math.cos(endAngle) * or;
    const y3 = cy + Math.sin(endAngle) * or;
    const x4 = cx + Math.cos(startAngle) * or;
    const y4 = cy + Math.sin(startAngle) * or;

    return `M ${x1} ${y1} A ${ir} ${ir} 0 0 1 ${x2} ${y2} L ${x3} ${y3} A ${or} ${or} 0 0 0 ${x4} ${y4} Z`;
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>THIS YEAR</div>
      <div className={styles.yearRingWrap}>
        <svg className={styles.ring} viewBox="0 0 200 200" width="200" height="200">
          {segments.map((segment, index) => (
            <g key={index}>
              <path
                d={createSegmentPath(segment.startAngle, segment.endAngle, innerRadius, outerRadius)}
                fill={segment.isPast ? '#926E2B' : segment.isCurrent ? '#f5a623' : 'rgba(245, 166, 35, 0.1)'}
                stroke="rgba(245, 166, 35, 0.15)"
                strokeWidth="1"
                className={`${styles.segment} ${segment.isCurrent ? styles.current : ''}`}
              />
              {/* Month label outside the ring */}
              <text
                x={cx + Math.cos((segment.startAngle + segment.endAngle) / 2) * labelRadius}
                y={cy + Math.sin((segment.startAngle + segment.endAngle) / 2) * labelRadius}
                className={`${styles.monthLabel} ${segment.isCurrent ? styles.currentLabel : ''}`}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {segment.month}
              </text>
            </g>
          ))}
          {/* Inner circle border */}
          <circle cx={cx} cy={cy} r={innerRadius} fill="transparent" stroke="rgba(245, 166, 35, 0.12)" strokeWidth="1" />
        </svg>
        {/* Center content: Year + Days Left */}
        <div className={styles.yearCenter}>
          <div className={styles.yearNum}>{year}</div>
          <div className={styles.yearDaysLeft}>{daysLeft} days left</div>
        </div>
      </div>
    </div>
  );
};

export default YearRing;
