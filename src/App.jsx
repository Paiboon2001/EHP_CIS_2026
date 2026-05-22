import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage.jsx'
import Homepage from './pages/Homepage.jsx'
import OpdRegister from './pages/OpdRegister.jsx'
import OpdDetails from './pages/OpdDetails.jsx'
import { isAuthenticated } from './auth.js'

// Gate a route behind login — redirect to /login when signed out.
function RequireAuth({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <RequireAuth>
              <Homepage />
            </RequireAuth>
          }
        />
        <Route
          path="/opd/medical-records"
          element={
            <RequireAuth>
              <OpdRegister />
            </RequireAuth>
          }
        />
        <Route
          path="/opd/details"
          element={
            <RequireAuth>
              <OpdDetails />
            </RequireAuth>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
