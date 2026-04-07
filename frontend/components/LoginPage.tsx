import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: () => void;
}

export function LoginPage({ onBack,onLoginSuccess }: LoginPageProps) {
  return (
    <div 
      className="fixed inset-0 overflow-hidden flex items-center justify-center"
      style={{
        background: 'linear-gradient(to bottom, #8b5cf6 0%, #8b5cf6 20%, #f012be 35%, #f012be 50%, #ff6b35 65%, #ff6b35 80%, #ffb399 100%)'
      }}
    >
      
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 px-16 py-24 rounded-none border-8 border-black"
        style={{
          boxShadow: '8px 8px 0px rgba(0, 0, 0, 0.32)',
          background: 'rgba(255, 255, 255, 0.8)',
          minHeight: '550px',
          minWidth: '430px'
        }}
      >
        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 hover:bg-black/10 border-4 border-black"
          style={{ 
            imageRendering: 'pixelated',
            color: 'black'
          }}
        >
          <ArrowLeft className="w-8 h-8" />
        </button>

        <h2 
          className="text-center mb-8 tracking-wider"
          style={{
            fontSize: '3.5rem',
            textShadow: '3px 3px 0px rgba(0,0,0,0.2)',
            fontFamily: 'monospace',
            color: 'black',
            marginTop: '30px'
          }}
        >
          Login
        </h2>

        <div className="space-y-6 min-w-[300px]" 
        style={{ 
          marginTop: '20px' ,
          display: 'flex', 
          flexDirection: 'column', 
          gap: '5px',
          alignItems: 'center'
          }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label 
              className="block mb-2 tracking-wide"
              style={{ 
                 fontFamily: 'monospace',
                 fontWeight: '500',
                 color: 'black'
                }}
            >
              Username
            </label>
            <input
              type="text"
              className="w-64 p-4 border-4 border-black focus:outline-none focus:border-purple-600"
              style={{
                imageRendering: 'pixelated',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
                fontFamily: 'monospace',
                color: 'black'
              }}
              placeholder="Enter username"
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label 
              className="block mb-2 tracking-wide"
              style={{ 
                fontFamily: 'monospace' ,
                color: 'black'
              }}
            >
              Password
            </label>
            <input
              type="password"
              className="w-64 p-4 border-4 border-black focus:outline-none focus:border-purple-600"
              style={{
                imageRendering: 'pixelated',
                boxShadow: '2px 2px 0px rgba(0,0,0,0.3)',
                fontFamily: 'monospace',
                color: 'black'
              }}
              placeholder="Enter password"
            />
          </div>

          <div className='flex justify-center' style={{ marginTop: '25px' }}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick = {onLoginSuccess}
              className="w-64 p-4 bg-purple-600 text-white border-4 border-black tracking-wide"
              style={{
                background: 'rgb(242, 250, 98)',
                color: "black",
                boxShadow: '3px 3px 0px rgba(0,0,0,0.8)',
                imageRendering: 'pixelated',
                fontFamily: 'monospace',
                fontWeight: '700'
              }}
          >
              START GAME
            </motion.button>
          </div>
          

          <p 
            className="text-center text-sm tracking-wide"
            style={{ 
              fontFamily: 'monospace' ,
              color: 'black'
            }}
          >
            New Player? <span className="text-purple-600 cursor-pointer hover:underline">Sign Up</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
