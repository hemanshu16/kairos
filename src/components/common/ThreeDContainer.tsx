import React, { useState, useEffect, useRef } from 'react';

interface ThreeDContainerProps {
  children: React.ReactNode;
  intensity?: number;
  perspective?: number;
}

const ThreeDContainer: React.FC<ThreeDContainerProps> = ({ 
  children, 
  intensity = 15, 
  perspective = 1000 
}) => {
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      
      const dist = Math.sqrt(dx * dx + dy * dy);
      // Increased range for smoother entry
      if (dist < 800) {
        const xRot = -(dy / 800) * intensity;
        const yRot = (dx / 800) * intensity;
        setRotate({ x: xRot, y: yRot });
      } else {
        setRotate({ x: 0, y: 0 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      style={{
        perspective: `${perspective}px`,
        transformStyle: 'preserve-3d',
        display: 'inline-block'
      }}
    >
      <div
        style={{
          transform: `rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          willChange: 'transform'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default ThreeDContainer;
