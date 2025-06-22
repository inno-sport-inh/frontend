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
  
  // Actions
  bookActivity: (activityId: number) => Promise<void>;
  loadActivities: () => Promise<void>;
  clearError: () => void;
  login: () => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  activities: mockActivities,
  isLoading: false,
  error: null,
  user: { name: 'Test User', email: 'test@innopolis.university' },
  isAuthenticated: true,

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
  login: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));