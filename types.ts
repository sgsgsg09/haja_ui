
export enum TaskStatus {
  Pending = 'PENDING',
  Completed = 'COMPLETED',
}

export enum TaskCategory {
  Work = 'WORK',
  Home = 'HOME',
  Meal = 'MEAL',
  Personal = 'PERSONAL',
}

export interface Task {
  id: number;
  title: string;
  category: TaskCategory;
  startTime: string;
  endTime: string;
  duration: string;
  status: TaskStatus;
}
