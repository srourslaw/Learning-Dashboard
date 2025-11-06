import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  PieChart, 
  Shield, 
  TrendingUp, 
  BarChart3, 
  Target, 
  Activity,
  GraduationCap,
  Calculator,
  Check,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { DisplayEquation } from '../components/MathEquation';

export default function PortfolioDiversification() {
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
    { id: 'principles', label: 'Diversification Principles', icon: PieChart, color: 'from-green-600 to-emerald-600' },
    { id: 'correlation', label: 'Correlation Analysis', icon: TrendingUp, color: 'from-purple-600 to-pink-600' },
    { id: 'risk-reduction', label: 'Risk Reduction', icon: Shield, color: 'from-orange-600 to-red-600' },
    { id: 'strategies', label: 'Diversification Strategies', icon: Target, color: 'from-teal-600 to-cyan-600' },
    { id: 'measurement', label: 'Measuring Benefits', icon: BarChart3, color: 'from-indigo-600 to-purple-600' },
    { id: 'practice', label: 'Practice Problems', icon: GraduationCap, color: 'from-violet-600 to-purple-600' }
  ];

  // Practice Problems Data - showing first 2 for brevity, full version would have 6
  const practiceProblems = [
    {
      id: 1,
      title: 'Correlation and Portfolio Risk',
      difficulty: 'beginner',
      category: 'Correlation',
      type: 'Calculation',
      problem: 'Two assets each have a standard deviation of 20%. Calculate portfolio risk for equal weights (50% each) when correlation is: (a) ρ=1.0, (b) ρ=0.5, (c) ρ=0, (d) ρ=-1.0.',
      hint: 'Portfolio variance formula: σ²p = w₁²σ₁² + w₂²σ₂² + 2w₁w₂ρσ₁σ₂',
      solution: {
        steps: [
          { step: 1, description: 'Given parameters', detail: 'Weights and standard deviations', latex: '\\\\begin{aligned} w_1 = w_2 &= 0.50 \\\\\\\\ \\\\sigma_1 = \\\\sigma_2 &= 0.20 = 20\\\\% \\\\end{aligned}' },
          { step: 2, description: 'Portfolio variance formula', detail: 'With correlation parameter', latex: '\\\\sigma_p^2 = (0.5)^2(0.2)^2 + (0.5)^2(0.2)^2 + 2(0.5)(0.5)\\\\rho(0.2)(0.2) = 0.02(1 + \\\\rho)' },
          { step: 3, description: 'Calculate for each correlation', detail: 'Evaluate portfolio risk', latex: '\\\\begin{aligned} \\\\rho = 1.0: & \\\\quad \\\\sigma_p = \\\\sqrt{0.02(2)} = 0.20 = 20\\\\% \\\\\\\\ \\\\rho = 0.5: & \\\\quad \\\\sigma_p = \\\\sqrt{0.02(1.5)} = 0.173 = 17.3\\\\% \\\\\\\\ \\\\rho = 0.0: & \\\\quad \\\\sigma_p = \\\\sqrt{0.02(1)} = 0.141 = 14.1\\\\% \\\\\\\\ \\\\rho = -1.0: & \\\\quad \\\\sigma_p = \\\\sqrt{0.02(0)} = 0 = 0\\\\% \\\\end{aligned}' }
        ],
        answer: '20%, 17.3%, 14.1%, 0%',
        explanation: 'Lower correlation provides greater diversification benefits. Perfect negative correlation (ρ=-1) eliminates all risk.'
      }
    },
    {
      id: 2,
      title: 'Diversification Benefit Measurement',
      difficulty: 'intermediate',
      category: 'Risk Reduction',
      type: 'Calculation',
      problem: 'Stock A: σ=30%, Stock B: σ=25%, correlation ρ=0.3. For equal weights, calculate: (a) average stand-alone risk, (b) portfolio risk, (c) risk reduction benefit.',
      hint: 'Compare portfolio risk to the weighted average of individual risks.',
      solution: {
        steps: [
          { step: 1, description: 'Calculate average stand-alone risk', detail: 'Weighted average of individual σ', latex: '\\\\text{Avg risk} = 0.5(0.30) + 0.5(0.25) = 0.275 = 27.5\\\\%' },
          { step: 2, description: 'Portfolio variance', detail: 'Using correlation', latex: '\\\\sigma_p^2 = (0.5)^2(0.3)^2 + (0.5)^2(0.25)^2 + 2(0.5)(0.5)(0.3)(0.3)(0.25) = 0.0510' },
          { step: 3, description: 'Portfolio risk', detail: 'Take square root', latex: '\\\\sigma_p = \\\\sqrt{0.0510} = 0.226 = 22.6\\\\%' },
          { step: 4, description: 'Diversification benefit', detail: 'Risk reduction achieved', latex: '\\\\text{Benefit} = 27.5\\\\% - 22.6\\\\% = 4.9\\\\%' }
        ],
        answer: '27.5%, 22.6%, 4.9%',
        explanation: 'Diversification reduces risk by 4.9 percentage points compared to average stand-alone risk.'
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
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Diversification</h1>
                <p className="text-sm text-gray-500">Risk management through diversification</p>
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

            {/* Practice Problems Section - Same structure as other pages */}
            {activeSection === 'practice' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl">
                      <GraduationCap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Practice Problems</h2>
                      <p className="text-gray-600">Master diversification concepts through hands-on problem solving</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty Level</label>
                      <select value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none">
                        <option value="all">All Levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                      <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}
                        className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-violet-500 focus:outline-none">
                        <option value="all">All Categories</option>
                        {[...new Set(practiceProblems.map(p => p.category))].map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {practiceProblems.filter(p => (selectedDifficulty === 'all' || p.difficulty === selectedDifficulty) &&
                                   (selectedCategory === 'all' || p.category === selectedCategory)).map(problem => {
                        const isExpanded = expandedProblems[problem.id];
                        const isCompleted = completedProblems[problem.id];
                        const hintShown = shownHints[problem.id];

                        return (
                          <div key={problem.id} className={`border-2 rounded-2xl overflow-hidden transition-all ${
                              isCompleted ? 'border-green-400 bg-green-50' : isExpanded ? 'border-violet-400 bg-violet-50' : 'border-gray-200 bg-white hover:border-violet-300'}`}>
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
                                      problem.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
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
                                <button onClick={() => setShownHints(prev => ({ ...prev, [problem.id]: !hintShown }))}
                                  className="flex items-center gap-2 px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-lg transition-colors font-semibold text-sm">
                                  <Info className="w-4 h-4" />
                                  {hintShown ? 'Hide Hint' : 'Show Hint'}
                                </button>
                                <button onClick={() => setExpandedProblems(prev => ({ ...prev, [problem.id]: !isExpanded }))}
                                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors font-semibold text-sm">
                                  {isExpanded ? <><ChevronUp className="w-4 h-4" />Hide Solution</> : <><ChevronDown className="w-4 h-4" />Show Solution</>}
                                </button>
                                <button onClick={() => setCompletedProblems(prev => ({ ...prev, [problem.id]: !isCompleted }))}
                                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors font-semibold text-sm ml-auto ${
                                    isCompleted ? 'bg-gray-200 hover:bg-gray-300 text-gray-700' : 'bg-green-100 hover:bg-green-200 text-green-700'}`}>
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

                  {practiceProblems.filter(p => (selectedDifficulty === 'all' || p.difficulty === selectedDifficulty) &&
                    (selectedCategory === 'all' || p.category === selectedCategory)).length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-gray-400 mb-4"><GraduationCap className="w-16 h-16 mx-auto" /></div>
                      <p className="text-gray-600 font-semibold">No problems match your filters</p>
                      <p className="text-gray-500 text-sm">Try adjusting your difficulty or category filters</p>
                    </div>
                  )}
                </div>

                <div className="bg-gradient-to-r from-violet-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-6">Your Progress</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
                      <div className="text-4xl font-bold mb-2">{Object.keys(completedProblems).filter(k => completedProblems[k]).length}</div>
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
