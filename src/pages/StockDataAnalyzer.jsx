import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  ArrowLeft,
  Search,
  TrendingUp,
  Building2,
  BarChart3,
  LineChart as LineChartIcon,
  DollarSign,
  Calendar,
  Download,
  RefreshCw,
  FileText,
  PieChart,
  Activity,
  AlertCircle,
  CheckCircle2,
  Loader,
  Info,
  ChevronDown,
  ChevronUp,
  X,
  Trash2
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Major Australian Companies (ASX)
const AUSTRALIAN_COMPANIES = [
  { symbol: 'BHP.AX', name: 'BHP Group', sector: 'Materials' },
  { symbol: 'CBA.AX', name: 'Commonwealth Bank', sector: 'Financials' },
  { symbol: 'CSL.AX', name: 'CSL Limited', sector: 'Healthcare' },
  { symbol: 'NAB.AX', name: 'National Australia Bank', sector: 'Financials' },
  { symbol: 'WBC.AX', name: 'Westpac Banking', sector: 'Financials' },
  { symbol: 'ANZ.AX', name: 'ANZ Banking Group', sector: 'Financials' },
  { symbol: 'WES.AX', name: 'Wesfarmers', sector: 'Consumer Staples' },
  { symbol: 'MQG.AX', name: 'Macquarie Group', sector: 'Financials' },
  { symbol: 'WOW.AX', name: 'Woolworths Group', sector: 'Consumer Staples' },
  { symbol: 'FMG.AX', name: 'Fortescue Metals', sector: 'Materials' },
  { symbol: 'RIO.AX', name: 'Rio Tinto', sector: 'Materials' },
  { symbol: 'TLS.AX', name: 'Telstra', sector: 'Telecommunications' },
  { symbol: 'WDS.AX', name: 'Woodside Energy', sector: 'Energy' },
  { symbol: 'GMG.AX', name: 'Goodman Group', sector: 'Real Estate' },
  { symbol: 'TCL.AX', name: 'Transurban Group', sector: 'Industrials' },
  { symbol: 'STO.AX', name: 'Santos', sector: 'Energy' },
  { symbol: 'COL.AX', name: 'Coles Group', sector: 'Consumer Staples' },
  { symbol: 'REA.AX', name: 'REA Group', sector: 'Real Estate' },
  { symbol: 'WTC.AX', name: 'WiseTech Global', sector: 'Technology' },
  { symbol: 'ALL.AX', name: 'Aristocrat Leisure', sector: 'Consumer Discretionary' }
];

