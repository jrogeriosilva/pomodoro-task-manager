import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PauseIcon from '@mui/icons-material/Pause';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import TimerDisplay from './TimerDisplay';
import { useApp } from '../../context/AppContext';
import { useTimer } from '../../hooks/useTimer';
import {
  showNotification,
  playNotificationSound,
  flashPageTitle,
} from '../../utils/notifications';

const BreakView: React.FC = () => {
  const { 
    setViewMode, 
    settings, 
    cyclesCompleted,
    getActiveEffect,
    consumeActiveEffect,
    useTimeBank,
    inventory 
  } = useApp();
  const breakTimer = useTimer({
    onComplete: handleTimerComplete,
  });
  const { timerState, startTimer, pauseTimer, resumeTimer, stopTimer, formatTime } = breakTimer;

  function handleTimerComplete() {
    // Show notifications when break ends
    if (settings.notificationsEnabled) {
      showNotification('Break Complete!', 'Ready to focus again?');
    }
    if (settings.soundEnabled) {
      playNotificationSound();
    }
    flashPageTitle('✨ Back to Work!');
  }

  // Start break timer when component mounts
  useEffect(() => {
    const isLongBreak = (cyclesCompleted % settings.cyclesForLongBreak) === 0 && cyclesCompleted > 0;
    let breakDuration = isLongBreak ? settings.longBreakDuration : settings.shortBreakDuration;
    
    // Check for Break Extender effect
    const breakExtenderEffect = getActiveEffect("extendBreak");
    if (breakExtenderEffect) {
      breakDuration += breakExtenderEffect.value;
      consumeActiveEffect("break-extender");
    }
    
    startTimer(breakDuration, isLongBreak ? 'longBreak' : 'shortBreak');
  }, []);

  const handleFinish = () => {
    stopTimer();
    setViewMode('taskList');
  };

  const isTimerComplete = !timerState.isActive && timerState.timeRemaining === 0;
  const isLongBreak = timerState.mode === 'longBreak';

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          minHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
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
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            textAlign: 'center',
            backgroundColor: 'background.paper',
            border: '2px solid',
            borderColor: 'secondary.main',
          }}
        >
          <Chip
            label={isLongBreak ? 'Long Break' : 'Short Break'}
            color="secondary"
            sx={{ mb: 2 }}
          />

          <Typography variant="h4" gutterBottom sx={{ mb: 1, color: 'secondary.main' }}>
            {isLongBreak ? '☕ Long Break Time' : '🌟 Break Time'}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Relax and recharge!
          </Typography>

          <TimerDisplay
            timeString={formatTime(timerState.timeRemaining)}
            mode={timerState.mode}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
            {!isTimerComplete && (
              <Button
                variant="contained"
                size="large"
                startIcon={timerState.isActive ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={timerState.isActive ? pauseTimer : resumeTimer}
                color="secondary"
              >
                {timerState.isActive ? 'Pause' : 'Resume'}
              </Button>
            )}

            {inventory.timeBank > 0 && (
              <Button
                variant="outlined"
                size="large"
                onClick={() => {
                  const minutesToAdd = Math.min(5, inventory.timeBank);
                  if (useTimeBank(minutesToAdd)) {
                    const newDuration = timerState.timeRemaining + (minutesToAdd * 60);
                    // We need to update the timer state with the new duration
                    if (timerState.mode !== 'idle') {
                      startTimer(Math.ceil(newDuration / 60), timerState.mode);
                    }
                  }
                }}
                color="info"
                sx={{ mr: 1 }}
              >
                🏦 Use Time Bank (+5 min)
              </Button>
            )}

            <Button
              variant="contained"
              size="large"
              startIcon={<CheckCircleIcon />}
              onClick={handleFinish}
              color="secondary"
            >
              {isTimerComplete ? 'Back to Tasks' : 'Skip Break'}
            </Button>
          </Box>

          {inventory.timeBank > 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              🏦 Time Bank: {inventory.timeBank} minutes available
            </Typography>
          )}

          {isTimerComplete && (
            <Typography
              variant="h6"
              color="secondary.main"
              sx={{ mt: 3, animation: 'pulse 1.5s infinite' }}
            >
              ✨ Break complete! Ready for another session?
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default BreakView;
