import { motion } from 'framer-motion';

interface PixelatedPlanetProps {
  x?: number;
  y?: number;
  size?: number;
  color1?: string;
  color2?: string;
  delay?: number;
  hasRing?: boolean;
}

export function PixelatedPlanet({ 
  x = 20, 
  y = 30, 
  size = 60, 
  color1 = '#8b5cf6', 
  color2 = '#6d28d9',
  delay = 0,
  hasRing = false
}: PixelatedPlanetProps) {
  return (
    <motion.div
      className="absolute"
      style={{ left: `${x}%`, top: `${y}%` }}
      initial={{ scale: 0, opacity: 0, rotate: -180 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        rotate: 0
      }}
      transition={{
        duration: 2,
        delay
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: 'linear'
        }}
        style={{ position: 'relative' }}
      >
        {/* Planet body with pixelated pattern */}
        <div 
          className="relative rounded-full"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            background: `
              linear-gradient(135deg, 
                ${color1} 0%, ${color1} 25%,
                ${color2} 25%, ${color2} 50%,
                ${color1} 50%, ${color1} 75%,
                ${color2} 75%, ${color2} 100%
              )`,
            backgroundSize: '6px 6px',
            boxShadow: `0 0 ${size * 0.6}px rgba(139, 92, 246, 0.3), inset -${size * 0.15}px -${size * 0.15}px ${size * 0.25}px rgba(0, 0, 0, 0.3)`,
            imageRendering: 'pixelated'
          }}
        >
          {/* Surface details - pixelated squares */}
          <div 
            className="absolute top-2 left-4 w-2 h-2"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              imageRendering: 'pixelated'
            }}
          />
          <div 
            className="absolute top-1/2 right-3 w-3 h-3"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.15)',
              imageRendering: 'pixelated'
            }}
          />
          <div 
            className="absolute bottom-4 left-1/3 w-2 h-2"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              imageRendering: 'pixelated'
            }}
          />
        </div>

        {/* Pixelated ring */}
        {hasRing && (
          <div 
            className="absolute top-1/2 left-1/2 border-4"
            style={{
              width: `${size * 1.5}px`,
              height: `${size * 0.4}px`,
              borderRadius: '50%',
              borderColor: `${color1}99`,
              borderTopColor: 'transparent',
              borderBottomColor: `${color1}dd`,
              transform: 'translate(-50%, -50%) rotateX(75deg)',
              opacity: 0.6,
              boxShadow: `0 2px 8px ${color2}66`
            }}
          />
        )}
      </motion.div>

      {/* Planet glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          width: `${size * 1.4}px`,
          height: `${size * 1.4}px`,
          background: `radial-gradient(circle, ${color1}40 0%, transparent 70%)`,
          filter: 'blur(12px)',
          zIndex: -1
        }}
      />
    </motion.div>
  );
}
