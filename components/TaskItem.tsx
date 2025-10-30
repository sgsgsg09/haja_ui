
import React from 'react';
import { Task, TaskCategory, TaskStatus, RecurrenceFrequency } from '../types';

interface TaskItemProps {
  task: Task;
  onToggleStatus: (id: number) => void;
  onEdit: (task: Task) => void;
  isActive: boolean;
  elapsedTimeDisplay: string;
}

// FIX: Replaced JSX.Element with React.ReactElement to resolve namespace error.
const categoryStyles: { [key in TaskCategory]: { bg: string; icon: React.ReactElement } } = {
  [TaskCategory.Work]: {
    bg: 'bg-green-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>,
  },
  [TaskCategory.Home]: {
    bg: 'bg-yellow-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  },
  [TaskCategory.Meal]: {
    bg: 'bg-orange-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>,
  },
  [TaskCategory.Personal]: {
    bg: 'bg-sky-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>,
  },
};

const getRecurrenceText = (frequency: RecurrenceFrequency): string => {
    switch (frequency) {
        case RecurrenceFrequency.Daily: return '매일 반복';
        case RecurrenceFrequency.Weekly: return '매주 반복';
        case RecurrenceFrequency.Monthly: return '매월 반복';
        default: return '';
    }
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggleStatus, onEdit, isActive, elapsedTimeDisplay }) => {
  const isCompleted = task.status === TaskStatus.Completed;

  return (
    <div className="flex items-center space-x-4 z-10 relative">
      <div className="relative">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${categoryStyles[task.category].bg}`}>
          {categoryStyles[task.category].icon}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
            <div>
              {isActive ? (
                <p className="text-sm font-bold text-green-600">{elapsedTimeDisplay}</p>
              ) : (
                <p className="text-sm text-gray-500">
                    {task.startTime}{task.endTime && `~${task.endTime}`} {task.duration && `(${task.duration})`}
                </p>
              )}
              <div className="flex items-center space-x-1.5">
                <p className={`font-semibold truncate ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                  {task.title}
                </p>
                {task.recurrence && task.recurrence.frequency !== RecurrenceFrequency.None && (
                    <div title={getRecurrenceText(task.recurrence.frequency)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.899 2.186l-1.393.733a5.002 5.002 0 00-8.41-1.895.992.992 0 00.01.001l-.01.01H6a1 1 0 01-1-1V3a1 1 0 011-1zm12 15a1 1 0 01-1-1v-2.101a7.002 7.002 0 01-11.899-2.186l1.393-.733a5.002 5.002 0 008.41 1.895.992.992 0 00-.01-.001l.01-.01H14a1 1 0 011 1v2a1 1 0 01-1 1z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
              </div>
            </div>
        </div>
      </div>

      <button
        onClick={() => onEdit(task)}
        title="일정 수정하기"
        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors duration-200"
        aria-label={`Edit task: ${task.title}`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
        </svg>
      </button>

      <button
        onClick={() => onToggleStatus(task.id)}
        title={isCompleted ? "미완료로 표시하기" : "완료로 표시하기"}
        className={`w-7 h-7 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all duration-300
          ${isCompleted 
            ? 'bg-green-400 border-green-500' 
            : 'bg-white border-yellow-400 hover:bg-yellow-100'
          }`}
      >
        {isCompleted && (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>
    </div>
  );
};

export default TaskItem;