export default function StockDataAnalyzer() {
  const navigate = useNavigate();
  const [selectedCompanies, setSelectedCompanies] = useState([]); // Changed to array for multi-select
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dateRange, setDateRange] = useState('1y'); // 1m, 3m, 6m, 1y, 3y, 5y
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Portfolio weights (equal weight by default)
  const [portfolioWeights, setPortfolioWeights] = useState({});

  // Multi-company stock data state (keyed by symbol)
  const [companiesData, setCompaniesData] = useState({});

  // Filter companies based on search
  const filteredCompanies = AUSTRALIAN_COMPANIES.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.sector.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Fetch stock data from Yahoo Finance API
  const fetchStockData = async (symbol) => {
    setLoading(true);
    setError(null);

    try {
      // Note: In production, you would route these requests through your backend
      // to avoid CORS issues and to protect API keys

      // For demonstration, we'll use a CORS proxy
      const corsProxy = 'https://corsproxy.io/?';

      // Fetch quote data
      const quoteUrl = `${corsProxy}https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${dateRange}`;
      const quoteResponse = await axios.get(quoteUrl);

      if (quoteResponse.data && quoteResponse.data.chart && quoteResponse.data.chart.result) {
        const result = quoteResponse.data.chart.result[0];
        const meta = result.meta;
        const timestamps = result.timestamp;
        const quotes = result.indicators.quote[0];

        // Process historical prices
        const historicalPrices = timestamps.map((timestamp, index) => ({
          date: new Date(timestamp * 1000).toLocaleDateString(),
          timestamp: timestamp,
          open: quotes.open[index],
          high: quotes.high[index],
          low: quotes.low[index],
          close: quotes.close[index],
          volume: quotes.volume[index]
        })).filter(price => price.close !== null);

        // Current quote
        const quote = {
          symbol: meta.symbol,
          price: meta.regularMarketPrice,
          previousClose: meta.previousClose,
          change: meta.regularMarketPrice - meta.previousClose,
          changePercent: ((meta.regularMarketPrice - meta.previousClose) / meta.previousClose) * 100,
          dayHigh: meta.regularMarketDayHigh,
          dayLow: meta.regularMarketDayLow,
          volume: meta.regularMarketVolume,
          marketCap: meta.marketCap || 'N/A',
          currency: meta.currency
        };

        // Store data for this specific company
        setCompaniesData(prev => ({
          ...prev,
          [symbol]: {
            quote: quote,
            historicalPrices: historicalPrices,
            returns: calculateReturns(historicalPrices),
            company: AUSTRALIAN_COMPANIES.find(c => c.symbol === symbol)
          }
        }));
      }

    } catch (err) {
      console.error('Error fetching stock data:', err);
      setError('Unable to fetch real-time data. Using sample data for demonstration.');

      // Load sample data as fallback
      loadSampleData(symbol);
    } finally {
      setLoading(false);
    }
  };

  // Fetch financial statements
  const fetchFinancialStatements = async (symbol) => {
    try {
      // In production, these would be real API calls
      // For now, we'll generate realistic sample data

      setStockData(prev => ({
        ...prev,
        incomeStatement: generateSampleIncomeStatement(),
        balanceSheet: generateSampleBalanceSheet(),
        cashFlow: generateSampleCashFlow(),
        keyMetrics: generateSampleKeyMetrics()
      }));

    } catch (err) {
      console.error('Error fetching financial statements:', err);
    }
  };

  // Load sample data for demonstration
  const loadSampleData = (symbol) => {
    const company = AUSTRALIAN_COMPANIES.find(c => c.symbol === symbol);

    setStockData({
      quote: {
        symbol: symbol,
        price: 85.50 + Math.random() * 20,
        previousClose: 84.20,
        change: 1.30,
        changePercent: 1.54,
        dayHigh: 86.75,
        dayLow: 84.10,
        volume: 1250000,
        marketCap: '125.5B',
        currency: 'AUD'
      },
      historicalPrices: generateSamplePriceHistory(),
      incomeStatement: generateSampleIncomeStatement(),
      balanceSheet: generateSampleBalanceSheet(),
      cashFlow: generateSampleCashFlow(),
      keyMetrics: generateSampleKeyMetrics()
    });
  };

  // Sample data generators
  const generateSamplePriceHistory = () => {
    const data = [];
    const basePrice = 80;
    const periods = dateRange === '1m' ? 20 : dateRange === '3m' ? 60 :
                   dateRange === '6m' ? 120 : dateRange === '1y' ? 252 : 756;

    for (let i = periods; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const volatility = Math.random() * 4 - 2;
      const price = basePrice + (Math.sin(i / 10) * 5) + volatility;

      data.push({
        date: date.toLocaleDateString(),
        timestamp: date.getTime() / 1000,
        open: price - Math.random(),
        high: price + Math.random() * 2,
        low: price - Math.random() * 2,
        close: price,
        volume: Math.floor(1000000 + Math.random() * 500000)
      });
    }

    return data;
  };

  const generateSampleIncomeStatement = () => {
    return [
      { period: '2024', revenue: 45200, costOfRevenue: 28500, grossProfit: 16700, operatingExpenses: 8200, operatingIncome: 8500, netIncome: 6800 },
      { period: '2023', revenue: 42800, costOfRevenue: 27100, grossProfit: 15700, operatingExpenses: 7800, operatingIncome: 7900, netIncome: 6300 },
      { period: '2022', revenue: 39500, costOfRevenue: 25200, grossProfit: 14300, operatingExpenses: 7200, operatingIncome: 7100, netIncome: 5700 },
      { period: '2021', revenue: 36200, costOfRevenue: 23400, grossProfit: 12800, operatingExpenses: 6600, operatingIncome: 6200, netIncome: 4900 }
    ];
  };

  const generateSampleBalanceSheet = () => {
    return [
      { period: '2024', totalAssets: 125000, totalLiabilities: 68000, shareholderEquity: 57000, cash: 12500, totalDebt: 28000, currentAssets: 45000, currentLiabilities: 22000 },
      { period: '2023', totalAssets: 118000, totalLiabilities: 64000, shareholderEquity: 54000, cash: 11200, totalDebt: 26500, currentAssets: 42000, currentLiabilities: 20500 },
      { period: '2022', totalAssets: 110000, totalLiabilities: 60000, shareholderEquity: 50000, cash: 10100, totalDebt: 24800, currentAssets: 39000, currentLiabilities: 19000 },
      { period: '2021', totalAssets: 102000, totalLiabilities: 56000, shareholderEquity: 46000, cash: 9500, totalDebt: 23000, currentAssets: 36000, currentLiabilities: 17500 }
    ];
  };

  const generateSampleCashFlow = () => {
    return [
      { period: '2024', operatingCashFlow: 9200, investingCashFlow: -4500, financingCashFlow: -3200, freeCashFlow: 4700, capitalExpenditures: 4500 },
      { period: '2023', operatingCashFlow: 8600, investingCashFlow: -4200, financingCashFlow: -2900, freeCashFlow: 4400, capitalExpenditures: 4200 },
      { period: '2022', operatingCashFlow: 7900, investingCashFlow: -3800, financingCashFlow: -2600, freeCashFlow: 4100, capitalExpenditures: 3800 },
      { period: '2021', operatingCashFlow: 7200, investingCashFlow: -3500, financingCashFlow: -2400, freeCashFlow: 3700, capitalExpenditures: 3500 }
    ];
  };

  const generateSampleKeyMetrics = () => {
    return {
      peRatio: 18.5,
      pbRatio: 2.8,
      debtToEquity: 0.49,
      roe: 11.9,
      roa: 5.4,
      currentRatio: 2.05,
      quickRatio: 1.65,
      dividendYield: 3.2,
      eps: 4.62,
      beta: 1.15
    };
  };

  const handleCompanySelect = (company) => {
    // Toggle company selection
    const isSelected = selectedCompanies.find(c => c.symbol === company.symbol);

    if (isSelected) {
      // Remove company
      setSelectedCompanies(prev => prev.filter(c => c.symbol !== company.symbol));
      setCompaniesData(prev => {
        const newData = { ...prev };
        delete newData[company.symbol];
        return newData;
      });
      setPortfolioWeights(prev => {
        const newWeights = { ...prev };
        delete newWeights[company.symbol];
        return newWeights;
      });
    } else {
      // Add company
      setSelectedCompanies(prev => [...prev, company]);
      fetchStockData(company.symbol);

      // Set equal weight by default
      setPortfolioWeights(prev => {
        const newCount = selectedCompanies.length + 1;
        const equalWeight = 1 / newCount;
        const newWeights = {};
        selectedCompanies.forEach(c => {
          newWeights[c.symbol] = equalWeight;
        });
        newWeights[company.symbol] = equalWeight;
        return newWeights;
      });
    }
  };

  const removeCompany = (symbol) => {
    setSelectedCompanies(prev => prev.filter(c => c.symbol !== symbol));
    setCompaniesData(prev => {
      const newData = { ...prev };
      delete newData[symbol];
      return newData;
    });

    // Recalculate equal weights for remaining companies
    setPortfolioWeights(prev => {
      const newWeights = { ...prev };
      delete newWeights[symbol];
      const remaining = selectedCompanies.filter(c => c.symbol !== symbol);
      if (remaining.length > 0) {
        const equalWeight = 1 / remaining.length;
        remaining.forEach(c => {
          newWeights[c.symbol] = equalWeight;
        });
      }
      return newWeights;
    });
  };

  const formatCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0 }).format(value);
  };

  const formatLargeCurrency = (value) => {
    if (value === null || value === undefined) return 'N/A';
    if (value >= 1000000) return `${formatCurrency(value / 1000000)}M`;
    if (value >= 1000) return `${formatCurrency(value / 1000)}K`;
    return formatCurrency(value);
  };

  const formatNumber = (value, decimals = 2) => {
    if (value === null || value === undefined) return 'N/A';
    return value.toLocaleString('en-AU', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
  };

  // Calculate returns from historical prices
  const calculateReturns = (historicalPrices) => {
    if (!historicalPrices || historicalPrices.length < 2) return [];

    const returns = [];
    for (let i = 1; i < historicalPrices.length; i++) {
      const currentPrice = historicalPrices[i].close;
      const previousPrice = historicalPrices[i - 1].close;

      if (currentPrice !== null && previousPrice !== null && previousPrice !== 0) {
        const dailyReturn = (currentPrice - previousPrice) / previousPrice;
        returns.push({
          date: historicalPrices[i].date,
          return: dailyReturn,
          returnPercent: dailyReturn * 100
        });
      }
    }
    return returns;
  };

  // Calculate statistics for a stock
  const calculateStatistics = (returns) => {
    if (!returns || returns.length === 0) {
      return { mean: 0, variance: 0, stdDev: 0, annualizedReturn: 0, annualizedRisk: 0 };
    }

    // Calculate mean (expected return)
    const mean = returns.reduce((sum, r) => sum + r.return, 0) / returns.length;

    // Calculate variance
    const squaredDiffs = returns.map(r => Math.pow(r.return - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / returns.length;

    // Calculate standard deviation (risk)
    const stdDev = Math.sqrt(variance);

    // Annualize (assuming 252 trading days)
    const annualizedReturn = mean * 252;
    const annualizedRisk = stdDev * Math.sqrt(252);

    return {
      mean,
      variance,
      stdDev,
      annualizedReturn,
      annualizedRisk
    };
  };

  // Calculate covariance between two stocks
  const calculateCovariance = (returns1, returns2) => {
    if (!returns1 || !returns2 || returns1.length === 0 || returns2.length === 0) {
      return 0;
    }

    const minLength = Math.min(returns1.length, returns2.length);
    const mean1 = returns1.slice(0, minLength).reduce((sum, r) => sum + r.return, 0) / minLength;
    const mean2 = returns2.slice(0, minLength).reduce((sum, r) => sum + r.return, 0) / minLength;

    let covariance = 0;
    for (let i = 0; i < minLength; i++) {
      covariance += (returns1[i].return - mean1) * (returns2[i].return - mean2);
    }

    return covariance / minLength;
  };

  // Calculate correlation between two stocks
  const calculateCorrelation = (returns1, returns2) => {
    const covariance = calculateCovariance(returns1, returns2);
    const stats1 = calculateStatistics(returns1);
    const stats2 = calculateStatistics(returns2);

    if (stats1.stdDev === 0 || stats2.stdDev === 0) return 0;

    return covariance / (stats1.stdDev * stats2.stdDev);
  };

  // Calculate portfolio metrics
  const calculatePortfolioMetrics = () => {
    if (selectedCompanies.length === 0) return null;

    const symbols = selectedCompanies.map(c => c.symbol);
    const weights = symbols.map(symbol => portfolioWeights[symbol] || 0);

    // Calculate portfolio expected return
    let portfolioReturn = 0;
    symbols.forEach((symbol, i) => {
      const data = companiesData[symbol];
      if (data && data.returns) {
        const stats = calculateStatistics(data.returns);
        portfolioReturn += weights[i] * stats.annualizedReturn;
      }
    });

    // Calculate portfolio variance
    let portfolioVariance = 0;
    for (let i = 0; i < symbols.length; i++) {
      for (let j = 0; j < symbols.length; j++) {
        const data_i = companiesData[symbols[i]];
        const data_j = companiesData[symbols[j]];

        if (data_i && data_j && data_i.returns && data_j.returns) {
          const cov = i === j
            ? calculateStatistics(data_i.returns).variance
            : calculateCovariance(data_i.returns, data_j.returns);

          portfolioVariance += weights[i] * weights[j] * cov * 252; // Annualize
        }
      }
    }

    const portfolioRisk = Math.sqrt(portfolioVariance);

    // Calculate Sharpe Ratio (assuming risk-free rate of 4%)
    const riskFreeRate = 0.04;
    const sharpeRatio = portfolioRisk !== 0 ? (portfolioReturn - riskFreeRate) / portfolioRisk : 0;

    return {
      expectedReturn: portfolioReturn,
      variance: portfolioVariance,
      risk: portfolioRisk,
      sharpeRatio
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b-4 border-indigo-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Australian Stock Data Analyzer</h1>
                <p className="text-gray-600 mt-1">Real-time ASX data • Financial Statements • Company Analysis</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-gray-600">ASX Trading</p>
                <p className="text-lg font-bold text-green-600">● LIVE</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Company Search/Selection - Compact Dropdown */}
        <div className="relative mb-8">
          {/* Dropdown Trigger Button */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-2xl p-6 shadow-xl border-2 border-indigo-300 transition-all duration-300 hover:shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 backdrop-blur rounded-xl">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-indigo-100 mb-1">Selected Companies</p>
                  {selectedCompanies.length > 0 ? (
                    <div>
                      <p className="text-2xl font-bold text-white">{selectedCompanies.length} {selectedCompanies.length === 1 ? 'Company' : 'Companies'} Selected</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {selectedCompanies.slice(0, 3).map(company => (
                          <span key={company.symbol} className="px-2 py-1 bg-white/20 rounded-lg text-xs font-medium text-white">
                            {company.symbol.replace('.AX', '')}
                          </span>
                        ))}
                        {selectedCompanies.length > 3 && (
                          <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-medium text-white">
                            +{selectedCompanies.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xl font-semibold text-white">Click to select Australian companies for portfolio analysis</p>
                  )}
                </div>
              </div>
              <div className={`transform transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                {isDropdownOpen ? (
                  <ChevronUp className="w-8 h-8 text-white" />
                ) : (
                  <ChevronDown className="w-8 h-8 text-white" />
                )}
              </div>
            </div>
          </button>

          {/* Dropdown Panel */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-indigo-200 z-50 overflow-hidden animate-in slide-in-from-top-2 duration-300">
              {/* Search Bar */}
              <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 border-b-2 border-indigo-200">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-indigo-600" />
                  <input
                    type="text"
                    placeholder="Search by company name, symbol, or sector..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border-2 border-indigo-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                    autoFocus
                  />
                </div>
              </div>

              {/* Companies List */}
              <div className="max-h-96 overflow-y-auto">
                {filteredCompanies.length > 0 ? (
                  <div className="divide-y divide-indigo-100">
                    {filteredCompanies.map((company) => {
                      const isSelected = selectedCompanies.find(c => c.symbol === company.symbol);
                      return (
                        <button
                          key={company.symbol}
                          onClick={() => handleCompanySelect(company)}
                          className={`w-full p-4 text-left transition-all duration-200 flex items-center justify-between group ${
                            isSelected
                              ? 'bg-indigo-100 hover:bg-indigo-200'
                              : 'hover:bg-indigo-50'
                          }`}
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`p-2 rounded-lg transition-colors ${
                              isSelected
                                ? 'bg-indigo-200'
                                : 'bg-indigo-100 group-hover:bg-indigo-200'
                            }`}>
                              <Building2 className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <span className="font-bold text-gray-900 text-lg">{company.symbol.replace('.AX', '')}</span>
                                <span className="px-2 py-1 bg-indigo-100 rounded-md text-xs font-medium text-indigo-700">
                                  {company.sector}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 font-medium">{company.name}</p>
                            </div>
                          </div>
                          {isSelected && (
                            <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-base">No companies found matching "{searchQuery}"</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-t-2 border-indigo-200">
                <p className="text-xs text-center text-gray-600">
                  Showing {filteredCompanies.length} of {AUSTRALIAN_COMPANIES.length} Australian companies
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl p-12 shadow-xl border-2 border-indigo-200 text-center">
            <Loader className="w-16 h-16 mx-auto mb-4 text-indigo-600 animate-spin" />
            <p className="text-xl font-semibold text-gray-700">Loading stock data...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl p-4 mb-6 flex items-start gap-3">
            <Info className="w-6 h-6 text-yellow-700 flex-shrink-0 mt-1" />
            <div>
              <p className="font-semibold text-yellow-900">Information</p>
              <p className="text-yellow-800">{error}</p>
            </div>
          </div>
        )}

        {/* Portfolio Analysis Display */}
        {selectedCompanies.length > 0 && !loading && (
        {/* Portfolio Analysis Display */}
        {selectedCompanies.length > 0 && !loading && (
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Portfolio Analysis Coming Soon</h2>
              <p className="text-gray-600">Selected {selectedCompanies.length} companies. Full portfolio analysis UI will be implemented next.</p>
            </div>
          </div>
        )}

        {/* No Companies Selected State */}
        {selectedCompanies.length === 0 && !loading && (
          <div className="bg-white rounded-2xl p-12 shadow-xl border-2 border-indigo-200 text-center">
            <Building2 className="w-24 h-24 mx-auto mb-6 text-indigo-300" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Build Your Portfolio</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Select multiple Australian companies from the dropdown above to analyze portfolio performance.
            </p>
          </div>
        )}          </div>
        )}
      </div>
    </div>
  );
}
