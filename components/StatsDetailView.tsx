import React, { useState, useMemo } from 'react';
import { Task, TaskCategory } from '../types';

interface StatsDetailViewProps {
  habits: Task[];
  simulatedData: Map<string, { completedCount: number; habitsStatus: Map<number, boolean> }>;
  onClose: () => void;
}

const categoryStyles: { [key in TaskCategory]: { icon: React.ReactElement } } = {
  [TaskCategory.Work]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  [TaskCategory.Home]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  [TaskCategory.Meal]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  [TaskCategory.Personal]: { icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-sky-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> },
};

const CalendarHeatmap: React.FC<{
    currentDate: Date;
    simulatedData: Map<string, { completedCount: number }>;
    totalHabits: number;
    onDateSelect: (date: string) => void;
    selectedDate: string | null;
}> = ({ currentDate, simulatedData, totalHabits, onDateSelect, selectedDate }) => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const calendarDays = Array.from({ length: firstDayOfMonth }, () => null)
      .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

    const getBgColor = (percentage: number) => {
        if (percentage === 0) return 'bg-gray-100 hover:bg-gray-200';
        if (percentage < 25) return 'bg-pink-100 hover:bg-pink-200';
        if (percentage < 50) return 'bg-pink-200 hover:bg-pink-300';
        if (percentage < 75) return 'bg-pink-300 hover:bg-pink-400';
        if (percentage < 100) return 'bg-pink-400 hover:bg-pink-500';
        return 'bg-pink-500 hover:bg-pink-600';
    };

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 font-semibold mb-2">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1.5">
                {calendarDays.map((day, index) => {
                    if (!day) return <div key={`empty-${index}`} />;
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                    const dayData = simulatedData.get(dateStr);
                    const percentage = totalHabits > 0 && dayData ? Math.round((dayData.completedCount / totalHabits) * 100) : 0;
                    
                    const isSelected = selectedDate === dateStr;

                    return (
                        <button
                            key={day}
                            onClick={() => onDateSelect(dateStr)}
                            title={`${day}일: ${percentage}% 달성`}
                            className={`aspect-square w-full flex items-center justify-center rounded-lg transition-all ${getBgColor(percentage)} ${isSelected ? 'ring-2 ring-pink-500 ring-offset-2' : ''}`}
                        >
                            <span className={`text-xs font-bold ${percentage > 50 ? 'text-white' : 'text-gray-700'}`}>{day}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

const DailyDetailCard: React.FC<{
    selectedDate: string;
    habits: Task[];
    simulatedData: Map<string, { habitsStatus: Map<number, boolean> }>;
}> = ({ selectedDate, habits, simulatedData }) => {
    const dayData = simulatedData.get(selectedDate);
    const date = new Date(selectedDate);
    const formattedDate = new Intl.DateTimeFormat('ko-KR', { month: 'long', day: 'numeric', weekday: 'long' }).format(date);

    return (
        <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-gray-800 mb-3">{formattedDate}</h4>
            <div className="space-y-2">
                {habits.map(habit => {
                    const isCompleted = dayData?.habitsStatus.get(habit.id) ?? false;
                    return (
                        <div key={habit.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                             <div className="flex items-center space-x-2">
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-200">
                                    {categoryStyles[habit.category].icon}
                                </div>
                                <p className="text-sm font-semibold text-gray-700">{habit.title}</p>
                            </div>
                            {isCompleted ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const TopHabitsCard: React.FC<{
    habits: Task[];
    simulatedData: Map<string, { habitsStatus: Map<number, boolean> }>;
    currentDate: Date;
}> = ({ habits, simulatedData, currentDate }) => {
    const topHabits = useMemo(() => {
        const counts = new Map<number, number>();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        for(let day = 1; day <= new Date(year, month + 1, 0).getDate(); day++) {
            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const dayData = simulatedData.get(dateStr);
            dayData?.habitsStatus.forEach((isCompleted, habitId) => {
                if (isCompleted) {
                    counts.set(habitId, (counts.get(habitId) || 0) + 1);
                }
            });
        }

        return Array.from(counts.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 3)
            .map(([habitId, count]) => ({
                habit: habits.find(h => h.id === habitId),
                count,
            }));

    }, [habits, simulatedData, currentDate]);

    return (
         <div className="bg-white p-4 rounded-xl shadow-sm">
            <h4 className="font-bold text-gray-800 mb-3">이번 달 TOP 3 습관</h4>
            {topHabits.length > 0 ? (
                <div className="space-y-2">
                    {topHabits.map(({ habit, count }, index) => habit && (
                         <div key={habit.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-lg text-pink-500 w-5">{index + 1}</span>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 bg-gray-200">
                                    {categoryStyles[habit.category].icon}
                                </div>
                                <p className="text-sm font-semibold text-gray-700">{habit.title}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-600">{count}회</p>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-500 text-center py-4">이번 달에 완료된 습관이 없습니다.</p>
            )}
        </div>
    );
};

const StatsDetailView: React.FC<StatsDetailViewProps> = ({ habits, simulatedData, onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const changeMonth = (amount: number) => {
      setCurrentDate(prev => {
          const newDate = new Date(prev);
          newDate.setMonth(newDate.getMonth() + amount);
          return newDate;
      });
      setSelectedDate(null);
  };
  
  return (
    <div className="w-full max-w-md bg-gray-100 rounded-3xl shadow-2xl p-4 sm:p-6 h-[90vh] flex flex-col">
        <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200">
             <button onClick={onClose} className="flex items-center space-x-2 text-gray-600 hover:text-gray-900" aria-label="돌아가기">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                 <span className="font-bold">월간 통계</span>
             </button>
             <div className="flex items-center space-x-2">
                <button onClick={() => changeMonth(-1)} className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300" aria-label="이전 달">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>
                 <p className="text-sm font-semibold text-gray-700 w-24 text-center">{new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(currentDate)}</p>
                <button onClick={() => changeMonth(1)} className="p-1.5 rounded-full bg-gray-200 hover:bg-gray-300" aria-label="다음 달">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
             </div>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4 pb-4">
            <CalendarHeatmap
                currentDate={currentDate}
                simulatedData={simulatedData}
                totalHabits={habits.length}
                onDateSelect={setSelectedDate}
                selectedDate={selectedDate}
            />
            {selectedDate && <DailyDetailCard selectedDate={selectedDate} habits={habits} simulatedData={simulatedData} />}
            <TopHabitsCard habits={habits} simulatedData={simulatedData} currentDate={currentDate} />
             <p className="text-xs text-center text-gray-400 mt-2">* 과거 데이터는 데모용으로 시뮬레이션 되었습니다.</p>
        </div>
    </div>
  );
};

export default StatsDetailView;
