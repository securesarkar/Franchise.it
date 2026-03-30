import { useState, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { ThemeProvider } from './components/ThemeProvider';
import { ScrollProgress } from './components/ScrollProgress';
import { AnimatedBackground } from './components/animations/AnimatedBackground';
import { LoadingScreen } from './components/LoadingAnimation';
import { PageTransition } from './components/PageTransition';

// Pages
import LandingPage from './pages/LandingPage';
import EntryPage from './pages/EntryPage';
import SignupPage from './pages/SignupPage';
import RoleSelectionPage from './pages/RoleSelectionPage';
import LoginPage from './pages/LoginPage';
import FranchiseeOnboarding from './pages/FranchiseeOnboarding';
import FranchisorOnboarding from './pages/FranchisorOnboarding';
import MatchingPage from './pages/MatchingPage';
import Dashboard from './pages/Dashboard';
import MLMatchForm from './pages/MLMatchForm';

// ─── Protected Route ───────────────────────────────────────────────────────────
const ProtectedRoute = ({
  children,
  requiredRole,
}: {
  children: React.ReactNode;
  requiredRole?: 'franchisee' | 'franchisor';
}) => {
  const { isAuthenticated, currentUser } = useStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && currentUser?.role !== requiredRole)
    return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

// ─── App ───────────────────────────────────────────────────────────────────────
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const { isFirstVisit, isAuthenticated } = useStore();

  const handleLoadingComplete = useCallback(() => setIsLoading(false), []);

  const getInitialRoute = () => {
    if (isAuthenticated) return '/dashboard';
    if (isFirstVisit) return '/entry';   // ← first-time users go to entry page
    return '/home';
  };

  return (
    <ThemeProvider>
      <Router>
        <AnimatePresence mode="wait">
          {isLoading && (
            <LoadingScreen key="loading" onComplete={handleLoadingComplete} duration={2000} />
          )}
        </AnimatePresence>

        {!isLoading && (
          <div className="relative min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300">
            <ScrollProgress />
            <AnimatedBackground />

            <div className="relative z-10">
              <PageTransition>
                <Routes>
                  {/* ── Onboarding flow ──────────────────────────────── */}
                  <Route path="/entry"       element={<EntryPage />} />
                  <Route path="/signup"      element={<SignupPage />} />
                  <Route path="/signup/role" element={<RoleSelectionPage />} />
                  <Route path="/login"       element={<LoginPage />} />

                  {/* Legacy landing still accessible at /home */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/home" element={<LandingPage />} />  {/* keep for backward compat */}

                  {/* ── Post-auth onboarding ─────────────────────────── */}
                  <Route
                    path="/onboarding/franchisee"
                    element={
                      <ProtectedRoute requiredRole="franchisee">
                        <FranchiseeOnboarding />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/onboarding/franchisor"
                    element={
                      <ProtectedRoute requiredRole="franchisor">
                        <FranchisorOnboarding />
                      </ProtectedRoute>
                    }
                  />

                  {/* ── App routes ───────────────────────────────────── */}
                  <Route
                    path="/matching"
                    element={
                      <ProtectedRoute>
                        <MatchingPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ml-match/:matchId"
                    element={
                      <ProtectedRoute>
                        <MLMatchForm />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* ── Fallback ─────────────────────────────────────── */}
                  <Route path="*" element={<Navigate to={getInitialRoute()} replace />} />
                </Routes>
              </PageTransition>
            </div>
          </div>
        )}
      </Router>
    </ThemeProvider>
  );
}

export default App;