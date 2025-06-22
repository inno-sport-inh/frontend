import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from './store/useAppStore';
import TopBar from './components/TopBar';
import SchedulePage from './pages/SchedulePage';
import ClubsPage from './pages/ClubsPage';
import ClubPage from './pages/ClubPage';
import HistoryPage from './pages/HistoryPage';
import FAQPage from "./pages/FAQPage.tsx";

function App() {
  const { isLoading } = useAppStore();

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'rgb(var(--color-pagebg))' }}>
      <TopBar />
      <main className="px-4 py-8">
        <Routes>
          <Route path="/" element={<SchedulePage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/clubs" element={<ClubsPage />} />
          <Route path="/club/:clubName" element={<ClubPage />} />
          <Route path="/history" element={<HistoryPage />} />
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