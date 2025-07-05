import React from 'react';
import { X, Clock, Users, MapPin, Trophy, Target, UserCheck, AlertCircle, Calendar } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTheme } from '../hooks/useTheme';

interface TrainingDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: {
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
  } | null;
  onEnroll?: (activityId: string) => void;
  onCancel?: () => void;
}

const TrainingDetailsModal: React.FC<TrainingDetailsModalProps> = ({ 
  isOpen, 
  onClose, 
  activity,
  onEnroll,
  onCancel
}) => {
  const { isLoading, isEnrolled, canEnrollInMoreSessions } = useAppStore();
  const { isLight } = useTheme();

  if (!isOpen || !activity) return null;

  const getSportInfo = (sport: string) => {
    const sportData: Record<string, any> = {
      'Table Tennis': {
        description: 'Table tennis is a fast-paced sport played with paddles and a lightweight ball on a table divided by a net.',
        benefits: ['Improves hand-eye coordination', 'Enhances reflexes', 'Great cardiovascular workout', 'Develops mental focus'],
        equipment: ['Paddle', 'Table tennis ball', 'Comfortable sportswear', 'Non-marking shoes'],
        location: 'Sports Complex - Hall A',
        difficulty: 'Beginner to Advanced',
        clubInfo: {
          name: 'Table Tennis Club',
          founded: '2018',
          members: 45,
          contact: 'tabletennis@innopolis.university'
        },
        image: '🏓'
      },
      'Basketball': {
        description: 'Basketball is a team sport played on a court where players try to score by shooting a ball through a hoop.',
        benefits: ['Full-body workout', 'Improves teamwork', 'Builds endurance', 'Develops strategic thinking'],
        equipment: ['Basketball', 'Comfortable sportswear', 'Basketball shoes', 'Water bottle'],
        location: 'Sports Complex - Main Court',
        difficulty: 'Beginner to Advanced',
        clubInfo: {
          name: 'Basketball Club',
          founded: '2019',
          members: 32,
          contact: 'basketball@innopolis.university'
        },
        image: '🏀'
      },
      'Swimming': {
        description: 'Swimming is a low-impact, full-body exercise that provides excellent cardiovascular benefits.',
        benefits: ['Full-body workout', 'Low impact on joints', 'Improves lung capacity', 'Builds muscle strength'],
        equipment: ['Swimsuit', 'Goggles', 'Swim cap', 'Towel'],
        location: 'Aquatic Center - Indoor Pool',
        difficulty: 'Beginner to Advanced',
        clubInfo: {
          name: 'Swimming Club',
          founded: '2020',
          members: 28,
          contact: 'swimming@innopolis.university'
        },
        image: '🏊‍♂️'
      },
      'Volleyball': {
        description: 'Volleyball is a team sport where players use their hands to hit a ball over a net.',
        benefits: ['Improves jumping ability', 'Enhances teamwork', 'Builds upper body strength', 'Develops quick reflexes'],
        equipment: ['Volleyball', 'Knee pads', 'Comfortable sportswear', 'Court shoes'],
        location: 'Sports Complex - Hall B',
        difficulty: 'Beginner to Intermediate',
        clubInfo: {
          name: 'Volleyball Club',
          founded: '2018',
          members: 35,
          contact: 'volleyball@innopolis.university'
        },
        image: '🏐'
      },
      'Tennis': {
        description: 'Tennis is a racket sport played individually or in doubles on a rectangular court.',
        benefits: ['Improves agility', 'Develops hand-eye coordination', 'Great cardio workout', 'Builds mental toughness'],
        equipment: ['Tennis racket', 'Tennis balls', 'Tennis shoes', 'Comfortable sportswear'],
        location: 'Tennis Courts - Outdoor',
        difficulty: 'Beginner to Advanced',
        clubInfo: {
          name: 'Tennis Club',
          founded: '2017',
          members: 24,
          contact: 'tennis@innopolis.university'
        },
        image: '🎾'
      },
      'Football': {
        description: 'Football (soccer) is a team sport played with a spherical ball between two teams of 11 players.',
        benefits: ['Improves cardiovascular fitness', 'Builds teamwork', 'Develops leg strength', 'Enhances coordination'],
        equipment: ['Football boots', 'Shin guards', 'Comfortable sportswear', 'Water bottle'],
        location: 'Football Field - Outdoor',
        difficulty: 'Beginner to Advanced',
        clubInfo: {
          name: 'Football Club',
          founded: '2016',
          members: 42,
          contact: 'football@innopolis.university'
        },
        image: '⚽'
      },
      'Yoga': {
        description: 'Yoga is a practice that combines physical postures, breathing techniques, and meditation.',
        benefits: ['Improves flexibility', 'Reduces stress', 'Builds core strength', 'Enhances balance'],
        equipment: ['Yoga mat', 'Comfortable clothes', 'Water bottle', 'Towel'],
        location: 'Fitness Studio - Room 1',
        difficulty: 'Beginner to Intermediate',
        clubInfo: {
          name: 'Yoga Club',
          founded: '2019',
          members: 38,
          contact: 'yoga@innopolis.university'
        },
        image: '🧘‍♀️'
      },
      'Gym Training': {
        description: 'Gym training involves various exercises using equipment to build strength and endurance.',
        benefits: ['Builds muscle strength', 'Improves endurance', 'Boosts metabolism', 'Enhances overall fitness'],
        equipment: ['Workout clothes', 'Towel', 'Water bottle', 'Gym shoes'],
        location: 'Fitness Center - Main Gym',
        difficulty: 'Beginner to Advanced',
        clubInfo: {
          name: 'Fitness Club',
          founded: '2017',
          members: 52,
          contact: 'fitness@innopolis.university'
        },
        image: '💪'
      }
    };

    return sportData[sport] || {
      description: 'A great sport activity for fitness and fun.',
      benefits: ['Improves fitness', 'Builds teamwork', 'Enhances skills'],
      equipment: ['Basic sports equipment', 'Comfortable sportswear'],
      location: 'Sports Complex',
      difficulty: 'All levels',
      clubInfo: {
        name: `${sport} Club`,
        founded: '2018',
        members: 30,
        contact: 'sports@innopolis.university'
      },
      image: '🏃‍♂️'
    };
  };

  const sportInfo = getSportInfo(activity.activity);
  const isEnrolledInActivity = isEnrolled(activity.id);
  const canEnroll = canEnrollInMoreSessions() && activity.currentParticipants < activity.maxParticipants && activity.isRegistrationOpen;

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const isToday = date.toDateString() === today.toDateString();
    const isTomorrow = date.toDateString() === tomorrow.toDateString();
    
    if (isToday) return 'Today';
    if (isTomorrow) return 'Tomorrow';
    
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEnrollClick = () => {
    if (onEnroll && canEnroll) {
      onEnroll(activity.id);
      onClose();
    }
  };

  const handleCancelClick = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      {/* Desktop background overlay */}
      <div className="hidden sm:block fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Mobile background (no overlay) */}
      <div className="block sm:hidden fixed inset-0 bg-pagebg" />
      
      <div className="bg-pagebg innohassle-card max-w-2xl w-full max-h-[90vh] overflow-y-auto relative z-10">
        <div className="p-6">
          {/* Modal Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{sportInfo.image}</span>
              <div>
                <h3 className="text-xl font-bold text-contrast">{activity.activity}</h3>
                <p className="text-sm text-inactive">{sportInfo.clubInfo.name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-inactive hover:text-contrast transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Training Session Details */}
          <div className="bg-primary rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-contrast mb-3 flex items-center space-x-2">
              <Calendar size={16} />
              <span>Session Details</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Clock className="text-brand-violet" size={18} />
                <div>
                  <p className="text-sm text-inactive">Time</p>
                  <p className="font-medium text-contrast">{activity.time}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="text-brand-violet" size={18} />
                <div>
                  <p className="text-sm text-inactive">Date</p>
                  <p className="font-medium text-contrast">{formatDate(activity.date)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="text-brand-violet" size={18} />
                <div>
                  <p className="text-sm text-inactive">Participants</p>
                  <p className="font-medium text-contrast">
                    {activity.currentParticipants}/{activity.maxParticipants} enrolled
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="text-brand-violet" size={18} />
                <div>
                  <p className="text-sm text-inactive">Location</p>
                  <p className="font-medium text-contrast">{sportInfo.location}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Enrollment Status */}
          <div className="bg-primary rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className={`innohassle-badge ${
                isEnrolledInActivity
                  ? 'innohassle-badge-primary'
                  : activity.isPast
                  ? 'bg-inactive/20 text-inactive border-inactive/30'
                  : activity.currentParticipants >= activity.maxParticipants
                  ? 'innohassle-badge-error'
                  : 'innohassle-badge-success'
              }`}>
                {isEnrolledInActivity
                  ? 'You are enrolled'
                  : activity.isPast
                  ? 'Past event'
                  : activity.currentParticipants >= activity.maxParticipants
                  ? 'Full'
                  : 'Available'
                }
              </span>
              <span className={`text-sm ${
                activity.currentParticipants >= activity.maxParticipants * 0.8
                  ? 'text-error-500'
                  : activity.currentParticipants >= activity.maxParticipants * 0.6
                  ? 'text-warning-500'
                  : 'text-success-500'
              }`}>
                {activity.currentParticipants >= activity.maxParticipants
                  ? 'Fully enrolled'
                  : activity.currentParticipants >= activity.maxParticipants * 0.8
                  ? 'Almost full'
                  : activity.currentParticipants >= activity.maxParticipants * 0.6
                  ? 'Filling up'
                  : 'Spots available'
                }
              </span>
            </div>

            {/* Enrollment indicators */}
            <div className="mt-3 space-y-2">
              {isEnrolledInActivity && (
                <div className="flex items-center space-x-2 text-brand-violet">
                  <UserCheck size={16} />
                  <span className="text-sm font-medium">You're enrolled in this session</span>
                </div>
              )}
              {activity.isPast && (
                <div className="flex items-center space-x-2 text-inactive">
                  <AlertCircle size={16} />
                  <span className="text-sm">This session has already ended</span>
                </div>
              )}
              {!activity.isRegistrationOpen && !activity.isPast && (
                <div className="flex items-center space-x-2 text-warning-500">
                  <AlertCircle size={16} />
                  <span className="text-sm">Registration opens 1 week before the session</span>
                </div>
              )}
            </div>
          </div>

          {/* Sport Information */}
          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-contrast mb-3">About {activity.activity}</h4>
              <p className="text-inactive text-sm leading-relaxed">{sportInfo.description}</p>
            </div>

            <div>
              <h4 className="font-semibold text-contrast mb-3 flex items-center space-x-2">
                <Target size={16} />
                <span>Benefits</span>
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sportInfo.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <span className="text-brand-violet">•</span>
                    <span className="text-inactive">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-contrast mb-3">Equipment Needed</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sportInfo.equipment.map((item: string, index: number) => (
                  <li key={index} className="flex items-center space-x-2 text-sm">
                    <span className="text-brand-violet">•</span>
                    <span className="text-inactive">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-contrast mb-3 flex items-center space-x-2">
                <Trophy size={16} />
                <span>Club Information</span>
              </h4>
              <div className="bg-secondary/30 rounded-lg p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-inactive">Founded</p>
                    <p className="font-medium text-contrast">{sportInfo.clubInfo.founded}</p>
                  </div>
                  <div>
                    <p className="text-inactive">Members</p>
                    <p className="font-medium text-contrast">{sportInfo.clubInfo.members}</p>
                  </div>
                  <div>
                    <p className="text-inactive">Difficulty</p>
                    <p className="font-medium text-contrast">{sportInfo.difficulty}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-secondary">
                  <p className="text-inactive text-xs">Contact: {sportInfo.clubInfo.contact}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!activity.isPast && (
            <div className="flex space-x-3 mt-6 pt-6 border-t border-secondary">
              {isEnrolledInActivity ? (
                <button
                  onClick={handleCancelClick}
                  className="flex-1 innohassle-button-error py-3"
                  disabled={isLoading}
                >
                  {isLoading ? 'Processing...' : 'Cancel Enrollment'}
                </button>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  className={`flex-1 py-3 transition-colors ${
                    !canEnroll
                      ? 'bg-secondary text-inactive cursor-not-allowed'
                      : isLight ? 'innohassle-button-outline' : 'innohassle-button-primary'
                  }`}
                  disabled={!canEnroll || isLoading}
                >
                  {isLoading ? 'Processing...' : 
                   activity.currentParticipants >= activity.maxParticipants ? 'Session Full' :
                   !activity.isRegistrationOpen ? 'Registration Closed' :
                   !canEnrollInMoreSessions() ? 'Max Enrollments Reached' :
                   'Enroll in Session'}
                </button>
              )}
              <button
                onClick={onClose}
                className="innohassle-button-secondary px-6 py-3"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainingDetailsModal;
