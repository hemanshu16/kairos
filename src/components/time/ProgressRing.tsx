import React from 'react';
import styles from './ProgressRing.module.css';

interface TimeMarker {
  position: number;
  label: string;
  title?: string;
}

export interface ProgressRingProps {
  percentage: number;
  value: string;
  label: string;
  title?: string;
  size?: number;
  showHand?: boolean;
  timeMarkers?: TimeMarker[] | null;
}

const ProgressRing: React.FC<ProgressRingProps> = ({ percentage, value, label, title, size = 175, showHand = false, timeMarkers = null }) => {
  // We'll use a fixed internal coordinate system (140x140) to match the HTML design
  // but scale the outer container using 'size' prop.
  const radius = 42;
  const circumference = 2 * Math.PI * radius; // ~263.89
  const offset = circumference - (percentage / 100) * circumference;

  // Calculate hand angle (percentage to degrees, -90 to start from top)
  const handAngle = (percentage * 3.6) - 90;
  const handLength = 35;
  const handX = 70 + Math.cos((handAngle * Math.PI) / 180) * handLength;
  const handY = 70 + Math.sin((handAngle * Math.PI) / 180) * handLength;

  // Knob position at the end of the progress arc (radius 42)
  const knobRadius = 42;
  const knobX = 70 + Math.cos((handAngle * Math.PI) / 180) * knobRadius;
  const knobY = 70 + Math.sin((handAngle * Math.PI) / 180) * knobRadius;

  return (
    <div className={styles.cleanWidget}>
      {title && <div className={styles.cardTitle}>{title}</div>}
      <div className={styles.ringWrap} style={{ width: size, height: size }}>
        <svg viewBox="0 0 140 140" className={styles.svg}>
          {/* Tick marks */}
          <g stroke="rgba(255, 255, 255, 0.15)" strokeWidth="2">
            <line x1="70" y1="36" x2="70" y2="40" />
            <line x1="70" y1="104" x2="70" y2="100" />
            <line x1="36" y1="70" x2="40" y2="70" />
            <line x1="104" y1="70" x2="100" y2="70" />
          </g>

          {/* Labels */}
          {timeMarkers && (
            <g className={styles.markerGroup}>
              {timeMarkers.map((marker, idx) => {
                // Hardcoded positions based on the 4 cardinal points for exact match
                let x = 70, y = 70;
                if (idx === 0) { x = 70; y = 16; } // Top
                if (idx === 1) { x = 126; y = 74; } // Right
                if (idx === 2) { x = 70; y = 132; } // Bottom
                if (idx === 3) { x = 14; y = 74; } // Left

                return (
                  <text
                    key={idx}
                    x={x}
                    y={y}
                    textAnchor="middle"
                  >
                    {marker.label}
                  </text>
                );
              })}
            </g>
          )}

          {/* Background circle (track) */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth="5"
          />

          {/* Progress circle */}
          <circle
            cx="70"
            cy="70"
            r={radius}
            fill="none"
            stroke="#f5a623"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />

          {/* Analog clock hand & moving knob */}
          {showHand && (
            <>
              <line
                x1="70"
                y1="70"
                x2={handX}
                y2={handY}
                stroke="rgba(245, 166, 35, 0.8)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <circle r="4" fill="#fff" cx={knobX} cy={knobY} />
            </>
          )}
        </svg>


        {/* The center display */}
        <div className={styles.centerDisc}>
          <div className={styles.ringTime}>{value}</div>
          <div className={styles.ringLabel}>{label}</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressRing;

