import React from 'react';
import { Task, TaskCategory, TaskStatus } from '../types';

interface WeeklyHabitStatsViewProps {
  habits: Task[];
  onToggleStatus: (id: number) => void;
  onEdit: (task: Task) => void;
  onBackToSchedule: () => void;
}

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
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  },
  [TaskCategory.Personal]: {
    bg: 'bg-sky-100',
    icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>,
  },
};

const WeeklyHabitStatsView: React.FC<WeeklyHabitStatsViewProps> = ({ habits, onToggleStatus, onEdit, onBackToSchedule }) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">주간 습관 통계</h2>
            <button
                onClick={onBackToSchedule}
                className="text-sm font-semibold text-pink-500 hover:text-pink-600 flex items-center space-x-1 transition-colors"
                aria-label="일정으로 돌아가기"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span>일정으로 돌아가기</span>
            </button>
        </div>
        <div className="space-y-3">
        {habits.map(habit => {
            const isCompleted = habit.status === TaskStatus.Completed;
            return (
            <div key={habit.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex items-center space-x-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryStyles[habit.category].bg}`}>
                {categoryStyles[habit.category].icon}
                </div>
                <div className="flex-1 min-w-0">
                <p className={`font-semibold truncate ${isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                    {habit.title}
                </p>
                </div>
                <div className="flex space-x-1.5 flex-shrink-0">
                {weekDays.map((dayLabel, index) => {
                    const isToday = index === dayOfWeek;
                    return (
                    <button
                        key={index}
                        disabled={!isToday}
                        onClick={() => isToday && onToggleStatus(habit.id)}
                        title={isToday ? (isCompleted ? "미완료로 표시" : "완료로 표시") : dayLabel}
                        className={`w-8 h-8 rounded-full text-xs font-semibold flex items-center justify-center transition-all
                        ${isToday ? 'cursor-pointer ring-2 ring-pink-300' : 'bg-gray-100 text-gray-400'}
                        ${isToday && isCompleted ? 'bg-pink-500 text-white' : ''}
                        ${isToday && !isCompleted ? 'bg-white text-pink-500 hover:bg-pink-50' : ''}
                        `}
                    >
                        {dayLabel}
                    </button>
                    );
                })}
                </div>
                <button
                    onClick={() => onEdit(habit)}
                    title="습관 수정하기"
                    className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors duration-200"
                    aria-label={`Edit habit: ${habit.title}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L15.232 5.232z" />
                    </svg>
                </button>
            </div>
            );
        })}
        </div>
    </div>
  );
};

export default WeeklyHabitStatsView;