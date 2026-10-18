import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../widgets/layout/ui/Layout'
import AdminPage from '../pages/admin/AdminPage'
import AssessmentDetailsPage from '../pages/assessment-details/AssessmentDetailsPage'
import DashboardPage from '../pages/dashboard/DashboardPage'
import LoginPage from '../pages/login/LoginPage'
import NewAssessmentPage from '../pages/new-assessment/NewAssessmentPage'
import RegisterPage from '../pages/register/RegisterPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/assessments/new" element={<NewAssessmentPage />} />
        <Route path="/assessments/:id" element={<AssessmentDetailsPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default App
