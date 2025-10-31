import React, { useMemo } from 'react';
import { Task, TaskCategory, TaskStatus } from '../types';

interface WeeklyHabitStatsViewProps {
  habits: Task[];
  onToggleStatus: (id: number) => void;
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

const WeeklyHabitStatsView: React.FC<WeeklyHabitStatsViewProps> = ({ habits, onToggleStatus, onBackToSchedule }) => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  // Simulate historical data and calculate weekly stats
  const weeklyStats = useMemo(() => {
    const totalHabitsForWeek = habits.length * 7;
    let totalCompleted = 0;

    const habitsWithStats = habits.map(habit => {
      // Simple pseudo-random generator for consistent "randomness"
      const pseudoRandom = (seed: number) => {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x) > 0.5;
      };

      const dailyStatus: boolean[] = Array(7).fill(false);

      for (let i = 0; i < 7; i++) {
        if (i < dayOfWeek) {
          // Past days: use simulated data
          dailyStatus[i] = pseudoRandom(habit.id + i);
        } else if (i === dayOfWeek) {
          // Today: use real data
          dailyStatus[i] = habit.status === TaskStatus.Completed;
        }
        // Future days remain false
        
        if(dailyStatus[i]) totalCompleted++;
      }
      
      // Calculate streak
      let currentStreak = 0;
      if (dailyStatus[dayOfWeek]) { // Must be completed today to have a streak
          currentStreak = 1;
          for (let i = dayOfWeek - 1; i >= 0; i--) {
              if(dailyStatus[i]) {
                  currentStreak++;
              } else {
                  break;
              }
          }
      }

      return {
        ...habit,
        dailyStatus,
        streak: currentStreak,
      };
    });

    const overallCompletion = totalHabitsForWeek > 0 ? Math.round((totalCompleted / (habits.length * (dayOfWeek + 1))) * 100) : 0;
    
    return { habitsWithStats, overallCompletion };

  }, [habits, dayOfWeek]);


  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-gray-700">주간 습관 현황</h2>
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

        <div className="bg-gray-100 p-4 rounded-xl mb-6 text-center">
            <p className="text-sm text-gray-600">이번 주 달성률 (오늘까지)</p>
            <p className="text-4xl font-bold text-pink-500 my-1">{weeklyStats.overallCompletion}%</p>
            <p className="text-xs text-gray-500">*과거 데이터는 데모용으로 시뮬레이션 되었습니다.</p>
        </div>

        <div className="space-y-3">
        {weeklyStats.habitsWithStats.map(habit => {
            return (
            <div key={habit.id} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${categoryStyles[habit.category].bg}`}>
                        {categoryStyles[habit.category].icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className={`font-semibold truncate text-gray-800`}>
                            {habit.title}
                        </p>
                        {habit.streak > 0 && (
                            <p className="text-xs text-orange-500 font-semibold">{habit.streak}일 연속 달성중! 🔥</p>
                        )}
                    </div>
                </div>
                <div className="flex justify-around items-center pt-3 mt-3 border-t border-gray-100">
                {weekDays.map((dayLabel, index) => {
                    const isToday = index === dayOfWeek;
                    const isCompleted = habit.dailyStatus[index];
                    const DayComponent = isToday ? 'button' : 'div';
                    
                    return (
                    <div key={index} className="flex flex-col items-center space-y-1">
                        <span className={`text-xs font-medium ${isToday ? 'text-pink-500' : 'text-gray-400'}`}>{dayLabel}</span>
                        <DayComponent
                            onClick={() => isToday && onToggleStatus(habit.id)}
                            title={isToday ? (isCompleted ? "미완료로 표시" : "완료로 표시") : (isCompleted ? "완료됨" : "미완료")}
                            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all
                            ${isToday ? 'cursor-pointer' : ''}
                            ${isCompleted ? 'bg-pink-500 text-white' : 'bg-gray-200'}
                            ${isToday && !isCompleted ? 'hover:bg-pink-100' : ''}
                            ${isToday && !isCompleted && 'ring-2 ring-pink-300 ring-inset'}
                            `}
                        >
                            {isCompleted && (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            )}
                        </DayComponent>
                    </div>
                    );
                })}
                </div>
            </div>
            );
        })}
        </div>
        {habits.length === 0 && (
            <div className="text-center py-10 text-gray-500">
                <p>표시할 습관이 없습니다.</p>
                <p className="text-sm mt-1">메인 화면에서 습관을 추가해보세요.</p>
            </div>
        )}
    </div>
  );
};

export default WeeklyHabitStatsView;