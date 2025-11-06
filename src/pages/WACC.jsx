import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calculator, DollarSign, TrendingUp, BarChart3, Target, Activity, GraduationCap, Check, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { DisplayEquation } from '../components/MathEquation';

export default function WACC() {
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
    { id: 'wacc-calc', label: 'WACC Calculation', icon: Calculator, color: 'from-green-600 to-emerald-600' },
    { id: 'cost-debt', label: 'Cost of Debt', icon: DollarSign, color: 'from-purple-600 to-pink-600' },
    { id: 'cost-equity', label: 'Cost of Equity', icon: TrendingUp, color: 'from-orange-600 to-red-600' },
    { id: 'firm-valuation', label: 'Firm Valuation', icon: BarChart3, color: 'from-teal-600 to-cyan-600' },
    { id: 'applications', label: 'Applications', icon: Target, color: 'from-indigo-600 to-purple-600' },
    { id: 'practice', label: 'Practice Problems', icon: GraduationCap, color: 'from-violet-600 to-purple-600' }
  ];

  // Practice Problems Data
  const practiceProblems = [
    {
      id: 1,
      title: 'Basic WACC Calculation',
      difficulty: 'beginner',
      category: 'WACC Fundamentals',
      type: 'Calculation',
      problem: 'A company has $400 million in debt (cost of debt 5%) and $600 million in equity (cost of equity 12%). The corporate tax rate is 25%. Calculate the WACC.',
      hint: 'WACC is the weighted average of after-tax cost of debt and cost of equity.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the values', detail: 'Debt, equity, costs, and tax rate', latex: '\\begin{aligned} D &= \\$400\\text{ million},\\quad r_D = 5\\% \\\\ E &= \\$600\\text{ million},\\quad r_E = 12\\% \\\\ T_C &= 25\\% \\end{aligned}' },
          { step: 2, description: 'Calculate total firm value', detail: 'Sum of debt and equity', latex: 'V = D + E = \\$400 + \\$600 = \\$1,000\\text{ million}' },
          { step: 3, description: 'Calculate weights', detail: 'Proportion of each component', latex: '\\begin{aligned} w_D &= \\frac{D}{V} = \\frac{\\$400}{\\$1,000} = 0.40 \\\\ w_E &= \\frac{E}{V} = \\frac{\\$600}{\\$1,000} = 0.60 \\end{aligned}' },
          { step: 4, description: 'WACC formula', detail: 'Weighted average with tax shield', latex: 'WACC = w_D \\times r_D \\times (1 - T_C) + w_E \\times r_E' },
          { step: 5, description: 'Calculate WACC', detail: 'Substitute and compute', latex: 'WACC = 0.40 \\times 0.05 \\times (1 - 0.25) + 0.60 \\times 0.12 = 0.015 + 0.072 = 0.087 = 8.7\\%' }
        ],
        answer: '8.7%',
        explanation: 'The WACC is 8.7%, representing the average cost of capital for the firm after accounting for the tax deductibility of interest.'
      }
    },
    {
      id: 2,
      title: 'Cost of Equity Using CAPM',
      difficulty: 'beginner',
      category: 'Cost of Equity',
      type: 'Calculation',
      problem: 'A stock has a beta of 1.3, the risk-free rate is 3%, and the expected market return is 10%. Calculate the cost of equity using CAPM.',
      hint: 'Use the CAPM formula: Cost of Equity = Risk-free rate + Beta × Market risk premium.',
      solution: {
        steps: [
          { step: 1, description: 'Identify CAPM parameters', detail: 'Beta, risk-free rate, and market return', latex: '\\begin{aligned} \\beta &= 1.3 \\\\ R_f &= 3\\% \\\\ E(R_M) &= 10\\% \\end{aligned}' },
          { step: 2, description: 'Calculate market risk premium', detail: 'Excess return over risk-free rate', latex: 'MRP = E(R_M) - R_f = 10\\% - 3\\% = 7\\%' },
          { step: 3, description: 'CAPM formula', detail: 'Cost of equity calculation', latex: 'r_E = R_f + \\beta \\times (E(R_M) - R_f)' },
          { step: 4, description: 'Calculate cost of equity', detail: 'Substitute values', latex: 'r_E = 0.03 + 1.3 \\times 0.07 = 0.03 + 0.091 = 0.121 = 12.1\\%' }
        ],
        answer: '12.1%',
        explanation: 'The cost of equity is 12.1%. With a beta of 1.3, this stock is 30% more volatile than the market and requires a higher expected return.'
      }
    },
    {
      id: 3,
      title: 'After-Tax Cost of Debt',
      difficulty: 'intermediate',
      category: 'Cost of Debt',
      type: 'Calculation',
      problem: 'A company issues bonds with a yield to maturity of 7%. The corporate tax rate is 30%. Calculate the after-tax cost of debt and explain why we use the after-tax cost.',
      hint: 'Interest payments are tax-deductible, reducing the effective cost of debt.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the values', detail: 'Pre-tax cost of debt and tax rate', latex: '\\begin{aligned} r_D &= 7\\% \\\\ T_C &= 30\\% \\end{aligned}' },
          { step: 2, description: 'After-tax cost of debt formula', detail: 'Accounting for tax shield', latex: 'r_D(1 - T_C)' },
          { step: 3, description: 'Calculate after-tax cost', detail: 'Apply the tax benefit', latex: 'r_D(1 - T_C) = 0.07 \\times (1 - 0.30) = 0.07 \\times 0.70 = 0.049 = 4.9\\%' }
        ],
        answer: '4.9%',
        explanation: 'The after-tax cost of debt is 4.9%. We use the after-tax cost because interest payments are tax-deductible, making the effective cost to the company lower than the stated interest rate.'
      }
    },
    {
      id: 4,
      title: 'WACC with Multiple Debt Sources',
      difficulty: 'intermediate',
      category: 'WACC Fundamentals',
      type: 'Calculation',
      problem: 'A firm has: Bank loan $200M at 6%, Bonds $300M at 7%, Preferred stock $100M at 8%, Common equity $400M at 13%. Tax rate is 28%. Calculate WACC.',
      hint: 'Calculate weighted average cost of debt first, then combine all sources. Remember preferred stock is not tax-deductible.',
      solution: {
        steps: [
          { step: 1, description: 'Calculate total value and weights', detail: 'All capital sources', latex: '\\begin{aligned} V &= \\$200 + \\$300 + \\$100 + \\$400 = \\$1,000\\text{M} \\\\ w_{\\text{loan}} &= 0.20,\\quad w_{\\text{bonds}} = 0.30 \\\\ w_{\\text{pref}} &= 0.10,\\quad w_{\\text{equity}} = 0.40 \\end{aligned}' },
          { step: 2, description: 'After-tax cost of debt sources', detail: 'Tax shield on debt only', latex: '\\begin{aligned} r_{\\text{loan}}(1-T) &= 0.06 \\times 0.72 = 4.32\\% \\\\ r_{\\text{bonds}}(1-T) &= 0.07 \\times 0.72 = 5.04\\% \\end{aligned}' },
          { step: 3, description: 'WACC formula with all sources', detail: 'Combine all weighted costs', latex: 'WACC = w_{\\text{loan}} \\times r_{\\text{loan}}(1-T) + w_{\\text{bonds}} \\times r_{\\text{bonds}}(1-T) + w_{\\text{pref}} \\times r_{\\text{pref}} + w_E \\times r_E' },
          { step: 4, description: 'Substitute and calculate', detail: 'Sum all components', latex: '\\begin{aligned} WACC &= 0.20(0.0432) + 0.30(0.0504) + 0.10(0.08) + 0.40(0.13) \\\\ &= 0.00864 + 0.01512 + 0.008 + 0.052 = 0.08376 = 8.38\\% \\end{aligned}' }
        ],
        answer: '8.38%',
        explanation: 'The WACC is 8.38%. This calculation properly weights all capital sources and applies the tax shield only to debt (not to preferred stock or equity).'
      }
    },
    {
      id: 5,
      title: 'Firm Valuation Using WACC',
      difficulty: 'advanced',
      category: 'Firm Valuation',
      type: 'Application',
      problem: 'A company expects perpetual free cash flow of $85 million per year. Its WACC is 9.5%. Calculate the firm value. If the company has $300M in debt, what is the equity value?',
      hint: 'Firm value = FCF / WACC for perpetual cash flows. Equity value = Firm value - Debt.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the values', detail: 'FCF, WACC, and debt', latex: '\\begin{aligned} FCF &= \\$85\\text{ million} \\\\ WACC &= 9.5\\% \\\\ D &= \\$300\\text{ million} \\end{aligned}' },
          { step: 2, description: 'Firm valuation formula', detail: 'Present value of perpetual FCF', latex: 'V_{\\text{Firm}} = \\frac{FCF}{WACC}' },
          { step: 3, description: 'Calculate firm value', detail: 'Substitute and compute', latex: 'V_{\\text{Firm}} = \\frac{\\$85}{0.095} = \\$894.74\\text{ million}' },
          { step: 4, description: 'Calculate equity value', detail: 'Firm value minus debt', latex: 'V_{\\text{Equity}} = V_{\\text{Firm}} - D = \\$894.74 - \\$300 = \\$594.74\\text{ million}' }
        ],
        answer: 'Firm value: $894.74M, Equity value: $594.74M',
        explanation: 'The firm value is $894.74 million and equity value is $594.74 million. WACC is used as the discount rate because it represents the blended cost of all capital sources.'
      }
    },
    {
      id: 6,
      title: 'Market Value vs Book Value Weights',
      difficulty: 'advanced',
      category: 'WACC Fundamentals',
      type: 'Conceptual',
      problem: 'A company has book values: Debt $500M, Equity $800M. Market values: Debt $520M, Equity $1,200M. Cost of debt 6%, cost of equity 11%, tax rate 25%. Compare WACC using book vs market values.',
      hint: 'Market values reflect current investor expectations and should be used for WACC. Calculate both to see the difference.',
      solution: {
        steps: [
          { step: 1, description: 'Book value WACC calculation', detail: 'Using book values', latex: '\\begin{aligned} V_B &= \\$500 + \\$800 = \\$1,300\\text{M} \\\\ WACC_B &= \\frac{500}{1300} \\times 0.06(1-0.25) + \\frac{800}{1300} \\times 0.11 \\\\ &= 0.385(0.045) + 0.615(0.11) = 0.0173 + 0.0677 = 8.50\\% \\end{aligned}' },
          { step: 2, description: 'Market value WACC calculation', detail: 'Using market values', latex: '\\begin{aligned} V_M &= \\$520 + \\$1,200 = \\$1,720\\text{M} \\\\ WACC_M &= \\frac{520}{1720} \\times 0.06(1-0.25) + \\frac{1200}{1720} \\times 0.11 \\\\ &= 0.302(0.045) + 0.698(0.11) = 0.0136 + 0.0768 = 9.04\\% \\end{aligned}' },
          { step: 3, description: 'Compare the results', detail: 'Difference and implications', latex: 'WACC_M - WACC_B = 9.04\\% - 8.50\\% = 0.54\\%' }
        ],
        answer: 'Book value WACC: 8.50%, Market value WACC: 9.04%',
        explanation: 'The market value WACC (9.04%) is higher because equity has appreciated relative to its book value, increasing its weight. Market values should be used as they reflect current investor requirements and opportunity costs.'
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
                <h1 className="text-2xl font-bold text-gray-900">WACC & Firm Valuation</h1>
                <p className="text-sm text-gray-500">Weighted average cost of capital</p>
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
                      <p className="text-gray-600">Master WACC concepts through hands-on problem solving</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
                      <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none">
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none">
                        <option value="all">All Categories</option>
                        {[...new Set(practiceProblems.map(p => p.category))].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {practiceProblems.filter(p => (selectedDifficulty === 'all' || p.difficulty === selectedDifficulty) && (selectedCategory === 'all' || p.category === selectedCategory)).map(problem => {
                      const isExpanded = expandedProblems[problem.id];
                      const isCompleted = completedProblems[problem.id];
                      const hintShown = shownHints[problem.id];

                      return (
                        <div key={problem.id} className={`border-2 rounded-2xl overflow-hidden transition-all ${isCompleted ? 'border-green-400 bg-green-50' : isExpanded ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-white hover:border-violet-300'}`}>
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
                                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${problem.difficulty === 'beginner' ? 'bg-green-100 text-green-700' : problem.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
                                    {problem.difficulty.charAt(0).toUpperCase() + problem.difficulty.slice(1)}
                                  </span>
                                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">{problem.category}</span>
                                  <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">{problem.type}</span>
                                </div>
                              </div>
                            </div>

                            <div className="bg-white rounded-xl p-5 border-2 border-gray-200 mb-4">
                              <p className="text-gray-700 leading-relaxed">{problem.problem}</p>
                            </div>

                            <div className="flex items-center gap-3">
                              <button onClick={() => setShownHints(prev => ({ ...prev, [problem.id]: !hintShown }))} className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors font-semibold text-sm">
                                <Info className="w-4 h-4" />
                                {hintShown ? 'Hide Hint' : 'Show Hint'}
                              </button>
                              <button onClick={() => setExpandedProblems(prev => ({ ...prev, [problem.id]: !isExpanded }))} className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-semibold text-sm">
                                {isExpanded ? <><ChevronUp className="w-4 h-4" />Hide Solution</> : <><ChevronDown className="w-4 h-4" />Show Solution</>}
                              </button>
                              <button onClick={() => setCompletedProblems(prev => ({ ...prev, [problem.id]: !isCompleted }))} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold text-sm ml-auto ${isCompleted ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}>
                                <Check className="w-4 h-4" />
                                {isCompleted ? 'Mark Incomplete' : 'Mark Complete'}
                              </button>
                            </div>

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

                  {practiceProblems.filter(p => (selectedDifficulty === 'all' || p.difficulty === selectedDifficulty) && (selectedCategory === 'all' || p.category === selectedCategory)).length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4">
                        <GraduationCap className="w-16 h-16 mx-auto" />
                      </div>
                      <p className="text-gray-600 font-semibold">No problems match your filters</p>
                      <p className="text-gray-500 text-sm">Try adjusting your difficulty or category filters</p>
                    </div>
                  )}
                </div>

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
