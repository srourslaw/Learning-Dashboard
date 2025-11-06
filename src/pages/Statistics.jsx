import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BarChart3, TrendingUp, PieChart, Calculator, Shield, Activity, GraduationCap, Check, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { DisplayEquation } from '../components/MathEquation';

export default function Statistics() {
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
    { id: 'descriptive', label: 'Descriptive Statistics', icon: BarChart3, color: 'from-green-600 to-emerald-600' },
    { id: 'distributions', label: 'Probability Distributions', icon: PieChart, color: 'from-purple-600 to-pink-600' },
    { id: 'regression', label: 'Regression Analysis', icon: TrendingUp, color: 'from-orange-600 to-red-600' },
    { id: 'variance', label: 'Variance & Covariance', icon: Calculator, color: 'from-teal-600 to-cyan-600' },
    { id: 'risk-metrics', label: 'Risk Metrics', icon: Shield, color: 'from-indigo-600 to-purple-600' },
    { id: 'practice', label: 'Practice Problems', icon: GraduationCap, color: 'from-violet-600 to-purple-600' }
  ];

  // Practice Problems Data
  const practiceProblems = [
    {
      id: 1,
      title: 'Mean and Variance Calculation',
      difficulty: 'beginner',
      category: 'Descriptive Statistics',
      type: 'Calculation',
      problem: 'A stock has the following returns over 5 years: 8%, 12%, -5%, 15%, 10%. Calculate the mean return and the variance of returns.',
      hint: 'Mean = sum of returns / number of observations. Variance = average of squared deviations from mean.',
      solution: {
        steps: [
          { step: 1, description: 'List the returns', detail: 'Annual returns', latex: 'R = \\{8\\%, 12\\%, -5\\%, 15\\%, 10\\%\\}' },
          { step: 2, description: 'Calculate the mean', detail: 'Average return', latex: '\\bar{R} = \\frac{8 + 12 + (-5) + 15 + 10}{5} = \\frac{40}{5} = 8\\%' },
          { step: 3, description: 'Calculate deviations from mean', detail: 'Each return minus mean', latex: '\\begin{aligned} &(8-8)^2 = 0 \\\\ &(12-8)^2 = 16 \\\\ &(-5-8)^2 = 169 \\\\ &(15-8)^2 = 49 \\\\ &(10-8)^2 = 4 \\end{aligned}' },
          { step: 4, description: 'Calculate variance', detail: 'Average of squared deviations', latex: '\\sigma^2 = \\frac{0 + 16 + 169 + 49 + 4}{5} = \\frac{238}{5} = 47.6' },
          { step: 5, description: 'Calculate standard deviation', detail: 'Square root of variance', latex: '\\sigma = \\sqrt{47.6} = 6.90\\%' }
        ],
        answer: 'Mean: 8%, Variance: 47.6, Std Dev: 6.90%',
        explanation: 'The mean return is 8% per year. The variance of 47.6 (or standard deviation of 6.90%) measures the volatility of returns around the mean.'
      }
    },
    {
      id: 2,
      title: 'Normal Distribution Probabilities',
      difficulty: 'intermediate',
      category: 'Probability Distributions',
      type: 'Calculation',
      problem: 'Stock returns are normally distributed with mean 10% and standard deviation 20%. What is the probability that the return will be: (A) Less than 0%? (B) Greater than 30%? Use z-table: P(Z < -0.5) = 0.3085, P(Z < 1.0) = 0.8413.',
      hint: 'Convert to z-score: z = (X - μ) / σ. Then use the z-table.',
      solution: {
        steps: [
          { step: 1, description: 'Identify distribution parameters', detail: 'Mean and standard deviation', latex: '\\begin{aligned} \\mu &= 10\\% \\\\ \\sigma &= 20\\% \\end{aligned}' },
          { step: 2, description: 'Part A: Calculate z-score for 0%', detail: 'Standardize the value', latex: 'z = \\frac{X - \\mu}{\\sigma} = \\frac{0 - 10}{20} = \\frac{-10}{20} = -0.5' },
          { step: 3, description: 'Part A: Find probability', detail: 'From z-table', latex: 'P(R < 0\\%) = P(Z < -0.5) = 0.3085 = 30.85\\%' },
          { step: 4, description: 'Part B: Calculate z-score for 30%', detail: 'Standardize the value', latex: 'z = \\frac{30 - 10}{20} = \\frac{20}{20} = 1.0' },
          { step: 5, description: 'Part B: Find probability', detail: 'Upper tail probability', latex: 'P(R > 30\\%) = 1 - P(Z < 1.0) = 1 - 0.8413 = 0.1587 = 15.87\\%' }
        ],
        answer: '(A) 30.85%, (B) 15.87%',
        explanation: 'There is a 30.85% chance of a negative return and a 15.87% chance of returns exceeding 30%. These probabilities come from the normal distribution.'
      }
    },
    {
      id: 3,
      title: 'Covariance and Correlation',
      difficulty: 'intermediate',
      category: 'Variance & Covariance',
      type: 'Calculation',
      problem: 'Two stocks have the following returns over 4 periods: Stock A: {10%, 5%, 8%, 12%}, Stock B: {15%, 10%, 12%, 18%}. Calculate the covariance and correlation between the two stocks.',
      hint: 'Cov(A,B) = E[(A - μ_A)(B - μ_B)]. Correlation = Cov(A,B) / (σ_A × σ_B).',
      solution: {
        steps: [
          { step: 1, description: 'Calculate means', detail: 'Average for each stock', latex: '\\begin{aligned} \\bar{R}_A &= \\frac{10 + 5 + 8 + 12}{4} = 8.75\\% \\\\ \\bar{R}_B &= \\frac{15 + 10 + 12 + 18}{4} = 13.75\\% \\end{aligned}' },
          { step: 2, description: 'Calculate deviations', detail: 'From mean for each period', latex: '\\begin{aligned} \\text{Period 1:} & (10-8.75)(15-13.75) = (1.25)(1.25) = 1.5625 \\\\ \\text{Period 2:} & (5-8.75)(10-13.75) = (-3.75)(-3.75) = 14.0625 \\\\ \\text{Period 3:} & (8-8.75)(12-13.75) = (-0.75)(-1.75) = 1.3125 \\\\ \\text{Period 4:} & (12-8.75)(18-13.75) = (3.25)(4.25) = 13.8125 \\end{aligned}' },
          { step: 3, description: 'Calculate covariance', detail: 'Average of cross-products', latex: 'Cov(A,B) = \\frac{1.5625 + 14.0625 + 1.3125 + 13.8125}{4} = \\frac{30.75}{4} = 7.6875' },
          { step: 4, description: 'Calculate standard deviations', detail: 'Volatility of each stock', latex: '\\begin{aligned} \\sigma_A &= \\sqrt{\\frac{(1.25)^2 + (-3.75)^2 + (-0.75)^2 + (3.25)^2}{4}} = 2.78 \\\\ \\sigma_B &= \\sqrt{\\frac{(1.25)^2 + (-3.75)^2 + (-1.75)^2 + (4.25)^2}{4}} = 3.28 \\end{aligned}' },
          { step: 5, description: 'Calculate correlation', detail: 'Standardized covariance', latex: '\\rho_{AB} = \\frac{Cov(A,B)}{\\sigma_A \\sigma_B} = \\frac{7.6875}{2.78 \\times 3.28} = \\frac{7.6875}{9.12} = 0.843' }
        ],
        answer: 'Covariance: 7.69, Correlation: 0.843',
        explanation: 'The positive covariance (7.69) and high correlation (0.843) indicate that the stocks tend to move together. They provide limited diversification benefits.'
      }
    },
    {
      id: 4,
      title: 'Linear Regression Interpretation',
      difficulty: 'beginner',
      category: 'Regression Analysis',
      type: 'Conceptual',
      problem: 'A regression of stock returns on market returns gives: Return = 2% + 1.3 × Market Return, with R² = 0.65. Interpret (A) the intercept (alpha), (B) the slope (beta), and (C) the R².',
      hint: 'Alpha is excess return, beta is market sensitivity, R² is proportion of variance explained.',
      solution: {
        steps: [
          { step: 1, description: 'Regression equation', detail: 'CAPM-style regression', latex: 'R_i = \\alpha + \\beta R_M + \\epsilon' },
          { step: 2, description: 'Interpret alpha (intercept)', detail: 'Excess return above market', latex: '\\alpha = 2\\%: \\text{ Stock earns 2\\% more than predicted by market exposure}' },
          { step: 3, description: 'Interpret beta (slope)', detail: 'Market sensitivity', latex: '\\beta = 1.3: \\text{ Stock is 30\\% more volatile than market; 1\\% market move } \\to 1.3\\% \\text{ stock move}' },
          { step: 4, description: 'Interpret R²', detail: 'Goodness of fit', latex: 'R^2 = 0.65: \\text{ 65\\% of stock return variance is explained by market returns}' }
        ],
        answer: 'Alpha: 2% excess return, Beta: 1.3 (30% more volatile), R²: 65% explained',
        explanation: 'The stock has positive alpha (outperformance), high beta (aggressive), and moderate R² (some returns are driven by market, but 35% is stock-specific).'
      }
    },
    {
      id: 5,
      title: 'Confidence Intervals for Mean Return',
      difficulty: 'advanced',
      category: 'Hypothesis Testing',
      type: 'Calculation',
      problem: 'A sample of 36 monthly returns has mean 1.2% and standard deviation 4%. Construct a 95% confidence interval for the true mean monthly return. Use z = 1.96 for 95% confidence.',
      hint: 'CI = mean ± (z × σ / √n), where n is sample size.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Sample statistics', latex: '\\begin{aligned} \\bar{R} &= 1.2\\% \\\\ \\sigma &= 4\\% \\\\ n &= 36 \\\\ z_{0.95} &= 1.96 \\end{aligned}' },
          { step: 2, description: 'Calculate standard error', detail: 'Standard deviation of the mean', latex: 'SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{4\\%}{\\sqrt{36}} = \\frac{4\\%}{6} = 0.667\\%' },
          { step: 3, description: 'Calculate margin of error', detail: 'Confidence interval half-width', latex: 'ME = z \\times SE = 1.96 \\times 0.667\\% = 1.307\\%' },
          { step: 4, description: 'Construct confidence interval', detail: 'Mean ± margin of error', latex: '\\begin{aligned} \\text{Lower bound:} & 1.2\\% - 1.307\\% = -0.107\\% \\\\ \\text{Upper bound:} & 1.2\\% + 1.307\\% = 2.507\\% \\end{aligned}' }
        ],
        answer: '95% CI: [-0.11%, 2.51%]',
        explanation: 'We are 95% confident that the true mean monthly return is between -0.11% and 2.51%. The interval includes zero, suggesting the positive sample mean might be due to chance.'
      }
    },
    {
      id: 6,
      title: 'Hypothesis Test for Mean Return',
      difficulty: 'advanced',
      category: 'Hypothesis Testing',
      type: 'Application',
      problem: 'An investor claims a strategy has mean return > 0%. A sample of 25 returns shows mean 0.8% and std dev 3%. Test at 5% significance (critical z = 1.645 for one-tailed test). Should we reject H₀: μ ≤ 0%?',
      hint: 'Calculate test statistic z = (sample mean - hypothesized mean) / SE. Compare to critical value.',
      solution: {
        steps: [
          { step: 1, description: 'Set up hypotheses', detail: 'Null and alternative', latex: '\\begin{aligned} H_0: & \\mu \\leq 0\\% \\\\ H_1: & \\mu > 0\\% \\text{ (one-tailed)} \\end{aligned}' },
          { step: 2, description: 'Calculate standard error', detail: 'SE of the sample mean', latex: 'SE = \\frac{\\sigma}{\\sqrt{n}} = \\frac{3\\%}{\\sqrt{25}} = \\frac{3\\%}{5} = 0.6\\%' },
          { step: 3, description: 'Calculate test statistic', detail: 'z-score for observed mean', latex: 'z = \\frac{\\bar{R} - \\mu_0}{SE} = \\frac{0.8\\% - 0\\%}{0.6\\%} = \\frac{0.8}{0.6} = 1.333' },
          { step: 4, description: 'Compare to critical value', detail: 'Decision rule', latex: '\\begin{aligned} z_{\\text{calculated}} &= 1.333 \\\\ z_{\\text{critical}} &= 1.645 \\\\ 1.333 &< 1.645 \\end{aligned}' },
          { step: 5, description: 'Make decision', detail: 'Fail to reject null hypothesis', latex: '\\text{Since } z < 1.645, \\text{ we fail to reject } H_0' }
        ],
        answer: 'Fail to reject H₀. Insufficient evidence that mean > 0%',
        explanation: 'The test statistic (1.333) is less than the critical value (1.645), so we cannot conclude with 95% confidence that the strategy has positive mean returns. The observed 0.8% could be due to random chance.'
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
                <h1 className="text-2xl font-bold text-gray-900">Statistical Review & Risk</h1>
                <p className="text-sm text-gray-500">Statistical concepts for financial analysis</p>
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
                      <p className="text-gray-600">Master statistics concepts through hands-on problem solving</p>
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
