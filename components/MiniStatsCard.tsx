import React from 'react';
import { Task, TaskStatus } from '../types';

interface MiniStatsCardProps {
  habits: Task[];
  onClick: () => void;
}

const MiniStatsCard: React.FC<MiniStatsCardProps> = ({ habits, onClick }) => {
  const completedCount = habits.filter(h => h.status === TaskStatus.Completed).length;
  const totalCount = habits.length;
  const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const circumference = 2 * Math.PI * 50;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      onClick();
    }
  };

  return (
    <div
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label="오늘의 달성률 상세보기"
      className="bg-white rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer h-full transition-shadow hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2"
    >
      <div className="relative w-32 h-32">
        <svg className="w-full h-full" viewBox="0 0 120 120" aria-hidden="true">
          <circle
            className="text-gray-200"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="50"
            cx="60"
            cy="60"
          />
          <circle
            className="text-pink-500"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="50"
            cx="60"
            cy="60"
            transform="rotate(-90 60 60)"
            style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold text-gray-800">{percentage}%</span>
        </div>
      </div>
      <p className="mt-3 text-lg font-semibold text-gray-700">오늘의 달성률</p>
      <p className="text-sm text-gray-500">클릭하여 상세보기</p>
    </div>
  );
};

export default MiniStatsCard;