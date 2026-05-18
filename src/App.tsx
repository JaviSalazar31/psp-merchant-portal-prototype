import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { muiTheme } from '@/theme/muiTheme';
import ToastContainer from '@/components/common/ToastContainer';
import PublicRoute from '@/routes/PublicRoute';
import ProtectedRoute from '@/routes/ProtectedRoute';
import OnboardingGuard from '@/routes/OnboardingGuard';
import ReviewGuard from '@/routes/ReviewGuard';
import LoginPage from '@/pages/LoginPage';
import RegistroPage from '@/pages/RegistroPage';
import ConfirmEmailPage from '@/pages/ConfirmEmailPage';
import PasswordResetRequestPage from '@/pages/PasswordResetRequestPage';
import PasswordResetConfirmPage from '@/pages/PasswordResetConfirmPage';
import ReviewPendingPage from '@/pages/ReviewPendingPage';
import HomePage from '@/pages/HomePage';
import TransactionsPayInPage from '@/pages/TransactionsPayInPage';
import TransactionsPayOutPage from '@/pages/TransactionsPayOutPage';
import CreatePayOutPage from '@/pages/CreatePayOutPage';
import SettlementsPage from '@/pages/SettlementsPage';
import UsersPage from '@/pages/UsersPage';
import RolesPage from '@/pages/RolesPage';
import AccountPage from '@/pages/AccountPage';
import SecurityCenterPage from '@/pages/SecurityCenterPage';
import ApiKeysPage from '@/pages/ApiKeysPage';
import WebhooksPage from '@/pages/WebhooksPage';
import ProfilePage from '@/pages/ProfilePage';
import OnboardingLayout from '@/components/onboarding/OnboardingLayout';
import Step1DatosEmpresa from '@/components/onboarding/Step1_DatosEmpresa';
import Step2DireccionComercial from '@/components/onboarding/Step2_DireccionComercial';
import Step3InformacionBancaria from '@/components/onboarding/Step3_InformacionBancaria';
import Step4Contactos from '@/components/onboarding/Step4_Contactos';
import Step5Documentos from '@/components/onboarding/Step5_Documentos';
import Step6EnviarRevision from '@/components/onboarding/Step6_EnviarRevision';
import AppLayout from '@/components/layout/AppLayout';
import TransactionsLayout from '@/components/transactions/TransactionsLayout';

export default function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/registro" element={<PublicRoute><RegistroPage /></PublicRoute>} />
          <Route path="/confirm-email/:token" element={<ConfirmEmailPage />} />
          <Route path="/password-reset" element={<PublicRoute><PasswordResetRequestPage /></PublicRoute>} />
          <Route path="/password-reset/:token" element={<PublicRoute><PasswordResetConfirmPage /></PublicRoute>} />

          <Route
            path="/onboarding"
            element={
              <OnboardingGuard>
                <OnboardingLayout />
              </OnboardingGuard>
            }
          >
            <Route index element={<Navigate to="step-1" replace />} />
            <Route path="step-1" element={<Step1DatosEmpresa />} />
            <Route path="step-2" element={<Step2DireccionComercial />} />
            <Route path="step-3" element={<Step3InformacionBancaria />} />
            <Route path="step-4" element={<Step4Contactos />} />
            <Route path="step-5" element={<Step5Documentos />} />
            <Route path="step-6" element={<Step6EnviarRevision />} />
          </Route>

          <Route
            path="/review-pending"
            element={
              <ReviewGuard>
                <ReviewPendingPage />
              </ReviewGuard>
            }
          />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<HomePage />} />

            <Route path="/transactions" element={<TransactionsLayout />}>
              <Route index element={<Navigate to="pay-in" replace />} />
              <Route path="pay-in" element={<TransactionsPayInPage />} />
              <Route path="pay-out" element={<TransactionsPayOutPage />} />
            </Route>
            <Route path="/transactions/pay-out/create" element={<CreatePayOutPage />} />

            <Route path="/settlements" element={<SettlementsPage />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/roles" element={<RolesPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/security" element={<SecurityCenterPage />} />
            <Route path="/api-keys" element={<ApiKeysPage />} />
            <Route path="/webhooks" element={<WebhooksPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
}
