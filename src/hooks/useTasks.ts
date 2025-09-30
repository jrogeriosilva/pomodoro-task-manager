import { useLocalStorage } from './useLocalStorage';
import { Task } from '../types';

export function useTasks() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('pomodoro-tasks', []);

  const addTask = (text: string, totalPomodoros: number) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      text,
      totalPomodoros,
      pomodorosCompleted: 0,
      isCompleted: false,
    };
    setTasks((prev) => [...prev, newTask]);
    return newTask;
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const incrementPomodoro = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, pomodorosCompleted: task.pomodorosCompleted + 1 }
          : task
      )
    );
  };

  const toggleTaskComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, isCompleted: !task.isCompleted } : task
      )
    );
  };

  const getTask = (id: string) => {
    return tasks.find((task) => task.id === id);
  };

  return {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    incrementPomodoro,
    toggleTaskComplete,
    getTask,
  };
}
