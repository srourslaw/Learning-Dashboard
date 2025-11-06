import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  Target,
  BarChart3,
  LineChart as LineChartIcon,
  Shield,
  Activity,
  GraduationCap,
  Calculator,
  Check,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DisplayEquation } from '../components/MathEquation';

export default function CAPM() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  // Practice Problems State
  const [expandedProblems, setExpandedProblems] = useState({});
  const [completedProblems, setCompletedProblems] = useState({});
  const [shownHints, setShownHints] = useState({});
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const sections = [
    { id: 'overview', label: 'Overview', icon: Activity, color: 'from-blue-600 to-indigo-600' },
    { id: 'capm-model', label: 'CAPM Model', icon: TrendingUp, color: 'from-green-600 to-emerald-600' },
    { id: 'beta', label: 'Beta Calculation', icon: BarChart3, color: 'from-purple-600 to-pink-600' },
    { id: 'sml', label: 'Security Market Line', icon: LineChartIcon, color: 'from-orange-600 to-red-600' },
    { id: 'risk-return', label: 'Risk-Return Tradeoff', icon: Shield, color: 'from-teal-600 to-cyan-600' },
    { id: 'applications', label: 'Applications', icon: Target, color: 'from-indigo-600 to-purple-600' },
    { id: 'practice', label: 'Practice Problems', icon: GraduationCap, color: 'from-violet-600 to-purple-600' }
  ];

  // Practice Problems Data
  const practiceProblems = [
    {
      id: 1,
      title: 'Basic CAPM Calculation',
      difficulty: 'beginner',
      category: 'CAPM Model',
      type: 'Calculation',
      problem: 'A stock has a beta of 1.3. The risk-free rate is 4% and the expected market return is 12%. Calculate the expected return of the stock using CAPM.',
      hint: 'Use the CAPM formula: E(R) = Rf + β(E(Rm) - Rf)',
      solution: {
        steps: [
          { step: 1, description: 'Identify the given values', detail: 'Extract all parameters from the problem', latex: '\\begin{aligned} \\beta &= 1.3 \\\\ R_f &= 4\\% = 0.04 \\\\ E(R_m) &= 12\\% = 0.12 \\end{aligned}' },
          { step: 2, description: 'Write the CAPM formula', detail: 'Capital Asset Pricing Model equation', latex: 'E(R_i) = R_f + \\beta_i[E(R_m) - R_f]' },
          { step: 3, description: 'Calculate market risk premium', detail: 'Expected market return minus risk-free rate', latex: 'E(R_m) - R_f = 0.12 - 0.04 = 0.08 = 8\\%' },
          { step: 4, description: 'Apply CAPM formula', detail: 'Substitute all values', latex: 'E(R_i) = 0.04 + 1.3(0.08) = 0.04 + 0.104 = 0.144 = 14.4\\%' }
        ],
        answer: '14.4%',
        explanation: 'The expected return is 14.4%, which reflects the stock\'s higher systematic risk (β > 1) relative to the market.'
      }
    },
    {
      id: 2,
      title: 'Beta Calculation from Returns',
      difficulty: 'intermediate',
      category: 'Beta Calculation',
      type: 'Calculation',
      problem: 'A stock has a covariance with the market of 0.024 and the market variance is 0.016. Calculate the stock\'s beta.',
      hint: 'Beta is calculated as the covariance divided by market variance.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the given values', detail: 'Covariance and variance', latex: '\\begin{aligned} \\text{Cov}(R_i, R_m) &= 0.024 \\\\ \\sigma_m^2 &= 0.016 \\end{aligned}' },
          { step: 2, description: 'Beta formula', detail: 'Ratio of covariance to market variance', latex: '\\beta_i = \\frac{\\text{Cov}(R_i, R_m)}{\\sigma_m^2}' },
          { step: 3, description: 'Calculate beta', detail: 'Substitute and solve', latex: '\\beta_i = \\frac{0.024}{0.016} = 1.5' }
        ],
        answer: '1.5',
        explanation: 'The stock has a beta of 1.5, indicating it is 50% more volatile than the market.'
      }
    },
    {
      id: 3,
      title: 'Security Market Line Position',
      difficulty: 'intermediate',
      category: 'SML',
      type: 'Application',
      problem: 'Stock A has β=0.8 and an expected return of 11%. The risk-free rate is 5% and the market return is 13%. Is the stock overvalued or undervalued according to the SML?',
      hint: 'Compare the actual expected return to the required return from CAPM.',
      solution: {
        steps: [
          { step: 1, description: 'Given information', detail: 'Stock and market parameters', latex: '\\begin{aligned} \\beta_A &= 0.8, \\quad E(R_A) = 11\\% \\\\ R_f &= 5\\%, \\quad E(R_m) = 13\\% \\end{aligned}' },
          { step: 2, description: 'Calculate required return using CAPM', detail: 'What the stock should return', latex: 'E(R_A)_{\\text{required}} = 0.05 + 0.8(0.13 - 0.05) = 0.05 + 0.064 = 0.114 = 11.4\\%' },
          { step: 3, description: 'Compare actual vs required return', detail: 'Determine if stock is fairly priced', latex: '\\begin{aligned} E(R_A)_{\\text{actual}} &= 11\\% \\\\ E(R_A)_{\\text{required}} &= 11.4\\% \\\\ \\text{Difference} &= 11\\% - 11.4\\% = -0.4\\% \\end{aligned}' },
          { step: 4, description: 'Conclusion', detail: 'Stock position relative to SML', latex: '\\text{Actual} < \\text{Required} \\Rightarrow \\text{Stock is OVERVALUED}' }
        ],
        answer: 'Overvalued',
        explanation: 'The stock is overvalued because its expected return (11%) is less than the required return (11.4%). It plots below the SML.'
      }
    },
    {
      id: 4,
      title: 'Portfolio Beta with Multiple Stocks',
      difficulty: 'intermediate',
      category: 'Beta Calculation',
      type: 'Calculation',
      problem: 'Calculate portfolio beta for: Stock A (40%, β=1.2), Stock B (35%, β=0.9), Stock C (25%, β=1.5).',
      hint: 'Portfolio beta is the weighted average of individual betas.',
      solution: {
        steps: [
          { step: 1, description: 'Identify weights and betas', detail: 'For each stock in portfolio', latex: '\\begin{aligned} w_A = 0.40, & \\quad \\beta_A = 1.2 \\\\ w_B = 0.35, & \\quad \\beta_B = 0.9 \\\\ w_C = 0.25, & \\quad \\beta_C = 1.5 \\end{aligned}' },
          { step: 2, description: 'Portfolio beta formula', detail: 'Weighted average', latex: '\\beta_p = w_A\\beta_A + w_B\\beta_B + w_C\\beta_C' },
          { step: 3, description: 'Calculate each component', detail: 'Multiply weights by betas', latex: '\\begin{aligned} w_A\\beta_A &= 0.40 \\times 1.2 = 0.48 \\\\ w_B\\beta_B &= 0.35 \\times 0.9 = 0.315 \\\\ w_C\\beta_C &= 0.25 \\times 1.5 = 0.375 \\end{aligned}' },
          { step: 4, description: 'Sum all components', detail: 'Total portfolio beta', latex: '\\beta_p = 0.48 + 0.315 + 0.375 = 1.17' }
        ],
        answer: '1.17',
        explanation: 'The portfolio beta is 1.17, meaning the portfolio is 17% more volatile than the market.'
      }
    },
    {
      id: 5,
      title: 'Determining Risk-Free Rate',
      difficulty: 'advanced',
      category: 'CAPM Model',
      type: 'Application',
      problem: 'A stock with β=1.5 has an expected return of 18%. The market expected return is 14%. What is the implied risk-free rate?',
      hint: 'Rearrange the CAPM formula to solve for Rf.',
      solution: {
        steps: [
          { step: 1, description: 'Given information', detail: 'Known values', latex: '\\begin{aligned} \\beta &= 1.5 \\\\ E(R_i) &= 18\\% = 0.18 \\\\ E(R_m) &= 14\\% = 0.14 \\end{aligned}' },
          { step: 2, description: 'CAPM formula', detail: 'Standard CAPM equation', latex: 'E(R_i) = R_f + \\beta[E(R_m) - R_f]' },
          { step: 3, description: 'Expand and rearrange', detail: 'Solve for risk-free rate', latex: '\\begin{aligned} 0.18 &= R_f + 1.5(0.14 - R_f) \\\\ 0.18 &= R_f + 0.21 - 1.5R_f \\\\ 0.18 &= 0.21 - 0.5R_f \\end{aligned}' },
          { step: 4, description: 'Solve for Rf', detail: 'Isolate and calculate', latex: '\\begin{aligned} 0.5R_f &= 0.21 - 0.18 = 0.03 \\\\ R_f &= \\frac{0.03}{0.5} = 0.06 = 6\\% \\end{aligned}' }
        ],
        answer: '6%',
        explanation: 'The implied risk-free rate is 6%, which is consistent with the given stock return and market parameters.'
      }
    },
    {
      id: 6,
      title: 'Market Risk Premium Analysis',
      difficulty: 'beginner',
      category: 'Risk-Return',
      type: 'Conceptual',
      problem: 'If the risk-free rate is 3.5% and the market return is 11%, calculate the market risk premium. What does this represent?',
      hint: 'Market risk premium is the excess return of the market over the risk-free rate.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the rates', detail: 'Risk-free and market returns', latex: '\\begin{aligned} R_f &= 3.5\\% = 0.035 \\\\ E(R_m) &= 11\\% = 0.11 \\end{aligned}' },
          { step: 2, description: 'Market risk premium formula', detail: 'Excess return over risk-free rate', latex: 'MRP = E(R_m) - R_f' },
          { step: 3, description: 'Calculate MRP', detail: 'Subtract risk-free rate', latex: 'MRP = 0.11 - 0.035 = 0.075 = 7.5\\%' }
        ],
        answer: '7.5%',
        explanation: 'The market risk premium is 7.5%, representing the additional return investors demand for taking on market risk instead of investing in risk-free assets.'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Capital Asset Pricing Model</h1>
                <p className="text-sm text-gray-500">Risk-return relationships in capital markets</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-4 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">Sections</h2>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        isActive
                          ? `bg-gradient-to-r ${section.color} text-white shadow-lg transform scale-105`
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      <span className="font-semibold text-sm">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {sections.filter(s => s.id !== 'practice').map((section) => (
              activeSection === section.id && (
                <div key={section.id} className="space-y-6 animate-fadeIn">
                  <div className="bg-white rounded-2xl shadow-2xl p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <div className={`p-3 bg-gradient-to-r ${section.color} rounded-xl`}>
                        <section.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-gray-800">{section.label}</h2>
                        <p className="text-gray-600">Content section</p>
                      </div>
                    </div>

                    <div className={`bg-gradient-to-r ${section.color.replace('600', '50').replace('to-', 'to-')} rounded-xl p-6 border-2 ${section.color.split(' ')[0].replace('from-', 'border-')}`}>
                      <p className="text-gray-700 text-center">
                        Content coming soon...
                      </p>
                    </div>
                  </div>
                </div>
              )
            ))}

            {/* Practice Problems Section */}
            {activeSection === 'practice' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Practice Problems</h2>
                      <p className="text-gray-600">Master CAPM concepts through hands-on problem solving</p>
                    </div>
                  </div>

                  {/* Filters */}
                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
                      >
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none"
                      >
                        <option value="all">All Categories</option>
                        {[...new Set(practiceProblems.map(p => p.category))].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Problems Grid */}
                  <div className="space-y-6">
                    {practiceProblems
                      .filter(p => (selectedDifficulty === 'all' || p.difficulty === selectedDifficulty) &&
                                   (selectedCategory === 'all' || p.category === selectedCategory))
                      .map(problem => {
                        const isExpanded = expandedProblems[problem.id];
                        const isCompleted = completedProblems[problem.id];
                        const hintShown = shownHints[problem.id];

                        return (
                          <div
                            key={problem.id}
                            className={`border-2 rounded-2xl overflow-hidden transition-all ${
                              isCompleted
                                ? 'border-green-400 bg-green-50'
                                : isExpanded
                                ? 'border-violet-400 bg-violet-50'
                                : 'border-gray-200 bg-white hover:border-violet-300'
                            }`}
                          >
                            {/* Problem Header */}
                            <div className="p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold text-gray-800">{problem.title}</h3>
                                    {isCompleted && (
                                      <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                                        <Check className="w-3 h-3" />
                                        Completed
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                      problem.difficulty === 'beginner' ? 'bg-green-100 text-green-700' :
                                      problem.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                                      'bg-red-100 text-red-700'
                                    }`}>
                                      {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                    </span>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                      {problem.category}
                                    </span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                                      {problem.type}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Problem Statement */}
                              <div className="bg-white rounded-xl p-5 border-2 border-gray-200 mb-4">
                                <p className="text-gray-700 leading-relaxed">{problem.problem}</p>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => setShownHints(prev => ({ ...prev, [problem.id]: !hintShown }))}
                                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors font-semibold text-sm"
                                >
                                  <Info className="w-4 h-4" />
                                  {hintShown ? 'Hide Hint' : 'Show Hint'}
                                </button>
                                <button
                                  onClick={() => setExpandedProblems(prev => ({ ...prev, [problem.id]: !isExpanded }))}
                                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-semibold text-sm"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-4 h-4" />
                                      Hide Solution
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-4 h-4" />
                                      Show Solution
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => setCompletedProblems(prev => ({ ...prev, [problem.id]: !isCompleted }))}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold text-sm ml-auto ${
                                    isCompleted
                                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                                  }`}
                                >
                                  <Check className="w-4 h-4" />
                                  {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                                </button>
                              </div>

                              {/* Hint Display */}
                              {hintShown && (
                                <div className="mt-4 bg-amber-50 border-2 border-amber-300 rounded-xl p-4 animate-fadeIn">
                                  <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div>
                                      <h4 className="font-bold text-amber-900 mb-1">Hint</h4>
                                      <p className="text-amber-800 text-sm">{problem.hint}</p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Solution Display */}
                            {isExpanded && (
                              <div className="bg-gradient-to-br from-violet-50 to-purple-50 p-6 border-t-2 border-violet-200 animate-fadeIn">
                                <div className="mb-6">
                                  <h4 className="text-lg font-bold text-violet-900 mb-4 flex items-center gap-2">
                                    <Calculator className="w-5 h-5" />
                                    Step-by-Step Solution
                                  </h4>

                                  <div className="space-y-4">
                                    {problem.solution.steps.map((step) => (
                                      <div key={step.step} className="bg-white rounded-xl p-5 border-2 border-violet-200">
                                        <div className="flex items-start gap-4">
                                          <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                            {step.step}
                                          </div>
                                          <div className="flex-1">
                                            <h5 className="font-bold text-gray-800 mb-2">{step.description}</h5>
                                            <p className="text-gray-700 mb-2">{step.detail}</p>
                                            {step.latex && (
                                              <div className="bg-violet-50 rounded-lg p-3 border border-violet-200">
                                                <DisplayEquation>{step.latex}</DisplayEquation>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                {/* Final Answer */}
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-5 text-white">
                                  <div className="flex items-center gap-3 mb-2">
                                    <Check className="w-6 h-6" />
                                    <h4 className="text-xl font-bold">Final Answer</h4>
                                  </div>
                                  <p className="text-2xl font-bold mb-2">{problem.solution.answer}</p>
                                  <p className="text-green-50">{problem.solution.explanation}</p>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* No Results Message */}
                  {practiceProblems.filter(p =>
                    (selectedDifficulty === 'all' || p.difficulty === selectedDifficulty) &&
                    (selectedCategory === 'all' || p.category === selectedCategory)
                  ).length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <GraduationCap className="w-16 h-16 mx-auto" />
                      </div>
                      <p className="text-gray-600 font-semibold">No problems match your filters</p>
                      <p className="text-gray-500 text-sm">Try adjusting your difficulty or category filters</p>
                    </div>
                  )}
                </div>

                {/* Progress Summary */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6">Your Progress</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
                      <div className="text-4xl font-bold mb-2">
                        {Object.keys(completedProblems).filter(k => completedProblems[k]).length}
                      </div>
                      <div className="text-violet-100">Problems Completed</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
                      <div className="text-4xl font-bold mb-2">{practiceProblems.length}</div>
                      <div className="text-violet-100">Total Problems</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
                      <div className="text-4xl font-bold mb-2">
                        {Math.round((Object.keys(completedProblems).filter(k => completedProblems[k]).length / practiceProblems.length) * 100)}%
                      </div>
                      <div className="text-violet-100">Completion Rate</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
