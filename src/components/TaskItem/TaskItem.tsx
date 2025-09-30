import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  Checkbox,
  LinearProgress,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task } from '../../types';
import { useApp } from '../../context/AppContext';
import { triggerConfetti } from '../../utils/confetti';

interface TaskItemProps {
  task: Task;
}

const TaskItem: React.FC<TaskItemProps> = ({ task }) => {
  const { updateTask, deleteTask, toggleTaskComplete, setActiveTask, setViewMode, setShowTomatoThrow } = useApp();
  const [editOpen, setEditOpen] = useState(false);
  const [editText, setEditText] = useState(task.text);
  const [editPomodoros, setEditPomodoros] = useState(task.totalPomodoros);

  const progress = (task.pomodorosCompleted / task.totalPomodoros) * 100;

  const handlePlay = () => {
    setShowTomatoThrow(false); // Reset tomato animation state
    setActiveTask(task);
    setViewMode('focus');
  };

  const handleEdit = () => {
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (editText.trim()) {
      updateTask(task.id, {
        text: editText.trim(),
        totalPomodoros: editPomodoros,
      });
      setEditOpen(false);
    }
  };

  const handleDelete = () => {
    deleteTask(task.id);
  };

  return (
    <>
      <Card
        sx={{
          mb: 2,
          opacity: task.isCompleted ? 0.7 : 1,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          animation: 'slideIn 0.4s ease-out',
          '&:hover': {
            transform: 'translateY(-4px) scale(1.02)',
            boxShadow: 6,
          },
          '@keyframes slideIn': {
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
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Checkbox
              checked={task.isCompleted}
              onChange={() => {
                // If task is being marked as complete (not uncompleted), trigger confetti
                if (!task.isCompleted) {
                  triggerConfetti();
                }
                toggleTaskComplete(task.id);
              }}
              sx={{ mt: -1 }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="h6"
                sx={{
                  textDecoration: task.isCompleted ? 'line-through' : 'none',
                  mb: 1,
                }}
              >
                {task.text}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {task.pomodorosCompleted} / {task.totalPomodoros} Pomodoros
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{ height: 6, borderRadius: 3 }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <IconButton
                color="primary"
                onClick={handlePlay}
                disabled={task.isCompleted}
                size="small"
              >
                <PlayArrowIcon />
              </IconButton>
              <IconButton
                color="default"
                onClick={handleEdit}
                size="small"
              >
                <EditIcon />
              </IconButton>
              <IconButton
                color="error"
                onClick={handleDelete}
                size="small"
              >
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent sx={{ minWidth: 400, pt: 2 }}>
          <TextField
            fullWidth
            label="Task Description"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            type="number"
            label="Total Pomodoros"
            value={editPomodoros}
            onChange={(e) => setEditPomodoros(Math.max(1, parseInt(e.target.value) || 1))}
            inputProps={{ min: 1, max: 20 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TaskItem;
