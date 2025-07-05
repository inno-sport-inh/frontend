import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Send, Mail, User, Clock, UserPlus, CheckCircle } from 'lucide-react';

const ClubPage: React.FC = () => {
  const { clubName } = useParams<{ clubName: string }>();
  const [enrolledSessions, setEnrolledSessions] = useState<Set<string>>(new Set());
  const [enrollmentLoading, setEnrollmentLoading] = useState<string | null>(null);

  const handleEnrollment = async (sessionId: string) => {
    setEnrollmentLoading(sessionId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (enrolledSessions.has(sessionId)) {
        setEnrolledSessions(prev => {
          const newSet = new Set(prev);
          newSet.delete(sessionId);
          return newSet;
        });
      } else {
        setEnrolledSessions(prev => new Set(prev).add(sessionId));
      }
    } catch (error) {
      console.error('Enrollment error:', error);
    } finally {
      setEnrollmentLoading(null);
    }
  };

  const getUpcomingSessions = (schedule: any[]) => {
    const now = new Date();
    const upcomingSessions: any[] = [];
    
    // Generate next 4 weeks of sessions
    for (let week = 0; week < 4; week++) {
      schedule.forEach((session) => {
        const sessionDate = new Date();
        sessionDate.setDate(now.getDate() + (week * 7) + ((getDayOfWeek(session.day) - now.getDay() + 7) % 7));
        
        const sessionId = `${session.day}-${session.time}-${week}`;
        upcomingSessions.push({
          id: sessionId,
          ...session,
          date: sessionDate,
          isEnrolled: enrolledSessions.has(sessionId)
        });
      });
    }
    
    return upcomingSessions.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

  const getDayOfWeek = (day: string) => {
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    return days.indexOf(day);
  };

  const formatSessionDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
          { day: 'Monday', time: '17:00 - 19:00', location: 'Aquatic Center - Pool' },
          { day: 'Wednesday', time: '18:00 - 20:00', location: 'Aquatic Center - Pool' },
          { day: 'Friday', time: '19:00 - 21:00', location: 'Aquatic Center - Pool' }
        ],
        achievements: [
          'Regional Swimming Championship 2023 - Multiple medals',
          'University Aquatic Meet 2023 - 1st Place'
        ],
        memberCount: 28,
        founded: '2020',
        location: 'Aquatic Center - Pool'
      }
    };

    return clubs[name || ''] || {
      name: 'Club Not Found',
      emoji: '❓',
      description: 'This club information is not available.',
      longDescription: 'We could not find information about this club.',
      image: '/api/placeholder/600/300',
      telegram: '@innopolis_sport',
      leaders: [],
      schedule: [],
      achievements: [],
      memberCount: 0,
      founded: 'N/A',
      location: 'N/A'
    };
  };

  const club = getClubData(clubName || '');
  const upcomingSessions = getUpcomingSessions(club.schedule || []);

  if (!club) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-contrast mb-4">Club Not Found</h1>
          <p className="text-inactive">The club you're looking for doesn't exist.</p>
          <Link to="/clubs" className="innohassle-button-primary mt-4 inline-block">
            Back to Clubs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          to="/clubs"
          className="flex items-center space-x-2 text-brand-violet hover:text-brand-violet/80 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="text-sm sm:text-base">Back to Clubs</span>
        </Link>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Content */}
        <div className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* Club Header */}
          <div className="innohassle-card overflow-hidden">
            <div className="bg-gradient-to-r from-brand-violet to-brand-violet/80 p-6 sm:p-8 text-white">
              <div className="flex items-center space-x-4">
                <div className="text-4xl sm:text-6xl">{club.emoji}</div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{club.name}</h1>
                  <p className="text-white/90 mt-2 text-sm sm:text-base">{club.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Training Sessions */}
          <div className="innohassle-card p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Calendar className="text-brand-violet" size={24} />
              <h2 className="text-lg sm:text-xl font-bold text-contrast">Upcoming Training Sessions</h2>
            </div>
            
            <div className="space-y-3">
              {upcomingSessions.slice(0, 8).map((session) => {
                const isEnrolled = enrolledSessions.has(session.id);
                const isLoading = enrollmentLoading === session.id;
                
                return (
                  <div
                    key={session.id}
                    className={`p-4 rounded-lg border transition-all ${
                      isEnrolled 
                        ? 'border-brand-violet bg-brand-violet/5' 
                        : 'border-secondary bg-primary hover:border-brand-violet/50'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="font-medium text-contrast">{formatSessionDate(session.date)}</span>
                          {isEnrolled && (
                            <CheckCircle className="text-brand-violet" size={16} />
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-inactive">
                          <div className="flex items-center space-x-1">
                            <Clock size={14} />
                            <span>{session.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{session.location}</span>
                          </div>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => handleEnrollment(session.id)}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          isEnrolled
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-brand-violet text-white hover:bg-brand-violet/80'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        {isLoading ? (
                          'Loading...'
                        ) : isEnrolled ? (
                          'Unenroll'
                        ) : (
                          <div className="flex items-center space-x-1">
                            <UserPlus size={14} />
                            <span>Enroll</span>
                          </div>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
              <p className="text-sm text-inactive">
                <strong>Note:</strong> Training sessions are open to all club members. 
                Enrollment helps us plan capacity and send reminders. 
                Contact the club leader if you have questions about specific sessions.
              </p>
            </div>
          </div>

          {/* About */}
          <div className="innohassle-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-contrast mb-4">About Our Club</h2>
            <div className="prose prose-sm sm:prose-base text-contrast">
              {club.longDescription.split('\n\n').map((paragraph: string, index: number) => (
                <p key={index} className="mb-4 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="innohassle-card p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Clock className="text-brand-violet" size={24} />
              <h2 className="text-lg sm:text-xl font-bold text-contrast">Regular Schedule</h2>
            </div>
            <div className="space-y-3">
              {club.schedule.map((session: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-brand-violet rounded-full" />
                    <div>
                      <div className="font-medium text-contrast">{session.day}</div>
                      <div className="text-sm text-inactive">{session.time}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-inactive">
                    <MapPin size={14} />
                    <span>{session.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Achievements */}
          <div className="innohassle-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-contrast mb-4">Achievements</h2>
            <div className="space-y-3">
              {club.achievements.map((achievement: string, index: number) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-brand-violet rounded-full mt-2 flex-shrink-0" />
                  <p className="text-contrast">{achievement}</p>
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

          {/* Quick Actions */}
          <div className="innohassle-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-contrast mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link
                to="/schedule"
                className="innohassle-button-primary w-full py-3 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Calendar size={18} />
                <span>View Full Schedule</span>
              </Link>
              <a
                href={`https://t.me/${club.telegram.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="innohassle-button-secondary w-full py-3 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Send size={18} />
                <span>Join Telegram</span>
              </a>
              <a
                href={`mailto:${club.leaders[0]?.email || 'info@innopolis.university'}?subject=Interest in joining ${club.name}`}
                className="innohassle-button-secondary w-full py-3 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <Mail size={18} />
                <span>Contact Leader</span>
              </a>
            </div>
          </div>

          {/* Club Stats */}
          <div className="innohassle-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-contrast mb-4">Club Stats</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-inactive">Members</span>
                <span className="font-medium text-contrast">{club.memberCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-inactive">Founded</span>
                <span className="font-medium text-contrast">{club.founded}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-inactive">Location</span>
                <span className="font-medium text-contrast">{club.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubPage;
