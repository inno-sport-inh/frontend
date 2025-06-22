import React from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Users, Calendar, MapPin, Send, Mail, User, Star, Clock } from 'lucide-react';

const ClubPage: React.FC = () => {
  const { clubName } = useParams<{ clubName: string }>();

  const getClubData = (name: string) => {
    const clubs: Record<string, any> = {
      'table-tennis': {
        name: 'Table Tennis Club',
        emoji: '🏓',
        description: 'Welcome to the Table Tennis Club at Innopolis University! We are a vibrant community of players ranging from beginners to advanced competitors. Our club focuses on improving technique, strategy, and having fun while playing this amazing sport.',
        longDescription: `Our Table Tennis Club has been serving the Innopolis University community since 2018. We provide a welcoming environment for students to learn, practice, and compete in table tennis.

Whether you're picking up a paddle for the first time or you're an experienced player looking to sharpen your skills, our club offers something for everyone. We organize regular training sessions, friendly matches, and participate in inter-university tournaments.

Join us and become part of a community that values sportsmanship, improvement, and friendship through the beautiful game of table tennis!`,
        image: '/api/placeholder/600/300',
        telegram: '@tabletennis_inno',
        leaders: [
          {
            name: 'Anna Mingaleva',
            email: 'a.mingaleva@innopolis.university',
            telegram: '@anna_mingaleva',
            role: 'President',
            bio: 'Computer Science student with 5+ years of table tennis experience'
          },
          {
            name: 'Dmitry Petrov',
            email: 'd.petrov@innopolis.university',
            telegram: '@dmitry_petrov_tt',
            role: 'Vice President',
            bio: 'Former regional champion, specializes in coaching beginners'
          }
        ],
        schedule: [
          { day: 'Monday', time: '18:00 - 20:00', location: 'Sports Complex - Hall A' },
          { day: 'Wednesday', time: '19:00 - 21:00', location: 'Sports Complex - Hall A' },
          { day: 'Friday', time: '17:00 - 19:00', location: 'Sports Complex - Hall A' }
        ],
        achievements: [
          'Inter-University Championship 2023 - 2nd Place',
          'Regional Tournament 2023 - 3rd Place',
          'University Sports Day 2023 - 1st Place'
        ],
        memberCount: 45,
        founded: '2018',
        location: 'Sports Complex - Hall A'
      },
      'basketball': {
        name: 'Basketball Club',
        emoji: '🏀',
        description: 'The Basketball Club brings together passionate players who love the game. We focus on teamwork, skill development, and competitive play in a supportive environment.',
        longDescription: `Our Basketball Club is one of the most active sports communities at Innopolis University. We welcome players of all skill levels and provide structured training programs to help everyone improve their game.

From fundamentals like shooting and dribbling to advanced tactics and team play, our experienced coaches and senior players are here to guide your basketball journey. We compete in local leagues and organize exciting tournaments throughout the year.`,
        image: '/api/placeholder/600/300',
        telegram: '@basketball_inno',
        leaders: [
          {
            name: 'Michael Johnson',
            email: 'm.johnson@innopolis.university',
            telegram: '@michael_johnson_bb',
            role: 'Team Captain',
            bio: 'Former varsity player with extensive coaching experience'
          }
        ],
        schedule: [
          { day: 'Tuesday', time: '19:00 - 21:00', location: 'Sports Complex - Main Court' },
          { day: 'Thursday', time: '18:00 - 20:00', location: 'Sports Complex - Main Court' },
          { day: 'Saturday', time: '10:00 - 12:00', location: 'Sports Complex - Main Court' }
        ],
        achievements: [
          'University League Champions 2023',
          'Regional Championship Participants 2023'
        ],
        memberCount: 32,
        founded: '2019',
        location: 'Sports Complex - Main Court'
      },
      'swimming': {
        name: 'Swimming Club',
        emoji: '🏊‍♂️',
        description: 'Dive into excellence with our Swimming Club! We offer training for all strokes and distances, from recreational swimming to competitive racing.',
        longDescription: `The Swimming Club at Innopolis University provides comprehensive aquatic training in our state-of-the-art facilities. Our program covers all four competitive strokes and various training intensities.

Whether you want to improve your fitness, learn proper technique, or compete at high levels, our certified coaches will help you achieve your goals. We emphasize proper form, endurance building, and water safety.`,
        image: '/api/placeholder/600/300',
        telegram: '@swimming_inno',
        leaders: [
          {
            name: 'Elena Volkova',
            email: 'e.volkova@innopolis.university',
            telegram: '@elena_volkova_swim',
            role: 'Head Coach',
            bio: 'Certified swimming instructor with national competition experience'
          }
        ],
        schedule: [
          { day: 'Monday', time: '07:00 - 08:30', location: 'Aquatic Center - Pool' },
          { day: 'Wednesday', time: '19:00 - 20:30', location: 'Aquatic Center - Pool' },
          { day: 'Friday', time: '07:00 - 08:30', location: 'Aquatic Center - Pool' }
        ],
        achievements: [
          'Regional Swimming Championship 2023 - Multiple medals',
          'University Aquatic Meet 2023 - 1st Place Team'
        ],
        memberCount: 28,
        founded: '2020',
        location: 'Aquatic Center'
      }
    };

    return clubs[name || ''] || {
      name: 'Sport Club',
      emoji: '🏃‍♂️',
      description: 'A great sport club for fitness and competition.',
      longDescription: 'Join our amazing sport community!',
      image: '/api/placeholder/600/300',
      telegram: '@sport_inno',
      leaders: [
        {
          name: 'Sport Leader',
          email: 'leader@innopolis.university',
          role: 'President',
          bio: 'Passionate about sports and community building'
        }
      ],
      schedule: [],
      achievements: [],
      memberCount: 20,
      founded: '2021',
      location: 'Sports Complex'
    };
  };

  const club = getClubData(clubName || '');

  return (
    <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8 px-4">
      {/* Back Button */}
      <button
        onClick={() => window.history.back()}
        className="innohassle-button-secondary px-3 sm:px-4 py-2 flex items-center space-x-2 text-sm sm:text-base"
      >
        <ArrowLeft size={16} />
        <span>Back to Sports</span>
      </button>

      {/* Hero Section */}
      <div className="innohassle-card overflow-hidden">
        <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-r from-brand-violet to-brand-gradient-end">
          <img
            src={club.image}
            alt={club.name}
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 sm:p-8 text-white">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
              <span className="text-3xl sm:text-5xl">{club.emoji}</span>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold">{club.name}</h1>
                <p className="text-sm sm:text-lg opacity-90">Since {club.founded}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="p-4 sm:p-6 border-b border-secondary">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Users className="text-brand-violet" size={20} />
              <div>
                <p className="text-xs sm:text-sm text-inactive">Members</p>
                <p className="font-semibold text-contrast text-sm sm:text-base">{club.memberCount}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <MapPin className="text-brand-violet" size={20} />
              <div>
                <p className="text-xs sm:text-sm text-inactive">Location</p>
                <p className="font-semibold text-contrast text-sm sm:text-base">{club.location}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Send className="text-brand-violet" size={20} />
              <div>
                <p className="text-xs sm:text-sm text-inactive">Telegram</p>
                <a 
                  href={`https://t.me/${club.telegram.replace('@', '')}`}
                  className="font-semibold text-brand-violet hover:underline text-sm sm:text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {club.telegram}
                </a>
              </div>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Calendar className="text-brand-violet" size={20} />
              <div>
                <p className="text-xs sm:text-sm text-inactive">Training Days</p>
                <p className="font-semibold text-contrast text-sm sm:text-base">{club.schedule.length} days/week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* About */}
          <div className="innohassle-card p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-contrast mb-4">About Our Club</h2>
            <p className="text-contrast mb-4 text-sm sm:text-base">{club.description}</p>
            <div className="prose prose-gray max-w-none">
              {club.longDescription.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="text-contrast mb-4 leading-relaxed text-sm sm:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="innohassle-card p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Clock className="text-brand-violet" size={24} />
              <h2 className="text-xl sm:text-2xl font-bold text-contrast">Training Schedule</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {club.schedule.map((session: any, index: number) => (
                <div key={index} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-primary rounded-lg space-y-2 sm:space-y-0">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-violet/10 rounded-lg flex items-center justify-center">
                      <Calendar className="text-brand-violet" size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-contrast text-sm sm:text-base">{session.day}</p>
                      <p className="text-xs sm:text-sm text-inactive">{session.time}</p>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <p className="text-xs sm:text-sm text-inactive">Location</p>
                    <p className="font-medium text-contrast text-sm sm:text-base">{session.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="innohassle-card p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Star className="text-brand-violet" size={24} />
              <h2 className="text-xl sm:text-2xl font-bold text-contrast">Achievements</h2>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {club.achievements.map((achievement: string, index: number) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-brand-violet rounded-full"></div>
                  <p className="text-contrast text-sm sm:text-base">{achievement}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6 sm:space-y-8">
          {/* Leadership */}
          <div className="innohassle-card p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <User className="text-brand-violet" size={24} />
              <h2 className="text-lg sm:text-xl font-bold text-contrast">Leadership</h2>
            </div>
            <div className="space-y-4 sm:space-y-6">
              {club.leaders.map((leader: any, index: number) => (
                <div key={index} className="border-b border-secondary last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-violet/10 rounded-full flex items-center justify-center">
                      <User className="text-brand-violet" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-contrast text-sm sm:text-base">{leader.name}</h3>
                      <p className="text-xs sm:text-sm text-brand-violet">{leader.role}</p>
                      <p className="text-xs text-inactive mt-1">{leader.bio}</p>
                      <div className="flex flex-col space-y-1 mt-2">
                        <a
                          href={`mailto:${leader.email}`}
                          className="text-xs sm:text-sm text-brand-violet hover:underline flex items-center space-x-1"
                        >
                          <Mail size={14} />
                          <span>{leader.email}</span>
                        </a>
                        {leader.telegram && (
                          <a
                            href={`https://t.me/${leader.telegram.replace('@', '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-brand-violet hover:underline flex items-center space-x-1"
                          >
                            <Send size={14} />
                            <span>{leader.telegram}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Join Club */}
          <div className="innohassle-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-contrast mb-4">Join Our Club</h2>
            <p className="text-contrast mb-6 text-sm sm:text-base">
              Ready to become part of our community? Join our Telegram group to stay updated and connect with other members!
            </p>
            <div className="space-y-3">
              <a
                href={`https://t.me/${club.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="innohassle-button-primary w-full py-3 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Send size={18} />
                <span>Join Telegram</span>
              </a>
              <a
                href={`mailto:${club.leaders[0].email}?subject=Interest in joining ${club.name}`}
                className="innohassle-button-secondary w-full py-3 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Mail size={18} />
                <span>Contact Leader</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubPage;