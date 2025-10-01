import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { AppProvider, useApp } from './context/AppContext';
import { darkTheme } from './theme/darkTheme';
import Header from './components/Header/Header';
import TaskList from './components/TaskList/TaskList';
import FocusView from './components/Timer/FocusView';
import BreakView from './components/Timer/BreakView';
import SlotMachineScreen from './components/SlotMachineScreen/SlotMachineScreen';
import { StoreScreen } from './components/StoreScreen/StoreScreen';
import TomatoThrow from './components/Animation/TomatoThrow';
import { triggerTomatoSplatter } from './utils/confetti';

const AppContent: React.FC = () => {
  const { viewMode, showTomatoThrow, setShowTomatoThrow } = useApp();

  const handleTomatoAnimationComplete = () => {
    setShowTomatoThrow(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <TomatoThrow 
        isVisible={showTomatoThrow} 
        onAnimationComplete={handleTomatoAnimationComplete}
        onSplatter={() => triggerTomatoSplatter()}
      />
      <Header />
      {viewMode === 'taskList' && <TaskList />}
      {viewMode === 'focus' && <FocusView />}
      {viewMode === 'break' && <BreakView />}
      {viewMode === 'slotMachine' && <SlotMachineScreen />}
      {viewMode === 'store' && <StoreScreen />}
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AppProvider>
        <AppContent />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
