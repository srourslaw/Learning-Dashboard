import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import Subscription from './pages/Subscription';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TimeValueOfMoney from './pages/TimeValueOfMoney';
import PortfolioTheory from './pages/PortfolioTheory';
import MathsRefresher from './pages/MathsRefresher';
import BondValuation from './pages/BondValuation';
import StockValuation from './pages/StockValuation';
import CAPM from './pages/CAPM';
import ProjectEvaluation from './pages/ProjectEvaluation';
import PortfolioDiversification from './pages/PortfolioDiversification';
import CapitalStructure from './pages/CapitalStructure';
import WACC from './pages/WACC';
import RiskManagement from './pages/RiskManagement';
import Derivatives from './pages/Derivatives';
import Statistics from './pages/Statistics';

function App() {
  return (
    <Router>
      <AuthProvider>
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

          {/* Course Routes */}
          <Route
            path="/course/time-value-of-money"
            element={
              <ProtectedRoute requireSubscription={true}>
                <TimeValueOfMoney />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/portfolio-theory"
            element={
              <ProtectedRoute requireSubscription={true}>
                <PortfolioTheory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/maths-refresher"
            element={
              <ProtectedRoute requireSubscription={true}>
                <MathsRefresher />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/bond-valuation"
            element={
              <ProtectedRoute requireSubscription={true}>
                <BondValuation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/stock-valuation"
            element={
              <ProtectedRoute requireSubscription={true}>
                <StockValuation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/capm"
            element={
              <ProtectedRoute requireSubscription={true}>
                <CAPM />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/project-evaluation"
            element={
              <ProtectedRoute requireSubscription={true}>
                <ProjectEvaluation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/portfolio-diversification"
            element={
              <ProtectedRoute requireSubscription={true}>
                <PortfolioDiversification />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/capital-structure"
            element={
              <ProtectedRoute requireSubscription={true}>
                <CapitalStructure />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/wacc"
            element={
              <ProtectedRoute requireSubscription={true}>
                <WACC />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/risk-management"
            element={
              <ProtectedRoute requireSubscription={true}>
                <RiskManagement />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/derivatives"
            element={
              <ProtectedRoute requireSubscription={true}>
                <Derivatives />
              </ProtectedRoute>
            }
          />

          <Route
            path="/course/statistics"
            element={
              <ProtectedRoute requireSubscription={true}>
                <Statistics />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
