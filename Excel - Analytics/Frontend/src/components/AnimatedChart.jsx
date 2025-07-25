import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const AnimatedChart = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    let animationId;
    let time = 0;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Draw animated bars
      const bars = 8;
      const barWidth = width / (bars * 2);
      
      for (let i = 0; i < bars; i++) {
        const x = i * barWidth * 2 + barWidth / 2;
        const barHeight = Math.sin(time + i * 0.5) * 100 + 150;
        const y = height - barHeight;
        
        const gradient = ctx.createLinearGradient(0, y, 0, height);
        gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0.2)');
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
      
      // Draw animated line
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 3;
      
      for (let x = 0; x < width; x += 5) {
        const y = height / 2 + Math.sin((x + time * 50) * 0.01) * 50;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
      
      time += 0.02;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1, delay: 0.6 }}
      className="relative"
    >
      <div className="bg-gradient-to-br from-secondary to-accent rounded-xl p-6 shadow-2xl border border-border">
        <canvas
          ref={canvasRef}
          width={400}
          height={300}
          className="w-full h-auto rounded-lg"
        />
      </div>
      
      <motion.div
        animate={{ 
          scale: [1, 1.05, 1],
          rotate: [0, 1, -1, 0] 
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
        className="absolute -top-4 -right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center"
      >
        <div className="w-3 h-3 bg-black rounded-full"></div>
      </motion.div>
    </motion.div>
  );
};

export default AnimatedChart;