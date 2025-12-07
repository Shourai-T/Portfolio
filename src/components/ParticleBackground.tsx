import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseX: number;
  baseY: number;
  radius: number;
  baseOpacity: number;
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, active: false });
  const animationRef = useRef<number>();
  const isMobileRef = useRef(false);

  useEffect(() => {
    isMobileRef.current = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeNodes();
    };

    const initializeNodes = () => {
      const nodes: Node[] = [];
      const minCount = 100;
      const maxCount = 300;
      const area = window.innerWidth * window.innerHeight;
      let nodeCount = Math.floor(area / 8000);
      nodeCount = Math.max(minCount, Math.min(maxCount, nodeCount));

      for (let i = 0; i < nodeCount; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const baseOpacity = Math.random() * 0.4 + 0.3;

        nodes.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          baseX: x,
          baseY: y,
          radius: Math.random() * 1.5 + 1,
          baseOpacity,
        });
      }

      nodesRef.current = nodes;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    const distance = (x1: number, y1: number, x2: number, y2: number) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const update = () => {
      const nodes = nodesRef.current;
      const mouse = mouseRef.current;
      const REPULSION_RADIUS = 150;
      const REPULSION_STRENGTH = 1.2;
      const RETURN_DAMPING = 0.015;
      const VELOCITY_DAMPING = 0.88;
      const CONNECTION_DISTANCE = 120;

      nodes.forEach((node) => {
        let forceX = 0;
        let forceY = 0;

        if (mouse.active && !isMobileRef.current) {
          const dx = node.x - mouse.x;
          const dy = node.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < REPULSION_RADIUS && dist > 0) {
            const repulsionForce = (1 - dist / REPULSION_RADIUS) * REPULSION_STRENGTH;
            forceX = (dx / dist) * repulsionForce;
            forceY = (dy / dist) * repulsionForce;

            node.vx = forceX * 2;
            node.vy = forceY * 2;
          }
        }

        node.vx *= VELOCITY_DAMPING;
        node.vy *= VELOCITY_DAMPING;

        node.x += node.vx;
        node.y += node.vy;

        const returnForceX = (node.baseX - node.x) * RETURN_DAMPING;
        const returnForceY = (node.baseY - node.y) * RETURN_DAMPING;

        node.x += returnForceX;
        node.y += returnForceY;

        if (node.x < -50) node.x = canvas.width + 50;
        if (node.x > canvas.width + 50) node.x = -50;
        if (node.y < -50) node.y = canvas.height + 50;
        if (node.y > canvas.height + 50) node.y = -50;
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const nodes = nodesRef.current;

      nodes.forEach((node) => {
        const gradient = ctx.createRadialGradient(
          node.x,
          node.y,
          0,
          node.x,
          node.y,
          node.radius * 3
        );

        gradient.addColorStop(0, `rgba(100, 150, 255, ${node.baseOpacity})`);
        gradient.addColorStop(0.5, `rgba(100, 150, 255, ${node.baseOpacity * 0.6})`);
        gradient.addColorStop(1, `rgba(100, 150, 255, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[j].x - nodes[i].x;
          const dy = nodes[j].y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            const opacity = (1 - dist / 120) * 0.5;
            ctx.strokeStyle = `rgba(100, 150, 255, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }
    };

    const animate = () => {
      update();
      draw();
      animationRef.current = requestAnimationFrame(animate);
    };

    setCanvasSize();
    animate();

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', setCanvasSize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', setCanvasSize);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none"
      style={{
        background: 'transparent',
        willChange: 'transform',
      }}
    />
  );
}
