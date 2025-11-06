import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, DollarSign, Shield, Target, Activity, GraduationCap, Calculator, Check, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { DisplayEquation } from '../components/MathEquation';

export default function CapitalStructure() {
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
    { id: 'debt-equity', label: 'Debt vs Equity', icon: BarChart3, color: 'from-green-600 to-emerald-600' },
    { id: 'mm-theory', label: 'M&M Theory', icon: TrendingUp, color: 'from-purple-600 to-pink-600' },
    { id: 'optimal', label: 'Optimal Structure', icon: Target, color: 'from-orange-600 to-red-600' },
    { id: 'tradeoff', label: 'Trade-off Theory', icon: Shield, color: 'from-teal-600 to-cyan-600' },
    { id: 'decisions', label: 'Financing Decisions', icon: DollarSign, color: 'from-indigo-600 to-purple-600' },
    { id: 'practice', label: 'Practice Problems', icon: GraduationCap, color: 'from-violet-600 to-purple-600' }
  ];

  // Practice Problems Data
  const practiceProblems = [
    {
      id: 1,
      title: 'Debt-to-Equity Ratio Calculation',
      difficulty: 'beginner',
      category: 'Capital Structure Metrics',
      type: 'Calculation',
      problem: 'A company has total debt of $500 million and total equity of $800 million. Calculate the debt-to-equity ratio and interpret what this means for the firm\'s capital structure.',
      hint: 'Debt-to-equity ratio is calculated by dividing total debt by total equity.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the values', detail: 'Total debt and total equity', latex: '\\begin{aligned} \\text{Total Debt} &= \\$500\\text{ million} \\\\ \\text{Total Equity} &= \\$800\\text{ million} \\end{aligned}' },
          { step: 2, description: 'Debt-to-equity ratio formula', detail: 'Ratio of debt to equity', latex: '\\text{D/E Ratio} = \\frac{\\text{Total Debt}}{\\text{Total Equity}}' },
          { step: 3, description: 'Calculate the ratio', detail: 'Substitute and compute', latex: '\\text{D/E Ratio} = \\frac{\\$500}{\\$800} = 0.625 = 62.5\\%' }
        ],
        answer: '0.625 or 62.5%',
        explanation: 'The debt-to-equity ratio is 0.625, meaning the company has $0.625 of debt for every dollar of equity. This indicates a moderately leveraged capital structure.'
      }
    },
    {
      id: 2,
      title: 'M&M Proposition I (No Taxes)',
      difficulty: 'intermediate',
      category: 'M&M Theory',
      type: 'Conceptual',
      problem: 'An unlevered firm has a market value of $10 million. According to M&M Proposition I (without taxes), if the firm takes on $4 million in debt to repurchase equity, what will be the new firm value?',
      hint: 'Under M&M Proposition I without taxes, capital structure changes do not affect firm value.',
      solution: {
        steps: [
          { step: 1, description: 'M&M Proposition I assumption', detail: 'No taxes, perfect markets', latex: 'V_L = V_U' },
          { step: 2, description: 'Identify the unlevered value', detail: 'Value before any debt', latex: 'V_U = \\$10\\text{ million}' },
          { step: 3, description: 'Apply M&M Proposition I', detail: 'Firm value is independent of capital structure', latex: 'V_L = V_U = \\$10\\text{ million}' }
        ],
        answer: '$10 million',
        explanation: 'According to M&M Proposition I (without taxes), the firm value remains $10 million. Capital structure decisions do not affect total firm value in perfect markets without taxes.'
      }
    },
    {
      id: 3,
      title: 'M&M Proposition II with Taxes',
      difficulty: 'intermediate',
      category: 'M&M Theory',
      type: 'Calculation',
      problem: 'An unlevered firm has a cost of equity of 12% and decides to add debt financing. The cost of debt is 6%, the debt-to-equity ratio is 0.5, and the corporate tax rate is 30%. Calculate the new cost of equity using M&M Proposition II with taxes.',
      hint: 'M&M Proposition II with taxes shows that cost of equity increases with leverage, but the tax shield reduces this effect.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Given values', latex: '\\begin{aligned} R_U &= 12\\% \\\\ R_D &= 6\\% \\\\ D/E &= 0.5 \\\\ T_C &= 30\\% \\end{aligned}' },
          { step: 2, description: 'M&M Proposition II formula (with taxes)', detail: 'Cost of equity with leverage', latex: 'R_E = R_U + (R_U - R_D) \\times \\frac{D}{E} \\times (1 - T_C)' },
          { step: 3, description: 'Calculate the leverage premium', detail: 'Additional risk from debt', latex: '(R_U - R_D) \\times \\frac{D}{E} \\times (1 - T_C) = (0.12 - 0.06) \\times 0.5 \\times (1 - 0.30) = 0.021' },
          { step: 4, description: 'Calculate the levered cost of equity', detail: 'Add to unlevered rate', latex: 'R_E = 0.12 + 0.021 = 0.141 = 14.1\\%' }
        ],
        answer: '14.1%',
        explanation: 'The levered cost of equity is 14.1%. The cost of equity increases with leverage, but the tax shield reduces the increase from what it would be without taxes.'
      }
    },
    {
      id: 4,
      title: 'Interest Tax Shield Valuation',
      difficulty: 'beginner',
      category: 'Tax Benefits',
      type: 'Calculation',
      problem: 'A company has $300 million in perpetual debt with an interest rate of 5%. The corporate tax rate is 25%. Calculate the present value of the interest tax shield.',
      hint: 'The tax shield is the tax rate times the debt amount for perpetual debt.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the values', detail: 'Debt and tax rate', latex: '\\begin{aligned} D &= \\$300\\text{ million} \\\\ T_C &= 25\\% \\end{aligned}' },
          { step: 2, description: 'Annual interest payment', detail: 'Calculate interest expense', latex: '\\text{Interest} = D \\times r_D = \\$300 \\times 0.05 = \\$15\\text{ million}' },
          { step: 3, description: 'Annual tax shield', detail: 'Tax savings from interest deduction', latex: '\\text{Tax Shield} = \\text{Interest} \\times T_C = \\$15 \\times 0.25 = \\$3.75\\text{ million}' },
          { step: 4, description: 'PV of perpetual tax shield', detail: 'For perpetual debt', latex: 'PV(\\text{Tax Shield}) = D \\times T_C = \\$300 \\times 0.25 = \\$75\\text{ million}' }
        ],
        answer: '$75 million',
        explanation: 'The present value of the interest tax shield is $75 million, representing the total value created by the tax deductibility of interest payments on perpetual debt.'
      }
    },
    {
      id: 5,
      title: 'Optimal Capital Structure Decision',
      difficulty: 'advanced',
      category: 'Optimal Structure',
      type: 'Application',
      problem: 'A firm is considering three capital structures: (A) 30% debt, WACC=9.5%; (B) 50% debt, WACC=8.8%; (C) 70% debt, WACC=9.2%. The firm expects perpetual EBIT of $100 million. Which capital structure maximizes firm value?',
      hint: 'Firm value is maximized when WACC is minimized. Use V = EBIT(1-T)/WACC. Assume tax rate of 30%.',
      solution: {
        steps: [
          { step: 1, description: 'Firm valuation formula', detail: 'Value using WACC approach', latex: 'V = \\frac{\\text{EBIT} \\times (1 - T_C)}{\\text{WACC}}' },
          { step: 2, description: 'Calculate value for Structure A', detail: '30% debt structure', latex: 'V_A = \\frac{\\$100 \\times (1 - 0.30)}{0.095} = \\frac{\\$70}{0.095} = \\$736.84\\text{ million}' },
          { step: 3, description: 'Calculate value for Structure B', detail: '50% debt structure', latex: 'V_B = \\frac{\\$100 \\times (1 - 0.30)}{0.088} = \\frac{\\$70}{0.088} = \\$795.45\\text{ million}' },
          { step: 4, description: 'Calculate value for Structure C', detail: '70% debt structure', latex: 'V_C = \\frac{\\$100 \\times (1 - 0.30)}{0.092} = \\frac{\\$70}{0.092} = \\$760.87\\text{ million}' },
          { step: 5, description: 'Compare and select', detail: 'Highest value wins', latex: '\\text{Max}(V_A, V_B, V_C) = V_B = \\$795.45\\text{ million}' }
        ],
        answer: 'Structure B (50% debt)',
        explanation: 'Structure B with 50% debt maximizes firm value at $795.45 million. This structure has the lowest WACC (8.8%), balancing the tax benefits of debt against financial distress costs.'
      }
    },
    {
      id: 6,
      title: 'Financial Leverage Impact on ROE',
      difficulty: 'advanced',
      category: 'Financial Leverage',
      type: 'Calculation',
      problem: 'A firm has total assets of $1,000 million, ROA of 10%, and interest rate on debt of 6%. Compare ROE under two scenarios: (A) No debt; (B) 40% debt financing. Assume no taxes for simplicity.',
      hint: 'ROE increases with leverage when ROA exceeds the cost of debt. Use ROE = ROA + (ROA - r_D) × (D/E).',
      solution: {
        steps: [
          { step: 1, description: 'Scenario A: No debt (all equity)', detail: 'Unlevered firm', latex: '\\begin{aligned} \\text{Assets} &= \\$1,000\\text{ million} \\\\ \\text{Equity} &= \\$1,000\\text{ million} \\\\ \\text{ROE}_A &= \\text{ROA} = 10\\% \\end{aligned}' },
          { step: 2, description: 'Scenario B: Calculate debt and equity', detail: '40% debt financing', latex: '\\begin{aligned} \\text{Debt} &= 0.40 \\times \\$1,000 = \\$400\\text{ million} \\\\ \\text{Equity} &= 0.60 \\times \\$1,000 = \\$600\\text{ million} \\\\ D/E &= 400/600 = 0.667 \\end{aligned}' },
          { step: 3, description: 'Calculate EBIT and interest', detail: 'Operating income and interest expense', latex: '\\begin{aligned} \\text{EBIT} &= \\text{ROA} \\times \\text{Assets} = 0.10 \\times \\$1,000 = \\$100\\text{ million} \\\\ \\text{Interest} &= 0.06 \\times \\$400 = \\$24\\text{ million} \\end{aligned}' },
          { step: 4, description: 'Calculate net income and ROE', detail: 'Return to equity holders', latex: '\\begin{aligned} \\text{Net Income} &= \\text{EBIT} - \\text{Interest} = \\$100 - \\$24 = \\$76\\text{ million} \\\\ \\text{ROE}_B &= \\frac{\\$76}{\\$600} = 0.1267 = 12.67\\% \\end{aligned}' },
          { step: 5, description: 'Leverage effect', detail: 'Increase in ROE from leverage', latex: '\\text{ROE increase} = 12.67\\% - 10\\% = 2.67\\%' }
        ],
        answer: 'ROE increases from 10% to 12.67%',
        explanation: 'Financial leverage increases ROE by 2.67 percentage points because ROA (10%) exceeds the cost of debt (6%). This demonstrates positive financial leverage, where debt financing amplifies returns to equity holders.'
      }
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Capital Structure Decisions</h1>
                <p className="text-sm text-gray-500">Optimal capital structure & financing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-4 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">Sections</h2>
              <nav className="space-y-1">
                {sections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button key={section.id} onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        isActive ? `bg-gradient-to-r ${section.color} text-white shadow-lg transform scale-105` : 'hover:bg-gray-100 text-gray-700'
                      }`}>
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                      <span className="font-semibold text-sm">{section.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="flex-1 min-w-0">
{activeSection === 'practice' ? (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Practice Problems</h2>
                      <p className="text-gray-600">Master capital structure concepts through hands-on problem solving</p>
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
            ) : (
              sections.map((section) => (
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
                        <p className="text-gray-700 text-center">Content coming soon...</p>
                      </div>
                    </div>
                  </div>
                )
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
