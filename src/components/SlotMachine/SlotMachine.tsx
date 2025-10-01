import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  TextField,
  Chip,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import { useApp } from '../../context/AppContext';
import { triggerConfetti } from '../../utils/confetti';

interface SlotMachineProps {
  onWin?: (points: number) => void;
  onLose?: () => void;
}

const SlotMachine: React.FC<SlotMachineProps> = ({ onWin, onLose }) => {
  const { tomatoPoints, spendTomatoPoints, addTomatoPoints } = useApp();
  const [bet, setBet] = useState(1);
  const [isSpinning, setIsSpinning] = useState(false);
  const [reels, setReels] = useState(['🍅', '🍅', '🍅']);
  const [lastResult, setLastResult] = useState<{ win: boolean; amount: number } | null>(null);
  const [spinProgress, setSpinProgress] = useState(0);

  const symbols = ['🍅', '🍒', '🍋', '🍊', '🍇', '⭐', '💎'];
  const spinDuration = 2000; // 2 seconds

  // Payout table based on symbols
  const getWinAmount = (reels: string[], bet: number): number => {
    const [reel1, reel2, reel3] = reels;
    
    // Three matching symbols
    if (reel1 === reel2 && reel2 === reel3) {
      switch (reel1) {
        case '💎': return bet * 50; // Diamond: 50x
        case '⭐': return bet * 20; // Star: 20x
        case '🍅': return bet * 10; // Tomato: 10x
        case '🍇': return bet * 8;  // Grape: 8x
        case '🍊': return bet * 6;  // Orange: 6x
        case '🍋': return bet * 4;  // Lemon: 4x
        case '🍒': return bet * 3;  // Cherry: 3x
        default: return bet * 2;
      }
    }
    
    // Two matching symbols
    if (reel1 === reel2 || reel2 === reel3 || reel1 === reel3) {
      const matchingSymbol = reel1 === reel2 ? reel1 : (reel2 === reel3 ? reel2 : reel1);
      switch (matchingSymbol) {
        case '💎': return bet * 5;
        case '⭐': return bet * 3;
        case '🍅': return bet * 2;
        default: return Math.floor(bet * 1.5);
      }
    }

    // No match
    return 0;
  };

  const spinReels = async () => {
    if (bet > tomatoPoints.total) {
      alert('Not enough tomato points!');
      return;
    }

    if (bet < 1) {
      alert('Minimum bet is 1 tomato point!');
      return;
    }

    // Spend the bet amount
    if (!spendTomatoPoints(bet)) {
      alert('Not enough tomato points!');
      return;
    }

    setIsSpinning(true);
    setSpinProgress(0);
    setLastResult(null);

    // Animate spinning progress
    const progressInterval = setInterval(() => {
      setSpinProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + (100 / (spinDuration / 50));
      });
    }, 50);

    // Animate reels spinning
    const spinInterval = setInterval(() => {
      setReels([
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
        symbols[Math.floor(Math.random() * symbols.length)],
      ]);
    }, 100);

    // Stop spinning and determine result
    setTimeout(() => {
      clearInterval(spinInterval);
      
      // Generate final result with weighted probabilities
      const random = Math.random();
      let finalReels: string[];

      if (random < 0.02) { // 2% chance for jackpot (three diamonds)
        finalReels = ['💎', '💎', '💎'];
      } else if (random < 0.05) { // 3% chance for three stars
        finalReels = ['⭐', '⭐', '⭐'];
      } else if (random < 0.1) { // 5% chance for three tomatoes
        finalReels = ['🍅', '🍅', '🍅'];
      } else if (random < 0.2) { // 10% chance for other three-of-a-kind
        const symbol = symbols[Math.floor(Math.random() * (symbols.length - 2)) + 2]; // Exclude diamonds and stars
        finalReels = [symbol, symbol, symbol];
      } else if (random < 0.4) { // 20% chance for two matching
        const symbol = symbols[Math.floor(Math.random() * symbols.length)];
        const otherSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        finalReels = [symbol, symbol, otherSymbol];
      } else { // 60% chance for no match
        finalReels = [
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
          symbols[Math.floor(Math.random() * symbols.length)],
        ];
        // Ensure no accidental matches
        while (finalReels[0] === finalReels[1] || finalReels[1] === finalReels[2] || finalReels[0] === finalReels[2]) {
          finalReels = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
          ];
        }
      }

      setReels(finalReels);
      const winAmount = getWinAmount(finalReels, bet);
      
      if (winAmount > 0) {
        addTomatoPoints(winAmount);
        setLastResult({ win: true, amount: winAmount });
        onWin?.(winAmount);
        triggerConfetti();
      } else {
        setLastResult({ win: false, amount: bet });
        onLose?.();
      }

      setIsSpinning(false);
    }, spinDuration);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 3,
        background: 'linear-gradient(135deg, #1E1E1E 0%, #2A2A2A 100%)',
        color: 'white',
        border: '2px solid',
        borderColor: 'primary.main',
        borderRadius: 3,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(255, 107, 107, 0.2)',
        },
      }}
    >
      <Box sx={{ textAlign: 'center', mb: 3 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main' }}>
          🎰 Fortune Tiger Slot Machine
        </Typography>
        <Typography variant="body2" sx={{ opacity: 0.8, color: 'text.secondary' }}>
          Spin the reels to multiply your tomato points!
        </Typography>
      </Box>

      {/* Slot Machine Reels */}
      <Card sx={{ 
        mb: 3, 
        backgroundColor: 'background.paper', 
        border: '1px solid', 
        borderColor: 'divider', 
        borderRadius: 2,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
            {reels.map((symbol, index) => (
              <Box
                key={index}
                sx={{
                  width: 80,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'background.default',
                  border: '2px solid',
                  borderColor: 'primary.main',
                  borderRadius: 2,
                  fontSize: '2.5rem',
                  animation: isSpinning ? 'spin 0.1s linear infinite' : 'none',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    boxShadow: '0 4px 12px rgba(255, 107, 107, 0.3)',
                  },
                  '@keyframes spin': {
                    '0%': { transform: 'rotateY(0deg)' },
                    '100%': { transform: 'rotateY(360deg)' },
                  },
                }}
              >
                {symbol}
              </Box>
            ))}
          </Box>

          {isSpinning && (
            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={spinProgress}
                sx={{
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: 'background.default',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: 'primary.main',
                  },
                }}
              />
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Betting Controls */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 3 }}>
        <TextField
          label="Bet Amount"
          type="number"
          value={bet}
          onChange={(e) => setBet(Math.max(1, Math.min(tomatoPoints.total, parseInt(e.target.value) || 1)))}
          inputProps={{ min: 1, max: tomatoPoints.total }}
          size="small"
          sx={{ 
            width: 120,
            '& .MuiOutlinedInput-root': {
              '&:hover fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Button
          variant="contained"
          size="large"
          startIcon={<CasinoIcon />}
          onClick={spinReels}
          disabled={isSpinning || tomatoPoints.total < bet}
          color="primary"
          sx={{
            fontWeight: 700,
            borderRadius: 2,
            px: 4,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          }}
        >
          {isSpinning ? 'Spinning...' : 'SPIN!'}
        </Button>
      </Box>

      {/* Result Display */}
      {lastResult && (
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          {lastResult.win ? (
            <Chip
              label={`🎉 YOU WON ${lastResult.amount} POINTS! 🎉`}
              color="success"
              sx={{ 
                fontWeight: 700, 
                fontSize: '1rem', 
                p: 2,
                animation: 'pulse 1.5s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                },
              }}
            />
          ) : (
            <Chip
              label={`Lost ${lastResult.amount} points. Try again!`}
              color="error"
              sx={{ fontWeight: 700, fontSize: '1rem', p: 2 }}
            />
          )}
        </Box>
      )}

      {/* Payout Table */}
      <Box sx={{ mt: 3 }}>
        <Typography variant="h6" gutterBottom sx={{ color: 'secondary.main', textAlign: 'center' }}>
          💰 Payout Table
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, fontSize: '0.8rem' }}>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: 'text.primary', mb: 0.5 }}>💎💎💎 = 50x bet</Typography>
            <Typography sx={{ color: 'text.primary', mb: 0.5 }}>⭐⭐⭐ = 20x bet</Typography>
            <Typography sx={{ color: 'text.primary', mb: 0.5 }}>🍅🍅🍅 = 10x bet</Typography>
            <Typography sx={{ color: 'text.primary', mb: 0.5 }}>🍇🍇🍇 = 8x bet</Typography>
          </Box>
          <Box sx={{ flex: 1 }}>
            <Typography sx={{ color: 'text.primary', mb: 0.5 }}>🍊🍊🍊 = 6x bet</Typography>
            <Typography sx={{ color: 'text.primary', mb: 0.5 }}>🍋🍋🍋 = 4x bet</Typography>
            <Typography sx={{ color: 'text.primary', mb: 0.5 }}>🍒🍒🍒 = 3x bet</Typography>
            <Typography sx={{ color: 'text.primary', mb: 0.5 }}>Two match = 1.5-5x bet</Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default SlotMachine;