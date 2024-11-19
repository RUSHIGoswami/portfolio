import { useEffect, useRef, useState } from "react";
import { cn } from "../../utils/cn";

export const SparklesCore = ({
  id,
  className,
  background,
  minSize,
  maxSize,
  particleDensity,
  particleColor,
  particleSpeed,
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef(null);
  const context = useRef(null);
  const particles = useRef([]);
  const animationFrame = useRef(null);
  const density = particleDensity || 100;
  const speed = particleSpeed || 1;

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      context.current = ctx;

      const handleResize = () => {
        if (canvas.parentNode) {
          setSize({
            width: canvas.parentNode.offsetWidth,
            height: canvas.parentNode.offsetHeight,
          });
        }
      };

      handleResize();
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = context.current;
    if (!ctx) return;

    canvas.width = size.width;
    canvas.height = size.height;

    particles.current = [];

    const createParticles = () => {
      const numParticles = (size.width * size.height) / (10000 / density);

      for (let i = 0; i < numParticles; i++) {
        particles.current.push({
          x: Math.random() * size.width,
          y: Math.random() * size.height,
          size: Math.random() * (maxSize - minSize) + minSize,
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
        });
      }
    };

    createParticles();

    const animate = () => {
      ctx.clearRect(0, 0, size.width, size.height);
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, size.width, size.height);

      particles.current.forEach((particle) => {
        ctx.fillStyle = particleColor;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();

        particle.x += particle.speedX;
        particle.y += particle.speedY;

        if (particle.x < 0) particle.x = size.width;
        if (particle.x > size.width) particle.x = 0;
        if (particle.y < 0) particle.y = size.height;
        if (particle.y > size.height) particle.y = 0;
      });

      animationFrame.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current);
      }
    };
  }, [size, minSize, maxSize, particleColor, background, density, speed]);

  return (
    <canvas
      ref={canvasRef}
      id={id}
      className={cn("opacity-50", className)}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
    />
  );
};
