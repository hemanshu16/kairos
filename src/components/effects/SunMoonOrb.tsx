import React, { useEffect, useState } from 'react';
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
}

interface SunMoonOrbProps {
  timeFloat: number;
}

const SunMoonOrb: React.FC<SunMoonOrbProps> = ({ timeFloat }) => {
  const { customBg } = useApp();
  const [position, setPosition] = useState<Position>({ left: '50%', top: '50%' });
  const [orbStyle, setOrbStyle] = useState<OrbStyle>({});

  useEffect(() => {
    const updatePosition = () => {
      // Hide orb when custom background is active
      if (customBg) {
        setOrbStyle({ opacity: 0 });
        return;
      }

      // ─── Time windows ───────────────────────────────────────────────
      // Sun arc:      06:00 → 19:15
      // Sun turns orange: 18:30 → 19:15 (gradual warm shift at sunset)
      // Sun fades out: 18:30 → 19:15
      // Sun fades in:  05:30 → 06:30
      //
      // Dark gap:     19:15 → 20:00 (no orb, full dark)
      // Moon visible: 20:00 → 06:00 (next day)
      // Moon fades in:  20:00 → 21:00
      // Moon fades out: 05:30 → 06:30
      // ────────────────────────────────────────────────────────────────

      const SUN_RISE     = 6.0;
      const SUN_SET      = 19.25;  // 7:15 PM — end of sun arc
      const SUN_FADE_IN_START  = 5.5;
      const SUN_FADE_IN_END    = 6.5;
      const SUN_FADE_OUT_START = 18.5;   // 6:30 PM — sun starts fading
      const SUN_FADE_OUT_END   = 19.25;  // 7:15 PM — sun fully gone
      const SUNSET_COLOR_START = 18.5;   // 6:30 PM — sun turns orange

      const MOON_RISE           = 20.0; // 8 PM
      const MOON_FADE_IN_START  = 20.0;
      const MOON_FADE_IN_END    = 21.0;
      const MOON_FADE_OUT_START = 5.5;
      const MOON_FADE_OUT_END   = 6.5;

      const isSun  = timeFloat >= SUN_FADE_IN_START && timeFloat < SUN_FADE_OUT_END;
      const isMoon = timeFloat >= MOON_RISE || timeFloat < MOON_FADE_OUT_END;

      // Elliptical orbit parameters
      const centerX = 50;
      const centerY = 60;
      const radiusX = 45;
      const radiusY = 45;

      let left = 50, top = 110; // default below screen

      if (isSun) {
        // Sun arc: 6 AM (left, rising) → 12 PM (top) → 6:30 PM (right, setting)
        const orbitProgress = Math.max(0, Math.min(1, (timeFloat - SUN_RISE) / (SUN_SET - SUN_RISE)));
        const angle = Math.PI - orbitProgress * Math.PI;
        left = centerX + radiusX * Math.cos(angle);
        top  = centerY - radiusY * Math.sin(angle);

        // Colour: golden white → warm orange at sunset
        const sunsetT = timeFloat >= SUNSET_COLOR_START
          ? Math.min(1, (timeFloat - SUNSET_COLOR_START) / (SUN_FADE_OUT_START - SUNSET_COLOR_START))
          : 0;

        // Lerp from gold-white → deep orange
        const innerColor = sunsetT > 0 ? `rgba(255, ${Math.round(200 - 60 * sunsetT)}, ${Math.round(200 - 180 * sunsetT)}, 1)` : '#ffffff';
        const outerColor = sunsetT > 0 ? `rgba(255, ${Math.round(140 - 50 * sunsetT)}, ${Math.round(30 - 20 * sunsetT)}, 1)` : '#f5a623';
        const glowA = sunsetT > 0 ? `rgba(255, ${Math.round(120 - 40 * sunsetT)}, 20, 0.6)` : 'rgba(245, 166, 35, 0.4)';
        const glowB = sunsetT > 0 ? `rgba(255, ${Math.round(80 - 30 * sunsetT)}, 10, 0.3)` : 'rgba(245, 166, 35, 0.2)';

        const background = `radial-gradient(circle, ${innerColor} 0%, ${outerColor} 60%, ${outerColor} 100%)`;
        const boxShadow  = `0 0 ${40 + sunsetT * 20}px ${glowA}, 0 0 ${80 + sunsetT * 40}px ${glowB}`;

        // Opacity
        let opacity = 1;
        if (timeFloat < SUN_FADE_IN_END)  opacity = Math.max(0, (timeFloat - SUN_FADE_IN_START)  / (SUN_FADE_IN_END  - SUN_FADE_IN_START));
        if (timeFloat > SUN_FADE_OUT_START) opacity = Math.max(0, 1 - (timeFloat - SUN_FADE_OUT_START) / (SUN_FADE_OUT_END - SUN_FADE_OUT_START));

        setPosition({ left: `${left}%`, top: `${top}%` });
        setOrbStyle({ background, boxShadow, opacity: Math.max(0, Math.min(1, opacity)) });

      } else if (isMoon) {
        // Moon arc: 8 PM (left, rising) → 1 AM (top) → 6 AM (right, setting)
        // Normalize: 20 → 0, 6 (next day) → 10  (total 10 hours)
        const normalizedTime = timeFloat >= MOON_RISE ? timeFloat - MOON_RISE : timeFloat + (24 - MOON_RISE);
        const moonTotalHours = 24 - MOON_RISE + MOON_FADE_OUT_END; // ~10 hrs
        const orbitProgress = Math.max(0, Math.min(1, normalizedTime / moonTotalHours));
        const angle = Math.PI - orbitProgress * Math.PI;
        left = centerX + radiusX * Math.cos(angle);
        top  = centerY - radiusY * Math.sin(angle);

        const background = 'radial-gradient(circle, #ffffff 10%, #e8edf5 55%, #c8d5e8 100%)';
        const boxShadow  = '0 0 30px rgba(200, 220, 255, 0.5), 0 0 60px rgba(200, 220, 255, 0.2)';

        // Opacity — fade in 20:00→21:00, fade out 05:30→06:30
        let opacity = 1;
        if (timeFloat >= MOON_FADE_IN_START && timeFloat < MOON_FADE_IN_END)
          opacity = (timeFloat - MOON_FADE_IN_START) / (MOON_FADE_IN_END - MOON_FADE_IN_START);
        else if (timeFloat >= MOON_FADE_OUT_START && timeFloat < MOON_FADE_OUT_END)
          opacity = 1 - (timeFloat - MOON_FADE_OUT_START) / (MOON_FADE_OUT_END - MOON_FADE_OUT_START);
        else if (timeFloat >= MOON_FADE_OUT_END && timeFloat < MOON_RISE)
          opacity = 0; // daytime gap, hide completely

        setPosition({ left: `${left}%`, top: `${top}%` });
        setOrbStyle({ background, boxShadow, opacity: Math.max(0, Math.min(1, opacity)) });

      } else {
        // Twilight gap (18:30 → 20:00) — nothing visible
        setOrbStyle({ opacity: 0 });
      }
    };

    updatePosition();
    const interval = setInterval(updatePosition, 100);
    return () => clearInterval(interval);
  }, [timeFloat, customBg]);

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

