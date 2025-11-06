import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  TrendingUp,
  BarChart3,
  Calculator,
  Activity,
  GraduationCap,
  Check,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DisplayEquation } from '../components/MathEquation';

export default function BondValuation() {
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
    { id: 'pricing', label: 'Bond Pricing', icon: DollarSign, color: 'from-green-600 to-emerald-600' },
    { id: 'yield', label: 'Yield Calculations', icon: TrendingUp, color: 'from-purple-600 to-pink-600' },
    { id: 'duration', label: 'Duration & Convexity', icon: Calendar, color: 'from-orange-600 to-red-600' },
    { id: 'risk', label: 'Bond Risks', icon: BarChart3, color: 'from-teal-600 to-cyan-600' },
    { id: 'calculator', label: 'Bond Calculator', icon: Calculator, color: 'from-indigo-600 to-purple-600' },
    { id: 'practice', label: 'Practice Problems', icon: GraduationCap, color: 'from-violet-600 to-purple-600' }
  ];

  // Practice Problems Data
  const practiceProblems = [
    {
      id: 1,
      title: 'Basic Bond Pricing',
      difficulty: 'beginner',
      category: 'Bond Pricing',
      type: 'Calculation',
      problem: 'A bond has a face value of $1,000, coupon rate of 6% (paid annually), and 3 years to maturity. If the required yield is 8%, what is the bond price?',
      hint: 'Calculate the present value of all future coupon payments plus the present value of the face value.',
      solution: {
        steps: [
          { step: 1, description: 'Identify bond parameters', detail: 'Key information from the problem', latex: '\\begin{aligned} \\text{Face Value (FV)} &= \\$1{,}000 \\\\ \\text{Coupon Rate} &= 6\\% \\\\ \\text{Annual Coupon (C)} &= 0.06 \\times 1{,}000 = \\$60 \\\\ \\text{Years to Maturity (n)} &= 3 \\\\ \\text{Yield (r)} &= 8\\% \\end{aligned}' },
          { step: 2, description: 'Bond pricing formula', detail: 'Present value of coupons plus face value', latex: 'P = \\sum_{t=1}^{n} \\frac{C}{(1+r)^t} + \\frac{FV}{(1+r)^n}' },
          { step: 3, description: 'Calculate PV of coupons', detail: 'Discount each coupon payment', latex: '\\begin{aligned} PV_{\\text{coupons}} &= \\frac{60}{(1.08)^1} + \\frac{60}{(1.08)^2} + \\frac{60}{(1.08)^3} \\\\ &= 55.56 + 51.44 + 47.63 = \\$154.63 \\end{aligned}' },
          { step: 4, description: 'Calculate PV of face value', detail: 'Discount the principal repayment', latex: 'PV_{\\text{face}} = \\frac{1{,}000}{(1.08)^3} = \\frac{1{,}000}{1.2597} = \\$793.83' },
          { step: 5, description: 'Sum to get bond price', detail: 'Total present value', latex: 'P = 154.63 + 793.83 = \\$948.46' }
        ],
        answer: '$948.46',
        explanation: 'The bond trades at a discount ($948.46 < $1,000) because the market yield (8%) exceeds the coupon rate (6%).'
      }
    },
    {
      id: 2,
      title: 'Yield to Maturity Calculation',
      difficulty: 'intermediate',
      category: 'Yield',
      type: 'Calculation',
      problem: 'A 5-year bond with a 7% annual coupon and $1,000 face value is trading at $1,080. Estimate the yield to maturity (YTM).',
      hint: 'Use the approximate YTM formula or trial and error. YTM is the discount rate that equates price to present value.',
      solution: {
        steps: [
          { step: 1, description: 'Identify given information', detail: 'Bond characteristics', latex: '\\begin{aligned} \\text{Face Value (FV)} &= \\$1{,}000 \\\\ \\text{Coupon Rate} &= 7\\% \\\\ \\text{Annual Coupon (C)} &= \\$70 \\\\ \\text{Current Price (P)} &= \\$1{,}080 \\\\ \\text{Years to Maturity (n)} &= 5 \\end{aligned}' },
          { step: 2, description: 'Approximate YTM formula', detail: 'Quick estimation method', latex: 'YTM \\approx \\frac{C + \\frac{FV - P}{n}}{\\frac{FV + P}{2}}' },
          { step: 3, description: 'Calculate numerator', detail: 'Annual return components', latex: '\\text{Numerator} = 70 + \\frac{1{,}000 - 1{,}080}{5} = 70 + (-16) = 54' },
          { step: 4, description: 'Calculate denominator', detail: 'Average price', latex: '\\text{Denominator} = \\frac{1{,}000 + 1{,}080}{2} = 1{,}040' },
          { step: 5, description: 'Complete calculation', detail: 'Final YTM estimate', latex: 'YTM \\approx \\frac{54}{1{,}040} = 0.0519 = 5.19\\%' }
        ],
        answer: 'YTM ≈ 5.19%',
        explanation: 'The YTM is lower than the coupon rate because the bond trades at a premium. The exact YTM using iterative methods would be approximately 5.15%.'
      }
    },
    {
      id: 3,
      title: 'Macaulay Duration',
      difficulty: 'intermediate',
      category: 'Duration',
      type: 'Calculation',
      problem: 'Calculate the Macaulay duration for a 3-year bond with 8% annual coupons, $1,000 face value, and 6% yield.',
      hint: 'Duration is the weighted average time to receive cash flows, where weights are the PV of each cash flow divided by bond price.',
      solution: {
        steps: [
          { step: 1, description: 'Calculate bond price', detail: 'First find the current price', latex: '\\begin{aligned} P &= \\frac{80}{1.06} + \\frac{80}{(1.06)^2} + \\frac{1{,}080}{(1.06)^3} \\\\ &= 75.47 + 71.20 + 906.88 = \\$1{,}053.55 \\end{aligned}' },
          { step: 2, description: 'Calculate weighted cash flows', detail: 'Time × PV for each payment', latex: '\\begin{aligned} \\text{Year 1:} & \\quad 1 \\times 75.47 = 75.47 \\\\ \\text{Year 2:} & \\quad 2 \\times 71.20 = 142.40 \\\\ \\text{Year 3:} & \\quad 3 \\times 906.88 = 2{,}720.64 \\end{aligned}' },
          { step: 3, description: 'Sum weighted cash flows', detail: 'Total time-weighted value', latex: '\\sum (t \\times PV_t) = 75.47 + 142.40 + 2{,}720.64 = 2{,}938.51' },
          { step: 4, description: 'Calculate Macaulay duration', detail: 'Divide by bond price', latex: 'D_{Mac} = \\frac{2{,}938.51}{1{,}053.55} = 2.79 \\text{ years}' }
        ],
        answer: '2.79 years',
        explanation: 'The Macaulay duration of 2.79 years is less than the maturity (3 years) because the bond pays coupons, which are received before maturity.'
      }
    },
    {
      id: 4,
      title: 'Modified Duration and Price Change',
      difficulty: 'advanced',
      category: 'Duration',
      type: 'Application',
      problem: 'A bond has a Macaulay duration of 6.5 years and yields 7%. If yields increase to 7.5%, estimate the percentage price change using modified duration.',
      hint: 'Modified Duration = Macaulay Duration / (1 + yield). Then use ΔP/P ≈ -D_mod × Δy.',
      solution: {
        steps: [
          { step: 1, description: 'Given information', detail: 'Duration and yield data', latex: '\\begin{aligned} D_{Mac} &= 6.5 \\text{ years} \\\\ y_0 &= 7\\% = 0.07 \\\\ y_1 &= 7.5\\% = 0.075 \\\\ \\Delta y &= 0.005 \\end{aligned}' },
          { step: 2, description: 'Calculate modified duration', detail: 'Adjust for yield', latex: 'D_{mod} = \\frac{D_{Mac}}{1 + y} = \\frac{6.5}{1.07} = 6.075 \\text{ years}' },
          { step: 3, description: 'Price change formula', detail: 'Duration-based approximation', latex: '\\frac{\\Delta P}{P} \\approx -D_{mod} \\times \\Delta y' },
          { step: 4, description: 'Calculate percentage change', detail: 'Apply the formula', latex: '\\frac{\\Delta P}{P} \\approx -6.075 \\times 0.005 = -0.0304 = -3.04\\%' }
        ],
        answer: '-3.04%',
        explanation: 'The bond price is expected to decline by approximately 3.04% when yields increase by 50 basis points. The negative sign indicates an inverse relationship between price and yield.'
      }
    },
    {
      id: 5,
      title: 'Zero-Coupon Bond Valuation',
      difficulty: 'beginner',
      category: 'Bond Pricing',
      type: 'Calculation',
      problem: 'What is the fair price of a zero-coupon bond with $1,000 face value, 8 years to maturity, and 5% required yield (annual compounding)?',
      hint: 'Zero-coupon bonds have no coupon payments, only the face value at maturity. Use simple present value formula.',
      solution: {
        steps: [
          { step: 1, description: 'Identify parameters', detail: 'Zero-coupon bond characteristics', latex: '\\begin{aligned} FV &= \\$1{,}000 \\\\ n &= 8 \\text{ years} \\\\ r &= 5\\% = 0.05 \\\\ C &= \\$0 \\text{ (no coupons)} \\end{aligned}' },
          { step: 2, description: 'Zero-coupon bond formula', detail: 'Present value of face value only', latex: 'P = \\frac{FV}{(1 + r)^n}' },
          { step: 3, description: 'Substitute values', detail: 'Calculate present value', latex: 'P = \\frac{1{,}000}{(1.05)^8} = \\frac{1{,}000}{1.4775}' },
          { step: 4, description: 'Final calculation', detail: 'Bond price', latex: 'P = \\$676.84' }
        ],
        answer: '$676.84',
        explanation: 'The zero-coupon bond trades at a deep discount ($676.84) and will appreciate to $1,000 at maturity, providing the investor with a 5% annual return.'
      }
    },
    {
      id: 6,
      title: 'Convexity and Price Change',
      difficulty: 'advanced',
      category: 'Convexity',
      type: 'Application',
      problem: 'A bond has modified duration of 7.2 years and convexity of 65. Current yield is 6%. Estimate the price change if yield increases to 7%.',
      hint: 'Use both duration and convexity: ΔP/P ≈ -D_mod × Δy + 0.5 × Convexity × (Δy)²',
      solution: {
        steps: [
          { step: 1, description: 'Given information', detail: 'Bond risk measures', latex: '\\begin{aligned} D_{mod} &= 7.2 \\\\ \\text{Convexity} &= 65 \\\\ y_0 &= 6\\% = 0.06 \\\\ y_1 &= 7\\% = 0.07 \\\\ \\Delta y &= 0.01 \\end{aligned}' },
          { step: 2, description: 'Duration effect', detail: 'First-order approximation', latex: '\\text{Duration effect} = -D_{mod} \\times \\Delta y = -7.2 \\times 0.01 = -0.072' },
          { step: 3, description: 'Convexity effect', detail: 'Second-order adjustment', latex: '\\text{Convexity effect} = 0.5 \\times 65 \\times (0.01)^2 = 0.5 \\times 65 \\times 0.0001 = 0.00325' },
          { step: 4, description: 'Total price change', detail: 'Combine both effects', latex: '\\begin{aligned} \\frac{\\Delta P}{P} &= -0.072 + 0.00325 \\\\ &= -0.06875 = -6.875\\% \\end{aligned}' }
        ],
        answer: '-6.875%',
        explanation: 'Including convexity provides a more accurate estimate. The convexity adjustment (+0.325%) partially offsets the duration-based decline, showing bonds have positive convexity that benefits investors when yields change.'
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
                <h1 className="text-2xl font-bold text-gray-900">Bond Valuation</h1>
                <p className="text-sm text-gray-500">Fixed income securities & debt markets</p>
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
                      <p className="text-gray-600">Master bond valuation through hands-on problem solving</p>
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
