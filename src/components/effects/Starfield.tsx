import React, { useEffect, useRef, useMemo } from 'react';
import { getTheme } from '../../utils/skyTheme';
import styles from './Starfield.module.css';

interface StarfieldProps {
  timeFloat: number;
}

const Starfield: React.FC<StarfieldProps> = ({ timeFloat }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Persist star positions so they don't jump every second
  const starData = useMemo(() => {
    // Using a fixed size for calculation, will scale to canvas
    return Array.from({ length: 180 }, () => ({
      x: Math.random(), // 0 to 1
      y: Math.random(), // 0 to 1
      radius: Math.random() * 1.2 + 0.3,
    }));
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drawStars = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get current theme based on provided timeFloat
      const theme = getTheme(timeFloat);
      const globalStarOpacity = theme.stars; // 0-1 based on time of day

      if (globalStarOpacity <= 0) return;

      starData.forEach((star: { x: number, y: number, radius: number }) => {
        const finalOpacity = 0.8 * globalStarOpacity;

        if (finalOpacity > 0.01) {
          ctx.beginPath();
          // Scale normalized coordinates to current window size
          ctx.arc(star.x * canvas.width, star.y * canvas.height, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
          ctx.fill();
        }
      });
    };

    drawStars();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [timeFloat]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default Starfield;
