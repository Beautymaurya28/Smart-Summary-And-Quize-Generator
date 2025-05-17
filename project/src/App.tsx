import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';

// Pages
import DashboardPage from './pages/DashboardPage';
import SummarizePage from './pages/SummarizePage';
import SummaryDetailPage from './pages/SummaryDetailPage';
import QuizListPage from './pages/QuizListPage';
import QuizDetailPage from './pages/QuizDetailPage';
import QuizTakePage from './pages/QuizTakePage';
import QuizResultPage from './pages/QuizResultPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/summarize" element={<SummarizePage />} />
          <Route path="/summary/:id" element={<SummaryDetailPage />} />
          <Route path="/quizzes" element={<QuizListPage />} />
          <Route path="/quiz/:id" element={<QuizDetailPage />} />
          <Route path="/quiz/:id/take" element={<QuizTakePage />} />
          <Route path="/quiz/:quizId/attempt/:attemptId" element={<QuizResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;