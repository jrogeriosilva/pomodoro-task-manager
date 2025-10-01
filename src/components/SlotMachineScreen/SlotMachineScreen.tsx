import React from 'react';
import { Container, Box, Button, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SlotMachine from '../SlotMachine/SlotMachine';
import { useApp } from '../../context/AppContext';

const SlotMachineScreen: React.FC = () => {
  const { setViewMode } = useApp();

  const handleBackToTasks = () => {
    setViewMode('taskList');
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 4,
        animation: 'fadeIn 0.5s ease-in',
        '@keyframes fadeIn': {
          from: {
            opacity: 0,
            transform: 'translateY(20px)',
          },
          to: {
            opacity: 1,
            transform: 'translateY(0)',
          },
        },
      }}
    >
      {/* Header with Back Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBackToTasks}
          color="primary"
          sx={{ mr: 2 }}
        >
          Back to Tasks
        </Button>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, color: 'primary.main' }}>
          🎰 Fortune Tiger Casino
        </Typography>
      </Box>

      {/* Slot Machine Component */}
      <SlotMachine />

      {/* Additional Info */}
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Use your earned tomato points to try your luck! 🍅
        </Typography>
        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
          Complete Pomodoro sessions to earn more points for playing.
        </Typography>
      </Box>
    </Container>
  );
};

export default SlotMachineScreen;