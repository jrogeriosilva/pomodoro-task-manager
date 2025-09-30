import React, { useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Chip,
} from '@mui/material';
import StopIcon from '@mui/icons-material/Stop';
import CoffeeIcon from '@mui/icons-material/Coffee';
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
import { triggerSideConfetti } from '../../utils/confetti';

const FocusView: React.FC = () => {
  const { activeTask, setViewMode, incrementPomodoro, settings, setShowTomatoThrow } = useApp();
  const { timerState, startTimer, pauseTimer, resumeTimer, stopTimer, formatTime, incrementCycle } = useTimer({
    onComplete: handleTimerComplete,
  });

  function handleTimerComplete() {
    if (timerState.mode === 'focus' && activeTask) {
      // Increment pomodoro count for the task
      incrementPomodoro(activeTask.id);
      incrementCycle();

      // Trigger confetti celebration
      triggerSideConfetti();

      // Show notifications
      if (settings.notificationsEnabled) {
        showNotification('Focus Session Complete!', `Great job! Time for a break.`);
      }
      if (settings.soundEnabled) {
        playNotificationSound();
      }
      flashPageTitle('🎉 Break Time!');
    }
  }

  useEffect(() => {
    if (activeTask && !timerState.isActive && timerState.mode === 'idle') {
      // Start focus timer when entering focus view
      startTimer(settings.focusDuration, 'focus');
    }
  }, [activeTask]);

  const handleCancel = () => {
    // Start tomato throwing animation
    setShowTomatoThrow(true);
    
    // Immediately stop timer and return to task list
    stopTimer();
    setViewMode('taskList');
  };

  const handleStartBreak = () => {
    const isLongBreak =
      (timerState.cyclesCompleted % settings.cyclesForLongBreak) === 0 &&
      timerState.cyclesCompleted > 0;

    const breakDuration = isLongBreak
      ? settings.longBreakDuration
      : settings.shortBreakDuration;

    startTimer(breakDuration, isLongBreak ? 'longBreak' : 'shortBreak');
    setViewMode('break');
  };

  if (!activeTask) {
    return null;
  }

  const isTimerComplete = !timerState.isActive && timerState.timeRemaining === 0;

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
          }}
        >
          <Chip
            label={`Cycle ${timerState.cyclesCompleted + 1}`}
            color="primary"
            sx={{ mb: 2 }}
          />

          <Typography variant="h4" gutterBottom sx={{ mb: 1 }}>
            {activeTask.text}
          </Typography>

          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Pomodoro {activeTask.pomodorosCompleted + 1} of {activeTask.totalPomodoros}
          </Typography>

          <TimerDisplay
            timeString={formatTime(timerState.timeRemaining)}
            mode={timerState.mode}
          />

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              size="large"
              startIcon={<StopIcon />}
              onClick={handleCancel}
              color="error"
            >
              Cancel
            </Button>

            {!isTimerComplete && (
              <Button
                variant="contained"
                size="large"
                startIcon={timerState.isActive ? <PauseIcon /> : <PlayArrowIcon />}
                onClick={timerState.isActive ? pauseTimer : resumeTimer}
                color="primary"
              >
                {timerState.isActive ? 'Pause' : 'Resume'}
              </Button>
            )}

            <Button
              variant="contained"
              size="large"
              startIcon={<CoffeeIcon />}
              onClick={handleStartBreak}
              disabled={!isTimerComplete}
              color="secondary"
            >
              Start Break
            </Button>
          </Box>

          {isTimerComplete && (
            <Typography
              variant="h6"
              color="success.main"
              sx={{ mt: 3, animation: 'pulse 1.5s infinite' }}
            >
              🎉 Focus session complete! Take a break.
            </Typography>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default FocusView;
