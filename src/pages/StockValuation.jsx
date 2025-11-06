import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  DollarSign,
  BarChart3,
  Calculator,
  PieChart,
  Activity,
  GraduationCap,
  Check,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DisplayEquation } from '../components/MathEquation';

export default function StockValuation() {
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
    { id: 'ddm', label: 'Dividend Discount Model', icon: DollarSign, color: 'from-green-600 to-emerald-600' },
    { id: 'dcf', label: 'DCF Valuation', icon: Calculator, color: 'from-purple-600 to-pink-600' },
    { id: 'multiples', label: 'Valuation Multiples', icon: BarChart3, color: 'from-orange-600 to-red-600' },
    { id: 'growth', label: 'Growth Models', icon: TrendingUp, color: 'from-teal-600 to-cyan-600' },
    { id: 'comparison', label: 'Comparative Analysis', icon: PieChart, color: 'from-indigo-600 to-purple-600' },
    { id: 'practice', label: 'Practice Problems', icon: GraduationCap, color: 'from-violet-600 to-purple-600' }
  ];

  // Practice Problems Data
  const practiceProblems = [
    {
      id: 1,
      title: 'Zero-Growth Dividend Discount Model',
      difficulty: 'beginner',
      category: 'DDM',
      type: 'Calculation',
      problem: 'A stock pays a constant annual dividend of $3.50 indefinitely. If the required return is 10%, what is the stock\'s intrinsic value?',
      hint: 'For zero-growth (perpetuity), value = Dividend / Required Return.',
      solution: {
        steps: [
          { step: 1, description: 'Identify given information', detail: 'Constant dividend and required return', latex: '\\begin{aligned} D &= \\$3.50 \\\\ r &= 10\\% = 0.10 \\\\ g &= 0\\% \\text{ (no growth)} \\end{aligned}' },
          { step: 2, description: 'Zero-growth DDM formula', detail: 'Perpetuity formula', latex: 'P_0 = \\frac{D}{r}' },
          { step: 3, description: 'Calculate stock value', detail: 'Substitute values', latex: 'P_0 = \\frac{3.50}{0.10} = \\$35.00' }
        ],
        answer: '$35.00',
        explanation: 'The stock is worth $35.00, representing the present value of receiving $3.50 per year forever at a 10% discount rate.'
      }
    },
    {
      id: 2,
      title: 'Gordon Growth Model',
      difficulty: 'intermediate',
      category: 'DDM',
      type: 'Calculation',
      problem: 'A company just paid a dividend of $2.00 (D₀). Dividends are expected to grow at 5% annually forever. If the required return is 12%, what is the stock price?',
      hint: 'Use the Gordon Growth Model: P₀ = D₁/(r-g), where D₁ = D₀(1+g).',
      solution: {
        steps: [
          { step: 1, description: 'Identify parameters', detail: 'Current dividend and growth rate', latex: '\\begin{aligned} D_0 &= \\$2.00 \\\\ g &= 5\\% = 0.05 \\\\ r &= 12\\% = 0.12 \\end{aligned}' },
          { step: 2, description: 'Calculate next dividend', detail: 'Project D₁', latex: 'D_1 = D_0(1 + g) = 2.00(1.05) = \\$2.10' },
          { step: 3, description: 'Gordon Growth Model formula', detail: 'Constant growth DDM', latex: 'P_0 = \\frac{D_1}{r - g}' },
          { step: 4, description: 'Calculate stock price', detail: 'Apply the formula', latex: 'P_0 = \\frac{2.10}{0.12 - 0.05} = \\frac{2.10}{0.07} = \\$30.00' }
        ],
        answer: '$30.00',
        explanation: 'The stock is worth $30.00 today. The Gordon Growth Model values stocks with constant perpetual dividend growth.'
      }
    },
    {
      id: 3,
      title: 'Two-Stage Dividend Growth Model',
      difficulty: 'advanced',
      category: 'Growth Models',
      type: 'Calculation',
      problem: 'A stock just paid $1.50 dividend. Dividends will grow at 20% for 3 years, then 4% forever. Required return is 11%. Find the stock value.',
      hint: 'Calculate PV of dividends during high growth, then add PV of terminal value using Gordon model.',
      solution: {
        steps: [
          { step: 1, description: 'Calculate high-growth dividends', detail: 'Years 1-3 with 20% growth', latex: '\\begin{aligned} D_1 &= 1.50(1.20) = \\$1.80 \\\\ D_2 &= 1.80(1.20) = \\$2.16 \\\\ D_3 &= 2.16(1.20) = \\$2.592 \\end{aligned}' },
          { step: 2, description: 'PV of high-growth dividends', detail: 'Discount each dividend', latex: '\\begin{aligned} PV_1 &= \\frac{1.80}{(1.11)^1} = 1.622 \\\\ PV_2 &= \\frac{2.16}{(1.11)^2} = 1.753 \\\\ PV_3 &= \\frac{2.592}{(1.11)^3} = 1.895 \\\\ \\text{Sum} &= \\$5.270 \\end{aligned}' },
          { step: 3, description: 'Calculate terminal value', detail: 'Price at end of year 3', latex: '\\begin{aligned} D_4 &= 2.592(1.04) = 2.696 \\\\ P_3 &= \\frac{D_4}{r - g} = \\frac{2.696}{0.11 - 0.04} = \\frac{2.696}{0.07} = \\$38.514 \\end{aligned}' },
          { step: 4, description: 'PV of terminal value', detail: 'Discount back to today', latex: 'PV(P_3) = \\frac{38.514}{(1.11)^3} = \\frac{38.514}{1.368} = \\$28.152' },
          { step: 5, description: 'Sum all components', detail: 'Total stock value', latex: 'P_0 = 5.270 + 28.152 = \\$33.42' }
        ],
        answer: '$33.42',
        explanation: 'The stock is worth $33.42, combining the present value of high-growth dividends and the terminal value at normal growth.'
      }
    },
    {
      id: 4,
      title: 'Price-to-Earnings Ratio Valuation',
      difficulty: 'beginner',
      category: 'Multiples',
      type: 'Application',
      problem: 'A company has earnings per share (EPS) of $4.50. The industry average P/E ratio is 18. Estimate the stock price using the P/E multiple.',
      hint: 'Stock Price = EPS × P/E Ratio',
      solution: {
        steps: [
          { step: 1, description: 'Identify given information', detail: 'EPS and comparable P/E', latex: '\\begin{aligned} \\text{EPS} &= \\$4.50 \\\\ \\text{P/E Ratio} &= 18 \\end{aligned}' },
          { step: 2, description: 'P/E valuation formula', detail: 'Price based on earnings multiple', latex: '\\text{Stock Price} = \\text{EPS} \\times \\text{P/E Ratio}' },
          { step: 3, description: 'Calculate stock price', detail: 'Apply the multiple', latex: '\\text{Price} = 4.50 \\times 18 = \\$81.00' }
        ],
        answer: '$81.00',
        explanation: 'Using the industry P/E multiple of 18, the stock should trade at approximately $81.00, valuing the company consistently with its peers.'
      }
    },
    {
      id: 5,
      title: 'Free Cash Flow to Equity Valuation',
      difficulty: 'intermediate',
      category: 'DCF',
      type: 'Calculation',
      problem: 'A company\'s FCFE is $5.00 per share, expected to grow at 6% annually. The cost of equity is 13%. Calculate the stock value.',
      hint: 'FCFE model is similar to Gordon Growth: P₀ = FCFE₁/(r-g)',
      solution: {
        steps: [
          { step: 1, description: 'Identify parameters', detail: 'FCFE and growth assumptions', latex: '\\begin{aligned} \\text{FCFE}_0 &= \\$5.00 \\\\ g &= 6\\% = 0.06 \\\\ r_e &= 13\\% = 0.13 \\end{aligned}' },
          { step: 2, description: 'Project next year FCFE', detail: 'Calculate FCFE₁', latex: '\\text{FCFE}_1 = 5.00(1.06) = \\$5.30' },
          { step: 3, description: 'FCFE valuation formula', detail: 'Constant growth DCF model', latex: 'P_0 = \\frac{\\text{FCFE}_1}{r_e - g}' },
          { step: 4, description: 'Calculate stock value', detail: 'Apply the formula', latex: 'P_0 = \\frac{5.30}{0.13 - 0.06} = \\frac{5.30}{0.07} = \\$75.71' }
        ],
        answer: '$75.71',
        explanation: 'The stock is worth $75.71 based on free cash flows to equity. This method values the cash available to equity holders after all expenses and reinvestment.'
      }
    },
    {
      id: 6,
      title: 'PEG Ratio Analysis',
      difficulty: 'intermediate',
      category: 'Multiples',
      type: 'Application',
      problem: 'Stock A has P/E of 25 and 20% earnings growth. Stock B has P/E of 15 and 10% growth. Which is relatively cheaper using the PEG ratio?',
      hint: 'PEG Ratio = P/E Ratio / Growth Rate. Lower PEG suggests better value.',
      solution: {
        steps: [
          { step: 1, description: 'Stock A parameters', detail: 'P/E and growth rate', latex: '\\begin{aligned} \\text{P/E}_A &= 25 \\\\ g_A &= 20\\% \\end{aligned}' },
          { step: 2, description: 'Calculate PEG for Stock A', detail: 'Adjust P/E for growth', latex: '\\text{PEG}_A = \\frac{25}{20} = 1.25' },
          { step: 3, description: 'Stock B parameters', detail: 'P/E and growth rate', latex: '\\begin{aligned} \\text{P/E}_B &= 15 \\\\ g_B &= 10\\% \\end{aligned}' },
          { step: 4, description: 'Calculate PEG for Stock B', detail: 'Adjust P/E for growth', latex: '\\text{PEG}_B = \\frac{15}{10} = 1.50' },
          { step: 5, description: 'Compare PEG ratios', detail: 'Lower is better value', latex: '\\text{PEG}_A = 1.25 < \\text{PEG}_B = 1.50' }
        ],
        answer: 'Stock A is relatively cheaper (PEG: 1.25 vs 1.50)',
        explanation: 'Stock A has a lower PEG ratio (1.25), suggesting it offers better value relative to its growth rate despite the higher P/E ratio. PEG accounts for growth in valuation.'
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
                <h1 className="text-2xl font-bold text-gray-900">Stock Valuation</h1>
                <p className="text-sm text-gray-500">Equity valuation methods & fundamentals</p>
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
            {sections.map((section) => (
              activeSection === section.id && section.id !== 'practice' && (
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
                      <p className="text-gray-600">Master stock valuation through hands-on problem solving</p>
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
