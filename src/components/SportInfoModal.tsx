import React from 'react';
import { X, Clock, Users, MapPin, Trophy, Target } from 'lucide-react';
import { useModalKeyboard } from '../hooks/useModalKeyboard';

interface SportInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  sportName: string;
}

const SportInfoModal: React.FC<SportInfoModalProps> = ({ isOpen, onClose, sportName }) => {
  // Добавляем поддержку закрытия по Escape
  useModalKeyboard(isOpen, onClose);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Закрываем модальное окно только если клик был по backdrop, а не по содержимому
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getSportInfo = (sport: string) => {
    const sportData: Record<string, any> = {
      'Table Tennis': {
        description: 'Table tennis is a fast-paced sport played with paddles and a lightweight ball on a table divided by a net.',
        benefits: ['Improves hand-eye coordination', 'Enhances reflexes', 'Great cardiovascular workout', 'Develops mental focus'],
        equipment: ['Paddle', 'Table tennis ball', 'Comfortable sportswear', 'Non-marking shoes'],
        location: 'Sports Complex - Hall A',
        difficulty: 'Beginner to Advanced',
        duration: '1.5 hours',
        maxParticipants: 16,
        image: '🏓'
      },
      'Basketball': {
        description: 'Basketball is a team sport played on a court where players try to score by shooting a ball through a hoop.',
        benefits: ['Full-body workout', 'Improves teamwork', 'Builds endurance', 'Develops strategic thinking'],
        equipment: ['Basketball', 'Comfortable sportswear', 'Basketball shoes', 'Water bottle'],
        location: 'Sports Complex - Main Court',
        difficulty: 'Beginner to Advanced',
        duration: '1.5 hours',
        maxParticipants: 20,
        image: '🏀'
      },
      'Swimming': {
        description: 'Swimming is a low-impact, full-body exercise that provides excellent cardiovascular benefits.',
        benefits: ['Full-body workout', 'Low impact on joints', 'Improves lung capacity', 'Builds muscle strength'],
        equipment: ['Swimsuit', 'Goggles', 'Swim cap', 'Towel'],
        location: 'Aquatic Center - Indoor Pool',
        difficulty: 'Beginner to Advanced',
        duration: '1.5 hours',
        maxParticipants: 12,
        image: '🏊‍♂️'
      },
      'Volleyball': {
        description: 'Volleyball is a team sport where players use their hands to hit a ball over a net.',
        benefits: ['Improves jumping ability', 'Enhances teamwork', 'Builds upper body strength', 'Develops quick reflexes'],
        equipment: ['Volleyball', 'Knee pads', 'Comfortable sportswear', 'Court shoes'],
        location: 'Sports Complex - Hall B',
        difficulty: 'Beginner to Intermediate',
        duration: '1.5 hours',
        maxParticipants: 18,
        image: '🏐'
      },
      'Tennis': {
        description: 'Tennis is a racket sport played individually or in pairs on a court with a net.',
        benefits: ['Improves agility', 'Enhances coordination', 'Great cardio workout', 'Builds mental toughness'],
        equipment: ['Tennis racket', 'Tennis balls', 'Tennis shoes', 'Comfortable sportswear'],
        location: 'Tennis Courts - Outdoor',
        difficulty: 'Beginner to Advanced',
        duration: '1.5 hours',
        maxParticipants: 16,
        image: '🎾'
      },
      'Football': {
        description: 'Football (soccer) is the world\'s most popular sport, played with a spherical ball between two teams.',
        benefits: ['Excellent cardio workout', 'Improves teamwork', 'Builds leg strength', 'Enhances coordination'],
        equipment: ['Football boots', 'Shin guards', 'Comfortable sportswear', 'Water bottle'],
        location: 'Outdoor Football Field',
        difficulty: 'Beginner to Advanced',
        duration: '1.5 hours',
        maxParticipants: 22,
        image: '⚽'
      },
      'Gym Training': {
        description: 'Gym training involves various exercises using equipment to build strength, endurance, and fitness.',
        benefits: ['Builds muscle strength', 'Improves bone density', 'Enhances metabolism', 'Increases flexibility'],
        equipment: ['Workout clothes', 'Training shoes', 'Water bottle', 'Towel'],
        location: 'Fitness Center - Main Gym',
        difficulty: 'Beginner to Advanced',
        duration: '1.5 hours',
        maxParticipants: 15,
        image: '🏋️‍♂️'
      },
      'Yoga': {
        description: 'Yoga is a practice that combines physical postures, breathing exercises, and meditation.',
        benefits: ['Improves flexibility', 'Reduces stress', 'Enhances balance', 'Promotes mindfulness'],
        equipment: ['Yoga mat', 'Comfortable clothing', 'Water bottle', 'Towel'],
        location: 'Wellness Center - Studio A',
        difficulty: 'Beginner to Intermediate',
        duration: '1.5 hours',
        maxParticipants: 20,
        image: '🧘‍♀️'
      }
    };

    return sportData[sport] || {
      description: 'A great sport activity for fitness and fun.',
      benefits: ['Improves fitness', 'Builds strength', 'Enhances coordination'],
      equipment: ['Comfortable sportswear', 'Appropriate footwear'],
      location: 'Sports Complex',
      difficulty: 'All levels',
      duration: '1.5 hours',
      maxParticipants: 16,
      image: '🏃‍♂️'
    };
  };

  const sportInfo = getSportInfo(sportName);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="innohassle-card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary">
          <div className="flex items-center space-x-3">
            <span className="text-4xl">{sportInfo.image}</span>
            <div>
              <h2 className="text-2xl font-bold text-contrast">{sportName}</h2>
              <p className="text-sm text-inactive">{sportInfo.difficulty} • {sportInfo.duration}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-inactive hover:text-contrast transition-colors p-2 rounded-lg hover:bg-secondary"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-contrast mb-2">About</h3>
            <p className="text-contrast leading-relaxed">{sportInfo.description}</p>
          </div>

          {/* Quick Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-2">
              <MapPin size={18} className="text-brand-violet" />
              <div>
                <p className="text-xs text-inactive">Location</p>
                <p className="text-sm font-medium text-contrast">{sportInfo.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock size={18} className="text-brand-violet" />
              <div>
                <p className="text-xs text-inactive">Duration</p>
                <p className="text-sm font-medium text-contrast">{sportInfo.duration}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Users size={18} className="text-brand-violet" />
              <div>
                <p className="text-xs text-inactive">Max Participants</p>
                <p className="text-sm font-medium text-contrast">{sportInfo.maxParticipants} people</p>
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Trophy size={18} className="text-brand-violet" />
              <h3 className="text-lg font-semibold text-contrast">Benefits</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sportInfo.benefits.map((benefit: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brand-violet rounded-full"></div>
                  <span className="text-sm text-contrast">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Equipment */}
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <Target size={18} className="text-brand-violet" />
              <h3 className="text-lg font-semibold text-contrast">What to Bring</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sportInfo.equipment.map((item: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-brand-violet rounded-full"></div>
                  <span className="text-sm text-contrast">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-secondary">
          <button
            onClick={onClose}
            className="innohassle-button-primary w-full py-3"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};

export default SportInfoModal;