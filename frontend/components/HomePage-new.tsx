import { motion } from 'framer-motion';
import { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Cloud } from './ui/Cloud';
import { Comet } from './ui/Comet';
import { PlayButton } from './ui/PlayButton';
import { PixelatedMoon } from './ui/PixelatedMoon';
import { PixelatedPlanet } from './ui/PixelatedPlanet';
import { PixelatedAsteroid } from './ui/PixelatedAsteroid';
import { Sparkle } from './ui/Sparkle';
import { GalaxySpiral } from './ui/GalaxySpiral';
import PlaidButton from '../PlaidButton';

interface HomePageProps {
  onPlayClick: (userData: { userId: string; email: string; transactions: any[] }) => void;
}

export function HomePage({ onPlayClick }: HomePageProps) {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handle Plaid login completion
  const handlePlaidSuccess = (userData: any) => {
    console.log('Plaid login successful:', userData);
    // Pass user data to dashboard
    if (userData.userId && userData.email) {
      onPlayClick({
        userId: userData.userId,
        email: userData.email,
        transactions: userData.transactions || []
      });
    }
  };

  if (showLogin) {
    return (
      <div 
        className="fixed inset-0 overflow-hidden flex items-center justify-center"
        style={{
          background: 'linear-gradient(to bottom, #8b5cf6 0%, #8b5cf6 20%, #f012be 35%, #f012be 50%, #ff6b35 65%, #ff6b35 80%, #ffb399 100%)',
          zIndex: 50
        }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="relative z-10 px-16 py-24 rounded-none border-8 border-black"
          style={{
            boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.32)',
            background: 'rgba(255, 255, 255, 0.9)',
            minHeight: '550px',
            minWidth: '430px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
          }}
        >
          <button
            onClick={() => {
              setShowLogin(false);
              setEmail('');
              setErrorMessage('');
            }}
            className="absolute top-4 left-4 p-2"
            style={{ color: 'black' }}
          >
            <ArrowLeft className="w-8 h-8" />
          </button>

          <h2 
            style={{ 
              fontSize: '3.5rem', 
              textShadow: '3px 3px 0px rgba(0,0,0,0.2)', 
              fontFamily: 'monospace', 
              color: 'black', 
              marginTop: '30px',
              marginBottom: '30px',
              textAlign: 'center'
            }}
          >
            Connect Your Bank
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%', alignItems: 'center' }}>
              <label style={{ fontFamily: 'monospace', fontWeight: '500', color: 'black', marginBottom: '8px' }}>
                Email Address
              </label>
              <input 
                type="email" 
                className="w-64 p-4 border-4 border-black focus:outline-none focus:border-purple-600" 
                placeholder="your@email.com" 
                style={{ fontFamily: 'monospace', color: 'black' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            {errorMessage && (
              <p style={{ color: 'red', fontFamily: 'monospace', fontSize: '16px', textAlign: 'center' }}>
                {errorMessage}
              </p>
            )}

              <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '280px' }}>
                <PlaidButton 
                  compact={true}
                  userEmail={email as any}
                  onBankConnected={(institutionName: string) => {
                    console.log('Bank connected:', institutionName);
                  }}
                  onTransactionsLoaded={(transactions: any[]) => {
                    console.log('Transactions loaded:', transactions);
                  }}
                  onLoginComplete={handlePlaidSuccess}
                />
              </div>
            </div>

            <p style={{ fontFamily: 'monospace', color: '#666', fontSize: '14px', textAlign: 'center', maxWidth: '300px' }}>
              We securely connect your bank account to pull your transaction data. Your credentials are never stored.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Original HomePage UI
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Original Galaxy Gradient Background */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(to bottom, #1e1b4b 0%, #3b0764 8%, #6b21a8 16%, #8b5cf6 24%, #d946ef 35%, #f012be 48%, #ff6b35 62%, #fbbf24 78%, #ffb399 90%, #ffb399 100%)'
        }}
      />

      {/* Starfield */}
      <div className="absolute inset-0">
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
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{
              duration: 3 + Math.random() * 4,
              delay: Math.random() * 5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        ))}

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

      {/* Decorative elements */}
      <GalaxySpiral x={10} y={25} size={100} delay={0.5} />
      <GalaxySpiral x={85} y={60} size={120} delay={1.2} />
      <GalaxySpiral x={50} y={15} size={90} delay={0.8} />

      <Sparkle x={15} y={18} delay={0} size={10} />
      <Sparkle x={82} y={22} delay={0.8} size={12} />
      <Sparkle x={25} y={40} delay={1.5} size={8} />

      <PixelatedMoon />

      <PixelatedPlanet x={8} y={15} size={50} color1="#8b5cf6" color2="#6d28d9" delay={0.3} hasRing={false} />
      <PixelatedPlanet x={18} y={65} size={65} color1="#a855f7" color2="#7c3aed" delay={0.6} hasRing={true} />

      <Cloud delay={0} startX={-20} y={Math.random() * 80 + 10} duration={45} size="large" />
      <Cloud delay={5} startX={-15} y={Math.random() * 80 + 10} duration={50} size="medium" />

      <Comet delay={0} />
      <Comet delay={7} />

      <PixelatedAsteroid delay={0} y={18} size="small" />
      <PixelatedAsteroid delay={10} y={38} size="medium" />

      {/* Main Content */}
      <div className="relative z-20 min-h-screen flex items-center justify-center">
        <div className="flex-col items-center gap-12">
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
            <motion.h1 
              style={{
                fontSize: '10rem',
                lineHeight: '0.85',
                fontFamily: '"Jersey 25", cursive',
                fontWeight: '400',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#ffffff',
                textShadow: '5px 5px 0px rgba(0,0,0,0.3), 10px 10px 0px rgba(0,0,0,0.2)'
              }}
              animate={{
                textShadow: [
                  '5px 5px 0px rgba(0,0,0,0.3), 10px 10px 0px rgba(0,0,0,0.2)',
                  '5px 5px 0px rgba(139,92,246,0.5), 10px 10px 0px rgba(217,70,239,0.3)'
                ]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              BUDGET<br />BUDDY
            </motion.h1>
          </motion.div>

          {/* Play Button */}
          <div className="flex justify-center relative z-30" style={{ marginTop: '40px' }}>
            <PlayButton onClick={() => setShowLogin(true)} />
          </div>
        </div>
      </div>
    </div>
  );
}
