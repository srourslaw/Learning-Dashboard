import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  TrendingUp,
  PieChart,
  BarChart3,
  LineChart as LineChartIcon,
  Target,
  Shield,
  Activity,
  GraduationCap,
  Calculator,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  Link2
} from 'lucide-react';
import { DisplayEquation } from '../components/MathEquation';

export default function PortfolioTheory() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('overview');

  // Portfolio Calculator State
  const [calculatorTab, setCalculatorTab] = useState('simulation'); // simulation, calculators
  const [numStocks, setNumStocks] = useState(2);
  const [timePeriod, setTimePeriod] = useState(1); // years
  const [frequency, setFrequency] = useState('daily'); // daily, weekly, monthly
  const [stocks, setStocks] = useState([
    { id: 1, name: 'Stock A', hasDividends: false, prices: [], dividends: [], returns: [], dates: [] },
    { id: 2, name: 'Stock B', hasDividends: false, prices: [], dividends: [], returns: [], dates: [] }
  ]);
  const [pricesGenerated, setPricesGenerated] = useState(false);
  const [selectedStockView, setSelectedStockView] = useState(null);
  const [showAllRows, setShowAllRows] = useState(false);

  // Interactive Return Calculators State
  const [simpleCalc, setSimpleCalc] = useState({ p0: 100, p1: 110, dividend: 2 });
  const [logCalc, setLogCalc] = useState({ p0: 100, p1: 110, dividend: 2 });
  const [geometricCalc, setGeometricCalc] = useState({ returns: '0.05, 0.10, -0.03, 0.08' });
  const [expectedCalc, setExpectedCalc] = useState({ returns: '0.12, 0.08, -0.05, 0.15, 0.10' });

  // Variance and Standard Deviation Calculators State
  const [varianceCalc, setVarianceCalc] = useState({ returns: '0.12, 0.08, -0.05, 0.15, 0.10' });
  const [stdDevCalc, setStdDevCalc] = useState({ returns: '0.12, 0.08, -0.05, 0.15, 0.10' });

  // Covariance and Correlation Calculators State
  const [covarianceCalc, setCovarianceCalc] = useState({
    returnsX: '0.12, 0.08, -0.05, 0.15, 0.10',
    returnsY: '0.10, 0.06, -0.03, 0.12, 0.09'
  });
  const [correlationCalc, setCorrelationCalc] = useState({
    returnsX: '0.12, 0.08, -0.05, 0.15, 0.10',
    returnsY: '0.10, 0.06, -0.03, 0.12, 0.09'
  });

  // Portfolio Calculators State
  const [portfolioExpectedCalc, setPortfolioExpectedCalc] = useState({
    weight1: 0.6,
    weight2: 0.4,
    expectedReturn1: 0.12,
    expectedReturn2: 0.08
  });
  const [portfolioVarianceCalc, setPortfolioVarianceCalc] = useState({
    weight1: 0.6,
    weight2: 0.4,
    variance1: 0.04,
    variance2: 0.02,
    covariance: 0.01
  });
  const [portfolioRiskCalc, setPortfolioRiskCalc] = useState({
    weight1: 0.6,
    weight2: 0.4,
    stdDev1: 0.20,
    stdDev2: 0.14,
    correlation: 0.5
  });

  // Historical Prices State for Returns & Risk
  const [historicalPrices] = useState({
    stockA: {
      name: 'Stock A',
      dates: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6'],
      prices: [100.00, 102.50, 101.75, 105.20, 103.80, 107.50]
    },
    stockB: {
      name: 'Stock B',
      dates: ['Jan 1', 'Jan 2', 'Jan 3', 'Jan 4', 'Jan 5', 'Jan 6'],
      prices: [50.00, 51.25, 49.80, 52.10, 51.50, 53.75]
    }
  });

  // Portfolio Simulation Mode State
  const [inputMode, setInputMode] = useState('direct'); // 'direct' or 'historical'
  const [directInputStocks, setDirectInputStocks] = useState([
    { id: 1, name: 'Stock A', weight: 0.6, expectedReturn: 0.12, variance: 0.04, stdDev: 0.20 },
    { id: 2, name: 'Stock B', weight: 0.4, expectedReturn: 0.08, variance: 0.02, stdDev: 0.14 }
  ]);

  // Correlation Matrix State - initialized as 2x2 identity-like matrix
  const [correlationMatrix, setCorrelationMatrix] = useState([
    [1.0, 0.5],
    [0.5, 1.0]
  ]);

  // Covariance Matrix State - computed from correlation and std devs
  const [matrixType, setMatrixType] = useState('correlation'); // 'correlation' or 'covariance'

  // Portfolio Visualization State
  const [numPortfolios, setNumPortfolios] = useState(5000); // Number of random portfolios to generate (1000-15000)
  const [showPairwiseFrontiers, setShowPairwiseFrontiers] = useState(true); // Toggle visibility of pairwise efficient frontiers
  const [riskFreeRate, setRiskFreeRate] = useState(0.03); // Risk-free rate (default 3%)
  const [investmentAmount, setInvestmentAmount] = useState(100000); // Investment amount for dollar value breakdown
  const [showRf, setShowRf] = useState(true); // Toggle visibility of Risk-free rate point
  const [showCAL, setShowCAL] = useState(true); // Toggle visibility of Capital Allocation Line
  const [showCML, setShowCML] = useState(true); // Toggle visibility of Capital Market Line
  const [chartZoom, setChartZoom] = useState(1); // Chart zoom level (0.5 to 2)

  // Practice Problems State
  const [expandedProblems, setExpandedProblems] = useState({});
  const [completedProblems, setCompletedProblems] = useState({});
  const [shownHints, setShownHints] = useState({});
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Expanded sections state
  const [expandedSections, setExpandedSections] = useState({ returns: true, 'portfolio-simulation': true });

  // Sidebar sections - placeholders for now
  const sections = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Activity,
      color: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'risk-return',
      label: 'Risk & Return',
      icon: TrendingUp,
      color: 'from-green-600 to-emerald-600'
    },
    {
      id: 'diversification',
      label: 'Diversification',
      icon: PieChart,
      color: 'from-purple-600 to-pink-600'
    },
    {
      id: 'efficient-frontier',
      label: 'Efficient Frontier',
      icon: LineChartIcon,
      color: 'from-orange-600 to-red-600'
    },
    {
      id: 'capm',
      label: 'CAPM',
      icon: BarChart3,
      color: 'from-teal-600 to-cyan-600'
    },
    {
      id: 'optimization',
      label: 'Portfolio Optimization',
      icon: Target,
      color: 'from-indigo-600 to-purple-600'
    },
    {
      id: 'analysis',
      label: 'Portfolio Analysis',
      icon: Shield,
      color: 'from-rose-600 to-pink-600'
    },
    {
      id: 'portfolio-simulation',
      label: 'Portfolio Simulation',
      icon: Calculator,
      color: 'from-amber-600 to-orange-600',
      subsections: [
        { id: 'input-mode', label: 'Input Mode Selection', isMode: true },
        { id: 'portfolio-inputs', label: 'Portfolio Inputs', isInput: true },
        { id: 'portfolio-analysis', label: 'Portfolio Analysis', isAnalysis: true },
        { id: 'visualization', label: 'Visualization', isVisualization: true }
      ]
    },
    {
      id: 'returns',
      label: 'Returns & Risk',
      icon: TrendingUp,
      color: 'from-green-600 to-emerald-600',
      subsections: [
        { id: 'historical-prices', label: 'Historical Prices', isHistorical: true },
        { id: 'simple-returns', label: 'Simple Returns' },
        { id: 'log-returns', label: 'Logarithmic Returns' },
        { id: 'geometric-mean', label: 'Geometric Mean' },
        { id: 'expected-returns', label: 'Expected Returns', isExpected: true },
        { id: 'variance', label: 'Variance' },
        { id: 'std-deviation', label: 'Risk (Std Deviation)', isRisk: true },
        { id: 'covariance', label: 'Covariance', isRelationship: true },
        { id: 'correlation', label: 'Correlation', isRelationship: true },
        { id: 'portfolio-expected-return', label: 'Portfolio Expected Return', isPortfolio: true },
        { id: 'portfolio-variance', label: 'Portfolio Variance', isPortfolio: true },
        { id: 'portfolio-risk', label: 'Portfolio Risk', isPortfolio: true }
      ]
    },
    {
      id: 'practice',
      label: 'Practice Problems',
      icon: GraduationCap,
      color: 'from-violet-600 to-purple-600'
    }
  ];

  // Practice Problems Data
  const practiceProblems = [
    {
      id: 1,
      title: 'Portfolio Expected Return',
      difficulty: 'beginner',
      category: 'Risk & Return',
      type: 'Calculation',
      problem: 'You have a portfolio with 60% invested in Stock A (expected return 12%) and 40% in Stock B (expected return 8%). What is the expected return of your portfolio?',
      hint: 'Portfolio expected return is the weighted average of individual asset returns.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the weights and returns', detail: 'Weight and return for each asset', latex: '\\begin{aligned} w_A &= 0.60,\\quad E(R_A) = 12\\% \\\\ w_B &= 0.40,\\quad E(R_B) = 8\\% \\end{aligned}' },
          { step: 2, description: 'Portfolio expected return formula', detail: 'Weighted average of returns', latex: 'E(R_p) = w_A \\cdot E(R_A) + w_B \\cdot E(R_B)' },
          { step: 3, description: 'Substitute and calculate', detail: 'Apply the formula', latex: 'E(R_p) = (0.60 \\times 0.12) + (0.40 \\times 0.08) = 0.072 + 0.032 = 0.104 = 10.4\\%' }
        ],
        answer: '10.4%',
        explanation: 'The portfolio expected return is 10.4%, which is the weighted average of the two stocks.'
      }
    },
    {
      id: 2,
      title: 'Two-Asset Portfolio Variance',
      difficulty: 'intermediate',
      category: 'Risk & Return',
      type: 'Calculation',
      problem: 'Calculate the variance of a two-asset portfolio: Stock A (weight 70%, σ=20%), Stock B (weight 30%, σ=30%), correlation ρ=0.4.',
      hint: 'Use the two-asset portfolio variance formula that includes correlation.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Weights, standard deviations, and correlation', latex: '\\begin{aligned} w_A &= 0.70,\\quad \\sigma_A = 0.20 \\\\ w_B &= 0.30,\\quad \\sigma_B = 0.30 \\\\ \\rho_{AB} &= 0.40 \\end{aligned}' },
          { step: 2, description: 'Portfolio variance formula', detail: 'Two-asset portfolio variance', latex: '\\sigma_p^2 = w_A^2\\sigma_A^2 + w_B^2\\sigma_B^2 + 2w_Aw_B\\sigma_A\\sigma_B\\rho_{AB}' },
          { step: 3, description: 'Calculate individual terms', detail: 'Calculate each component', latex: '\\begin{aligned} w_A^2\\sigma_A^2 &= (0.70)^2(0.20)^2 = 0.0196 \\\\ w_B^2\\sigma_B^2 &= (0.30)^2(0.30)^2 = 0.0081 \\\\ 2w_Aw_B\\rho\\sigma_A\\sigma_B &= 2(0.70)(0.30)(0.40)(0.20)(0.30) = 0.01008 \\end{aligned}' },
          { step: 4, description: 'Sum all terms', detail: 'Total variance', latex: '\\sigma_p^2 = 0.0196 + 0.0081 + 0.01008 = 0.03778' },
          { step: 5, description: 'Calculate standard deviation', detail: 'Take square root for σ', latex: '\\sigma_p = \\sqrt{0.03778} = 0.1944 = 19.44\\%' }
        ],
        answer: '19.44%',
        explanation: 'The portfolio standard deviation is 19.44%, which is lower than both individual asset volatilities due to imperfect correlation.'
      }
    },
    {
      id: 3,
      title: 'Sharpe Ratio Calculation',
      difficulty: 'beginner',
      category: 'Performance',
      type: 'Calculation',
      problem: 'A portfolio has an expected return of 14%, a standard deviation of 22%, and the risk-free rate is 3%. Calculate the Sharpe ratio.',
      hint: 'Sharpe ratio measures excess return per unit of risk.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the variables', detail: 'Return, risk, and risk-free rate', latex: '\\begin{aligned} E(R_p) &= 14\\% \\\\ \\sigma_p &= 22\\% \\\\ R_f &= 3\\% \\end{aligned}' },
          { step: 2, description: 'Sharpe ratio formula', detail: 'Excess return divided by risk', latex: 'S = \\frac{E(R_p) - R_f}{\\sigma_p}' },
          { step: 3, description: 'Calculate excess return', detail: 'Portfolio return minus risk-free rate', latex: 'E(R_p) - R_f = 0.14 - 0.03 = 0.11 = 11\\%' },
          { step: 4, description: 'Complete the calculation', detail: 'Divide by standard deviation', latex: 'S = \\frac{0.11}{0.22} = 0.50' }
        ],
        answer: '0.50',
        explanation: 'The Sharpe ratio is 0.50, meaning the portfolio generates 0.50 units of excess return for each unit of risk.'
      }
    },
    {
      id: 4,
      title: 'Correlation and Diversification Benefit',
      difficulty: 'intermediate',
      category: 'Diversification',
      type: 'Conceptual',
      problem: 'Two stocks have equal weights (50% each), standard deviations of 25% each. Compare portfolio risk when correlation is 1.0 vs 0.0.',
      hint: 'Portfolio variance changes with correlation. Perfect correlation provides no diversification benefit.',
      solution: {
        steps: [
          { step: 1, description: 'Setup for ρ = 1.0', detail: 'Perfect positive correlation', latex: '\\sigma_p^2 = (0.5)^2(0.25)^2 + (0.5)^2(0.25)^2 + 2(0.5)(0.5)(1.0)(0.25)(0.25)' },
          { step: 2, description: 'Calculate σ when ρ = 1.0', detail: 'Sum all terms', latex: '\\sigma_p^2 = 0.015625 + 0.015625 + 0.03125 = 0.0625,\\quad \\sigma_p = 0.25 = 25\\%' },
          { step: 3, description: 'Setup for ρ = 0.0', detail: 'Zero correlation', latex: '\\sigma_p^2 = (0.5)^2(0.25)^2 + (0.5)^2(0.25)^2 + 2(0.5)(0.5)(0.0)(0.25)(0.25)' },
          { step: 4, description: 'Calculate σ when ρ = 0.0', detail: 'Correlation term vanishes', latex: '\\sigma_p^2 = 0.015625 + 0.015625 = 0.03125,\\quad \\sigma_p = 0.1768 = 17.68\\%' },
          { step: 5, description: 'Diversification benefit', detail: 'Reduction in risk', latex: '\\text{Risk reduction} = 25\\% - 17.68\\% = 7.32\\%' }
        ],
        answer: '7.32% risk reduction',
        explanation: 'Zero correlation reduces portfolio risk by 7.32 percentage points compared to perfect correlation, demonstrating the power of diversification.'
      }
    },
    {
      id: 5,
      title: 'Minimum Variance Portfolio',
      difficulty: 'advanced',
      category: 'Optimization',
      type: 'Calculation',
      problem: 'Find the minimum variance portfolio for two assets: Stock A (σ=15%), Stock B (σ=25%), correlation ρ=0.3.',
      hint: 'Use the formula for the weight that minimizes portfolio variance in a two-asset portfolio.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the parameters', detail: 'Standard deviations and correlation', latex: '\\begin{aligned} \\sigma_A &= 0.15,\\quad \\sigma_B = 0.25 \\\\ \\rho_{AB} &= 0.30 \\end{aligned}' },
          { step: 2, description: 'Minimum variance weight formula', detail: 'Weight of asset A that minimizes variance', latex: 'w_A = \\frac{\\sigma_B^2 - \\rho_{AB}\\sigma_A\\sigma_B}{\\sigma_A^2 + \\sigma_B^2 - 2\\rho_{AB}\\sigma_A\\sigma_B}' },
          { step: 3, description: 'Calculate numerator', detail: 'Top part of the fraction', latex: '\\sigma_B^2 - \\rho\\sigma_A\\sigma_B = (0.25)^2 - (0.3)(0.15)(0.25) = 0.0625 - 0.01125 = 0.05125' },
          { step: 4, description: 'Calculate denominator', detail: 'Bottom part of the fraction', latex: '\\sigma_A^2 + \\sigma_B^2 - 2\\rho\\sigma_A\\sigma_B = 0.0225 + 0.0625 - 2(0.3)(0.15)(0.25) = 0.0625' },
          { step: 5, description: 'Find optimal weights', detail: 'Calculate both weights', latex: '\\begin{aligned} w_A &= \\frac{0.05125}{0.0625} = 0.82 = 82\\% \\\\ w_B &= 1 - 0.82 = 0.18 = 18\\% \\end{aligned}' }
        ],
        answer: '82% Stock A, 18% Stock B',
        explanation: 'The minimum variance portfolio allocates 82% to Stock A and 18% to Stock B, providing the lowest possible risk for these two assets.'
      }
    },
    {
      id: 6,
      title: 'Portfolio Beta Calculation',
      difficulty: 'intermediate',
      category: 'CAPM',
      type: 'Application',
      problem: 'A portfolio consists of three stocks: Stock X (30%, β=1.2), Stock Y (50%, β=0.9), Stock Z (20%, β=1.5). Calculate the portfolio beta.',
      hint: 'Portfolio beta is the weighted average of individual betas.',
      solution: {
        steps: [
          { step: 1, description: 'Identify weights and betas', detail: 'For each stock in the portfolio', latex: '\\begin{aligned} w_X = 0.30, & \\quad \\beta_X = 1.2 \\\\ w_Y = 0.50, & \\quad \\beta_Y = 0.9 \\\\ w_Z = 0.20, & \\quad \\beta_Z = 1.5 \\end{aligned}' },
          { step: 2, description: 'Portfolio beta formula', detail: 'Weighted average of betas', latex: '\\beta_p = w_X\\beta_X + w_Y\\beta_Y + w_Z\\beta_Z' },
          { step: 3, description: 'Calculate each term', detail: 'Multiply weights by betas', latex: '\\begin{aligned} w_X\\beta_X &= 0.30 \\times 1.2 = 0.36 \\\\ w_Y\\beta_Y &= 0.50 \\times 0.9 = 0.45 \\\\ w_Z\\beta_Z &= 0.20 \\times 1.5 = 0.30 \\end{aligned}' },
          { step: 4, description: 'Sum all terms', detail: 'Total portfolio beta', latex: '\\beta_p = 0.36 + 0.45 + 0.30 = 1.11' }
        ],
        answer: '1.11',
        explanation: 'The portfolio beta is 1.11, meaning the portfolio is 11% more volatile than the market.'
      }
    }
  ];

  // Helper function to calculate number of data points based on period and frequency
  const getDataPoints = (years, freq) => {
    const tradingDaysPerYear = 252;
    const weeksPerYear = 52;
    const monthsPerYear = 12;

    switch(freq) {
      case 'daily': return years * tradingDaysPerYear;
      case 'weekly': return years * weeksPerYear;
      case 'monthly': return years * monthsPerYear;
      default: return years * tradingDaysPerYear;
    }
  };

  // Helper function to generate dates
  const generateDates = (numPoints, frequency, startDate = new Date()) => {
    const dates = [];
    let currentDate = new Date(startDate);

    for (let i = 0; i < numPoints; i++) {
      dates.push(new Date(currentDate));

      // Increment date based on frequency
      switch(frequency) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          // Skip weekends
          while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            currentDate.setDate(currentDate.getDate() + 1);
          }
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
      }
    }

    return dates;
  };

  // Helper function to generate dividends (quarterly, realistic amounts)
  const generateDividends = (prices, dates, frequency, annualDividendYield, hasDividends) => {
    const dividends = new Array(prices.length).fill(0);

    if (!hasDividends) return dividends;

    // Quarterly dividend payment (realistic for stocks)
    const quarterlyYield = annualDividendYield / 4;

    // Track which quarters we've paid dividends for
    const paidQuarters = new Set();

    dates.forEach((date, index) => {
      // Pay dividends quarterly (March, June, September, December - months 2, 5, 8, 11)
      const month = date.getMonth();
      const year = date.getFullYear();
      const quarter = Math.floor(month / 3);
      const quarterKey = `${year}-Q${quarter}`;
      const isQuarterEnd = [2, 5, 8, 11].includes(month);

      // Pay dividend once per quarter on quarter-end months
      if (isQuarterEnd && !paidQuarters.has(quarterKey)) {
        dividends[index] = prices[index] * quarterlyYield;
        paidQuarters.add(quarterKey);
      }
    });

    return dividends.map(d => Number(d.toFixed(2)));
  };

  // Helper function to calculate returns
  // For GBM, LOG returns are normally distributed (continuous compounding)
  const calculateReturns = (prices, dividends) => {
    const returns = [0]; // First return is 0

    for (let i = 1; i < prices.length; i++) {
      // Logarithmic (continuous) return formula with dividends
      // r_t = ln((P_t + D_t) / P_{t-1})
      // This ensures returns are normally distributed when prices follow GBM
      const totalValue = prices[i] + dividends[i]; // Price + dividend
      const logReturn = Math.log(totalValue / prices[i-1]);
      returns.push(Number(logReturn.toFixed(6)));
    }

    return returns;
  };

  // Helper function to generate normally distributed random numbers (Box-Muller transform)
  const randomNormal = () => {
    let u1 = 0, u2 = 0;
    // Ensure u1 is not zero to avoid log(0)
    while (u1 === 0) u1 = Math.random();
    while (u2 === 0) u2 = Math.random();

    // Box-Muller transform
    return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
  };

  // Helper function to generate random stock prices using geometric Brownian motion
  const generateStockPrices = (initialPrice, numPoints, annualReturn, annualVolatility, frequency) => {
    const prices = [initialPrice];

    // Adjust parameters based on frequency
    let timeStep;
    switch(frequency) {
      case 'daily': timeStep = 1/252; break;
      case 'weekly': timeStep = 1/52; break;
      case 'monthly': timeStep = 1/12; break;
      default: timeStep = 1/252;
    }

    // Drift component of geometric Brownian motion
    const drift = annualReturn - (0.5 * annualVolatility * annualVolatility);

    for (let i = 1; i < numPoints; i++) {
      // Generate normally distributed random shock
      const randomShock = randomNormal();

      // Calculate price change using GBM formula
      const priceChange = drift * timeStep + annualVolatility * Math.sqrt(timeStep) * randomShock;
      const newPrice = prices[i-1] * Math.exp(priceChange);

      prices.push(Number(newPrice.toFixed(2)));
    }

    return prices;
  };

  // Handle number of stocks change
  const handleNumStocksChange = (num) => {
    const newNum = parseInt(num);
    setNumStocks(newNum);

    const stockNames = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    const newStocks = [];

    for (let i = 0; i < newNum; i++) {
      newStocks.push({
        id: i + 1,
        name: `Stock ${stockNames[i]}`,
        hasDividends: false,
        prices: [],
        dividends: [],
        returns: [],
        dates: []
      });
    }

    setStocks(newStocks);
    setPricesGenerated(false);
    setSelectedStockView(null);
  };

  // Handle stock name change
  const handleStockNameChange = (id, newName) => {
    setStocks(stocks.map(stock =>
      stock.id === id ? { ...stock, name: newName } : stock
    ));
  };

  // Handle dividend toggle for individual stock
  const handleDividendToggle = (id) => {
    setStocks(stocks.map(stock =>
      stock.id === id ? { ...stock, hasDividends: !stock.hasDividends } : stock
    ));
  };

  // Update correlation matrix when stocks are added/removed
  const updateCorrelationMatrix = (numStocks) => {
    const newMatrix = Array(numStocks).fill(0).map((_, i) =>
      Array(numStocks).fill(0).map((_, j) => {
        if (i === j) return 1.0; // Diagonal is always 1
        if (i < correlationMatrix.length && j < correlationMatrix[0].length) {
          return correlationMatrix[i][j]; // Preserve existing values
        }
        return 0.3; // Default correlation for new stocks
      })
    );
    setCorrelationMatrix(newMatrix);
  };

  // Update correlation matrix cell
  const updateCorrelationCell = (i, j, value) => {
    const newMatrix = correlationMatrix.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        if ((rowIdx === i && colIdx === j) || (rowIdx === j && colIdx === i)) {
          return parseFloat(value) || 0;
        }
        return cell;
      })
    );
    setCorrelationMatrix(newMatrix);
  };

  // Calculate covariance matrix from correlation matrix
  const getCovarianceMatrix = () => {
    return correlationMatrix.map((row, i) =>
      row.map((corr, j) => {
        const stdDevi = directInputStocks[i]?.stdDev || 0;
        const stdDevj = directInputStocks[j]?.stdDev || 0;
        return corr * stdDevi * stdDevj;
      })
    );
  };

  // Memoized portfolio calculation - prevents regeneration on UI toggles
  const portfolioChartData = useMemo(() => {
    if (inputMode !== 'direct' || directInputStocks.length < 2) {
      return null;
    }

    // Helper function to calculate portfolio metrics for given weights
    const calculatePortfolioMetrics = (weights) => {
      const expectedReturn = weights.reduce((sum, w, i) =>
        sum + w * directInputStocks[i].expectedReturn, 0
      );

      const covMatrix = getCovarianceMatrix();
      let variance = 0;
      for (let i = 0; i < weights.length; i++) {
        for (let j = 0; j < weights.length; j++) {
          variance += weights[i] * weights[j] * covMatrix[i][j];
        }
      }

      return {
        expectedReturn,
        risk: Math.sqrt(variance)
      };
    };

    // Generate efficient frontier for 2 stocks
    const generateEfficientFrontier2Stocks = () => {
      const points = [];
      const steps = 100;

      for (let i = 0; i <= steps; i++) {
        const w1 = i / steps;
        const w2 = 1 - w1;
        const metrics = calculatePortfolioMetrics([w1, w2]);
        points.push({
          ...metrics,
          weights: [w1, w2]
        });
      }

      return points;
    };

    // Find Minimum Variance Portfolio (MVP) for 2 stocks
    const findMVP2Stocks = (frontierPoints) => {
      let mvp = frontierPoints[0];
      for (const point of frontierPoints) {
        if (point.risk < mvp.risk) {
          mvp = point;
        }
      }
      return mvp;
    };

    // Generate portfolios using Dirichlet-like random sampling
    const generateRandomPortfolios = () => {
      const numStocks = directInputStocks.length;
      const portfolios = [];

      for (let i = 0; i < numPortfolios; i++) {
        const exponentials = [];
        let sum = 0;

        for (let j = 0; j < numStocks; j++) {
          const exp = -Math.log(Math.random());
          exponentials.push(exp);
          sum += exp;
        }

        const weights = exponentials.map(e => e / sum);
        const metrics = calculatePortfolioMetrics(weights);
        portfolios.push(metrics);
      }

      return portfolios;
    };

    // Find Minimum Global Portfolio (MGP) for 3+ stocks
    const findMGPMultipleStocks = (portfolios) => {
      let mgp = portfolios[0];
      for (const portfolio of portfolios) {
        if (portfolio.risk < mgp.risk) {
          mgp = portfolio;
        }
      }
      return mgp;
    };

    // Generate efficient frontier between two specific stocks
    const generatePairwiseFrontier = (idx1, idx2) => {
      const points = [];
      const steps = 50;

      for (let i = 0; i <= steps; i++) {
        const w = i / steps;
        const weights = Array(directInputStocks.length).fill(0);
        weights[idx1] = w;
        weights[idx2] = 1 - w;

        const metrics = calculatePortfolioMetrics(weights);
        points.push(metrics);
      }

      return points;
    };

    // Calculate current portfolio metrics using user-defined weights
    const currentWeights = directInputStocks.map(stock => stock.weight);
    const currentPortfolio = calculatePortfolioMetrics(currentWeights);

    // Find Tangency Portfolio (maximize Sharpe ratio on efficient frontier)
    const findTangencyPortfolio = () => {
      const numStocks = directInputStocks.length;
      let bestSharpe = -Infinity;
      let tangencyWeights = null;
      let tangencyPortfolio = null;

      // For 2 stocks, sample the efficient frontier
      if (numStocks === 2) {
        const steps = 500;
        for (let i = 0; i <= steps; i++) {
          const w1 = i / steps;
          const w2 = 1 - w1;
          const weights = [w1, w2];
          const metrics = calculatePortfolioMetrics(weights);

          // Calculate Sharpe ratio: (E[R] - Rf) / σ
          const sharpe = (metrics.expectedReturn - riskFreeRate) / metrics.risk;

          if (sharpe > bestSharpe) {
            bestSharpe = sharpe;
            tangencyWeights = weights;
            tangencyPortfolio = { ...metrics, sharpeRatio: sharpe };
          }
        }
      } else {
        // For 3+ stocks, use iterative optimization to find tangency portfolio
        // Start with multiple random initial points and optimize each
        const numInitialPoints = 20;

        for (let init = 0; init < numInitialPoints; init++) {
          // Generate random initial weights
          let currentWeights = [];
          let sum = 0;
          for (let j = 0; j < numStocks; j++) {
            const val = Math.random();
            currentWeights.push(val);
            sum += val;
          }
          currentWeights = currentWeights.map(w => w / sum);

          // Iterative improvement using gradient-free optimization
          for (let iter = 0; iter < 100; iter++) {
            let improved = false;
            const currentMetrics = calculatePortfolioMetrics(currentWeights);
            const currentSharpe = (currentMetrics.expectedReturn - riskFreeRate) / currentMetrics.risk;

            // Try small adjustments to each weight pair
            for (let i = 0; i < numStocks; i++) {
              for (let j = i + 1; j < numStocks; j++) {
                // Try shifting weight from stock i to stock j
                const stepSize = 0.02;

                if (currentWeights[i] >= stepSize) {
                  const testWeights = [...currentWeights];
                  testWeights[i] -= stepSize;
                  testWeights[j] += stepSize;

                  const testMetrics = calculatePortfolioMetrics(testWeights);
                  const testSharpe = (testMetrics.expectedReturn - riskFreeRate) / testMetrics.risk;

                  if (testSharpe > currentSharpe) {
                    currentWeights = testWeights;
                    improved = true;
                    break;
                  }
                }

                // Try shifting weight from stock j to stock i
                if (currentWeights[j] >= stepSize) {
                  const testWeights = [...currentWeights];
                  testWeights[j] -= stepSize;
                  testWeights[i] += stepSize;

                  const testMetrics = calculatePortfolioMetrics(testWeights);
                  const testSharpe = (testMetrics.expectedReturn - riskFreeRate) / testMetrics.risk;

                  if (testSharpe > currentSharpe) {
                    currentWeights = testWeights;
                    improved = true;
                    break;
                  }
                }
              }
              if (improved) break;
            }

            // If no improvement found, we've reached a local maximum
            if (!improved) break;
          }

          // Check if this is the best solution found
          const finalMetrics = calculatePortfolioMetrics(currentWeights);
          const finalSharpe = (finalMetrics.expectedReturn - riskFreeRate) / finalMetrics.risk;

          if (finalSharpe > bestSharpe) {
            bestSharpe = finalSharpe;
            tangencyWeights = currentWeights;
            tangencyPortfolio = { ...finalMetrics, sharpeRatio: finalSharpe };
          }
        }
      }

      return {
        portfolio: tangencyPortfolio,
        weights: tangencyWeights
      };
    };

    const tangencyResult = findTangencyPortfolio();

    // Calculate based on number of stocks
    let frontierPoints2Stocks = null;
    let mvp = null;
    let randomPortfolios = null;
    let pairwiseFrontiers = [];
    let mgp = null;

    if (directInputStocks.length === 2) {
      frontierPoints2Stocks = generateEfficientFrontier2Stocks();
      mvp = findMVP2Stocks(frontierPoints2Stocks);
    } else if (directInputStocks.length >= 3) {
      randomPortfolios = generateRandomPortfolios();
      mgp = findMGPMultipleStocks(randomPortfolios);

      // Generate pairwise frontiers
      for (let i = 0; i < directInputStocks.length; i++) {
        for (let j = i + 1; j < directInputStocks.length; j++) {
          pairwiseFrontiers.push({
            idx1: i,
            idx2: j,
            points: generatePairwiseFrontier(i, j)
          });
        }
      }
    }

    return {
      frontierPoints2Stocks,
      mvp,
      randomPortfolios,
      pairwiseFrontiers,
      mgp,
      currentPortfolio,
      tangencyPortfolio: tangencyResult.portfolio,
      tangencyWeights: tangencyResult.weights
    };
  }, [directInputStocks, numPortfolios, correlationMatrix, inputMode, riskFreeRate]);

  // Generate random prices for all stocks
  const handleGeneratePrices = () => {
    const numPoints = getDataPoints(timePeriod, frequency);

    // Generate dates starting from current date going back
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - timePeriod);
    const dates = generateDates(numPoints, frequency, startDate);

    const newStocks = stocks.map(stock => {
      // Random parameters for each stock
      const initialPrice = 50 + Math.random() * 150; // Between $50 and $200
      const annualReturn = 0.05 + Math.random() * 0.15; // Between 5% and 20%
      const annualVolatility = 0.15 + Math.random() * 0.25; // Between 15% and 40%
      const annualDividendYield = 0.01 + Math.random() * 0.04; // Between 1% and 5%

      const prices = generateStockPrices(initialPrice, numPoints, annualReturn, annualVolatility, frequency);
      const dividends = generateDividends(prices, dates, frequency, annualDividendYield, stock.hasDividends);
      const returns = calculateReturns(prices, dividends);

      return {
        ...stock,
        prices,
        dividends,
        returns,
        dates
      };
    });

    setStocks(newStocks);
    setPricesGenerated(true);
    setSelectedStockView(newStocks[0]?.id || null);
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Portfolio Theory</h1>
                <p className="text-sm text-gray-500">Modern Portfolio Theory & Analysis</p>
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
                  const isExpanded = expandedSections[section.id];
                  const hasSubsections = section.subsections && section.subsections.length > 0;

                  return (
                    <div key={section.id}>
                      <button
                        onClick={() => {
                          if (hasSubsections) {
                            setExpandedSections(prev => ({
                              ...prev,
                              [section.id]: !prev[section.id]
                            }));
                          }
                          setActiveSection(section.id);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                          isActive
                            ? `bg-gradient-to-r ${section.color} text-white shadow-lg transform scale-105`
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        <span className="font-semibold text-sm flex-1 text-left">{section.label}</span>
                        {hasSubsections && (
                          isExpanded ?
                            <ChevronUp className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} /> :
                            <ChevronDown className={`w-4 h-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        )}
                      </button>

                      {/* Subsections */}
                      {hasSubsections && isExpanded && (
                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-gray-200 pl-2">
                          {section.subsections.map((subsection) => (
                            <button
                              key={subsection.id}
                              onClick={() => {
                                setActiveSection(section.id);
                                const element = document.getElementById(subsection.id);
                                if (element) {
                                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                              }}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                                subsection.isRisk
                                  ? 'text-red-700 hover:bg-red-50 font-semibold'
                                  : subsection.isExpected
                                  ? 'text-blue-700 hover:bg-blue-50 font-semibold'
                                  : subsection.isRelationship
                                  ? 'text-purple-700 hover:bg-purple-50 font-semibold'
                                  : subsection.isHistorical
                                  ? 'text-amber-700 hover:bg-amber-50 font-semibold'
                                  : subsection.isPortfolio
                                  ? 'text-teal-700 hover:bg-teal-50 font-semibold'
                                  : subsection.isMode
                                  ? 'text-orange-700 hover:bg-orange-50 font-semibold'
                                  : subsection.isInput
                                  ? 'text-cyan-700 hover:bg-cyan-50 font-semibold'
                                  : subsection.isAnalysis
                                  ? 'text-indigo-700 hover:bg-indigo-50 font-semibold'
                                  : subsection.isVisualization
                                  ? 'text-pink-700 hover:bg-pink-50 font-semibold'
                                  : 'text-gray-600 hover:bg-amber-50 hover:text-amber-700'
                              }`}
                            >
                              {subsection.isRisk ? (
                                <Shield className="w-3.5 h-3.5 text-red-600" />
                              ) : subsection.isExpected ? (
                                <Target className="w-3.5 h-3.5 text-blue-600" />
                              ) : subsection.isRelationship ? (
                                <Link2 className="w-3.5 h-3.5 text-purple-600" />
                              ) : subsection.isHistorical ? (
                                <BarChart3 className="w-3.5 h-3.5 text-amber-600" />
                              ) : subsection.isPortfolio ? (
                                <PieChart className="w-3.5 h-3.5 text-teal-600" />
                              ) : subsection.isMode ? (
                                <Activity className="w-3.5 h-3.5 text-orange-600" />
                              ) : subsection.isInput ? (
                                <Calculator className="w-3.5 h-3.5 text-cyan-600" />
                              ) : subsection.isAnalysis ? (
                                <Target className="w-3.5 h-3.5 text-indigo-600" />
                              ) : subsection.isVisualization ? (
                                <LineChartIcon className="w-3.5 h-3.5 text-pink-600" />
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-amber-400"></div>
                              )}
                              <span>{subsection.label}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Overview</h2>
                      <p className="text-gray-600">Introduction to Portfolio Theory</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                    <p className="text-gray-700 text-center">
                      Content coming soon...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Risk & Return Section */}
            {activeSection === 'risk-return' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Risk & Return</h2>
                      <p className="text-gray-600">Understanding portfolio risk and expected returns</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <p className="text-gray-700 text-center">
                      Content coming soon...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Diversification Section */}
            {activeSection === 'diversification' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl">
                      <PieChart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Diversification</h2>
                      <p className="text-gray-600">Benefits of portfolio diversification</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                    <p className="text-gray-700 text-center">
                      Content coming soon...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Efficient Frontier Section */}
            {activeSection === 'efficient-frontier' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl">
                      <LineChartIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Efficient Frontier</h2>
                      <p className="text-gray-600">Optimal portfolio selection</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6 border-2 border-orange-200">
                    <p className="text-gray-700 text-center">
                      Content coming soon...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* CAPM Section */}
            {activeSection === 'capm' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-xl">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">CAPM</h2>
                      <p className="text-gray-600">Capital Asset Pricing Model</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-200">
                    <p className="text-gray-700 text-center">
                      Content coming soon...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Optimization Section */}
            {activeSection === 'optimization' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl">
                      <Target className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Portfolio Optimization</h2>
                      <p className="text-gray-600">Optimizing portfolio allocation</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border-2 border-indigo-200">
                    <p className="text-gray-700 text-center">
                      Content coming soon...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Analysis Section */}
            {activeSection === 'analysis' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-rose-600 to-pink-600 rounded-xl">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Portfolio Analysis</h2>
                      <p className="text-gray-600">Performance metrics and analysis</p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl p-6 border-2 border-rose-200">
                    <p className="text-gray-700 text-center">
                      Content coming soon...
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Portfolio Simulation Section */}
            {activeSection === 'portfolio-simulation' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-amber-600 to-orange-600 rounded-xl">
                      <Calculator className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Portfolio Simulation</h2>
                      <p className="text-gray-600">Build and analyze your portfolio using direct input or historical data</p>
                    </div>
                  </div>

                  <div className="space-y-6 animate-fadeIn">
                    {/* Input Mode Selection Section */}
                    <div id="input-mode" className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-300 shadow-lg scroll-mt-24">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-orange-600 to-amber-600 rounded-lg flex items-center justify-center text-white font-bold">
                            <Activity className="w-5 h-5" />
                          </div>
                          Input Mode Selection
                        </h3>
                        <p className="text-sm text-gray-600">
                          Choose how you want to build your portfolio: direct manual input or generate from historical data
                        </p>
                      </div>

                      {/* Mode Toggle */}
                      <div className="flex gap-4 mb-4">
                        <button
                          onClick={() => setInputMode('direct')}
                          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                            inputMode === 'direct'
                              ? 'bg-cyan-100 border-cyan-500 shadow-lg'
                              : 'bg-white border-gray-300 hover:border-cyan-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Calculator className={`w-6 h-6 ${inputMode === 'direct' ? 'text-cyan-600' : 'text-gray-400'}`} />
                            <div className="text-left">
                              <div className={`font-bold ${inputMode === 'direct' ? 'text-cyan-900' : 'text-gray-700'}`}>
                                Direct Input
                              </div>
                              <div className="text-xs text-gray-600">
                                Manually enter weights, returns, and risk metrics
                              </div>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setInputMode('historical')}
                          className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                            inputMode === 'historical'
                              ? 'bg-amber-100 border-amber-500 shadow-lg'
                              : 'bg-white border-gray-300 hover:border-amber-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <BarChart3 className={`w-6 h-6 ${inputMode === 'historical' ? 'text-amber-600' : 'text-gray-400'}`} />
                            <div className="text-left">
                              <div className={`font-bold ${inputMode === 'historical' ? 'text-amber-900' : 'text-gray-700'}`}>
                                Historical Data
                              </div>
                              <div className="text-xs text-gray-600">
                                Generate from simulated historical prices
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>

                      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <p className="text-sm text-gray-700">
                          <strong className="text-blue-700">💡 Tip:</strong> Use <strong>Direct Input</strong> when you already know the portfolio parameters.
                          Use <strong>Historical Data</strong> to generate realistic price movements with dividends and calculate metrics automatically.
                        </p>
                      </div>
                    </div>

                    {/* Portfolio Inputs Section */}
                    <div id="portfolio-inputs" className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 border-2 border-cyan-300 shadow-lg scroll-mt-24">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            <Calculator className="w-5 h-5" />
                          </div>
                          Portfolio Inputs
                        </h3>
                        <p className="text-sm text-gray-600">
                          {inputMode === 'direct'
                            ? 'Enter your portfolio parameters directly'
                            : 'Configure and generate historical price data'}
                        </p>
                      </div>

                      {inputMode === 'direct' ? (
                        <div className="space-y-4">
                          {/* Direct Input Table */}
                          <div className="bg-white rounded-lg p-4 border-2 border-cyan-200">
                            <div className="flex items-center justify-between mb-3">
                              <h4 className="font-bold text-gray-800">Stock Parameters</h4>
                              <button
                                onClick={() => {
                                  const newId = Math.max(...directInputStocks.map(s => s.id)) + 1;
                                  setDirectInputStocks([...directInputStocks, {
                                    id: newId,
                                    name: `Stock ${String.fromCharCode(64 + newId)}`,
                                    weight: 0,
                                    expectedReturn: 0,
                                    variance: 0,
                                    stdDev: 0
                                  }]);
                                  // Update correlation matrix for new stock
                                  updateCorrelationMatrix(directInputStocks.length + 1);
                                }}
                                className="px-3 py-1 bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold rounded-lg transition-colors"
                              >
                                + Add Stock
                              </button>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="bg-cyan-100 text-gray-700">
                                  <tr>
                                    <th className="px-3 py-2 text-left font-semibold">Stock</th>
                                    <th className="px-3 py-2 text-right font-semibold">Weight (w)</th>
                                    <th className="px-3 py-2 text-right font-semibold">E[R]</th>
                                    <th className="px-3 py-2 text-right font-semibold">Variance (σ²)</th>
                                    <th className="px-3 py-2 text-right font-semibold">Std Dev (σ)</th>
                                    <th className="px-3 py-2 text-center font-semibold">Action</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                  {directInputStocks.map((stock, index) => (
                                    <tr key={stock.id} className="hover:bg-cyan-50">
                                      <td className="px-3 py-2">
                                        <input
                                          type="text"
                                          value={stock.name}
                                          onChange={(e) => {
                                            const updated = directInputStocks.map(s =>
                                              s.id === stock.id ? { ...s, name: e.target.value } : s
                                            );
                                            setDirectInputStocks(updated);
                                          }}
                                          className="w-full px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-cyan-500"
                                        />
                                      </td>
                                      <td className="px-3 py-2">
                                        <input
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          max="1"
                                          value={stock.weight}
                                          onChange={(e) => {
                                            const updated = directInputStocks.map(s =>
                                              s.id === stock.id ? { ...s, weight: parseFloat(e.target.value) || 0 } : s
                                            );
                                            setDirectInputStocks(updated);
                                          }}
                                          className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:border-cyan-500"
                                        />
                                      </td>
                                      <td className="px-3 py-2">
                                        <input
                                          type="number"
                                          step="0.01"
                                          value={stock.expectedReturn}
                                          onChange={(e) => {
                                            const updated = directInputStocks.map(s =>
                                              s.id === stock.id ? { ...s, expectedReturn: parseFloat(e.target.value) || 0 } : s
                                            );
                                            setDirectInputStocks(updated);
                                          }}
                                          className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:border-cyan-500"
                                        />
                                      </td>
                                      <td className="px-3 py-2">
                                        <input
                                          type="number"
                                          step="0.0001"
                                          min="0"
                                          value={stock.variance}
                                          onChange={(e) => {
                                            const variance = parseFloat(e.target.value) || 0;
                                            const updated = directInputStocks.map(s =>
                                              s.id === stock.id ? { ...s, variance, stdDev: Math.sqrt(variance) } : s
                                            );
                                            setDirectInputStocks(updated);
                                          }}
                                          className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:border-cyan-500"
                                        />
                                      </td>
                                      <td className="px-3 py-2">
                                        <input
                                          type="number"
                                          step="0.01"
                                          min="0"
                                          value={stock.stdDev}
                                          onChange={(e) => {
                                            const stdDev = parseFloat(e.target.value) || 0;
                                            const updated = directInputStocks.map(s =>
                                              s.id === stock.id ? { ...s, stdDev, variance: stdDev * stdDev } : s
                                            );
                                            setDirectInputStocks(updated);
                                          }}
                                          className="w-full px-2 py-1 border border-gray-300 rounded text-right focus:outline-none focus:border-cyan-500"
                                        />
                                      </td>
                                      <td className="px-3 py-2 text-center">
                                        {directInputStocks.length > 2 && (
                                          <button
                                            onClick={() => {
                                              setDirectInputStocks(directInputStocks.filter(s => s.id !== stock.id));
                                              // Update correlation matrix for removed stock
                                              updateCorrelationMatrix(directInputStocks.length - 1);
                                            }}
                                            className="px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded"
                                          >
                                            Remove
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* Weight Sum Validation */}
                            {(() => {
                              const totalWeight = directInputStocks.reduce((sum, s) => sum + s.weight, 0);
                              const isValid = Math.abs(totalWeight - 1.0) < 0.001;
                              return (
                                <div className={`mt-3 p-3 rounded-lg border-2 ${isValid ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                                  <div className="flex items-center justify-between">
                                    <span className="font-semibold text-gray-700">Total Weight:</span>
                                    <span className={`font-bold ${isValid ? 'text-green-700' : 'text-red-700'}`}>
                                      {(totalWeight * 100).toFixed(2)}% {isValid ? '✓' : '✗ Must equal 100%'}
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Correlation & Covariance Matrices */}
                          {directInputStocks.length >= 2 && (
                            <div className="space-y-4">
                              {/* Correlation Matrix */}
                              <div className="bg-gradient-to-br from-purple-50 via-white to-purple-50 rounded-xl p-5 border-2 border-purple-300 shadow-md">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-1 h-8 bg-gradient-to-b from-purple-500 to-purple-700 rounded-full"></div>
                                  <h4 className="font-bold text-purple-900 text-lg">Correlation Matrix (ρ)</h4>
                                  <span className="ml-auto px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">Editable</span>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm border-collapse">
                                    <thead>
                                      <tr>
                                        <th className="p-2 border-2 border-purple-400 bg-gradient-to-br from-purple-100 to-purple-200 font-bold"></th>
                                        {directInputStocks.map((stock, idx) => (
                                          <th key={idx} className="p-2 border-2 border-purple-400 bg-gradient-to-br from-purple-100 to-purple-200 font-bold text-purple-900">
                                            {stock.name}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {directInputStocks.map((stockRow, i) => (
                                        <tr key={i}>
                                          <td className="p-2 border-2 border-purple-400 bg-gradient-to-br from-purple-100 to-purple-200 font-bold text-purple-900">
                                            {stockRow.name}
                                          </td>
                                          {directInputStocks.map((stockCol, j) => {
                                            const value = correlationMatrix[i]?.[j] || 0;
                                            const isEditable = i !== j;
                                            const isDiagonal = i === j;

                                            return (
                                              <td key={j} className={`p-1 border border-purple-300 ${
                                                isDiagonal ? 'bg-purple-200' : i < j ? 'bg-white' : 'bg-purple-50'
                                              }`}>
                                                {isEditable && i < j ? (
                                                  <input
                                                    type="number"
                                                    step="0.01"
                                                    min="-1"
                                                    max="1"
                                                    value={value.toFixed(2)}
                                                    onChange={(e) => updateCorrelationCell(i, j, e.target.value)}
                                                    className="w-full px-2 py-1 text-center border-2 border-purple-400 rounded-lg focus:outline-none focus:border-purple-600 focus:ring-2 focus:ring-purple-300 font-mono shadow-sm hover:shadow-md transition-all"
                                                  />
                                                ) : (
                                                  <div className={`text-center py-1 font-mono ${
                                                    isDiagonal ? 'font-bold text-purple-900' : 'text-gray-700'
                                                  }`}>
                                                    {value.toFixed(2)}
                                                  </div>
                                                )}
                                              </td>
                                            );
                                          })}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="mt-3 bg-purple-50 rounded-lg p-3 border border-purple-200">
                                  <p className="text-xs text-purple-900 font-semibold mb-2">
                                    💡 Correlation Properties:
                                  </p>
                                  <ul className="text-xs text-gray-700 space-y-1 ml-4">
                                    <li>• <strong>Diagonal (darker):</strong> Always 1.0 (perfect correlation with itself)</li>
                                    <li>• <strong>Upper triangle (white):</strong> Editable correlation values</li>
                                    <li>• <strong>Lower triangle (purple):</strong> Mirrors upper triangle automatically</li>
                                    <li>• <strong>Range:</strong> -1 (perfect negative) to +1 (perfect positive)</li>
                                  </ul>
                                </div>
                              </div>

                              {/* Covariance Matrix */}
                              <div className="bg-gradient-to-br from-teal-50 via-white to-cyan-50 rounded-xl p-5 border-2 border-teal-300 shadow-md">
                                <div className="flex items-center gap-3 mb-4">
                                  <div className="w-1 h-8 bg-gradient-to-b from-teal-500 to-cyan-700 rounded-full"></div>
                                  <h4 className="font-bold text-teal-900 text-lg">Covariance Matrix (Cov)</h4>
                                  <span className="ml-auto px-3 py-1 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full">Auto-Calculated</span>
                                </div>

                                <div className="overflow-x-auto">
                                  <table className="w-full text-sm border-collapse">
                                    <thead>
                                      <tr>
                                        <th className="p-2 border-2 border-teal-400 bg-gradient-to-br from-teal-100 to-cyan-200 font-bold"></th>
                                        {directInputStocks.map((stock, idx) => (
                                          <th key={idx} className="p-2 border-2 border-teal-400 bg-gradient-to-br from-teal-100 to-cyan-200 font-bold text-teal-900">
                                            {stock.name}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {directInputStocks.map((stockRow, i) => (
                                        <tr key={i}>
                                          <td className="p-2 border-2 border-teal-400 bg-gradient-to-br from-teal-100 to-cyan-200 font-bold text-teal-900">
                                            {stockRow.name}
                                          </td>
                                          {directInputStocks.map((stockCol, j) => {
                                            const covMatrix = getCovarianceMatrix();
                                            const value = covMatrix[i]?.[j] || 0;
                                            const isDiagonal = i === j;

                                            return (
                                              <td key={j} className={`p-1 border border-teal-300 ${
                                                isDiagonal ? 'bg-teal-200' : i < j ? 'bg-white' : 'bg-teal-50'
                                              }`}>
                                                <div className={`text-center py-1 font-mono ${
                                                  isDiagonal ? 'font-bold text-teal-900' : 'text-gray-700'
                                                }`}>
                                                  {value.toFixed(4)}
                                                </div>
                                              </td>
                                            );
                                          })}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>

                                <div className="mt-3 bg-teal-50 rounded-lg p-3 border border-teal-200">
                                  <p className="text-xs text-teal-900 font-semibold mb-2">
                                    💡 Covariance Properties:
                                  </p>
                                  <ul className="text-xs text-gray-700 space-y-1 ml-4">
                                    <li>• <strong>Diagonal (darker):</strong> Variance σ² of each stock</li>
                                    <li>• <strong>Off-diagonal:</strong> Covariance between stock pairs</li>
                                    <li>• <strong>Formula:</strong> Cov(i,j) = ρ(i,j) × σ(i) × σ(j)</li>
                                    <li>• <strong>Symmetric:</strong> Cov(i,j) = Cov(j,i)</li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          )}

                          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                            <p className="text-sm text-gray-700">
                              <strong className="text-blue-700">📝 Note:</strong> Enter weights as decimals (e.g., 0.6 for 60%).
                              Variance and Standard Deviation are linked - updating one will automatically update the other.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {/* Historical Data Generation (preserved from original) */}
                          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Portfolio Configuration</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {/* Number of Stocks */}
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Number of Stocks
                                </label>
                                <select
                                  value={numStocks}
                                  onChange={(e) => handleNumStocksChange(e.target.value)}
                                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                                >
                                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                    <option key={num} value={num}>{num} Stocks</option>
                                  ))}
                                </select>
                              </div>

                              {/* Time Period */}
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Time Period
                                </label>
                                <select
                                  value={timePeriod}
                                  onChange={(e) => {
                                    setTimePeriod(parseInt(e.target.value));
                                    setPricesGenerated(false);
                                  }}
                                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                                >
                                  <option value={1}>1 Year</option>
                                  <option value={3}>3 Years</option>
                                  <option value={5}>5 Years</option>
                                  <option value={10}>10 Years</option>
                                </select>
                              </div>

                              {/* Frequency */}
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  Frequency
                                </label>
                                <select
                                  value={frequency}
                                  onChange={(e) => {
                                    setFrequency(e.target.value);
                                    setPricesGenerated(false);
                                  }}
                                  className="w-full px-4 py-2 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white"
                                >
                                  <option value="daily">Daily</option>
                                  <option value="weekly">Weekly</option>
                                  <option value="monthly">Monthly</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Stock Names & Dividends Section */}
                          <div className="bg-white rounded-xl p-6 border-2 border-gray-200 mb-6">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">Stock Configuration</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {stocks.map((stock, index) => (
                        <div key={stock.id} className="flex items-center gap-3 p-4 border-2 border-gray-200 rounded-lg hover:border-amber-300 transition-colors">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <div className="flex-1 space-y-2">
                            <input
                              type="text"
                              value={stock.name}
                              onChange={(e) => handleStockNameChange(stock.id, e.target.value)}
                              className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
                              placeholder={`Stock ${index + 1}`}
                            />
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                id={`dividend-${stock.id}`}
                                checked={stock.hasDividends}
                                onChange={() => handleDividendToggle(stock.id)}
                                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                              />
                              <label htmlFor={`dividend-${stock.id}`} className="text-xs text-gray-600 cursor-pointer">
                                Pays Dividends
                              </label>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Generate Button */}
                  <div className="flex justify-center mb-6">
                    <button
                      onClick={handleGeneratePrices}
                      className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
                    >
                      Generate Historical Prices
                    </button>
                  </div>

                  {/* Results Section */}
                  {pricesGenerated && (
                    <div className="space-y-6">
                      {/* Stock Selector Tabs */}
                      <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">View Stock Data</h3>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {stocks.map((stock) => (
                            <button
                              key={stock.id}
                              onClick={() => setSelectedStockView(stock.id)}
                              className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                                selectedStockView === stock.id
                                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {stock.name}
                            </button>
                          ))}
                        </div>

                        {/* Selected Stock Data Display */}
                        {selectedStockView && (() => {
                          const selectedStock = stocks.find(s => s.id === selectedStockView);
                          if (!selectedStock) return null;

                          // Calculate statistics
                          const avgReturn = selectedStock.returns.reduce((a, b) => a + b, 0) / selectedStock.returns.length;
                          const variance = selectedStock.returns.reduce((sum, r) => sum + Math.pow(r - avgReturn, 2), 0) / selectedStock.returns.length;
                          const stdDev = Math.sqrt(variance);
                          const totalDividends = selectedStock.dividends.reduce((a, b) => a + b, 0);

                          return (
                            <div className="space-y-6">
                              {/* Summary Statistics */}
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                                  <div className="text-xs text-blue-600 font-semibold mb-1">Data Points</div>
                                  <div className="text-2xl font-bold text-blue-900">{selectedStock.prices.length}</div>
                                </div>
                                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                                  <div className="text-xs text-green-600 font-semibold mb-1">Avg Return</div>
                                  <div className="text-2xl font-bold text-green-900">{(avgReturn * 100).toFixed(4)}%</div>
                                </div>
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                                  <div className="text-xs text-purple-600 font-semibold mb-1">Volatility (σ)</div>
                                  <div className="text-2xl font-bold text-purple-900">{(stdDev * 100).toFixed(4)}%</div>
                                </div>
                                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                                  <div className="text-xs text-orange-600 font-semibold mb-1">Total Dividends</div>
                                  <div className="text-2xl font-bold text-orange-900">${totalDividends.toFixed(2)}</div>
                                </div>
                              </div>

                              {/* Data Table */}
                              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                <div className="flex items-center justify-between mb-3">
                                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                                    <span>Historical Data</span>
                                    {!showAllRows && (
                                      <span className="text-sm font-normal text-gray-600">(Showing first 10 and last 10 entries)</span>
                                    )}
                                  </h4>
                                  <button
                                    onClick={() => setShowAllRows(!showAllRows)}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
                                  >
                                    {showAllRows ? 'Show Limited' : 'Show All'}
                                  </button>
                                </div>

                                <div className="overflow-x-auto max-h-96">
                                  <table className="w-full text-sm">
                                    <thead className="bg-gray-200 text-gray-700 sticky top-0">
                                      <tr>
                                        <th className="px-4 py-2 text-left font-semibold">Date</th>
                                        <th className="px-4 py-2 text-right font-semibold">Adj Close</th>
                                        {selectedStock.hasDividends && <th className="px-4 py-2 text-right font-semibold">Dividend</th>}
                                        <th className="px-4 py-2 text-right font-semibold">Return</th>
                                      </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                      {showAllRows ? (
                                        /* Show all entries */
                                        selectedStock.dates.map((date, idx) => (
                                          <tr key={idx} className="hover:bg-gray-100">
                                            <td className="px-4 py-2 text-gray-700">
                                              {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-2 text-right font-semibold text-gray-900">
                                              ${selectedStock.prices[idx]?.toFixed(2)}
                                            </td>
                                            {selectedStock.hasDividends && (
                                              <td className="px-4 py-2 text-right text-green-600 font-semibold">
                                                {selectedStock.dividends[idx] > 0 ? `$${selectedStock.dividends[idx].toFixed(2)}` : '-'}
                                              </td>
                                            )}
                                            <td className={`px-4 py-2 text-right font-semibold ${
                                              selectedStock.returns[idx] >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                              {idx === 0 ? '-' : `${(selectedStock.returns[idx] * 100).toFixed(4)}%`}
                                            </td>
                                          </tr>
                                        ))
                                      ) : (
                                        <>
                                          {/* First 10 entries */}
                                          {selectedStock.dates.slice(0, 10).map((date, idx) => (
                                        <tr key={`first-${idx}`} className="hover:bg-gray-100">
                                          <td className="px-4 py-2 text-gray-700">
                                            {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                          </td>
                                          <td className="px-4 py-2 text-right font-semibold text-gray-900">
                                            ${selectedStock.prices[idx]?.toFixed(2)}
                                          </td>
                                          {selectedStock.hasDividends && (
                                            <td className="px-4 py-2 text-right text-green-600 font-semibold">
                                              {selectedStock.dividends[idx] > 0 ? `$${selectedStock.dividends[idx].toFixed(2)}` : '-'}
                                            </td>
                                          )}
                                          <td className={`px-4 py-2 text-right font-semibold ${
                                            selectedStock.returns[idx] >= 0 ? 'text-green-600' : 'text-red-600'
                                          }`}>
                                            {idx === 0 ? '-' : `${(selectedStock.returns[idx] * 100).toFixed(4)}%`}
                                          </td>
                                        </tr>
                                      ))}
                                      {selectedStock.dates.length > 20 && (
                                        <tr>
                                          <td colSpan={selectedStock.hasDividends ? 4 : 3} className="px-4 py-2 text-center text-gray-500 bg-gray-100">
                                            ... {selectedStock.dates.length - 20} more entries ...
                                          </td>
                                        </tr>
                                      )}
                                      {/* Last 10 entries */}
                                      {selectedStock.dates.slice(-10).map((date, idx) => {
                                        const actualIdx = selectedStock.dates.length - 10 + idx;
                                        return (
                                          <tr key={`last-${idx}`} className="hover:bg-gray-100">
                                            <td className="px-4 py-2 text-gray-700">
                                              {date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </td>
                                            <td className="px-4 py-2 text-right font-semibold text-gray-900">
                                              ${selectedStock.prices[actualIdx]?.toFixed(2)}
                                            </td>
                                            {selectedStock.hasDividends && (
                                              <td className="px-4 py-2 text-right text-green-600 font-semibold">
                                                {selectedStock.dividends[actualIdx] > 0 ? `$${selectedStock.dividends[actualIdx].toFixed(2)}` : '-'}
                                              </td>
                                            )}
                                            <td className={`px-4 py-2 text-right font-semibold ${
                                              selectedStock.returns[actualIdx] >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                              {(selectedStock.returns[actualIdx] * 100).toFixed(4)}%
                                            </td>
                                          </tr>
                                        );
                                      })}
                                        </>
                                      )}
                                    </tbody>
                                  </table>
                                </div>
                              </div>

                              {/* Distribution Histogram */}
                              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6 border-2 border-purple-200">
                                <h4 className="font-bold text-gray-800 mb-4">Log Returns Distribution (Histogram with Normal Curve)</h4>

                                {(() => {
                                  // Create histogram bins - more bins for better bell curve visualization
                                  const bins = 50;

                                  const returns = selectedStock.returns.filter(r => r !== 0);

                                  if (returns.length === 0) {
                                    return (
                                      <div className="bg-white rounded-lg p-8 text-center">
                                        <div className="text-red-600 font-bold mb-2">No return data available</div>
                                        <div className="text-gray-600 text-sm">
                                          Please generate historical prices first.
                                        </div>
                                      </div>
                                    );
                                  }

                                  const minReturn = Math.min(...returns);
                                  const maxReturn = Math.max(...returns);
                                  const binWidth = (maxReturn - minReturn) / bins;

                                  const histogram = Array(bins).fill(0);
                                  returns.forEach(r => {
                                    let binIndex = Math.floor((r - minReturn) / binWidth);
                                    // Handle edge case where r === maxReturn
                                    if (binIndex >= bins) binIndex = bins - 1;
                                    if (binIndex < 0) binIndex = 0;
                                    histogram[binIndex]++;
                                  });

                                  const maxCount = Math.max(...histogram);
                                  const totalReturns = returns.length;

                                  return (
                                    <div className="space-y-4">
                                      {/* Statistics Summary */}
                                      <div className="bg-white rounded-lg p-4 grid grid-cols-5 gap-4 text-center border border-purple-200">
                                        <div>
                                          <div className="text-xs text-gray-600 mb-1">Mean (μ)</div>
                                          <div className="text-lg font-bold text-blue-600">
                                            {((returns.reduce((sum, r) => sum + r, 0) / returns.length) * 100).toFixed(4)}%
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-xs text-gray-600 mb-1">Std Dev (σ)</div>
                                          <div className="text-lg font-bold text-purple-600">
                                            {(() => {
                                              const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
                                              const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
                                              return (Math.sqrt(variance) * 100).toFixed(4);
                                            })()}%
                                          </div>
                                        </div>
                                        <div>
                                          <div className="text-xs text-gray-600 mb-1">Min Return</div>
                                          <div className="text-lg font-bold text-red-600">{(minReturn * 100).toFixed(3)}%</div>
                                        </div>
                                        <div>
                                          <div className="text-xs text-gray-600 mb-1">Max Return</div>
                                          <div className="text-lg font-bold text-green-600">{(maxReturn * 100).toFixed(3)}%</div>
                                        </div>
                                        <div>
                                          <div className="text-xs text-gray-600 mb-1">Observations</div>
                                          <div className="text-lg font-bold text-gray-700">{totalReturns}</div>
                                        </div>
                                      </div>

                                      {/* Histogram Chart */}
                                      <div className="bg-white rounded-lg p-4 border border-purple-200">
                                        <div className="relative">
                                          {/* Y-axis label */}
                                          <div className="absolute -left-12 top-0 bottom-0 flex items-center">
                                            <div className="transform -rotate-90 whitespace-nowrap text-xs text-gray-600 font-semibold">
                                              Frequency
                                            </div>
                                          </div>

                                          {/* Histogram bars */}
                                          <div className="relative flex items-end justify-between gap-0.5 h-96 border-l-2 border-b-2 border-gray-300 pl-2 pb-2 bg-white">
                                            {histogram.map((count, idx) => {
                                              const binStart = minReturn + idx * binWidth;
                                              const binEnd = minReturn + (idx + 1) * binWidth;
                                              const binCenter = (binStart + binEnd) / 2;

                                              // Calculate height in PIXELS with aggressive scaling
                                              let heightPx = 0;
                                              if (maxCount > 0 && count > 0) {
                                                // Map count range to pixel range: 80px minimum to 360px maximum
                                                const minHeightPx = 80;
                                                const maxHeightPx = 360;
                                                heightPx = minHeightPx + ((count / maxCount) * (maxHeightPx - minHeightPx));
                                              }

                                              return (
                                                <div key={idx} className="flex-1 flex flex-col items-center justify-end group relative" style={{ minWidth: '10px' }}>
                                                  {count > 0 ? (
                                                    <>
                                                      <div
                                                        className="w-full rounded-t bg-cyan-200 hover:opacity-75 cursor-pointer border border-cyan-400"
                                                        style={{ height: `${heightPx}px` }}
                                                        title={`Count: ${count}`}
                                                      >
                                                      </div>
                                                    </>
                                                  ) : (
                                                    <div className="w-full h-[2px] bg-gray-200" title="No data"></div>
                                                  )}
                                                  {/* Tooltip on hover */}
                                                  {count > 0 && (
                                                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20">
                                                      <div className="bg-gray-900 text-white text-xs rounded px-3 py-2 whitespace-nowrap shadow-xl">
                                                        <div className="font-semibold mb-1">Range: {(binStart * 100).toFixed(2)}% to {(binEnd * 100).toFixed(2)}%</div>
                                                        <div>Count: {count}</div>
                                                        <div>Frequency: {((count / totalReturns) * 100).toFixed(1)}%</div>
                                                      </div>
                                                      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                                    </div>
                                                  )}
                                                </div>
                                              );
                                            })}

                                            {/* Bell Curve Overlay */}
                                            {(() => {
                                              // Calculate mean and standard deviation
                                              const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
                                              const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
                                              const stdDev = Math.sqrt(variance);

                                              // Extend bell curve way beyond histogram (±5 sigma from mean)
                                              const curvePoints = 600;
                                              const sigmaExtension = 5;

                                              const theoreticalStart = mean - sigmaExtension * stdDev;
                                              const theoreticalEnd = mean + sigmaExtension * stdDev;
                                              const theoreticalRange = theoreticalEnd - theoreticalStart;

                                              // Histogram range (actual data)
                                              const histogramRange = maxReturn - minReturn;

                                              const rangeStep = theoreticalRange / curvePoints;

                                              // Normal distribution PDF function
                                              const normalPDF = (x, mu, sigma) => {
                                                const exponent = -Math.pow(x - mu, 2) / (2 * Math.pow(sigma, 2));
                                                return (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(exponent);
                                              };

                                              // Generate curve coordinates
                                              const curveData = [];
                                              let maxPDF = 0;
                                              for (let i = 0; i <= curvePoints; i++) {
                                                const x = theoreticalStart + i * rangeStep;
                                                const y = normalPDF(x, mean, stdDev);
                                                curveData.push({ x, y });
                                                if (y > maxPDF) maxPDF = y;
                                              }

                                              // Scale curve to match histogram height (360px max)
                                              const scaleFactor = 360 / maxPDF;

                                              // Map curve coordinates: histogram is at x=0 to 100, curve extends beyond
                                              const pathData = curveData.map((point, i) => {
                                                // Map theoretical x-value to position relative to histogram
                                                // Histogram occupies 0-100, curve will extend beyond
                                                const xPercent = ((point.x - minReturn) / histogramRange) * 100;
                                                const y = 100 - (point.y * scaleFactor / 360 * 100);
                                                return `${i === 0 ? 'M' : 'L'} ${xPercent} ${y}`;
                                              }).join(' ');

                                              // Calculate viewBox: need to show curve tails extending beyond 0-100
                                              // Find how far the curve extends in percentage terms
                                              const leftTailExtent = ((minReturn - theoreticalStart) / histogramRange) * 100;
                                              const rightTailExtent = ((theoreticalEnd - maxReturn) / histogramRange) * 100;

                                              const viewBoxLeft = -leftTailExtent;
                                              const viewBoxWidth = 100 + leftTailExtent + rightTailExtent;

                                              return (
                                                <svg
                                                  className="absolute inset-0 pointer-events-none"
                                                  viewBox={`${viewBoxLeft} 0 ${viewBoxWidth} 100`}
                                                  preserveAspectRatio="none"
                                                  style={{ width: 'calc(100% - 8px)', height: '100%', marginLeft: '8px', marginBottom: '8px' }}
                                                >
                                                  <path
                                                    d={pathData}
                                                    fill="none"
                                                    stroke="rgba(128, 0, 128, 0.9)"
                                                    strokeWidth="0.3"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                  />
                                                </svg>
                                              );
                                            })()}
                                          </div>

                                          {/* X-axis labels */}
                                          <div className="flex justify-between text-xs text-gray-600 font-semibold mt-2 px-2">
                                            <span>{(minReturn * 100).toFixed(2)}%</span>
                                            <span className="text-gray-800">Returns (%)</span>
                                            <span>{(maxReturn * 100).toFixed(2)}%</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Legend */}
                                      <div className="flex items-center justify-center gap-8 text-sm">
                                        <div className="flex items-center gap-2">
                                          <div className="w-6 h-6 bg-cyan-200 rounded border border-cyan-400"></div>
                                          <span className="text-gray-700">Histogram Bars (Actual Data)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-0.5 bg-purple-600"></div>
                                          <span className="text-gray-700 font-semibold">Normal Distribution Curve (Theoretical)</span>
                                        </div>
                                      </div>

                                      <div className="bg-white rounded-lg p-4 text-sm text-gray-700 border border-purple-200">
                                        <p><strong>📊 Distribution Analysis:</strong> This histogram shows the actual distribution of <em>logarithmic returns</em> (bars) compared to the theoretical normal distribution (purple curve).
                                        Since prices follow Geometric Brownian Motion, log returns are theoretically normally distributed, so the histogram should closely match the curve.
                                        In a normal distribution, approximately 68% of observations fall within ±1σ, 95% within ±2σ, and 99.7% within ±3σ of the mean.
                                        The purple curve extends to ±5σ to show the full theoretical tails.
                                        Hover over any bar to see detailed information about that return range.</p>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  )}
                        </div>
                      )}
                    </div>

                    {/* Portfolio Analysis Section */}
                    <div id="portfolio-analysis" className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-indigo-300 shadow-lg scroll-mt-24">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                            <Target className="w-5 h-5" />
                          </div>
                          Portfolio Analysis
                        </h3>
                        <p className="text-sm text-gray-600">
                          Calculate portfolio metrics based on your inputs
                        </p>
                      </div>

                      {inputMode === 'direct' && directInputStocks.length >= 2 && (
                        <div className="space-y-4">
                          {(() => {
                            const totalWeight = directInputStocks.reduce((sum, s) => sum + s.weight, 0);
                            const isValidWeight = Math.abs(totalWeight - 1.0) < 0.001;

                            if (!isValidWeight) {
                              return (
                                <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-400 text-center">
                                  <p className="text-yellow-800 font-semibold">
                                    ⚠️ Please ensure portfolio weights sum to 100% to view analysis
                                  </p>
                                </div>
                              );
                            }

                            // Portfolio Expected Return
                            const portfolioExpectedReturn = directInputStocks.reduce((sum, stock) =>
                              sum + (stock.weight * stock.expectedReturn), 0
                            );

                            // Portfolio Variance - using correlation matrix
                            let portfolioVariance = 0;
                            const covMatrix = getCovarianceMatrix();

                            // Calculate portfolio variance: w^T * Cov * w
                            for (let i = 0; i < directInputStocks.length; i++) {
                              for (let j = 0; j < directInputStocks.length; j++) {
                                portfolioVariance += directInputStocks[i].weight * directInputStocks[j].weight * covMatrix[i][j];
                              }
                            }

                            const portfolioRisk = Math.sqrt(portfolioVariance);

                            // Get portfolio data
                            const { tangencyPortfolio, tangencyWeights } = portfolioChartData || {};

                            // Calculate P2 metrics
                            let p2Metrics = null;
                            if (tangencyPortfolio) {
                              const sharpeRatio = (tangencyPortfolio.expectedReturn - riskFreeRate) / tangencyPortfolio.risk;
                              const p2ExpectedReturn = riskFreeRate + sharpeRatio * portfolioRisk;
                              const p2Variance = portfolioRisk * portfolioRisk; // Same risk as P1
                              p2Metrics = {
                                expectedReturn: p2ExpectedReturn,
                                variance: p2Variance,
                                risk: portfolioRisk
                              };
                            }

                            return (
                              <div className="space-y-6">
                                {/* Portfolio Comparison Header */}
                                <div className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-lg p-4 border-2 border-indigo-300">
                                  <h4 className="font-bold text-indigo-900 mb-2">📊 Portfolio Comparison</h4>
                                  <p className="text-sm text-gray-700">
                                    Compare your portfolio (P1) with the optimal portfolio on the CML (P2) and the Tangency Portfolio
                                  </p>
                                </div>

                                {/* Dollar Value Investment Breakdown */}
                                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 rounded-xl p-6 border-2 border-purple-300 shadow-xl">
                                  <div className="flex items-center justify-between mb-4">
                                    <div>
                                      <h4 className="font-bold text-purple-900 mb-1 text-lg">💰 Investment Allocation</h4>
                                      <p className="text-sm text-gray-600">See how your investment is allocated across portfolios</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <label className="text-sm font-semibold text-purple-900">Investment Amount:</label>
                                      <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-700 font-bold">$</span>
                                        <input
                                          type="number"
                                          value={investmentAmount}
                                          onChange={(e) => setInvestmentAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                                          className="pl-8 pr-4 py-2 w-40 border-2 border-purple-300 rounded-lg text-right font-bold text-purple-900 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                          min="0"
                                          step="1000"
                                        />
                                      </div>
                                    </div>
                                  </div>

                                  {investmentAmount > 0 && (
                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                                      {/* P1 Dollar Breakdown */}
                                      <div className="bg-white rounded-lg p-4 border-2 border-green-300 shadow-md">
                                        <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-green-200">
                                          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-900"></div>
                                          <h5 className="font-bold text-green-900">P1 Allocation</h5>
                                        </div>
                                        <div className="space-y-2">
                                          {directInputStocks.map((stock, i) => {
                                            const dollarAmount = investmentAmount * stock.weight;
                                            return (
                                              <div key={i} className="bg-green-50 rounded-lg p-2 border border-green-200">
                                                <div className="flex justify-between items-center">
                                                  <span className="text-sm font-semibold text-gray-700">{stock.name}</span>
                                                  <span className="text-xs text-gray-500">{(stock.weight * 100).toFixed(1)}%</span>
                                                </div>
                                                <div className="text-lg font-bold text-green-700 mt-1">
                                                  ${dollarAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </div>
                                              </div>
                                            );
                                          })}

                                          {/* P1 Performance Metrics */}
                                          <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-3 border-2 border-green-400 mt-3">
                                            <div className="space-y-2">
                                              <div className="flex justify-between items-center pb-2 border-b border-green-300">
                                                <span className="text-xs font-semibold text-gray-700">Total Investment</span>
                                                <span className="text-lg font-bold text-green-900">
                                                  ${investmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-gray-700">Expected Return</span>
                                                <span className="text-base font-bold text-green-700">
                                                  ${(investmentAmount * portfolioExpectedReturn).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                              </div>
                                              <div className="flex justify-between items-center">
                                                <span className="text-xs font-semibold text-gray-700">Risk (±1σ)</span>
                                                <span className="text-base font-bold text-red-700">
                                                  ±${(investmentAmount * portfolioRisk).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                </span>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>

                                      {/* P2 Dollar Breakdown */}
                                      {p2Metrics && tangencyPortfolio && tangencyWeights && (
                                        <div className="bg-white rounded-lg p-4 border-2 border-blue-300 shadow-md">
                                          <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-blue-200">
                                            <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-900"></div>
                                            <h5 className="font-bold text-blue-900">P2 Allocation</h5>
                                          </div>
                                          <div className="space-y-2">
                                            {(() => {
                                              // Calculate weight on tangency portfolio for P2
                                              const weightOnTangency = portfolioRisk / tangencyPortfolio.risk;
                                              const weightOnRiskFree = 1 - weightOnTangency;
                                              const rfDollars = investmentAmount * weightOnRiskFree;
                                              const tangencyDollars = investmentAmount * weightOnTangency;

                                              return (
                                                <>
                                                  <div className="bg-blue-50 rounded-lg p-2 border border-blue-200">
                                                    <div className="flex justify-between items-center">
                                                      <span className="text-sm font-semibold text-gray-700">Risk-Free Asset</span>
                                                      <span className="text-xs text-gray-500">{(weightOnRiskFree * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-blue-700 mt-1">
                                                      ${rfDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                  </div>

                                                  <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-2 border border-amber-300">
                                                    <div className="flex justify-between items-center">
                                                      <span className="text-sm font-semibold text-amber-900">Tangency Portfolio</span>
                                                      <span className="text-xs text-amber-700">{(weightOnTangency * 100).toFixed(1)}%</span>
                                                    </div>
                                                    <div className="text-lg font-bold text-amber-800 mt-1">
                                                      ${tangencyDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                    </div>
                                                    <div className="mt-2 pt-2 border-t border-amber-300 space-y-1">
                                                      <div className="text-xs text-amber-900 font-semibold mb-1">Within Tangency:</div>
                                                      {directInputStocks.map((stock, i) => {
                                                        const stockDollars = tangencyDollars * tangencyWeights[i];
                                                        return (
                                                          <div key={i} className="flex justify-between text-xs">
                                                            <span className="text-gray-600">{stock.name}</span>
                                                            <span className="font-bold text-amber-800">
                                                              ${stockDollars.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                            </span>
                                                          </div>
                                                        );
                                                      })}
                                                    </div>
                                                  </div>

                                                  {/* P2 Performance Metrics */}
                                                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-3 border-2 border-blue-400 mt-3">
                                                    <div className="space-y-2">
                                                      <div className="flex justify-between items-center pb-2 border-b border-blue-300">
                                                        <span className="text-xs font-semibold text-gray-700">Total Investment</span>
                                                        <span className="text-lg font-bold text-blue-900">
                                                          ${investmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                      </div>
                                                      <div className="flex justify-between items-center">
                                                        <span className="text-xs font-semibold text-gray-700">Expected Return</span>
                                                        <span className="text-base font-bold text-blue-700">
                                                          ${(investmentAmount * p2Metrics.expectedReturn).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                      </div>
                                                      <div className="flex justify-between items-center">
                                                        <span className="text-xs font-semibold text-gray-700">Risk (±1σ)</span>
                                                        <span className="text-base font-bold text-red-700">
                                                          ±${(investmentAmount * p2Metrics.risk).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                        </span>
                                                      </div>
                                                      <div className="mt-2 pt-2 border-t border-blue-300 bg-green-50 rounded px-2 py-1">
                                                        <div className="text-xs text-green-800 font-semibold">
                                                          +${((investmentAmount * p2Metrics.expectedReturn) - (investmentAmount * portfolioExpectedReturn)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} more than P1
                                                        </div>
                                                      </div>
                                                    </div>
                                                  </div>
                                                </>
                                              );
                                            })()}
                                          </div>
                                        </div>
                                      )}

                                      {/* Tangency Dollar Breakdown */}
                                      {tangencyWeights && (
                                        <div className="bg-white rounded-lg p-4 border-2 border-amber-300 shadow-md">
                                          <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-amber-200">
                                            <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-amber-900"></div>
                                            <h5 className="font-bold text-amber-900">Tangency Allocation</h5>
                                          </div>
                                          <div className="space-y-2">
                                            {directInputStocks.map((stock, i) => {
                                              const dollarAmount = investmentAmount * tangencyWeights[i];
                                              return (
                                                <div key={i} className="bg-amber-50 rounded-lg p-2 border border-amber-200">
                                                  <div className="flex justify-between items-center">
                                                    <span className="text-sm font-semibold text-gray-700">{stock.name}</span>
                                                    <span className="text-xs text-gray-500">{(tangencyWeights[i] * 100).toFixed(1)}%</span>
                                                  </div>
                                                  <div className="text-lg font-bold text-amber-700 mt-1">
                                                    ${dollarAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                  </div>
                                                </div>
                                              );
                                            })}

                                            {/* Tangency Performance Metrics */}
                                            <div className="bg-gradient-to-br from-amber-100 to-yellow-100 rounded-lg p-3 border-2 border-amber-400 mt-3">
                                              <div className="space-y-2">
                                                <div className="flex justify-between items-center pb-2 border-b border-amber-300">
                                                  <span className="text-xs font-semibold text-gray-700">Total Investment</span>
                                                  <span className="text-lg font-bold text-amber-900">
                                                    ${investmentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                  <span className="text-xs font-semibold text-gray-700">Expected Return</span>
                                                  <span className="text-base font-bold text-amber-700">
                                                    ${(investmentAmount * tangencyPortfolio.expectedReturn).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                  </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                  <span className="text-xs font-semibold text-gray-700">Risk (±1σ)</span>
                                                  <span className="text-base font-bold text-red-700">
                                                    ±${(investmentAmount * tangencyPortfolio.risk).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                                  </span>
                                                </div>
                                                <div className="mt-2 pt-2 border-t border-amber-300 bg-gradient-to-r from-yellow-50 to-amber-50 rounded px-2 py-1">
                                                  <div className="text-xs text-amber-900 font-semibold">
                                                    Sharpe Ratio: {tangencyPortfolio.sharpeRatio.toFixed(4)}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}

                                  {investmentAmount <= 0 && (
                                    <div className="bg-yellow-50 rounded-lg p-4 border-2 border-yellow-300 text-center">
                                      <p className="text-yellow-800 font-semibold">
                                        💡 Enter an investment amount above to see the dollar allocation breakdown
                                      </p>
                                    </div>
                                  )}
                                </div>

                                {/* Three-column comparison */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  {/* P1 - Your Portfolio */}
                                  <div className="bg-white rounded-lg p-5 border-2 border-green-200 shadow-md">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-green-200">
                                      <div className="w-3 h-3 bg-green-500 rounded-full border-2 border-green-900"></div>
                                      <h5 className="font-bold text-green-900">P1 (Your Portfolio)</h5>
                                    </div>

                                    <div className="space-y-3">
                                      <div className="bg-green-50 rounded p-3 border border-green-200">
                                        <div className="text-xs text-gray-600 mb-1">Expected Return</div>
                                        <div className="text-2xl font-bold text-green-700">
                                          {(portfolioExpectedReturn * 100).toFixed(2)}%
                                        </div>
                                      </div>

                                      <div className="bg-purple-50 rounded p-3 border border-purple-200">
                                        <div className="text-xs text-gray-600 mb-1">Variance (σ²)</div>
                                        <div className="text-lg font-bold text-purple-700">
                                          {portfolioVariance.toFixed(6)}
                                        </div>
                                      </div>

                                      <div className="bg-red-50 rounded p-3 border border-red-200">
                                        <div className="text-xs text-gray-600 mb-1">Risk (σ)</div>
                                        <div className="text-2xl font-bold text-red-700">
                                          {(portfolioRisk * 100).toFixed(2)}%
                                        </div>
                                      </div>

                                      <div className="bg-gray-50 rounded p-3 border border-gray-200">
                                        <div className="text-xs text-gray-600 mb-1">Weights</div>
                                        <div className="text-xs font-mono">
                                          {directInputStocks.map((s, i) => (
                                            <div key={i} className="flex justify-between">
                                              <span>{s.name}:</span>
                                              <span className="font-bold">{(s.weight * 100).toFixed(1)}%</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  {/* P2 - Portfolio on CML */}
                                  {p2Metrics && (
                                    <div className="bg-white rounded-lg p-5 border-2 border-blue-200 shadow-md">
                                      <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-blue-200">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-900"></div>
                                        <h5 className="font-bold text-blue-900">P2 (On CML)</h5>
                                      </div>

                                      <div className="space-y-3">
                                        <div className="bg-blue-50 rounded p-3 border border-blue-200">
                                          <div className="text-xs text-gray-600 mb-1">Expected Return</div>
                                          <div className="text-2xl font-bold text-blue-700">
                                            {(p2Metrics.expectedReturn * 100).toFixed(2)}%
                                          </div>
                                          <div className="text-xs text-green-600 font-semibold mt-1">
                                            +{((p2Metrics.expectedReturn - portfolioExpectedReturn) * 100).toFixed(2)}% vs P1
                                          </div>
                                        </div>

                                        <div className="bg-purple-50 rounded p-3 border border-purple-200">
                                          <div className="text-xs text-gray-600 mb-1">Variance (σ²)</div>
                                          <div className="text-lg font-bold text-purple-700">
                                            {p2Metrics.variance.toFixed(6)}
                                          </div>
                                        </div>

                                        <div className="bg-red-50 rounded p-3 border border-red-200">
                                          <div className="text-xs text-gray-600 mb-1">Risk (σ)</div>
                                          <div className="text-2xl font-bold text-red-700">
                                            {(p2Metrics.risk * 100).toFixed(2)}%
                                          </div>
                                          <div className="text-xs text-gray-600 mt-1">Same as P1</div>
                                        </div>

                                        <div className="bg-blue-100 rounded p-3 border border-blue-300">
                                          <div className="text-xs text-blue-900 font-semibold">
                                            Optimal mix of Risk-Free asset and Tangency Portfolio at P1's risk level
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* Tangency Portfolio */}
                                  {tangencyPortfolio && tangencyWeights && (
                                    <div className="bg-white rounded-lg p-5 border-2 border-amber-200 shadow-md">
                                      <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-amber-200">
                                        <div className="w-3 h-3 bg-amber-500 rounded-full border-2 border-amber-900"></div>
                                        <h5 className="font-bold text-amber-900">Tangency Portfolio</h5>
                                      </div>

                                      <div className="space-y-3">
                                        <div className="bg-amber-50 rounded p-3 border border-amber-200">
                                          <div className="text-xs text-gray-600 mb-1">Expected Return</div>
                                          <div className="text-2xl font-bold text-amber-700">
                                            {(tangencyPortfolio.expectedReturn * 100).toFixed(2)}%
                                          </div>
                                        </div>

                                        <div className="bg-purple-50 rounded p-3 border border-purple-200">
                                          <div className="text-xs text-gray-600 mb-1">Variance (σ²)</div>
                                          <div className="text-lg font-bold text-purple-700">
                                            {(tangencyPortfolio.risk * tangencyPortfolio.risk).toFixed(6)}
                                          </div>
                                        </div>

                                        <div className="bg-red-50 rounded p-3 border border-red-200">
                                          <div className="text-xs text-gray-600 mb-1">Risk (σ)</div>
                                          <div className="text-2xl font-bold text-red-700">
                                            {(tangencyPortfolio.risk * 100).toFixed(2)}%
                                          </div>
                                        </div>

                                        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded p-3 border border-amber-300">
                                          <div className="text-xs text-gray-600 mb-1">Sharpe Ratio</div>
                                          <div className="text-xl font-bold text-amber-900">
                                            {tangencyPortfolio.sharpeRatio.toFixed(4)}
                                          </div>
                                          <div className="text-xs text-amber-700 mt-1">Highest risk-adjusted return</div>
                                        </div>

                                        <div className="bg-gray-50 rounded p-3 border border-gray-200">
                                          <div className="text-xs text-gray-600 mb-1">Optimal Weights</div>
                                          <div className="text-xs font-mono">
                                            {directInputStocks.map((s, i) => (
                                              <div key={i} className="flex justify-between">
                                                <span>{s.name}:</span>
                                                <span className="font-bold">{(tangencyWeights[i] * 100).toFixed(1)}%</span>
                                              </div>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </div>

                                {/* Insights */}
                                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border-2 border-yellow-300">
                                  <h5 className="font-bold text-yellow-900 mb-2">💡 Key Insights</h5>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    <li>• <strong>P2 vs P1:</strong> For the same risk, P2 offers higher returns by using the optimal Tangency Portfolio</li>
                                    <li>• <strong>Tangency Portfolio:</strong> Maximizes the Sharpe ratio - the best risk-adjusted return among all risky portfolios</li>
                                    <li>• <strong>Capital Market Line (CML):</strong> Combining Risk-Free + Tangency Portfolio dominates all other combinations</li>
                                  </ul>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {inputMode === 'historical' && !pricesGenerated && (
                        <div className="bg-gray-50 rounded-lg p-8 border-2 border-gray-200 text-center">
                          <p className="text-gray-600">Generate historical prices to view portfolio analysis</p>
                        </div>
                      )}
                    </div>

                    {/* Visualization Section */}
                    <div id="visualization" className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-6 border-2 border-pink-300 shadow-lg scroll-mt-24">
                      <div className="mb-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                          <div className="w-8 h-8 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold">
                            <LineChartIcon className="w-5 h-5" />
                          </div>
                          Visualization
                        </h3>
                        <p className="text-sm text-gray-600">
                          Visual representations of your portfolio
                        </p>
                      </div>

                      {/* Compact Chart Controls */}
                      {inputMode === 'direct' && directInputStocks.length >= 2 && (
                        <div className="bg-white rounded-lg p-4 border-2 border-indigo-200 mb-4">
                          <h4 className="font-bold text-indigo-900 mb-3">Chart Controls</h4>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Risk-Free Rate */}
                            <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-semibold text-green-900">Risk-Free Rate</span>
                                <span className="text-lg font-bold text-green-700">{(riskFreeRate * 100).toFixed(2)}%</span>
                              </div>
                              <input
                                type="range"
                                min="0"
                                max="0.10"
                                step="0.0025"
                                value={riskFreeRate}
                                onChange={(e) => setRiskFreeRate(parseFloat(e.target.value))}
                                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-green-600"
                              />
                              <div className="flex justify-between text-xs text-gray-600 mt-1">
                                <span>0%</span>
                                <span>10%</span>
                              </div>
                            </div>

                            {/* Portfolio Mesh Density (for 3+ stocks) */}
                            {directInputStocks.length >= 3 && (
                              <div className="bg-pink-50 rounded-lg p-3 border border-pink-200">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm font-semibold text-pink-900">Mesh Density</span>
                                  <span className="text-lg font-bold text-pink-700">{numPortfolios.toLocaleString()}</span>
                                </div>
                                <input
                                  type="range"
                                  min="1000"
                                  max="15000"
                                  step="1000"
                                  value={numPortfolios}
                                  onChange={(e) => setNumPortfolios(parseInt(e.target.value))}
                                  className="w-full h-2 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                                />
                                <div className="flex justify-between text-xs text-gray-600 mt-1">
                                  <span>1K</span>
                                  <span>15K</span>
                                </div>
                              </div>
                            )}

                            {/* Pairwise Frontiers Toggle (for 3+ stocks) */}
                            {directInputStocks.length >= 3 && (
                              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm font-semibold text-blue-900">Pairwise Frontiers</span>
                                  <button
                                    onClick={() => setShowPairwiseFrontiers(!showPairwiseFrontiers)}
                                    className={`px-3 py-1 rounded-lg text-sm font-semibold transition-all duration-200 ${
                                      showPairwiseFrontiers
                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                                  >
                                    {showPairwiseFrontiers ? 'ON' : 'OFF'}
                                  </button>
                                </div>
                              </div>
                            )}

                            {/* Compact Chart Visibility & Zoom Controls */}
                            <div className="bg-gradient-to-br from-slate-50 to-gray-50 rounded-lg p-3 border border-slate-200">
                              <div className="space-y-2">
                                {/* Visibility Toggles */}
                                <div className="grid grid-cols-3 gap-2">
                                  <button
                                    onClick={() => setShowRf(!showRf)}
                                    className={`px-2 py-1.5 rounded text-xs font-semibold transition-all duration-200 ${
                                      showRf
                                        ? 'bg-cyan-500 text-white hover:bg-cyan-600 shadow-sm'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                  >
                                    Rf {showRf ? '✓' : '✗'}
                                  </button>
                                  <button
                                    onClick={() => setShowCAL(!showCAL)}
                                    className={`px-2 py-1.5 rounded text-xs font-semibold transition-all duration-200 ${
                                      showCAL
                                        ? 'bg-green-500 text-white hover:bg-green-600 shadow-sm'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                  >
                                    CAL {showCAL ? '✓' : '✗'}
                                  </button>
                                  <button
                                    onClick={() => setShowCML(!showCML)}
                                    className={`px-2 py-1.5 rounded text-xs font-semibold transition-all duration-200 ${
                                      showCML
                                        ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-sm'
                                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                    }`}
                                  >
                                    CML {showCML ? '✓' : '✗'}
                                  </button>
                                </div>

                                {/* Zoom Control */}
                                <div className="flex items-center gap-2 pt-1">
                                  <span className="text-xs font-semibold text-gray-700 w-12">Zoom:</span>
                                  <button
                                    onClick={() => setChartZoom(Math.max(0.5, chartZoom - 0.1))}
                                    className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-gray-900 font-bold text-xs"
                                    disabled={chartZoom <= 0.5}
                                  >
                                    −
                                  </button>
                                  <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={chartZoom}
                                    onChange={(e) => setChartZoom(parseFloat(e.target.value))}
                                    className="flex-1 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                  />
                                  <button
                                    onClick={() => setChartZoom(Math.min(2, chartZoom + 0.1))}
                                    className="px-1.5 py-0.5 bg-slate-200 hover:bg-slate-300 rounded text-gray-900 font-bold text-xs"
                                    disabled={chartZoom >= 2}
                                  >
                                    +
                                  </button>
                                  <span className="text-xs font-bold text-purple-700 w-10 text-center">{(chartZoom * 100).toFixed(0)}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {inputMode === 'direct' && directInputStocks.length >= 2 && portfolioChartData && (
                        <div className="space-y-4">
                          {(() => {
                            // Use memoized portfolio data
                            const { frontierPoints2Stocks, mvp, randomPortfolios, pairwiseFrontiers, mgp, currentPortfolio, tangencyPortfolio, tangencyWeights } = portfolioChartData;

                            // Calculate chart boundaries (include risk-free asset)
                            const allPoints = [
                              { risk: 0, expectedReturn: riskFreeRate }, // Risk-free asset
                              ...directInputStocks.map(s => ({ risk: s.stdDev, expectedReturn: s.expectedReturn })),
                              ...(frontierPoints2Stocks || []),
                              ...(randomPortfolios || []),
                              ...pairwiseFrontiers.flatMap(pf => pf.points)
                            ];

                            const minRisk = Math.min(...allPoints.map(p => p.risk));
                            const maxRisk = Math.max(...allPoints.map(p => p.risk));
                            const minReturn = Math.min(...allPoints.map(p => p.expectedReturn));
                            const maxReturn = Math.max(...allPoints.map(p => p.expectedReturn));

                            // Add 10% padding
                            const riskPadding = (maxRisk - minRisk) * 0.1;
                            const returnPadding = (maxReturn - minReturn) * 0.1;

                            const chartMinRisk = Math.max(0, minRisk - riskPadding);
                            const chartMaxRisk = maxRisk + riskPadding;
                            const chartMinReturn = minReturn - returnPadding;
                            const chartMaxReturn = maxReturn + returnPadding;

                            // Chart dimensions
                            const chartWidth = 800 * chartZoom;
                            const chartHeight = 500 * chartZoom;
                            const margin = { top: 20, right: 20, bottom: 60, left: 80 };
                            const plotWidth = chartWidth - margin.left - margin.right;
                            const plotHeight = chartHeight - margin.top - margin.bottom;

                            // Scaling functions
                            const scaleX = (risk) => {
                              return margin.left + ((risk - chartMinRisk) / (chartMaxRisk - chartMinRisk)) * plotWidth;
                            };

                            const scaleY = (ret) => {
                              return chartHeight - margin.bottom - ((ret - chartMinReturn) / (chartMaxReturn - chartMinReturn)) * plotHeight;
                            };

                            return (
                              <div className="bg-white rounded-lg p-6 border-2 border-pink-200">
                                <h4 className="font-bold text-pink-900 mb-4">Risk vs Expected Return Chart</h4>

                                <div className="bg-gray-50 rounded-lg p-4 border border-pink-200 overflow-x-auto">
                                  <svg width={chartWidth} height={chartHeight} className="mx-auto">

                                    {/* Axes */}
                                    <line
                                      x1={margin.left}
                                      y1={chartHeight - margin.bottom}
                                      x2={chartWidth - margin.right}
                                      y2={chartHeight - margin.bottom}
                                      stroke="#374151"
                                      strokeWidth="2"
                                    />
                                    <line
                                      x1={margin.left}
                                      y1={margin.top}
                                      x2={margin.left}
                                      y2={chartHeight - margin.bottom}
                                      stroke="#374151"
                                      strokeWidth="2"
                                    />

                                    {/* X-axis label */}
                                    <text
                                      x={chartWidth / 2}
                                      y={chartHeight - 10}
                                      textAnchor="middle"
                                      className="text-sm font-semibold fill-gray-700"
                                    >
                                      Risk (Standard Deviation σ)
                                    </text>

                                    {/* Y-axis label */}
                                    <text
                                      x={20}
                                      y={chartHeight / 2}
                                      textAnchor="middle"
                                      transform={`rotate(-90, 20, ${chartHeight / 2})`}
                                      className="text-sm font-semibold fill-gray-700"
                                    >
                                      Expected Return E[R]
                                    </text>

                                    {/* X-axis ticks */}
                                    {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((frac, idx) => {
                                      const risk = chartMinRisk + frac * (chartMaxRisk - chartMinRisk);
                                      const x = margin.left + frac * plotWidth;
                                      // Major ticks at 0, 0.2, 0.4, 0.6, 0.8, 1 (use index to avoid floating point issues)
                                      const isMajor = idx % 2 === 0;
                                      return (
                                        <g key={`x-tick-${frac}`}>
                                          <line
                                            x1={x}
                                            y1={chartHeight - margin.bottom}
                                            x2={x}
                                            y2={chartHeight - margin.bottom + (isMajor ? 8 : 4)}
                                            stroke="#374151"
                                            strokeWidth={isMajor ? "2" : "1"}
                                          />
                                          {isMajor && (
                                            <text
                                              x={x}
                                              y={chartHeight - margin.bottom + 22}
                                              textAnchor="middle"
                                              className="text-xs fill-gray-600"
                                            >
                                              {(risk * 100).toFixed(1)}%
                                            </text>
                                          )}
                                        </g>
                                      );
                                    })}

                                    {/* Y-axis ticks */}
                                    {[0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((frac, idx) => {
                                      const ret = chartMinReturn + (1 - frac) * (chartMaxReturn - chartMinReturn);
                                      const y = margin.top + frac * plotHeight;
                                      // Major ticks at 0, 0.2, 0.4, 0.6, 0.8, 1 (use index to avoid floating point issues)
                                      const isMajor = idx % 2 === 0;
                                      return (
                                        <g key={`y-tick-${frac}`}>
                                          <line
                                            x1={margin.left - (isMajor ? 8 : 4)}
                                            y1={y}
                                            x2={margin.left}
                                            y2={y}
                                            stroke="#374151"
                                            strokeWidth={isMajor ? "2" : "1"}
                                          />
                                          {isMajor && (
                                            <text
                                              x={margin.left - 12}
                                              y={y + 4}
                                              textAnchor="end"
                                              className="text-xs fill-gray-600"
                                            >
                                              {(ret * 100).toFixed(1)}%
                                            </text>
                                          )}
                                        </g>
                                      );
                                    })}

                                    {/* Systematic portfolio combinations (for 3+ stocks) - Color coded by efficiency */}
                                    {randomPortfolios && mgp && randomPortfolios.map((p, idx) => {
                                      // Portfolios below MGP return are inefficient (red)
                                      // Portfolios above MGP return are potentially efficient (blue)
                                      const isInefficient = p.expectedReturn < mgp.expectedReturn;
                                      const fillColor = isInefficient ? '#fca5a5' : '#bfdbfe';

                                      return (
                                        <circle
                                          key={`portfolio-${idx}`}
                                          cx={scaleX(p.risk)}
                                          cy={scaleY(p.expectedReturn)}
                                          r="1.5"
                                          fill={fillColor}
                                          opacity="0.5"
                                        />
                                      );
                                    })}

                                    {/* Pairwise efficient frontiers (for 3+ stocks) */}
                                    {showPairwiseFrontiers && pairwiseFrontiers.map((pf, pfIdx) => {
                                      const pathData = pf.points.map((p, i) => {
                                        const x = scaleX(p.risk);
                                        const y = scaleY(p.expectedReturn);
                                        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                                      }).join(' ');

                                      return (
                                        <path
                                          key={`pairwise-${pfIdx}`}
                                          d={pathData}
                                          fill="none"
                                          stroke="#93c5fd"
                                          strokeWidth="1"
                                          opacity="0.4"
                                        />
                                      );
                                    })}

                                    {/* Efficient frontier for 2 stocks with color coding */}
                                    {frontierPoints2Stocks && mvp && (() => {
                                      // Split into red (below MVP) and green (above MVP) segments
                                      const mvpIndex = frontierPoints2Stocks.findIndex(p => p === mvp);

                                      const redSegment = frontierPoints2Stocks.slice(0, mvpIndex + 1);
                                      const greenSegment = frontierPoints2Stocks.slice(mvpIndex);

                                      const redPath = redSegment.map((p, i) => {
                                        const x = scaleX(p.risk);
                                        const y = scaleY(p.expectedReturn);
                                        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                                      }).join(' ');

                                      const greenPath = greenSegment.map((p, i) => {
                                        const x = scaleX(p.risk);
                                        const y = scaleY(p.expectedReturn);
                                        return i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`;
                                      }).join(' ');

                                      return (
                                        <>
                                          {/* Red segment (below MVP) */}
                                          <path
                                            d={redPath}
                                            fill="none"
                                            stroke="#ef4444"
                                            strokeWidth="3"
                                          />
                                          {/* Green segment (above MVP) */}
                                          <path
                                            d={greenPath}
                                            fill="none"
                                            stroke="#22c55e"
                                            strokeWidth="3"
                                          />
                                        </>
                                      );
                                    })()}

                                    {/* MVP marker (for 2 stocks) */}
                                    {mvp && (
                                      <>
                                        <circle
                                          cx={scaleX(mvp.risk)}
                                          cy={scaleY(mvp.expectedReturn)}
                                          r="4"
                                          fill="#fbbf24"
                                          stroke="#92400e"
                                          strokeWidth="1.5"
                                        />
                                        <text
                                          x={scaleX(mvp.risk) + 8}
                                          y={scaleY(mvp.expectedReturn) - 8}
                                          className="text-xs font-bold fill-amber-700"
                                        >
                                          MVP
                                        </text>
                                      </>
                                    )}

                                    {/* MGP marker (for 3+ stocks) */}
                                    {mgp && (
                                      <>
                                        <circle
                                          cx={scaleX(mgp.risk)}
                                          cy={scaleY(mgp.expectedReturn)}
                                          r="4"
                                          fill="#ef4444"
                                          stroke="#991b1b"
                                          strokeWidth="1.5"
                                        />
                                        <text
                                          x={scaleX(mgp.risk) - 8}
                                          y={scaleY(mgp.expectedReturn) + 4}
                                          textAnchor="end"
                                          className="text-xs font-bold fill-red-700"
                                        >
                                          MGP
                                        </text>
                                      </>
                                    )}

                                    {/* Individual stocks */}
                                    {directInputStocks.map((stock, idx) => {
                                      const x = scaleX(stock.stdDev);
                                      const y = scaleY(stock.expectedReturn);

                                      // Extract just the letter from the stock name (e.g., "Stock A" -> "A")
                                      const stockLabel = stock.name.replace(/^Stock\s+/i, '');

                                      return (
                                        <g key={`stock-${idx}`}>
                                          <circle
                                            cx={x}
                                            cy={y}
                                            r="4"
                                            fill="#ec4899"
                                            stroke="#831843"
                                            strokeWidth="1.5"
                                          />
                                          <text
                                            x={x + 8}
                                            y={y + 4}
                                            className="text-xs font-bold fill-pink-900"
                                          >
                                            {stockLabel}
                                          </text>
                                        </g>
                                      );
                                    })}

                                    {/* Capital Allocation Line (CAL) - from risk-free to Your Portfolio */}
                                    {showCAL && currentPortfolio && (() => {
                                      const rfX = scaleX(0);
                                      const rfY = scaleY(riskFreeRate);
                                      const portfolioX = scaleX(currentPortfolio.risk);
                                      const portfolioY = scaleY(currentPortfolio.expectedReturn);

                                      // Extend CAL beyond the portfolio for leverage visualization
                                      const slope = (portfolioY - rfY) / (portfolioX - rfX);
                                      const extendedX = Math.min(chartWidth - margin.right, portfolioX + (portfolioX - rfX) * 0.5);
                                      const extendedY = rfY + slope * (extendedX - rfX);

                                      return (
                                        <line
                                          x1={rfX}
                                          y1={rfY}
                                          x2={extendedX}
                                          y2={extendedY}
                                          stroke="#10b981"
                                          strokeWidth="1.5"
                                          strokeDasharray="2,3"
                                          opacity="0.7"
                                        />
                                      );
                                    })()}

                                    {/* Risk-Free Asset */}
                                    {showRf && (() => {
                                      const rfX = scaleX(0);
                                      const rfY = scaleY(riskFreeRate);

                                      return (
                                        <g key="risk-free">
                                          <circle
                                            cx={rfX}
                                            cy={rfY}
                                            r="4"
                                            fill="#06b6d4"
                                            stroke="#0e7490"
                                            strokeWidth="2"
                                          />
                                          <text
                                            x={rfX + 8}
                                            y={rfY + 4}
                                            className="text-xs font-bold fill-cyan-900"
                                          >
                                            Rf
                                          </text>
                                        </g>
                                      );
                                    })()}

                                    {/* Capital Market Line (CML) - from risk-free to Tangency Portfolio */}
                                    {showCML && tangencyPortfolio && currentPortfolio && (() => {
                                      const rfX = scaleX(0);
                                      const rfY = scaleY(riskFreeRate);
                                      const tangencyX = scaleX(tangencyPortfolio.risk);
                                      const tangencyY = scaleY(tangencyPortfolio.expectedReturn);

                                      // Calculate P2 position (on CML with same risk as P1)
                                      const p2RiskX = scaleX(currentPortfolio.risk);

                                      // Extend CML beyond P2 to ensure it always passes through P2
                                      const slope = (tangencyY - rfY) / (tangencyX - rfX);
                                      // Extend to at least P2 position plus 20% more, or the original extension, whichever is further
                                      const minExtension = p2RiskX + (p2RiskX - rfX) * 0.2;
                                      const originalExtension = tangencyX + (tangencyX - rfX) * 0.6;
                                      const extendedX = Math.min(chartWidth - margin.right, Math.max(minExtension, originalExtension));
                                      const extendedY = rfY + slope * (extendedX - rfX);

                                      return (
                                        <line
                                          x1={rfX}
                                          y1={rfY}
                                          x2={extendedX}
                                          y2={extendedY}
                                          stroke="#3b82f6"
                                          strokeWidth="2"
                                          opacity="0.8"
                                        />
                                      );
                                    })()}

                                    {/* Tangency Portfolio (Optimal Portfolio) */}
                                    {tangencyPortfolio && (() => {
                                      const x = scaleX(tangencyPortfolio.risk);
                                      const y = scaleY(tangencyPortfolio.expectedReturn);

                                      return (
                                        <g key="tangency-portfolio">
                                          <circle
                                            cx={x}
                                            cy={y}
                                            r="4"
                                            fill="#f59e0b"
                                            stroke="#92400e"
                                            strokeWidth="2"
                                          />
                                          <circle
                                            cx={x}
                                            cy={y}
                                            r="1.5"
                                            fill="#fbbf24"
                                          />
                                          <text
                                            x={x - 8}
                                            y={y - 6}
                                            textAnchor="end"
                                            className="text-xs font-bold fill-amber-900"
                                          >
                                            Tangency
                                          </text>
                                          <text
                                            x={x - 8}
                                            y={y + 6}
                                            textAnchor="end"
                                            className="text-xs fill-amber-800"
                                          >
                                            SR: {tangencyPortfolio.sharpeRatio.toFixed(3)}
                                          </text>
                                        </g>
                                      );
                                    })()}

                                    {/* P1 - Your Portfolio */}
                                    {currentPortfolio && (() => {
                                      const x = scaleX(currentPortfolio.risk);
                                      const y = scaleY(currentPortfolio.expectedReturn);

                                      return (
                                        <g key="current-portfolio">
                                          <circle
                                            cx={x}
                                            cy={y}
                                            r="3.5"
                                            fill="#22c55e"
                                            stroke="#166534"
                                            strokeWidth="1.5"
                                          />
                                          <text
                                            x={x + 8}
                                            y={y + 4}
                                            className="text-xs font-bold fill-green-900"
                                          >
                                            P1
                                          </text>
                                        </g>
                                      );
                                    })()}

                                    {/* P2 - Portfolio on CML with same risk as P1 */}
                                    {currentPortfolio && tangencyPortfolio && (() => {
                                      // Calculate P2: point on CML with same risk as P1
                                      const riskP1 = currentPortfolio.risk;

                                      // CML equation: E[Rp] = Rf + [(E[Rtangency] - Rf) / σtangency] * σp
                                      const sharpeRatio = (tangencyPortfolio.expectedReturn - riskFreeRate) / tangencyPortfolio.risk;
                                      const expectedReturnP2 = riskFreeRate + sharpeRatio * riskP1;

                                      const x = scaleX(riskP1);
                                      const y = scaleY(expectedReturnP2);

                                      return (
                                        <g key="p2-portfolio">
                                          <circle
                                            cx={x}
                                            cy={y}
                                            r="3.5"
                                            fill="#3b82f6"
                                            stroke="#1e40af"
                                            strokeWidth="1.5"
                                          />
                                          <text
                                            x={x - 8}
                                            y={y - 3}
                                            textAnchor="end"
                                            className="text-xs font-bold fill-blue-900"
                                          >
                                            P2
                                          </text>
                                          {/* Vertical line showing improvement */}
                                          <line
                                            x1={x}
                                            y1={scaleY(currentPortfolio.expectedReturn)}
                                            x2={x}
                                            y2={y}
                                            stroke="#dc2626"
                                            strokeWidth="1.5"
                                            strokeDasharray="3,2"
                                            opacity="0.6"
                                          />
                                          <text
                                            x={x - 35}
                                            y={(scaleY(currentPortfolio.expectedReturn) + y) / 2}
                                            className="text-xs fill-red-700 font-semibold"
                                          >
                                            ΔE[R]
                                          </text>
                                        </g>
                                      );
                                    })()}
                                  </svg>
                                </div>

                                {/* Legend */}
                                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-pink-500 rounded-full border-2 border-pink-900"></div>
                                      <span className="text-gray-700">Individual Stocks</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-green-900"></div>
                                      <span className="text-gray-700 font-semibold">P1 (Your Portfolio)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-blue-900"></div>
                                      <span className="text-gray-700 font-semibold">P2 (On CML)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-cyan-500 rounded-full border-2 border-cyan-900"></div>
                                      <span className="text-gray-700">Risk-Free Asset</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-0.5 bg-green-500 border-dashed" style={{borderTop: '2px dashed #10b981'}}></div>
                                      <span className="text-gray-700">Capital Allocation Line (CAL)</span>
                                    </div>
                                    {directInputStocks.length === 2 && (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-0.5 bg-red-500"></div>
                                          <span className="text-gray-700">Inefficient Frontier (below MVP)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="w-8 h-0.5 bg-green-500"></div>
                                          <span className="text-gray-700">Efficient Frontier (above MVP)</span>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                  <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                      <div className="w-4 h-4 bg-amber-500 rounded-full border-2 border-amber-900"></div>
                                      <span className="text-gray-700 font-semibold">Tangency (Optimal)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-0.5 bg-blue-500" style={{height: '2px'}}></div>
                                      <span className="text-gray-700">Capital Market Line (CML)</span>
                                    </div>
                                    {directInputStocks.length === 2 && (
                                      <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-amber-400 rounded-full border-2 border-amber-900"></div>
                                        <span className="text-gray-700">Minimum Variance Portfolio (MVP)</span>
                                      </div>
                                    )}
                                    {directInputStocks.length >= 3 && (
                                      <>
                                        <div className="flex items-center gap-2">
                                          <div className="w-4 h-4 bg-red-400 rounded-full"></div>
                                          <span className="text-gray-700">Inefficient Portfolios (below MGP)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="w-4 h-4 bg-blue-300 rounded-full"></div>
                                          <span className="text-gray-700">Efficient Portfolios (above MGP)</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-red-900"></div>
                                          <span className="text-gray-700">Minimum Global Portfolio (MGP)</span>
                                        </div>
                                        {showPairwiseFrontiers && (
                                          <div className="flex items-center gap-2">
                                            <div className="w-8 h-0.5 bg-blue-500"></div>
                                            <span className="text-gray-700">Pairwise Efficient Frontiers</span>
                                          </div>
                                        )}
                                        <div className="text-xs text-gray-500 mt-2">
                                          ({randomPortfolios?.length || 0} randomly sampled portfolios)
                                        </div>
                                      </>
                                    )}
                                  </div>
                                </div>

                                {/* Info */}
                                <div className="mt-4 bg-pink-50 rounded-lg p-4 border border-pink-200">
                                  <p className="text-sm text-gray-700">
                                    <strong className="text-pink-900">📊 Visualization Explanation:</strong>
                                    {directInputStocks.length === 2 && (
                                      <> This chart shows the risk-return tradeoff for your two stocks. The curve represents all possible portfolio combinations.
                                      The <strong>Minimum Variance Portfolio (MVP)</strong> has the lowest risk. Portfolios below the MVP (red) are inefficient
                                      because you can achieve the same return with less risk. The efficient frontier (green) shows optimal portfolios.</>
                                    )}
                                    {directInputStocks.length >= 3 && (
                                      <> This chart shows {randomPortfolios?.length || 0} randomly sampled portfolios using Dirichlet distribution
                                      to uniformly cover the possibility space of your {directInputStocks.length} stocks.
                                      The <strong className="text-red-700">red dots</strong> are inefficient portfolios (below the Minimum Global Portfolio return), while <strong className="text-blue-700">blue dots</strong> are potentially efficient.
                                      The <strong className="text-red-700">MGP (Minimum Global Portfolio)</strong> marks the portfolio with the lowest risk.
                                      The thin gray lines show efficient frontiers between each pair of stocks, demonstrating the diversification possibilities available when combining multiple assets.</>
                                    )}
                                  </p>
                                </div>
                              </div>
                            );
                          })()}
                        </div>
                      )}

                      {inputMode === 'direct' && directInputStocks.length < 2 && (
                        <div className="bg-yellow-50 rounded-lg p-6 border-2 border-yellow-200 text-center">
                          <p className="text-yellow-800 font-semibold">
                            Add at least 2 stocks to view the visualization
                          </p>
                        </div>
                      )}

                      {inputMode === 'historical' && (
                        <div className="bg-gray-50 rounded-lg p-6 border-2 border-gray-200 text-center">
                          <p className="text-gray-600">
                            Switch to Direct Input mode to view portfolio visualization
                          </p>
                        </div>
                      )}
                    </div>
                    </div>
                </div>
              </div>
            )}

            {/* Returns & Risk Section */}
            {activeSection === 'returns' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Returns & Risk</h2>
                      <p className="text-gray-600">From historical prices to expected returns, variance, and risk measurement</p>
                    </div>
                  </div>

                  <div className="space-y-6 animate-fadeIn">
                      {/* Introduction with Flow */}
                      <div className="bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-purple-200">
                        <h3 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <Calculator className="w-6 h-6 text-purple-600" />
                          Interactive Return & Risk Calculators
                        </h3>
                        <p className="text-gray-700 mb-4">
                          Learn by doing! Use these interactive calculators to understand how different return calculation methods work.
                          Enter your own values and see the formulas compute in real-time with step-by-step breakdowns.
                        </p>

                        {/* Logical Flow */}
                        <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                          <h4 className="text-sm font-bold text-indigo-700 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4" />
                            The Logical Flow in Portfolio Analysis:
                          </h4>
                          <div className="flex flex-wrap items-center gap-2 text-xs">
                            <div className="px-3 py-2 bg-amber-100 text-amber-800 rounded-lg font-semibold border border-amber-300">
                              📊 Historical Prices
                            </div>
                            <span className="text-gray-400 font-bold">→</span>
                            <div className="px-3 py-2 bg-green-100 text-green-800 rounded-lg font-semibold border border-green-300">
                              📈 Returns (R)
                            </div>
                            <span className="text-gray-400 font-bold">→</span>
                            <div className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg font-semibold border border-blue-300">
                              💰 Expected Returns (μ)
                            </div>
                            <span className="text-gray-400 font-bold">→</span>
                            <div className="px-3 py-2 bg-cyan-100 text-cyan-800 rounded-lg font-semibold border border-cyan-300">
                              📊 Variance (σ²)
                            </div>
                            <span className="text-gray-400 font-bold">→</span>
                            <div className="px-3 py-2 bg-red-100 text-red-800 rounded-lg font-semibold border border-red-300 flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Risk (σ)
                            </div>
                            <span className="text-gray-400 font-bold">→</span>
                            <div className="px-3 py-2 bg-purple-100 text-purple-800 rounded-lg font-semibold border border-purple-300 flex items-center gap-1">
                              <Link2 className="w-3 h-3" />
                              Covariance (σxy)
                            </div>
                            <span className="text-gray-400 font-bold">→</span>
                            <div className="px-3 py-2 bg-indigo-100 text-indigo-800 rounded-lg font-semibold border border-indigo-300 flex items-center gap-1">
                              <Link2 className="w-3 h-3" />
                              Correlation (ρ)
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Historical Prices Section */}
                      <div id="historical-prices" className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                              📊
                            </div>
                            Historical Prices - The Foundation
                          </h3>
                          <p className="text-sm text-gray-600">All portfolio analysis begins with historical price data. Returns, expected returns, variance, and risk are all calculated from these prices.</p>
                        </div>

                        <div className="bg-white rounded-lg p-4 mb-4">
                          <div className="flex items-center gap-2 mb-3">
                            <Info className="w-4 h-4 text-amber-600" />
                            <span className="text-sm font-semibold text-amber-700">Understanding the Data Flow</span>
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Historical prices are the raw data points that traders and analysts use to understand how an asset has performed over time.
                            From these prices, we calculate returns, which measure the change in value. Returns then allow us to compute expected returns
                            (the average), variance (the spread), and ultimately risk (standard deviation). This data-driven approach forms the foundation
                            of modern portfolio theory.
                          </p>
                        </div>

                        {/* Sample Historical Prices for Two Stocks */}
                        <div className="grid md:grid-cols-2 gap-4">
                          {/* Stock A */}
                          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                            <h4 className="text-lg font-bold text-blue-800 mb-3 flex items-center gap-2">
                              <BarChart3 className="w-5 h-5" />
                              {historicalPrices.stockA.name}
                            </h4>

                            <div className="bg-white rounded-lg overflow-hidden border border-blue-200">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-gradient-to-r from-blue-100 to-indigo-100">
                                    <th className="px-3 py-2 text-left font-semibold text-blue-800">Date</th>
                                    <th className="px-3 py-2 text-right font-semibold text-blue-800">Price ($)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {historicalPrices.stockA.dates.map((date, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                      <td className="px-3 py-2 text-gray-700">{date}</td>
                                      <td className="px-3 py-2 text-right font-mono text-gray-900">
                                        ${historicalPrices.stockA.prices[idx].toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-3 p-3 bg-blue-100 rounded-lg border border-blue-200">
                              <div className="text-xs font-semibold text-blue-700 mb-1">Price Range</div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  Low: <span className="font-mono font-semibold text-blue-800">
                                    ${Math.min(...historicalPrices.stockA.prices).toFixed(2)}
                                  </span>
                                </span>
                                <span className="text-gray-700">
                                  High: <span className="font-mono font-semibold text-blue-800">
                                    ${Math.max(...historicalPrices.stockA.prices).toFixed(2)}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Stock B */}
                          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                            <h4 className="text-lg font-bold text-purple-800 mb-3 flex items-center gap-2">
                              <BarChart3 className="w-5 h-5" />
                              {historicalPrices.stockB.name}
                            </h4>

                            <div className="bg-white rounded-lg overflow-hidden border border-purple-200">
                              <table className="w-full text-sm">
                                <thead>
                                  <tr className="bg-gradient-to-r from-purple-100 to-pink-100">
                                    <th className="px-3 py-2 text-left font-semibold text-purple-800">Date</th>
                                    <th className="px-3 py-2 text-right font-semibold text-purple-800">Price ($)</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {historicalPrices.stockB.dates.map((date, idx) => (
                                    <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                      <td className="px-3 py-2 text-gray-700">{date}</td>
                                      <td className="px-3 py-2 text-right font-mono text-gray-900">
                                        ${historicalPrices.stockB.prices[idx].toFixed(2)}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            <div className="mt-3 p-3 bg-purple-100 rounded-lg border border-purple-200">
                              <div className="text-xs font-semibold text-purple-700 mb-1">Price Range</div>
                              <div className="flex justify-between text-sm">
                                <span className="text-gray-700">
                                  Low: <span className="font-mono font-semibold text-purple-800">
                                    ${Math.min(...historicalPrices.stockB.prices).toFixed(2)}
                                  </span>
                                </span>
                                <span className="text-gray-700">
                                  High: <span className="font-mono font-semibold text-purple-800">
                                    ${Math.max(...historicalPrices.stockB.prices).toFixed(2)}
                                  </span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Next Steps */}
                        <div className="mt-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                          <div className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white text-xs font-bold">→</span>
                            </div>
                            <div>
                              <h5 className="font-bold text-green-800 mb-1">What's Next?</h5>
                              <p className="text-sm text-gray-700">
                                With these historical prices, we can now calculate returns for each period. The calculators below will show you
                                different methods to measure how these prices changed over time - starting with simple returns, then moving to
                                logarithmic returns, expected returns, and finally risk measures.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Simple (Arithmetic) Returns Calculator */}
                      <div id="simple-returns" className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                              1
                            </div>
                            Simple (Arithmetic) Returns Calculator
                          </h3>
                          <p className="text-sm text-gray-600">The most intuitive way to calculate returns - percentage change in price</p>
                        </div>

                        {/* Theory Formula */}
                        <div className="bg-white rounded-lg p-4 mb-4 border border-green-200">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">📐 Formula:</h4>
                          <DisplayEquation>
                            {`R_t = \\frac{P_t - P_{t-1} + D_t}{P_{t-1}} = \\frac{P_t + D_t}{P_{t-1}} - 1`}
                          </DisplayEquation>
                          <p className="text-xs text-gray-600 mt-2">
                            Where: <em>P<sub>t</sub></em> = Final Price, <em>P<sub>t-1</sub></em> = Initial Price, <em>D<sub>t</sub></em> = Dividend
                          </p>
                        </div>

                        {/* With Your Values */}
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-300 mb-4">
                          <div className="text-[10px] font-bold text-green-600 mb-1 uppercase tracking-wide">With Your Values</div>
                          <div className="flex items-center justify-center overflow-x-auto">
                            <DisplayEquation>
                              {`R_t = \\frac{\\mathbf{${simpleCalc.p1.toFixed(2)}} + \\mathbf{${simpleCalc.dividend.toFixed(2)}}}{\\mathbf{${simpleCalc.p0.toFixed(2)}}} - 1`}
                            </DisplayEquation>
                          </div>
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Initial Price (P<sub>t-1</sub>)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500 font-semibold">$</span>
                              <input
                                type="number"
                                value={simpleCalc.p0}
                                onChange={(e) => setSimpleCalc({ ...simpleCalc, p0: parseFloat(e.target.value) || 0 })}
                                className="w-full pl-7 pr-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold"
                                step="0.01"
                              />
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Final Price (P<sub>t</sub>)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500 font-semibold">$</span>
                              <input
                                type="number"
                                value={simpleCalc.p1}
                                onChange={(e) => setSimpleCalc({ ...simpleCalc, p1: parseFloat(e.target.value) || 0 })}
                                className="w-full pl-7 pr-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold"
                                step="0.01"
                              />
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border-2 border-green-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Dividend (D<sub>t</sub>)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500 font-semibold">$</span>
                              <input
                                type="number"
                                value={simpleCalc.dividend}
                                onChange={(e) => setSimpleCalc({ ...simpleCalc, dividend: parseFloat(e.target.value) || 0 })}
                                className="w-full pl-7 pr-3 py-2 border-2 border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-semibold"
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Calculation Display */}
                        {(() => {
                          const simpleReturn = ((simpleCalc.p1 + simpleCalc.dividend) / simpleCalc.p0) - 1;
                          const isPositive = simpleReturn >= 0;

                          return (
                            <div className="bg-white rounded-lg p-6 border-2 border-green-300 shadow-inner">
                              <h4 className="font-bold text-gray-800 mb-3">💡 Step-by-Step Calculation:</h4>

                              <div className="space-y-2 text-sm font-mono mb-4">
                                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                  <span className="text-gray-700">Final Price + Dividend:</span>
                                  <span className="font-bold text-gray-900">${simpleCalc.p1.toFixed(2)} + ${simpleCalc.dividend.toFixed(2)} = ${(simpleCalc.p1 + simpleCalc.dividend).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                  <span className="text-gray-700">Divide by Initial Price:</span>
                                  <span className="font-bold text-gray-900">${(simpleCalc.p1 + simpleCalc.dividend).toFixed(2)} ÷ ${simpleCalc.p0.toFixed(2)} = {((simpleCalc.p1 + simpleCalc.dividend) / simpleCalc.p0).toFixed(6)}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-green-50 rounded">
                                  <span className="text-gray-700">Subtract 1:</span>
                                  <span className="font-bold text-gray-900">{((simpleCalc.p1 + simpleCalc.dividend) / simpleCalc.p0).toFixed(6)} - 1 = {simpleReturn.toFixed(6)}</span>
                                </div>
                              </div>

                              <div className={`text-center p-6 rounded-xl ${isPositive ? 'bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-400' : 'bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-400'}`}>
                                <div className="text-sm font-semibold text-gray-600 mb-1">Simple Return</div>
                                <div className={`text-5xl font-bold ${isPositive ? 'text-green-700' : 'text-red-700'}`}>
                                  {isPositive ? '+' : ''}{(simpleReturn * 100).toFixed(4)}%
                                </div>
                                <div className="text-xs text-gray-600 mt-2">
                                  {isPositive ? '📈 Gain' : '📉 Loss'} of ${Math.abs((simpleCalc.p1 + simpleCalc.dividend - simpleCalc.p0)).toFixed(2)} on ${simpleCalc.p0.toFixed(2)} investment
                                </div>
                              </div>

                              {/* Excel Formula Guide */}
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mt-4">
                                <div className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                                  <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">Excel</span>
                                  How to Calculate in Excel
                                </div>

                                {/* Mini Excel Table */}
                                <div className="bg-white rounded border border-gray-300 overflow-hidden mb-4 shadow-sm">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-100 border-b border-gray-300">
                                        <th className="w-12 px-2 py-2 text-center font-bold text-gray-600 border-r border-gray-300"></th>
                                        <th className="w-1/3 px-3 py-2 text-center font-bold text-gray-600 border-r border-gray-300">A</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600">B</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">1</td>
                                        <td className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Initial Price (P₀)</td>
                                        <td className="px-3 py-2 text-right font-mono text-gray-800 bg-blue-50">{simpleCalc.p0.toFixed(2)}</td>
                                      </tr>
                                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">2</td>
                                        <td className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Final Price (P₁)</td>
                                        <td className="px-3 py-2 text-right font-mono text-gray-800 bg-blue-50">{simpleCalc.p1.toFixed(2)}</td>
                                      </tr>
                                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">3</td>
                                        <td className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Dividend</td>
                                        <td className="px-3 py-2 text-right font-mono text-gray-800 bg-blue-50">{simpleCalc.dividend.toFixed(2)}</td>
                                      </tr>
                                      <tr className="bg-yellow-50 border-t-2 border-yellow-400">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">4</td>
                                        <td className="px-3 py-2 text-left font-bold text-green-700">Simple Return</td>
                                        <td className="px-3 py-2 text-right font-mono text-green-700 font-bold">{(simpleReturn * 100).toFixed(4)}%</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                {/* Excel Formula */}
                                <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3 mb-3">
                                  <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">Excel Formula (Cell B4):</div>
                                  <div className="font-mono text-base text-green-800 font-bold break-all">=(B2+B3)/B1-1</div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-1.5">
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>Format B4 as Percentage with 4 decimal places</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>If no dividend, use: =(B2-B1)/B1 or =B2/B1-1</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Logarithmic Returns Calculator */}
                      <div id="log-returns" className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border-2 border-purple-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold">
                              2
                            </div>
                            Logarithmic (Continuous) Returns Calculator
                          </h3>
                          <p className="text-sm text-gray-600">Theoretically correct for prices following Geometric Brownian Motion</p>
                        </div>

                        {/* Theory Formula */}
                        <div className="bg-white rounded-lg p-4 mb-4 border border-purple-200">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">📐 Formula:</h4>
                          <DisplayEquation>
                            {`r_t = \\ln\\left(\\frac{P_t + D_t}{P_{t-1}}\\right)`}
                          </DisplayEquation>
                          <p className="text-xs text-gray-600 mt-2">
                            Where: ln = natural logarithm, <em>P<sub>t</sub></em> = Final Price, <em>P<sub>t-1</sub></em> = Initial Price, <em>D<sub>t</sub></em> = Dividend
                          </p>
                        </div>

                        {/* With Your Values */}
                        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 border border-purple-300 mb-4">
                          <div className="text-[10px] font-bold text-purple-600 mb-1 uppercase tracking-wide">With Your Values</div>
                          <div className="flex items-center justify-center overflow-x-auto">
                            <DisplayEquation>
                              {`r_t = \\ln\\left(\\frac{\\mathbf{${logCalc.p1.toFixed(2)}} + \\mathbf{${logCalc.dividend.toFixed(2)}}}{\\mathbf{${logCalc.p0.toFixed(2)}}}\\right)`}
                            </DisplayEquation>
                          </div>
                        </div>

                        {/* Input Fields */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Initial Price (P<sub>t-1</sub>)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500 font-semibold">$</span>
                              <input
                                type="number"
                                value={logCalc.p0}
                                onChange={(e) => setLogCalc({ ...logCalc, p0: parseFloat(e.target.value) || 0 })}
                                className="w-full pl-7 pr-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-semibold"
                                step="0.01"
                              />
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Final Price (P<sub>t</sub>)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500 font-semibold">$</span>
                              <input
                                type="number"
                                value={logCalc.p1}
                                onChange={(e) => setLogCalc({ ...logCalc, p1: parseFloat(e.target.value) || 0 })}
                                className="w-full pl-7 pr-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-semibold"
                                step="0.01"
                              />
                            </div>
                          </div>

                          <div className="bg-white rounded-lg p-4 border-2 border-purple-200">
                            <label className="block text-sm font-bold text-gray-700 mb-2">
                              Dividend (D<sub>t</sub>)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-2.5 text-gray-500 font-semibold">$</span>
                              <input
                                type="number"
                                value={logCalc.dividend}
                                onChange={(e) => setLogCalc({ ...logCalc, dividend: parseFloat(e.target.value) || 0 })}
                                className="w-full pl-7 pr-3 py-2 border-2 border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent font-semibold"
                                step="0.01"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Calculation Display */}
                        {(() => {
                          const logReturn = Math.log((logCalc.p1 + logCalc.dividend) / logCalc.p0);
                          const simpleReturn = ((logCalc.p1 + logCalc.dividend) / logCalc.p0) - 1;
                          const isPositive = logReturn >= 0;

                          return (
                            <div className="bg-white rounded-lg p-6 border-2 border-purple-300 shadow-inner">
                              <h4 className="font-bold text-gray-800 mb-3">💡 Step-by-Step Calculation:</h4>

                              <div className="space-y-2 text-sm font-mono mb-4">
                                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                                  <span className="text-gray-700">Final Price + Dividend:</span>
                                  <span className="font-bold text-gray-900">${logCalc.p1.toFixed(2)} + ${logCalc.dividend.toFixed(2)} = ${(logCalc.p1 + logCalc.dividend).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                                  <span className="text-gray-700">Divide by Initial Price:</span>
                                  <span className="font-bold text-gray-900">${(logCalc.p1 + logCalc.dividend).toFixed(2)} ÷ ${logCalc.p0.toFixed(2)} = {((logCalc.p1 + logCalc.dividend) / logCalc.p0).toFixed(6)}</span>
                                </div>
                                <div className="flex justify-between items-center p-2 bg-purple-50 rounded">
                                  <span className="text-gray-700">Natural logarithm (ln):</span>
                                  <span className="font-bold text-gray-900">ln({((logCalc.p1 + logCalc.dividend) / logCalc.p0).toFixed(6)}) = {logReturn.toFixed(6)}</span>
                                </div>
                              </div>

                              <div className={`text-center p-6 rounded-xl mb-4 ${isPositive ? 'bg-gradient-to-r from-purple-100 to-indigo-100 border-2 border-purple-400' : 'bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-400'}`}>
                                <div className="text-sm font-semibold text-gray-600 mb-1">Logarithmic Return</div>
                                <div className={`text-5xl font-bold ${isPositive ? 'text-purple-700' : 'text-red-700'}`}>
                                  {isPositive ? '+' : ''}{(logReturn * 100).toFixed(4)}%
                                </div>
                                <div className="text-xs text-gray-600 mt-2">
                                  Continuous compounding: {logReturn.toFixed(6)} as a decimal
                                </div>
                              </div>

                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <p className="text-sm text-gray-700">
                                  <strong>📊 Comparison:</strong> The simple return for this scenario is {(simpleReturn * 100).toFixed(4)}%.
                                  For small returns, log returns ≈ simple returns. The difference is: {Math.abs((logReturn - simpleReturn) * 100).toFixed(4)}%
                                </p>
                              </div>

                              {/* Excel Formula Guide */}
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mt-4">
                                <div className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                                  <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">Excel</span>
                                  How to Calculate in Excel
                                </div>

                                {/* Mini Excel Table */}
                                <div className="bg-white rounded border border-gray-300 overflow-hidden mb-4 shadow-sm">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-100 border-b border-gray-300">
                                        <th className="w-12 px-2 py-2 text-center font-bold text-gray-600 border-r border-gray-300"></th>
                                        <th className="w-1/3 px-3 py-2 text-center font-bold text-gray-600 border-r border-gray-300">A</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600">B</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">1</td>
                                        <td className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Initial Price (P₀)</td>
                                        <td className="px-3 py-2 text-right font-mono text-gray-800 bg-blue-50">{logCalc.p0.toFixed(2)}</td>
                                      </tr>
                                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">2</td>
                                        <td className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Final Price (P₁)</td>
                                        <td className="px-3 py-2 text-right font-mono text-gray-800 bg-blue-50">{logCalc.p1.toFixed(2)}</td>
                                      </tr>
                                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">3</td>
                                        <td className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Dividend</td>
                                        <td className="px-3 py-2 text-right font-mono text-gray-800 bg-blue-50">{logCalc.dividend.toFixed(2)}</td>
                                      </tr>
                                      <tr className="bg-yellow-50 border-t-2 border-yellow-400">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">4</td>
                                        <td className="px-3 py-2 text-left font-bold text-purple-700">Log Return</td>
                                        <td className="px-3 py-2 text-right font-mono text-purple-700 font-bold">{(logReturn * 100).toFixed(4)}%</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                {/* Excel Formula */}
                                <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3 mb-3">
                                  <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">Excel Formula (Cell B4):</div>
                                  <div className="font-mono text-base text-green-800 font-bold break-all">=LN((B2+B3)/B1)</div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-1.5">
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>LN() is the natural logarithm function in Excel</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>Format B4 as Percentage or leave as decimal</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>If no dividend: =LN(B2/B1)</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Geometric Mean Returns Calculator */}
                      <div id="geometric-mean" className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-6 border-2 border-amber-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-orange-600 rounded-lg flex items-center justify-center text-white font-bold">
                              3
                            </div>
                            Geometric Mean Return
                          </h3>
                          <p className="text-sm text-gray-600">Calculate the compound average growth rate over multiple periods (CAGR)</p>
                        </div>

                        {/* Theory Formula */}
                        <div className="bg-white rounded-lg p-4 mb-4 border border-amber-200">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">📐 Formula:</h4>
                          <DisplayEquation>
                            {`R_G = \\left[\\prod_{t=1}^{T}(1 + R_t)\\right]^{\\frac{1}{T}} - 1`}
                          </DisplayEquation>
                          <p className="text-xs text-gray-600 mt-2">
                            Where: ∏ = product (multiply all), <em>R<sub>t</sub></em> = Return in period t, <em>T</em> = Number of periods
                          </p>
                        </div>

                        {/* With Your Values */}
                        {(() => {
                          const returnsArray = geometricCalc.returns.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
                          if (returnsArray.length > 0) {
                            const growthFactors = returnsArray.map(r => `(1 + \\mathbf{${r.toFixed(4)}})`).join(' \\times ');
                            return (
                              <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-3 border border-amber-300 mb-4">
                                <div className="text-[10px] font-bold text-amber-600 mb-1 uppercase tracking-wide">With Your Values</div>
                                <div className="flex items-center justify-center overflow-x-auto">
                                  <DisplayEquation>
                                    {`R_G = \\left[${growthFactors}\\right]^{\\frac{1}{\\mathbf{${returnsArray.length}}}} - 1`}
                                  </DisplayEquation>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {/* Input Field */}
                        <div className="bg-white rounded-lg p-4 mb-4 border-2 border-amber-200">
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Period Returns (comma-separated decimals, e.g., 0.05, 0.10, -0.03)
                          </label>
                          <input
                            type="text"
                            value={geometricCalc.returns}
                            onChange={(e) => setGeometricCalc({ returns: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent font-mono text-sm"
                            placeholder="0.05, 0.10, -0.03, 0.08"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            💡 Tip: Enter returns as decimals (5% = 0.05, -3% = -0.03). Separate multiple periods with commas.
                          </p>
                        </div>

                        {/* Calculation Display */}
                        {(() => {
                          const returnsArray = geometricCalc.returns.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));

                          if (returnsArray.length === 0) {
                            return (
                              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                                <p className="text-gray-500">Enter period returns to see the calculation...</p>
                              </div>
                            );
                          }

                          const product = returnsArray.reduce((prod, r) => prod * (1 + r), 1);
                          const geometricMean = Math.pow(product, 1 / returnsArray.length) - 1;
                          const arithmeticMean = returnsArray.reduce((sum, r) => sum + r, 0) / returnsArray.length;
                          const isPositive = geometricMean >= 0;

                          return (
                            <div className="bg-white rounded-lg p-6 border-2 border-amber-300 shadow-inner">
                              <h4 className="font-bold text-gray-800 mb-3">💡 Step-by-Step Calculation:</h4>

                              <div className="space-y-2 text-sm mb-4">
                                <div className="p-3 bg-amber-50 rounded border border-amber-200">
                                  <div className="font-semibold text-gray-700 mb-2">Period Returns:</div>
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {returnsArray.map((r, idx) => (
                                      <div key={idx} className="bg-white p-2 rounded border border-amber-200 text-center">
                                        <div className="text-xs text-gray-600">Period {idx + 1}</div>
                                        <div className={`font-bold ${r >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                          {(r * 100).toFixed(2)}%
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="p-3 bg-amber-50 rounded border border-amber-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 1:</strong> Convert to growth factors (1 + R):</div>
                                  <div className="text-gray-700">{returnsArray.map(r => (1 + r).toFixed(6)).join(' × ')}</div>
                                </div>

                                <div className="p-3 bg-amber-50 rounded border border-amber-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 2:</strong> Multiply all growth factors:</div>
                                  <div className="text-gray-700">{product.toFixed(6)}</div>
                                </div>

                                <div className="p-3 bg-amber-50 rounded border border-amber-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 3:</strong> Take the {returnsArray.length}<sup>th</sup> root:</div>
                                  <div className="text-gray-700">{product.toFixed(6)}<sup>1/{returnsArray.length}</sup> = {Math.pow(product, 1 / returnsArray.length).toFixed(6)}</div>
                                </div>

                                <div className="p-3 bg-amber-50 rounded border border-amber-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 4:</strong> Subtract 1:</div>
                                  <div className="text-gray-700">{Math.pow(product, 1 / returnsArray.length).toFixed(6)} - 1 = {geometricMean.toFixed(6)}</div>
                                </div>
                              </div>

                              <div className={`text-center p-6 rounded-xl mb-4 ${isPositive ? 'bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-400' : 'bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-400'}`}>
                                <div className="text-sm font-semibold text-gray-600 mb-1">Geometric Mean Return (CAGR)</div>
                                <div className={`text-5xl font-bold ${isPositive ? 'text-amber-700' : 'text-red-700'}`}>
                                  {isPositive ? '+' : ''}{(geometricMean * 100).toFixed(4)}%
                                </div>
                                <div className="text-xs text-gray-600 mt-2">
                                  Average compound growth rate over {returnsArray.length} periods
                                </div>
                              </div>

                              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                                <p className="text-sm text-gray-700 mb-2">
                                  <strong>📊 Comparison with Arithmetic Mean:</strong>
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-center">
                                  <div className="bg-white rounded p-3 border border-blue-200">
                                    <div className="text-xs text-gray-600">Geometric Mean</div>
                                    <div className="text-2xl font-bold text-amber-600">{(geometricMean * 100).toFixed(4)}%</div>
                                  </div>
                                  <div className="bg-white rounded p-3 border border-blue-200">
                                    <div className="text-xs text-gray-600">Arithmetic Mean</div>
                                    <div className="text-2xl font-bold text-blue-600">{(arithmeticMean * 100).toFixed(4)}%</div>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-600 mt-3">
                                  The geometric mean is always ≤ arithmetic mean (equality only when all returns are equal).
                                  Geometric mean is the true compound average and better represents actual investment performance over time.
                                </p>
                              </div>

                              {/* Excel Formula Guide */}
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mt-4">
                                <div className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                                  <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">Excel</span>
                                  How to Calculate in Excel
                                </div>

                                {/* Mini Excel Table */}
                                <div className="bg-white rounded border border-gray-300 overflow-hidden mb-4 shadow-sm">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-100 border-b border-gray-300">
                                        <th className="w-12 px-2 py-2 text-center font-bold text-gray-600 border-r border-gray-300"></th>
                                        <th className="w-1/3 px-3 py-2 text-center font-bold text-gray-600 border-r border-gray-300">A</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600">B</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {returnsArray.map((r, idx) => (
                                        <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50">
                                          <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">{idx + 1}</td>
                                          <td className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Return {idx + 1}</td>
                                          <td className="px-3 py-2 text-right font-mono text-gray-800 bg-blue-50">{r.toFixed(4)}</td>
                                        </tr>
                                      ))}
                                      <tr className="bg-yellow-50 border-t-2 border-yellow-400">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">{returnsArray.length + 1}</td>
                                        <td className="px-3 py-2 text-left font-bold text-amber-700">Geometric Mean</td>
                                        <td className="px-3 py-2 text-right font-mono text-amber-700 font-bold">{(geometricMean * 100).toFixed(4)}%</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                {/* Excel Formula Options */}
                                <div className="space-y-3">
                                  <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3">
                                    <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">Method 1 - Using Growth Factors (Cell B{returnsArray.length + 1}):</div>
                                    <div className="font-mono text-sm text-green-800 font-bold break-all">
                                      =(PRODUCT(1+B1:B{returnsArray.length})^(1/{returnsArray.length}))-1
                                    </div>
                                  </div>

                                  <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3">
                                    <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">Method 2 - Using GEOMEAN Function:</div>
                                    <div className="font-mono text-sm text-green-800 font-bold break-all">
                                      =GEOMEAN(1+B1:B{returnsArray.length})-1
                                    </div>
                                  </div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-1.5 mt-3">
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>Both methods convert returns to growth factors (1+R) before calculation</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>GEOMEAN is simpler and is Excel's built-in function for geometric mean</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>Enter returns as decimals in Excel (5% = 0.05)</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Expected Returns Calculator */}
                      <div id="expected-returns" className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                              <Target className="w-5 h-5 text-white" />
                            </div>
                            Expected Returns
                          </h3>
                          <p className="text-sm text-gray-600">
                            Calculate the <strong className="text-blue-700">arithmetic mean (average)</strong> of returns -
                            this is what we expect to earn on average based on historical data.
                          </p>
                        </div>

                        {/* Theory Formula */}
                        <div className="bg-white rounded-lg p-4 border border-blue-200 mb-4">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">📐 Expected Return Formula:</h4>
                          <DisplayEquation>
                            {`E(R) = \\frac{1}{n}\\sum_{i=1}^{n}R_i = \\frac{R_1 + R_2 + ... + R_n}{n}`}
                          </DisplayEquation>
                          <p className="text-xs text-gray-600 mt-2">
                            Where E(R) is the expected return, R<sub>i</sub> are individual returns, and n is the number of observations
                          </p>
                        </div>

                        {/* With Your Values */}
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-4 mb-4">
                          <h4 className="font-bold mb-3 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            With Your Values:
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold mb-1 text-blue-100">
                                Enter Returns (comma-separated, as decimals):
                              </label>
                              <input
                                type="text"
                                value={expectedCalc.returns}
                                onChange={(e) => setExpectedCalc({ ...expectedCalc, returns: e.target.value })}
                                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                placeholder="e.g., 0.12, 0.08, -0.05, 0.15, 0.10"
                              />
                              <p className="text-xs text-blue-100 mt-1">Example: 12% = 0.12, -5% = -0.05</p>
                            </div>
                          </div>
                        </div>

                        {/* Calculation */}
                        {(() => {
                          const returns = expectedCalc.returns.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
                          const n = returns.length;
                          const sum = returns.reduce((acc, r) => acc + r, 0);
                          const expectedReturn = n > 0 ? sum / n : 0;

                          return (
                            <div className="space-y-4">
                              {/* Step-by-Step Calculation */}
                              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border-2 border-amber-200">
                                <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                                  <Calculator className="w-4 h-4" />
                                  Step-by-Step Calculation:
                                </h4>
                                <div className="space-y-2 text-sm">
                                  <div className="bg-white rounded p-3 border border-amber-200">
                                    <p className="text-gray-700 font-semibold mb-1">Step 1: List all returns</p>
                                    <p className="text-gray-600 font-mono text-xs">
                                      {returns.length > 0 ? returns.map((r, i) => `R${i+1} = ${r}`).join(', ') : 'No valid returns entered'}
                                    </p>
                                    <p className="text-gray-600 text-xs mt-1">Number of returns (n) = {n}</p>
                                  </div>

                                  <div className="bg-white rounded p-3 border border-amber-200">
                                    <p className="text-gray-700 font-semibold mb-1">Step 2: Calculate the sum</p>
                                    <p className="text-gray-600 font-mono text-xs">
                                      Sum = {returns.length > 0 ? returns.join(' + ') : '0'}
                                    </p>
                                    <p className="text-gray-600 font-mono text-xs mt-1">
                                      Sum = {sum.toFixed(6)}
                                    </p>
                                  </div>

                                  <div className="bg-white rounded p-3 border border-amber-200">
                                    <p className="text-gray-700 font-semibold mb-1">Step 3: Divide by the number of returns</p>
                                    <p className="text-gray-600 font-mono text-xs">
                                      E(R) = {sum.toFixed(6)} ÷ {n} = {expectedReturn.toFixed(6)}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Result */}
                              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl p-6 shadow-lg">
                                <div className="text-center">
                                  <div className="text-sm font-semibold mb-2 text-blue-100">Expected Return:</div>
                                  <div className="text-4xl font-bold mb-2">{(expectedReturn * 100).toFixed(4)}%</div>
                                  <div className="text-sm text-blue-100">({expectedReturn.toFixed(6)} as decimal)</div>
                                  <div className="mt-3 pt-3 border-t border-white/20">
                                    <p className="text-xs text-blue-100">
                                      This is the arithmetic mean of your returns - what you can expect to earn on average per period
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Excel Formula Guide */}
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mt-4">
                                <div className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                                  <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">Excel</span>
                                  How to Calculate in Excel
                                </div>

                                <div className="bg-white rounded border border-gray-300 overflow-hidden mb-4 shadow-sm">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-100 border-b border-gray-300">
                                        <th className="w-16 px-3 py-2 text-center text-gray-600 font-bold border-r border-gray-300">
                                          A
                                        </th>
                                        <th className="w-24 px-3 py-2 text-center text-gray-600 font-bold">
                                          B
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody className="font-mono text-xs">
                                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                                        <td className="px-3 py-2 text-center bg-gray-50 border-r border-gray-300 text-gray-500 font-bold">
                                          1
                                        </td>
                                        <td className="px-3 py-2 text-gray-700 font-semibold">Returns</td>
                                      </tr>
                                      {returns.slice(0, 5).map((r, i) => (
                                        <tr key={i} className="border-b border-gray-200 hover:bg-blue-50">
                                          <td className="px-3 py-2 text-center bg-gray-50 border-r border-gray-300 text-gray-500 font-bold">
                                            {i + 2}
                                          </td>
                                          <td className="px-3 py-2 text-right text-blue-700 font-bold">{r}</td>
                                        </tr>
                                      ))}
                                      {returns.length > 5 && (
                                        <tr className="border-b border-gray-200">
                                          <td className="px-3 py-2 text-center bg-gray-50 border-r border-gray-300 text-gray-500">
                                            ...
                                          </td>
                                          <td className="px-3 py-2 text-center text-gray-500">...</td>
                                        </tr>
                                      )}
                                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                                        <td className="px-3 py-2 text-center bg-gray-50 border-r border-gray-300 text-gray-500 font-bold">
                                          {returns.length + 2}
                                        </td>
                                        <td className="px-3 py-2 text-gray-700 font-semibold">Expected Return</td>
                                      </tr>
                                      <tr className="bg-green-50 hover:bg-green-100">
                                        <td className="px-3 py-2 text-center bg-gray-50 border-r border-gray-300 text-gray-500 font-bold">
                                          {returns.length + 3}
                                        </td>
                                        <td className="px-3 py-2 text-right text-green-700 font-bold">
                                          {expectedReturn.toFixed(6)}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3 mb-3">
                                  <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">
                                    Excel Formula (Cell B{returns.length + 3}):
                                  </div>
                                  <div className="font-mono text-base text-green-800 font-bold break-all">
                                    =AVERAGE(B2:B{returns.length + 1})
                                  </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-300 rounded-lg px-4 py-3">
                                  <div className="text-xs text-gray-700 font-bold mb-2 uppercase tracking-wide">
                                    💡 Key Points:
                                  </div>
                                  <div className="space-y-1 text-xs text-gray-600">
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-600 font-bold text-sm">•</span>
                                      <span>AVERAGE() calculates the arithmetic mean (sum divided by count)</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-600 font-bold text-sm">•</span>
                                      <span>This is different from GEOMEAN() which calculates compound growth</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-600 font-bold text-sm">•</span>
                                      <span>Expected Return is used to calculate variance and risk</span>
                                    </div>
                                    <div className="flex items-start gap-2">
                                      <span className="text-blue-600 font-bold text-sm">•</span>
                                      <span>Enter returns as decimals in Excel (5% = 0.05, -3% = -0.03)</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Variance Calculator */}
                      <div id="variance" className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                              4
                            </div>
                            Variance Calculator
                          </h3>
                          <p className="text-sm text-gray-600">Measure the dispersion of returns - how spread out they are from the mean</p>
                        </div>

                        {/* Theory Formulas - Sample and Population */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Sample Variance */}
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">📐 Sample Variance (s²):</h4>
                            <DisplayEquation>
                              {`s^2 = \\frac{1}{n-1}\\sum_{i=1}^{n}(R_i - \\bar{R})^2`}
                            </DisplayEquation>
                            <p className="text-xs text-gray-600 mt-2">
                              Uses n-1 (Bessel's correction) for unbiased estimate
                            </p>
                          </div>

                          {/* Population Variance */}
                          <div className="bg-white rounded-lg p-4 border border-blue-200">
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">📐 Population Variance (σ²):</h4>
                            <DisplayEquation>
                              {`\\sigma^2 = \\frac{1}{n}\\sum_{i=1}^{n}(R_i - \\mu)^2`}
                            </DisplayEquation>
                            <p className="text-xs text-gray-600 mt-2">
                              Uses n when you have the entire population
                            </p>
                          </div>
                        </div>

                        {/* With Your Values */}
                        {(() => {
                          const returnsArray = varianceCalc.returns.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
                          if (returnsArray.length > 0) {
                            const mean = returnsArray.reduce((sum, r) => sum + r, 0) / returnsArray.length;
                            const deviations = returnsArray.map(r => `(\\mathbf{${r.toFixed(4)}} - \\mathbf{${mean.toFixed(4)}})^2`).join(' + ');

                            return (
                              <div className="space-y-3 mb-4">
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-3 border border-blue-300">
                                  <div className="text-[10px] font-bold text-blue-600 mb-1 uppercase tracking-wide">With Your Values (Sample Variance)</div>
                                  <div className="flex items-center justify-center overflow-x-auto">
                                    <DisplayEquation>
                                      {`s^2 = \\frac{1}{\\mathbf{${returnsArray.length - 1}}}\\left[${deviations}\\right]`}
                                    </DisplayEquation>
                                  </div>
                                </div>

                                <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-lg p-3 border border-cyan-300">
                                  <div className="text-[10px] font-bold text-cyan-600 mb-1 uppercase tracking-wide">With Your Values (Population Variance)</div>
                                  <div className="flex items-center justify-center overflow-x-auto">
                                    <DisplayEquation>
                                      {`\\sigma^2 = \\frac{1}{\\mathbf{${returnsArray.length}}}\\left[${deviations}\\right]`}
                                    </DisplayEquation>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {/* Input Field */}
                        <div className="bg-white rounded-lg p-4 mb-4 border-2 border-blue-200">
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Returns (comma-separated decimals, e.g., 0.12, 0.08, -0.05)
                          </label>
                          <input
                            type="text"
                            value={varianceCalc.returns}
                            onChange={(e) => setVarianceCalc({ returns: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                            placeholder="0.12, 0.08, -0.05, 0.15, 0.10"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            💡 Tip: Enter returns as decimals (12% = 0.12, -5% = -0.05). Separate multiple observations with commas.
                          </p>
                        </div>

                        {/* Calculation Display */}
                        {(() => {
                          const returnsArray = varianceCalc.returns.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));

                          if (returnsArray.length === 0) {
                            return (
                              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                                <p className="text-gray-500">Enter returns to see the calculation...</p>
                              </div>
                            );
                          }

                          const mean = returnsArray.reduce((sum, r) => sum + r, 0) / returnsArray.length;
                          const squaredDeviations = returnsArray.map(r => Math.pow(r - mean, 2));
                          const sumSquaredDev = squaredDeviations.reduce((sum, sd) => sum + sd, 0);
                          const sampleVariance = sumSquaredDev / (returnsArray.length - 1);
                          const populationVariance = sumSquaredDev / returnsArray.length;

                          return (
                            <div className="bg-white rounded-lg p-6 border-2 border-blue-300 shadow-inner">
                              <h4 className="font-bold text-gray-800 mb-3">💡 Step-by-Step Calculation:</h4>

                              <div className="space-y-2 text-sm mb-4">
                                <div className="p-3 bg-blue-50 rounded border border-blue-200">
                                  <div className="font-semibold text-gray-700 mb-2">Returns Data:</div>
                                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {returnsArray.map((r, idx) => (
                                      <div key={idx} className="bg-white p-2 rounded border border-blue-200 text-center">
                                        <div className="text-xs text-gray-600">R{idx + 1}</div>
                                        <div className="font-bold text-blue-600">{(r * 100).toFixed(2)}%</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="p-3 bg-blue-50 rounded border border-blue-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 1:</strong> Calculate mean (μ or x̄):</div>
                                  <div className="text-gray-700">Mean = {returnsArray.map(r => r.toFixed(4)).join(' + ')} / {returnsArray.length} = {mean.toFixed(6)}</div>
                                </div>

                                <div className="p-3 bg-blue-50 rounded border border-blue-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 2:</strong> Calculate squared deviations (Rᵢ - mean)²:</div>
                                  <div className="space-y-1 text-gray-700">
                                    {returnsArray.map((r, idx) => (
                                      <div key={idx}>({r.toFixed(4)} - {mean.toFixed(4)})² = {squaredDeviations[idx].toFixed(8)}</div>
                                    ))}
                                  </div>
                                </div>

                                <div className="p-3 bg-blue-50 rounded border border-blue-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 3:</strong> Sum squared deviations:</div>
                                  <div className="text-gray-700">Σ(Rᵢ - mean)² = {sumSquaredDev.toFixed(8)}</div>
                                </div>

                                <div className="p-3 bg-blue-50 rounded border border-blue-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 4:</strong> Divide by n-1 (sample) or n (population):</div>
                                  <div className="text-gray-700">Sample: {sumSquaredDev.toFixed(8)} / {returnsArray.length - 1} = {sampleVariance.toFixed(8)}</div>
                                  <div className="text-gray-700">Population: {sumSquaredDev.toFixed(8)} / {returnsArray.length} = {populationVariance.toFixed(8)}</div>
                                </div>
                              </div>

                              {/* Results Side by Side */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="text-center p-6 rounded-xl bg-gradient-to-r from-blue-100 to-cyan-100 border-2 border-blue-400">
                                  <div className="text-sm font-semibold text-gray-600 mb-1">Sample Variance (s²)</div>
                                  <div className="text-4xl font-bold text-blue-700">
                                    {(sampleVariance * 10000).toFixed(4)}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-2">
                                    In basis points (×10⁴) | Decimal: {sampleVariance.toFixed(6)}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">Use when data is a sample</div>
                                </div>

                                <div className="text-center p-6 rounded-xl bg-gradient-to-r from-cyan-100 to-blue-100 border-2 border-cyan-400">
                                  <div className="text-sm font-semibold text-gray-600 mb-1">Population Variance (σ²)</div>
                                  <div className="text-4xl font-bold text-cyan-700">
                                    {(populationVariance * 10000).toFixed(4)}
                                  </div>
                                  <div className="text-xs text-gray-600 mt-2">
                                    In basis points (×10⁴) | Decimal: {populationVariance.toFixed(6)}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">Use when data is entire population</div>
                                </div>
                              </div>

                              <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 mt-4">
                                <p className="text-sm text-gray-700">
                                  <strong>📊 Note:</strong> Sample variance (s²) uses n-1 to provide an unbiased estimate of the population variance.
                                  This is called Bessel's correction. Sample variance is typically used in finance since we work with sample data.
                                </p>
                              </div>

                              {/* Excel Formula Guide */}
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mt-4">
                                <div className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                                  <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">Excel</span>
                                  How to Calculate in Excel
                                </div>

                                <div className="bg-white rounded border border-gray-300 overflow-hidden mb-4 shadow-sm">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-100 border-b border-gray-300">
                                        <th className="w-12 px-2 py-2 text-center font-bold text-gray-600 border-r border-gray-300"></th>
                                        <th className="w-1/3 px-3 py-2 text-center font-bold text-gray-600 border-r border-gray-300">A</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600">B</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {returnsArray.map((r, idx) => (
                                        <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50">
                                          <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">{idx + 1}</td>
                                          <td className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Return {idx + 1}</td>
                                          <td className="px-3 py-2 text-right font-mono text-gray-800 bg-blue-50">{r.toFixed(4)}</td>
                                        </tr>
                                      ))}
                                      <tr className="bg-yellow-50 border-t-2 border-yellow-400">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">{returnsArray.length + 1}</td>
                                        <td className="px-3 py-2 text-left font-bold text-blue-700">Sample Variance (s²)</td>
                                        <td className="px-3 py-2 text-right font-mono text-blue-700 font-bold">{sampleVariance.toFixed(8)}</td>
                                      </tr>
                                      <tr className="bg-yellow-50">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">{returnsArray.length + 2}</td>
                                        <td className="px-3 py-2 text-left font-bold text-cyan-700">Population Variance (σ²)</td>
                                        <td className="px-3 py-2 text-right font-mono text-cyan-700 font-bold">{populationVariance.toFixed(8)}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <div className="space-y-3">
                                  <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3">
                                    <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">Sample Variance Formula (Cell B{returnsArray.length + 1}):</div>
                                    <div className="font-mono text-sm text-green-800 font-bold break-all">
                                      =VAR.S(B1:B{returnsArray.length})
                                    </div>
                                  </div>

                                  <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3">
                                    <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">Population Variance Formula (Cell B{returnsArray.length + 2}):</div>
                                    <div className="font-mono text-sm text-green-800 font-bold break-all">
                                      =VAR.P(B1:B{returnsArray.length})
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1.5 mt-3">
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>VAR.S uses n-1 (sample variance) - most common in finance</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>VAR.P uses n (population variance) - when you have all data</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>In older Excel versions, use VAR (sample) or VARP (population)</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>Enter returns as decimals (5% = 0.05, not 5)</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Standard Deviation (Risk) Calculator */}
                      <div id="std-deviation" className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 border-2 border-red-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-rose-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            Risk (Standard Deviation σ)
                          </h3>
                          <p className="text-sm text-gray-600">
                            <strong className="text-red-700">This is THE risk measure in finance.</strong> Standard deviation (σ) quantifies volatility -
                            the square root of variance, expressed in the same units as returns.
                          </p>
                        </div>

                        {/* Theory Formulas - Sample and Population */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Sample Standard Deviation */}
                          <div className="bg-white rounded-lg p-4 border border-red-200">
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">📐 Sample Std Dev (s):</h4>
                            <DisplayEquation>
                              {`s = \\sqrt{\\frac{1}{n-1}\\sum_{i=1}^{n}(R_i - \\bar{R})^2}`}
                            </DisplayEquation>
                            <p className="text-xs text-gray-600 mt-2">
                              Square root of sample variance
                            </p>
                          </div>

                          {/* Population Standard Deviation */}
                          <div className="bg-white rounded-lg p-4 border border-red-200">
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">📐 Population Std Dev (σ):</h4>
                            <DisplayEquation>
                              {`\\sigma = \\sqrt{\\frac{1}{n}\\sum_{i=1}^{n}(R_i - \\mu)^2}`}
                            </DisplayEquation>
                            <p className="text-xs text-gray-600 mt-2">
                              Square root of population variance
                            </p>
                          </div>
                        </div>

                        {/* With Your Values */}
                        {(() => {
                          const returnsArray = stdDevCalc.returns.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
                          if (returnsArray.length > 0) {
                            const mean = returnsArray.reduce((sum, r) => sum + r, 0) / returnsArray.length;
                            const deviations = returnsArray.map(r => `(\\mathbf{${r.toFixed(4)}} - \\mathbf{${mean.toFixed(4)}})^2`).join(' + ');

                            return (
                              <div className="space-y-3 mb-4">
                                <div className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-3 border border-red-300">
                                  <div className="text-[10px] font-bold text-red-600 mb-1 uppercase tracking-wide">With Your Values (Sample Std Dev)</div>
                                  <div className="flex items-center justify-center overflow-x-auto">
                                    <DisplayEquation>
                                      {`s = \\sqrt{\\frac{1}{\\mathbf{${returnsArray.length - 1}}}\\left[${deviations}\\right]}`}
                                    </DisplayEquation>
                                  </div>
                                </div>

                                <div className="bg-gradient-to-r from-rose-50 to-red-50 rounded-lg p-3 border border-rose-300">
                                  <div className="text-[10px] font-bold text-rose-600 mb-1 uppercase tracking-wide">With Your Values (Population Std Dev)</div>
                                  <div className="flex items-center justify-center overflow-x-auto">
                                    <DisplayEquation>
                                      {`\\sigma = \\sqrt{\\frac{1}{\\mathbf{${returnsArray.length}}}\\left[${deviations}\\right]}`}
                                    </DisplayEquation>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}

                        {/* Input Field */}
                        <div className="bg-white rounded-lg p-4 mb-4 border-2 border-red-200">
                          <label className="block text-sm font-bold text-gray-700 mb-2">
                            Returns (comma-separated decimals, e.g., 0.12, 0.08, -0.05)
                          </label>
                          <input
                            type="text"
                            value={stdDevCalc.returns}
                            onChange={(e) => setStdDevCalc({ returns: e.target.value })}
                            className="w-full px-4 py-3 border-2 border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent font-mono text-sm"
                            placeholder="0.12, 0.08, -0.05, 0.15, 0.10"
                          />
                          <p className="text-xs text-gray-500 mt-2">
                            💡 Tip: Standard deviation is the most common measure of investment risk - higher values mean more volatile returns.
                          </p>
                        </div>

                        {/* Calculation Display */}
                        {(() => {
                          const returnsArray = stdDevCalc.returns.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));

                          if (returnsArray.length === 0) {
                            return (
                              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                                <p className="text-gray-500">Enter returns to see the calculation...</p>
                              </div>
                            );
                          }

                          const mean = returnsArray.reduce((sum, r) => sum + r, 0) / returnsArray.length;
                          const squaredDeviations = returnsArray.map(r => Math.pow(r - mean, 2));
                          const sumSquaredDev = squaredDeviations.reduce((sum, sd) => sum + sd, 0);
                          const sampleVariance = sumSquaredDev / (returnsArray.length - 1);
                          const populationVariance = sumSquaredDev / returnsArray.length;
                          const sampleStdDev = Math.sqrt(sampleVariance);
                          const populationStdDev = Math.sqrt(populationVariance);

                          return (
                            <div className="bg-white rounded-lg p-6 border-2 border-red-300 shadow-inner">
                              <h4 className="font-bold text-gray-800 mb-3">💡 Step-by-Step Calculation:</h4>

                              <div className="space-y-2 text-sm mb-4">
                                <div className="p-3 bg-red-50 rounded border border-red-200">
                                  <div className="font-semibold text-gray-700 mb-2">Returns Data:</div>
                                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                                    {returnsArray.map((r, idx) => (
                                      <div key={idx} className="bg-white p-2 rounded border border-red-200 text-center">
                                        <div className="text-xs text-gray-600">R{idx + 1}</div>
                                        <div className="font-bold text-red-600">{(r * 100).toFixed(2)}%</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div className="p-3 bg-red-50 rounded border border-red-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 1:</strong> Calculate mean:</div>
                                  <div className="text-gray-700">Mean = {mean.toFixed(6)}</div>
                                </div>

                                <div className="p-3 bg-red-50 rounded border border-red-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 2:</strong> Sum squared deviations:</div>
                                  <div className="text-gray-700">Σ(Rᵢ - mean)² = {sumSquaredDev.toFixed(8)}</div>
                                </div>

                                <div className="p-3 bg-red-50 rounded border border-red-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 3:</strong> Calculate variance:</div>
                                  <div className="text-gray-700">Sample Variance (s²) = {sampleVariance.toFixed(8)}</div>
                                  <div className="text-gray-700">Population Variance (σ²) = {populationVariance.toFixed(8)}</div>
                                </div>

                                <div className="p-3 bg-red-50 rounded border border-red-200 font-mono text-xs">
                                  <div className="mb-1"><strong>Step 4:</strong> Take square root:</div>
                                  <div className="text-gray-700">Sample Std Dev (s) = √{sampleVariance.toFixed(8)} = {sampleStdDev.toFixed(6)}</div>
                                  <div className="text-gray-700">Population Std Dev (σ) = √{populationVariance.toFixed(8)} = {populationStdDev.toFixed(6)}</div>
                                </div>
                              </div>

                              {/* Results Side by Side */}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="text-center p-6 rounded-xl bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-400">
                                  <div className="text-sm font-semibold text-gray-600 mb-1">Sample Std Dev (s)</div>
                                  <div className="text-4xl font-bold text-red-700">
                                    {(sampleStdDev * 100).toFixed(4)}%
                                  </div>
                                  <div className="text-xs text-gray-600 mt-2">
                                    Risk/Volatility | Decimal: {sampleStdDev.toFixed(6)}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">Most common in finance</div>
                                </div>

                                <div className="text-center p-6 rounded-xl bg-gradient-to-r from-rose-100 to-red-100 border-2 border-rose-400">
                                  <div className="text-sm font-semibold text-gray-600 mb-1">Population Std Dev (σ)</div>
                                  <div className="text-4xl font-bold text-rose-700">
                                    {(populationStdDev * 100).toFixed(4)}%
                                  </div>
                                  <div className="text-xs text-gray-600 mt-2">
                                    Risk/Volatility | Decimal: {populationStdDev.toFixed(6)}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">When you have all data</div>
                                </div>
                              </div>

                              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200 mt-4">
                                <p className="text-sm text-gray-700">
                                  <strong>⚠️ Risk Interpretation:</strong> Standard deviation measures volatility. A higher std dev means returns are more spread out (riskier).
                                  For example, {(sampleStdDev * 100).toFixed(2)}% means returns typically vary by ±{(sampleStdDev * 100).toFixed(2)}% from the mean.
                                  In portfolio theory, this is the primary measure of risk.
                                </p>
                              </div>

                              {/* Excel Formula Guide */}
                              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mt-4">
                                <div className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                                  <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">Excel</span>
                                  How to Calculate in Excel
                                </div>

                                <div className="bg-white rounded border border-gray-300 overflow-hidden mb-4 shadow-sm">
                                  <table className="w-full text-sm">
                                    <thead>
                                      <tr className="bg-gray-100 border-b border-gray-300">
                                        <th className="w-12 px-2 py-2 text-center font-bold text-gray-600 border-r border-gray-300"></th>
                                        <th className="w-1/3 px-3 py-2 text-center font-bold text-gray-600 border-r border-gray-300">A</th>
                                        <th className="px-3 py-2 text-center font-bold text-gray-600">B</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {returnsArray.map((r, idx) => (
                                        <tr key={idx} className="border-b border-gray-200 hover:bg-blue-50">
                                          <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">{idx + 1}</td>
                                          <td className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">Return {idx + 1}</td>
                                          <td className="px-3 py-2 text-right font-mono text-gray-800 bg-blue-50">{r.toFixed(4)}</td>
                                        </tr>
                                      ))}
                                      <tr className="bg-yellow-50 border-t-2 border-yellow-400">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">{returnsArray.length + 1}</td>
                                        <td className="px-3 py-2 text-left font-bold text-red-700">Sample Std Dev (s)</td>
                                        <td className="px-3 py-2 text-right font-mono text-red-700 font-bold">{sampleStdDev.toFixed(6)}</td>
                                      </tr>
                                      <tr className="bg-yellow-50">
                                        <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">{returnsArray.length + 2}</td>
                                        <td className="px-3 py-2 text-left font-bold text-rose-700">Population Std Dev (σ)</td>
                                        <td className="px-3 py-2 text-right font-mono text-rose-700 font-bold">{populationStdDev.toFixed(6)}</td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>

                                <div className="space-y-3">
                                  <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3">
                                    <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">Sample Std Dev Formula (Cell B{returnsArray.length + 1}):</div>
                                    <div className="font-mono text-sm text-green-800 font-bold break-all">
                                      =STDEV.S(B1:B{returnsArray.length})
                                    </div>
                                  </div>

                                  <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3">
                                    <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">Population Std Dev Formula (Cell B{returnsArray.length + 2}):</div>
                                    <div className="font-mono text-sm text-green-800 font-bold break-all">
                                      =STDEV.P(B1:B{returnsArray.length})
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-1.5 mt-3">
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>STDEV.S uses n-1 (sample) - most common in finance for measuring risk</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>STDEV.P uses n (population) - when you have complete data</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>In older Excel: use STDEV (sample) or STDEVP (population)</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>Format result as Percentage to show as {(sampleStdDev * 100).toFixed(2)}% (risk/volatility)</span>
                                  </div>
                                  <div className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-blue-600 font-bold text-sm">•</span>
                                    <span>Alternative: Use =SQRT(VAR.S(B1:B{returnsArray.length})) to calculate from variance</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Covariance Calculator */}
                      <div id="covariance" className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                              <Link2 className="w-5 h-5 text-white" />
                            </div>
                            Covariance
                          </h3>
                          <p className="text-sm text-gray-600">
                            Measure how two assets move together - <strong className="text-purple-700">positive covariance</strong> means they tend to move in the same direction,
                            <strong className="text-purple-700"> negative covariance</strong> means they move in opposite directions.
                          </p>
                        </div>

                        {/* Theory Formulas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Sample Covariance */}
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">📐 Sample Covariance:</h4>
                            <DisplayEquation>
                              {`\\text{Cov}(X,Y) = \\frac{1}{n-1}\\sum_{i=1}^{n}(X_i - \\bar{X})(Y_i - \\bar{Y})`}
                            </DisplayEquation>
                            <p className="text-xs text-gray-600 mt-2">
                              Uses n-1 for unbiased estimate
                            </p>
                          </div>

                          {/* Population Covariance */}
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <h4 className="font-semibold text-gray-700 mb-2 text-sm">📐 Population Covariance:</h4>
                            <DisplayEquation>
                              {`\\text{Cov}(X,Y) = \\frac{1}{n}\\sum_{i=1}^{n}(X_i - \\mu_X)(Y_i - \\mu_Y)`}
                            </DisplayEquation>
                            <p className="text-xs text-gray-600 mt-2">
                              Uses n for entire population
                            </p>
                          </div>
                        </div>

                        {/* With Your Values */}
                        <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-lg p-4 mb-4">
                          <h4 className="font-bold mb-3 flex items-center gap-2">
                            <Link2 className="w-5 h-5" />
                            With Your Values:
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold mb-1 text-purple-100">
                                Stock X Returns (comma-separated):
                              </label>
                              <input
                                type="text"
                                value={covarianceCalc.returnsX}
                                onChange={(e) => setCovarianceCalc({ ...covarianceCalc, returnsX: e.target.value })}
                                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                placeholder="e.g., 0.12, 0.08, -0.05, 0.15, 0.10"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1 text-purple-100">
                                Stock Y Returns (comma-separated):
                              </label>
                              <input
                                type="text"
                                value={covarianceCalc.returnsY}
                                onChange={(e) => setCovarianceCalc({ ...covarianceCalc, returnsY: e.target.value })}
                                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-purple-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                placeholder="e.g., 0.10, 0.06, -0.03, 0.12, 0.09"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Calculation */}
                        {(() => {
                          const returnsX = covarianceCalc.returnsX.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
                          const returnsY = covarianceCalc.returnsY.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
                          const n = Math.min(returnsX.length, returnsY.length);

                          if (n > 0) {
                            const meanX = returnsX.slice(0, n).reduce((sum, r) => sum + r, 0) / n;
                            const meanY = returnsY.slice(0, n).reduce((sum, r) => sum + r, 0) / n;

                            let sumProducts = 0;
                            for (let i = 0; i < n; i++) {
                              sumProducts += (returnsX[i] - meanX) * (returnsY[i] - meanY);
                            }

                            const sampleCov = sumProducts / (n - 1);
                            const populationCov = sumProducts / n;

                            return (
                              <div className="space-y-4">
                                {/* Step-by-Step Calculation */}
                                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border-2 border-amber-200">
                                  <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                                    <Calculator className="w-4 h-4" />
                                    Step-by-Step Calculation:
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="bg-white rounded p-3 border border-amber-200">
                                      <p className="text-gray-700 font-semibold mb-1">Step 1: Calculate means</p>
                                      <p className="text-gray-600 font-mono text-xs">
                                        Mean(X) = {meanX.toFixed(6)}
                                      </p>
                                      <p className="text-gray-600 font-mono text-xs">
                                        Mean(Y) = {meanY.toFixed(6)}
                                      </p>
                                    </div>

                                    <div className="bg-white rounded p-3 border border-amber-200">
                                      <p className="text-gray-700 font-semibold mb-1">Step 2: Calculate deviations and products</p>
                                      <div className="overflow-x-auto">
                                        <table className="w-full text-xs font-mono">
                                          <thead>
                                            <tr className="border-b border-amber-200">
                                              <th className="text-left py-1">X</th>
                                              <th className="text-left py-1">Y</th>
                                              <th className="text-left py-1">(X - X̄)</th>
                                              <th className="text-left py-1">(Y - Ȳ)</th>
                                              <th className="text-left py-1">Product</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            {returnsX.slice(0, n).map((x, i) => {
                                              const y = returnsY[i];
                                              const devX = x - meanX;
                                              const devY = y - meanY;
                                              const product = devX * devY;
                                              return (
                                                <tr key={i} className="border-b border-amber-100">
                                                  <td className="py-1">{x.toFixed(4)}</td>
                                                  <td className="py-1">{y.toFixed(4)}</td>
                                                  <td className="py-1">{devX.toFixed(4)}</td>
                                                  <td className="py-1">{devY.toFixed(4)}</td>
                                                  <td className="py-1">{product.toFixed(6)}</td>
                                                </tr>
                                              );
                                            })}
                                          </tbody>
                                        </table>
                                      </div>
                                      <p className="text-gray-600 font-mono text-xs mt-2">
                                        Sum of products = {sumProducts.toFixed(6)}
                                      </p>
                                    </div>

                                    <div className="bg-white rounded p-3 border border-amber-200">
                                      <p className="text-gray-700 font-semibold mb-1">Step 3: Calculate covariance</p>
                                      <p className="text-gray-600 font-mono text-xs">
                                        Sample Cov = {sumProducts.toFixed(6)} ÷ {n - 1} = {sampleCov.toFixed(6)}
                                      </p>
                                      <p className="text-gray-600 font-mono text-xs">
                                        Population Cov = {sumProducts.toFixed(6)} ÷ {n} = {populationCov.toFixed(6)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Results */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-gradient-to-r from-purple-600 to-violet-600 text-white rounded-xl p-6 shadow-lg">
                                    <div className="text-center">
                                      <div className="text-sm font-semibold mb-2 text-purple-100">Sample Covariance:</div>
                                      <div className="text-3xl font-bold">{sampleCov.toFixed(6)}</div>
                                      <div className="mt-2 text-xs text-purple-100">
                                        {sampleCov > 0 ? '✓ Positive relationship' : sampleCov < 0 ? '✗ Negative relationship' : '- No linear relationship'}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-xl p-6 shadow-lg">
                                    <div className="text-center">
                                      <div className="text-sm font-semibold mb-2 text-violet-100">Population Covariance:</div>
                                      <div className="text-3xl font-bold">{populationCov.toFixed(6)}</div>
                                      <div className="mt-2 text-xs text-violet-100">
                                        {populationCov > 0 ? '✓ Positive relationship' : populationCov < 0 ? '✗ Negative relationship' : '- No linear relationship'}
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                {/* Excel Formula Guide */}
                                <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl p-6 border-2 border-purple-200 mt-4">
                                  <div className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                                    <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">Excel</span>
                                    How to Calculate in Excel
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3">
                                      <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">
                                        Sample Covariance:
                                      </div>
                                      <div className="font-mono text-sm text-green-800 font-bold break-all">
                                        =COVARIANCE.S(A2:A{n + 1}, B2:B{n + 1})
                                      </div>
                                    </div>
                                    <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3">
                                      <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">
                                        Population Covariance:
                                      </div>
                                      <div className="font-mono text-sm text-green-800 font-bold break-all">
                                        =COVARIANCE.P(A2:A{n + 1}, B2:B{n + 1})
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-purple-50 border border-purple-300 rounded-lg px-4 py-3">
                                    <div className="text-xs text-gray-700 font-bold mb-2 uppercase tracking-wide">
                                      💡 Key Points:
                                    </div>
                                    <div className="space-y-1 text-xs text-gray-600">
                                      <div className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold text-sm">•</span>
                                        <span>Covariance is scale-dependent (affected by units of measurement)</span>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold text-sm">•</span>
                                        <span>Positive values indicate assets move together, negative means they move oppositely</span>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold text-sm">•</span>
                                        <span>Zero covariance suggests no linear relationship between the assets</span>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <span className="text-purple-600 font-bold text-sm">•</span>
                                        <span>Use Correlation for standardized measure (easier to interpret)</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      {/* Correlation Calculator */}
                      <div id="correlation" className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-indigo-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                              <Link2 className="w-5 h-5 text-white" />
                            </div>
                            Correlation
                          </h3>
                          <p className="text-sm text-gray-600">
                            <strong className="text-indigo-700">Standardized measure</strong> of the relationship between two assets, ranging from -1 (perfect negative correlation)
                            to +1 (perfect positive correlation). Zero means no linear relationship.
                          </p>
                        </div>

                        {/* Theory Formula */}
                        <div className="bg-white rounded-lg p-4 border border-indigo-200 mb-4">
                          <h4 className="font-semibold text-gray-700 mb-2 text-sm">📐 Correlation Coefficient (ρ or r):</h4>
                          <DisplayEquation>
                            {`\\rho_{X,Y} = \\frac{\\text{Cov}(X,Y)}{\\sigma_X \\sigma_Y}`}
                          </DisplayEquation>
                          <p className="text-xs text-gray-600 mt-2">
                            Where Cov(X,Y) is covariance, and σ<sub>X</sub>, σ<sub>Y</sub> are standard deviations
                          </p>
                        </div>

                        {/* With Your Values */}
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg p-4 mb-4">
                          <h4 className="font-bold mb-3 flex items-center gap-2">
                            <Link2 className="w-5 h-5" />
                            With Your Values:
                          </h4>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-xs font-semibold mb-1 text-indigo-100">
                                Stock X Returns (comma-separated):
                              </label>
                              <input
                                type="text"
                                value={correlationCalc.returnsX}
                                onChange={(e) => setCorrelationCalc({ ...correlationCalc, returnsX: e.target.value })}
                                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                placeholder="e.g., 0.12, 0.08, -0.05, 0.15, 0.10"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-semibold mb-1 text-indigo-100">
                                Stock Y Returns (comma-separated):
                              </label>
                              <input
                                type="text"
                                value={correlationCalc.returnsY}
                                onChange={(e) => setCorrelationCalc({ ...correlationCalc, returnsY: e.target.value })}
                                className="w-full px-3 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white/50"
                                placeholder="e.g., 0.10, 0.06, -0.03, 0.12, 0.09"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Calculation */}
                        {(() => {
                          const returnsX = correlationCalc.returnsX.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
                          const returnsY = correlationCalc.returnsY.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
                          const n = Math.min(returnsX.length, returnsY.length);

                          if (n > 0) {
                            const meanX = returnsX.slice(0, n).reduce((sum, r) => sum + r, 0) / n;
                            const meanY = returnsY.slice(0, n).reduce((sum, r) => sum + r, 0) / n;

                            let sumProducts = 0;
                            let sumSqX = 0;
                            let sumSqY = 0;

                            for (let i = 0; i < n; i++) {
                              const devX = returnsX[i] - meanX;
                              const devY = returnsY[i] - meanY;
                              sumProducts += devX * devY;
                              sumSqX += devX * devX;
                              sumSqY += devY * devY;
                            }

                            const stdX = Math.sqrt(sumSqX / (n - 1));
                            const stdY = Math.sqrt(sumSqY / (n - 1));
                            const covariance = sumProducts / (n - 1);
                            const correlation = covariance / (stdX * stdY);

                            return (
                              <div className="space-y-4">
                                {/* Step-by-Step Calculation */}
                                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-4 border-2 border-amber-200">
                                  <h4 className="font-bold text-amber-900 mb-3 flex items-center gap-2">
                                    <Calculator className="w-4 h-4" />
                                    Step-by-Step Calculation:
                                  </h4>
                                  <div className="space-y-2 text-sm">
                                    <div className="bg-white rounded p-3 border border-amber-200">
                                      <p className="text-gray-700 font-semibold mb-1">Step 1: Calculate covariance</p>
                                      <p className="text-gray-600 font-mono text-xs">
                                        Cov(X,Y) = {covariance.toFixed(6)}
                                      </p>
                                    </div>

                                    <div className="bg-white rounded p-3 border border-amber-200">
                                      <p className="text-gray-700 font-semibold mb-1">Step 2: Calculate standard deviations</p>
                                      <p className="text-gray-600 font-mono text-xs">
                                        σ<sub>X</sub> = {stdX.toFixed(6)}
                                      </p>
                                      <p className="text-gray-600 font-mono text-xs">
                                        σ<sub>Y</sub> = {stdY.toFixed(6)}
                                      </p>
                                    </div>

                                    <div className="bg-white rounded p-3 border border-amber-200">
                                      <p className="text-gray-700 font-semibold mb-1">Step 3: Calculate correlation</p>
                                      <p className="text-gray-600 font-mono text-xs">
                                        ρ = {covariance.toFixed(6)} ÷ ({stdX.toFixed(6)} × {stdY.toFixed(6)})
                                      </p>
                                      <p className="text-gray-600 font-mono text-xs">
                                        ρ = {covariance.toFixed(6)} ÷ {(stdX * stdY).toFixed(6)} = {correlation.toFixed(6)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Result */}
                                <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-xl p-6 shadow-lg">
                                  <div className="text-center">
                                    <div className="text-sm font-semibold mb-2 text-indigo-100">Correlation Coefficient:</div>
                                    <div className="text-5xl font-bold mb-2">{correlation.toFixed(4)}</div>
                                    <div className="mt-3 pt-3 border-t border-white/20">
                                      <p className="text-sm font-semibold mb-2">
                                        {Math.abs(correlation) > 0.7 ? '🔥 Strong' : Math.abs(correlation) > 0.3 ? '📊 Moderate' : '📉 Weak'}
                                        {correlation > 0 ? ' Positive' : correlation < 0 ? ' Negative' : ' No'} Correlation
                                      </p>
                                      <p className="text-xs text-indigo-100">
                                        {correlation > 0.7 ? 'Assets move very closely together' :
                                         correlation < -0.7 ? 'Assets move strongly in opposite directions' :
                                         Math.abs(correlation) < 0.3 ? 'Little to no linear relationship' :
                                         correlation > 0 ? 'Assets tend to move in the same direction' :
                                         'Assets tend to move in opposite directions'}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Interpretation Guide */}
                                <div className="bg-white rounded-lg p-4 border-2 border-indigo-200">
                                  <h4 className="font-bold text-indigo-700 mb-3">📊 Interpretation Guide:</h4>
                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div className="bg-green-50 border border-green-200 rounded p-3">
                                      <p className="font-bold text-green-700 text-sm mb-1">+1.0 to +0.7</p>
                                      <p className="text-xs text-gray-600">Strong positive correlation - assets move together</p>
                                    </div>
                                    <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                      <p className="font-bold text-blue-700 text-sm mb-1">+0.7 to -0.7</p>
                                      <p className="text-xs text-gray-600">Moderate/weak correlation - some relationship</p>
                                    </div>
                                    <div className="bg-red-50 border border-red-200 rounded p-3">
                                      <p className="font-bold text-red-700 text-sm mb-1">-0.7 to -1.0</p>
                                      <p className="text-xs text-gray-600">Strong negative correlation - assets move oppositely</p>
                                    </div>
                                  </div>
                                </div>

                                {/* Excel Formula Guide */}
                                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-6 border-2 border-indigo-200 mt-4">
                                  <div className="text-sm font-bold text-gray-700 mb-4 uppercase tracking-wide flex items-center gap-2">
                                    <span className="px-2 py-1 bg-green-600 text-white rounded text-xs font-bold">Excel</span>
                                    How to Calculate in Excel
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3">
                                      <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">
                                        Using CORREL:
                                      </div>
                                      <div className="font-mono text-sm text-green-800 font-bold break-all">
                                        =CORREL(A2:A{n + 1}, B2:B{n + 1})
                                      </div>
                                    </div>
                                    <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3">
                                      <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">
                                        Using PEARSON:
                                      </div>
                                      <div className="font-mono text-sm text-green-800 font-bold break-all">
                                        =PEARSON(A2:A{n + 1}, B2:B{n + 1})
                                      </div>
                                    </div>
                                  </div>

                                  <div className="bg-indigo-50 border border-indigo-300 rounded-lg px-4 py-3">
                                    <div className="text-xs text-gray-700 font-bold mb-2 uppercase tracking-wide">
                                      💡 Key Points:
                                    </div>
                                    <div className="space-y-1 text-xs text-gray-600">
                                      <div className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold text-sm">•</span>
                                        <span>Correlation is unitless and always between -1 and +1</span>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold text-sm">•</span>
                                        <span>CORREL and PEARSON give identical results in Excel</span>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold text-sm">•</span>
                                        <span>Use correlation for portfolio diversification - lower correlation = better diversification</span>
                                      </div>
                                      <div className="flex items-start gap-2">
                                        <span className="text-indigo-600 font-bold text-sm">•</span>
                                        <span>Correlation doesn't imply causation - just measures linear relationship</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>

                      {/* Portfolio Expected Return Calculator */}
                      <div id="portfolio-expected-return" className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-lg flex items-center justify-center text-white font-bold">
                              <PieChart className="w-5 h-5" />
                            </div>
                            Portfolio Expected Return Calculator
                          </h3>
                          <p className="text-sm text-gray-600">Calculate the weighted average expected return of a portfolio combining multiple assets</p>
                        </div>

                        {/* Formula Display */}
                        <div className="bg-white rounded-lg p-4 mb-4 border-2 border-teal-200">
                          <h4 className="text-sm font-bold text-teal-700 mb-2">Portfolio Expected Return Formula</h4>
                          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-4 rounded-lg border border-teal-200">
                            <DisplayEquation>
                              {`E(R_p) = w_1 E(R_1) + w_2 E(R_2)`}
                            </DisplayEquation>
                            <p className="text-xs text-gray-600 mt-2 text-center">
                              Where w<sub>1</sub> and w<sub>2</sub> are portfolio weights, and E(R<sub>1</sub>) and E(R<sub>2</sub>) are expected returns
                            </p>
                          </div>
                        </div>

                        {/* Input Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Weight of Asset 1 (w₁)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={portfolioExpectedCalc.weight1}
                                onChange={(e) => {
                                  const w1 = parseFloat(e.target.value) || 0;
                                  setPortfolioExpectedCalc({...portfolioExpectedCalc, weight1: w1, weight2: 1 - w1});
                                }}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500"
                              />
                              <p className="text-xs text-gray-500 mt-1">Must be between 0 and 1</p>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Expected Return of Asset 1, E(R₁)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={portfolioExpectedCalc.expectedReturn1}
                                onChange={(e) => setPortfolioExpectedCalc({...portfolioExpectedCalc, expectedReturn1: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Weight of Asset 2 (w₂) - Auto-calculated
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={portfolioExpectedCalc.weight2}
                                onChange={(e) => {
                                  const w2 = parseFloat(e.target.value) || 0;
                                  setPortfolioExpectedCalc({...portfolioExpectedCalc, weight1: 1 - w2, weight2: w2});
                                }}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500 bg-gray-50"
                              />
                              <p className="text-xs text-teal-600 mt-1">Auto-adjusts to sum to 1.0 (100%)</p>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Expected Return of Asset 2, E(R₂)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={portfolioExpectedCalc.expectedReturn2}
                                onChange={(e) => setPortfolioExpectedCalc({...portfolioExpectedCalc, expectedReturn2: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Calculation */}
                        {(() => {
                          const { weight1, weight2, expectedReturn1, expectedReturn2 } = portfolioExpectedCalc;
                          const portfolioReturn = weight1 * expectedReturn1 + weight2 * expectedReturn2;

                          return (
                            <div className="space-y-4">
                              {/* Result */}
                              <div className="bg-gradient-to-r from-teal-100 to-cyan-100 rounded-xl p-6 border-2 border-teal-300">
                                <div className="text-center">
                                  <div className="text-sm font-semibold text-teal-700 mb-2">Portfolio Expected Return</div>
                                  <div className="text-4xl font-bold text-teal-800 mb-2">
                                    {(portfolioReturn * 100).toFixed(2)}%
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    E(R<sub>p</sub>) = {portfolioReturn.toFixed(4)}
                                  </div>
                                </div>
                              </div>

                              {/* Step by Step */}
                              <div className="bg-white rounded-lg p-4 border-2 border-teal-200">
                                <h4 className="font-bold text-teal-700 mb-3 flex items-center gap-2">
                                  <Calculator className="w-4 h-4" />
                                  Step-by-Step Calculation
                                </h4>
                                <div className="space-y-2 text-sm font-mono">
                                  <div className="bg-teal-50 p-3 rounded border border-teal-200">
                                    <div className="text-gray-700">
                                      E(R<sub>p</sub>) = ({weight1}) × ({expectedReturn1}) + ({weight2}) × ({expectedReturn2})
                                    </div>
                                  </div>
                                  <div className="bg-teal-50 p-3 rounded border border-teal-200">
                                    <div className="text-gray-700">
                                      E(R<sub>p</sub>) = {(weight1 * expectedReturn1).toFixed(4)} + {(weight2 * expectedReturn2).toFixed(4)}
                                    </div>
                                  </div>
                                  <div className="bg-gradient-to-r from-teal-100 to-cyan-100 p-3 rounded border-2 border-teal-300">
                                    <div className="text-teal-800 font-bold">
                                      E(R<sub>p</sub>) = {portfolioReturn.toFixed(4)} or {(portfolioReturn * 100).toFixed(2)}%
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Excel Guide */}
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                                  <span className="text-lg">📊</span>
                                  Excel Formula Guide
                                </h4>
                                <div className="bg-white rounded-lg overflow-hidden border-2 border-green-200">
                                  <table className="w-full text-sm font-mono">
                                    <thead>
                                      <tr className="bg-gradient-to-r from-green-100 to-emerald-100">
                                        <th className="px-3 py-2 text-left font-bold text-green-800"></th>
                                        <th className="px-3 py-2 text-center font-bold text-green-800">A</th>
                                        <th className="px-3 py-2 text-center font-bold text-green-800">B</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr className="bg-gray-50">
                                        <td className="px-3 py-2 font-bold text-gray-600">1</td>
                                        <td className="px-3 py-2 text-gray-700">Weight</td>
                                        <td className="px-3 py-2 text-gray-700">Expected Return</td>
                                      </tr>
                                      <tr>
                                        <td className="px-3 py-2 font-bold text-gray-600">2</td>
                                        <td className="px-3 py-2 text-gray-700">{weight1}</td>
                                        <td className="px-3 py-2 text-gray-700">{expectedReturn1}</td>
                                      </tr>
                                      <tr className="bg-gray-50">
                                        <td className="px-3 py-2 font-bold text-gray-600">3</td>
                                        <td className="px-3 py-2 text-gray-700">{weight2}</td>
                                        <td className="px-3 py-2 text-gray-700">{expectedReturn2}</td>
                                      </tr>
                                      <tr>
                                        <td className="px-3 py-2 font-bold text-gray-600">4</td>
                                        <td className="px-3 py-2 text-gray-700 font-semibold">Portfolio Return:</td>
                                        <td className="px-3 py-2 bg-green-100 text-green-800 font-bold">
                                          =SUMPRODUCT(A2:A3,B2:B3)
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                                <p className="text-xs text-gray-600 mt-2">
                                  Or simply: <span className="font-mono bg-white px-2 py-1 rounded border border-green-300">=A2*B2+A3*B3</span>
                                </p>
                              </div>

                              {/* Key Insight */}
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
                                <div className="flex items-start gap-3">
                                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <h5 className="font-bold text-blue-800 mb-1">Key Insight</h5>
                                    <p className="text-sm text-gray-700">
                                      The portfolio's expected return is simply the weighted average of individual asset returns.
                                      Weights must sum to 1.0 (100%). This is a linear combination - diversification doesn't change expected returns,
                                      but it does reduce risk (as we'll see in variance calculation).
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Portfolio Variance Calculator */}
                      <div id="portfolio-variance" className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-6 border-2 border-teal-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-lg flex items-center justify-center text-white font-bold">
                              <PieChart className="w-5 h-5" />
                            </div>
                            Portfolio Variance Calculator
                          </h3>
                          <p className="text-sm text-gray-600">Calculate portfolio variance considering both individual variances and covariance between assets</p>
                        </div>

                        {/* Formula Display */}
                        <div className="bg-white rounded-lg p-4 mb-4 border-2 border-teal-200">
                          <h4 className="text-sm font-bold text-teal-700 mb-2">Portfolio Variance Formula (2-Asset Portfolio)</h4>
                          <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-4 rounded-lg border border-teal-200">
                            <DisplayEquation>
                              {`\\sigma_p^2 = w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2w_1w_2Cov(R_1,R_2)`}
                            </DisplayEquation>
                            <p className="text-xs text-gray-600 mt-2 text-center">
                              Where σ² represents variance, w represents weights, and Cov is covariance
                            </p>
                          </div>
                        </div>

                        {/* Input Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Weight of Asset 1 (w₁)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={portfolioVarianceCalc.weight1}
                                onChange={(e) => {
                                  const w1 = parseFloat(e.target.value) || 0;
                                  setPortfolioVarianceCalc({...portfolioVarianceCalc, weight1: w1, weight2: 1 - w1});
                                }}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500"
                              />
                              <p className="text-xs text-gray-500 mt-1">Must be between 0 and 1</p>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Variance of Asset 1 (σ₁²)
                              </label>
                              <input
                                type="number"
                                step="0.001"
                                value={portfolioVarianceCalc.variance1}
                                onChange={(e) => setPortfolioVarianceCalc({...portfolioVarianceCalc, variance1: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Weight of Asset 2 (w₂) - Auto-calculated
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={portfolioVarianceCalc.weight2}
                                onChange={(e) => {
                                  const w2 = parseFloat(e.target.value) || 0;
                                  setPortfolioVarianceCalc({...portfolioVarianceCalc, weight1: 1 - w2, weight2: w2});
                                }}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500 bg-gray-50"
                              />
                              <p className="text-xs text-teal-600 mt-1">Auto-adjusts to sum to 1.0 (100%)</p>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Variance of Asset 2 (σ₂²)
                              </label>
                              <input
                                type="number"
                                step="0.001"
                                value={portfolioVarianceCalc.variance2}
                                onChange={(e) => setPortfolioVarianceCalc({...portfolioVarianceCalc, variance2: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Covariance between Assets (Cov(R₁,R₂))
                          </label>
                          <input
                            type="number"
                            step="0.001"
                            value={portfolioVarianceCalc.covariance}
                            onChange={(e) => setPortfolioVarianceCalc({...portfolioVarianceCalc, covariance: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500"
                          />
                        </div>

                        {/* Calculation */}
                        {(() => {
                          const { weight1, weight2, variance1, variance2, covariance } = portfolioVarianceCalc;
                          const term1 = weight1 * weight1 * variance1;
                          const term2 = weight2 * weight2 * variance2;
                          const term3 = 2 * weight1 * weight2 * covariance;
                          const portfolioVariance = term1 + term2 + term3;

                          return (
                            <div className="space-y-4">
                              {/* Result */}
                              <div className="bg-gradient-to-r from-teal-100 to-emerald-100 rounded-xl p-6 border-2 border-teal-300">
                                <div className="text-center">
                                  <div className="text-sm font-semibold text-teal-700 mb-2">Portfolio Variance</div>
                                  <div className="text-4xl font-bold text-teal-800 mb-2">
                                    {portfolioVariance.toFixed(6)}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    σ<sub>p</sub>² = {portfolioVariance.toFixed(6)}
                                  </div>
                                </div>
                              </div>

                              {/* Step by Step */}
                              <div className="bg-white rounded-lg p-4 border-2 border-teal-200">
                                <h4 className="font-bold text-teal-700 mb-3 flex items-center gap-2">
                                  <Calculator className="w-4 h-4" />
                                  Step-by-Step Calculation
                                </h4>
                                <div className="space-y-2 text-sm font-mono">
                                  <div className="bg-teal-50 p-3 rounded border border-teal-200">
                                    <div className="text-gray-700 mb-1 font-semibold">Term 1: w₁²σ₁²</div>
                                    <div className="text-gray-700">
                                      ({weight1})² × ({variance1}) = {term1.toFixed(6)}
                                    </div>
                                  </div>
                                  <div className="bg-teal-50 p-3 rounded border border-teal-200">
                                    <div className="text-gray-700 mb-1 font-semibold">Term 2: w₂²σ₂²</div>
                                    <div className="text-gray-700">
                                      ({weight2})² × ({variance2}) = {term2.toFixed(6)}
                                    </div>
                                  </div>
                                  <div className="bg-teal-50 p-3 rounded border border-teal-200">
                                    <div className="text-gray-700 mb-1 font-semibold">Term 3: 2w₁w₂Cov(R₁,R₂)</div>
                                    <div className="text-gray-700">
                                      2 × ({weight1}) × ({weight2}) × ({covariance}) = {term3.toFixed(6)}
                                    </div>
                                  </div>
                                  <div className="bg-gradient-to-r from-teal-100 to-emerald-100 p-3 rounded border-2 border-teal-300">
                                    <div className="text-teal-800 font-bold">
                                      σ<sub>p</sub>² = {term1.toFixed(6)} + {term2.toFixed(6)} + {term3.toFixed(6)} = {portfolioVariance.toFixed(6)}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Excel Guide */}
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                                  <span className="text-lg">📊</span>
                                  Excel Formula Guide
                                </h4>
                                <div className="bg-white rounded-lg p-3 border-2 border-green-200">
                                  <div className="font-mono text-sm space-y-2">
                                    <div className="bg-green-50 p-2 rounded border border-green-300">
                                      <span className="text-gray-700">Portfolio Variance = </span>
                                      <span className="text-green-800 font-bold">
                                        =A2^2*B2 + A3^2*B3 + 2*A2*A3*C2
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      Where A2:A3 are weights, B2:B3 are variances, and C2 is covariance
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Key Insight */}
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
                                <div className="flex items-start gap-3">
                                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <h5 className="font-bold text-blue-800 mb-1">Key Insight</h5>
                                    <p className="text-sm text-gray-700 mb-2">
                                      Portfolio variance is NOT a simple weighted average! The covariance term captures how assets move together.
                                      When covariance is negative (assets move in opposite directions), it reduces portfolio variance - this is the
                                      mathematical foundation of diversification.
                                    </p>
                                    <div className="text-xs space-y-1">
                                      <div>• Positive covariance → Assets move together → Less diversification benefit</div>
                                      <div>• Negative covariance → Assets move oppositely → Greater diversification benefit</div>
                                      <div>• Zero covariance → Independent movements → Moderate diversification benefit</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Portfolio Risk Calculator */}
                      <div id="portfolio-risk" className="bg-gradient-to-br from-teal-50 to-blue-50 rounded-xl p-6 border-2 border-teal-300 shadow-lg scroll-mt-24">
                        <div className="mb-4">
                          <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-teal-600 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
                              <PieChart className="w-5 h-5" />
                            </div>
                            Portfolio Risk (Standard Deviation) Calculator
                          </h3>
                          <p className="text-sm text-gray-600">Calculate portfolio risk using the correlation between assets - the most common approach in practice</p>
                        </div>

                        {/* Formula Display */}
                        <div className="bg-white rounded-lg p-4 mb-4 border-2 border-teal-200">
                          <h4 className="text-sm font-bold text-teal-700 mb-2">Portfolio Risk Formula (Using Correlation)</h4>
                          <div className="bg-gradient-to-r from-teal-50 to-blue-50 p-4 rounded-lg border border-teal-200 space-y-3">
                            <DisplayEquation>
                              {`\\sigma_p = \\sqrt{w_1^2\\sigma_1^2 + w_2^2\\sigma_2^2 + 2w_1w_2\\rho_{12}\\sigma_1\\sigma_2}`}
                            </DisplayEquation>
                            <p className="text-xs text-gray-600 text-center">
                              Where σ is standard deviation (risk), ρ is correlation, and w represents weights
                            </p>
                          </div>
                        </div>

                        {/* Input Controls */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Weight of Asset 1 (w₁)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={portfolioRiskCalc.weight1}
                                onChange={(e) => {
                                  const w1 = parseFloat(e.target.value) || 0;
                                  setPortfolioRiskCalc({...portfolioRiskCalc, weight1: w1, weight2: 1 - w1});
                                }}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500"
                              />
                              <p className="text-xs text-gray-500 mt-1">Must be between 0 and 1</p>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Standard Deviation of Asset 1 (σ₁)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={portfolioRiskCalc.stdDev1}
                                onChange={(e) => setPortfolioRiskCalc({...portfolioRiskCalc, stdDev1: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Weight of Asset 2 (w₂) - Auto-calculated
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={portfolioRiskCalc.weight2}
                                onChange={(e) => {
                                  const w2 = parseFloat(e.target.value) || 0;
                                  setPortfolioRiskCalc({...portfolioRiskCalc, weight1: 1 - w2, weight2: w2});
                                }}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500 bg-gray-50"
                              />
                              <p className="text-xs text-teal-600 mt-1">Auto-adjusts to sum to 1.0 (100%)</p>
                            </div>
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-1">
                                Standard Deviation of Asset 2 (σ₂)
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={portfolioRiskCalc.stdDev2}
                                onChange={(e) => setPortfolioRiskCalc({...portfolioRiskCalc, stdDev2: parseFloat(e.target.value) || 0})}
                                className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mb-4">
                          <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Correlation between Assets (ρ₁₂)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="-1"
                            max="1"
                            value={portfolioRiskCalc.correlation}
                            onChange={(e) => setPortfolioRiskCalc({...portfolioRiskCalc, correlation: parseFloat(e.target.value) || 0})}
                            className="w-full px-3 py-2 border-2 border-teal-300 rounded-lg focus:outline-none focus:border-teal-500"
                          />
                          <p className="text-xs text-gray-500 mt-1">Must be between -1 and +1</p>
                        </div>

                        {/* Calculation */}
                        {(() => {
                          const { weight1, weight2, stdDev1, stdDev2, correlation } = portfolioRiskCalc;
                          const variance1Term = weight1 * weight1 * stdDev1 * stdDev1;
                          const variance2Term = weight2 * weight2 * stdDev2 * stdDev2;
                          const covarianceTerm = 2 * weight1 * weight2 * correlation * stdDev1 * stdDev2;
                          const portfolioVariance = variance1Term + variance2Term + covarianceTerm;
                          const portfolioRisk = Math.sqrt(Math.max(0, portfolioVariance));

                          return (
                            <div className="space-y-4">
                              {/* Result */}
                              <div className="bg-gradient-to-r from-teal-100 to-blue-100 rounded-xl p-6 border-2 border-teal-300">
                                <div className="text-center">
                                  <div className="text-sm font-semibold text-teal-700 mb-2">Portfolio Risk (Standard Deviation)</div>
                                  <div className="text-4xl font-bold text-teal-800 mb-2">
                                    {(portfolioRisk * 100).toFixed(2)}%
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    σ<sub>p</sub> = {portfolioRisk.toFixed(4)}
                                  </div>
                                </div>
                              </div>

                              {/* Step by Step */}
                              <div className="bg-white rounded-lg p-4 border-2 border-teal-200">
                                <h4 className="font-bold text-teal-700 mb-3 flex items-center gap-2">
                                  <Calculator className="w-4 h-4" />
                                  Step-by-Step Calculation
                                </h4>
                                <div className="space-y-2 text-sm font-mono">
                                  <div className="bg-teal-50 p-3 rounded border border-teal-200">
                                    <div className="text-gray-700 mb-1 font-semibold">Step 1: Calculate w₁²σ₁²</div>
                                    <div className="text-gray-700">
                                      ({weight1})² × ({stdDev1})² = {variance1Term.toFixed(6)}
                                    </div>
                                  </div>
                                  <div className="bg-teal-50 p-3 rounded border border-teal-200">
                                    <div className="text-gray-700 mb-1 font-semibold">Step 2: Calculate w₂²σ₂²</div>
                                    <div className="text-gray-700">
                                      ({weight2})² × ({stdDev2})² = {variance2Term.toFixed(6)}
                                    </div>
                                  </div>
                                  <div className="bg-teal-50 p-3 rounded border border-teal-200">
                                    <div className="text-gray-700 mb-1 font-semibold">Step 3: Calculate 2w₁w₂ρ₁₂σ₁σ₂</div>
                                    <div className="text-gray-700">
                                      2 × ({weight1}) × ({weight2}) × ({correlation}) × ({stdDev1}) × ({stdDev2}) = {covarianceTerm.toFixed(6)}
                                    </div>
                                  </div>
                                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                                    <div className="text-gray-700 mb-1 font-semibold">Step 4: Sum all terms (Portfolio Variance)</div>
                                    <div className="text-gray-700">
                                      σ<sub>p</sub>² = {variance1Term.toFixed(6)} + {variance2Term.toFixed(6)} + {covarianceTerm.toFixed(6)} = {portfolioVariance.toFixed(6)}
                                    </div>
                                  </div>
                                  <div className="bg-gradient-to-r from-teal-100 to-blue-100 p-3 rounded border-2 border-teal-300">
                                    <div className="text-teal-800 font-bold">
                                      Step 5: σ<sub>p</sub> = √{portfolioVariance.toFixed(6)} = {portfolioRisk.toFixed(4)} or {(portfolioRisk * 100).toFixed(2)}%
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Excel Guide */}
                              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200">
                                <h4 className="font-bold text-green-700 mb-3 flex items-center gap-2">
                                  <span className="text-lg">📊</span>
                                  Excel Formula Guide
                                </h4>
                                <div className="bg-white rounded-lg p-3 border-2 border-green-200">
                                  <div className="font-mono text-sm space-y-2">
                                    <div className="bg-green-50 p-2 rounded border border-green-300">
                                      <span className="text-gray-700">Portfolio Risk = </span>
                                      <span className="text-green-800 font-bold">
                                        =SQRT(A2^2*B2^2 + A3^2*B3^2 + 2*A2*A3*C2*B2*B3)
                                      </span>
                                    </div>
                                    <p className="text-xs text-gray-600">
                                      Where A2:A3 are weights, B2:B3 are standard deviations, and C2 is correlation
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Diversification Benefit */}
                              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-2 border-purple-200">
                                <h5 className="font-bold text-purple-800 mb-3 flex items-center gap-2">
                                  <Shield className="w-5 h-5" />
                                  Diversification Benefit Analysis
                                </h5>
                                {(() => {
                                  const weightedAvgRisk = weight1 * stdDev1 + weight2 * stdDev2;
                                  const diversificationBenefit = weightedAvgRisk - portfolioRisk;
                                  const benefitPercent = (diversificationBenefit / weightedAvgRisk) * 100;

                                  return (
                                    <div className="space-y-2 text-sm">
                                      <div className="bg-white rounded p-3 border border-purple-200">
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-700">Weighted Average Risk:</span>
                                          <span className="font-mono font-bold text-gray-800">{(weightedAvgRisk * 100).toFixed(2)}%</span>
                                        </div>
                                      </div>
                                      <div className="bg-white rounded p-3 border border-purple-200">
                                        <div className="flex justify-between items-center">
                                          <span className="text-gray-700">Portfolio Risk (Diversified):</span>
                                          <span className="font-mono font-bold text-teal-800">{(portfolioRisk * 100).toFixed(2)}%</span>
                                        </div>
                                      </div>
                                      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded p-3 border-2 border-purple-300">
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="font-bold text-purple-800">Risk Reduction:</span>
                                          <span className="font-mono font-bold text-purple-900">{(diversificationBenefit * 100).toFixed(2)}%</span>
                                        </div>
                                        <div className="text-xs text-center text-gray-600">
                                          ({benefitPercent.toFixed(1)}% reduction from diversification)
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })()}
                              </div>

                              {/* Key Insight */}
                              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
                                <div className="flex items-start gap-3">
                                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                  <div>
                                    <h5 className="font-bold text-blue-800 mb-1">The Power of Diversification</h5>
                                    <p className="text-sm text-gray-700 mb-2">
                                      Portfolio risk is typically LOWER than the weighted average of individual asset risks - this is the diversification effect!
                                      The benefit is greatest when correlation is low or negative.
                                    </p>
                                    <div className="text-xs space-y-1 bg-white rounded p-2 border border-blue-200">
                                      <div><strong>ρ = +1.0:</strong> No diversification benefit (perfect positive correlation)</div>
                                      <div><strong>ρ = +0.5:</strong> Moderate diversification benefit</div>
                                      <div><strong>ρ = 0.0:</strong> Good diversification benefit (uncorrelated)</div>
                                      <div><strong>ρ = -1.0:</strong> Maximum diversification benefit (perfect hedge)</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                      </div>

                      {/* Educational Note */}
                      <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 rounded-xl p-6 border-2 border-blue-300">
                        <h4 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                          <Info className="w-5 h-5 text-blue-600" />
                          When to Use Each Method
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-white rounded-lg p-4 border border-green-200">
                            <h5 className="font-bold text-green-700 mb-2">Simple Returns</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>✓ Comparing returns across different assets in a portfolio</li>
                              <li>✓ When you need intuitive percentage changes</li>
                              <li>✓ Short-term performance measurement</li>
                            </ul>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <h5 className="font-bold text-purple-700 mb-2">Log Returns</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>✓ When prices follow Geometric Brownian Motion</li>
                              <li>✓ Statistical modeling and analysis</li>
                              <li>✓ Measuring returns over time (time-additive)</li>
                            </ul>
                          </div>
                          <div className="bg-white rounded-lg p-4 border border-amber-200">
                            <h5 className="font-bold text-amber-700 mb-2">Geometric Mean</h5>
                            <ul className="text-xs text-gray-600 space-y-1">
                              <li>✓ Calculating CAGR (Compound Annual Growth Rate)</li>
                              <li>✓ True average return over multiple periods</li>
                              <li>✓ Comparing long-term investment performance</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                  </div>
                </div>
              </div>
            )}

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
                      <p className="text-gray-600">Master portfolio concepts through hands-on problem solving</p>
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
