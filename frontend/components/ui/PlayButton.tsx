import { motion } from 'framer-motion';

interface PlayButtonProps {
  onClick: () => void;
}

export function PlayButton({ onClick }: PlayButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      className="relative z-50 pixel-borders overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #f7ff19e0 0%, #e6fb5a 100%)',
        padding: '22px 32px',
        imageRendering: 'pixelated',
        fontFamily: '"Press Start 2P", cursive',
        fontSize: '1.25rem',
        letterSpacing: '0.1em',
        textShadow: '2px 2px 0px rgba(0, 0, 0, 0.3)'
      }}
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.95,
      }}
      initial={{ y: 20, opacity: 0 }}
      animate={{
        y: 0,
        opacity: 1,
      }}
      transition={{
        delay: 0.5,
        type: "spring",
        stiffness: 200
      }}
    >
      {/* Pixelated shine effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.4) 50%, transparent 100%)',
          imageRendering: 'pixelated'
        }}
        initial={{ x: '-100%' }}
        animate={{ x: '200%' }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatDelay: 1,
          ease: 'linear'
        }}
      />

      {/* Pixel corners decoration */}
      <div className="absolute top-2 left-2 w-2 h-2 bg-white opacity-60" style={{ imageRendering: 'pixelated' }} />
      <div className="absolute top-2 right-2 w-2 h-2 bg-white opacity-60" style={{ imageRendering: 'pixelated' }} />
      <div className="absolute bottom-2 left-2 w-2 h-2 bg-black opacity-40" style={{ imageRendering: 'pixelated' }} />
      <div className="absolute bottom-2 right-2 w-2 h-2 bg-black opacity-40" style={{ imageRendering: 'pixelated' }} />

      <span className="relative flex items-center justify-center gap-4 text-[#1a0f2e]">
        {/* Pixelated play icon */}
        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" style={{ imageRendering: 'pixelated' }}>
          <rect x="0" y="8" width="4" height="8" fill="currentColor" />
          <rect x="4" y="4" width="4" height="16" fill="currentColor" />
          <rect x="8" y="0" width="4" height="24" fill="currentColor" />
          <rect x="12" y="4" width="4" height="16" fill="currentColor" />
          <rect x="16" y="8" width="4" height="8" fill="currentColor" />
        </svg>
        START
      </span>

      {/* Pulsing glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          boxShadow: '0 0 20px rgba(255, 217, 61, 0.6)',
          borderRadius: '0'
        }}
        animate={{
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </motion.button>
  );
}
