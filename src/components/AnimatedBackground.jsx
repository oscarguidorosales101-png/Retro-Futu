import React, { useEffect, useRef } from 'react';

const AnimatedBackground = ({ isPaused }) => {
  const canvasRef = useRef(null);
  const pausedRef = useRef(isPaused);

  useEffect(() => { pausedRef.current = isPaused; }, [isPaused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const hexRadius = 45;
    const hexHeight = hexRadius * Math.sqrt(3);
    const hexWidth = hexRadius * 2;
    const xOffset = hexWidth * 0.75;
    const yOffset = hexHeight;
    let time = 0;

    const drawHexagon = (x, y, radius, opacity, colorStr) => {
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const angle_rad = (Math.PI / 180) * (60 * i);
        const hx = x + radius * Math.cos(angle_rad);
        const hy = y + radius * Math.sin(angle_rad);
        if (i === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();
      ctx.strokeStyle = `rgba(${colorStr}, ${opacity})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    };

    const render = () => {
      animationFrameId = requestAnimationFrame(render);
      if (pausedRef.current) return;

      ctx.fillStyle = 'rgba(3, 7, 18, 0.2)';
      ctx.fillRect(0, 0, width, height);
      time += 0.015;

      const cols = Math.ceil(width / xOffset) + 1;
      const rows = Math.ceil(height / yOffset) + 1;

      for (let row = -1; row < rows; row++) {
        for (let col = -1; col < cols; col++) {
          const x = col * xOffset;
          const y = row * yOffset + (col % 2 !== 0 ? yOffset / 2 : 0);
          const dist = Math.sqrt(Math.pow(x - width / 2, 2) + Math.pow(y - height / 2, 2));
          const wave = Math.sin(dist * 0.004 - time * 2) * 0.5 + 0.5;

          let colorStr = '16, 185, 129';
          if ((col + row) % 4 === 0) colorStr = '245, 158, 11';
          else if ((col * row) % 7 === 0) colorStr = '6, 182, 212';

          const opacity = 0.02 + wave * 0.15;
          drawHexagon(x, y, hexRadius - 2, opacity, colorStr);

          const randomFlash = Math.sin(x * y * 0.01 + time * 5);
          if (randomFlash > 0.98) {
            ctx.fillStyle = `rgba(${colorStr}, ${opacity + 0.5})`;
            ctx.fill();
            ctx.shadowColor = `rgba(${colorStr}, 1)`;
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;
          }
        }
      }

      // Línea de escaneo láser
      const scanY = (time * 120) % (height + 200) - 100;
      ctx.beginPath();
      ctx.moveTo(0, scanY);
      ctx.lineTo(width, scanY);
      ctx.strokeStyle = 'rgba(6, 182, 212, 0.4)';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#06b6d4';
      ctx.shadowBlur = 20;
      ctx.stroke();

      ctx.beginPath();
      ctx.rect(0, scanY - 30, width, 60);
      const gradient = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 30);
      gradient.addColorStop(0, 'rgba(6, 182, 212, 0)');
      gradient.addColorStop(0.5, 'rgba(6, 182, 212, 0.05)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
      ctx.shadowBlur = 0;
    };

    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} id="bg-canvas" />;
};

export default AnimatedBackground;
