import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Task, TaskStatus, TaskCategory } from './types';
import { INITIAL_TASKS } from './constants';
import TaskItem from './components/TaskItem';
import EditTaskModal from './components/EditTaskModal';

const Header: React.FC = () => {
  const today = new Date();
  const dateString = new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(today);

  return (
    <div className="text-center mb-6">
      <h1 className="text-2xl font-bold text-gray-800">'오늘의 할 일'</h1>
      <p className="text-sm text-gray-500">{dateString}</p>
    </div>
  );
};

const AddTaskButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    title="새 일정 추가"
    className="absolute -bottom-7 -right-2 z-20 bg-pink-500 text-white w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:bg-pink-600 transition-transform duration-300 transform hover:scale-110"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  </button>
);

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [filter, setFilter] = useState<TaskCategory | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'startTime' | 'duration'>('startTime');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const activeTask = useMemo(() => tasks.find(task => task.status === TaskStatus.Pending), [tasks]);
  
  const allTasksCompleted = useMemo(() => tasks.length > 0 && tasks.every(task => task.status === TaskStatus.Completed), [tasks]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (activeTask) {
      const initialTime = activeTask.id === 1 ? 12 * 60 + 5 : 0;
      setElapsedTime(initialTime);
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTask]);

  const handleToggleStatus = useCallback((id: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, status: task.status === TaskStatus.Completed ? TaskStatus.Pending : TaskStatus.Completed }
          : task
      )
    );
  }, []);

  const handleAddTask = useCallback(() => {
    const newTask: Task = {
        id: tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1,
        title: '새로운 일정',
        category: TaskCategory.Work,
        startTime: '시간 미정',
        endTime: '',
        duration: '',
        status: TaskStatus.Pending,
    };
    setTasks(prev => [...prev, newTask]);
    setFilter('ALL');
  }, [tasks]);

  const handleStartEdit = useCallback((task: Task) => {
    setEditingTask(task);
  }, []);

  const handleCloseModal = useCallback(() => {
    setEditingTask(null);
  }, []);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  }, []);

  const displayedTasks = useMemo(() => {
    const parseTime = (timeStr: string): number => {
      if (timeStr === '시간 미정') return Infinity;
      const [period, time] = timeStr.split(' ');
      if (!time) return Infinity;
      const [hours, minutes] = time.split(':').map(Number);
      let totalMinutes = hours * 60 + minutes;
      if (period === '오후' && hours < 12) {
        totalMinutes += 12 * 60;
      }
      return totalMinutes;
    };

    const parseDuration = (durationStr: string): number => {
        if (!durationStr) return 0;
        let totalMinutes = 0;
        const hourMatch = durationStr.match(/(\d+)시간/);
        const minMatch = durationStr.match(/(\d+)분/);
        if (hourMatch) totalMinutes += parseInt(hourMatch[1], 10) * 60;
        if (minMatch) totalMinutes += parseInt(minMatch[1], 10);
        return totalMinutes;
    };

    return tasks
      .filter(task => filter === 'ALL' || task.category === filter)
      .sort((a, b) => {
        if (sortBy === 'startTime') {
            return parseTime(a.startTime) - parseTime(b.startTime);
        } else { // 'duration'
            return parseDuration(a.duration) - parseDuration(b.duration);
        }
      });
  }, [tasks, filter, sortBy]);

  const formatTime = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}분 ${String(seconds).padStart(2, '0')}초`;
  };

  const filterOptions: { value: TaskCategory | 'ALL', label: string }[] = [
    { value: 'ALL', label: '전체' },
    { value: TaskCategory.Work, label: '업무' },
    { value: TaskCategory.Home, label: '집안일' },
    { value: TaskCategory.Meal, label: '식사' },
    { value: TaskCategory.Personal, label: '개인' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-700 via-gray-900 to-black flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 relative">
        <Header />

        <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2 overflow-x-auto pb-2">
                {filterOptions.map(option => (
                <button
                    key={option.value}
                    onClick={() => setFilter(option.value)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 whitespace-nowrap ${
                    filter === option.value
                        ? 'bg-pink-500 text-white shadow'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {option.label}
                </button>
                ))}
            </div>

            <div className="flex space-x-1 flex-shrink-0">
                <button
                    onClick={() => setSortBy('startTime')}
                    title="시간순 정렬"
                    className={`p-2 rounded-full transition-colors duration-200 ${
                    sortBy === 'startTime'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </button>
                <button
                    onClick={() => setSortBy('duration')}
                    title="소요시간순 정렬"
                    className={`p-2 rounded-full transition-colors duration-200 ${
                    sortBy === 'duration'
                        ? 'bg-pink-500 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 12L4 9m3 7l3-3m7-4v12m0-12l3 3m-3-3l-3 3" />
                    </svg>
                </button>
            </div>
        </div>

        <div className="space-y-2 relative">
          {displayedTasks.length > 0 && (
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
          )}

          {displayedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEdit={handleStartEdit}
              isActive={activeTask?.id === task.id}
              elapsedTimeDisplay={formatTime(elapsedTime)}
            />
          ))}

          {tasks.length > 0 && displayedTasks.length === 0 && (
             <div className="text-center py-16 text-gray-500">
                <p className="font-semibold">선택된 카테고리에 일정이 없어요.</p>
            </div>
          )}

          {tasks.length === 0 && (
            <div className="text-center py-16 text-gray-500">
              <p className="font-semibold">오늘의 첫 일정을 추가해 보세요!</p>
            </div>
          )}

          {allTasksCompleted && (
            <div className="text-center pt-8 pb-4 text-green-600">
              <p className="font-bold text-lg">오늘의 모든 일정을 완료했어요!</p>
              <p className="text-sm">멋진 하루네요.</p>
            </div>
          )}
        </div>
        <AddTaskButton onClick={handleAddTask} />

        <EditTaskModal
          task={editingTask}
          onSave={handleUpdateTask}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
};

export default App;
