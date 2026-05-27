import { motion } from 'framer-motion';

interface ShootingStarProps {
  delay?: number;
}

export function ShootingStar({ delay = 0 }: ShootingStarProps) {
  const startX = Math.random() * 100;
  const startY = Math.random() * 50;
  
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${startX}%`,
        top: `${startY}%`
      }}
      initial={{ 
        x: 0, 
        y: 0,
        opacity: 0
      }}
      animate={{ 
        x: [0, -300, -300],
        y: [0, 200, 200],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 1.5,
        delay,
        repeat: Infinity,
        repeatDelay: Math.random() * 10 + 5,
        ease: 'easeOut'
      }}
    >
      {/* Star head - pixelated */}
      <div 
        className="relative w-2 h-2 bg-white"
        style={{
          boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
          imageRendering: 'pixelated'
        }}
      />
      
      {/* Pixelated trail */}
      <div 
        className="absolute top-0 left-1"
        style={{
          width: '40px',
          height: '2px',
          background: 'linear-gradient(to right, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
          transform: 'rotate(33deg)',
          transformOrigin: 'left center',
          imageRendering: 'pixelated'
        }}
      />
    </motion.div>
  );
}
