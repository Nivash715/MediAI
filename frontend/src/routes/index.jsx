import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '../config/routes.config'
import { useAuth } from '../hooks/useAuth'

// Auth pages
import LoginPage    from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'

// Main pages
import HomePage         from '../pages/home/HomePage'
import PharmaciesPage   from '../pages/pharmacies/PharmaciesPage'
import PharmacyDetail   from '../pages/pharmacies/PharmacyDetail'
import MedicinesPage    from '../pages/medicines/MedicinesPage'
import MedicineDetail   from '../pages/medicines/MedicineDetail'
import CartPage         from '../pages/cart/CartPage'
import OrdersPage       from '../pages/orders/OrdersPage'
import OrderDetail      from '../pages/orders/OrderDetail'
import PaymentsPage     from '../pages/payments/PaymentsPage'
import DeliveryPage     from '../pages/delivery/DeliveryPage'

// Feature pages
import SymptomChecker   from '../pages/home/SymptomChecker'
import AIAssistant      from '../pages/home/AIAssistant'
import ConsultationPage from '../pages/home/ConsultationPage'
import PrescriptionsPage from '../pages/home/PrescriptionsPage'
import HealthRecords    from '../pages/home/HealthRecords'
import EmergencyPage    from '../pages/home/EmergencyPage'
import ProfilePage      from '../pages/home/ProfilePage'
import AdminPage        from '../pages/home/AdminPage'
import NotFound         from '../pages/NotFound'

// Layout
import AppShell from '../components/layout/AppShell'

/** Route guard — redirects unauthenticated users */
function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <div className="flex h-screen items-center justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin" /></div>
  return isAuthenticated ? children : <Navigate to={ROUTES.LOGIN} replace />
}

/** Route guard — redirects already-authenticated users */
function PublicRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return null
  return isAuthenticated ? <Navigate to={ROUTES.HOME} replace /> : children
}

export default function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Auth ─────────────────────────────────── */}
      <Route path={ROUTES.LOGIN}    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path={ROUTES.REGISTER} element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* ── Protected App ───────────────────────────────── */}
      <Route element={<PrivateRoute><AppShell /></PrivateRoute>}>
        <Route path={ROUTES.HOME}            element={<HomePage />} />
        <Route path={ROUTES.PHARMACIES}      element={<PharmaciesPage />} />
        <Route path={ROUTES.PHARMACY_DETAIL} element={<PharmacyDetail />} />
        <Route path={ROUTES.MEDICINES}       element={<MedicinesPage />} />
        <Route path={ROUTES.MEDICINE_DETAIL} element={<MedicineDetail />} />
        <Route path={ROUTES.CART}            element={<CartPage />} />
        <Route path={ROUTES.ORDERS}          element={<OrdersPage />} />
        <Route path={ROUTES.ORDER_DETAIL}    element={<OrderDetail />} />
        <Route path={ROUTES.PAYMENTS}        element={<PaymentsPage />} />
        <Route path={ROUTES.DELIVERY}        element={<DeliveryPage />} />
        <Route path={ROUTES.SYMPTOMS}        element={<SymptomChecker />} />
        <Route path={ROUTES.AI_ASSISTANT}    element={<AIAssistant />} />
        <Route path={ROUTES.CONSULTATION}    element={<ConsultationPage />} />
        <Route path={ROUTES.PRESCRIPTIONS}   element={<PrescriptionsPage />} />
        <Route path={ROUTES.HEALTH_RECORDS}  element={<HealthRecords />} />
        <Route path={ROUTES.EMERGENCY}       element={<EmergencyPage />} />
        <Route path={ROUTES.PROFILE}         element={<ProfilePage />} />
        <Route path={ROUTES.ADMIN}           element={<AdminPage />} />
        <Route path={ROUTES.NOTIFICATIONS}   element={<ProfilePage />} />
      </Route>

      {/* ── Root redirect ───────────────────────────────── */}
      <Route path="/" element={<Navigate to={ROUTES.HOME} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
