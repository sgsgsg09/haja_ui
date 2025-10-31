import React, { useMemo, useEffect } from 'react';
import { Task, TaskStatus } from '../types';

interface StatsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: Task[];
}

const StatsDetailModal: React.FC<StatsDetailModalProps> = ({ isOpen, onClose, tasks }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
       if (event.key === 'Escape') {
        onClose();
       }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  const habits = useMemo(() => tasks.filter(task => task.isHabit), [tasks]);
  
  const percentage = useMemo(() => {
    const completedCount = habits.filter(h => h.status === TaskStatus.Completed).length;
    const totalCount = habits.length;
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  }, [habits]);

  const daysInMonth = useMemo(() => new Date(year, month + 1, 0).getDate(), [year, month]);
  const firstDayOfMonth = useMemo(() => new Date(year, month, 1).getDay(), [year, month]); // 0=Sun, 1=Mon, ...

  const calendarDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [daysInMonth, firstDayOfMonth]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="stats-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8 transform transition-all" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
            <h2 id="stats-modal-title" className="text-2xl font-bold text-gray-800">월간 통계</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600" aria-label="Close statistics modal">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div className="text-center mb-6">
            <p className="text-lg text-gray-600">오늘의 습관 달성률</p>
            <p className="text-6xl font-bold text-pink-500 my-2">{percentage}%</p>
        </div>

        <div className="mt-4">
            <p className="text-center font-semibold text-gray-700 mb-3">
                {new Intl.DateTimeFormat('ko-KR', { year: 'numeric', month: 'long' }).format(today)}
            </p>
            <div className="grid grid-cols-7 gap-1 text-center text-sm text-gray-500 mb-2" aria-hidden="true">
                {['일', '월', '화', '수', '목', '금', '토'].map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => (
                    <div key={index} className="flex justify-center items-center h-10">
                        {day ? (
                            <div className={`w-10 h-10 flex items-center justify-center rounded-full ${day === today.getDate() ? 'bg-pink-500 text-white font-bold ring-2 ring-pink-300' : 'text-gray-800'}`}>
                                {day}
                            </div>
                        ) : <div />}
                    </div>
                ))}
            </div>
            <p className="text-xs text-center text-gray-400 mt-4">* 현재는 오늘 날짜만 표시됩니다. 실제 데이터 연동 시 일별 달성도가 표시됩니다.</p>
        </div>
      </div>
    </div>
  );
};

export default StatsDetailModal;