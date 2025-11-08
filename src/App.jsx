import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';

// Import critical pages immediately (needed for initial render)
import Login from './pages/Login';
import Signup from './pages/Signup';
import Subscription from './pages/Subscription';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';

// Lazy load course pages (code splitting for better performance)
const TimeValueOfMoney = lazy(() => import('./pages/TimeValueOfMoney'));
const PortfolioTheory = lazy(() => import('./pages/PortfolioTheory'));
const MathsRefresher = lazy(() => import('./pages/MathsRefresher'));
const BondValuation = lazy(() => import('./pages/BondValuation'));
const StockValuation = lazy(() => import('./pages/StockValuation'));
const CAPM = lazy(() => import('./pages/CAPM'));
const ProjectEvaluation = lazy(() => import('./pages/ProjectEvaluation'));
const PortfolioDiversification = lazy(() => import('./pages/PortfolioDiversification'));
const CapitalStructure = lazy(() => import('./pages/CapitalStructure'));
const WACC = lazy(() => import('./pages/WACC'));
const RiskManagement = lazy(() => import('./pages/RiskManagement'));
const Derivatives = lazy(() => import('./pages/Derivatives'));
const Statistics = lazy(() => import('./pages/Statistics'));
const StockDataAnalyzer = lazy(() => import('./pages/StockDataAnalyzer'));

// Helper component to wrap lazy-loaded pages with error boundary and suspense
function LazyRoute({ children }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner message="Loading course content..." />}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ErrorBoundary>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* Protected Routes */}
            <Route
              path="/subscription"
              element={
                <ProtectedRoute>
                  <Subscription />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute requireSubscription={true}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />

            {/* Course Routes - All wrapped with LazyRoute for code splitting */}
            <Route
              path="/course/time-value-of-money"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <TimeValueOfMoney />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/portfolio-theory"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <PortfolioTheory />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/maths-refresher"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <MathsRefresher />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/bond-valuation"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <BondValuation />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/stock-valuation"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <StockValuation />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/capm"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <CAPM />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/project-evaluation"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <ProjectEvaluation />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/portfolio-diversification"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <PortfolioDiversification />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/capital-structure"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <CapitalStructure />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/wacc"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <WACC />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/risk-management"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <RiskManagement />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/derivatives"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <Derivatives />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/course/statistics"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <Statistics />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            <Route
              path="/tools/stock-data-analyzer"
              element={
                <LazyRoute>
                  <ProtectedRoute requireSubscription={true}>
                    <StockDataAnalyzer />
                  </ProtectedRoute>
                </LazyRoute>
              }
            />

            {/* Default Route */}
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </ErrorBoundary>
      </AuthProvider>
    </Router>
  );
}

export default App;
