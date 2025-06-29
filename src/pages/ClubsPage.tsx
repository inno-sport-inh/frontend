import React from "react";
import { MapPin, Clock, Send, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { clubs } from "../data/mockData";
/*
  ClubsPage component renders a list of sports clubs in a responsive grid.
  Each club card uses semantic HTML tags and ARIA attributes for better accessibility.
*/
const ClubsPage: React.FC = () => {
  return (
    <main className="max-w-7xl mx-auto space-y-8 sm:space-y-12">
      {/* Page header section with title and introduction */}
      <section aria-labelledby="clubs-heading" className="text-center px-4">
        <h1 id="clubs-heading" className="text-3xl sm:text-4xl font-bold text-contrast mb-4">
          Sports Clubs
        </h1>
        <p className="text-lg sm:text-xl text-inactive max-w-2xl mx-auto leading-relaxed">Join our vibrant sports community and discover your passion. From competitive tournaments to casual fun, there's a place for everyone.</p>
      </section>

      {/* Responsive grid mapping over clubs */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
        {clubs.map((club) => (
          <article key={club.id} className="innohassle-card overflow-hidden group hover:shadow-xl transition-all duration-300" aria-labelledby={`club-title-${club.id}`} aria-describedby={`club-desc-${club.id}`}>
            {/* Semantic header for club card with gradient and emoji */}
            <header className={`h-32 bg-gradient-to-br ${club.gradient} relative overflow-hidden`}>
              <div className="absolute inset-0 bg-black/20" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl filter drop-shadow-lg" aria-hidden="true">
                  {club.emoji}
                </span>
              </div>
            </header>

            {/* Main content area of the club card */}
            <div className="p-4 sm:p-6">
              <h3 id={`club-title-${club.id}`} className="text-lg sm:text-xl font-bold text-contrast mb-2 group-hover:text-brand-violet transition-colors">
                {club.name}
              </h3>
              <p id={`club-desc-${club.id}`} className="text-inactive mb-4 leading-relaxed line-clamp-3 text-sm sm:text-base">
                {club.description}
              </p>

              {/* List of essential club details formatted semantically */}
              <ul className="space-y-2 sm:space-y-3 mb-4 sm:mb-6 text-xs sm:text-sm" aria-label={`${club.name} details`}>
                <li className="flex items-center space-x-2">
                  <MapPin size={16} className="text-brand-violet" aria-hidden="true" />
                  <span className="text-contrast">{club.location}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Clock size={16} className="text-brand-violet" aria-hidden="true" />
                  <span className="text-contrast">{club.schedule}</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Send size={16} className="text-brand-violet" aria-hidden="true" />
                  <a href={`https://t.me/${club.telegram.replace("@", "")}`} className="text-brand-violet hover:underline" target="_blank" rel="noopener noreferrer" aria-label={`Open ${club.name} Telegram channel`}>
                    {club.telegram}
                  </a>
                </li>
                <li className="flex items-center space-x-2">
                  <Mail size={16} className="text-brand-violet" aria-hidden="true" />
                  <span className="text-contrast">Leader: {club.leader}</span>
                </li>
              </ul>

              {/* Footer with clear call-to-actions */}
              <footer className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <a href={`https://t.me/${club.telegram.replace("@", "")}`} target="_blank" rel="noopener noreferrer" className="flex-1 innohassle-button-primary py-2 text-xs sm:text-sm flex items-center justify-center space-x-2" aria-label={`Join the ${club.name} Telegram group`}>
                  <Send size={16} />
                  <span>Join Club</span>
                </a>
                <Link to={`/club/${club.slug}`} className="innohassle-button-secondary px-4 py-2 text-xs sm:text-sm text-center" aria-label={`Learn more about ${club.name}`}>
                  Learn More
                </Link>
              </footer>
            </div>
          </article>
        ))}
      </section>

      {/* Call to action section encouraging new club suggestions */}
      <section className="innohassle-card p-6 sm:p-8 text-center mx-4">
        <h2 className="text-xl sm:text-2xl font-bold text-contrast mb-4">Ready to Get Started?</h2>
        <p className="text-sm sm:text-base text-inactive mb-6 max-w-2xl mx-auto">Don’t see your favorite sport? We’re always looking to expand our offerings. Contact us to start a new club or suggest activities you’d like to see.</p>
        <footer className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Link to="/schedule" className="innohassle-button-primary px-4 sm:px-6 py-3 text-sm sm:text-base" aria-label="View training schedule">
            View Training Schedule
          </Link>
        </footer>
      </section>
    </main>
  );
};

export default ClubsPage;
