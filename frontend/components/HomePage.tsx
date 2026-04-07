import { motion } from 'framer-motion';
import { Cloud } from './ui/Cloud';
import { Star } from './ui/Star';
import { Comet } from './ui/Comet';
import { PlayButton } from './ui/PlayButton';
import { PixelatedMoon } from './ui/PixelatedMoon';
import { PixelatedPlanet } from './ui/PixelatedPlanet';
import { ShootingStar } from './ui/ShootingStar';
import { Nebula } from './ui/Nebula';
import { PixelatedAsteroid } from './ui/PixelatedAsteroid';
import { Sparkle } from './ui/Sparkle';
import { GalaxySpiral } from './ui/GalaxySpiral';

interface HomePageProps {
  onPlayClick: () => void;
}

export function HomePage({ onPlayClick }: HomePageProps) {
  return (

    <div className="relative w-full h-screen overflow-hidden">
      {/* Original Galaxy Gradient Background - Smooth and Blended */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #1e1b4b 0%, #3b0764 8%, #6b21a8 16%, #8b5cf6 24%, #d946ef 35%, #f012be 48%, #ff6b35 62%, #fbbf24 78%, #ffb399 90%, #ffb399 100%)'
        }}
      />
      {/* Starfield with depth - multiple layers */}
      <div className="absolute inset-0">
        {/* Far away tiny stars */}
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={`far-star-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 1px rgba(255,255,255,0.5)'
            }}
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0.2, 0.8, 0.2]
            }}
            transition={{
              duration: 3 + Math.random() * 4,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}

        {/* Medium distance twinkling stars */}
        {[...Array(60)].map((_, i) => (
          <motion.div
            key={`mid-star-${i}`}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              boxShadow: '0 0 2px rgba(255,255,255,0.8)'
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0.5, 1, 0],
              scale: [0, 1, 0.8, 1, 0]
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              delay: Math.random() * 5,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
              ease: 'easeInOut'
            }}
          />
        ))}

        {/* Glitter particles - extra magical feel */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`glitter-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              background: `hsl(${Math.random() * 60 + 270}, 100%, ${Math.random() * 30 + 70}%)`,
              boxShadow: `0 0 ${Math.random() * 6 + 2}px currentColor`
            }}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0]
            }}
            transition={{
              duration: 1.5 + Math.random() * 2,
              delay: Math.random() * 8,
              repeat: Infinity,
              repeatDelay: Math.random() * 5,
              ease: 'easeInOut'
            }}
          />
        ))}
      </div>

      {/* Nebula clouds - magical glowing gas clouds */}
      <Nebula x={15} y={20} size={400} color="rgba(139, 92, 246, 0.25)" />
      <Nebula x={70} y={35} size={350} color="rgba(217, 70, 239, 0.2)" />
      <Nebula x={45} y={60} size={450} color="rgba(168, 85, 247, 0.18)" />
      <Nebula x={85} y={75} size={300} color="rgba(192, 132, 252, 0.22)" />
      <Nebula x={30} y={85} size={380} color="rgba(217, 70, 239, 0.15)" />

      {/* Galaxy Spirals */}
      <GalaxySpiral x={10} y={25} size={100} delay={0.5} />
      <GalaxySpiral x={85} y={60} size={120} delay={1.2} />
      <GalaxySpiral x={50} y={15} size={90} delay={0.8} />

      {/* Magical Sparkles scattered everywhere */}
      <Sparkle x={15} y={18} delay={0} size={10} />
      <Sparkle x={82} y={22} delay={0.8} size={12} />
      <Sparkle x={25} y={40} delay={1.5} size={8} />
      <Sparkle x={70} y={55} delay={2.2} size={14} />
      <Sparkle x={45} y={75} delay={0.5} size={10} />
      <Sparkle x={88} y={35} delay={1.8} size={11} />
      <Sparkle x={12} y={68} delay={2.5} size={9} />
      <Sparkle x={65} y={12} delay={1.2} size={13} />
      <Sparkle x={35} y={88} delay={0.3} size={10} />
      <Sparkle x={92} y={78} delay={2} size={12} />
      <Sparkle x={8} y={45} delay={1.6} size={8} />
      <Sparkle x={58} y={28} delay={0.9} size={11} />

      {/* Pixelated Moon */}
      <PixelatedMoon />

      {/* Pixelated Planets scattered across the sky */}
      <PixelatedPlanet x={8} y={15} size={50} color1="#8b5cf6" color2="#6d28d9" delay={0.3} hasRing={false} />
      <PixelatedPlanet x={18} y={65} size={65} color1="#a855f7" color2="#7c3aed" delay={0.6} hasRing={true} />
      <PixelatedPlanet x={82} y={50} size={45} color1="#c084fc" color2="#a855f7" delay={0.9} hasRing={false} />
      <PixelatedPlanet x={92} y={80} size={55} color1="#e879f9" color2="#d946ef" delay={1.2} hasRing={true} />
      <PixelatedPlanet x={5} y={85} size={40} color1="#f0abfc" color2="#e879f9" delay={1.5} hasRing={false} />

      {/* Larger animated stars */}
      <Star delay={0} x={12} y={12} />
      <Star delay={0.5} x={88} y={8} />
      <Star delay={1} x={25} y={78} />
      <Star delay={1.5} x={93} y={85} />
      <Star delay={2} x={52} y={22} />
      <Star delay={0.8} x={78} y={58} />
      <Star delay={1.2} x={18} y={42} />
      <Star delay={1.8} x={96} y={32} />
      <Star delay={0.3} x={45} y={88} />
      <Star delay={1.6} x={68} y={15} />

      {/* Shooting stars */}
      <ShootingStar delay={2} />
      <ShootingStar delay={8} />
      <ShootingStar delay={14} />
      <ShootingStar delay={20} />
      <ShootingStar delay={26} />

      {/* Animated cosmic clouds */}
      <Cloud delay={0} startX={-20} y={10} duration={45} size="large" />
      <Cloud delay={3} startX={-15} y={22} duration={50} size="medium" />
      <Cloud delay={6} startX={-18} y={35} duration={42} size="small" />
      <Cloud delay={9} startX={-20} y={48} duration={48} size="medium" />
      <Cloud delay={12} startX={-16} y={60} duration={44} size="large" />
      <Cloud delay={5} startX={-19} y={72} duration={46} size="small" />
      <Cloud delay={15} startX={-17} y={82} duration={43} size="medium" />
      <Cloud delay={8} startX={-20} y={92} duration={47} size="large" />

      {/* Comets streaking across */}
      <Comet delay={0} />
      <Comet delay={7} />
      <Comet delay={14} />
      <Comet delay={21} />
      <Comet delay={28} />

      {/* Pixelated asteroids */}
      <PixelatedAsteroid delay={0} y={18} size="small" />
      <PixelatedAsteroid delay={10} y={38} size="medium" />
      <PixelatedAsteroid delay={5} y={55} size="small" />
      <PixelatedAsteroid delay={15} y={70} size="large" />
      <PixelatedAsteroid delay={20} y={88} size="medium" />

      {/* Scan line effect for extra retro CRT feel */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.03) 2px, rgba(255,255,255,0.03) 4px)'
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="flex-col items-center gap-12">
          {/* Pixelated Title with magical glow */}
          <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="text-center"
        >
          {/* Title with bubbly effect - bigger and closer */}
          <div className="relative">
            <motion.h1 
              className="relative z-10"
              style={{
                fontSize: '10rem',
                lineHeight: '0.85',
                fontFamily: '"Jersey 25", cursive',
                fontWeight: '400',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#ffffff',
                textShadow: `
                  3px 0px 0px #000,
                  -3px 0px 0px #000,
                  0px 3px 0px #000,
                  0px -3px 0px #000,
                  3px 3px 0px #000,
                  -3px -3px 0px #000,
                  3px -3px 0px #000,
                  -3px 3px 0px #000,
                  5px 5px 0px #1a1a1a,
                  7px 7px 0px #2a2a2a,
                  9px 9px 0px #3a3a3a,
                  11px 11px 0px #4a4a4a,
                  13px 13px 0px #5a5a5a,
                  15px 15px 0px #6a6a6a,
                  17px 17px 0px #7a7a7a,
                  20px 20px 30px rgba(0,0,0,0.5)
                `,
                imageRendering: 'pixelated',
                WebkitFontSmoothing: 'none',
                MozOsxFontSmoothing: 'grayscale',
                filter: 'contrast(1.1)'
              }}
              animate={{
                textShadow: [
                  `3px 0px 0px #000, -3px 0px 0px #000, 0px 3px 0px #000, 0px -3px 0px #000,
                   3px 3px 0px #000, -3px -3px 0px #000, 3px -3px 0px #000, -3px 3px 0px #000,
                   5px 5px 0px #1a1a1a, 7px 7px 0px #2a2a2a, 9px 9px 0px #3a3a3a,
                   11px 11px 0px #4a4a4a, 13px 13px 0px #5a5a5a, 15px 15px 0px #6a6a6a,
                   17px 17px 0px #7a7a7a, 20px 20px 30px rgba(0,0,0,0.5)`,
                  `3px 0px 0px #8b5cf6, -3px 0px 0px #8b5cf6, 0px 3px 0px #8b5cf6, 0px -3px 0px #8b5cf6,
                   3px 3px 0px #8b5cf6, -3px -3px 0px #8b5cf6, 3px -3px 0px #8b5cf6, -3px 3px 0px #8b5cf6,
                   5px 5px 0px #6b21a8, 7px 7px 0px #5b1888, 9px 9px 0px #4b1070,
                   11px 11px 0px #3b0858, 13px 13px 0px #2b0640, 15px 15px 0px #1b0428,
                   17px 17px 0px #0b0210, 20px 20px 30px rgba(139,92,246,0.6)`,
                  `3px 0px 0px #d946ef, -3px 0px 0px #d946ef, 0px 3px 0px #d946ef, 0px -3px 0px #d946ef,
                   3px 3px 0px #d946ef, -3px -3px 0px #d946ef, 3px -3px 0px #d946ef, -3px 3px 0px #d946ef,
                   5px 5px 0px #b936cf, 7px 7px 0px #9926af, 9px 9px 0px #79168f,
                   11px 11px 0px #59066f, 13px 13px 0px #49054f, 15px 15px 0px #39042f,
                   17px 17px 0px #29031f, 20px 20px 30px rgba(217,70,239,0.6)`,
                  `3px 0px 0px #fbbf24, -3px 0px 0px #fbbf24, 0px 3px 0px #fbbf24, 0px -3px 0px #fbbf24,
                   3px 3px 0px #fbbf24, -3px -3px 0px #fbbf24, 3px -3px 0px #fbbf24, -3px 3px 0px #fbbf24,
                   5px 5px 0px #db9f04, 7px 7px 0px #bb8f04, 9px 9px 0px #9b7f03,
                   11px 11px 0px #7b6f02, 13px 13px 0px #5b5f01, 15px 15px 0px #3b4f00,
                   17px 17px 0px #1b3f00, 20px 20px 30px rgba(251,191,36,0.6)`,
                  `3px 0px 0px #000, -3px 0px 0px #000, 0px 3px 0px #000, 0px -3px 0px #000,
                   3px 3px 0px #000, -3px -3px 0px #000, 3px -3px 0px #000, -3px 3px 0px #000,
                   5px 5px 0px #1a1a1a, 7px 7px 0px #2a2a2a, 9px 9px 0px #3a3a3a,
                   11px 11px 0px #4a4a4a, 13px 13px 0px #5a5a5a, 15px 15px 0px #6a6a6a,
                   17px 17px 0px #7a7a7a, 20px 20px 30px rgba(0,0,0,0.5)`
                ]
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              <span className="relative inline-block">
                BUDGET
                <br />
                BUDDY
              </span>
            </motion.h1>

            {/* Highlight shine effect on top */}
            <motion.div
              className="absolute top-0 left-0 right-0 pointer-events-none"
              style={{
                fontSize: '8.5rem',
                lineHeight: '0.85',
                fontFamily: '"Jersey 25", cursive',
                fontWeight: '400',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                color: 'transparent',
                zIndex: 20
              }}
            >
              BUDGET
              <br />
              BUDDY
            </motion.div>

            {/* Magical glow around text - bubbly effect */}
            <motion.div
              className="absolute inset-0 pixelated-text"
              style={{
                fontSize: '8.5rem',
                lineHeight: '0.85',
                fontFamily: '"Jersey 25", Impact, "Arial Black", sans-serif',
                fontWeight: '900',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'transparent',
                textShadow: '0 0 50px rgba(139, 92, 246, 0.9), 0 0 80px rgba(217, 70, 239, 0.7), 0 0 100px rgba(192, 132, 252, 0.5)',
                filter: 'blur(6px)',
                zIndex: -1
              }}
              animate={{
                opacity: [0.5, 0.9, 0.5],
                scale: [1, 1.02, 1]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              BUDGET
              <br />
              BUDDY
            </motion.div>
          </div>

          {/* Pixelated stars decoration under title */}
          <motion.div 
            className="flex justify-center gap-6 mt-8"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="relative"
                animate={{ 
                  rotate: [0, 360],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 3,
                  delay: i * 0.2,
                  repeat: Infinity 
                }}
              >
                {/* Pixelated star shape */}
                <div className="relative w-8 h-8">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-300" />
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-300" />
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-300" />
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-yellow-300" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-yellow-200" style={{ boxShadow: '0 0 12px rgba(253, 224, 71, 0.8)' }} />
                </div>
              </motion.div>
            ))}
          </motion.div>
          </motion.div>

          {/* Play Button */}
          <div className="flex justify-center mt-8 relative z-30">
            <PlayButton onClick={onPlayClick} />
          </div>
        </div>
        {/* Floating magical particles */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-around pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-purple-300 rounded-full"
              style={{
                boxShadow: '0 0 8px rgba(216, 180, 254, 0.8)',
                imageRendering: 'pixelated'
              }}
              initial={{ y: '100vh', x: Math.random() * 100 - 50 }}
              animate={{ 
                y: '-20vh',
                x: [0, Math.random() * 60 - 30, 0],
                scale: [0.5, 1.2, 0.5]
              }}
              transition={{
                duration: 6 + Math.random() * 4,
                delay: i * 0.6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
