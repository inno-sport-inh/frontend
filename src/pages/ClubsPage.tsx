import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, Target, Loader2, AlertCircle, Calendar } from 'lucide-react';
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

  // Function to calculate total free spots in club groups
  const getTotalFreeSpots = (groups: ClubGroup[]): number => {
    return groups.reduce((total, group) => {
      return total + (group.capacity - group.current_enrollment);
    }, 0);
  };

  // Get upcoming trainings for all groups in a club
  const getAllUpcomingTrainings = (groups: ClubGroup[]): Array<{
    id: number;
    start: string;
    end: string;
    training_class: string;
    available_spots: number;
  }> => {
    const allTrainings: any[] = [];
    
    groups.forEach(group => {
      if (group.trainings && Array.isArray(group.trainings)) {
        group.trainings.forEach(training => {
          const endDate = new Date(training.end);
          const now = new Date();
          
          // Only include future trainings
          if (endDate > now) {
            allTrainings.push({
              id: training.id,
              start: training.start,
              end: training.end,
              training_class: training.training_class || 'Training',
              available_spots: training.available_spots
            });
          }
        });
      }
    });
    
    return allTrainings
      .sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())
      .slice(0, 10); // Show up to 10 upcoming trainings
  };

  // Get emoji for club based on name
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
    return '🏃‍♂️';
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
    <div className="max-w-7xl mx-auto space-y-8 sm:space-y-12 mobile-content-bottom-padding">
      {/* Success/Error Messages */}
      {/* Removed successMessage and errorMessage state and their usage */}

      {/* Header */}
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-contrast mb-4">Sports Clubs</h1>
        <p className="text-lg sm:text-xl text-inactive max-w-2xl mx-auto leading-relaxed">
          Join our vibrant sports community and discover your passion. From competitive tournaments to casual fun, there's a place for everyone.
        </p>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 px-4">
        {clubs.map((club) => {
          const totalFreeSpots = getTotalFreeSpots(club.groups);
          
          return (
            <div
              key={club.id}
              className="innohassle-card overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Club Header */}
              <div className="bg-gradient-to-r from-brand-violet to-brand-violet/80 p-6 text-white">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{getClubEmoji(club.name)}</div>
                  <div>
                    <h3 className="text-xl font-bold">{club.name}</h3>
                    <p className="text-white/90 text-sm mt-1">{club.description}</p>
                  </div>
                </div>
              </div>
              
              {/* Club Stats */}
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-contrast">{club.total_groups}</div>
                    <div className="text-sm text-inactive">Groups</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-contrast">{totalFreeSpots}</div>
                    <div className="text-sm text-inactive">Free Spots</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-contrast">
                      {getAllUpcomingTrainings(club.groups).length}
                    </div>
                    <div className="text-sm text-inactive">Sessions</div>
                  </div>
                </div>
                
                {/* Groups Preview */}
                <div className="space-y-3 mb-4">
                  {club.groups.slice(0, 2).map((group, index) => {
                    // Removed unused freeSpots variable
                    return (
                      <div key={group.id} className="border border-secondary rounded-lg p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-contrast">
                            {group.name || `Group ${index + 1}`}
                          </h4>
                          {group.accredited && (
                            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              Accredited
                            </span>
                          )}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mb-2">
                          <div className="flex items-center space-x-1 text-sm">
                            <Users size={14} className="text-brand-violet" />
                            <span className="text-contrast">
                              {group.current_enrollment}/{group.capacity}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1 text-sm">
                            <Target size={14} className="text-brand-violet" />
                            <span className="text-contrast">
                              {group.capacity - group.current_enrollment} free
                            </span>
                          </div>
                        </div>
                        
                        {/* Capacity bar */}
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-brand-violet h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min((group.current_enrollment / group.capacity) * 100, 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                  
                  {club.groups.length > 2 && (
                    <div className="text-center">
                      <span className="text-sm text-inactive">
                        +{club.groups.length - 2} more groups
                      </span>
                    </div>
                  )}
                </div>
                
                {/* Upcoming Sessions Preview */}
                <div className="mb-4">
                  <h4 className="font-medium text-contrast mb-2 flex items-center space-x-2">
                    <Calendar size={16} className="text-brand-violet" />
                    <span>Upcoming Sessions</span>
                  </h4>
                  
                  {getAllUpcomingTrainings(club.groups).length === 0 ? (
                    <p className="text-sm text-inactive">No upcoming sessions scheduled</p>
                  ) : (
                    <div className="space-y-2">
                      {getAllUpcomingTrainings(club.groups).slice(0, 3).map((training, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <Clock size={12} className="text-brand-violet" />
                          <span className="text-contrast">
                            {new Date(training.start).toLocaleDateString('en-US', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </span>
                          <span className="text-inactive">
                            {new Date(training.start).toLocaleTimeString('en-US', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                          <span className="text-xs text-brand-violet">
                            {training.available_spots} spots left
                          </span>
                        </div>
                      ))}
                      
                      {getAllUpcomingTrainings(club.groups).length > 3 && (
                        <p className="text-xs text-inactive">
                          +{getAllUpcomingTrainings(club.groups).length - 3} more sessions...
                        </p>
                      )}
                    </div>
                  )}
                </div>
                
                <Link
                  to={`/club/${club.id}`}
                  className="innohassle-button-primary w-full py-3 flex items-center justify-center space-x-2"
                >
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          );
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
            Join our sports community and start your fitness journey today. 
            Choose from various clubs and find the perfect training schedule that fits your lifestyle.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              to="/schedule"
              className="innohassle-button-primary px-4 sm:px-6 py-3 text-sm sm:text-base"
            >
              View Full Schedule
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClubsPage;