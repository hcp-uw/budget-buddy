import { motion } from 'framer-motion';

interface CometProps {
  delay: number;
}

export function Comet({ delay }: CometProps) {
  const startX = Math.random() * 100;
  const startY = -10;

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${startX}%`,
        top: `${startY}%`,
      }}
      initial={{ x: 0, y: 0, opacity: 0 }}
      animate={{ 
        x: [0, -200, -400],
        y: [0, 150, 300],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Infinity,
        repeatDelay: 3,
        ease: 'easeIn'
      }}
    >
      <div className="relative">
        {/* Comet head - pixelated */}
        <div className="w-4 h-4 bg-white border-2 border-blue-200 rotate-45"
          style={{ 
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
            imageRendering: 'pixelated'
          }}
        />
        
        {/* Tail - pixelated blocks */}
        <div className="absolute top-1/2 left-full flex gap-1">
          <div className="w-3 h-1 bg-blue-200/80" style={{ imageRendering: 'pixelated' }} />
          <div className="w-3 h-1 bg-blue-200/60" style={{ imageRendering: 'pixelated' }} />
          <div className="w-2 h-1 bg-blue-200/40" style={{ imageRendering: 'pixelated' }} />
          <div className="w-2 h-1 bg-blue-200/20" style={{ imageRendering: 'pixelated' }} />
        </div>
      </div>
    </motion.div>
  );
}
