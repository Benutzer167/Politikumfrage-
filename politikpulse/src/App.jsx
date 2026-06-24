import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import SurveyPage from './pages/SurveyPage'
import ThankYouPage from './pages/ThankYouPage'
import DashboardPage from './pages/DashboardPage'

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/"          element={<SurveyPage />} />
        <Route path="/danke"     element={<ThankYouPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*"          element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  )
}
