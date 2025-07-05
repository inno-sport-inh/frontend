import React from 'react';
import { MapPin, Clock, Send, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const ClubsPage: React.FC = () => {
  const clubs = [
    {
      id: 1,
      name: 'Table Tennis Club',
      slug: 'table-tennis',
      emoji: '🏓',
      description: 'Master the art of table tennis with our passionate community of players. From beginners to advanced competitors, everyone is welcome!',
      memberCount: 45,
      location: 'Sports Complex - Hall A',
      schedule: 'Mon, Wed, Fri',
      telegram: '@tabletennis_inno',
      leader: 'Anna Mingaleva',
      achievements: ['Inter-University Championship 2023 - 2nd Place', 'Regional Tournament 2023 - 3rd Place'],
      gradient: 'from-red-500 to-pink-600'
    },
    {
      id: 2,
      name: 'Basketball Club',
      slug: 'basketball',
      emoji: '🏀',
      description: 'Join our dynamic basketball team and experience the thrill of teamwork, strategy, and athletic excellence on the court.',
      memberCount: 32,
      location: 'Sports Complex - Main Court',
      schedule: 'Tue, Thu, Sat',
      telegram: '@basketball_inno',
      leader: 'Michael Johnson',
      achievements: ['University League Champions 2023', 'Regional Championship Participants 2023'],
      gradient: 'from-orange-500 to-red-600'
    },
    {
      id: 3,
      name: 'Swimming Club',
      slug: 'swimming',
      emoji: '🏊‍♂️',
      description: 'Dive into our swimming community and improve your technique while building endurance and strength in the water.',
      memberCount: 28,
      location: 'Aquatic Center - Pool',
      schedule: 'Mon, Wed, Fri',
      telegram: '@swimming_inno',
      leader: 'Elena Volkova',
      achievements: ['Regional Swimming Championship 2023 - Multiple medals', 'University Aquatic Meet 2023 - 1st Place'],
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 4,
      name: 'Volleyball Club',
      slug: 'volleyball',
      emoji: '🏐',
      description: 'Spike your way to success with our volleyball team. Build teamwork skills while having fun and staying fit.',
      memberCount: 24,
      location: 'Sports Complex - Hall B',
      schedule: 'Tue, Thu, Sun',
      telegram: '@volleyball_inno',
      leader: 'Sofia Martinez',
      achievements: ['Regional Volleyball League 2023 - 3rd Place'],
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 5,
      name: 'Tennis Club',
      slug: 'tennis',
      emoji: '🎾',
      description: 'Perfect your serve and master the court with our tennis club. Individual and doubles play available for all skill levels.',
      memberCount: 20,
      location: 'Tennis Courts - Outdoor',
      schedule: 'Wed, Fri, Sat',
      telegram: '@tennis_inno',
      leader: 'David Kim',
      achievements: ['University Tennis Tournament 2023 - Finalists'],
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 6,
      name: 'Football Club',
      slug: 'football',
      emoji: '⚽',
      description: 'Score goals and build friendships with our football club. The beautiful game awaits players of all abilities.',
      memberCount: 35,
      location: 'Outdoor Football Field',
      schedule: 'Tue, Thu, Sat',
      telegram: '@football_inno',
      leader: 'Carlos Rodriguez',
      achievements: ['Inter-University Football Cup 2023 - Semi-finalists'],
      gradient: 'from-green-600 to-blue-600'
    }
  ];

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
        {clubs.map((club) => (
          <Link 
            key={club.id} 
            to={`/club/${club.slug}`}
            className="innohassle-card overflow-hidden group hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer"
          >
            {/* Club Header with Gradient */}
            <div className={`h-32 bg-gradient-to-br ${club.gradient} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">{club.emoji}</span>
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

              {/* Club Details */}
              <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <MapPin size={16} className="text-brand-violet" />
                  <span className="text-contrast">{club.location}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <Clock size={16} className="text-brand-violet" />
                  <span className="text-contrast">{club.schedule}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <Send size={16} className="text-brand-violet" />
                  <span className="text-brand-violet">{club.telegram}</span>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <Mail size={16} className="text-brand-violet" />
                  <span className="text-contrast">Leader: {club.leader}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    window.open(`https://t.me/${club.telegram.replace('@', '')}`, '_blank');
                  }}
                  className="flex-1 innohassle-button-primary py-2 text-xs sm:text-sm flex items-center justify-center space-x-2 hover:scale-105 transition-transform"
                >
                  <Send size={16} />
                  <span>Join Club</span>
                </button>
                <div className="innohassle-button-secondary px-4 py-2 text-xs sm:text-sm text-center opacity-80">
                  Learn More
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to Action */}
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
    </div>
  );
};

export default ClubsPage;