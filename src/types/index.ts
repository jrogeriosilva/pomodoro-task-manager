export interface Task {
  id: string;
  text: string;
  totalPomodoros: number;
  pomodorosCompleted: number;
  isCompleted: boolean;
}

export interface Settings {
  focusDuration: number; // in minutes
  shortBreakDuration: number; // in minutes
  longBreakDuration: number; // in minutes
  cyclesForLongBreak: number;
  soundEnabled: boolean;
  notificationsEnabled: boolean;
}

export interface TimerState {
  isActive: boolean;
  timeRemaining: number; // in seconds
  mode: 'focus' | 'shortBreak' | 'longBreak' | 'idle';
  cyclesCompleted: number;
}

export type ViewMode = 'taskList' | 'focus' | 'break';
