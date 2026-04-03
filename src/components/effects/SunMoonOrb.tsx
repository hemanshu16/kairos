import React, { useEffect, useState } from 'react';
import { getTimeDecimal } from '../../utils/skyTheme';
import styles from './SunMoonOrb.module.css';

interface Position {
  left: string;
  top: string;
}

interface OrbStyle {
  background?: string;
  boxShadow?: string;
  opacity?: number;
}

const SunMoonOrb: React.FC = () => {
  const [position, setPosition] = useState<Position>({ left: '50%', top: '50%' });
  const [orbStyle, setOrbStyle] = useState<OrbStyle>({});

  useEffect(() => {
    const updatePosition = () => {
      const timeFloat = getTimeDecimal();

      // Check if custom background is active (hide orb when custom bg is set)
      const customBg = localStorage.getItem('tc-custom-bg');
      if (customBg) {
        setOrbStyle({ opacity: 0 });
        return;
      }

      // Determine if it's sun or moon based on time
      const isSun = timeFloat >= 6 && timeFloat < 18;

      // Calculate orbit position (6am = left, 12pm = top, 6pm = right)
      // Full arc from 6am to 6pm (180 degrees)
      const orbitProgress = (timeFloat - 6) / 12; // 0 to 1 for 6am to 6pm
      const angle = Math.PI - (orbitProgress * Math.PI); // π to 0 (left to right)

      // Elliptical orbit parameters
      const centerX = 50;
      const centerY = 50;
      const radiusX = 40; // Horizontal reach
      const radiusY = 35; // Vertical reach

      const left = centerX + radiusX * Math.cos(angle);
      const top = centerY - radiusY * Math.sin(angle);

      // Calculate orb appearance based on time
      let background = '', boxShadow = '', opacity = 1;

      if (isSun) {
        // Sun: golden gradient with glow
        background = 'radial-gradient(circle, #fff9e6 0%, #f5a623 60%, #e8941c 100%)';
        boxShadow = '0 0 30px rgba(245, 166, 35, 0.6), 0 0 60px rgba(245, 166, 35, 0.4), 0 0 90px rgba(245, 166, 35, 0.2)';
      } else {
        // Moon: silver-white gradient with subtle glow
        background = 'radial-gradient(circle, #ffffff 0%, #e8e8e8 60%, #d0d0d0 100%)';
        boxShadow = '0 0 20px rgba(255, 255, 255, 0.5), 0 0 40px rgba(255, 255, 255, 0.3)';
      }

      // Fade out when below horizon (before 6am or after 6pm)
      if (timeFloat < 5 || timeFloat > 19) {
        opacity = 0;
      } else if (timeFloat < 6) {
        // Fade in during 5-6am
        opacity = (timeFloat - 5);
      } else if (timeFloat > 18) {
        // Fade out during 6-7pm
        opacity = 1 - (timeFloat - 18);
      }

      setPosition({ left: `${left}%`, top: `${top}%` });
      setOrbStyle({ background, boxShadow, opacity });
    };

    updatePosition();
    const interval = setInterval(updatePosition, 50); // Update every 50ms for smooth animation

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={styles.orb}
      style={{
        left: position.left,
        top: position.top,
        ...orbStyle,
      }}
    />
  );
};

export default SunMoonOrb;
