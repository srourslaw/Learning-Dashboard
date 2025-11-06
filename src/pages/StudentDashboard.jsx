import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LogOut,
  BookOpen,
  Calculator,
  TrendingUp,
  BarChart3,
  DollarSign,
  User,
  Clock,
  PieChart,
  Target,
  Shield,
  LineChart,
  Briefcase,
  Activity,
  Award,
  CheckCircle,
  Lock
} from 'lucide-react';

export default function StudentDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const courseModules = [
    {
      week: 1,
      title: 'Maths Refresher Workshop',
      description: 'Refresher on key mathematical concepts used throughout this course',
      topics: ['Algebra', 'Exponentials', 'Logarithms', 'Basic Calculus'],
      status: 'available',
      icon: Calculator,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      link: '/course/maths-refresher'
    },
    {
      week: 1,
      title: 'Time Value of Money',
      description: 'Master the fundamental concept of money\'s value across time periods',
      topics: ['Simple Interest', 'Compound Interest', 'Present Value', 'Future Value', 'Annuities', 'Perpetuities'],
      status: 'available',
      icon: DollarSign,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      link: '/course/time-value-of-money',
      duration: '4 hours'
    },
    {
      week: 1,
      title: 'Bond Valuation',
      description: 'Learn how to value fixed income securities and understand debt markets',
      topics: ['Bond Pricing', 'Yield to Maturity', 'Duration', 'Convexity', 'Credit Risk'],
      status: 'available',
      icon: Award,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      link: '/course/bond-valuation'
    },
    {
      week: 2,
      title: 'Stock Valuation',
      description: 'Understand equity valuation methods and stock market fundamentals',
      topics: ['Dividend Discount Model', 'P/E Ratios', 'Free Cash Flow', 'Comparable Analysis'],
      status: 'available',
      icon: TrendingUp,
      color: 'from-indigo-500 to-blue-500',
      bgColor: 'from-indigo-50 to-blue-50',
      link: '/course/stock-valuation'
    },
    {
      week: 2,
      title: 'Capital Asset Pricing Model',
      description: 'Explore risk-return relationships and portfolio theory',
      topics: ['CAPM', 'Beta', 'Market Risk Premium', 'Security Market Line', 'Systematic Risk'],
      status: 'available',
      icon: LineChart,
      color: 'from-orange-500 to-red-500',
      bgColor: 'from-orange-50 to-red-50',
      link: '/course/capm'
    },
    {
      week: 2,
      title: 'Portfolio Theory',
      description: 'Learn how to construct and optimize investment portfolios',
      topics: ['Diversification', 'Efficient Frontier', 'Sharpe Ratio', 'Asset Allocation'],
      status: 'available',
      icon: PieChart,
      color: 'from-teal-500 to-green-500',
      bgColor: 'from-teal-50 to-green-50',
      link: '/course/portfolio-theory'
    },
    {
      week: 3,
      title: 'Project Evaluation (NPV & IRR)',
      description: 'Master capital budgeting techniques for investment decisions',
      topics: ['Net Present Value', 'Internal Rate of Return', 'Payback Period', 'Profitability Index'],
      status: 'available',
      icon: Target,
      color: 'from-violet-500 to-purple-500',
      bgColor: 'from-violet-50 to-purple-50',
      link: '/course/project-evaluation'
    },
    {
      week: 3,
      title: 'Portfolio Diversification',
      description: 'Deep dive into risk management through portfolio diversification',
      topics: ['Correlation', 'Covariance', 'Risk Reduction', 'Portfolio Variance'],
      status: 'available',
      icon: Activity,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'from-pink-50 to-rose-50',
      link: '/course/portfolio-diversification'
    },
    {
      week: 3,
      title: 'Capital Structure Decisions',
      description: 'Examine how companies set their optimal capital structure',
      topics: ['Debt vs Equity', 'Modigliani-Miller', 'Tax Shields', 'Financial Leverage'],
      status: 'available',
      icon: BarChart3,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'from-amber-50 to-orange-50',
      link: '/course/capital-structure'
    },
    {
      week: 4,
      title: 'WACC & Firm Valuation',
      description: 'Calculate weighted average cost of capital and value firms',
      topics: ['WACC Calculation', 'Cost of Equity', 'Cost of Debt', 'Enterprise Value'],
      status: 'available',
      icon: Briefcase,
      color: 'from-cyan-500 to-blue-500',
      bgColor: 'from-cyan-50 to-blue-50',
      link: '/course/wacc'
    },
    {
      week: 4,
      title: 'Risk Management & Hedging',
      description: 'Learn strategies companies use to manage and hedge risk',
      topics: ['Hedging Strategies', 'Currency Risk', 'Interest Rate Risk', 'Commodity Risk'],
      status: 'available',
      icon: Shield,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'from-emerald-50 to-teal-50',
      link: '/course/risk-management'
    },
    {
      week: 4,
      title: 'Derivatives & Options',
      description: 'Understand derivative securities and option pricing',
      topics: ['Futures', 'Options', 'Black-Scholes', 'Put-Call Parity', 'Greeks'],
      status: 'available',
      icon: Activity,
      color: 'from-red-500 to-pink-500',
      bgColor: 'from-red-50 to-pink-50',
      link: '/course/derivatives'
    },
    {
      week: 5,
      title: 'Statistical Review & Risk',
      description: 'Master statistical concepts for financial analysis',
      topics: ['Returns', 'Standard Deviation', 'Correlation', 'Covariance', 'Probability Distributions'],
      status: 'available',
      icon: BarChart3,
      color: 'from-indigo-500 to-violet-500',
      bgColor: 'from-indigo-50 to-violet-50',
      link: '/course/statistics'
    }
  ];

  const completedCount = courseModules.filter(m => m.status === 'completed').length;
  const availableCount = courseModules.filter(m => m.status === 'available').length;
  const totalModules = courseModules.length;
  const progressPercentage = Math.round((completedCount / totalModules) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Learning Dashboard</h1>
                <p className="text-xs text-gray-600">Financial Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-gray-800">{currentUser?.name}</p>
                <p className="text-xs text-gray-600">{currentUser?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold mb-2">Welcome back, {currentUser?.name}!</h2>
              <p className="text-indigo-100 text-lg">Continue your journey in Financial Management</p>
            </div>
            <div className="bg-white/20 backdrop-blur rounded-xl p-4 text-center">
              <p className="text-sm text-indigo-100 mb-1">Overall Progress</p>
              <p className="text-4xl font-bold">{progressPercentage}%</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Completed</p>
            </div>
            <p className="text-3xl font-bold text-gray-800">{completedCount}</p>
            <p className="text-xs text-gray-500 mt-1">Modules</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Available</p>
            </div>
            <p className="text-3xl font-bold text-gray-800">{availableCount}</p>
            <p className="text-xs text-gray-500 mt-1">To Start</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Total</p>
            </div>
            <p className="text-3xl font-bold text-gray-800">{totalModules}</p>
            <p className="text-xs text-gray-500 mt-1">Modules</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <User className="w-5 h-5 text-amber-600" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Status</p>
            </div>
            <p className="text-lg font-bold text-green-600">Active</p>
            <p className="text-xs text-gray-500 mt-1">Subscription</p>
          </div>
        </div>

        {/* Course Modules Grid */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Course Modules</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1 ml-4">
                <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                <span>Coming Soon</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courseModules.map((module, index) => {
              const Icon = module.icon;
              const isLocked = module.status === 'locked';
              const isCompleted = module.status === 'completed';

              return (
                <div
                  key={index}
                  className={`group relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
                    isLocked
                      ? 'opacity-75 hover:opacity-90'
                      : 'hover:shadow-2xl hover:scale-105'
                  }`}
                >
                  {/* Header with gradient */}
                  <div className={`h-32 bg-gradient-to-br ${module.color} p-6 relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 opacity-20">
                      <Icon className="w-32 h-32 transform rotate-12" />
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-start justify-between mb-2">
                        <div className="p-2 bg-white/20 backdrop-blur rounded-lg">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        {isLocked ? (
                          <Lock className="w-5 h-5 text-white/80" />
                        ) : isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-white" />
                        ) : (
                          <Clock className="w-5 h-5 text-white/80" />
                        )}
                      </div>
                      <p className="text-xs font-semibold text-white/90">Module {module.week}</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                      {module.title}
                    </h4>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {module.description}
                    </p>

                    {/* Topics */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">Topics Covered</p>
                      <div className="flex flex-wrap gap-1">
                        {module.topics.slice(0, 3).map((topic, idx) => (
                          <span
                            key={idx}
                            className={`px-2 py-1 rounded-full text-xs ${
                              isLocked
                                ? 'bg-gray-100 text-gray-600'
                                : `bg-gradient-to-r ${module.bgColor} text-gray-700 font-medium`
                            }`}
                          >
                            {topic}
                          </span>
                        ))}
                        {module.topics.length > 3 && (
                          <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
                            +{module.topics.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Action Button */}
                    {!isLocked ? (
                      <Link
                        to={module.link}
                        className={`w-full flex items-center justify-center gap-2 bg-gradient-to-r ${module.color} text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all`}
                      >
                        <BookOpen className="w-4 h-4" />
                        {isCompleted ? 'Review Module' : 'Start Learning'}
                      </Link>
                    ) : (
                      <div className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-500 px-4 py-3 rounded-lg font-semibold cursor-not-allowed">
                        <Lock className="w-4 h-4" />
                        Coming Soon
                      </div>
                    )}

                    {module.duration && !isLocked && (
                      <p className="text-xs text-gray-500 mt-2 text-center">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {module.duration}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  {!isLocked && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full shadow-lg">
                        Available Now
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Learning Path Info */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-indigo-600" />
            Your Learning Journey
          </h3>
          <div className="grid md:grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((week) => (
              <div key={week} className="text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full flex items-center justify-center font-bold text-white ${
                  week === 1 ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-300'
                }`}>
                  {week}
                </div>
                <p className="text-sm font-semibold text-gray-700">Module {week}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {courseModules.filter(m => m.week === week).length} modules
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
