import { create } from 'zustand';
import { Activity } from '../types';
import { mockActivities } from '../data/mockData';

interface AppState {
  // Basic state
  activities: Activity[];
  isLoading: boolean;
  error: string | null;
  
  // Mock user state
  user: { name: string; email: string } | null;
  isAuthenticated: boolean;
  
  // Enrollment state - shared between ClubPage and SchedulePage
  enrolledSessions: Set<string>;
  
  // Actions
  bookActivity: (activityId: number) => Promise<void>;
  loadActivities: () => Promise<void>;
  clearError: () => void;
  login: () => void;
  logout: () => void;
  
  // Enrollment actions
  enrollInSession: (sessionId: string) => Promise<void>;
  cancelEnrollment: (sessionId: string) => Promise<void>;
  isEnrolled: (sessionId: string) => boolean;
  getEnrollmentCount: () => number;
  canEnrollInMoreSessions: () => boolean;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  activities: mockActivities,
  isLoading: false,
  error: null,
  user: { name: 'Test User', email: 'test@innopolis.university' },
  isAuthenticated: true,
  enrolledSessions: new Set<string>(),

  bookActivity: async (activityId: number) => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const { activities } = get();
    const updatedActivities = activities.map(activity =>
      activity.id === activityId
        ? { ...activity, status: 'booked' as const }
        : activity
    );
    
    set({ activities: updatedActivities, isLoading: false });
  },

  loadActivities: async () => {
    set({ isLoading: true });
    await new Promise(resolve => setTimeout(resolve, 1000));
    set({ activities: mockActivities, isLoading: false });
  },

  clearError: () => set({ error: null }),

  login: () => set({ 
    isAuthenticated: true, 
    user: { name: 'Test User', email: 'test@innopolis.university' } 
  }),

  logout: () => set({ 
    isAuthenticated: false, 
    user: null,
    enrolledSessions: new Set<string>() // Clear enrollments on logout
  }),

  // Enrollment actions
  enrollInSession: async (sessionId: string) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { enrolledSessions } = get();
      const newEnrolledSessions = new Set(enrolledSessions);
      newEnrolledSessions.add(sessionId);
      
      set({ enrolledSessions: newEnrolledSessions });
    } catch (error) {
      set({ error: 'Failed to enroll in session' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  cancelEnrollment: async (sessionId: string) => {
    set({ isLoading: true });
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { enrolledSessions } = get();
      const newEnrolledSessions = new Set(enrolledSessions);
      newEnrolledSessions.delete(sessionId);
      
      set({ enrolledSessions: newEnrolledSessions });
    } catch (error) {
      set({ error: 'Failed to cancel enrollment' });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  isEnrolled: (sessionId: string) => {
    const { enrolledSessions } = get();
    return enrolledSessions.has(sessionId);
  },

  getEnrollmentCount: () => {
    const { enrolledSessions } = get();
    return enrolledSessions.size;
  },

  canEnrollInMoreSessions: () => {
    const { enrolledSessions } = get();
    return enrolledSessions.size < 2; // Maximum 2 sessions per user
  },
}));