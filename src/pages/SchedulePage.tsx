import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, Users, UserCheck, AlertCircle, ChevronDown, ChevronUp, FileText } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import CheckoutModal from '../components/CheckoutModal';
import SportInfoModal from '../components/SportInfoModal';
import { MedicalReferenceModal } from '../components/MedicalReferenceModal';
import { generateSessionId } from '../utils/sessionUtils';
import { studentAPI } from '../services/studentAPI';
import { studentService } from '../services/studentService';

// Utility functions for date handling
const getWeekStart = (date: Date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const weekStart = new Date(d.setDate(diff));
  weekStart.setHours(0, 0, 0, 0); // Set to start of day
  return weekStart;
};

const getWeekEnd = (date: Date) => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999); // Set to end of day
  return weekEnd;
};

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

const formatWeekRange = (weekStart: Date) => {
  const weekEnd = getWeekEnd(weekStart);
  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
};

interface Activity {
  id: string;
  activity: string;
  time: string;
  dayOfWeek: string;
  date: Date;
  status: 'free' | 'booked' | 'past';
  maxParticipants: number;
  currentParticipants: number;
  isPast: boolean;
  isRegistrationOpen: boolean;
  groupId: number;
  trainingId: number;
}

// Fixed weekly schedule - same activities every week
const WEEKLY_SCHEDULE = [
  { day: 'Monday', activities: [
    { activity: 'Basketball', time: '09:00 - 10:30', maxParticipants: 12 },
    { activity: 'Swimming', time: '14:00 - 15:30', maxParticipants: 15 },
    { activity: 'Gym Training', time: '18:00 - 19:30', maxParticipants: 10 }
  ]},
  { day: 'Tuesday', activities: [
    { activity: 'Table Tennis', time: '11:00 - 12:30', maxParticipants: 8 },
    { activity: 'Volleyball', time: '16:00 - 17:30', maxParticipants: 14 },
    { activity: 'Yoga', time: '19:00 - 20:30', maxParticipants: 20 }
  ]},
  { day: 'Wednesday', activities: [
    { activity: 'Tennis', time: '09:00 - 10:30', maxParticipants: 6 },
    { activity: 'Basketball', time: '14:00 - 15:30', maxParticipants: 12 },
    { activity: 'Swimming', time: '18:00 - 19:30', maxParticipants: 15 }
  ]},
  { day: 'Thursday', activities: [
    { activity: 'Football', time: '11:00 - 12:30', maxParticipants: 16 },
    { activity: 'Gym Training', time: '16:00 - 17:30', maxParticipants: 10 },
    { activity: 'Table Tennis', time: '19:00 - 20:30', maxParticipants: 8 }
  ]},
  { day: 'Friday', activities: [
    { activity: 'Volleyball', time: '09:00 - 10:30', maxParticipants: 14 },
    { activity: 'Yoga', time: '14:00 - 15:30', maxParticipants: 20 },
    { activity: 'Basketball', time: '18:00 - 19:30', maxParticipants: 12 }
  ]},
  { day: 'Saturday', activities: [
    { activity: 'Tennis', time: '11:00 - 12:30', maxParticipants: 6 },
    { activity: 'Football', time: '16:00 - 17:30', maxParticipants: 16 }
  ]},
  { day: 'Sunday', activities: [
    { activity: 'Swimming', time: '09:00 - 10:30', maxParticipants: 15 },
    { activity: 'Yoga', time: '19:00 - 20:30', maxParticipants: 20 }
  ]}
];

