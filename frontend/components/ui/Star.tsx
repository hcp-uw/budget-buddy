import { motion } from 'framer-motion';

interface StarProps {
  delay: number;
  x: number;
  y: number;
}

export function Star({ delay, x, y }: StarProps) {
  return (
    <motion.div
      className="absolute"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
      initial={{ scale: 0, rotate: 0 }}
      animate={{ 
        scale: [0, 1, 1, 0],
        rotate: [0, 90, 180, 270, 360],
        opacity: [0, 1, 1, 0]
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: 'easeInOut'
      }}
    >
      {/* Pixelated star shape */}
      <div className="relative w-8 h-8">
        {/* Center */}
        <div className="absolute w-3 h-3 bg-yellow-300 border-2 border-yellow-400 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ 
            boxShadow: '0 0 10px rgba(238, 253, 71, 0.8)',
            imageRendering: 'pixelated'
          }}
        />
        {/* Top spike */}
        <div className="absolute w-2 h-2 bg-yellow-300 border-2 border-yellow-400 left-1/2 top-0 -translate-x-1/2"
          style={{ imageRendering: 'pixelated' }}
        />
        {/* Bottom spike */}
        <div className="absolute w-2 h-2 bg-yellow-300 border-2 border-yellow-400 left-1/2 bottom-0 -translate-x-1/2"
          style={{ imageRendering: 'pixelated' }}
        />
        {/* Left spike */}
        <div className="absolute w-2 h-2 bg-yellow-300 border-2 border-yellow-400 left-0 top-1/2 -translate-y-1/2"
          style={{ imageRendering: 'pixelated' }}
        />
        {/* Right spike */}
        <div className="absolute w-2 h-2 bg-yellow-300 border-2 border-yellow-400 right-0 top-1/2 -translate-y-1/2"
          style={{ imageRendering: 'pixelated' }}
        />
      </div>
    </motion.div>
  );
}
