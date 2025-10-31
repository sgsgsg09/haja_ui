import React, { useMemo } from 'react';
import { Task, TaskCategory } from '../types';

interface WeeklyHabitStatsViewProps {
  habits: Task[];
  simulatedData: Map<string, { completedCount: number; habitsStatus: Map<number, boolean> }>;
}

const categoryStyles: { [key in TaskCategory]: { icon: React.ReactElement } } = {
  [TaskCategory.Work]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  [TaskCategory.Home]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  [TaskCategory.Meal]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  [TaskCategory.Personal]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> },
};

const WeeklyDoughnutChart: React.FC<{ percentage: number }> = ({ percentage }) => {
    const circumference = 2 * Math.PI * 40;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-28 h-28">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle className="text-gray-200" strokeWidth="12" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50" />
                    <circle
                        className="text-pink-500"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="40"
                        cx="50"
                        cy="50"
                        transform="rotate(-90 50 50)"
                        style={{ transition: 'stroke-dashoffset 0.5s ease-in-out' }}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-800">{percentage}%</span>
                </div>
            </div>
        </div>
    );
};

const HabitBreakdown: React.FC<{ habits: Task[]; simulatedData: Map<string, { habitsStatus: Map<number, boolean> }> }> = ({ habits, simulatedData }) => {
    const today = new Date();
    const weekDays = Array.from({ length: 7 }).map((_, i) => {
        const date = new Date(today);
        date.setDate(today.getDate() - (6 - i));
        return {
            label: new Intl.DateTimeFormat('ko-KR', { weekday: 'short' }).format(date),
            dateStr: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
        };
    });

    return (
        <div className="space-y-3">
            <div className="flex justify-end">
                <div className="grid grid-cols-7 gap-2" style={{width: 'calc(7/12 * 100%)'}}>
                    {weekDays.map(day => <span key={day.dateStr} className="text-center text-xs text-gray-500 font-semibold">{day.label}</span>)}
                </div>
            </div>
            {habits.map(habit => (
                <div key={habit.id} className="flex items-center space-x-2">
                    <div className="flex-1 min-w-0 flex items-center space-x-2">
                         <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-100">
                            {categoryStyles[habit.category].icon}
                        </div>
                        <p className="font-semibold truncate text-gray-800 text-sm">{habit.title}</p>
                    </div>
                    <div className="grid grid-cols-7 gap-2" style={{width: 'calc(7/12 * 100%)'}}>
                        {weekDays.map(day => {
                            const isCompleted = simulatedData.get(day.dateStr)?.habitsStatus.get(habit.id);
                            return (
                                <div key={day.dateStr} className={`w-full aspect-square rounded-lg flex items-center justify-center ${isCompleted ? 'bg-pink-400' : 'bg-gray-200'}`}>
                                    {isCompleted && <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );
};

const WeeklyHabitStatsView: React.FC<WeeklyHabitStatsViewProps> = ({ habits, simulatedData }) => {
  const weeklyStats = useMemo(() => {
    const today = new Date();
    let totalCompleted = 0;
    let totalPossible = 0;
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        const dayData = simulatedData.get(dateStr);

        if (dayData) {
            totalCompleted += dayData.completedCount;
            totalPossible += habits.length;
        }
    }
    
    return totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
  }, [simulatedData, habits.length]);
  
  return (
    <div className="space-y-6">
      <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="text-base font-bold text-gray-700 mb-2">이번 주 달성률</h3>
        <div className="flex items-center justify-center">
          <WeeklyDoughnutChart percentage={weeklyStats} />
        </div>
      </div>
       <div className="bg-gray-50 p-4 rounded-xl">
        <h3 className="text-base font-bold text-gray-700 mb-4">습관별 주간 현황</h3>
        <HabitBreakdown habits={habits} simulatedData={simulatedData} />
      </div>
    </div>
  );
};

export default WeeklyHabitStatsView;
