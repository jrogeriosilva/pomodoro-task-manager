import React, { useEffect, useRef } from 'react';
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
  const { 
    activeTask, 
    setViewMode, 
    incrementPomodoro, 
    settings, 
    setShowTomatoThrow, 
    addTomatoPoints, 
    cyclesCompleted,
    incrementCycle 
  } = useApp();
  
  const completionHandled = useRef(false);
  
  const focusTimer = useTimer({
    onComplete: handleTimerComplete,
  });
  const { timerState, startTimer, pauseTimer, resumeTimer, stopTimer, formatTime } = focusTimer;

  function handleTimerComplete() {
    // Set a flag to handle completion in useEffect
    completionHandled.current = true;
  }

  // Handle timer completion in useEffect to avoid state update during render
  useEffect(() => {
    if (completionHandled.current && timerState.mode === 'focus' && activeTask && !timerState.isActive && timerState.timeRemaining === 0) {
      completionHandled.current = false;

      // Defer state updates to next tick
      setTimeout(() => {
        // Increment pomodoro count for the task
        incrementPomodoro(activeTask.id);
        incrementCycle();

        // Award tomato points based on focus duration (1 point per minute)
        const pointsEarned = settings.focusDuration;
        addTomatoPoints(pointsEarned);

        // Trigger confetti celebration
        triggerSideConfetti();

        // Show notifications
        if (settings.notificationsEnabled) {
          showNotification('Focus Session Complete!', `Great job! Time for a break. You earned ${pointsEarned} 🍅 points!`);
        }
        if (settings.soundEnabled) {
          playNotificationSound();
        }
        flashPageTitle(`🎉 Break Time! +${pointsEarned}🍅`);
      }, 0);
    }
  }, [timerState.isActive, timerState.timeRemaining, timerState.mode, activeTask, incrementPomodoro, incrementCycle, addTomatoPoints, settings]);

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
    // Stop the current focus timer
    stopTimer();
    
    // Switch to break view - the break view will start its own timer
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
            label={`Cycle ${cyclesCompleted + 1}`}
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
