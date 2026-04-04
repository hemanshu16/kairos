import React, { useMemo } from 'react';
import styles from './Clouds.module.css';

interface CloudConfig {
  id: number;
  top: string;
  left: string;
  scale: number;
  speed: 'slow' | 'medium' | 'fast';
  delay: string;
  type: number;
}

interface CloudsProps {
  timeFloat: number;
}

// Simple fluffy cloud SVG paths
const CLOUD_PATHS = [
  "M25,60 Q35,45 50,45 Q65,45 75,55 Q85,45 100,45 Q115,45 125,60 Q135,65 135,75 Q135,85 125,90 L25,90 Q15,85 15,75 Q15,65 25,60 Z",
  "M10,80 Q20,60 40,60 Q55,60 65,70 Q75,55 95,55 Q115,55 125,75 Q140,80 140,95 L10,95 Z",
  "M30,50 Q45,30 65,35 Q80,20 105,30 Q130,20 150,45 Q165,60 155,85 L30,85 Z"
];

const Clouds: React.FC<CloudsProps> = ({ timeFloat }) => {
  // Generate random clouds once
  const clouds = useMemo<CloudConfig[]>(() => {
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      top: `${10 + Math.random() * 60}%`, // 10% to 70% height
      left: `${Math.random() * 100}%`,
      scale: 0.5 + Math.random() * 1.5,
      speed: i % 3 === 0 ? 'fast' : i % 3 === 1 ? 'medium' : 'slow',
      delay: `${-(Math.random() * 120)}s`, // Negative delay so they start at different positions
      type: i % 3
    }));
  }, []);

  // Determine cloud appearance based on time
  const appearance = useMemo(() => {
    // Midnight to Dawn
    if (timeFloat < 5) return { color: '#1a1f35', opacity: 0.05, blur: '10px' };
    
    // Sunrise
    if (timeFloat < 7.5) {
      const t = (timeFloat - 5) / 2.5;
      return { 
        color: `rgb(${Math.round(26 + (255-26)*t)}, ${Math.round(31 + (224-31)*t)}, ${Math.round(53 + (163-53)*t)})`, 
        opacity: 0.05 + 0.3 * t,
        blur: `${10 - 6*t}px`
      };
    }
    
    // Day / Peak Glare (10h to 16h)
    if (timeFloat < 16.5) {
      if (timeFloat >= 11 && timeFloat <= 14.5) {
        // Peak solar intensity: whiter and more "washed out"
        return { color: '#ffffff', opacity: 0.35, blur: '4px' };
      }
      return { color: '#ffffff', opacity: 0.45, blur: '3px' };
    }
    
    // Sunset
    if (timeFloat < 19.5) {
      const t = (timeFloat - 16.5) / 3;
      return { 
        color: `rgb(${Math.round(255 - (255-110)*t)}, ${Math.round(255 - (255-40)*t)}, ${Math.round(255 - (255-90)*t)})`, 
        opacity: 0.45 - 0.25 * t,
        blur: `${3 + 5*t}px`
      };
    }
    
    // Nightfall
    if (timeFloat < 21) {
      const t = (timeFloat - 19.5) / 1.5;
      return { color: '#1a1f35', opacity: 0.2 - 0.15 * t, blur: '10px' };
    }
    
    return { color: '#1a1f35', opacity: 0.05, blur: '10px' };
  }, [timeFloat]);

  return (
    <div className={styles.cloudsContainer}>
      {clouds.map((cloud) => (
        <div 
          key={cloud.id}
          className={`${styles.cloudWrapper} ${styles[`speed-${cloud.speed}`]}`}
          style={{ 
            top: cloud.top, 
            left: cloud.left,
            animationDelay: cloud.delay,
            transform: `scale(${cloud.scale})`
          }}
        >
          <svg 
            width="200" 
            height="120" 
            viewBox="0 0 200 120" 
            className={`${styles.cloud} ${styles.floating}`}
            style={{ 
              animationDelay: `${-(cloud.id * 0.5)}s`,
              fill: appearance.color,
              opacity: appearance.opacity,
              filter: `blur(${appearance.blur})`
            }}
          >
            <path d={CLOUD_PATHS[cloud.type]} />
          </svg>
        </div>
      ))}
    </div>
  );
};

export default Clouds;
