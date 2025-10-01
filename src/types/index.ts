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
  fortuneTigerMode: boolean; // New Fortune Tiger Mode setting
  storeMode: boolean; // Enable/disable store feature
}

export interface TomatoPoints {
  total: number;
  earnedToday: number;
  lastEarnedDate: string;
}

export interface TimerState {
  isActive: boolean;
  timeRemaining: number; // in seconds
  mode: "focus" | "shortBreak" | "longBreak" | "idle";
  cyclesCompleted: number;
}

export type ViewMode = "taskList" | "focus" | "break" | "slotMachine" | "store";

export interface StoreItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: StoreCategory;
  icon: string; // emoji
  isConsumable: boolean; // single use vs permanent
  effect?: string; // effect type for power-ups
}

export interface UserInventory {
  ownedItems: string[]; // item IDs for permanent items
  consumableItems: { [itemId: string]: number }; // quantities for consumable items
  activeEffects: ActiveEffect[];
  timeBank: number; // stored break time in minutes
}

export interface ActiveEffect {
  itemId: string;
  effect: string;
  remainingUses: number; // how many times left to use
  value: number; // effect strength
}

export type StoreCategory = "powerups" | "utility";

export interface TaskTemplate {
  id: string;
  name: string;
  tasks: string[];
  totalPomodoros: number;
}
