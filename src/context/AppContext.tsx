import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ViewMode, Task } from '../types';
import { useTasks } from '../hooks/useTasks';
import { useSettings } from '../hooks/useSettings';

interface AppContextType {
  // View state
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;

  // Current active task
  activeTask: Task | null;
  setActiveTask: (task: Task | null) => void;

  // Tomato animation state
  showTomatoThrow: boolean;
  setShowTomatoThrow: (show: boolean) => void;

  // Tasks management
  tasks: Task[];
  addTask: (text: string, totalPomodoros: number) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  incrementPomodoro: (id: string) => void;
  toggleTaskComplete: (id: string) => void;
  getTask: (id: string) => Task | undefined;

  // Settings
  settings: any;
  updateSettings: (newSettings: any) => void;
  resetSettings: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('taskList');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTomatoThrow, setShowTomatoThrow] = useState(false);

  const {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    incrementPomodoro,
    toggleTaskComplete,
    getTask,
  } = useTasks();

  const { settings, updateSettings, resetSettings } = useSettings();

  const value: AppContextType = {
    viewMode,
    setViewMode,
    activeTask,
    setActiveTask,
    showTomatoThrow,
    setShowTomatoThrow,
    tasks,
    addTask,
    updateTask,
    deleteTask,
    incrementPomodoro,
    toggleTaskComplete,
    getTask,
    settings,
    updateSettings,
    resetSettings,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
