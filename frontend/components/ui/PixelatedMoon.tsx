import { motion } from 'framer-motion';

export function PixelatedMoon() {
  return (
    <motion.div
      className="absolute top-12 right-20"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.5, delay: 0.3 }}
    >
      <div className="relative w-24 h-24">
        {/* Moon pixelated circle */}
        <div 
          className="absolute inset-0"
          style={{
            background: `
              linear-gradient(135deg, 
                #e5e7eb 0%, #e5e7eb 25%,
                #d1d5db 25%, #d1d5db 50%,
                #e5e7eb 50%, #e5e7eb 75%,
                #d1d5db 75%, #d1d5db 100%
              )`,
            backgroundSize: '8px 8px',
            borderRadius: '50%',
            boxShadow: '0 0 40px rgba(229, 231, 235, 0.5), inset -10px -10px 20px rgba(0, 0, 0, 0.15)',
            imageRendering: 'pixelated'
          }}
        />
        
        {/* Pixelated craters */}
        <div className="absolute top-5 left-4 w-4 h-4 bg-gray-400 opacity-40" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)' }} />
        <div className="absolute top-12 right-6 w-6 h-6 bg-gray-400 opacity-30" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)' }} />
        <div className="absolute bottom-7 left-8 w-3 h-3 bg-gray-400 opacity-35" style={{ clipPath: 'polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)' }} />
        
        {/* Moon glow */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)',
            filter: 'blur(15px)'
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>
    </motion.div>
  );
}
