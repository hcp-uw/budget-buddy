import { motion } from 'framer-motion';

interface PixelatedAsteroidProps {
  delay?: number;
  y?: number;
  size?: 'small' | 'medium' | 'large';
}

export function PixelatedAsteroid({ delay = 0, y = 50, size = 'medium' }: PixelatedAsteroidProps) {
  const sizes = {
    small: { width: 8, height: 8 },
    medium: { width: 12, height: 12 },
    large: { width: 16, height: 16 }
  };

  const { width, height } = sizes[size];

  return (
    <motion.div
      className="absolute"
      style={{ left: '-5%', top: `${y}%` }}
      initial={{ x: 0, rotate: 0 }}
      animate={{ 
        x: '110vw',
        rotate: 360
      }}
      transition={{
        duration: 25 + Math.random() * 10,
        delay,
        repeat: Infinity,
        ease: 'linear'
      }}
    >
      <div 
        className="relative bg-gray-700"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          clipPath: 'polygon(30% 0%, 70% 10%, 90% 30%, 100% 60%, 85% 90%, 50% 100%, 20% 95%, 0% 65%, 10% 30%)',
          boxShadow: '2px 2px 6px rgba(0, 0, 0, 0.5)',
          imageRendering: 'pixelated'
        }}
      >
        {/* Pixelated texture */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(45deg, 
                transparent 0%, transparent 40%,
                rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.3) 60%,
                transparent 60%, transparent 100%
              )`,
            backgroundSize: '4px 4px',
            imageRendering: 'pixelated'
          }}
        />
      </div>
    </motion.div>
  );
}
