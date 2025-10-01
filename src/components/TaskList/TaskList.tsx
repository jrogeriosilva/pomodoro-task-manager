import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import TaskForm from '../TaskForm/TaskForm';
import TaskItem from '../TaskItem/TaskItem';
import SlotMachine from '../SlotMachine/SlotMachine';
import { useApp } from '../../context/AppContext';

const TaskList: React.FC = () => {
  const { tasks, settings } = useApp();

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
      <TaskForm />

      {/* Show Slot Machine if Fortune Tiger Mode is enabled */}
      {settings.fortuneTigerMode && <SlotMachine />}

      {tasks.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            color: 'text.secondary',
          }}
        >
          <Typography variant="h6" gutterBottom>
            No tasks yet
          </Typography>
          <Typography variant="body2">
            Add your first task to get started with the Pomodoro technique!
          </Typography>
        </Box>
      ) : (
        <Box>
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} />
          ))}
        </Box>
      )}
    </Container>
  );
};

export default TaskList;
