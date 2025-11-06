import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Calculator, BarChart3, DollarSign, Target, Activity, GraduationCap, Check, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { DisplayEquation } from '../components/MathEquation';

export default function Derivatives() {
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
    { id: 'futures', label: 'Futures Contracts', icon: TrendingUp, color: 'from-green-600 to-emerald-600' },
    { id: 'options', label: 'Options Basics', icon: DollarSign, color: 'from-purple-600 to-pink-600' },
    { id: 'pricing', label: 'Option Pricing', icon: Calculator, color: 'from-orange-600 to-red-600' },
    { id: 'strategies', label: 'Trading Strategies', icon: Target, color: 'from-teal-600 to-cyan-600' },
    { id: 'swaps', label: 'Swaps & Other Derivatives', icon: BarChart3, color: 'from-indigo-600 to-purple-600' },
    { id: 'practice', label: 'Practice Problems', icon: GraduationCap, color: 'from-violet-600 to-purple-600' }
  ];

  // Practice Problems Data
  const practiceProblems = [
    {
      id: 1,
      title: 'Forward Contract Pricing',
      difficulty: 'beginner',
      category: 'Forward Pricing',
      type: 'Calculation',
      problem: 'A stock currently trades at $100. The risk-free rate is 4% per year. Calculate the 6-month forward price for this stock (assume no dividends).',
      hint: 'Forward price = Spot price × e^(r×T) or approximately S₀(1 + rT) for small rates.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Spot price, rate, and time', latex: '\\begin{aligned} S_0 &= \\$100 \\\\ r &= 4\\% = 0.04 \\\\ T &= 0.5\\text{ years} \\end{aligned}' },
          { step: 2, description: 'Forward pricing formula', detail: 'No-arbitrage relationship', latex: 'F_0 = S_0 \\times e^{rT}' },
          { step: 3, description: 'Calculate forward price', detail: 'Substitute and compute', latex: 'F_0 = \\$100 \\times e^{0.04 \\times 0.5} = \\$100 \\times e^{0.02} = \\$100 \\times 1.0202 = \\$102.02' }
        ],
        answer: '$102.02',
        explanation: 'The 6-month forward price is $102.02. This reflects the cost of carrying the stock for 6 months at the risk-free rate.'
      }
    },
    {
      id: 2,
      title: 'Call Option Payoff Diagram',
      difficulty: 'beginner',
      category: 'Options Basics',
      type: 'Calculation',
      problem: 'You buy a call option on a stock with strike price $50, paying a premium of $3. Calculate your profit/loss if the stock price at expiration is: (A) $45, (B) $50, (C) $55, (D) $60.',
      hint: 'Call payoff = max(S_T - K, 0). Then subtract the premium to get profit.',
      solution: {
        steps: [
          { step: 1, description: 'Option parameters', detail: 'Strike and premium', latex: '\\begin{aligned} K &= \\$50 \\\\ \\text{Premium} &= \\$3 \\end{aligned}' },
          { step: 2, description: 'Call option payoff formula', detail: 'Intrinsic value at expiration', latex: '\\text{Payoff} = \\max(S_T - K, 0)' },
          { step: 3, description: 'Profit formula', detail: 'Payoff minus premium paid', latex: '\\text{Profit} = \\text{Payoff} - \\text{Premium}' },
          { step: 4, description: 'Calculate for each scenario', detail: 'Stock prices at expiration', latex: '\\begin{aligned} (A)\\, S_T = \\$45: & \\quad \\text{Profit} = \\max(45-50,0) - 3 = 0 - 3 = -\\$3 \\\\ (B)\\, S_T = \\$50: & \\quad \\text{Profit} = \\max(50-50,0) - 3 = 0 - 3 = -\\$3 \\\\ (C)\\, S_T = \\$55: & \\quad \\text{Profit} = \\max(55-50,0) - 3 = 5 - 3 = \\$2 \\\\ (D)\\, S_T = \\$60: & \\quad \\text{Profit} = \\max(60-50,0) - 3 = 10 - 3 = \\$7 \\end{aligned}' }
        ],
        answer: '(A) -$3, (B) -$3, (C) $2, (D) $7',
        explanation: 'Maximum loss is limited to the premium of $3. The option breaks even at $53 (strike + premium). Profit increases dollar-for-dollar above the breakeven.'
      }
    },
    {
      id: 3,
      title: 'Put-Call Parity',
      difficulty: 'intermediate',
      category: 'Option Pricing',
      type: 'Calculation',
      problem: 'A stock trades at $80. A call option with strike $75 and 1 year to expiration trades at $12. The risk-free rate is 5%. Using put-call parity, find the price of a put option with the same strike and expiration.',
      hint: 'Put-call parity: C + PV(K) = P + S₀, or C + Ke^(-rT) = P + S₀.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Stock, call, strike, rate, and time', latex: '\\begin{aligned} S_0 &= \\$80,\\quad C = \\$12 \\\\ K &= \\$75,\\quad r = 5\\%,\\quad T = 1\\text{ year} \\end{aligned}' },
          { step: 2, description: 'Put-call parity formula', detail: 'Relationship between put and call', latex: 'C + K e^{-rT} = P + S_0' },
          { step: 3, description: 'Calculate present value of strike', detail: 'Discount strike price', latex: 'K e^{-rT} = \\$75 \\times e^{-0.05} = \\$75 \\times 0.9512 = \\$71.34' },
          { step: 4, description: 'Solve for put price', detail: 'Rearrange parity equation', latex: 'P = C + K e^{-rT} - S_0 = \\$12 + \\$71.34 - \\$80 = \\$3.34' }
        ],
        answer: '$3.34',
        explanation: 'The put option price is $3.34, determined by put-call parity. This no-arbitrage relationship ensures consistent pricing between puts, calls, stock, and risk-free bonds.'
      }
    },
    {
      id: 4,
      title: 'Protective Put Strategy',
      difficulty: 'intermediate',
      category: 'Option Strategies',
      type: 'Application',
      problem: 'You own 100 shares of stock currently at $90/share. You buy a protective put with strike $85, paying $4 per share. What are your minimum and maximum outcomes at expiration?',
      hint: 'Protective put = Long stock + Long put. Provides downside protection while keeping upside.',
      solution: {
        steps: [
          { step: 1, description: 'Strategy components', detail: 'Stock position and put option', latex: '\\begin{aligned} \\text{Stock:} & \\text{ Long 100 shares at } \\$90 \\\\ \\text{Put:} & \\text{ Long strike } \\$85,\\text{ premium } \\$4 \\\\ \\text{Total cost:} & \\$90 + \\$4 = \\$94\\text{ per share} \\end{aligned}' },
          { step: 2, description: 'Minimum outcome (downside)', detail: 'If stock falls below strike', latex: '\\begin{aligned} \\text{Stock value:} & \\text{ Can sell at } \\$85\\text{ (put)} \\\\ \\text{Net outcome:} & \\$85 - \\$94 = -\\$9\\text{ per share} \\\\ \\text{Total loss:} & -\\$9 \\times 100 = -\\$900 \\end{aligned}' },
          { step: 3, description: 'Maximum outcome (upside)', detail: 'Unlimited upside potential', latex: '\\text{If } S_T \\to \\infty: \\text{ Profit} = (S_T - \\$94) \\times 100 \\to \\text{unlimited}' },
          { step: 4, description: 'Breakeven point', detail: 'Stock price for zero profit', latex: '\\text{Breakeven: } S_T = \\$94' }
        ],
        answer: 'Min: -$900, Max: Unlimited (upside)',
        explanation: 'The protective put limits downside loss to $900 while retaining unlimited upside. This strategy provides insurance against stock price decline.'
      }
    },
    {
      id: 5,
      title: 'Covered Call Strategy',
      difficulty: 'advanced',
      category: 'Option Strategies',
      type: 'Application',
      problem: 'You own 500 shares of XYZ at $65/share. You write (sell) 5 call option contracts (100 shares each) with strike $70 for $3 per share. Calculate profit/loss if at expiration: (A) Stock is at $60, (B) Stock is at $72.',
      hint: 'Covered call = Long stock + Short call. Generates income but caps upside.',
      solution: {
        steps: [
          { step: 1, description: 'Strategy setup', detail: 'Initial position and premium collected', latex: '\\begin{aligned} \\text{Stock:} & \\text{ 500 shares at } \\$65 \\\\ \\text{Calls:} & \\text{ Short 500 shares at } K = \\$70 \\\\ \\text{Premium:} & \\$3 \\times 500 = \\$1,500\\text{ income} \\end{aligned}' },
          { step: 2, description: 'Scenario A: Stock at $60', detail: 'Below strike, calls expire worthless', latex: '\\begin{aligned} \\text{Stock P/L:} & (\\$60 - \\$65) \\times 500 = -\\$2,500 \\\\ \\text{Call P/L:} & \\text{Keep premium: } +\\$1,500 \\\\ \\text{Total P/L:} & -\\$2,500 + \\$1,500 = -\\$1,000 \\end{aligned}' },
          { step: 3, description: 'Scenario B: Stock at $72', detail: 'Above strike, calls exercised', latex: '\\begin{aligned} \\text{Stock sold at:} & \\$70\\text{ (called away)} \\\\ \\text{Stock P/L:} & (\\$70 - \\$65) \\times 500 = +\\$2,500 \\\\ \\text{Call P/L:} & \\text{Keep premium: } +\\$1,500 \\\\ \\text{Total P/L:} & \\$2,500 + \\$1,500 = \\$4,000 \\end{aligned}' },
          { step: 4, description: 'Maximum profit analysis', detail: 'Capped at strike plus premium', latex: '\\text{Max profit occurs when } S_T \\geq \\$70: \\quad \\$4,000' }
        ],
        answer: '(A) -$1,000, (B) $4,000 (capped)',
        explanation: 'In scenario A, the premium partially offsets the stock loss. In scenario B, profit is capped at $4,000 even though the stock is worth $72. The covered call trades upside potential for premium income.'
      }
    },
    {
      id: 6,
      title: 'Intrinsic vs Time Value',
      difficulty: 'beginner',
      category: 'Option Pricing',
      type: 'Conceptual',
      problem: 'A call option with strike $100 trades for $8 when the stock price is $105. The option has 3 months until expiration. Calculate the intrinsic value and time value of this option.',
      hint: 'Intrinsic value = max(S - K, 0) for calls. Time value = Option price - Intrinsic value.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Stock, strike, and option price', latex: '\\begin{aligned} S &= \\$105 \\\\ K &= \\$100 \\\\ C &= \\$8 \\end{aligned}' },
          { step: 2, description: 'Calculate intrinsic value', detail: 'In-the-money amount', latex: '\\text{Intrinsic Value} = \\max(S - K, 0) = \\max(\\$105 - \\$100, 0) = \\$5' },
          { step: 3, description: 'Calculate time value', detail: 'Difference from option price', latex: '\\text{Time Value} = C - \\text{Intrinsic Value} = \\$8 - \\$5 = \\$3' },
          { step: 4, description: 'Interpretation', detail: 'Components of option value', latex: '\\begin{aligned} &\\text{Intrinsic: Immediate exercise value (\\$5)} \\\\ &\\text{Time: Value of optionality (\\$3)} \\\\ &\\text{Total: } \\$5 + \\$3 = \\$8 \\end{aligned}' }
        ],
        answer: 'Intrinsic: $5, Time value: $3',
        explanation: 'The option is worth $8 total, consisting of $5 intrinsic value (amount in-the-money) and $3 time value (premium for the possibility of further gains before expiration).'
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
                <h1 className="text-2xl font-bold text-gray-900">Derivatives & Options</h1>
                <p className="text-sm text-gray-500">Derivative securities & pricing</p>
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
                      <p className="text-gray-600">Master derivatives concepts through hands-on problem solving</p>
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
