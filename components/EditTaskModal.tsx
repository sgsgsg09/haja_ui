
import React, { useState, useEffect } from 'react';
import { Task, TaskCategory, RecurrenceFrequency } from '../types';

interface EditTaskModalProps {
  task: Task | null;
  onSave: (task: Task) => void;
  onClose: () => void;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, onSave, onClose }) => {
  const [formData, setFormData] = useState<Partial<Task>>({});

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
  }, [task]);

  if (!task) {
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'recurrenceFrequency') {
        const frequency = value as RecurrenceFrequency;
        if (frequency === RecurrenceFrequency.None) {
            const { recurrence, ...rest } = formData;
            setFormData(rest);
        } else {
            setFormData(prev => ({ ...prev, recurrence: { ...prev.recurrence, frequency } }));
        }
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: task.id } as Task);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">일정 수정</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">일정</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
              <select
                id="category"
                name="category"
                value={formData.category || ''}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white"
              >
                {Object.values(TaskCategory).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">시작 시간</label>
              <input
                type="text"
                id="startTime"
                name="startTime"
                value={formData.startTime || ''}
                onChange={handleChange}
                placeholder="예: 오전 11:15"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
             <div>
              <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">종료 시간</label>
              <input
                type="text"
                id="endTime"
                name="endTime"
                value={formData.endTime || ''}
                onChange={handleChange}
                placeholder="예: 오후 1:00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
             <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">소요 시간</label>
              <input
                type="text"
                id="duration"
                name="duration"
                value={formData.duration || ''}
                onChange={handleChange}
                placeholder="예: 1시간 30분"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500"
              />
            </div>
            <div>
              <label htmlFor="recurrenceFrequency" className="block text-sm font-medium text-gray-700 mb-1">반복</label>
              <select
                id="recurrenceFrequency"
                name="recurrenceFrequency"
                value={formData.recurrence?.frequency || RecurrenceFrequency.None}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-pink-500 focus:border-pink-500 bg-white"
              >
                <option value={RecurrenceFrequency.None}>안 함</option>
                <option value={RecurrenceFrequency.Daily}>매일</option>
                <option value={RecurrenceFrequency.Weekly}>매주</option>
                <option value={RecurrenceFrequency.Monthly}>매월</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex justify-end space-x-3">
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
