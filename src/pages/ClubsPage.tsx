import React, { useState, useEffect } from 'react';
import { Clock, Users, Target, Loader2, AlertCircle, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { clubsAPI, Club, ClubGroup } from '../services/api';

const ClubsPage: React.FC = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        setLoading(true);
        setError(null);
        const clubsData = await clubsAPI.getClubs();
        setClubs(clubsData);
      } catch (err) {
        console.error('Error fetching clubs:', err);
        setError(err instanceof Error ? err.message : 'Failed to load clubs');
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  // Получаем эмодзи для клуба на основе названия
  const getClubEmoji = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('table tennis') || lowerName.includes('настольный теннис')) return '🏓';
    if (lowerName.includes('basketball') || lowerName.includes('баскетбол')) return '🏀';
    if (lowerName.includes('swimming') || lowerName.includes('плавание')) return '🏊‍♂️';
    if (lowerName.includes('volleyball') || lowerName.includes('волейбол')) return '🏐';
    if (lowerName.includes('tennis') || lowerName.includes('теннис')) return '🎾';
    if (lowerName.includes('football') || lowerName.includes('футбол')) return '⚽';
    if (lowerName.includes('boxing') || lowerName.includes('бокс')) return '🥊';
    if (lowerName.includes('gym') || lowerName.includes('тренажерн')) return '🏋️‍♂️';
    if (lowerName.includes('yoga') || lowerName.includes('йога')) return '🧘‍♀️';
    if (lowerName.includes('dance') || lowerName.includes('танц')) return '💃';
    return '🏃‍♂️'; // Дефолтная иконка
  };

  // Получаем градиент для клуба
  const getClubGradient = (index: number): string => {
    const gradients = [
      'from-red-500 to-pink-600',
      'from-orange-500 to-red-600',
      'from-blue-500 to-cyan-600',
      'from-yellow-500 to-orange-600',
      'from-green-500 to-emerald-600',
      'from-green-600 to-blue-600',
      'from-purple-500 to-indigo-600',
      'from-pink-500 to-purple-600',
      'from-indigo-500 to-blue-600',
      'from-teal-500 to-green-600'
    ];
    return gradients[index % gradients.length];
  };

  // Форматируем расписание группы для отображения
  const formatGroupSchedule = (group: ClubGroup): string => {
    if (!group.schedule || group.schedule.length === 0) return 'Schedule TBD';
    
    const scheduleByDay = group.schedule.reduce((acc, session) => {
      const day = session.weekday_name;
      if (!acc[day]) acc[day] = [];
      acc[day].push(`${session.start_time}-${session.end_time}`);
      return acc;
    }, {} as Record<string, string[]>);

    return Object.entries(scheduleByDay)
      .map(([day, times]) => `${day}: ${times.join(', ')}`)
      .join(' | ');
  };

  // Получаем основную группу клуба (с наибольшим количеством участников)
  const getMainGroup = (club: Club): ClubGroup | null => {
    if (!club.groups || club.groups.length === 0) return null;
    return club.groups.reduce((max, group) => 
      group.current_enrollment > max.current_enrollment ? group : max
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-contrast mb-4">Sports Clubs</h1>
          <p className="text-lg sm:text-xl text-inactive max-w-2xl mx-auto leading-relaxed">
            Join our vibrant sports community and discover your passion. From competitive tournaments to casual fun, there's a place for everyone.
          </p>
        </div>
        
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-3">
            <Loader2 className="animate-spin text-brand-violet" size={24} />
            <span className="text-contrast">Loading clubs...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
        <div className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-contrast mb-4">Sports Clubs</h1>
          <p className="text-lg sm:text-xl text-inactive max-w-2xl mx-auto leading-relaxed">
            Join our vibrant sports community and discover your passion. From competitive tournaments to casual fun, there's a place for everyone.
          </p>
        </div>
        
        <div className="innohassle-card p-6 sm:p-8 text-center mx-4">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <AlertCircle className="text-red-500" size={24} />
            <h2 className="text-xl font-semibold text-contrast">Unable to Load Clubs</h2>
          </div>
          <p className="text-inactive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="innohassle-button-primary px-6 py-2"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-contrast mb-4">Sports Clubs</h1>
        <p className="text-lg sm:text-xl text-inactive max-w-2xl mx-auto leading-relaxed">
          Join our vibrant sports community and discover your passion. From competitive tournaments to casual fun, there's a place for everyone.
        </p>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
        {clubs.map((club, index) => {
          const mainGroup = getMainGroup(club);
          const emoji = getClubEmoji(club.name);
          const gradient = getClubGradient(index);
          
          return (
            <Link 
              key={club.id} 
              to={`/club/${club.id}`}
              className="innohassle-card overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
            >
              {/* Club Header with Gradient */}
              <div className={`h-32 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-6xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {emoji}
                  </span>
                </div>
                {/* Statistics overlay */}
                <div className="absolute top-3 right-3">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg px-2 py-1">
                    <span className="text-white text-xs font-medium">
                      {club.total_groups} groups
                    </span>
                  </div>
                </div>
              </div>

              {/* Club Content */}
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold text-contrast mb-2 group-hover:text-brand-violet transition-colors">
                  {club.name}
                </h3>
                <p className="text-inactive mb-4 leading-relaxed line-clamp-3 text-sm sm:text-base">
                  {club.description}
                </p>

                {/* Club Statistics */}
                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  <div className="flex items-center space-x-2 text-xs sm:text-sm">
                    <Target size={16} className="text-brand-violet" />
                    <span className="text-contrast">{club.total_groups} training groups available</span>
                  </div>
                  <div className="flex items-center space-x-2 text-xs sm:text-sm">
                    <Users size={16} className="text-brand-violet" />
                    <span className="text-contrast">{club.total_free_places} free places</span>
                  </div>
                  {mainGroup && (
                    <>
                      <div className="flex items-center space-x-2 text-xs sm:text-sm">
                        <Clock size={16} className="text-brand-violet" />
                        <span className="text-contrast truncate">{formatGroupSchedule(mainGroup)}</span>
                      </div>
                      {mainGroup.trainers && mainGroup.trainers.length > 0 && (
                        <div className="flex items-center space-x-2 text-xs sm:text-sm">
                          <Trophy size={16} className="text-brand-violet" />
                          <span className="text-contrast">
                            Trainer: {mainGroup.trainers[0].name}
                          </span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Enrollment Status */}
                {mainGroup && (
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-inactive mb-1">
                      <span>Capacity</span>
                      <span>{mainGroup.current_enrollment}/{mainGroup.capacity}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-brand-violet h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((mainGroup.current_enrollment / mainGroup.capacity) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      // Переход к детальной странице клуба
                    }}
                    className="flex-1 innohassle-button-primary py-2 text-xs sm:text-sm flex items-center justify-center space-x-2 hover:scale-105 transition-transform"
                  >
                    <Users size={16} />
                    <span>View Groups</span>
                  </button>
                  <div className="innohassle-button-secondary px-4 py-2 text-xs sm:text-sm text-center opacity-80">
                    Learn More
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Empty State */}
      {clubs.length === 0 && !loading && !error && (
        <div className="innohassle-card p-6 sm:p-8 text-center mx-4">
          <h2 className="text-xl sm:text-2xl font-bold text-contrast mb-4">No Clubs Available</h2>
          <p className="text-sm sm:text-base text-inactive mb-6">
            There are currently no sports clubs available. Check back later for updates.
          </p>
        </div>
      )}

      {/* Call to Action */}
      {clubs.length > 0 && (
        <div className="innohassle-card p-6 sm:p-8 text-center mx-4">
          <h2 className="text-xl sm:text-2xl font-bold text-contrast mb-4">Ready to Get Started?</h2>
          <p className="text-sm sm:text-base text-inactive mb-6 max-w-2xl mx-auto">
            Don't see your favorite sport? We're always looking to expand our offerings. 
            Contact us to start a new club or suggest activities you'd like to see.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/schedule"
              className="innohassle-button-primary px-4 sm:px-6 py-3 text-sm sm:text-base"
            >
              View Training Schedule
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubsPage;