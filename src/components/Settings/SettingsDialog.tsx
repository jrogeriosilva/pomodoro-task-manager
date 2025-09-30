import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import { useApp } from '../../context/AppContext';
import { requestNotificationPermission } from '../../utils/notifications';

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ open, onClose }) => {
  const { settings, updateSettings } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings, open]);

  const handleSave = async () => {
    // Request notification permission if enabling notifications
    if (localSettings.notificationsEnabled && !settings.notificationsEnabled) {
      const granted = await requestNotificationPermission();
      if (!granted) {
        setLocalSettings((prev) => ({ ...prev, notificationsEnabled: false }));
        alert('Notification permission denied. Please enable in browser settings.');
        return;
      }
    }

    updateSettings(localSettings);
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setLocalSettings((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Settings</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
          <Typography variant="h6" color="primary">
            Timer Durations (minutes)
          </Typography>

          <TextField
            label="Focus Duration"
            type="number"
            value={localSettings.focusDuration}
            onChange={(e) =>
              handleChange('focusDuration', Math.max(1, parseInt(e.target.value) || 25))
            }
            inputProps={{ min: 1, max: 60 }}
            fullWidth
          />

          <TextField
            label="Short Break Duration"
            type="number"
            value={localSettings.shortBreakDuration}
            onChange={(e) =>
              handleChange('shortBreakDuration', Math.max(1, parseInt(e.target.value) || 5))
            }
            inputProps={{ min: 1, max: 30 }}
            fullWidth
          />

          <TextField
            label="Long Break Duration"
            type="number"
            value={localSettings.longBreakDuration}
            onChange={(e) =>
              handleChange('longBreakDuration', Math.max(1, parseInt(e.target.value) || 15))
            }
            inputProps={{ min: 1, max: 60 }}
            fullWidth
          />

          <TextField
            label="Cycles Before Long Break"
            type="number"
            value={localSettings.cyclesForLongBreak}
            onChange={(e) =>
              handleChange('cyclesForLongBreak', Math.max(1, parseInt(e.target.value) || 4))
            }
            inputProps={{ min: 1, max: 10 }}
            fullWidth
            helperText="Number of focus sessions before taking a long break"
          />

          <Divider />

          <Typography variant="h6" color="primary">
            Notifications
          </Typography>

          <FormControlLabel
            control={
              <Switch
                checked={localSettings.soundEnabled}
                onChange={(e) => handleChange('soundEnabled', e.target.checked)}
              />
            }
            label="Sound Notifications"
          />

          <FormControlLabel
            control={
              <Switch
                checked={localSettings.notificationsEnabled}
                onChange={(e) => handleChange('notificationsEnabled', e.target.checked)}
              />
            }
            label="Browser Notifications"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save Settings
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SettingsDialog;
