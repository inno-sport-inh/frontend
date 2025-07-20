import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAppStore } from './store/useAppStore';
import TopBar from './components/TopBar';
import SchedulePage from './pages/SchedulePage';
import HistoryPage from './pages/HistoryPage';
import FAQPage from "./pages/FAQPage.tsx";
import ClubPage from "./pages/ClubPage.tsx";
import ClubsPage from "./pages/ClubsPage.tsx";
import FitnessTestPage from "./pages/FitnessTestPage.tsx";
import FitnessSessionPage from "./pages/FitnessSessionPage";
import { FitnessTestSessionDetails } from './services/fitnessTestAPI';

function App() {
  const { loadUserProfile } = useAppStore();

  // Load user profile on app initialization
  useEffect(() => {
    loadUserProfile();
  }, [loadUserProfile]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(var(--color-pagebg))' }}>
      <TopBar />
      <main className="px-4 py-8 mobile-content-bottom-padding">
        <Routes>
          <Route path="/" element={<SchedulePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/club/:clubId" element={<ClubPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/fitness-test" element={<FitnessTestPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/fitness-session/:sessionId" element={<FitnessSessionPageWrapper />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

// Обёртка для загрузки данных сессии
function FitnessSessionPageWrapper() {
  const { sessionId } = useParams();
  const [session, setSession] = useState<FitnessTestSessionDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!sessionId) return;
    setLoading(true);
    import('./services/fitnessTestAPI').then(({ fitnessTestAPI }) =>
      fitnessTestAPI.getSessionDetails(Number(sessionId))
        .then((session: FitnessTestSessionDetails) => setSession(session))
        .catch(e => setError(e.message))
        .finally(() => setLoading(false))
    );
  }, [sessionId]);
  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-error-500 text-center py-10">{error}</div>;
  if (!session) return null;
  return <FitnessSessionPage session={session} />;
}

export default App;