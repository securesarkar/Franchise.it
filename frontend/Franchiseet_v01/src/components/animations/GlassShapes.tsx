import { useEffect, useRef, useState } from "react";

const shapesConfig = [
  { size: 300, x: 0.1, y: 0.2 },
  { size: 200, x: 0.7, y: 0.3 },
  { size: 250, x: 0.4, y: 0.7 },
  { size: 180, x: 0.8, y: 0.75 },
];

const GlassShapes = () => {
  const [, forceRender] = useState(0);

  const shapesRef = useRef<any[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };

    window.addEventListener("mousemove", handleMouse);

    // initialize shapes
    shapesRef.current = shapesConfig.map((s) => ({
      ...s,
      baseX: s.x * window.innerWidth,
      baseY: s.y * window.innerHeight,
      x: s.x * window.innerWidth,
      y: s.y * window.innerHeight,
      vx: 0,
      vy: 0,
    }));

    let frame: number;

    const animate = () => {
      shapesRef.current.forEach((shape) => {
        const dx = mouse.current.x - shape.x;
        const dy = mouse.current.y - shape.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // 💥 STRONG HIT
        if (dist < 200) {
          const force = (200 - dist) / 200;
          shape.vx -= dx * 0.03 * force;
          shape.vy -= dy * 0.03 * force;
        }

        // 🧲 SPRING BACK
        shape.vx += (shape.baseX - shape.x) * 0.02;
        shape.vy += (shape.baseY - shape.y) * 0.02;

        // damping
        shape.vx *= 0.92;
        shape.vy *= 0.92;

        shape.x += shape.vx;
        shape.y += shape.vy;
      });

      // 🔥 force React to update
      forceRender((v) => v + 1);

      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {shapesRef.current.map((shape, i) => (
        <div
          key={i}
          className="absolute rounded-full backdrop-blur-3xl"
          style={{
            width: shape.size,
            height: shape.size,
            left: 0,
            top: 0,
            transform: `translate(${shape.x}px, ${shape.y}px)`,
            background:
              "radial-gradient(circle at 30% 30%, rgba(139,92,246,0.25), rgba(59,130,246,0.15), transparent 70%)",
            boxShadow:
              "0 0 100px rgba(139,92,246,0.2), inset 0 0 50px rgba(255,255,255,0.05)",
          }}
        />
      ))}
    </div>
  );
};

export default GlassShapes;