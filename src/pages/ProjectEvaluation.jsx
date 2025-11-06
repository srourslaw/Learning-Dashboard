import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Calculator,
  TrendingUp,
  DollarSign,
  BarChart3,
  Target,
  Activity,
  GraduationCap,
  Check,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DisplayEquation } from '../components/MathEquation';

export default function ProjectEvaluation() {
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
    { id: 'npv', label: 'Net Present Value', icon: DollarSign, color: 'from-green-600 to-emerald-600' },
    { id: 'irr', label: 'Internal Rate of Return', icon: TrendingUp, color: 'from-purple-600 to-pink-600' },
    { id: 'payback', label: 'Payback Period', icon: Calculator, color: 'from-orange-600 to-red-600' },
    { id: 'profitability', label: 'Profitability Index', icon: BarChart3, color: 'from-teal-600 to-cyan-600' },
    { id: 'comparison', label: 'Method Comparison', icon: Target, color: 'from-indigo-600 to-purple-600' },
    { id: 'practice', label: 'Practice Problems', icon: GraduationCap, color: 'from-violet-600 to-purple-600' }
  ];

  // Practice Problems Data
  const practiceProblems = [
    {
      id: 1,
      title: 'Basic NPV Calculation',
      difficulty: 'beginner',
      category: 'NPV',
      type: 'Calculation',
      problem: 'A project requires an initial investment of $100,000 and generates cash flows of $30,000 per year for 5 years. The discount rate is 10%. Calculate the NPV.',
      hint: 'NPV = Sum of discounted cash flows - Initial investment',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Initial investment, cash flows, and discount rate', latex: '\\begin{aligned} C_0 &= -\\$100,000 \\\\ CF &= \\$30,000 \\text{ per year for } 5 \\text{ years} \\\\ r &= 10\\% = 0.10 \\end{aligned}' },
          { step: 2, description: 'NPV formula', detail: 'Present value of future cash flows minus initial cost', latex: 'NPV = \\sum_{t=1}^{n} \\frac{CF_t}{(1+r)^t} - C_0' },
          { step: 3, description: 'Calculate PV of each cash flow', detail: 'Discount each year separately', latex: '\\begin{aligned} PV_1 &= \\frac{30,000}{(1.10)^1} = 27,273 \\\\ PV_2 &= \\frac{30,000}{(1.10)^2} = 24,793 \\\\ PV_3 &= \\frac{30,000}{(1.10)^3} = 22,539 \\\\ PV_4 &= \\frac{30,000}{(1.10)^4} = 20,490 \\\\ PV_5 &= \\frac{30,000}{(1.10)^5} = 18,627 \\end{aligned}' },
          { step: 4, description: 'Sum and subtract initial investment', detail: 'Total NPV calculation', latex: '\\begin{aligned} \\text{Total PV} &= 27,273 + 24,793 + 22,539 + 20,490 + 18,627 = 113,722 \\\\ NPV &= 113,722 - 100,000 = \\$13,722 \\end{aligned}' }
        ],
        answer: '$13,722',
        explanation: 'The positive NPV of $13,722 indicates the project creates value and should be accepted.'
      }
    },
    {
      id: 2,
      title: 'IRR Calculation',
      difficulty: 'intermediate',
      category: 'IRR',
      type: 'Calculation',
      problem: 'A project costs $50,000 and generates cash flows of $20,000 in Year 1, $25,000 in Year 2, and $18,000 in Year 3. Estimate the IRR.',
      hint: 'IRR is the discount rate that makes NPV = 0. Use trial and error or interpolation.',
      solution: {
        steps: [
          { step: 1, description: 'Set up IRR equation', detail: 'NPV equals zero at IRR', latex: '0 = \\frac{20,000}{(1+IRR)^1} + \\frac{25,000}{(1+IRR)^2} + \\frac{18,000}{(1+IRR)^3} - 50,000' },
          { step: 2, description: 'Try r = 15%', detail: 'First trial', latex: 'NPV = \\frac{20,000}{1.15} + \\frac{25,000}{1.15^2} + \\frac{18,000}{1.15^3} - 50,000 = 3,156' },
          { step: 3, description: 'Try r = 20%', detail: 'Second trial', latex: 'NPV = \\frac{20,000}{1.20} + \\frac{25,000}{1.20^2} + \\frac{18,000}{1.20^3} - 50,000 = -1,111' },
          { step: 4, description: 'Interpolate between 15% and 20%', detail: 'Linear approximation', latex: 'IRR \\approx 15\\% + \\frac{3,156}{3,156 + 1,111} \\times (20\\% - 15\\%) = 18.70\\%' }
        ],
        answer: '18.70%',
        explanation: 'The IRR is approximately 18.70%, which is the rate of return the project generates.'
      }
    },
    {
      id: 3,
      title: 'Payback Period',
      difficulty: 'beginner',
      category: 'Payback',
      type: 'Calculation',
      problem: 'A project requires $80,000 upfront and generates $25,000, $30,000, $35,000, and $20,000 in Years 1-4. Calculate the payback period.',
      hint: 'Payback period is when cumulative cash flows equal the initial investment.',
      solution: {
        steps: [
          { step: 1, description: 'Initial investment', detail: 'Amount to recover', latex: 'C_0 = \\$80,000' },
          { step: 2, description: 'Calculate cumulative cash flows', detail: 'Running total of inflows', latex: '\\begin{aligned} \\text{End Year 1:} & \\quad 25,000 \\\\ \\text{End Year 2:} & \\quad 25,000 + 30,000 = 55,000 \\\\ \\text{End Year 3:} & \\quad 55,000 + 35,000 = 90,000 \\end{aligned}' },
          { step: 3, description: 'Identify payback year', detail: 'Investment recovered during Year 3', latex: '\\text{Remaining after Year 2} = 80,000 - 55,000 = 25,000' },
          { step: 4, description: 'Calculate exact payback period', detail: 'Fraction of Year 3 needed', latex: '\\text{Payback} = 2 + \\frac{25,000}{35,000} = 2 + 0.714 = 2.71 \\text{ years}' }
        ],
        answer: '2.71 years',
        explanation: 'The project recovers its initial investment in 2.71 years.'
      }
    },
    {
      id: 4,
      title: 'Profitability Index',
      difficulty: 'intermediate',
      category: 'PI',
      type: 'Calculation',
      problem: 'A project has an initial cost of $200,000. The present value of future cash flows is $275,000. Calculate the profitability index and determine if the project should be accepted.',
      hint: 'PI = PV of future cash flows / Initial investment',
      solution: {
        steps: [
          { step: 1, description: 'Given information', detail: 'Initial cost and PV of cash flows', latex: '\\begin{aligned} C_0 &= \\$200,000 \\\\ PV &= \\$275,000 \\end{aligned}' },
          { step: 2, description: 'Profitability Index formula', detail: 'Ratio of benefits to costs', latex: 'PI = \\frac{PV \\text{ of future cash flows}}{\\text{Initial investment}}' },
          { step: 3, description: 'Calculate PI', detail: 'Substitute values', latex: 'PI = \\frac{275,000}{200,000} = 1.375' },
          { step: 4, description: 'Decision rule', detail: 'Accept if PI > 1', latex: 'PI = 1.375 > 1.0 \\Rightarrow \\text{ACCEPT the project}' }
        ],
        answer: 'PI = 1.375, Accept',
        explanation: 'The PI of 1.375 means the project generates $1.375 in present value for every $1 invested. Accept the project.'
      }
    },
    {
      id: 5,
      title: 'NPV vs IRR Decision Conflict',
      difficulty: 'advanced',
      category: 'Comparison',
      type: 'Application',
      problem: 'Project A: NPV=$50,000, IRR=18%. Project B: NPV=$60,000, IRR=15%. The required return is 12%. Which project should you choose if they are mutually exclusive?',
      hint: 'When NPV and IRR conflict, always rely on NPV for correct decision.',
      solution: {
        steps: [
          { step: 1, description: 'Compare both metrics', detail: 'Examine NPV and IRR for each project', latex: '\\begin{aligned} \\text{Project A:} & \\quad NPV = \\$50,000, \\quad IRR = 18\\% \\\\ \\text{Project B:} & \\quad NPV = \\$60,000, \\quad IRR = 15\\% \\end{aligned}' },
          { step: 2, description: 'Check required return', detail: 'Both IRRs exceed hurdle rate', latex: 'r = 12\\% < 15\\% < 18\\% \\quad \\text{(Both acceptable)}' },
          { step: 3, description: 'Apply decision rules', detail: 'NPV rule vs IRR rule', latex: '\\begin{aligned} \\text{NPV rule:} & \\quad \\text{Choose B (higher NPV)} \\\\ \\text{IRR rule:} & \\quad \\text{Choose A (higher IRR)} \\end{aligned}' },
          { step: 4, description: 'NPV rule dominates', detail: 'NPV measures value creation directly', latex: '\\text{Choose Project B: NPV directly measures wealth increase}' }
        ],
        answer: 'Choose Project B',
        explanation: 'Choose Project B. When NPV and IRR conflict, NPV is superior because it directly measures value creation. Project B creates $10,000 more value.'
      }
    },
    {
      id: 6,
      title: 'Discounted Payback Period',
      difficulty: 'intermediate',
      category: 'Payback',
      type: 'Calculation',
      problem: 'A project costs $60,000 and generates $25,000 annually for 4 years. Calculate the discounted payback period using a 12% discount rate.',
      hint: 'Discount each cash flow before calculating cumulative totals.',
      solution: {
        steps: [
          { step: 1, description: 'Calculate discounted cash flows', detail: 'PV of each annual cash flow', latex: '\\begin{aligned} PV_1 &= \\frac{25,000}{1.12^1} = 22,321 \\\\ PV_2 &= \\frac{25,000}{1.12^2} = 19,930 \\\\ PV_3 &= \\frac{25,000}{1.12^3} = 17,795 \\\\ PV_4 &= \\frac{25,000}{1.12^4} = 15,888 \\end{aligned}' },
          { step: 2, description: 'Cumulative discounted cash flows', detail: 'Running total of PVs', latex: '\\begin{aligned} \\text{Year 1:} & \\quad 22,321 \\\\ \\text{Year 2:} & \\quad 42,251 \\\\ \\text{Year 3:} & \\quad 60,046 \\end{aligned}' },
          { step: 3, description: 'Find exact payback period', detail: 'Fraction of Year 3', latex: '\\text{Remaining after Year 2} = 60,000 - 42,251 = 17,749' },
          { step: 4, description: 'Calculate discounted payback', detail: 'Time to recover in PV terms', latex: '\\text{Discounted Payback} = 2 + \\frac{17,749}{17,795} = 2 + 0.997 \\approx 3.00 \\text{ years}' }
        ],
        answer: '3.00 years',
        explanation: 'The discounted payback period is approximately 3 years, longer than the simple payback due to time value of money.'
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
                <h1 className="text-2xl font-bold text-gray-900">Project Evaluation (NPV & IRR)</h1>
                <p className="text-sm text-gray-500">Capital budgeting techniques</p>
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
                      <p className="text-gray-700 text-center">Content coming soon...</p>
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
                      <p className="text-gray-600">Master project evaluation techniques through hands-on problem solving</p>
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
