import { useEffect, useRef } from "react";

export default function ParticlesBG() {

  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles = [];
    let mouse = { x: null, y: null };

    const handleMouseMove = (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    }
    window.addEventListener("mousemove", handleMouseMove);

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 1,
        speedX: Math.random() * 0.6 - 0.3,
        speedY: Math.random() * 0.6 - 0.3
      });
    }

    function connect() {
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {

          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = dx * dx + dy * dy;

          if (distance < 12000) {

            ctx.strokeStyle = "rgba(147,51,234,0.2)";
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    let animationId = null
    function animate() {

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => {

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
        if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = "#a855f7";
        ctx.fill();

        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          p.x += dx / 20;
          p.y += dy / 20;
        }

      });

      connect();

      animationId = requestAnimationFrame(animate);
    }

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
      if (animationId) cancelAnimationFrame(animationId)
    }

  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 -z-10"
    />
  );
}