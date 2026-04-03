import React, { useEffect, useRef } from 'react';
import { getTheme, getTimeDecimal } from '../../utils/skyTheme';
import styles from './Starfield.module.css';

const Starfield: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create 180 stars with individual properties
    const stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.2 + 0.3, // 0.3 to 1.5 radius
      phase: Math.random() * Math.PI * 2, // Random starting phase for twinkle
      speed: Math.random() * 0.5 + 0.3, // Individual twinkle speed
    }));

    let animationId: number;
    let frame = 0;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Get current time for star opacity based on time of day
      const timeFloat = getTimeDecimal();
      const theme = getTheme(timeFloat);
      const globalStarOpacity = theme.stars; // 0-1 based on time of day

      stars.forEach((star) => {
        // Sine wave twinkling effect
        const twinkle = Math.sin(star.phase + frame * 0.02 * star.speed);
        const starOpacity = ((twinkle + 1) / 2) * 0.7 + 0.3; // Range: 0.3 to 1.0

        // Combine with global opacity (stars fade during day)
        const finalOpacity = starOpacity * globalStarOpacity;

        if (finalOpacity > 0.01) {
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${finalOpacity})`;
          ctx.fill();
        }
      });

      frame++;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default Starfield;
