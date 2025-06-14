
import React, { useEffect, useRef } from 'react';

interface SquaresProps {
  speed?: number;
  squareSize?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'diagonal';
  borderColor?: string;
  hoverFillColor?: string;
}

const Squares: React.FC<SquaresProps> = ({
  speed = 0.5,
  squareSize = 40,
  direction = 'diagonal',
  borderColor = '#fff',
  hoverFillColor = '#222'
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const squares: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      hovered: boolean;
    }> = [];

    // Create squares grid
    for (let x = 0; x < canvas.width + squareSize; x += squareSize) {
      for (let y = 0; y < canvas.height + squareSize; y += squareSize) {
        squares.push({
          x,
          y,
          vx: direction === 'left' ? -speed : direction === 'right' ? speed : direction === 'diagonal' ? speed * 0.7 : 0,
          vy: direction === 'up' ? -speed : direction === 'down' ? speed : direction === 'diagonal' ? speed * 0.7 : 0,
          hovered: false
        });
      }
    }

    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      squares.forEach(square => {
        // Update position
        square.x += square.vx;
        square.y += square.vy;

        // Wrap around screen
        if (square.x > canvas.width) square.x = -squareSize;
        if (square.x < -squareSize) square.x = canvas.width;
        if (square.y > canvas.height) square.y = -squareSize;
        if (square.y < -squareSize) square.y = canvas.height;

        // Check hover
        const distance = Math.sqrt(
          Math.pow(mouseX - (square.x + squareSize / 2), 2) +
          Math.pow(mouseY - (square.y + squareSize / 2), 2)
        );
        square.hovered = distance < squareSize;

        // Draw square
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 1;
        ctx.strokeRect(square.x, square.y, squareSize, squareSize);

        if (square.hovered) {
          ctx.fillStyle = hoverFillColor;
          ctx.fillRect(square.x, square.y, squareSize, squareSize);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [speed, squareSize, direction, borderColor, hoverFillColor]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.3 }}
    />
  );
};

export default Squares;
