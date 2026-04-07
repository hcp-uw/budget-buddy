import { motion } from 'framer-motion';

interface CloudProps {
  delay: number;
  startX: number;
  y: number;
  duration: number;
  size: 'small' | 'medium' | 'large';
}

export function Cloud({ delay, startX, y, duration, size }: CloudProps) {
  const sizeMap = {
    small: { width: 60, height: 40 },
    medium: { width: 80, height: 50 },
    large: { width: 100, height: 60 }
  };

  const dimensions = sizeMap[size];

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${startX}%`,
        top: `${y}%`,
      }}
      initial={{ x: '0vw' }}
      animate={{ x: '120vw' }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      {/* Pixelated cloud using rectangles */}
      <div className="relative" style={{ width: dimensions.width, height: dimensions.height }}>
        {/* Cloud body - pixelated style */}
        <div className="absolute bg-white/80 border-4 border-white/50" 
          style={{ 
            width: '40%', 
            height: '50%', 
            left: '30%', 
            top: '25%',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.1)',
            imageRendering: 'pixelated'
          }} 
        />
        <div className="absolute bg-white/80 border-4 border-white/50" 
          style={{ 
            width: '30%', 
            height: '40%', 
            left: '10%', 
            top: '30%',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.1)',
            imageRendering: 'pixelated'
          }} 
        />
        <div className="absolute bg-white/80 border-4 border-white/50" 
          style={{ 
            width: '35%', 
            height: '45%', 
            left: '55%', 
            top: '30%',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.1)',
            imageRendering: 'pixelated'
          }} 
        />
        <div className="absolute bg-white/80 border-4 border-white/50" 
          style={{ 
            width: '25%', 
            height: '35%', 
            left: '20%', 
            top: '15%',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.1)',
            imageRendering: 'pixelated'
          }} 
        />
        <div className="absolute bg-white/80 border-4 border-white/50" 
          style={{ 
            width: '28%', 
            height: '38%', 
            left: '48%', 
            top: '18%',
            boxShadow: '2px 2px 0px rgba(0,0,0,0.1)',
            imageRendering: 'pixelated'
          }} 
        />
      </div>
    </motion.div>
  );
}
