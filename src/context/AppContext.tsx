import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ViewMode, Task, TomatoPoints } from '../types';
import { useTasks } from '../hooks/useTasks';
import { useSettings } from '../hooks/useSettings';
import { useTomatoPoints } from '../hooks/useTomatoPoints';
import { useStore } from '../hooks/useStore';

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

  // Cycle tracking
  cyclesCompleted: number;
  incrementCycle: () => void;
  resetCycles: () => void;

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

  // Tomato Points
  tomatoPoints: TomatoPoints;
  addTomatoPoints: (points: number) => void;
  spendTomatoPoints: (points: number) => boolean;
  checkAndResetDaily: () => void;

  // Store
  inventory: any;
  storeItems: any;
  taskTemplates: any;
  purchaseItem: (itemId: string, spendPoints: (points: number) => boolean) => boolean;
  useConsumableItem: (itemId: string) => boolean;
  addToTimeBank: (minutes: number) => void;
  useTimeBank: (minutes: number) => boolean;
  consumeActiveEffect: (effectId: string) => void;
  getActiveEffect: (effectType: string) => any;
  hasItem: (itemId: string) => boolean;
  getItemQuantity: (itemId: string) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('taskList');
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTomatoThrow, setShowTomatoThrow] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);

  const incrementCycle = () => {
    setCyclesCompleted(prev => prev + 1);
  };

  const resetCycles = () => {
    setCyclesCompleted(0);
  };

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

  const {
    tomatoPoints,
    addTomatoPoints,
    spendTomatoPoints,
    checkAndResetDaily,
  } = useTomatoPoints();

  const {
    inventory,
    storeItems,
    taskTemplates,
    purchaseItem,
    useConsumableItem,
    addToTimeBank,
    useTimeBank,
    consumeActiveEffect,
    getActiveEffect,
    hasItem,
    getItemQuantity,
  } = useStore();

  const value: AppContextType = {
    viewMode,
    setViewMode,
    activeTask,
    setActiveTask,
    showTomatoThrow,
    setShowTomatoThrow,
    cyclesCompleted,
    incrementCycle,
    resetCycles,
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
    tomatoPoints,
    addTomatoPoints,
    spendTomatoPoints,
    checkAndResetDaily,
    inventory,
    storeItems,
    taskTemplates,
    purchaseItem,
    useConsumableItem,
    addToTimeBank,
    useTimeBank,
    consumeActiveEffect,
    getActiveEffect,
    hasItem,
    getItemQuantity,
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
