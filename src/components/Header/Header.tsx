import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Chip, Button } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import CasinoIcon from '@mui/icons-material/Casino';
import SettingsDialog from '../Settings/SettingsDialog';
import { useApp } from '../../context/AppContext';

const Header: React.FC = () => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { tomatoPoints, checkAndResetDaily, settings, setViewMode } = useApp();

  const handleGoToSlotMachine = () => {
    setViewMode('slotMachine');
  };

  // Check for daily reset on component mount
  useEffect(() => {
    checkAndResetDaily();
  }, [checkAndResetDaily]);

  return (
    <>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Typography variant="h6" component="h1" sx={{ fontWeight: 700 }}>
              🍅 Pomodoro Task Manager
            </Typography>
          </Box>
          
          {/* Tomato Points Display */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mr: 2 }}>
            <Chip
              icon={<span style={{ fontSize: '16px' }}>🍅</span>}
              label={`${tomatoPoints.total} Points`}
              color="secondary"
              variant="outlined"
              sx={{ 
                fontWeight: 600,
                '& .MuiChip-icon': {
                  fontSize: '16px'
                }
              }}
            />
            <Typography variant="caption" color="inherit" sx={{ opacity: 0.7 }}>
              Today: +{tomatoPoints.earnedToday}
            </Typography>
          </Box>

          {/* Fortune Tiger Casino Button */}
          {settings.fortuneTigerMode && (
            <Button
              startIcon={<CasinoIcon />}
              onClick={handleGoToSlotMachine}
              disabled={tomatoPoints.total === 0}
              color="inherit"
              sx={{
                mr: 1,
                fontWeight: 600,
                borderRadius: 2,
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: 'rgba(255, 107, 107, 0.1)',
                },
                '&:disabled': {
                  opacity: 0.5,
                },
              }}
            >
              Casino
            </Button>
          )}

          <IconButton
            color="inherit"
            onClick={() => setSettingsOpen(true)}
            aria-label="settings"
          >
            <SettingsIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <SettingsDialog
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </>
  );
};

export default Header;
