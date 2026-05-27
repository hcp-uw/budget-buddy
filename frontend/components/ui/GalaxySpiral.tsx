import { motion } from 'framer-motion';

interface GalaxySpiralProps {
  x: number;
  y: number;
  size?: number;
  delay?: number;
}

export function GalaxySpiral({ x, y, size = 120, delay = 0 }: GalaxySpiralProps) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 0, rotate: 0 }}
      animate={{ 
        scale: 1,
        opacity: 0.6,
        rotate: 360
      }}
      transition={{
        scale: { duration: 2, delay },
        opacity: { duration: 2, delay },
        rotate: { duration: 80, repeat: Infinity, ease: 'linear' }
      }}
    >
      <div 
        className="relative rounded-full"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(ellipse at center, 
            rgba(255, 255, 255, 0.8) 0%, 
            rgba(192, 132, 252, 0.6) 15%,
            rgba(168, 85, 247, 0.5) 30%,
            rgba(139, 92, 246, 0.3) 50%,
            transparent 70%
          )`,
          boxShadow: `0 0 ${size * 0.5}px rgba(139, 92, 246, 0.4), inset 0 0 ${size * 0.3}px rgba(255, 255, 255, 0.3)`,
          filter: 'blur(2px)'
        }}
      >
        {/* Spiral arms - pixelated effect */}
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `
              repeating-conic-gradient(
                from 0deg,
                transparent 0deg,
                transparent 20deg,
                rgba(192, 132, 252, 0.4) 20deg,
                rgba(192, 132, 252, 0.4) 30deg,
                transparent 30deg,
                transparent 50deg
              )`,
            clipPath: 'circle(45% at 50% 50%)'
          }}
        />
        
        {/* Bright center core */}
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
          style={{
            width: `${size * 0.2}px`,
            height: `${size * 0.2}px`,
            boxShadow: `0 0 ${size * 0.4}px rgba(255, 255, 255, 0.9)`
          }}
        />
      </div>
    </motion.div>
  );
}
