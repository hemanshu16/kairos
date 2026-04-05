import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../../contexts/AppContext';
import styles from './SunMoonOrb.module.css';

interface Position {
  left: string;
  top: string;
}

interface OrbStyle {
  background?: string;
  boxShadow?: string;
  opacity?: number;
  transform?: string;
}

interface SunMoonOrbProps {
  timeFloat: number;
}

const SunMoonOrb: React.FC<SunMoonOrbProps> = ({ timeFloat }) => {
  const { customBg } = useApp();
  const [position, setPosition] = useState<Position>({ left: '50%', top: '50%' });
  const [orbStyle, setOrbStyle] = useState<OrbStyle>({});
  const orbRef = useRef<HTMLDivElement>(null);
  
  // Responsive orbit config
  const [orbitConfig, setOrbitConfig] = useState({ 
    centerX: 50, 
    centerY: 60, 
    radiusX: 45, 
    radiusY: 45 
  });

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setOrbitConfig({ centerX: 50, centerY: 50, radiusX: 35, radiusY: 35 });
      } else {
        setOrbitConfig({ centerX: 50, centerY: 60, radiusX: 45, radiusY: 45 });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse interaction state
  const [mouseRot, setMouseRot] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleGlobalPointerMove = (e: PointerEvent) => {
      if (!orbRef.current) return;
      
      const rect = orbRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 500) {
        const rotY = (dx / 500) * 35; 
        const rotX = -(dy / 500) * 35;
        setMouseRot({ x: rotX, y: rotY });
        if (!isHovered) setIsHovered(true);
      } else if (isHovered) {
        setMouseRot({ x: 0, y: 0 });
        setIsHovered(false);
      }
    };

    window.addEventListener('pointermove', handleGlobalPointerMove);
    return () => window.removeEventListener('pointermove', handleGlobalPointerMove);
  }, [isHovered]);

  useEffect(() => {
    const updatePosition = () => {
      if (customBg) {
        setOrbStyle({ opacity: 0 });
        return;
      }

      const SUN_RISE     = 6.0;
      const SUN_SET      = 19.25;
      const SUN_FADE_IN_START  = 5.5;
      const SUN_FADE_IN_END    = 6.5;
      const SUN_FADE_OUT_START = 18.5;
      const SUN_FADE_OUT_END   = 19.25;

      const MOON_RISE           = 20.0;
      const MOON_FADE_IN_START  = 20.0;
      const MOON_FADE_IN_END    = 21.0;
      const MOON_FADE_OUT_START = 5.5;
      const MOON_FADE_OUT_END   = 6.5;

      const isSun  = timeFloat >= SUN_FADE_IN_START && timeFloat < SUN_FADE_OUT_END;
      const isMoon = timeFloat >= MOON_RISE || timeFloat < MOON_FADE_OUT_END;

      const { centerX, centerY, radiusX, radiusY } = orbitConfig;
      let left = 50, top = 110;

      if (isSun) {
        const orbitProgress = Math.max(0, Math.min(1, (timeFloat - SUN_RISE) / (SUN_SET - SUN_RISE)));
        const angle = Math.PI - orbitProgress * Math.PI;
        left = centerX + radiusX * Math.cos(angle);
        top  = centerY - radiusY * Math.sin(angle);

        // Optimized Sun Cycle Logic
        let t = 0; // 0 = Orange, 1 = Yellow
        if (timeFloat < 8.0) {
          t = Math.max(0, (timeFloat - 6.0) / 2.0);
        } else if (timeFloat < 17.5) {
          t = 1;
        } else {
          t = Math.max(0, 1 - (timeFloat - 17.5) / 1.75);
        }

        const shiftX = mouseRot.y * 1.8;
        const shiftY = -mouseRot.x * 1.8;

        // Base colors
        let orangeCore = [255, 120, 0], orangeMid = [255, 80, 0], orangeEdge = [210, 40, 0];
        let yellowCore = [255, 255, 250], yellowMid = [255, 255, 100], yellowEdge = [255, 230, 0];

        const core = `rgb(${Math.round(orangeCore[0] + (yellowCore[0] - orangeCore[0]) * t)}, ${Math.round(orangeCore[1] + (yellowCore[1] - orangeCore[1]) * t)}, ${Math.round(orangeCore[2] + (yellowCore[2] - orangeCore[2]) * t)})`;
        const mid = `rgb(${Math.round(orangeMid[0] + (yellowMid[0] - orangeMid[0]) * t)}, ${Math.round(orangeMid[1] + (yellowMid[1] - orangeMid[1]) * t)}, ${Math.round(orangeMid[2] + (yellowMid[2] - orangeMid[2]) * t)})`;
        const edge = `rgb(${Math.round(orangeEdge[0] + (yellowEdge[0] - orangeEdge[0]) * t)}, ${Math.round(orangeEdge[1] + (yellowEdge[1] - orangeEdge[1]) * t)}, ${Math.round(orangeEdge[2] + (yellowEdge[2] - orangeEdge[2]) * t)})`;

        const background = `radial-gradient(circle at ${50 - shiftX}% ${50 - shiftY}%, ${core} 0%, ${mid} 50%, ${edge} 100%)`;
        const glowColor = t < 0.5 ? `rgba(255, 100, 0, 0.5)` : `rgba(255, 255, 100, 0.5)`;
        const insetX = mouseRot.y * 1.5, insetY = -mouseRot.x * 1.5;
        const shadowColor = t < 0.5 ? 'rgba(0,0,0,0.4)' : 'rgba(180, 80, 0, 0.3)';
        
        const boxShadow = `
          0 0 60px ${glowColor},
          0 0 120px ${glowColor.replace('0.5', '0.2')},
          0 0 200px ${glowColor.replace('0.5', '0.1')},
          inset ${-insetX}px ${-insetY}px 40px ${shadowColor},
          inset ${insetX*0.8}px ${insetY*0.8}px 45px rgba(255,255,255,0.7)
        `;

        let opacity = 1;
        if (timeFloat < SUN_FADE_IN_END)  opacity = Math.max(0, (timeFloat - SUN_FADE_IN_START)  / (SUN_FADE_IN_END  - SUN_FADE_IN_START));
        if (timeFloat > SUN_FADE_OUT_START) opacity = Math.max(0, 1 - (timeFloat - SUN_FADE_OUT_START) / (SUN_FADE_OUT_END - SUN_FADE_OUT_START));

        setPosition({ left: `${left}%`, top: `${top}%` });
        setOrbStyle({ 
          background, 
          boxShadow, 
          opacity: Math.max(0.01, Math.min(1, opacity)),
          transform: `translate(-50%, -50%) rotateX(${mouseRot.x}deg) rotateY(${mouseRot.y}deg)` 
        });

      } else if (isMoon) {
        const normalizedTime = timeFloat >= MOON_RISE ? timeFloat - MOON_RISE : timeFloat + (24 - MOON_RISE);
        const moonTotalHours = 24 - MOON_RISE + MOON_FADE_OUT_END;
        const orbitProgress = Math.max(0, Math.min(1, normalizedTime / moonTotalHours));
        const angle = Math.PI - orbitProgress * Math.PI;
        left = centerX + radiusX * Math.cos(angle);
        top  = centerY - radiusY * Math.sin(angle);

        const shiftX = mouseRot.y * 1.8, shiftY = -mouseRot.x * 1.8;
        const background = `radial-gradient(circle at ${50 - shiftX}% ${50 - shiftY}%, #ffffff 0%, #e0e8f5 65%, #aebdd6 100%)`;
        const boxShadow = `
          0 0 50px rgba(180, 210, 255, 0.5),
          0 0 100px rgba(180, 210, 255, 0.2),
          inset ${-shiftX*0.8}px ${-shiftY*0.8}px 35px rgba(0,0,0,0.35),
          inset ${shiftX*0.6}px ${shiftY*0.6}px 30px rgba(255,255,255,0.7),
          ${-shiftX*3}px ${-shiftY*3}px 40px rgba(0,0,0,0.1)
        `;

        let opacity = 1;
        if (timeFloat >= MOON_FADE_IN_START && timeFloat < MOON_FADE_IN_END)
          opacity = (timeFloat - MOON_FADE_IN_START) / (MOON_FADE_IN_END - MOON_FADE_IN_START);
        else if (timeFloat >= MOON_FADE_OUT_START && timeFloat < MOON_FADE_OUT_END)
          opacity = 1 - (timeFloat - MOON_FADE_OUT_START) / (MOON_FADE_OUT_END - MOON_FADE_OUT_START);

        setPosition({ left: `${left}%`, top: `${top}%` });
        setOrbStyle({ 
          background, 
          boxShadow, 
          opacity: Math.max(0, Math.min(1, opacity)),
          transform: `translate(-50%, -50%) rotateX(${mouseRot.x}deg) rotateY(${mouseRot.y}deg)`
        });

      } else {
        setOrbStyle({ opacity: 0 });
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 16);
    return () => clearInterval(interval);
  }, [timeFloat, customBg, mouseRot, isHovered, orbitConfig]);

  const isSunVisible = timeFloat >= 5.5 && timeFloat < 19.25;

  return (
    <div
      ref={orbRef}
      className={styles.orb}
      style={{
        left: position.left,
        top: position.top,
        ...orbStyle,
      }}
    >
      <div className={styles.bloom} />
      
      {!isSunVisible && (
        <div className={styles.craterGroup}>
          <div className={styles.crater} style={{ top: '25%', left: '30%', width: '12px', height: '12px', opacity: 0.15, transform: `translate(${mouseRot.y * 0.4}px, ${-mouseRot.x * 0.4}px)` }} />
          <div className={styles.crater} style={{ top: '55%', left: '60%', width: '8px', height: '8px', opacity: 0.12, transform: `translate(${mouseRot.y * 0.7}px, ${-mouseRot.x * 0.7}px)` }} />
          <div className={styles.crater} style={{ top: '40%', left: '75%', width: '6px', height: '6px', opacity: 0.1, transform: `translate(${mouseRot.y * 0.6}px, ${-mouseRot.x * 0.6}px)` }} />
          <div className={styles.crater} style={{ top: '65%', left: '25%', width: '9px', height: '9px', opacity: 0.14, transform: `translate(${mouseRot.y * 0.3}px, ${-mouseRot.x * 0.3}px)` }} />
          <div className={styles.crater} style={{ top: '15%', left: '65%', width: '5px', height: '5px', opacity: 0.08, transform: `translate(${mouseRot.y * 0.5}px, ${-mouseRot.x * 0.5}px)` }} />
        </div>
      )}
    </div>
  );
};


export default SunMoonOrb;

