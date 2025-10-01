import { useLocalStorage } from "./useLocalStorage";
import { StoreItem, UserInventory, ActiveEffect, TaskTemplate } from "../types";

const defaultInventory: UserInventory = {
  ownedItems: [],
  consumableItems: {},
  activeEffects: [],
  timeBank: 0,
};

// Available store items
export const storeItems: StoreItem[] = [
  {
    id: "break-extender",
    name: "Break Extender",
    description: "Adds +2 minutes to break sessions for the next 5 breaks",
    price: 25,
    category: "powerups",
    icon: "⏰",
    isConsumable: true,
    effect: "extendBreak",
  },
  {
    id: "double-points",
    name: "Double Points",
    description: "Earn 2x tomato points for the next 10 completed Pomodoros",
    price: 50,
    category: "powerups",
    icon: "🔥",
    isConsumable: true,
    effect: "doublePoints",
  },
  {
    id: "time-bank",
    name: "Time Bank",
    description: "Store unused break time to use later",
    price: 120,
    category: "utility",
    icon: "🏦",
    isConsumable: false,
  },
  {
    id: "task-templates",
    name: "Task Templates",
    description: "Pre-made task templates (Study Session, Coding Sprint, etc.)",
    price: 50,
    category: "utility",
    icon: "📋",
    isConsumable: false,
  },
];

// Task templates data
export const taskTemplates: TaskTemplate[] = [
  {
    id: "study-session",
    name: "Study Session",
    tasks: [
      "Review chapter notes",
      "Practice problems",
      "Create summary",
      "Self-quiz",
    ],
    totalPomodoros: 4,
  },
  {
    id: "coding-sprint",
    name: "Coding Sprint",
    tasks: [
      "Plan feature architecture",
      "Implement core functionality",
      "Write tests",
      "Code review and refactor",
    ],
    totalPomodoros: 6,
  },
  {
    id: "writing-project",
    name: "Writing Project",
    tasks: [
      "Research and outline",
      "Write first draft",
      "Edit and revise",
      "Final proofread",
    ],
    totalPomodoros: 5,
  },
  {
    id: "learning-new-skill",
    name: "Learning New Skill",
    tasks: [
      "Watch tutorial/read documentation",
      "Hands-on practice",
      "Build small project",
      "Review and reinforce",
    ],
    totalPomodoros: 4,
  },
];

export function useStore() {
  const [inventory, setInventory] = useLocalStorage<UserInventory>(
    "pomodoro-inventory",
    defaultInventory
  );

  const purchaseItem = (
    itemId: string,
    spendPoints: (points: number) => boolean
  ): boolean => {
    const item = storeItems.find((i) => i.id === itemId);
    if (!item) return false;

    // Check if user already owns non-consumable items
    if (!item.isConsumable && inventory.ownedItems.includes(itemId)) {
      return false;
    }

    // Try to spend points
    if (!spendPoints(item.price)) {
      return false;
    }

    setInventory((prev) => {
      if (item.isConsumable) {
        // Add to consumable items
        return {
          ...prev,
          consumableItems: {
            ...prev.consumableItems,
            [itemId]: (prev.consumableItems[itemId] || 0) + 1,
          },
        };
      } else {
        // Add to owned items
        return {
          ...prev,
          ownedItems: [...prev.ownedItems, itemId],
        };
      }
    });

    return true;
  };

  const useConsumableItem = (itemId: string): boolean => {
    const item = storeItems.find((i) => i.id === itemId);
    if (!item || !item.isConsumable || !inventory.consumableItems[itemId]) {
      return false;
    }

    setInventory((prev) => {
      const newConsumableItems = { ...prev.consumableItems };
      newConsumableItems[itemId] = newConsumableItems[itemId] - 1;

      if (newConsumableItems[itemId] <= 0) {
        delete newConsumableItems[itemId];
      }

      // Add active effect
      const newActiveEffects = [...prev.activeEffects];

      if (item.effect === "extendBreak") {
        newActiveEffects.push({
          itemId,
          effect: "extendBreak",
          remainingUses: 5,
          value: 2, // +2 minutes
        });
      } else if (item.effect === "doublePoints") {
        newActiveEffects.push({
          itemId,
          effect: "doublePoints",
          remainingUses: 10,
          value: 2, // 2x multiplier
        });
      }

      return {
        ...prev,
        consumableItems: newConsumableItems,
        activeEffects: newActiveEffects,
      };
    });

    return true;
  };

  const addToTimeBank = (minutes: number) => {
    setInventory((prev) => ({
      ...prev,
      timeBank: prev.timeBank + minutes,
    }));
  };

  const useTimeBank = (minutes: number): boolean => {
    if (inventory.timeBank < minutes) {
      return false;
    }

    setInventory((prev) => ({
      ...prev,
      timeBank: prev.timeBank - minutes,
    }));

    return true;
  };

  const consumeActiveEffect = (effectId: string) => {
    setInventory((prev) => {
      const newActiveEffects = prev.activeEffects
        .map((effect) => {
          if (effect.itemId === effectId) {
            return {
              ...effect,
              remainingUses: effect.remainingUses - 1,
            };
          }
          return effect;
        })
        .filter((effect) => effect.remainingUses > 0);

      return {
        ...prev,
        activeEffects: newActiveEffects,
      };
    });
  };

  const getActiveEffect = (effectType: string): ActiveEffect | null => {
    return (
      inventory.activeEffects.find((effect) => effect.effect === effectType) ||
      null
    );
  };

  const hasItem = (itemId: string): boolean => {
    const item = storeItems.find((i) => i.id === itemId);
    if (!item) return false;

    if (item.isConsumable) {
      return (inventory.consumableItems[itemId] || 0) > 0;
    } else {
      return inventory.ownedItems.includes(itemId);
    }
  };

  const getItemQuantity = (itemId: string): number => {
    return inventory.consumableItems[itemId] || 0;
  };

  return {
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
}
