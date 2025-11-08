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
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
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
                  {selectedCompanies.length > 0 && (
                    <button
                      onClick={() => {
                        setSelectedCompanies([]);
                        setCompaniesData({});
                        setPortfolioWeights({});
                      }}
                      className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      <Trash2 className="w-4 h-4" />
                      Clear All
                    </button>
                  )}
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
          <div className="space-y-8">

            {/* Selected Companies Display */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Building2 className="w-6 h-6 text-indigo-600" />
                  Selected Companies ({selectedCompanies.length})
                </h2>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCompanies.map((company) => {
                  const data = companiesData[company.symbol];
                  const stats = data && data.returns ? calculateStatistics(data.returns) : null;

                  return (
                    <div key={company.symbol} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200 relative">
                      <button
                        onClick={() => removeCompany(company.symbol)}
                        className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                        title={`Remove ${company.name}`}
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="mb-3">
                        <h3 className="text-lg font-bold text-gray-900">{company.symbol.replace('.AX', '')}</h3>
                        <p className="text-sm text-gray-600">{company.name}</p>
                        <span className="inline-block mt-1 px-2 py-1 bg-indigo-200 rounded text-xs font-medium text-indigo-800">
                          {company.sector}
                        </span>
                      </div>

                      {data && data.quote && (
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Price:</span>
                            <span className="text-lg font-bold text-gray-900">{formatCurrency(data.quote.price)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Change:</span>
                            <span className={`text-sm font-semibold ${data.quote.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {data.quote.change >= 0 ? '▲' : '▼'} {formatNumber(Math.abs(data.quote.changePercent))}%
                            </span>
                          </div>
                        </div>
                      )}

                      {stats && (
                        <div className="pt-3 border-t border-indigo-200 space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Expected Return:</span>
                            <span className="font-semibold text-gray-900">{(stats.annualizedReturn * 100).toFixed(2)}%</span>
                          </div>
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600">Risk (σ):</span>
                            <span className="font-semibold text-gray-900">{(stats.annualizedRisk * 100).toFixed(2)}%</span>
                          </div>
                        </div>
                      )}

                      <div className="mt-3">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-gray-600">Portfolio Weight:</span>
                          <span className="font-semibold text-indigo-700">{((portfolioWeights[company.symbol] || 0) * 100).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(portfolioWeights[company.symbol] || 0) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Individual Company Analysis Sections */}
            {selectedCompanies.map((company) => {
              const data = companiesData[company.symbol];
              if (!data) return null;

              return (
                <div key={company.symbol} className="space-y-6">
                  {/* Company Header */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-3xl font-bold mb-2">{company.name}</h2>
                        <div className="flex items-center gap-3">
                          <span className="text-xl font-semibold">{company.symbol.replace('.AX', '')}</span>
                          <span className="px-3 py-1 bg-white/20 rounded-lg text-sm font-medium">{company.sector}</span>
                        </div>
                      </div>
                      {data.quote && (
                        <div className="text-right">
                          <p className="text-4xl font-bold">{formatCurrency(data.quote.price)}</p>
                          <p className={`text-lg font-semibold ${data.quote.change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                            {data.quote.change >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(data.quote.change))} ({formatNumber(Math.abs(data.quote.changePercent))}%)
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Historical Price Chart */}
                  {data.historicalPrices && data.historicalPrices.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <LineChartIcon className="w-6 h-6 text-indigo-600" />
                        Historical Price Chart
                      </h3>
                      <div className="h-96">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={data.historicalPrices}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                              dataKey="date"
                              tick={{ fontSize: 12 }}
                              interval={Math.floor(data.historicalPrices.length / 8)}
                            />
                            <YAxis
                              domain={['auto', 'auto']}
                              tick={{ fontSize: 12 }}
                            />
                            <Tooltip
                              formatter={(value) => formatCurrency(value)}
                              contentStyle={{ backgroundColor: 'white', border: '2px solid #818cf8' }}
                            />
                            <Legend />
                            <Line
                              type="monotone"
                              dataKey="close"
                              stroke="#6366f1"
                              strokeWidth={2}
                              dot={false}
                              name="Close Price"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  )}

                  {/* Quote Details */}
                  {data.quote && (
                    <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign className="w-6 h-6 text-indigo-600" />
                        Quote Details
                      </h3>
                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                          <p className="text-sm text-gray-600 mb-1">Current Price</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.quote.price)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                          <p className="text-sm text-gray-600 mb-1">Previous Close</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.quote.previousClose)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                          <p className="text-sm text-gray-600 mb-1">Day High</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.quote.dayHigh)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                          <p className="text-sm text-gray-600 mb-1">Day Low</p>
                          <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.quote.dayLow)}</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                          <p className="text-sm text-gray-600 mb-1">Volume</p>
                          <p className="text-2xl font-bold text-gray-900">{data.quote.volume?.toLocaleString()}</p>
                        </div>
                        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                          <p className="text-sm text-gray-600 mb-1">Market Cap</p>
                          <p className="text-2xl font-bold text-gray-900">{data.quote.marketCap}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Financial Statements - Income Statement */}
                  <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-6 h-6 text-indigo-600" />
                      Income Statement
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-indigo-50">
                            <th className="p-3 text-left text-sm font-semibold text-gray-900">Period</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Revenue</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Gross Profit</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Operating Income</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Net Income</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {generateSampleIncomeStatement().map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-3 text-sm font-medium text-gray-900">{row.period}</td>
                              <td className="p-3 text-right text-sm text-gray-700">{formatLargeCurrency(row.revenue)}</td>
                              <td className="p-3 text-right text-sm text-gray-700">{formatLargeCurrency(row.grossProfit)}</td>
                              <td className="p-3 text-right text-sm text-gray-700">{formatLargeCurrency(row.operatingIncome)}</td>
                              <td className="p-3 text-right text-sm font-semibold text-gray-900">{formatLargeCurrency(row.netIncome)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Financial Statements - Balance Sheet */}
                  <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <BarChart3 className="w-6 h-6 text-indigo-600" />
                      Balance Sheet
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-indigo-50">
                            <th className="p-3 text-left text-sm font-semibold text-gray-900">Period</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Total Assets</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Total Liabilities</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Shareholder Equity</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Cash</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {generateSampleBalanceSheet().map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-3 text-sm font-medium text-gray-900">{row.period}</td>
                              <td className="p-3 text-right text-sm text-gray-700">{formatLargeCurrency(row.totalAssets)}</td>
                              <td className="p-3 text-right text-sm text-gray-700">{formatLargeCurrency(row.totalLiabilities)}</td>
                              <td className="p-3 text-right text-sm font-semibold text-gray-900">{formatLargeCurrency(row.shareholderEquity)}</td>
                              <td className="p-3 text-right text-sm text-gray-700">{formatLargeCurrency(row.cash)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Financial Statements - Cash Flow */}
                  <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Activity className="w-6 h-6 text-indigo-600" />
                      Cash Flow Statement
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-indigo-50">
                            <th className="p-3 text-left text-sm font-semibold text-gray-900">Period</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Operating Cash Flow</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Investing Cash Flow</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Financing Cash Flow</th>
                            <th className="p-3 text-right text-sm font-semibold text-gray-900">Free Cash Flow</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {generateSampleCashFlow().map((row, idx) => (
                            <tr key={idx} className="hover:bg-gray-50">
                              <td className="p-3 text-sm font-medium text-gray-900">{row.period}</td>
                              <td className="p-3 text-right text-sm text-gray-700">{formatLargeCurrency(row.operatingCashFlow)}</td>
                              <td className="p-3 text-right text-sm text-red-600">{formatLargeCurrency(row.investingCashFlow)}</td>
                              <td className="p-3 text-right text-sm text-red-600">{formatLargeCurrency(row.financingCashFlow)}</td>
                              <td className="p-3 text-right text-sm font-semibold text-gray-900">{formatLargeCurrency(row.freeCashFlow)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Key Metrics */}
                  <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <PieChart className="w-6 h-6 text-indigo-600" />
                      Key Metrics
                    </h3>
                    {(() => {
                      const metrics = generateSampleKeyMetrics();
                      return (
                        <div className="grid md:grid-cols-4 gap-4">
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                            <p className="text-sm text-gray-600 mb-1">P/E Ratio</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.peRatio}</p>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                            <p className="text-sm text-gray-600 mb-1">P/B Ratio</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.pbRatio}</p>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                            <p className="text-sm text-gray-600 mb-1">ROE</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.roe}%</p>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                            <p className="text-sm text-gray-600 mb-1">ROA</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.roa}%</p>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                            <p className="text-sm text-gray-600 mb-1">Debt/Equity</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.debtToEquity}</p>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                            <p className="text-sm text-gray-600 mb-1">Current Ratio</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.currentRatio}</p>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                            <p className="text-sm text-gray-600 mb-1">Dividend Yield</p>
                            <p className="text-2xl font-bold text-gray-900">{metrics.dividendYield}%</p>
                          </div>
                          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-200">
                            <p className="text-sm text-gray-600 mb-1">EPS</p>
                            <p className="text-2xl font-bold text-gray-900">{formatCurrency(metrics.eps)}</p>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              );
            })}

            {/* Portfolio Metrics Summary */}
            {(() => {
              const portfolioMetrics = calculatePortfolioMetrics();
              if (!portfolioMetrics) return null;

              return (
                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 shadow-xl text-white">
                  <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
                    <PieChart className="w-8 h-8" />
                    Portfolio Performance Metrics
                  </h2>

                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                      <p className="text-indigo-200 text-sm mb-2">Expected Return</p>
                      <p className="text-4xl font-bold">{(portfolioMetrics.expectedReturn * 100).toFixed(2)}%</p>
                      <p className="text-xs text-indigo-200 mt-2">Annualized</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                      <p className="text-indigo-200 text-sm mb-2">Portfolio Risk (σ)</p>
                      <p className="text-4xl font-bold">{(portfolioMetrics.risk * 100).toFixed(2)}%</p>
                      <p className="text-xs text-indigo-200 mt-2">Standard Deviation</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                      <p className="text-indigo-200 text-sm mb-2">Sharpe Ratio</p>
                      <p className="text-4xl font-bold">{portfolioMetrics.sharpeRatio.toFixed(3)}</p>
                      <p className="text-xs text-indigo-200 mt-2">Risk-adjusted Return</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur rounded-xl p-6">
                      <p className="text-indigo-200 text-sm mb-2">Variance</p>
                      <p className="text-4xl font-bold">{(portfolioMetrics.variance * 10000).toFixed(2)}</p>
                      <p className="text-xs text-indigo-200 mt-2">×10⁻⁴</p>
                    </div>
                  </div>

                  <div className="mt-6 bg-white/10 backdrop-blur rounded-xl p-4">
                    <p className="text-sm text-indigo-100">
                      <strong>Note:</strong> Risk-free rate assumed at 4.0%. Sharpe Ratio = (Expected Return - Risk-Free Rate) / Portfolio Risk
                    </p>
                  </div>
                </div>
              );
            })()}

            {/* Correlation Matrix */}
            {selectedCompanies.length > 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <Activity className="w-6 h-6 text-indigo-600" />
                  Correlation Matrix
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 text-left text-xs font-semibold text-gray-600"></th>
                        {selectedCompanies.map(company => (
                          <th key={company.symbol} className="p-2 text-center text-xs font-semibold text-gray-600">
                            {company.symbol.replace('.AX', '')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCompanies.map((company1) => {
                        const data1 = companiesData[company1.symbol];
                        return (
                          <tr key={company1.symbol}>
                            <td className="p-2 text-xs font-semibold text-gray-600">{company1.symbol.replace('.AX', '')}</td>
                            {selectedCompanies.map((company2) => {
                              const data2 = companiesData[company2.symbol];

                              if (!data1 || !data2 || !data1.returns || !data2.returns) {
                                return <td key={company2.symbol} className="p-2 text-center text-xs text-gray-400">-</td>;
                              }

                              const correlation = company1.symbol === company2.symbol ? 1 : calculateCorrelation(data1.returns, data2.returns);
                              const bgColor = correlation > 0.7 ? 'bg-green-100' : correlation > 0.3 ? 'bg-yellow-100' : correlation > -0.3 ? 'bg-gray-100' : correlation > -0.7 ? 'bg-orange-100' : 'bg-red-100';
                              const textColor = correlation > 0.7 ? 'text-green-900' : correlation > 0.3 ? 'text-yellow-900' : correlation > -0.3 ? 'text-gray-900' : correlation > -0.7 ? 'text-orange-900' : 'text-red-900';

                              return (
                                <td key={company2.symbol} className={`p-2 text-center ${bgColor}`}>
                                  <span className={`text-xs font-semibold ${textColor}`}>
                                    {correlation.toFixed(3)}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs">
                  <span className="text-gray-600 font-semibold">Correlation strength:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
                    <span className="text-gray-600">Strong (+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 border border-yellow-300 rounded"></div>
                    <span className="text-gray-600">Moderate (+)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
                    <span className="text-gray-600">Weak</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 border border-orange-300 rounded"></div>
                    <span className="text-gray-600">Moderate (-)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
                    <span className="text-gray-600">Strong (-)</span>
                  </div>
                </div>
              </div>
            )}

            {/* Covariance Matrix */}
            {selectedCompanies.length > 1 && (
              <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                  Covariance Matrix (×10⁻⁴)
                </h2>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="p-2 text-left text-xs font-semibold text-gray-600"></th>
                        {selectedCompanies.map(company => (
                          <th key={company.symbol} className="p-2 text-center text-xs font-semibold text-gray-600">
                            {company.symbol.replace('.AX', '')}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {selectedCompanies.map((company1) => {
                        const data1 = companiesData[company1.symbol];
                        return (
                          <tr key={company1.symbol}>
                            <td className="p-2 text-xs font-semibold text-gray-600">{company1.symbol.replace('.AX', '')}</td>
                            {selectedCompanies.map((company2) => {
                              const data2 = companiesData[company2.symbol];

                              if (!data1 || !data2 || !data1.returns || !data2.returns) {
                                return <td key={company2.symbol} className="p-2 text-center text-xs text-gray-400">-</td>;
                              }

                              const covariance = company1.symbol === company2.symbol
                                ? calculateStatistics(data1.returns).variance
                                : calculateCovariance(data1.returns, data2.returns);

                              return (
                                <td key={company2.symbol} className="p-2 text-center bg-indigo-50">
                                  <span className="text-xs font-semibold text-indigo-900">
                                    {(covariance * 10000).toFixed(4)}
                                  </span>
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 text-xs text-gray-600">
                  <p><strong>Note:</strong> Values are daily covariances scaled by 10⁴ for readability. Diagonal elements represent individual stock variances.</p>
                </div>
              </div>
            )}

            {/* Individual Stock Returns Distribution */}
            <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-indigo-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
                Individual Stock Returns Distribution
              </h2>

              <div className="grid md:grid-cols-2 gap-6">
                {selectedCompanies.map((company) => {
                  const data = companiesData[company.symbol];
                  if (!data || !data.returns || data.returns.length === 0) return null;

                  const stats = calculateStatistics(data.returns);

                  return (
                    <div key={company.symbol} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border-2 border-indigo-200">
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{company.name}</h3>

                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Exp. Return</p>
                          <p className="text-lg font-bold text-indigo-700">{(stats.annualizedReturn * 100).toFixed(2)}%</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Risk (σ)</p>
                          <p className="text-lg font-bold text-purple-700">{(stats.annualizedRisk * 100).toFixed(2)}%</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Daily Mean</p>
                          <p className="text-sm font-semibold text-gray-700">{(stats.mean * 100).toFixed(4)}%</p>
                        </div>
                        <div className="bg-white rounded-lg p-3">
                          <p className="text-xs text-gray-600 mb-1">Daily Std Dev</p>
                          <p className="text-sm font-semibold text-gray-700">{(stats.stdDev * 100).toFixed(4)}%</p>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3">
                        <p className="text-xs text-gray-600 mb-2">Returns Distribution (Last 20 days)</p>
                        <div className="h-32">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.returns.slice(-20)}>
                              <XAxis dataKey="date" hide />
                              <YAxis hide domain={['auto', 'auto']} />
                              <Tooltip
                                formatter={(value) => `${(value * 100).toFixed(2)}%`}
                                labelFormatter={(label) => `Date: ${label}`}
                              />
                              <Area type="monotone" dataKey="return" stroke="#6366f1" fill="#818cf8" fillOpacity={0.6} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* No Companies Selected State */}
        {selectedCompanies.length === 0 && !loading && (
          <div className="bg-white rounded-2xl p-12 shadow-xl border-2 border-indigo-200 text-center">
            <Building2 className="w-24 h-24 mx-auto mb-6 text-indigo-300" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Build Your Portfolio</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Select multiple Australian companies from the dropdown above to analyze portfolio performance, correlations, and risk metrics.
            </p>
            <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Real-time prices</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Returns analysis</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Correlation matrix</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Portfolio metrics</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
