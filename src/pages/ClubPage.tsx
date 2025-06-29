import React from "react";
import { useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Send, Mail, User, Clock } from "lucide-react";
import { getClubData } from "../data/mockData";

const ClubPage: React.FC = () => {
  const { clubName } = useParams<{ clubName: string }>();

  const club = getClubData(clubName || "");
  return (
    <main className="max-w-6xl mx-auto px-4 space-y-6 sm:space-y-8">
      {/* Navigation: go back to the previous view */}
      <nav>
        <button onClick={() => window.history.back()} className="innohassle-button-secondary px-3 sm:px-4 py-2 flex items-center space-x-2 text-sm sm:text-base">
          <ArrowLeft size={16} />
          <span>Back to Sports</span>
        </button>
      </nav>

      {/* Hero Section: show club banner, name, and founding year */}
      <header className="innohassle-card overflow-hidden">
        <div className="relative h-48 sm:h-64 md:h-80 bg-gradient-to-r from-brand-violet to-brand-gradient-end">
          <img src={club.image} alt={`${club.name} banner`} className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 sm:p-8 text-white">
            <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
              <span className="text-3xl sm:text-5xl" aria-hidden>
                {club.emoji}
              </span>
              <div>
                <h1 className="text-2xl sm:text-4xl font-bold">{club.name}</h1>
                <p className="text-sm sm:text-lg opacity-90">Since {club.founded}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats: location, telegram link, and weekly schedule count */}
        <section className="p-4 sm:p-6 border-b border-secondary">
          <ul className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <li className="flex items-center space-x-2 sm:space-x-3">
              <MapPin className="text-brand-violet" size={20} />
              <div>
                <p className="text-xs sm:text-sm text-inactive">Location</p>
                <p className="font-semibold text-contrast text-sm sm:text-base">{club.location}</p>
              </div>
            </li>
            <li className="flex items-center space-x-2 sm:space-x-3">
              <Send className="text-brand-violet" size={20} />
              <div>
                <p className="text-xs sm:text-sm text-inactive">Telegram</p>
                <a href={`https://t.me/${club.telegram.replace("@", "")}`} className="font-semibold text-brand-violet hover:underline text-sm sm:text-base" target="_blank" rel="noopener noreferrer">
                  {club.telegram}
                </a>
              </div>
            </li>
            <li className="flex items-center space-x-2 sm:space-x-3">
              <Calendar className="text-brand-violet" size={20} />
              <div>
                <p className="text-xs sm:text-sm text-inactive">Training Days</p>
                <p className="font-semibold text-contrast text-sm sm:text-base">{club.schedule.length} days/week</p>
              </div>
            </li>
          </ul>
        </section>
      </header>

      {/* Main Content and Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Primary Content: about and schedule */}
        <article className="lg:col-span-2 space-y-6 sm:space-y-8">
          {/* About Section */}
          <section className="innohassle-card p-4 sm:p-6">
            <h2 className="text-xl sm:text-2xl font-bold text-contrast mb-4">About Our Club</h2>
            <p className="text-contrast mb-4 text-sm sm:text-base">{club.description}</p>
            <div className="prose prose-gray max-w-none">
              {club.longDescription.split("\n\n").map((para: string, idx: number) => (
                <p key={idx} className="text-contrast mb-4 leading-relaxed text-sm sm:text-base">
                  {para}
                </p>
              ))}
            </div>
          </section>

          {/* Training Schedule Section */}
          <section className="innohassle-card p-4 sm:p-6">
            <header className="flex items-center space-x-2 mb-4 sm:mb-6">
              <Clock className="text-brand-violet" size={24} />
              <h2 className="text-xl sm:text-2xl font-bold text-contrast">Training Schedule</h2>
            </header>
            <ul className="space-y-3 sm:space-y-4">
              {club.schedule.map((session: any, idx: number) => (
                <li key={idx} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-primary rounded-lg space-y-2 sm:space-y-0">
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
                </li>
              ))}
            </ul>
          </section>
        </article>

        {/* Sidebar: leadership and join section */}
        <aside className="space-y-6 sm:space-y-8">
          {/* Leadership Section */}
          <section className="innohassle-card p-4 sm:p-6">
            <header className="flex items-center space-x-2 mb-4 sm:mb-6">
              <User className="text-brand-violet" size={24} />
              <h2 className="text-lg sm:text-xl font-bold text-contrast">Leadership</h2>
            </header>
            <ul className="space-y-4 sm:space-y-6">
              {club.leaders.map((leader: any, idx: number) => (
                <li key={idx} className="border-b border-secondary last:border-b-0 pb-4 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-brand-violet/10 rounded-full flex items-center justify-center">
                      <User className="text-brand-violet" size={20} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-contrast text-sm sm:text-base">{leader.name}</h3>
                      <p className="text-xs sm:text-sm text-brand-violet">{leader.role}</p>
                      <p className="text-xs text-inactive mt-1">{leader.bio}</p>
                      <div className="flex flex-col space-y-1 mt-2">
                        <a href={`mailto:${leader.email}`} className="text-xs sm:text-sm text-brand-violet hover:underline flex items-center space-x-1">
                          <Mail size={14} />
                          <span>{leader.email}</span>
                        </a>
                        {leader.telegram && (
                          <a href={`https://t.me/${leader.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="text-xs sm:text-sm text-brand-violet hover:underline flex items-center space-x-1">
                            <Send size={14} />
                            <span>{leader.telegram}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          {/* Call to Action: Join Club */}
          <section className="innohassle-card p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-contrast mb-4">Join Our Club</h2>
            <p className="text-contrast mb-6 text-sm sm:text-base">Excited to connect and grow with like-minded sports enthusiasts? Subscribe to our Telegram and reach out directly to get started!</p>
            <div className="space-y-3">
              <a href={`https://t.me/${club.telegram.replace("@", "")}`} className="innohassle-button-primary w-full py-3 flex items-center justify-center space-x-2 text-sm sm:text-base" target="_blank" rel="noopener noreferrer">
                <Send size={18} />
                <span>Join Telegram</span>
              </a>
              <a href={`mailto:${club.leaders[0].email}?subject=Interest in joining ${club.name}`} className="innohassle-button-secondary w-full py-3 flex items-center justify-center space-x-2 text-sm sm:text-base">
                <Mail size={18} />
                <span>Contact Leader</span>
              </a>
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
};

export default ClubPage;
