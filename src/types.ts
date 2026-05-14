export type Priority = 'low' | 'medium' | 'high';

export interface StudySession {
  id: string;
  title: string;
  subject: string;
  startTime: string; // ISO string
  duration: number; // in minutes
  priority: Priority;
  completed: boolean;
  notes?: string;
  tags?: string[];
}

export interface UserStats {
  sessionsCompleted: number;
  totalStudyTime: number; // in minutes
  currentStreak: number;
}
