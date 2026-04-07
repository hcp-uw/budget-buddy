import { motion } from 'framer-motion';

interface NebulaProps {
  x?: number;
  y?: number;
  size?: number;
  color?: string;
}

export function Nebula({ x = 30, y = 40, size = 300, color = 'rgba(139, 92, 246, 0.3)' }: NebulaProps) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: `${size}px`,
        height: `${size}px`
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ 
        opacity: [0.3, 0.6, 0.3],
        scale: [0.8, 1, 0.8],
        rotate: [0, 360]
      }}
      transition={{
        opacity: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        rotate: { duration: 60, repeat: Infinity, ease: 'linear' }
      }}
    >
      <div
        className="w-full h-full rounded-full"
        style={{
          background: `radial-gradient(ellipse at 30% 30%, ${color} 0%, transparent 70%)`,
          filter: 'blur(40px)'
        }}
      />
    </motion.div>
  );
}
