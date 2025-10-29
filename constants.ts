
import { Task, TaskCategory, TaskStatus } from './types';

export const INITIAL_TASKS: Task[] = [
  {
    id: 1,
    title: '스마트스토어 관리 및 제품 서치',
    category: TaskCategory.Work,
    startTime: '오전 11:15',
    endTime: '오전 11:45',
    duration: '30분',
    status: TaskStatus.Pending,
  },
  {
    id: 2,
    title: '집안일',
    category: TaskCategory.Home,
    startTime: '오전 11:15',
    endTime: '오전 11:45',
    duration: '30분',
    status: TaskStatus.Pending,
  },
  {
    id: 3,
    title: '점심',
    category: TaskCategory.Meal,
    startTime: '오후 12:00',
    endTime: '오후 1:00',
    duration: '1시간',
    status: TaskStatus.Pending,
  },
  {
    id: 4,
    title: '브런치 업로드 & 초안 작성',
    category: TaskCategory.Work,
    startTime: '오후 1:05',
    endTime: '오후 2:35',
    duration: '1시간 30분',
    status: TaskStatus.Completed,
  },
  {
    id: 5,
    title: '강아지 산책',
    category: TaskCategory.Personal,
    startTime: '오후 3:15',
    endTime: '오후 3:45',
    duration: '30분',
    status: TaskStatus.Pending,
  },
];
