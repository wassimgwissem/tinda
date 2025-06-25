import { useEffect, useState } from 'react';
import logoicon from "./src/icons/navicon.png";

const LoadingScreen = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
background: 'linear-gradient(150deg, #212529 0%, #3E3E3E 50%, #E9E8E8 100%)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 9999,
      animation: 'fadeOut 0.5s ease-out 2s forwards'
    }}>
      <img 
        src={logoicon} 
        alt="Loading" 
        style={{
          width: '150px',
          height: '150px',
          objectFit: 'contain',
          animation: 'pulse 1.5s ease-in-out infinite'
        }}
      />
      
      {/* Add CSS animations */}
      <style>{`
        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(0.95); opacity: 0.8; }
        }
        @keyframes fadeOut {
          to { opacity: 0; visibility: hidden; }
        }
      `}</style>
    </div>
  );
};
export default LoadingScreen;