const generateWeekActivities = async (weekStart: Date): Promise<Activity[]> => {
  const weekEnd = getWeekEnd(weekStart);
  
  console.log('🗓️ Fetching schedule for week:', {
    weekStart: weekStart.toISOString(),
    weekEnd: weekEnd.toISOString(),
    weekStartLocal: weekStart.toLocaleDateString(),
    weekEndLocal: weekEnd.toLocaleDateString()
  });
  
  try {
    const trainings = await studentAPI.getWeeklySchedule(weekStart, weekEnd);
    console.log('📊 Received trainings from API:', trainings.length, 'trainings');
    console.log('📋 Raw API response:', trainings);
    const now = new Date();
    
    return trainings.map((training) => {
      const startTime = new Date(training.start);
      const endTime = new Date(training.end);
      const isPastActivity = endTime < now;
      
      // Check if registration is open (registration opens exactly 1 week before activity starts)
      const registrationOpenTime = new Date(startTime);
      registrationOpenTime.setDate(registrationOpenTime.getDate() - 7);
      const isRegistrationOpen = now >= registrationOpenTime;
      
      // Generate consistent session ID
      const sessionId = generateSessionId(
        training.group_name,
        startTime.toLocaleDateString('en-US', { weekday: 'long' }),
        `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
        startTime
      );
      
      return {
        id: sessionId,
        activity: training.group_name,
        time: `${startTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${endTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}`,
        dayOfWeek: startTime.toLocaleDateString('en-US', { weekday: 'long' }),
        date: startTime,
        status: isPastActivity ? 'past' as const : (training.checked_in ? 'booked' as const : 'free' as const),
        maxParticipants: training.capacity,
        currentParticipants: training.participants.total_checked_in,
        isPast: isPastActivity,
        isRegistrationOpen: isRegistrationOpen && training.can_check_in,
        groupId: training.group_id,
        trainingId: training.id
      };
    });
  } catch (error) {
    console.error('Error fetching weekly schedule:', error);
    // Fallback to mock data if API fails
    return generateMockWeekActivities(weekStart);
  }
};

const generateMockWeekActivities = (weekStart: Date): Activity[] => {
  const activities: Activity[] = [];
  const now = new Date();
  
  WEEKLY_SCHEDULE.forEach((daySchedule, dayIndex) => {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + dayIndex);
    
    daySchedule.activities.forEach((activityTemplate) => {
      // Parse activity start time
      const [startTimeStr] = activityTemplate.time.split(' - ');
      const [startHour, startMinute] = startTimeStr.split(':').map(Number);
      
      const activityStartTime = new Date(currentDate);
      activityStartTime.setHours(startHour, startMinute, 0, 0);
      
      // Parse activity end time
      const [, endTimeStr] = activityTemplate.time.split(' - ');
      const [endHour, endMinute] = endTimeStr.split(':').map(Number);
      
      const activityEndTime = new Date(currentDate);
      activityEndTime.setHours(endHour, endMinute, 0, 0);
      
      // Check if activity has passed
      const isPastActivity = activityEndTime < now;
      
      // Check if registration is open (registration opens exactly 1 week before activity starts)
      const registrationOpenTime = new Date(activityStartTime);
      registrationOpenTime.setDate(registrationOpenTime.getDate() - 7);
      const isRegistrationOpen = now >= registrationOpenTime;
      
      // Generate consistent session ID
      const sessionId = generateSessionId(
        activityTemplate.activity,
        daySchedule.day,
        activityTemplate.time,
        currentDate
      );
      
      activities.push({
        id: sessionId,
        activity: activityTemplate.activity,
        time: activityTemplate.time,
        dayOfWeek: daySchedule.day,
        date: new Date(currentDate),
        status: isPastActivity ? 'past' : 'free',
        maxParticipants: activityTemplate.maxParticipants,
        currentParticipants: Math.floor(Math.random() * 4) + 2, // Random current participants for demo
        isPast: isPastActivity,
        isRegistrationOpen: isRegistrationOpen,
        groupId: Math.floor(Math.random() * 100) + 1, // Mock group ID
        trainingId: Math.floor(Math.random() * 1000) + 1 // Mock training ID
      });
    });
  });
  
  return activities;
};

const SchedulePage: React.FC = () => {
  const { isLoading, canEnrollInMoreSessions } = useAppStore();
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showMedicalModal, setShowMedicalModal] = useState(false);
  
  // Local function to check if user is enrolled in activity
  const isEnrolled = (activityId: string) => {
    const activity = weekActivities.find(a => a.id === activityId);
    return activity?.status === 'booked';
  };
  const [showSportInfoModal, setShowSportInfoModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    // Initialize with current week (not hardcoded date)
    return getWeekStart(new Date());
  });
  const [weekActivities, setWeekActivities] = useState<Activity[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pastDaysCollapsed, setPastDaysCollapsed] = useState(true);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(false);
  const [studentProgress, setStudentProgress] = useState({
    completedHours: 12,
    totalHours: 30,
    progressPercentage: 40,
    debt: 0,
    selfSportHours: 0,
    isComplete: false
  });
  const [studentPercentile, setStudentPercentile] = useState(85);
  const [studentProfile, setStudentProfile] = useState<any>(null);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  // Load student progress data
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        // Get profile first since it contains all the hours data we need
        const profile = await studentService.getProfile();
        const percentile = await studentService.getStudentPercentile();
        
        // Calculate progress directly from profile data
        const progress = studentService.calculateProgressFromProfile(profile);
        
        setStudentProgress(progress);
        setStudentPercentile(percentile);
        setStudentProfile(profile);
        
        console.log('📊 Student data loaded:', {
          profile,
          progress,
          percentile
        });
      } catch (error) {
        console.error('Error loading student data:', error);
      }
    };

    loadStudentData();
  }, []);

  // Update activities when week changes
  useEffect(() => {
    const loadActivities = async () => {
      setIsLoadingActivities(true);
      try {
        const newActivities = await generateWeekActivities(currentWeekStart);
        setWeekActivities(newActivities);
      } catch (error) {
        console.error('Error loading activities:', error);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    loadActivities();
  }, [currentWeekStart]);

  // Update activity status every minute to handle time-based changes
  useEffect(() => {
    const updateActivityStatus = () => {
      setWeekActivities(prev => prev.map(activity => {
        // Parse end time to check if activity has passed
        const [, endTimeStr] = activity.time.split(' - ');
        const [endHour, endMinute] = endTimeStr.split(':').map(Number);
        
        const activityEndTime = new Date(activity.date);
        activityEndTime.setHours(endHour, endMinute, 0, 0);
        
        const now = new Date();
        const isPastActivity = activityEndTime < now;
        
        return {
          ...activity,
          isPast: isPastActivity,
          status: isPastActivity ? 'past' : activity.status // Keep current booking status but mark as past if time has passed
        };
      }));
    };

    // Set up interval to update every minute
    const interval = setInterval(updateActivityStatus, 60000);
    
    return () => clearInterval(interval);
  }, []); // No dependencies needed

  const handlePreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    console.log('⬅️ Navigating to previous week:', {
      from: currentWeekStart.toLocaleDateString(),
      to: newWeekStart.toLocaleDateString()
    });
    setCurrentWeekStart(newWeekStart);
  };

  const handleNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    console.log('➡️ Navigating to next week:', {
      from: currentWeekStart.toLocaleDateString(),
      to: newWeekStart.toLocaleDateString()
    });
    setCurrentWeekStart(newWeekStart);
  };

  const handleBookActivity = async (activityId: string) => {
    try {
      const activity = weekActivities.find(a => a.id === activityId);
      if (!activity || !activity.trainingId) {
        console.error('Training not found or missing trainingId');
        return;
      }

      // Make API call to check in
      await studentAPI.checkIn(activity.trainingId);
      
      // Update local state to reflect the change
      setWeekActivities(prev => prev.map(activity =>
        activity.id === activityId
          ? { 
              ...activity, 
              status: 'booked' as const,
              currentParticipants: activity.currentParticipants + 1
            }
          : activity
      ));
    } catch (error) {
      console.error('Error enrolling in session:', error);
    }
  };

  const confirmCancelBooking = async () => {
    if (selectedActivity) {
      try {
        setIsModalLoading(true);
        
        const activity = weekActivities.find(a => a.id === selectedActivity.id);
        if (!activity || !activity.trainingId) {
          console.error('Training not found or missing trainingId');
          return;
        }

        // Make API call to cancel check-in
        await studentAPI.cancelCheckIn(activity.trainingId);
        
        // Update local state to reflect the change
        setWeekActivities(prev => prev.map(activity =>
          activity.id === selectedActivity.id
            ? { 
                ...activity, 
                status: 'free' as const,
                currentParticipants: Math.max(activity.currentParticipants - 1, 0)
              }
            : activity
        ));
        setShowCancelModal(false);
        setSelectedActivity(null);
      } catch (error) {
        console.error('Error canceling enrollment:', error);
      } finally {
        setIsModalLoading(false);
      }
    }
  };

  const handleSportClick = (sportName: string) => {
    setSelectedSport(sportName);
    setShowSportInfoModal(true);
  };

  const getActivitiesForDay = (day: string) => {
    return weekActivities.filter(activity => activity.dayOfWeek === day);
  };

  const isActivityFull = (activity: Activity) => {
    return activity.currentParticipants >= activity.maxParticipants;
  };

  const getActivityStatus = (activity: Activity) => {
    if (activity.isPast) return 'past';
    // Check if user is enrolled/checked in based on the activity data
    return activity.status; // This now comes from the API (checked_in field)
  };

  const getParticipantsBadgeStyle = (activity: Activity) => {
    const availableSpots = activity.maxParticipants - activity.currentParticipants;
    if (availableSpots === 0) return 'innohassle-badge-error';
    if (availableSpots <= 3) return 'innohassle-badge-warning';
    return 'innohassle-badge-success';
  };

  const getParticipantsText = (activity: Activity) => {
    const availableSpots = activity.maxParticipants - activity.currentParticipants;
    if (availableSpots === 0) {
      return 'Full';
    } else if (availableSpots === 1) {
      return '1 spot left';
    } else {
      return `${availableSpots} spots left`;
    }
  };

  const getDayHeader = (dayName: string, index: number) => {
    const dayDate = new Date(currentWeekStart);
    dayDate.setDate(currentWeekStart.getDate() + index);
    dayDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of today
    
    const isToday = dayDate.getTime() === today.getTime();
    const isPastDay = dayDate < today;
    
    return (
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl font-semibold ${
            isToday 
              ? 'text-brand-violet' 
              : isPastDay 
              ? 'text-inactive opacity-50' 
              : 'text-contrast'
          }`}>
            {dayName}
          </h3>
          <p className={`text-sm ${
            isPastDay ? 'text-inactive opacity-40' : 'text-inactive'
          }`}>
            {formatDate(dayDate)}
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {isToday && (
            <span className="innohassle-badge-primary text-xs px-2 py-1">Today</span>
          )}
          {isPastDay && (
            <button
              onClick={() => setPastDaysCollapsed(!pastDaysCollapsed)}
              className="flex items-center space-x-1 text-inactive hover:text-contrast transition-colors p-1"
              title={pastDaysCollapsed ? 'Expand past day' : 'Collapse past day'}
            >
              {pastDaysCollapsed ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronUp size={16} />
              )}
              <span className="text-xs">
                {pastDaysCollapsed ? 'Show' : 'Hide'}
              </span>
            </button>
          )}
        </div>
      </div>
    );
  };

  const openActivityModal = (activity: any) => {
    setSelectedActivity(activity);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedActivity(null);
    setIsModalLoading(false);
  };

  return (
    <div 
      className="max-w-7xl mx-auto space-y-6 mobile-content-bottom-padding" 
      style={{ backgroundColor: 'rgb(var(--color-pagebg))' }}
    >
      {/* Progress Header */}
      <div className="relative overflow-hidden innohassle-card p-4 sm:p-6 bg-gradient-to-br from-brand-violet/5 via-transparent to-brand-violet/10 border-2 border-brand-violet/20 hover:border-brand-violet/30 transition-all duration-300 shadow-lg shadow-brand-violet/5">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-violet/10 to-transparent rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-brand-violet/10 to-transparent rounded-full blur-2xl translate-y-12 -translate-x-12"></div>
        
        <div className="relative text-center">
          <div className="mb-4">
            <div className="inline-flex items-center justify-center w-12 h-12 mb-3 bg-gradient-to-br from-brand-violet/20 to-brand-violet/10 rounded-2xl">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-violet to-brand-violet/80 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏃</span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-contrast mb-2 bg-gradient-to-r from-brand-violet to-brand-violet/80 bg-clip-text text-transparent">
              {studentProfile ? `${studentProfile.name}'s Sport Progress` : 'Your Sport Progress'}
            </h2>
            <p className="text-sm sm:text-base text-inactive">
              You've completed <span className="font-semibold text-brand-violet">{studentProgress.completedHours}</span> out of <span className="font-semibold text-contrast">{studentProgress.totalHours}</span> required hours this semester
              {studentProgress.completedHours > studentProgress.totalHours && (
                <span className="block mt-1 text-success-500 font-medium">
                  🎉 Exceeded requirement by {studentProgress.completedHours - studentProgress.totalHours} hours!
                </span>
              )}
            </p>
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between text-xs sm:text-sm text-inactive mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-brand-violet rounded-full animate-pulse"></div>
                <span className="font-semibold">{studentProgress.completedHours} hours completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-secondary rounded-full"></div>
                <span className="font-medium">
                  {studentProgress.completedHours >= studentProgress.totalHours 
                    ? `+${studentProgress.completedHours - studentProgress.totalHours} extra hours`
                    : `${studentProgress.totalHours - studentProgress.completedHours} hours remaining`
                  }
                </span>
              </div>
            </div>
            
            {/* Progress Bar Container with extra padding for the indicator */}
            <div className="relative w-full py-1">
              <div className="w-full bg-gradient-to-r from-secondary/50 to-secondary/30 rounded-2xl h-6 shadow-inner border border-secondary/50 relative">
                {/* Background pattern */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded-2xl overflow-hidden"></div>
                
                {/* Progress Fill */}
                <div 
                  className="h-full rounded-2xl transition-all duration-1500 ease-out relative overflow-hidden group"
                  style={{ 
                    width: `${Math.min(studentProgress.progressPercentage, 100)}%`,
                    background: 'linear-gradient(90deg, rgb(var(--color-brand-gradient-start)) 0%, rgb(var(--color-brand-violet)) 50%, rgb(var(--color-brand-gradient-end)) 100%)'
                  }}
                >
                  {/* Animated shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite] group-hover:animate-[shimmer_1s_ease-in-out_infinite]"></div>
                  
                  {/* Progress text overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-white font-bold text-xs drop-shadow-sm">
                      {studentProgress.progressPercentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                {/* Progress indicator dot - positioned within the container */}
                <div 
                  className="absolute top-1/2 transform -translate-y-1/2 w-8 h-8 transition-all duration-1500 ease-out group hover:scale-110 z-10"
                  style={{ left: `calc(${Math.min(studentProgress.progressPercentage, 100)}% - 16px)` }}
                >
                  <div className="w-full h-full bg-white rounded-full shadow-lg border-[3px] border-brand-violet flex items-center justify-center">
                    <div className="w-4 h-4 bg-gradient-to-br from-brand-violet to-brand-violet/80 rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Milestone markers */}
                <div className="absolute inset-0 flex items-center overflow-hidden rounded-2xl">
                  {[25, 50, 75].map((milestone) => (
                    <div
                      key={milestone}
                      className="absolute top-0 bottom-0 w-0.5 bg-white/30"
                      style={{ left: `${milestone}%` }}
                    >
                      <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white/50 rounded-full"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Progress Stats */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <div className="flex items-center space-x-2 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 px-4 py-2 rounded-xl border border-brand-violet/20">
                <div className="w-2 h-2 bg-brand-violet rounded-full"></div>
                <span className="text-sm font-bold text-contrast">
                  {studentProgress.progressPercentage.toFixed(1)}% Complete
                </span>
              </div>
              
              {studentProgress.selfSportHours > 0 && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-blue-500/10 to-blue-500/5 px-4 py-2 rounded-xl border border-blue-500/20">
                  <span className="text-lg">🏋️</span>
                  <span className="text-sm font-bold text-blue-500">
                    {studentProgress.selfSportHours} Self-Sport Hours
                  </span>
                </div>
              )}
              
              {studentProgress.debt > 0 && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-500/10 to-orange-500/5 px-4 py-2 rounded-xl border border-orange-500/20">
                  <span className="text-lg">⚠️</span>
                  <span className="text-sm font-bold text-orange-500">
                    {studentProgress.debt} Hours Debt
                  </span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 bg-gradient-to-r from-success-500/10 to-success-500/5 px-4 py-2 rounded-xl border border-success-500/20">
                <span className="text-lg">🎯</span>
                <span className="text-sm font-bold text-success-500">
                  Top {100 - studentPercentile}% Performer
                </span>
              </div>
              
              {studentProgress.progressPercentage >= 100 && (
                <div className="flex items-center space-x-2 bg-gradient-to-r from-brand-violet/20 to-brand-violet/10 px-4 py-2 rounded-xl border border-brand-violet/30 animate-bounce">
                  <span className="text-lg">🏆</span>
                  <span className="text-sm font-bold text-brand-violet">
                    Goal Achieved!
                  </span>
                </div>
              )}
            </div>
            
            {/* Motivational Message */}
            <div className="mt-4 text-center">
              <p className="text-sm text-inactive">
                {studentProgress.progressPercentage >= 100 
                  ? "Congratulations! You've completed all required hours!" 
                  : studentProgress.progressPercentage >= 75 
                  ? "You're almost there! Keep it up!" 
                  : studentProgress.progressPercentage >= 50 
                  ? "Great progress! You're halfway there!" 
                  : studentProgress.progressPercentage >= 25 
                  ? "Good start! Keep building momentum!" 
                  : "Let's get started on your fitness journey!"
                }
              </p>
              {studentProgress.progressPercentage < 100 && (
                <p className="text-xs text-inactive mt-1">
                  Estimated time to completion: {Math.ceil(Math.max((studentProgress.totalHours - studentProgress.completedHours), 0) / 2)} weeks
                </p>
              )}
              {studentProgress.progressPercentage >= 100 && studentProgress.completedHours > studentProgress.totalHours && (
                <p className="text-xs text-success-500 mt-1 font-medium">
                  You've exceeded the requirement by {studentProgress.completedHours - studentProgress.totalHours} hours! 🌟
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center sm:text-left">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-violet/20 to-brand-violet/10 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-contrast">Weekly Schedule</h1>
              <p className="text-inactive text-sm sm:text-base">Enroll in your training sessions for the week</p>
            </div>
          </div>
          
          {/* Medical Reference Button */}
          <button
            onClick={() => setShowMedicalModal(true)}
            className="innohassle-button-primary px-4 py-2 flex items-center space-x-2 text-sm font-medium transition-all duration-300 hover:scale-105"
          >
            <FileText size={16} />
            <span className="hidden sm:inline">Medical Reference</span>
            <span className="sm:hidden">Medical</span>
          </button>
        </div>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between gap-4 innohassle-card p-4 sm:p-6 bg-gradient-to-r from-floating to-primary/50 border-2 border-secondary/50 hover:border-brand-violet/30 transition-all duration-300">
        <button 
          onClick={handlePreviousWeek}
          className="group innohassle-button-secondary px-4 sm:px-6 py-3 flex items-center space-x-2 flex-shrink-0 hover:scale-105 transition-transform duration-200"
        >
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="hidden xs:inline sm:hidden font-medium">Prev</span>
          <span className="hidden sm:inline font-medium">Previous week</span>
        </button>
        
        <div className="text-center flex-1 min-w-0">
          <h3 className="text-lg sm:text-xl font-bold text-contrast truncate bg-gradient-to-r from-brand-violet to-brand-violet/80 bg-clip-text text-transparent">
            {formatWeekRange(currentWeekStart)}
          </h3>
          <p className="text-xs sm:text-sm text-inactive mt-1 font-medium">
            {currentWeekStart.getFullYear()}
          </p>
        </div>
        
        <button 
          onClick={handleNextWeek}
          className="group innohassle-button-secondary px-4 sm:px-6 py-3 flex items-center space-x-2 flex-shrink-0 hover:scale-105 transition-transform duration-200"
        >
          <span className="hidden xs:inline sm:hidden font-medium">Next</span>
          <span className="hidden sm:inline font-medium">Next week</span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </div>

      {/* Past Days Control - only show if there are past days */}
      {(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to start of today
        
        const hasPastDays = daysOfWeek.some((_, index) => {
          const dayDate = new Date(currentWeekStart);
          dayDate.setDate(currentWeekStart.getDate() + index);
          dayDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
          return dayDate < today;
        });
        
        if (!hasPastDays) return null;
        
        return (
          <div className="flex items-center justify-between innohassle-card p-4 sm:p-6 bg-gradient-to-r from-primary/30 to-secondary/20 border-2 border-secondary/50 hover:border-inactive/50 transition-all duration-300">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-inactive/20 to-inactive/10 rounded-xl flex items-center justify-center">
                <Clock size={20} className="text-inactive" />
              </div>
              <div>
                <span className="text-contrast font-semibold">Past Days</span>
                <p className="text-sm text-inactive">Activities that have ended</p>
              </div>
            </div>
            <button
              onClick={() => setPastDaysCollapsed(!pastDaysCollapsed)}
              className="group flex items-center space-x-2 text-brand-violet hover:text-brand-violet/80 transition-all duration-200 bg-brand-violet/10 hover:bg-brand-violet/20 px-4 py-2 rounded-xl"
            >
              {pastDaysCollapsed ? (
                <>
                  <ChevronDown size={18} className="group-hover:translate-y-0.5 transition-transform duration-200" />
                  <span className="text-sm font-medium">Show Past Days</span>
                </>
              ) : (
                <>
                  <ChevronUp size={18} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
                  <span className="text-sm font-medium">Hide Past Days</span>
                </>
              )}
            </button>
          </div>
        );
      })()}

      {/* Weekly Schedule Grid */}
      <div className="space-y-3">
        {daysOfWeek.map((day, index) => {
          const dayActivities = getActivitiesForDay(day);
          const dayDate = new Date(currentWeekStart);
          dayDate.setDate(currentWeekStart.getDate() + index);
          dayDate.setHours(0, 0, 0, 0); // Set to start of day for comparison
          
          const today = new Date();
          today.setHours(0, 0, 0, 0); // Set to start of today
          const isPastDay = dayDate < today;
          
          // Skip rendering past days if collapsed
          if (isPastDay && pastDaysCollapsed) {
            return null;
          }
          
          return (
            <div key={day} className="group innohassle-card overflow-hidden border-2 border-secondary/30 hover:border-brand-violet/40 transition-all duration-300 hover:shadow-lg hover:shadow-brand-violet/10 hover:-translate-y-1 transform rounded-lg">
              {/* Day Header */}
              <div className="bg-gradient-to-r from-primary/50 to-secondary/30 border-b border-secondary/50 px-2 py-2 group-hover:from-primary/70 group-hover:to-secondary/50 transition-all duration-300">
                {getDayHeader(day, index)}
              </div>
              
              {/* Activities */}
              <div className="p-2 space-y-2 bg-gradient-to-b from-floating to-primary/20">
                {isLoadingActivities ? (
                  <div className="text-center py-12 text-inactive">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-brand-violet/20 to-brand-violet/10 rounded-2xl flex items-center justify-center">
                      <div className="animate-spin w-8 h-8 border-2 border-brand-violet border-t-transparent rounded-full"></div>
                    </div>
                    <p className="font-medium">Loading activities...</p>
                    <p className="text-sm mt-1 opacity-75">Please wait while we fetch the latest schedule</p>
                  </div>
                ) : dayActivities.length === 0 ? (
                  <div className="text-center py-12 text-inactive">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-secondary/30 to-secondary/20 rounded-2xl flex items-center justify-center">
                      <Clock size={32} className="opacity-50" />
                    </div>
                    <p className="font-medium">No activities scheduled for this day</p>
                    <p className="text-sm mt-1 opacity-75">Check back later for updates</p>
                  </div>
                ) : (
                  dayActivities.map((activity) => {
                    const isFull = isActivityFull(activity);
                    const activityStatus = getActivityStatus(activity);
                    const canBook = activityStatus === 'free' && !isFull && !activity.isPast && activity.isRegistrationOpen;
                    
                    return (
                      <div
                        key={activity.id}
                        className={`group/activity p-3 sm:p-3 rounded-lg border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                          activityStatus === 'booked' 
                            ? 'border-brand-violet bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 shadow-lg shadow-brand-violet/20 hover:shadow-brand-violet/30' 
                            : activity.isPast
                            ? 'activity-past opacity-60 hover:opacity-80'
                            : !activity.isRegistrationOpen
                            ? 'bg-gradient-to-r from-secondary/30 to-secondary/20 border-secondary/50 hover:border-secondary/70'
                            : isFull
                            ? 'bg-gradient-to-r from-error-500/10 to-error-500/5 border-error-500/30 hover:border-error-500/50'
                            : 'bg-gradient-to-r from-floating to-primary/30 border-secondary/30 hover:border-brand-violet/50 hover:from-brand-violet/5 hover:to-brand-violet/10 hover:shadow-lg hover:shadow-brand-violet/10'
                        }`}
                        onClick={() => openActivityModal(activity)}
                      >
                        {/* Mobile Layout - Only time and name */}
                        <div className="block sm:hidden">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className={`flex items-center space-x-1 cursor-pointer ${
                                activity.isPast ? 'text-inactive' : 'text-contrast'
                              }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSportClick(activity.activity);
                                }}
                              >
                                <Clock size={14} />
                                <span className="font-medium text-xs hover:text-brand-violet transition-colors">{activity.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users size={14} className="text-inactive" />
                                <span className="text-contrast font-medium text-xs">{activity.activity}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1">
                              {activityStatus === 'booked' && (
                                <div className="innohassle-badge innohassle-badge-primary text-xs">
                                  ✓ Enrolled
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Desktop Layout - Full details */}
                        <div className="hidden sm:block">
                          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div className="flex flex-col space-y-1 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                              <div className={`flex items-center space-x-1 cursor-pointer ${
                                activity.isPast ? 'text-inactive' : 'text-contrast'
                              }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleSportClick(activity.activity);
                                }}
                              >
                                <Clock size={15} />
                                <span className="font-medium text-xs sm:text-sm hover:text-brand-violet transition-colors">{activity.time}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users size={15} className="text-inactive" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSportClick(activity.activity);
                                  }}
                                  className="text-contrast font-medium hover:text-brand-violet transition-colors cursor-pointer underline-offset-2 hover:underline text-xs sm:text-sm"
                                >
                                  {activity.activity}
                                </button>
                              </div>
                              {activityStatus === 'booked' && (
                                <div className="flex items-center space-x-2">
                                  <UserCheck size={18} className="text-brand-violet" />
                                  <span className="text-xs sm:text-sm font-medium selected">You're enrolled</span>
                                </div>
                              )}
                              {activity.isPast && (
                                <div className="flex items-center space-x-2">
                                  <AlertCircle size={18} className="text-inactive" />
                                  <span className="text-xs sm:text-sm text-inactive">Past event</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                              {/* Participants Counter */}
                              <span className={`text-xs font-medium ${
                                activity.isPast 
                                  ? 'text-inactive' 
                                  : 'text-contrast'
                              }`}>
                                {activity.currentParticipants}/{activity.maxParticipants} enrolled
                              </span>
                              
                              {/* Availability Badge */}
                              <span className={`${getParticipantsBadgeStyle(activity)} text-xs`}>
                                {getParticipantsText(activity)}
                              </span>
                              
                              {/* Action Button */}
                              {!activity.isPast && (
                                <div className="flex justify-end sm:justify-start">
                                  {activityStatus === 'free' ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        canBook && handleBookActivity(activity.id);
                                      }}
                                      className="innohassle-button innohassle-button-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors h-9"
                                      style={{ borderRadius: '0.75rem' }}
                                      disabled={!canBook || isLoading}
                                    >
                                      {isFull 
                                        ? 'Full' 
                                        : !activity.isRegistrationOpen 
                                        ? 'Enroll'
                                        : 'Enroll'
                                      }
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // На десктопной версии используем обычную функцию отмены через модальное окно
                                        setSelectedActivity(activity);
                                        setShowCancelModal(true);
                                      }}
                                      className="innohassle-button innohassle-button-error px-3 sm:px-4 py-2 text-xs sm:text-sm"
                                      disabled={isLoading}
                                    >
                                      Cancel
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Cancel booking modal */}
      <CheckoutModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedActivity(null);
        }}
        onConfirm={confirmCancelBooking}
        activityName={selectedActivity?.activity || ''}
        time={selectedActivity?.time || ''}
        isLoading={isLoading}
      />

      {/* Sport info modal */}
      <SportInfoModal
        isOpen={showSportInfoModal}
        onClose={() => {
          setShowSportInfoModal(false);
          setSelectedSport('');
        }}
        sportName={selectedSport}
      />

      {/* Medical Reference Modal */}
      <MedicalReferenceModal
        isOpen={showMedicalModal}
        onClose={() => setShowMedicalModal(false)}
        onSuccess={() => {
          // Можно добавить уведомление об успешной загрузке
          console.log('Medical reference uploaded successfully');
        }}
      />

      {/* Activity Details Modal */}
      {isModalOpen && selectedActivity && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Enhanced background overlay */}
          <div className="hidden sm:block fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal} />
          
          {/* Mobile background */}
          <div className="block sm:hidden fixed inset-0 bg-pagebg" />
          
          <div className="bg-pagebg max-w-lg w-full max-h-[90vh] overflow-y-auto relative z-10 rounded-3xl shadow-2xl border-2 border-secondary/30 transform transition-all duration-300 scale-100">
            {/* Enhanced modal content */}
            <div className="relative overflow-hidden">
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-brand-violet/10 to-transparent rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
              
              <div className="p-6 relative">
                {/* Modal Header */}
                <div className="flex items-start justify-between mb-8">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand-violet/20 to-brand-violet/10 rounded-2xl flex items-center justify-center">
                      <span className="text-2xl">🏃</span>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-contrast mb-2 bg-gradient-to-r from-brand-violet to-brand-violet/80 bg-clip-text text-transparent">
                        {selectedActivity.activity}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-inactive">
                        <Clock size={16} />
                        <span className="font-medium">{selectedActivity.time}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={closeModal}
                    className="w-10 h-10 flex items-center justify-center bg-secondary/50 hover:bg-secondary/80 rounded-xl transition-all duration-200 text-inactive hover:text-contrast"
                  >
                    <span className="text-xl">×</span>
                  </button>
                </div>

                {/* Activity Details */}
                <div className="space-y-6 mb-8">
                  <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-floating to-primary/30 rounded-2xl border border-secondary/50">
                    <div className="w-12 h-12 bg-gradient-to-br from-brand-violet/20 to-brand-violet/10 rounded-xl flex items-center justify-center">
                      <Users className="text-brand-violet" size={24} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-inactive font-medium">Participants</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <p className="text-lg font-bold text-contrast">
                          {selectedActivity.currentParticipants}/{selectedActivity.maxParticipants}
                        </p>
                        {/* Enhanced progress bar */}
                        <div className="flex-1 max-w-24 h-2 bg-secondary/50 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.9
                                ? 'bg-error-500'
                                : selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.7
                                ? 'bg-warning-500'
                                : 'bg-success-500'
                            }`}
                            style={{ 
                              width: `${Math.min((selectedActivity.currentParticipants / selectedActivity.maxParticipants) * 100, 100)}%` 
                            }}
                          />
                        </div>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                          selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.9
                            ? 'bg-error-500/20 text-error-500'
                            : selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.7
                            ? 'bg-warning-500/20 text-warning-500'
                            : 'bg-success-500/20 text-success-500'
                        }`}>
                          {selectedActivity.maxParticipants - selectedActivity.currentParticipants} spots left
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Status Information */}
                  <div className="bg-gradient-to-r from-primary/50 to-secondary/30 rounded-2xl p-4 border border-secondary/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${
                          isEnrolled(selectedActivity.id)
                            ? 'bg-brand-violet'
                            : selectedActivity.isPast
                            ? 'bg-inactive'
                            : selectedActivity.currentParticipants >= selectedActivity.maxParticipants
                            ? 'bg-error-500'
                            : 'bg-success-500'
                        }`}></div>
                        <span className={`innohassle-badge ${
                          isEnrolled(selectedActivity.id)
                            ? 'innohassle-badge-primary'
                            : selectedActivity.isPast
                            ? 'bg-inactive/20 text-inactive border-inactive/30'
                            : selectedActivity.currentParticipants >= selectedActivity.maxParticipants
                            ? 'innohassle-badge-error'
                            : 'innohassle-badge-success'
                        }`}>
                          {isEnrolled(selectedActivity.id)
                            ? 'You are enrolled'
                            : selectedActivity.isPast
                            ? 'Past event'
                            : selectedActivity.currentParticipants >= selectedActivity.maxParticipants
                            ? 'Full'
                            : 'Available'
                          }
                        </span>
                      </div>
                      <span className={`text-sm font-medium ${
                        selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.8
                          ? 'text-error-500'
                          : selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.6
                          ? 'text-warning-500'
                          : 'text-success-500'
                      }`}>
                        {selectedActivity.currentParticipants >= selectedActivity.maxParticipants
                          ? 'Fully enrolled'
                          : selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.8
                          ? 'Almost full'
                          : selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.6
                          ? 'Filling up'
                          : 'Spots available'
                        }
                      </span>
                    </div>
                  </div>

                  {/* Enrolled indicator */}
                  {isEnrolled(selectedActivity.id) && (
                    <div className="flex items-center space-x-3 text-brand-violet p-4 bg-gradient-to-r from-brand-violet/10 to-brand-violet/5 rounded-2xl border border-brand-violet/30">
                      <UserCheck size={20} />
                      <span className="text-sm font-semibold">You're enrolled in this activity</span>
                    </div>
                  )}

                  {/* Past event indicator */}
                  {selectedActivity.isPast && (
                    <div className="flex items-center space-x-3 text-inactive p-4 bg-gradient-to-r from-secondary/20 to-secondary/10 rounded-2xl border border-secondary/50">
                      <AlertCircle size={20} />
                      <span className="text-sm font-medium">This activity has already ended</span>
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons */}
                {!selectedActivity.isPast && (
                  <div className="flex space-x-4">
                    {isEnrolled(selectedActivity.id) ? (
                      <button
                        onClick={async () => {
                          // На мобильной версии отменяем запись напрямую без дополнительного модального окна
                          try {
                            setIsModalLoading(true);
                            
                            const activity = weekActivities.find(a => a.id === selectedActivity.id);
                            if (!activity || !activity.trainingId) {
                              console.error('Training not found or missing trainingId');
                              return;
                            }

                            // Make API call to cancel check-in
                            await studentAPI.cancelCheckIn(activity.trainingId);
                            
                            setWeekActivities(prev => prev.map(activity =>
                              activity.id === selectedActivity.id
                                ? { 
                                    ...activity, 
                                    status: 'free' as const,
                                    currentParticipants: Math.max(activity.currentParticipants - 1, 0)
                                  }
                                : activity
                            ));
                            closeModal();
                          } catch (error) {
                            console.error('Error canceling enrollment:', error);
                          } finally {
                            setIsModalLoading(false);
                          }
                        }}
                        className="flex-1 innohassle-button-error py-4 text-base font-semibold rounded-2xl transition-all duration-200 hover:scale-105"
                        disabled={isLoading || isModalLoading}
                      >
                        {isLoading || isModalLoading ? 'Canceling...' : 'Cancel Enrollment'}
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          // На мобильной версии записываемся напрямую без дополнительного модального окна
                          if (canEnrollInMoreSessions() && selectedActivity.currentParticipants < selectedActivity.maxParticipants && selectedActivity.isRegistrationOpen) {
                            try {
                              setIsModalLoading(true);
                              await handleBookActivity(selectedActivity.id);
                              closeModal();
                            } catch (error) {
                              console.error('Error enrolling:', error);
                            } finally {
                              setIsModalLoading(false);
                            }
                          }
                        }}
                        className={`flex-1 py-4 text-base font-semibold rounded-2xl transition-all duration-200 hover:scale-105 ${
                          !canEnrollInMoreSessions() || selectedActivity.currentParticipants >= selectedActivity.maxParticipants || !selectedActivity.isRegistrationOpen
                            ? 'bg-secondary text-inactive cursor-not-allowed'
                            : 'innohassle-button-primary'
                        }`}
                        disabled={!canEnrollInMoreSessions() || selectedActivity.currentParticipants >= selectedActivity.maxParticipants || !selectedActivity.isRegistrationOpen || isLoading || isModalLoading}
                      >
                        {isLoading || isModalLoading
                          ? 'Enrolling...'
                          : selectedActivity.currentParticipants >= selectedActivity.maxParticipants
                          ? 'Session Full'
                          : !selectedActivity.isRegistrationOpen
                          ? 'Registration Closed'
                          : !canEnrollInMoreSessions()
                          ? 'Max enrollments reached'
                          : 'Enroll Now'
                        }
                      </button>
                    )}
                    <button
                      onClick={closeModal}
                      className="innohassle-button-secondary px-8 py-4 text-base font-semibold rounded-2xl transition-all duration-200 hover:scale-105"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;