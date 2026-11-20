import { useEffect, useRef, memo } from 'react';

function SyphroneBackgroundComponent({ themeColors }) {
  const canvasRef = useRef(null);
  const primary = themeColors?.primary || '#4a6aff';
  const secondary = themeColors?.secondary || '#a855f7';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });

    let animId;
    let particles = [];
    let isVisible = !document.hidden;

    function init() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Keep particle count lean (max 26) for 60/120fps smooth performance
      const count = Math.min(26, Math.floor((canvas.width * canvas.height) / 45000));
      particles = Array.from({ length: count }, (_, i) => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        r: 1 + Math.random() * 1.5,
        color: i % 2 === 0 ? primary : secondary,
      }));
    }

    const maxDist = 110;
    const maxDistSq = maxDist * maxDist;

    function draw() {
      if (!isVisible) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const len = particles.length;

      // 1. Connection lines (Single batch draw with distance-squared check)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < len; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < len; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < maxDistSq) {
            const alpha = (1 - Math.sqrt(distSq) / maxDist) * 0.16;
            ctx.strokeStyle = `rgba(74, 106, 255, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 2. Draw & move particles
      for (let i = 0; i < len; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + 'aa';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }

      animId = requestAnimationFrame(draw);
    }

    init();
    draw();

    let resizeTimer;
    const onResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(init, 150);
    };

    const onVisibilityChange = () => {
      isVisible = !document.hidden;
      if (isVisible) {
        cancelAnimationFrame(animId);
        animId = requestAnimationFrame(draw);
      } else {
        cancelAnimationFrame(animId);
      }
    };

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [primary, secondary]);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none select-none"
      style={{ zIndex: 0, background: '#070a13' }}
    >
      {/* 
        High-performance GPU-accelerated atmospheric aurora orbs.
        Uses CSS radial gradients + 3D transform instead of expensive 180px Gaussian filters.
      */}
      <div
        className="absolute rounded-full animate-blob pointer-events-none"
        style={{
          width: '58vw',
          height: '58vw',
          top: '-12%',
          left: '-10%',
          background: `radial-gradient(circle, ${primary}35 0%, ${primary}12 40%, transparent 70%)`,
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      <div
        className="absolute rounded-full animate-blob animation-delay-2000 pointer-events-none"
        style={{
          width: '50vw',
          height: '50vw',
          bottom: '-10%',
          right: '-10%',
          background: `radial-gradient(circle, ${secondary}26 0%, ${secondary}0e 40%, transparent 70%)`,
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      <div
        className="absolute rounded-full animate-blob animation-delay-4000 pointer-events-none"
        style={{
          width: '36vw',
          height: '36vw',
          top: '35%',
          left: '32%',
          background: `radial-gradient(circle, ${primary}18 0%, transparent 65%)`,
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      />
      <div
        className="absolute rounded-full animate-blob animation-delay-6000 pointer-events-none"
        style={{
          width: '26vw',
          height: '26vw',
          bottom: '18%',
          left: '-4%',
          background: `radial-gradient(circle, ${secondary}15 0%, transparent 65%)`,
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Dark overlay for contrast */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Lightweight particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0" style={{ zIndex: 6, opacity: 0.8 }} />
    </div>
  );
}

export default memo(SyphroneBackgroundComponent);
