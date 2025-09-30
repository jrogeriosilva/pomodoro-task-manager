import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Paper,
  InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../../context/AppContext';

const TaskForm: React.FC = () => {
  const [taskText, setTaskText] = useState('');
  const [pomodoros, setPomodoros] = useState<number>(1);
  const { addTask } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskText.trim() && pomodoros > 0) {
      addTask(taskText.trim(), pomodoros);
      setTaskText('');
      setPomodoros(1);
    }
  };

  return (
    <Paper
      component="form"
      onSubmit={handleSubmit}
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: 'background.paper',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
        <TextField
          fullWidth
          label="Task Description"
          variant="outlined"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="What are you working on?"
          required
        />
        <TextField
          label="Pomodoros"
          type="number"
          variant="outlined"
          value={pomodoros}
          onChange={(e) => setPomodoros(Math.max(1, parseInt(e.target.value) || 1))}
          inputProps={{ min: 1, max: 20 }}
          sx={{ width: '140px' }}
          InputProps={{
            endAdornment: <InputAdornment position="end">🍅</InputAdornment>,
          }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          startIcon={<AddIcon />}
          sx={{ height: '56px', minWidth: '120px' }}
        >
          Add Task
        </Button>
      </Box>
    </Paper>
  );
};

export default TaskForm;
