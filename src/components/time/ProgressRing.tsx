import React from 'react';
import styles from './ProgressRing.module.css';

interface TimeMarker {
  position: number;
  label: string;
}

export interface ProgressRingProps {
  percentage: number;
  value: string;
  label: string;
  size?: number;
  showHand?: boolean;
  timeMarkers?: TimeMarker[] | null;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ percentage, value, label, size = 175, showHand = false, timeMarkers = null }) => {
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  // Calculate hand angle (percentage to degrees, -90 to start from top)
  const handAngle = (percentage * 3.6) - 90;
  const handLength = radius * 0.6;
  const handX = size / 2 + Math.cos((handAngle * Math.PI) / 180) * handLength;
  const handY = size / 2 + Math.sin((handAngle * Math.PI) / 180) * handLength;

  // Small dot at end of progress arc
  const dotAngle = (percentage * 3.6) - 90;
  const dotRadius = radius;
  const dotX = size / 2 + Math.cos((dotAngle * Math.PI) / 180) * dotRadius;
  const dotY = size / 2 + Math.sin((dotAngle * Math.PI) / 180) * dotRadius;

  const centerRadius = radius * 0.58;

  return (
    <div className={styles.widget}>
      <div className={styles.ringWrap} style={{ width: size, height: size }}>
        <svg width={size} height={size}>
          {/* Background circle (track) */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--gold)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />

          {/* Small progress indicator dot */}
          <circle
            cx={dotX}
            cy={dotY}
            r="4"
            fill="var(--gold)"
            className={styles.progressDot}
          />

          {/* Time markers */}
          {timeMarkers && timeMarkers.map((marker, index) => {
            const angle = (marker.position * 3.6) - 90;
            const markerRadius = radius + 16;
            const mx = size / 2 + Math.cos((angle * Math.PI) / 180) * markerRadius;
            const my = size / 2 + Math.sin((angle * Math.PI) / 180) * markerRadius;

            return (
              <text
                key={index}
                x={mx}
                y={my}
                textAnchor="middle"
                dominantBaseline="middle"
                className={styles.marker}
              >
                {marker.label}
              </text>
            );
          })}

          {/* Analog clock hand */}
          {showHand && (
            <>
              <line
                x1={size / 2}
                y1={size / 2}
                x2={handX}
                y2={handY}
                stroke="var(--gold)"
                strokeWidth="2"
                strokeLinecap="round"
                className={styles.hand}
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r="3"
                fill="var(--gold)"
              />
            </>
          )}

          {/* Dark center circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={centerRadius}
            fill="rgba(20, 22, 35, 0.92)"
            stroke="rgba(255, 255, 255, 0.06)"
            strokeWidth="1"
          />
        </svg>
        <div className={styles.ringCenter}>
          <div className={styles.ringTime}>{value}</div>
          <div className={styles.ringLabel}>{label}</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressRing;
