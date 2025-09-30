import React from 'react';
import { Box, Typography } from '@mui/material';

interface TimerDisplayProps {
  timeString: string;
  mode: 'focus' | 'shortBreak' | 'longBreak' | 'idle';
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ timeString, mode }) => {
  const getModeColor = () => {
    switch (mode) {
      case 'focus':
        return 'primary.main';
      case 'shortBreak':
      case 'longBreak':
        return 'secondary.main';
      default:
        return 'text.primary';
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '300px',
      }}
    >
      <Typography
        variant="h1"
        component="div"
        sx={{
          fontSize: { xs: '5rem', sm: '7rem', md: '9rem' },
          fontWeight: 700,
          color: getModeColor(),
          fontFamily: 'monospace',
          letterSpacing: '0.1em',
          transition: 'all 0.3s ease',
          animation: mode !== 'idle' ? 'pulse 2s ease-in-out infinite' : 'none',
          '@keyframes pulse': {
            '0%, 100%': {
              transform: 'scale(1)',
              opacity: 1,
            },
            '50%': {
              transform: 'scale(1.05)',
              opacity: 0.9,
            },
          },
        }}
      >
        {timeString}
      </Typography>
    </Box>
  );
};

export default TimerDisplay;
