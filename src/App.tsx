import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import TopBar from './components/TopBar';
import SchedulePage from './pages/SchedulePage';
import HistoryPage from './pages/HistoryPage';
import FAQPage from "./pages/FAQPage.tsx";
import ClubPage from "./pages/ClubPage.tsx";
import ClubsPage from "./pages/ClubsPage.tsx";
import FitnessTestPage from "./pages/FitnessTestPage.tsx";

function App() {
  const { isLoading, loadUserProfile } = useAppStore();

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
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-violet"></div>
            <span className="text-gray-700">Loading...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;