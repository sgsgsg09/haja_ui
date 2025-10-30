
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

export enum RecurrenceFrequency {
  None = 'NONE',
  Daily = 'DAILY',
  Weekly = 'WEEKLY',
  Monthly = 'MONTHLY',
}

export interface Task {
  id: number;
  title: string;
  category: TaskCategory;
  startTime: string;
  endTime: string;
  duration: string;
  status: TaskStatus;
  recurrence?: {
    frequency: RecurrenceFrequency;
  };
}
