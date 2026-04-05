import React, { useMemo, useState, useEffect } from 'react';
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

const CLOUD_DESIGNS = [
  {
    path: "M25,60 Q35,45 50,45 Q65,45 75,55 Q85,45 100,45 Q115,45 125,60 Q135,65 135,75 Q135,85 125,90 L25,90 Q15,85 15,75 Q15,65 25,60 Z",
    highlight: "M30,60 Q40,50 50,50 Q60,50 70,55 Q80,50 95,50 Q110,50 120,60"
  },
  {
    path: "M10,80 Q20,60 40,60 Q55,60 65,70 Q75,55 95,55 Q115,55 125,75 Q140,80 140,95 L10,95 Z",
    highlight: "M20,70 Q30,65 40,65 Q50,65 60,70 Q70,60 90,60 Q110,60 120,70"
  },
  {
    path: "M30,50 Q45,30 65,35 Q80,20 105,30 Q130,20 150,45 Q165,60 155,85 L30,85 Z",
    highlight: "M40,45 Q55,35 65,40 Q75,25 100,35 Q120,25 140,45"
  }
];

const Clouds: React.FC<CloudsProps> = ({ timeFloat }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: PointerEvent) => {
      const nx = (e.clientX / window.innerWidth) - 0.5;
      const ny = (e.clientY / window.innerHeight) - 0.5;
      setMousePos({ x: nx, y: ny });
    };
    window.addEventListener('pointermove', handleMouseMove);
    return () => window.removeEventListener('pointermove', handleMouseMove);
  }, []);

  const clouds = useMemo<CloudConfig[]>(() => {
    return Array.from({ length: 18 }, (_, i) => ({
      id: i,
      top: `${2 + Math.random() * 33}%`,
      left: `${-10 + Math.random() * 120}%`,
      scale: 0.5 + Math.random() * 1.5,
      speed: i % 3 === 0 ? 'fast' : i % 3 === 1 ? 'medium' : 'slow',
      delay: `${-(Math.random() * 120)}s`,
      type: i % 3
    }));
  }, []);

  const appearance = useMemo(() => {
    if (timeFloat < 5) return { color: '#1a1f35', highlight: '#2a314d', opacity: 0.05, blur: '10px' };
    if (timeFloat < 7.5) {
      const t = (timeFloat - 5) / 2.5;
      return { 
        color: `rgb(${Math.round(26 + (255-26)*t)}, ${Math.round(31 + (224-31)*t)}, ${Math.round(53 + (163-53)*t)})`, 
        highlight: `rgba(255, 255, 255, ${0.1 + 0.5 * t})`,
        opacity: 0.1 + 0.3 * t,
        blur: `${10 - 6*t}px`
      };
    }
    if (timeFloat < 16.5) {
      return { color: '#ffffff', highlight: 'rgba(255, 255, 255, 0.8)', opacity: 0.45, blur: '3px' };
    }
    if (timeFloat < 19.5) {
      const t = (timeFloat - 16.5) / 3;
      return { 
        color: `rgb(${Math.round(255 - (255-110)*t)}, ${Math.round(255 - (255-40)*t)}, ${Math.round(255 - (255-90)*t)})`, 
        highlight: `rgba(255, 200, 150, ${0.8 - 0.4 * t})`,
        opacity: 0.45 - 0.25 * t,
        blur: `${3 + 5*t}px`
      };
    }
    return { color: '#1a1f35', highlight: '#2a314d', opacity: 0.05, blur: '10px' };
  }, [timeFloat]);

  return (
    <div className={styles.cloudsContainer}>
      {clouds.map((cloud) => {
        const px = mousePos.x * 70 * cloud.scale;
        const py = -mousePos.y * 50 * cloud.scale;
        const rotate = mousePos.x * 12; 

        return (
          <div 
            key={cloud.id}
            className={`${styles.cloudWrapper} ${styles[`speed-${cloud.speed}`]}`}
            style={{ 
              top: cloud.top, 
              left: cloud.left,
              zIndex: 10 + cloud.id,
              animationDelay: cloud.delay,
              transform: `scale(${cloud.scale}) translate3d(${px}px, ${py}px, 0) rotateY(${rotate}deg)`
            }}
          >
            <svg 
              width="250" 
              height="150" 
              viewBox="0 0 250 150" 
              className={styles.cloud}
              style={{ 
                fill: appearance.color,
                opacity: appearance.opacity,
                filter: `blur(${appearance.blur})`,
                transition: 'fill 0.5s ease'
              }}
            >
              <path d={CLOUD_DESIGNS[cloud.type].path} />
              <path 
                d={CLOUD_DESIGNS[cloud.type].highlight} 
                fill="none" 
                stroke={appearance.highlight} 
                strokeWidth="4" 
                strokeLinecap="round" 
                opacity="0.6"
              />
            </svg>
          </div>
        );
      })}
    </div>
  );
};

export default Clouds;
