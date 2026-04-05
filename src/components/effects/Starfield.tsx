import React, { useEffect, useRef, useMemo, useState } from 'react';
import { getTheme } from '../../utils/skyTheme';
import styles from './Starfield.module.css';

interface Star {
  x: number;
  y: number;
  z: number;
  radius: number;
  opacity: number;
}

interface StarfieldProps {
  timeFloat: number;
}

const Starfield: React.FC<StarfieldProps> = ({ timeFloat }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const animationRef = useRef<number | null>(null);

  // Initialize stars with actual depth (z) for parallax
  const stars = useMemo<Star[]>(() => {
    return Array.from({ length: 100 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.45,
      z: Math.random() * 0.8 + 0.2, // Depth layer (0.2 far to 1.0 near)
      radius: Math.random() * 1.4 + 0.2,
      opacity: Math.random() * 0.5 + 0.5,
    }));
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: PointerEvent) => {
      // Offset from center (-0.5 to 0.5)
      setMousePos({
        x: (e.clientX / window.innerWidth) - 0.5,
        y: (e.clientY / window.innerHeight) - 0.5,
      });
    };
    window.addEventListener('pointermove', handleMouseMove);
    return () => window.removeEventListener('pointermove', handleMouseMove);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const theme = getTheme(timeFloat);
      const globalOpacity = theme.stars;

      if (globalOpacity > 0) {
        stars.forEach(star => {
          // Parallax shift based on depth (z)
          const px = star.x * canvas.width + (mousePos.x * 60 * star.z);
          const py = star.y * canvas.height + (mousePos.y * 40 * star.z);
          
          const finalOpacity = star.opacity * globalOpacity;

          ctx.beginPath();
          ctx.arc(px, py, star.radius, 0, Math.PI * 2);
          
          // Add a subtle twinkle/glow look
          const gradient = ctx.createRadialGradient(px, py, 0, px, py, star.radius * 2);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${finalOpacity})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
          
          ctx.fillStyle = gradient;
          ctx.fill();
        });
      }
      animationRef.current = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', resize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [timeFloat, stars, mousePos]);

  return <canvas ref={canvasRef} className={styles.canvas} />;
};

export default Starfield;
