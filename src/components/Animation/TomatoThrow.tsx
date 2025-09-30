import React, { useEffect, useState } from 'react';
import { Box } from '@mui/material';

interface TomatoThrowProps {
  isVisible: boolean;
  onAnimationComplete: () => void;
  onSplatter?: () => void;
}

const TomatoThrow: React.FC<TomatoThrowProps> = ({ isVisible, onAnimationComplete, onSplatter }) => {
  const [showSplatter, setShowSplatter] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Show splatter effect when tomato hits
      const splatterTimer = setTimeout(() => {
        setShowSplatter(true);
        onSplatter?.(); // Trigger confetti splatter effect
      }, 1200); // Timing matches the throw animation

      // Complete animation and clean up
      const completeTimer = setTimeout(() => {
        setShowSplatter(false);
        onAnimationComplete();
      }, 3000); // Extended duration to see full effect

      return () => {
        clearTimeout(splatterTimer);
        clearTimeout(completeTimer);
      };
    } else {
      // Reset splatter state when not visible
      setShowSplatter(false);
    }
  }, [isVisible, onAnimationComplete, onSplatter]);

  if (!isVisible) return null;

  return (
    <>
      {/* Tomato flying animation */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 10000,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            fontSize: '60px',
            animation: 'tomatoThrow 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards',
            filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))',
            '@keyframes tomatoThrow': {
              '0%': {
                left: '-100px',
                top: '20%',
                transform: 'rotate(0deg) scale(1)',
                opacity: 1,
                filter: 'drop-shadow(3px 3px 6px rgba(0,0,0,0.3))',
              },
              '30%': {
                left: '30%',
                top: '5%',
                transform: 'rotate(108deg) scale(1.1)',
                opacity: 1,
                filter: 'drop-shadow(5px 5px 10px rgba(0,0,0,0.4))',
              },
              '60%': {
                left: '50%',
                top: '25%',
                transform: 'rotate(216deg) scale(1.2)',
                opacity: 1,
                filter: 'drop-shadow(4px 4px 8px rgba(0,0,0,0.4))',
              },
              '90%': {
                left: '60%',
                top: '45%',
                transform: 'rotate(324deg) scale(0.9)',
                opacity: 0.8,
                filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))',
              },
              '100%': {
                left: '65%',
                top: '50%',
                transform: 'rotate(360deg) scale(0.3)',
                opacity: 0,
                filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0))',
              },
            },
          }}
        >
          🍅
        </Box>
      </Box>

      {/* Splatter effect */}
      {showSplatter && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 10001, // Higher than tomato z-index
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          {/* Main splat */}
          <Box
            sx={{
              width: '250px',
              height: '250px',
              background: 'radial-gradient(ellipse 60% 40%, #ff4444 10%, #cc0000 30%, #990000 50%, transparent 70%)',
              borderRadius: '50% 40% 60% 30%',
              opacity: 0.85,
              animation: 'splatterGrow 0.4s ease-out forwards',
              transform: 'rotate(15deg)',
              '@keyframes splatterGrow': {
                '0%': {
                  transform: 'scale(0) rotate(15deg)',
                  opacity: 0,
                },
                '30%': {
                  transform: 'scale(2) rotate(15deg)',
                  opacity: 1,
                },
                '100%': {
                  transform: 'scale(1) rotate(15deg)',
                  opacity: 0.8,
                },
              },
            }}
          />
          
          {/* Juice droplets */}
          {[...Array(8)].map((_, i) => (
            <Box
              key={i}
              sx={{
                position: 'absolute',
                width: `${15 + Math.random() * 10}px`,
                height: `${15 + Math.random() * 10}px`,
                background: i % 2 === 0 ? '#ff4444' : '#cc0000',
                borderRadius: '50%',
                animation: `juiceDrop${i} 0.8s ease-out forwards`,
                [`@keyframes juiceDrop${i}`]: {
                  '0%': {
                    transform: `translate(0, 0) scale(1)`,
                    opacity: 1,
                  },
                  '100%': {
                    transform: `translate(${(Math.cos(i * 45 * Math.PI / 180) * (80 + Math.random() * 40))}px, ${(Math.sin(i * 45 * Math.PI / 180) * (80 + Math.random() * 40))}px) scale(0.2)`,
                    opacity: 0,
                  },
                },
              }}
            />
          ))}

          {/* Secondary splatter marks */}
          {[...Array(6)].map((_, i) => (
            <Box
              key={`splat-${i}`}
              sx={{
                position: 'absolute',
                width: `${20 + i * 5}px`,
                height: `${15 + i * 3}px`,
                background: '#cc0000',
                borderRadius: '50% 30% 60% 40%',
                opacity: 0.6,
                animation: `splatterMark${i} 0.6s ease-out forwards`,
                transform: `translate(${(i - 3) * 40}px, ${(i - 3) * 30}px) rotate(${i * 60}deg)`,
                [`@keyframes splatterMark${i}`]: {
                  '0%': {
                    transform: `translate(${(i - 3) * 20}px, ${(i - 3) * 15}px) rotate(${i * 60}deg) scale(0)`,
                    opacity: 0,
                  },
                  '50%': {
                    transform: `translate(${(i - 3) * 35}px, ${(i - 3) * 25}px) rotate(${i * 60}deg) scale(1.2)`,
                    opacity: 0.8,
                  },
                  '100%': {
                    transform: `translate(${(i - 3) * 40}px, ${(i - 3) * 30}px) rotate(${i * 60}deg) scale(1)`,
                    opacity: 0.5,
                  },
                },
              }}
            />
          ))}

          {/* Impact text */}
          <Box
            sx={{
              position: 'absolute',
              fontSize: '48px',
              fontWeight: 'bold',
              color: '#ff4444',
              textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
              animation: 'impactText 1s ease-out forwards',
              '@keyframes impactText': {
                '0%': {
                  transform: 'scale(0) rotate(-10deg)',
                  opacity: 0,
                },
                '20%': {
                  transform: 'scale(1.5) rotate(5deg)',
                  opacity: 1,
                },
                '50%': {
                  transform: 'scale(1.2) rotate(-2deg)',
                  opacity: 1,
                },
                '100%': {
                  transform: 'scale(1) rotate(0deg)',
                  opacity: 0.7,
                },
              },
            }}
          >
            SPLAT!
          </Box>
        </Box>
      )}
    </>
  );
};

export default TomatoThrow;