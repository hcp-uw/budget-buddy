import { motion } from 'framer-motion';

interface CometProps {
  delay: number;
}

export function Comet({ delay }: CometProps) {
  const startX = Math.random() * 102;
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
        x: [0, -400, -800],
        y: [0, 300, 600],
        opacity: [0, 1, 0]
      }}
      transition={{
        duration: 5,
        ease: 'linear',
        delay,
        repeat: Infinity,
        repeatDelay: 4
      }}
    >
      <div className="relative">
        {/* Comet head - pixelated */}
        <div className="w-4 h-4 bg-white border-2 border-blue-200 rotate-45"
          style={{ 
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.8)',
            imageRendering: 'pixelated',
            border: '3px solid rgba(191, 219, 254)',
            transform: 'rotate(45deg)'
          }}
        />
        
        {/* Tail - pixelated blocks */}
        <div className="absolute top-1/2 left-full flex gap-1">
          <div className="w-3 h-1 bg-blue-200/80" 
            style={{ 
              width: '15px', 
              height: '5px', 
              backgroundImage: 'linear-gradient(to right, rgba(191, 219, 254, 0.8), rgba(191, 219, 254, 0.7))',
              transform: 'translateY(-8px) translateX(15px)',
              imageRendering: 'pixelated' }} />
          <div className="w-3 h-1 bg-blue-200/60" 
            style={{ 
              width: '14px', 
              height: '5px', 
              backgroundImage: 'linear-gradient(to right, rgba(191, 219, 254, 0.6), rgba(191, 219, 254, 0.5))',
              transform: 'translateY(-8px) translateX(14px)',
              imageRendering: 'pixelated' 
            }} />
          <div className="w-2 h-1 bg-blue-200/40" 
            style={{ 
              width: '12px', 
              height: '5px', 
              backgroundImage: 'linear-gradient(to right, rgba(191, 219, 254, 0.4), rgba(191, 219, 254, 0.3))',
              transform: 'translateY(-8px) translateX(14px)',
              imageRendering: 'pixelated' 
            }} />
          <div className="w-2 h-1 bg-blue-200/20" 
            style={{ 
              width: '10px', 
              height: '5px', 
              backgroundImage: 'linear-gradient(to right, rgba(191, 219, 254, 0.2), rgba(191, 219, 254, 0))',
              transform: 'translateY(-8px) translateX(14px)',
              imageRendering: 'pixelated' 
              }} />
        </div>
      </div>
    </motion.div>
  );
}
