import React from 'react';
import { Users, MapPin, Clock, Send, Mail, Star, Trophy } from 'lucide-react';
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

      {/* Featured Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 px-4">
        <div className="innohassle-card p-4 sm:p-6 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-violet/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Users className="text-brand-violet" size={20} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-contrast mb-1">200+</h3>
          <p className="text-xs sm:text-sm text-inactive">Active Members</p>
        </div>
        <div className="innohassle-card p-4 sm:p-6 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-violet/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Trophy className="text-brand-violet" size={20} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-contrast mb-1">15+</h3>
          <p className="text-xs sm:text-sm text-inactive">Championships</p>
        </div>
        <div className="innohassle-card p-4 sm:p-6 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-violet/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <MapPin className="text-brand-violet" size={20} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-contrast mb-1">8</h3>
          <p className="text-xs sm:text-sm text-inactive">Sport Facilities</p>
        </div>
        <div className="innohassle-card p-4 sm:p-6 text-center">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-violet/10 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Clock className="text-brand-violet" size={20} />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-contrast mb-1">40+</h3>
          <p className="text-xs sm:text-sm text-inactive">Hours/Week</p>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
        {clubs.map((club) => (
          <div key={club.id} className="innohassle-card overflow-hidden group hover:shadow-xl transition-all duration-300">
            {/* Club Header with Gradient */}
            <div className={`h-32 bg-gradient-to-br ${club.gradient} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl filter drop-shadow-lg">{club.emoji}</span>
              </div>
              <div className="absolute top-4 right-4">
                <div className="innohassle-badge-success text-xs">
                  {club.memberCount} members
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
                  <a 
                    href={`https://t.me/${club.telegram.replace('@', '')}`}
                    className="text-brand-violet hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {club.telegram}
                  </a>
                </div>
                <div className="flex items-center space-x-2 text-xs sm:text-sm">
                  <Mail size={16} className="text-brand-violet" />
                  <span className="text-contrast">Leader: {club.leader}</span>
                </div>
              </div>

              {/* Achievements */}
              <div className="mb-4 sm:mb-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Star size={14} className="text-brand-violet" />
                  <span className="text-xs sm:text-sm font-medium text-contrast">Recent Achievements</span>
                </div>
                <div className="space-y-1">
                  {club.achievements.slice(0, 2).map((achievement, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-1 h-1 bg-brand-violet rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                      <span className="text-xs text-inactive leading-relaxed">{achievement}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <a
                  href={`https://t.me/${club.telegram.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 innohassle-button-primary py-2 text-xs sm:text-sm flex items-center justify-center space-x-2"
                >
                  <Send size={16} />
                  <span>Join Club</span>
                </a>
                <Link
                  to={`/club/${club.slug}`}
                  className="innohassle-button-secondary px-4 py-2 text-xs sm:text-sm text-center"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
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
          <a
            href="mailto:sports@innopolis.university?subject=New Sport Club Proposal"
            className="innohassle-button-primary px-4 sm:px-6 py-3 flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <Mail size={18} />
            <span>Propose New Club</span>
          </a>
          <Link
            to="/schedule"
            className="innohassle-button-secondary px-4 sm:px-6 py-3 text-sm sm:text-base"
          >
            View Training Schedule
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClubsPage;