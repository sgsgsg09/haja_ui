import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskCategory, RecurrenceFrequency } from '../types';

interface EditTaskModalProps {
  task: Task | null;
  onSave: (task: Task) => void;
  onClose: () => void;
}

const categoryStyles: { [key in TaskCategory]: { bg: string; icon: React.ReactElement, name: string } } = {
  [TaskCategory.Work]: { name: '업무', bg: 'bg-green-100', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg> },
  [TaskCategory.Home]: { name: '집안일', bg: 'bg-yellow-100', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg> },
  [TaskCategory.Meal]: { name: '식사', bg: 'bg-orange-100', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
  [TaskCategory.Personal]: { name: '개인', bg: 'bg-sky-100', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-sky-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg> },
};

const recurrenceOptions: { value: RecurrenceFrequency, label: string }[] = [
    { value: RecurrenceFrequency.None, label: '안 함' },
    { value: RecurrenceFrequency.Daily, label: '매일' },
    { value: RecurrenceFrequency.Weekly, label: '매주' },
    { value: RecurrenceFrequency.Monthly, label: '매월' },
];

const TimePicker: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
    const timeParts = useMemo(() => {
        if (!value || value === '시간 미정') return { period: '오전', hour: '12', minute: '00' };
        const [period, time] = value.split(' ');
        const [hour, minute] = time.split(':');
        return { period, hour, minute };
    }, [value]);

    const handleTimeChange = (part: 'period' | 'hour' | 'minute', val: string) => {
        const newParts = { ...timeParts, [part]: val };
        onChange(`${newParts.period} ${newParts.hour}:${newParts.minute}`);
    };

    return (
        <div className="flex space-x-2">
            <select value={timeParts.period} onChange={(e) => handleTimeChange('period', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white">
                <option>오전</option>
                <option>오후</option>
            </select>
            <select value={timeParts.hour} onChange={(e) => handleTimeChange('hour', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white">
                {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
            <select value={timeParts.minute} onChange={(e) => handleTimeChange('minute', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white">
                {Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0')).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
        </div>
    );
};

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Task>>({});

  const parseTimeToMinutes = useCallback((timeStr: string): number | null => {
      if (!timeStr || timeStr === '시간 미정') return null;
      const [period, time] = timeStr.split(' ');
      if (!time) return null;
      let [hours, minutes] = time.split(':').map(Number);
      if (period === '오후' && hours !== 12) hours += 12;
      if (period === '오전' && hours === 12) hours = 0; // Midnight case
      return hours * 60 + minutes;
  }, []);

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  useEffect(() => {
      const startMinutes = parseTimeToMinutes(formData.startTime || '');
      const endMinutes = parseTimeToMinutes(formData.endTime || '');

      if (startMinutes !== null && endMinutes !== null && endMinutes > startMinutes) {
          const diff = endMinutes - startMinutes;
          const hours = Math.floor(diff / 60);
          const minutes = diff % 60;
          let durationStr = '';
          if (hours > 0) durationStr += `${hours}시간 `;
          if (minutes > 0) durationStr += `${minutes}분`;
          setFormData(prev => ({ ...prev, duration: durationStr.trim() }));
      } else {
          setFormData(prev => ({ ...prev, duration: '' }));
      }
  }, [formData.startTime, formData.endTime, parseTimeToMinutes]);


  if (!task) return null;

  const handleFieldChange = (name: keyof Task, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRecurrenceChange = (frequency: RecurrenceFrequency) => {
      if (frequency === RecurrenceFrequency.None) {
          const { recurrence, ...rest } = formData;
          setFormData(rest);
      } else {
          setFormData(prev => ({ ...prev, recurrence: { ...prev.recurrence, frequency } }));
      }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: task.id } as Task);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">일정 수정</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">일정</label>
              <input
                type="text"
                id="title"
                value={formData.title || ''}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">카테고리</label>
              <div className="flex justify-around">
                {(Object.keys(categoryStyles) as TaskCategory[]).map(cat => (
                  <button
                    type="button"
                    key={cat}
                    onClick={() => handleFieldChange('category', cat)}
                    className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center transition-all duration-200 ${categoryStyles[cat].bg} ${formData.category === cat ? 'ring-2 ring-pink-500 ring-offset-2' : 'hover:opacity-80'}`}
                    title={categoryStyles[cat].name}
                  >
                    {categoryStyles[cat].icon}
                    <span className="text-xs font-semibold text-gray-700 mt-1">{categoryStyles[cat].name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
              <TimePicker value={formData.startTime || ''} onChange={(value) => handleFieldChange('startTime', value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
              <TimePicker value={formData.endTime || ''} onChange={(value) => handleFieldChange('endTime', value)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">소요 시간 (자동 계산)</label>
              <div className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-100 text-gray-600">
                {formData.duration || '시작과 종료 시간을 선택하세요'}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">반복</label>
              <div className="flex space-x-2">
                {recurrenceOptions.map(({ value, label }) => (
                  <button
                    type="button"
                    key={value}
                    onClick={() => handleRecurrenceChange(value)}
                    className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                      (formData.recurrence?.frequency || RecurrenceFrequency.None) === value
                        ? 'bg-pink-500 text-white shadow-sm'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            
          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
