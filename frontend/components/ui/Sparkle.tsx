import { motion } from 'framer-motion';

interface SparkleProps {
  x: number;
  y: number;
  delay?: number;
  size?: number;
}

export function Sparkle({ x, y, delay = 0, size = 12 }: SparkleProps) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, rotate: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1, 1.3, 1, 0],
        rotate: [0, 90, 180, 270, 360],
        opacity: [0, 1, 1, 1, 0]
      }}
      transition={{
        duration: 2,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 3 + 2,
        ease: 'easeInOut'
      }}
    >
      {/* Diamond sparkle shape */}
      <div 
        className="relative bg-white"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
          boxShadow: `0 0 ${size * 2}px rgba(255, 255, 255, 0.9), 0 0 ${size * 3}px rgba(255, 200, 255, 0.6)`,
          imageRendering: 'pixelated'
        }}
      />
      {/* Cross highlight */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white"
        style={{
          width: `${size * 1.5}px`,
          height: `${size * 0.3}px`,
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
        }}
      />
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white"
        style={{
          width: `${size * 0.3}px`,
          height: `${size * 1.5}px`,
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)'
        }}
      />
    </motion.div>
  );
}
