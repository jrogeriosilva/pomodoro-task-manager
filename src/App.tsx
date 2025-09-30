import React from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { AppProvider, useApp } from './context/AppContext';
import { darkTheme } from './theme/darkTheme';
import Header from './components/Header/Header';
import TaskList from './components/TaskList/TaskList';
import FocusView from './components/Timer/FocusView';
import BreakView from './components/Timer/BreakView';

const AppContent: React.FC = () => {
  const { viewMode } = useApp();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Header />
      {viewMode === 'taskList' && <TaskList />}
      {viewMode === 'focus' && <FocusView />}
      {viewMode === 'break' && <BreakView />}
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
