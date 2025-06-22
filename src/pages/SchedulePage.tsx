import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Clock, Users, UserCheck, AlertCircle } from "lucide-react";
import { useAppStore } from "../store/useAppStore";
import { useTheme } from "../hooks/useTheme";
import CheckoutModal from "../components/CheckoutModal";
import SportInfoModal from "../components/SportInfoModal";

// Utility to compute the Monday of the given week (ISO week start)
const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

// Utility to compute Sunday of the given week
const getWeekEnd = (date: Date): Date => {
  const weekStart = getWeekStart(date);
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  return weekEnd;
};

// Format a Date as "Mon 1"
const formatDate = (date: Date): string => {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// Format a week range like "Jan 1 - Jan 7"
const formatWeekRange = (weekStart: Date): string => {
  const weekEnd = getWeekEnd(weekStart);
  return `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
};

interface Activity {
  id: string;
  activity: string;
  time: string;
  dayOfWeek: string;
  date: Date;
  status: "free" | "booked" | "past";
  maxParticipants: number;
  currentParticipants: number;
  isPast: boolean;
  isRegistrationOpen: boolean;
}

// Static weekly schedule template
const WEEKLY_SCHEDULE = [
  {
    day: "Monday",
    activities: [
      { activity: "Basketball", time: "09:00 - 10:30", maxParticipants: 12 },
      { activity: "Swimming", time: "14:00 - 15:30", maxParticipants: 15 },
      { activity: "Gym Training", time: "18:00 - 19:30", maxParticipants: 10 },
    ],
  },
  {
    day: "Tuesday",
    activities: [
      { activity: "Table Tennis", time: "11:00 - 12:30", maxParticipants: 8 },
      { activity: "Volleyball", time: "16:00 - 17:30", maxParticipants: 14 },
      { activity: "Yoga", time: "19:00 - 20:30", maxParticipants: 20 },
    ],
  },
  {
    day: "Wednesday",
    activities: [
      { activity: "Tennis", time: "09:00 - 10:30", maxParticipants: 6 },
      { activity: "Basketball", time: "14:00 - 15:30", maxParticipants: 12 },
      { activity: "Swimming", time: "18:00 - 19:30", maxParticipants: 15 },
    ],
  },
  {
    day: "Thursday",
    activities: [
      { activity: "Football", time: "11:00 - 12:30", maxParticipants: 16 },
      { activity: "Gym Training", time: "16:00 - 17:30", maxParticipants: 10 },
      { activity: "Table Tennis", time: "19:00 - 20:30", maxParticipants: 8 },
    ],
  },
  {
    day: "Friday",
    activities: [
      { activity: "Volleyball", time: "09:00 - 10:30", maxParticipants: 14 },
      { activity: "Yoga", time: "14:00 - 15:30", maxParticipants: 20 },
      { activity: "Basketball", time: "18:00 - 19:30", maxParticipants: 12 },
    ],
  },
  {
    day: "Saturday",
    activities: [
      { activity: "Tennis", time: "11:00 - 12:30", maxParticipants: 6 },
      { activity: "Football", time: "16:00 - 17:30", maxParticipants: 16 },
    ],
  },
  {
    day: "Sunday",
    activities: [
      { activity: "Swimming", time: "09:00 - 10:30", maxParticipants: 15 },
      { activity: "Yoga", time: "19:00 - 20:30", maxParticipants: 20 },
    ],
  },
];

// Generate activities for a specific week, determining status & registration
const generateWeekActivities = (weekStart: Date): Activity[] => {
  const activities: Activity[] = [];
  const now = new Date();

  WEEKLY_SCHEDULE.forEach((daySchedule, dayIndex) => {
    const currentDate = new Date(weekStart);
    currentDate.setDate(weekStart.getDate() + dayIndex);

    daySchedule.activities.forEach((activityTemplate, activityIndex) => {
      // Parse activity start time
      const [startTimeStr] = activityTemplate.time.split(" - ");
      const [startHour, startMinute] = startTimeStr.split(":").map(Number);

      const activityStartTime = new Date(currentDate);
      activityStartTime.setHours(startHour, startMinute, 0, 0);

      // Parse activity end time
      const [, endTimeStr] = activityTemplate.time.split(" - ");
      const [endHour, endMinute] = endTimeStr.split(":").map(Number);

      const activityEndTime = new Date(currentDate);
      activityEndTime.setHours(endHour, endMinute, 0, 0);

      // Check if activity has passed
      const isPastActivity = activityEndTime < now;

      // Check if registration is open (registration opens exactly 1 week before activity starts)
      const registrationOpenTime = new Date(activityStartTime);
      registrationOpenTime.setDate(registrationOpenTime.getDate() - 7);
      const isRegistrationOpen = now >= registrationOpenTime;

      activities.push({
        id: `${currentDate.getTime()}-${activityIndex}`,
        activity: activityTemplate.activity,
        time: activityTemplate.time,
        dayOfWeek: daySchedule.day,
        date: new Date(currentDate),
        status: isPastActivity ? "past" : "free",
        maxParticipants: activityTemplate.maxParticipants,
        currentParticipants: Math.floor(Math.random() * 4) + 2, // Random current participants for demo
        isPast: isPastActivity,
        isRegistrationOpen: isRegistrationOpen,
      });
    });
  });

  return activities;
};

// Main SchedulePage component
const SchedulePage: React.FC = () => {
  const { isLoading } = useAppStore();
  const { isLight } = useTheme();
  // State for selected sport details
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showSportInfoModal, setShowSportInfoModal] = useState(false);
  const [selectedSport, setSelectedSport] = useState<string>("");

  // Week navigation state
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getWeekStart(new Date()));
  const [weekActivities, setWeekActivities] = useState(() => generateWeekActivities(getWeekStart(new Date())));
  const [bookedActivities, setBookedActivities] = useState<Set<string>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Progress tracking (mocked values)
  const completedHours = 12;
  const totalHours = 30;
  const progressPercentage = (completedHours / totalHours) * 100;
  const studentPercentile = Math.min(Math.floor(progressPercentage * 0.85 + Math.random() * 15), 95); // Calculate percentile based on progress

  // Days of the week labels
  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // Regenerate activities when week changes
  useEffect(() => {
    const newActivities = generateWeekActivities(currentWeekStart);
    setWeekActivities(newActivities);
  }, [currentWeekStart]);

  // Update past/booked status every minute
  useEffect(() => {
    const updateActivityStatus = () => {
      setWeekActivities((prev) =>
        prev.map((activity) => {
          // Parse end time to check if activity has passed
          const [, endTimeStr] = activity.time.split(" - ");
          const [endHour, endMinute] = endTimeStr.split(":").map(Number);

          const activityEndTime = new Date(activity.date);
          activityEndTime.setHours(endHour, endMinute, 0, 0);

          const now = new Date();
          const isPastActivity = activityEndTime < now;

          return {
            ...activity,
            isPast: isPastActivity,
            status: isPastActivity ? "past" : bookedActivities.has(activity.id) ? "booked" : "free",
          };
        })
      );
    };

    // Update immediately
    updateActivityStatus();

    // Set up interval to update every minute
    const interval = setInterval(updateActivityStatus, 60000);

    return () => clearInterval(interval);
  }, [bookedActivities]);

  // Navigate to previous or next week
  const handlePreviousWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() - 7);
    setCurrentWeekStart(newWeekStart);
  };

  const handleNextWeek = () => {
    const newWeekStart = new Date(currentWeekStart);
    newWeekStart.setDate(currentWeekStart.getDate() + 7);
    setCurrentWeekStart(newWeekStart);
  };

  // Book an activity
  const handleBookActivity = async (activityId: string) => {
    setBookedActivities((prev) => new Set([...prev, activityId]));
    setWeekActivities((prev) =>
      prev.map((activity) =>
        activity.id === activityId
          ? {
              ...activity,
              status: "booked" as const,
              currentParticipants: activity.currentParticipants + 1,
            }
          : activity
      )
    );
  };

  const confirmCancelBooking = async () => {
    if (selectedActivity) {
      setBookedActivities((prev) => {
        const newSet = new Set(prev);
        newSet.delete(selectedActivity.id);
        return newSet;
      });

      setWeekActivities((prev) =>
        prev.map((activity) =>
          activity.id === selectedActivity.id
            ? {
                ...activity,
                status: "free" as const,
                currentParticipants: Math.max(activity.currentParticipants - 1, 0),
              }
            : activity
        )
      );
      setShowCancelModal(false);
      setSelectedActivity(null);
    }
  };

  const handleSportClick = (sportName: string) => {
    setSelectedSport(sportName);
    setShowSportInfoModal(true);
  };

  const getActivitiesForDay = (day: string) => {
    return weekActivities.filter((activity) => activity.dayOfWeek === day);
  };

  // Helpers to derive UI state
  const isActivityFull = (activity: Activity) => {
    return activity.currentParticipants >= activity.maxParticipants;
  };

  const getActivityStatus = (activity: Activity) => {
    if (activity.isPast) return "past";
    if (bookedActivities.has(activity.id)) return "booked";
    return "free";
  };

  const getParticipantsBadgeStyle = (activity: Activity) => {
    const availableSpots = activity.maxParticipants - activity.currentParticipants;
    if (availableSpots === 0) return "innohassle-badge-error";
    if (availableSpots <= 3) return "innohassle-badge-warning";
    return "innohassle-badge-success";
  };

  const getParticipantsText = (activity: Activity) => {
    const availableSpots = activity.maxParticipants - activity.currentParticipants;
    if (availableSpots === 0) {
      return "Full";
    } else if (availableSpots === 1) {
      return "1 spot left";
    } else {
      return `${availableSpots} spots left`;
    }
  };

  // Render day header with semantic semantics
  const getDayHeader = (dayName: string, index: number) => {
    const dayDate = new Date(currentWeekStart);
    dayDate.setDate(currentWeekStart.getDate() + index);
    const isToday = dayDate.toDateString() === new Date().toDateString();
    const isPastDay = dayDate < new Date(new Date().setHours(0, 0, 0, 0));

    return (
      <div className="flex items-center justify-between">
        <div>
          <h3 className={`text-xl font-semibold ${isToday ? "text-brand-violet" : isPastDay ? "text-inactive opacity-50" : "text-contrast"}`}>{dayName}</h3>
          <p className={`text-sm ${isPastDay ? "text-inactive opacity-40" : "text-inactive"}`}>{formatDate(dayDate)}</p>
        </div>
        {isToday && <span className="innohassle-badge-primary text-xs px-2 py-1">Today</span>}
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
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8" style={{ backgroundColor: "rgb(var(--color-pagebg))" }}>
      {/* Progress Header */}
      <div className="innohassle-card p-4 sm:p-6">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-contrast mb-4">Your Sport Progress</h2>
          <p className="text-sm sm:text-base text-inactive mb-6">
            You've completed {completedHours} out of {totalHours} required hours this semester
          </p>

          {/* Progress Bar */}
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-between text-xs sm:text-sm text-inactive mb-2">
              <span>{completedHours} hours</span>
              <span>{totalHours - completedHours} hours left</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${Math.min(progressPercentage, 100)}%`,
                  background: "linear-gradient(90deg, rgb(var(--color-brand-gradient-start)) 0%, rgb(var(--color-brand-violet)) 100%)",
                }}
              />
            </div>
            <div className="mt-2 text-xs text-inactive">{progressPercentage.toFixed(1)}% completed</div>
            <div className="mt-1 text-xs text-brand-violet font-medium">🎯 You are better than {studentPercentile}% of students</div>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-contrast">Weekly Schedule</h1>
        <p className="text-inactive mt-2 text-sm sm:text-base">Book your training sessions for the week</p>
      </div>

      {/* Week Navigation */}
      <div className="flex items-center justify-between gap-2">
        <button onClick={handlePreviousWeek} className="innohassle-button-secondary px-3 sm:px-4 py-2 flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <ChevronLeft size={16} />
          <span className="hidden xs:inline sm:hidden">Prev</span>
          <span className="hidden sm:inline">Previous week</span>
        </button>

        <div className="text-center flex-1 min-w-0">
          <h3 className="text-sm sm:text-lg font-semibold text-contrast truncate">{formatWeekRange(currentWeekStart)}</h3>
          <p className="text-xs text-inactive mt-1">{currentWeekStart.getFullYear()}</p>
        </div>

        <button onClick={handleNextWeek} className="innohassle-button-secondary px-3 sm:px-4 py-2 flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
          <span className="hidden xs:inline sm:hidden">Next</span>
          <span className="hidden sm:inline">Next week</span>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Weekly Schedule Grid */}
      <div className="space-y-6">
        {daysOfWeek.map((day, index) => {
          const dayActivities = getActivitiesForDay(day);

          return (
            <div key={day} className="innohassle-card overflow-hidden border-2 border-brand-violet/30 hover:border-brand-violet/50 transition-all duration-200">
              {/* Day Header */}
              <div className="bg-primary border-b border-secondary px-6 py-4">{getDayHeader(day, index)}</div>

              {/* Activities */}
              <div className="p-6 space-y-4">
                {dayActivities.length === 0 ? (
                  <div className="text-center py-8 text-inactive">
                    <Clock size={32} className="mx-auto mb-2 opacity-50" />
                    <p>No activities scheduled for this day</p>
                  </div>
                ) : (
                  dayActivities.map((activity) => {
                    const isFull = isActivityFull(activity);
                    const activityStatus = getActivityStatus(activity);
                    const canBook = activityStatus === "free" && !isFull && !activity.isPast && activity.isRegistrationOpen;

                    return (
                      <div key={activity.id} className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${activityStatus === "booked" ? "border-brand-violet bg-brand-violet/10 shadow-lg shadow-brand-violet/20" : activity.isPast ? "activity-past" : !activity.isRegistrationOpen ? "bg-secondary/50 border-secondary/50" : isFull ? "bg-error-500/10 border-error-500/30" : "bg-floating border-secondary hover:border-brand-violet/60 hover:bg-brand-violet/5 hover:shadow-md"}`} onClick={() => openActivityModal(activity)}>
                        {/* Mobile Layout - Only time and name */}
                        <div className="block sm:hidden">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`flex items-center space-x-2 ${activity.isPast ? "text-inactive" : "text-contrast"}`}>
                                <Clock size={16} />
                                <span className="font-medium text-sm">{activity.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users size={16} className="text-inactive" />
                                <span className="text-contrast font-medium text-sm">{activity.activity}</span>
                              </div>
                            </div>
                            {activityStatus === "booked" && <div className="innohassle-badge innohassle-badge-primary text-xs">✓</div>}
                          </div>
                        </div>

                        {/* Desktop Layout - Full details */}
                        <div className="hidden sm:block">
                          <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-6">
                              <div className={`flex items-center space-x-2 ${activity.isPast ? "text-inactive" : "text-contrast"}`}>
                                <Clock size={18} />
                                <span className="font-medium text-sm sm:text-base">{activity.time}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users size={18} className="text-inactive" />
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSportClick(activity.activity);
                                  }}
                                  className="text-contrast font-medium hover:text-brand-violet transition-colors cursor-pointer underline-offset-2 hover:underline text-sm sm:text-base"
                                >
                                  {activity.activity}
                                </button>
                              </div>
                              {activityStatus === "booked" && (
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
                              <span className={`text-xs font-medium ${activity.isPast ? "text-inactive" : "text-contrast"}`}>
                                {activity.currentParticipants}/{activity.maxParticipants} enrolled
                              </span>

                              {/* Availability Badge */}
                              <span className={`${getParticipantsBadgeStyle(activity)} text-xs`}>{getParticipantsText(activity)}</span>

                              {/* Action Button */}
                              {!activity.isPast && (
                                <div className="flex justify-end sm:justify-start">
                                  {activityStatus === "free" ? (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        canBook && handleBookActivity(activity.id);
                                      }}
                                      className="innohassle-button innohassle-button-primary px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium transition-colors h-9"
                                      style={{ borderRadius: "0.75rem" }}
                                      disabled={!canBook || isLoading}
                                    >
                                      {isFull ? "Full" : !activity.isRegistrationOpen ? "Registration closed" : "Enroll"}
                                    </button>
                                  ) : (
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        // Direct cancellation without modal
                                        setBookedActivities((prev) => {
                                          const newSet = new Set(prev);
                                          newSet.delete(activity.id);
                                          return newSet;
                                        });

                                        setWeekActivities((prev) =>
                                          prev.map((act) =>
                                            act.id === activity.id
                                              ? {
                                                  ...act,
                                                  status: "free" as const,
                                                  currentParticipants: Math.max(act.currentParticipants - 1, 0),
                                                }
                                              : act
                                          )
                                        );
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
      {/* <CheckoutModal
        isOpen={showCancelModal}
        onClose={() => {
          setShowCancelModal(false);
          setSelectedActivity(null);
        }}
        onConfirm={confirmCancelBooking}
        activityName={selectedActivity?.activity || ''}
        time={selectedActivity?.time || ''}
        isLoading={isLoading}
      /> */}

      {/* Sport info modal */}
      <SportInfoModal
        isOpen={showSportInfoModal}
        onClose={() => {
          setShowSportInfoModal(false);
          setSelectedSport("");
        }}
        sportName={selectedSport}
      />

      {/* Activity Details Modal */}
      {isModalOpen && selectedActivity && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          {/* Desktop background overlay */}
          <div className="hidden sm:block fixed inset-0 bg-black bg-opacity-50" onClick={closeModal} />

          {/* Mobile background (no overlay) */}
          <div className="block sm:hidden fixed inset-0 bg-pagebg" />

          <div className="bg-pagebg innohassle-card max-w-md w-full max-h-[90vh] overflow-y-auto relative z-10">
            <div className="p-6">
              {/* Modal Header */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-contrast mb-2">{selectedActivity.activity}</h3>
                  <div className="flex items-center space-x-2 text-sm text-inactive">
                    <Clock size={16} />
                    <span>{selectedActivity.time}</span>
                  </div>
                </div>
                <button onClick={closeModal} className="text-inactive hover:text-contrast transition-colors text-2xl font-light">
                  ×
                </button>
              </div>

              {/* Activity Details */}
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <Users className="text-brand-violet" size={20} />
                  <div>
                    <p className="text-sm text-inactive">Participants</p>
                    <p className="font-medium text-contrast">
                      {selectedActivity.currentParticipants}/{selectedActivity.maxParticipants} enrolled
                    </p>
                  </div>
                </div>

                {/* Status Information */}
                <div className="bg-primary rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className={`innohassle-badge ${bookedActivities.has(selectedActivity.id) ? "innohassle-badge-primary" : selectedActivity.isPast ? "bg-inactive/20 text-inactive border-inactive/30" : selectedActivity.currentParticipants >= selectedActivity.maxParticipants ? "innohassle-badge-error" : "innohassle-badge-success"}`}>{bookedActivities.has(selectedActivity.id) ? "You are enrolled" : selectedActivity.isPast ? "Past event" : selectedActivity.currentParticipants >= selectedActivity.maxParticipants ? "Full" : "Available"}</span>
                    <span className={`text-sm ${selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.8 ? "text-error-500" : selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.6 ? "text-warning-500" : "text-success-500"}`}>{selectedActivity.currentParticipants >= selectedActivity.maxParticipants ? "Fully booked" : selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.8 ? "Almost full" : selectedActivity.currentParticipants >= selectedActivity.maxParticipants * 0.6 ? "Filling up" : "Spots available"}</span>
                  </div>
                </div>

                {/* Enrolled indicator */}
                {bookedActivities.has(selectedActivity.id) && (
                  <div className="flex items-center space-x-2 text-brand-violet">
                    <UserCheck size={16} />
                    <span className="text-sm font-medium">You're enrolled in this activity</span>
                  </div>
                )}

                {/* Past event indicator */}
                {selectedActivity.isPast && (
                  <div className="flex items-center space-x-2 text-inactive">
                    <AlertCircle size={16} />
                    <span className="text-sm">This activity has already ended</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {!selectedActivity.isPast && (
                <div className="flex space-x-3">
                  {bookedActivities.has(selectedActivity.id) ? (
                    <button
                      onClick={() => {
                        // Direct cancellation without modal
                        setBookedActivities((prev) => {
                          const newSet = new Set(prev);
                          newSet.delete(selectedActivity.id);
                          return newSet;
                        });

                        setWeekActivities((prev) =>
                          prev.map((act) =>
                            act.id === selectedActivity.id
                              ? {
                                  ...act,
                                  status: "free" as const,
                                  currentParticipants: Math.max(act.currentParticipants - 1, 0),
                                }
                              : act
                          )
                        );

                        closeModal();
                      }}
                      className="flex-1 innohassle-button-error py-3"
                      disabled={isLoading}
                    >
                      Cancel Booking
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        if (bookedActivities.size < 2 && selectedActivity.currentParticipants < selectedActivity.maxParticipants && selectedActivity.isRegistrationOpen) {
                          handleBookActivity(selectedActivity.id);
                          closeModal();
                        }
                      }}
                      className={`flex-1 py-3 transition-colors ${bookedActivities.size >= 2 || selectedActivity.currentParticipants >= selectedActivity.maxParticipants || !selectedActivity.isRegistrationOpen ? "bg-secondary text-inactive cursor-not-allowed" : isLight ? "innohassle-button-outline" : "innohassle-button-primary"}`}
                      disabled={bookedActivities.size >= 2 || selectedActivity.currentParticipants >= selectedActivity.maxParticipants || !selectedActivity.isRegistrationOpen || isLoading}
                    >
                      {selectedActivity.currentParticipants >= selectedActivity.maxParticipants ? "Activity Full" : !selectedActivity.isRegistrationOpen ? "Registration Closed" : bookedActivities.size >= 2 ? "Max bookings reached" : "Book Activity"}
                    </button>
                  )}
                  <button onClick={closeModal} className="innohassle-button-secondary px-6 py-3">
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;
