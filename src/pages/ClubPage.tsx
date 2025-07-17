import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Clock, CheckCircle, Loader2, AlertCircle, Trophy, Target } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { generateSessionId, formatSessionDate } from '../utils/sessionUtils';
import { clubsAPI, Club, ClubGroup } from '../services/api';

const ClubPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { enrollInSession, cancelEnrollment, isEnrolled } = useAppStore();
  const [enrollmentLoading, setEnrollmentLoading] = useState<string | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClub = async () => {
      try {
        setLoading(true);
        setError(null);
        const clubsData = await clubsAPI.getClubs();
        const foundClub = clubsData.find(c => c.id.toString() === clubId);
        if (foundClub) {
          setClub(foundClub);
        } else {
          setError('Club not found');
        }
      } catch (err) {
        console.error('Error fetching club:', err);
        setError(err instanceof Error ? err.message : 'Failed to load club');
      } finally {
        setLoading(false);
      }
    };

    if (clubId) {
      fetchClub();
    }
  }, [clubId]);

  const handleEnrollment = async (sessionId: string) => {
    setEnrollmentLoading(sessionId);
    try {
      if (isEnrolled(sessionId)) {
        await cancelEnrollment(sessionId);
      } else {
        await enrollInSession(sessionId);
      }
    } catch (error) {
      console.error('Enrollment error:', error);
    } finally {
      setEnrollmentLoading(null);
    }
  };

  const getUpcomingSessions = (groups: ClubGroup[], clubName?: string) => {
    const now = new Date();
    const upcomingSessions: any[] = [];
    const oneWeekFromNow = new Date(now);
    oneWeekFromNow.setDate(now.getDate() + 7);
    
    // Generate next 4 weeks of sessions for all groups
    groups.forEach(group => {
      group.schedule.forEach(session => {
        for (let week = 0; week < 4; week++) {
          // Правильно вычисляем дату следующей тренировки
          const sessionDate = new Date();
          const currentDay = now.getDay(); // 0 = воскресенье, 1 = понедельник, и т.д.
          const targetDay = session.weekday; // день недели из API
          
          // Вычисляем разность дней до целевого дня недели
          let daysUntilTarget = targetDay - currentDay;
          if (daysUntilTarget < 0) {
            daysUntilTarget += 7; // если день уже прошёл на этой неделе
          }
          
          // Если это сегодня, но время уже прошло, переносим на следующую неделю
          if (daysUntilTarget === 0) {
            const [hours, minutes] = session.start_time.split(':').map(Number);
            const sessionTime = new Date(now);
            sessionTime.setHours(hours, minutes, 0, 0);
            
            if (sessionTime <= now) {
              daysUntilTarget = 7; // переносим на следующую неделю
            }
          }
          
          // Добавляем дни для нужной недели
          sessionDate.setDate(now.getDate() + daysUntilTarget + (week * 7));
          
          // Устанавливаем время тренировки
          const [hours, minutes] = session.start_time.split(':').map(Number);
          sessionDate.setHours(hours, minutes, 0, 0);
          
          // Пропускаем прошедшие сессии
          if (sessionDate <= now) {
            continue;
          }
          
          const sessionId = generateSessionId(
            group.name, // используем имя группы для ID
            session.weekday_name,
            session.start_time,
            sessionDate
          );
          
          // Проверяем, можно ли записаться (только в пределах недели)
          const canEnroll = sessionDate <= oneWeekFromNow;
          
          upcomingSessions.push({
            id: sessionId,
            group: group,
            schedule: session,
            date: sessionDate,
            isEnrolled: isEnrolled(sessionId),
            activity: group.name, // название группы как основная активность
            time: `${session.start_time} - ${session.end_time}`,
            day: session.weekday_name,
            location: session.training_class || 'Training Hall', // место из training_class
            trainer: group.trainers?.[0]?.name || 'TBD',
            groupName: group.name,
            clubName: clubName, // добавляем название клуба для контекста
            canEnroll: canEnroll // флаг для возможности записи
          });
        }
      });
    });
    
    return upcomingSessions.sort((a, b) => a.date.getTime() - b.date.getTime());
  };

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
    return '🏃‍♂️';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/clubs"
            className="flex items-center space-x-2 text-brand-violet hover:text-brand-violet/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Clubs</span>
          </Link>
        </div>
        <div className="flex justify-center items-center py-12">
          <div className="flex items-center space-x-3">
            <Loader2 className="animate-spin text-brand-violet" size={24} />
            <span className="text-contrast">Loading club details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !club) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/clubs"
            className="flex items-center space-x-2 text-brand-violet hover:text-brand-violet/80 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Clubs</span>
          </Link>
        </div>
        <div className="innohassle-card p-6 sm:p-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <AlertCircle className="text-red-500" size={24} />
            <h2 className="text-xl font-semibold text-contrast">Club Not Found</h2>
          </div>
          <p className="text-inactive mb-4">{error || 'The club you\'re looking for doesn\'t exist.'}</p>
          <Link to="/clubs" className="innohassle-button-primary">
            Back to Clubs
          </Link>
        </div>
      </div>
    );
  }

  const upcomingSessions = getUpcomingSessions(club.groups, club.name);
  const emoji = getClubEmoji(club.name);

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
                <div className="text-4xl sm:text-6xl">{emoji}</div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold">{club.name}</h1>
                  <p className="text-white/90 mt-2 text-sm sm:text-base">{club.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Training Groups */}
          <div className="innohassle-card p-6">
            <h2 className="text-xl font-bold text-contrast mb-6">Training Groups</h2>
            <div className="space-y-4">
              {club.groups.map((group) => (
                <div key={group.id} className="border border-secondary rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold text-contrast">{group.name}</h3>
                      <p className="text-sm text-inactive mt-1">{group.description}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {group.accredited && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                          Accredited
                        </span>
                      )}
                      {group.is_enrolled && (
                        <span className="bg-brand-violet text-white text-xs px-2 py-1 rounded">
                          Enrolled
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Group Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Users size={16} className="text-brand-violet" />
                      <span className="text-sm text-contrast">
                        {group.current_enrollment}/{group.capacity} enrolled
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Target size={16} className="text-brand-violet" />
                      <span className="text-sm text-contrast">
                        {group.free_places} free places
                      </span>
                    </div>
                  </div>

                  {/* Capacity bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-inactive mb-1">
                      <span>Capacity</span>
                      <span>{group.current_enrollment}/{group.capacity}</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-brand-violet h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((group.current_enrollment / group.capacity) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>

                  {/* Schedule */}
                  {group.schedule && group.schedule.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-contrast mb-2">Schedule:</h4>
                      <div className="space-y-1">
                        {group.schedule.map((session, index) => (
                          <div key={index} className="flex items-center space-x-2 text-sm">
                            <Clock size={14} className="text-brand-violet" />
                            <span className="text-contrast">
                              {session.weekday_name}: {session.start_time} - {session.end_time}
                              {session.training_class && ` (${session.training_class})`}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Trainers */}
                  {group.trainers && group.trainers.length > 0 && (
                    <div>
                      <h4 className="font-medium text-contrast mb-2">Trainers:</h4>
                      <div className="space-y-1">
                        {group.trainers.map((trainer) => (
                          <div key={trainer.id} className="flex items-center space-x-2 text-sm">
                            <Trophy size={14} className="text-brand-violet" />
                            <span className="text-contrast">{trainer.name}</span>
                            <span className="text-inactive">({trainer.email})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Training Sessions */}
          <div className="innohassle-card p-6">
            <h2 className="text-xl font-bold text-contrast mb-6">Upcoming Training Sessions</h2>
            {upcomingSessions.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="mx-auto text-inactive mb-4" size={48} />
                <h3 className="text-lg font-medium text-contrast mb-2">No Upcoming Sessions</h3>
                <p className="text-inactive mb-4">
                  The schedule might not be published yet or all sessions for the upcoming weeks have already passed.
                </p>
                {club.groups.length > 0 && (
                  <div className="text-sm text-inactive">
                    <p>Available groups:</p>
                    <div className="flex flex-wrap justify-center gap-2 mt-2">
                      {club.groups.map(group => (
                        <span key={group.id} className="bg-secondary px-2 py-1 rounded text-xs">
                          {group.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingSessions.slice(0, 10).map((session) => (
                  <div key={session.id} className={`border rounded-lg p-4 transition-all ${
                    session.canEnroll 
                      ? 'border-secondary hover:border-brand-violet/30' 
                      : 'border-gray-200 bg-gray-50/50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        {/* Название тренировки большим шрифтом */}
                        <div className="mb-3">
                          <h3 className={`text-lg font-semibold ${
                            session.canEnroll ? 'text-contrast' : 'text-gray-500'
                          }`}>
                            {session.activity}
                          </h3>
                          {session.clubName && session.clubName !== session.activity && (
                            <p className={`text-sm mt-1 ${
                              session.canEnroll ? 'text-inactive' : 'text-gray-400'
                            }`}>
                              {session.clubName}
                            </p>
                          )}
                        </div>
                        
                        {/* Детали мелким шрифтом */}
                        <div className="space-y-1">
                          <div className={`flex items-center space-x-4 text-sm ${
                            session.canEnroll ? 'text-inactive' : 'text-gray-400'
                          }`}>
                            <div className="flex items-center space-x-1">
                              <Calendar size={14} />
                              <span>{formatSessionDate(session.date)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock size={14} />
                              <span>{session.time}</span>
                            </div>
                          </div>
                          <div className={`flex items-center space-x-4 text-sm ${
                            session.canEnroll ? 'text-inactive' : 'text-gray-400'
                          }`}>
                            <div className="flex items-center space-x-1">
                              <MapPin size={14} />
                              <span>{session.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Trophy size={14} />
                              <span>{session.trainer}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-3 ml-4">
                        {session.isEnrolled && (
                          <CheckCircle className="text-green-500" size={20} />
                        )}
                        {session.canEnroll ? (
                          <button
                            onClick={() => handleEnrollment(session.id)}
                            disabled={enrollmentLoading === session.id}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                              session.isEnrolled
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'innohassle-button-primary'
                            }`}
                          >
                            {enrollmentLoading === session.id ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : session.isEnrolled ? (
                              'Cancel'
                            ) : (
                              'Enroll'
                            )}
                          </button>
                        ) : (
                          <div className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-200 text-gray-500 cursor-not-allowed">
                            Registration Opens Later
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Club Stats */}
          <div className="innohassle-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-contrast mb-4">Club Statistics</h2>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-inactive">Total Groups</span>
                <span className="font-medium text-contrast">{club.total_groups}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-inactive">Free Places</span>
                <span className="font-medium text-contrast">{club.total_free_places}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-inactive">Total Members</span>
                <span className="font-medium text-contrast">
                  {club.groups.reduce((sum, group) => sum + group.current_enrollment, 0)}
                </span>
              </div>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubPage;
