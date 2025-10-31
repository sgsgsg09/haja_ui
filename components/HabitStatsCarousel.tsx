import React, { useState } from 'react';
import { Task } from '../types';
import HabitItem from './HabitItem';
import MiniStatsCard from './MiniStatsCard';

interface HabitStatsCarouselProps {
  habits: Task[];
  allHabitsCompleted: boolean;
  onToggleStatus: (id: number) => void;
  onEdit: (task: Task) => void;
  onStatClick: () => void;
  onTabChange?: (index: number) => void;
}

const HabitStatsCarousel: React.FC<HabitStatsCarouselProps> = ({ habits, allHabitsCompleted, onToggleStatus, onEdit, onStatClick, onTabChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleTabChange = (index: number) => {
    setActiveIndex(index);
    if (onTabChange) {
      onTabChange(index);
    }
  };

  return (
    <div>
        <h2 className="text-lg font-bold text-gray-700 mb-3 px-1">{activeIndex === 0 ? '오늘의 습관' : '요약'}</h2>
        <div className="bg-gray-100 p-3 rounded-xl">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-300 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {/* Page 1: Habit List */}
              <div className="w-full flex-shrink-0 space-y-2">
                {habits.map(habit => (
                  <HabitItem key={habit.id} task={habit} onToggleStatus={onToggleStatus} onEdit={onEdit} />
                ))}
              </div>

              {/* Page 2: Stats Summary */}
              <div className="w-full flex-shrink-0">
                <MiniStatsCard habits={habits} onClick={onStatClick} />
              </div>
            </div>
          </div>
          
          <div className="flex justify-center space-x-2 mt-4">
              <button aria-label="Go to habits list" onClick={() => handleTabChange(0)} className={`w-2.5 h-2.5 rounded-full transition-colors ${activeIndex === 0 ? 'bg-pink-500' : 'bg-gray-300'}`}></button>
              <button aria-label="Go to stats summary" onClick={() => handleTabChange(1)} className={`w-2.5 h-2.5 rounded-full transition-colors ${activeIndex === 1 ? 'bg-pink-500' : 'bg-gray-300'}`}></button>
          </div>
        </div>

        {allHabitsCompleted && (
            <p className="text-center text-sm text-green-600 mt-3 font-semibold">
            오늘의 습관을 모두 완료했어요!
            </p>
        )}
    </div>
  );
};

export default HabitStatsCarousel;
