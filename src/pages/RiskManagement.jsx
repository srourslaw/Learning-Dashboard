import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, TrendingDown, Target, BarChart3, AlertTriangle, Activity, GraduationCap, Calculator, Check, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { DisplayEquation } from '../components/MathEquation';

export default function RiskManagement() {
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
    { id: 'types', label: 'Types of Risk', icon: AlertTriangle, color: 'from-green-600 to-emerald-600' },
    { id: 'hedging', label: 'Hedging Strategies', icon: Shield, color: 'from-purple-600 to-pink-600' },
    { id: 'derivatives', label: 'Using Derivatives', icon: TrendingDown, color: 'from-orange-600 to-red-600' },
    { id: 'measurement', label: 'Risk Measurement', icon: BarChart3, color: 'from-teal-600 to-cyan-600' },
    { id: 'implementation', label: 'Implementation', icon: Target, color: 'from-indigo-600 to-purple-600' },
    { id: 'practice', label: 'Practice Problems', icon: GraduationCap, color: 'from-violet-600 to-purple-600' }
  ];

  // Practice Problems Data
  const practiceProblems = [
    {
      id: 1,
      title: 'Currency Hedge with Forward Contracts',
      difficulty: 'beginner',
      category: 'Currency Risk',
      type: 'Calculation',
      problem: 'A US company expects to receive EUR 5 million in 6 months. The current spot rate is 1.10 USD/EUR, and the 6-month forward rate is 1.08 USD/EUR. If the company hedges using a forward contract, how much USD will it receive?',
      hint: 'Forward contracts lock in the exchange rate today for future delivery.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Foreign currency amount and forward rate', latex: '\\begin{aligned} \\text{EUR Amount} &= \\text{EUR } 5\\text{ million} \\\\ \\text{Forward Rate} &= 1.08\\text{ USD/EUR} \\end{aligned}' },
          { step: 2, description: 'Calculate USD received', detail: 'Multiply by forward rate', latex: '\\text{USD Received} = \\text{EUR } 5 \\times 1.08 = \\text{USD } 5.4\\text{ million}' },
          { step: 3, description: 'Compare to spot rate scenario', detail: 'Without hedge at current spot', latex: '\\text{At Spot} = \\text{EUR } 5 \\times 1.10 = \\text{USD } 5.5\\text{ million}' }
        ],
        answer: 'USD 5.4 million',
        explanation: 'By hedging with a forward contract, the company locks in USD 5.4 million, eliminating currency risk. The forward rate is lower than the spot, reflecting the market expectation of EUR depreciation.'
      }
    },
    {
      id: 2,
      title: 'Hedge Ratio Calculation',
      difficulty: 'intermediate',
      category: 'Hedging Strategy',
      type: 'Calculation',
      problem: 'A portfolio worth $10 million has a beta of 1.2. To reduce portfolio beta to 0.8 using S&P 500 futures (each contract worth $250,000), how many futures contracts should be shorted?',
      hint: 'Hedge ratio = (Target beta - Current beta) × Portfolio value / (Beta of futures × Contract value). Futures beta = 1.0.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Portfolio and target values', latex: '\\begin{aligned} V_P &= \\$10\\text{ million} \\\\ \\beta_{\\text{current}} &= 1.2,\\quad \\beta_{\\text{target}} = 0.8 \\\\ \\beta_{\\text{futures}} &= 1.0,\\quad V_{\\text{contract}} = \\$250,000 \\end{aligned}' },
          { step: 2, description: 'Calculate beta change needed', detail: 'Reduction in systematic risk', latex: '\\Delta\\beta = \\beta_{\\text{target}} - \\beta_{\\text{current}} = 0.8 - 1.2 = -0.4' },
          { step: 3, description: 'Hedge ratio formula', detail: 'Number of futures contracts', latex: 'N = \\frac{\\Delta\\beta \\times V_P}{\\beta_{\\text{futures}} \\times V_{\\text{contract}}}' },
          { step: 4, description: 'Calculate number of contracts', detail: 'Substitute and compute', latex: 'N = \\frac{-0.4 \\times \\$10,000,000}{1.0 \\times \\$250,000} = \\frac{-\\$4,000,000}{\\$250,000} = -16' }
        ],
        answer: 'Short 16 futures contracts',
        explanation: 'Short 16 S&P 500 futures contracts to reduce the portfolio beta from 1.2 to 0.8. The negative sign indicates shorting (selling) futures.'
      }
    },
    {
      id: 3,
      title: 'Value at Risk (VaR) Calculation',
      difficulty: 'intermediate',
      category: 'Risk Measurement',
      type: 'Calculation',
      problem: 'A portfolio has a value of $50 million, expected daily return of 0.05%, and daily standard deviation of 1.5%. Calculate the 1-day 95% VaR (z-score = 1.65 for 95% confidence).',
      hint: 'VaR = Portfolio Value × (Expected Return - z × Standard Deviation). Use negative of this for loss amount.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Portfolio value, return, and volatility', latex: '\\begin{aligned} V &= \\$50\\text{ million} \\\\ \\mu &= 0.05\\% = 0.0005 \\\\ \\sigma &= 1.5\\% = 0.015 \\\\ z_{95} &= 1.65 \\end{aligned}' },
          { step: 2, description: 'VaR formula', detail: 'Maximum expected loss at 95% confidence', latex: 'VaR = V \\times (z \\times \\sigma - \\mu)' },
          { step: 3, description: 'Calculate critical return', detail: 'Return at 5th percentile', latex: 'R_{\\text{critical}} = \\mu - z \\times \\sigma = 0.0005 - 1.65 \\times 0.015 = 0.0005 - 0.02475 = -0.02425' },
          { step: 4, description: 'Calculate VaR', detail: 'Maximum loss with 95% confidence', latex: 'VaR = \\$50,000,000 \\times 0.02425 = \\$1,212,500' }
        ],
        answer: '$1,212,500',
        explanation: 'The 1-day 95% VaR is $1,212,500. This means there is only a 5% chance that the portfolio will lose more than $1.21 million in a single day.'
      }
    },
    {
      id: 4,
      title: 'Hedging with Futures - Minimum Variance Hedge',
      difficulty: 'advanced',
      category: 'Hedging Strategy',
      type: 'Calculation',
      problem: 'A corn farmer expects to harvest 100,000 bushels in 3 months. Spot price is $6/bushel. Futures price is $6.20/bushel (each contract = 5,000 bushels). The correlation between spot and futures is 0.85, spot σ = 0.40, futures σ = 0.35. Calculate the minimum variance hedge ratio and number of contracts.',
      hint: 'Optimal hedge ratio h = ρ × (σ_spot / σ_futures). Then calculate contracts needed.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Quantities, prices, and risk metrics', latex: '\\begin{aligned} Q &= 100,000\\text{ bushels} \\\\ \\rho &= 0.85,\\quad \\sigma_S = 0.40,\\quad \\sigma_F = 0.35 \\\\ \\text{Contract size} &= 5,000\\text{ bushels} \\end{aligned}' },
          { step: 2, description: 'Minimum variance hedge ratio', detail: 'Optimal hedge percentage', latex: 'h^* = \\rho \\times \\frac{\\sigma_S}{\\sigma_F} = 0.85 \\times \\frac{0.40}{0.35} = 0.85 \\times 1.143 = 0.971' },
          { step: 3, description: 'Quantity to hedge', detail: 'Apply hedge ratio to exposure', latex: '\\text{Hedge Quantity} = h^* \\times Q = 0.971 \\times 100,000 = 97,100\\text{ bushels}' },
          { step: 4, description: 'Number of futures contracts', detail: 'Round to whole contracts', latex: 'N = \\frac{97,100}{5,000} = 19.42 \\approx 19\\text{ contracts}' }
        ],
        answer: 'Hedge ratio: 0.971, Short 19 futures contracts',
        explanation: 'The minimum variance hedge ratio is 0.971, suggesting the farmer should hedge 97.1% of the crop by shorting 19 futures contracts. This balances risk reduction against correlation imperfections.'
      }
    },
    {
      id: 5,
      title: 'Beta Hedging with Index Futures',
      difficulty: 'advanced',
      category: 'Portfolio Hedging',
      type: 'Application',
      problem: 'A $20M equity portfolio consists of: Tech stocks $12M (β=1.5), Utilities $8M (β=0.6). The manager wants to hedge to zero beta for 3 months. S&P 500 futures price is 4,500 (multiplier $250). How many contracts?',
      hint: 'First calculate portfolio beta, then determine contracts needed to offset it completely.',
      solution: {
        steps: [
          { step: 1, description: 'Calculate portfolio beta', detail: 'Weighted average of component betas', latex: '\\beta_P = \\frac{\\$12M}{\\$20M} \\times 1.5 + \\frac{\\$8M}{\\$20M} \\times 0.6 = 0.6 \\times 1.5 + 0.4 \\times 0.6 = 0.9 + 0.24 = 1.14' },
          { step: 2, description: 'Target beta change', detail: 'Reduce to zero beta', latex: '\\Delta\\beta = 0 - 1.14 = -1.14' },
          { step: 3, description: 'Futures contract value', detail: 'Dollar value per contract', latex: 'V_{\\text{contract}} = 4,500 \\times \\$250 = \\$1,125,000' },
          { step: 4, description: 'Number of contracts needed', detail: 'Complete hedge calculation', latex: 'N = \\frac{\\Delta\\beta \\times V_P}{\\beta_{\\text{futures}} \\times V_{\\text{contract}}} = \\frac{-1.14 \\times \\$20,000,000}{1.0 \\times \\$1,125,000} = \\frac{-\\$22,800,000}{\\$1,125,000} = -20.27' },
          { step: 5, description: 'Final recommendation', detail: 'Round to nearest contract', latex: 'N \\approx -20\\text{ contracts (short)}' }
        ],
        answer: 'Short 20 S&P 500 futures contracts',
        explanation: 'Short 20 S&P 500 futures contracts to achieve a zero-beta hedge. This eliminates systematic market risk while retaining stock-specific risk in the portfolio.'
      }
    },
    {
      id: 6,
      title: 'Operational Hedging Decision',
      difficulty: 'beginner',
      category: 'Operational Hedging',
      type: 'Conceptual',
      problem: 'A US car manufacturer sources parts from Germany (EUR) and Japan (JPY), sells in US (USD). It\'s considering: (A) Building a plant in Europe, (B) Financial hedging with forwards, (C) Doing nothing. Discuss the operational hedge benefits of option A.',
      hint: 'Operational hedges create natural offsets by matching currency of costs and revenues.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the currency mismatch', detail: 'Current exposure structure', latex: '\\begin{aligned} \\text{Costs:} & \\text{ EUR, JPY} \\\\ \\text{Revenues:} & \\text{ USD} \\\\ \\text{Risk:} & \\text{ EUR and JPY appreciation hurts profits} \\end{aligned}' },
          { step: 2, description: 'Option A: European plant benefits', detail: 'Create natural hedge', latex: '\\begin{aligned} &\\text{New EUR costs (labor, materials)} \\\\ &\\text{Potential EUR revenues (European sales)} \\\\ &\\text{Reduces net EUR exposure} \\end{aligned}' },
          { step: 3, description: 'Compare to financial hedging (B)', detail: 'Advantages of operational hedge', latex: '\\begin{aligned} &\\text{1. Long-term, doesn\'t need renewal} \\\\ &\\text{2. No transaction costs} \\\\ &\\text{3. Competitive advantage in EUR market} \\\\ &\\text{4. Diversifies production risk} \\end{aligned}' }
        ],
        answer: 'Option A provides a natural hedge by matching EUR costs with EUR revenues',
        explanation: 'Building a European plant creates an operational hedge by generating EUR revenues to offset EUR costs. This is more sustainable than financial hedges, which require ongoing management and costs. However, it requires significant capital investment and strategic commitment.'
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
                <h1 className="text-2xl font-bold text-gray-900">Risk Management & Hedging</h1>
                <p className="text-sm text-gray-500">Corporate risk management strategies</p>
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
                      <p className="text-gray-600">Master risk management concepts through hands-on problem solving</p>
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
