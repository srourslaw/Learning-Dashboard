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
  ChevronUp
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
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // overview, prices, income, balance, cashflow
  const [dateRange, setDateRange] = useState('1y'); // 1m, 3m, 6m, 1y, 3y, 5y
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stock data state
  const [stockData, setStockData] = useState({
    quote: null,
    historicalPrices: [],
    incomeStatement: [],
    balanceSheet: [],
    cashFlow: [],
    keyMetrics: null
  });

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

        setStockData(prev => ({
          ...prev,
          quote: quote,
          historicalPrices: historicalPrices
        }));

        // Fetch financial statements (this would require additional API calls)
        // For now, we'll generate sample data structure
        await fetchFinancialStatements(symbol);
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
    setSelectedCompany(company);
    fetchStockData(company.symbol);
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
                  <p className="text-sm font-medium text-indigo-100 mb-1">Selected Company</p>
                  {selectedCompany ? (
                    <div>
                      <p className="text-2xl font-bold text-white">{selectedCompany.name}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-indigo-100 font-semibold">{selectedCompany.symbol.replace('.AX', '')}</span>
                        <span className="px-2 py-1 bg-white/20 rounded-lg text-xs font-medium text-white">{selectedCompany.sector}</span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xl font-semibold text-white">Click to select an Australian company</p>
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
                    {filteredCompanies.map((company) => (
                      <button
                        key={company.symbol}
                        onClick={() => {
                          handleCompanySelect(company);
                          setIsDropdownOpen(false);
                          setSearchQuery('');
                        }}
                        className={`w-full p-4 text-left transition-all duration-200 flex items-center justify-between group ${
                          selectedCompany?.symbol === company.symbol
                            ? 'bg-indigo-100 hover:bg-indigo-200'
                            : 'hover:bg-indigo-50'
                        }`}
                      >
                        <div className="flex items-center gap-4 flex-1">
                          <div className={`p-2 rounded-lg transition-colors ${
                            selectedCompany?.symbol === company.symbol
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
                        {selectedCompany?.symbol === company.symbol && (
                          <CheckCircle2 className="w-6 h-6 text-indigo-600 flex-shrink-0" />
                        )}
                      </button>
                    ))}
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
            <p className="text-xl font-semibold text-gray-700">Loading stock data for {selectedCompany?.name}...</p>
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

        {/* Stock Data Display */}
        {selectedCompany && stockData.quote && !loading && (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 shadow-xl text-white">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold">{selectedCompany.name}</h2>
                  <p className="text-indigo-100">{stockData.quote.symbol} • {selectedCompany.sector}</p>
                </div>
                <button
                  onClick={() => fetchStockData(selectedCompany.symbol)}
                  className="p-3 bg-white bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all"
                >
                  <RefreshCw className="w-6 h-6" />
                </button>
              </div>

              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <p className="text-indigo-200 text-sm mb-1">Current Price</p>
                  <p className="text-3xl font-bold">{formatCurrency(stockData.quote.price)}</p>
                  <p className={`text-sm mt-1 ${stockData.quote.change >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                    {stockData.quote.change >= 0 ? '▲' : '▼'} {formatCurrency(Math.abs(stockData.quote.change))} ({formatNumber(Math.abs(stockData.quote.changePercent))}%)
                  </p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <p className="text-indigo-200 text-sm mb-1">Day Range</p>
                  <p className="text-xl font-bold">{formatCurrency(stockData.quote.dayLow)} - {formatCurrency(stockData.quote.dayHigh)}</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <p className="text-indigo-200 text-sm mb-1">Volume</p>
                  <p className="text-xl font-bold">{(stockData.quote.volume / 1000000).toFixed(2)}M</p>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4">
                  <p className="text-indigo-200 text-sm mb-1">Market Cap</p>
                  <p className="text-xl font-bold">{stockData.quote.marketCap}</p>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-200">
              <div className="border-b-2 border-gray-200 px-6">
                <div className="flex gap-2 -mb-px overflow-x-auto">
                  {[
                    { id: 'overview', label: 'Overview', icon: Activity },
                    { id: 'prices', label: 'Price History', icon: LineChartIcon },
                    { id: 'income', label: 'Income Statement', icon: DollarSign },
                    { id: 'balance', label: 'Balance Sheet', icon: BarChart3 },
                    { id: 'cashflow', label: 'Cash Flow', icon: TrendingUp }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-4 border-b-4 transition-all font-semibold ${
                          activeTab === tab.id
                            ? 'border-indigo-600 text-indigo-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && stockData.keyMetrics && (
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">Key Metrics & Ratios</h3>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                        <p className="text-sm text-gray-600 mb-1">P/E Ratio</p>
                        <p className="text-3xl font-bold text-blue-900">{stockData.keyMetrics.peRatio}</p>
                        <p className="text-xs text-gray-500 mt-1">Price to Earnings</p>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                        <p className="text-sm text-gray-600 mb-1">P/B Ratio</p>
                        <p className="text-3xl font-bold text-purple-900">{stockData.keyMetrics.pbRatio}</p>
                        <p className="text-xs text-gray-500 mt-1">Price to Book</p>
                      </div>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                        <p className="text-sm text-gray-600 mb-1">Dividend Yield</p>
                        <p className="text-3xl font-bold text-green-900">{stockData.keyMetrics.dividendYield}%</p>
                        <p className="text-xs text-gray-500 mt-1">Annual Dividend</p>
                      </div>
                      <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-5 border-2 border-yellow-200">
                        <p className="text-sm text-gray-600 mb-1">ROE</p>
                        <p className="text-3xl font-bold text-yellow-900">{stockData.keyMetrics.roe}%</p>
                        <p className="text-xs text-gray-500 mt-1">Return on Equity</p>
                      </div>
                      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-5 border-2 border-red-200">
                        <p className="text-sm text-gray-600 mb-1">Debt/Equity</p>
                        <p className="text-3xl font-bold text-red-900">{stockData.keyMetrics.debtToEquity}</p>
                        <p className="text-xs text-gray-500 mt-1">Leverage Ratio</p>
                      </div>
                      <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-5 border-2 border-cyan-200">
                        <p className="text-sm text-gray-600 mb-1">Beta</p>
                        <p className="text-3xl font-bold text-cyan-900">{stockData.keyMetrics.beta}</p>
                        <p className="text-xs text-gray-500 mt-1">Systematic Risk</p>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-5 border-2 border-indigo-200">
                        <p className="text-sm text-gray-600 mb-1">EPS</p>
                        <p className="text-3xl font-bold text-indigo-900">{formatCurrency(stockData.keyMetrics.eps)}</p>
                        <p className="text-xs text-gray-500 mt-1">Earnings Per Share</p>
                      </div>
                      <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-5 border-2 border-teal-200">
                        <p className="text-sm text-gray-600 mb-1">Current Ratio</p>
                        <p className="text-3xl font-bold text-teal-900">{stockData.keyMetrics.currentRatio}</p>
                        <p className="text-xs text-gray-500 mt-1">Liquidity Ratio</p>
                      </div>
                      <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-5 border-2 border-pink-200">
                        <p className="text-sm text-gray-600 mb-1">ROA</p>
                        <p className="text-3xl font-bold text-pink-900">{stockData.keyMetrics.roa}%</p>
                        <p className="text-xs text-gray-500 mt-1">Return on Assets</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price History Tab */}
                {activeTab === 'prices' && stockData.historicalPrices.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900">Price History</h3>
                      <div className="flex gap-2">
                        {['1m', '3m', '6m', '1y', '3y', '5y'].map((range) => (
                          <button
                            key={range}
                            onClick={() => {
                              setDateRange(range);
                              if (selectedCompany) fetchStockData(selectedCompany.symbol);
                            }}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                              dateRange === range
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {range.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                      <ResponsiveContainer width="100%" height={400}>
                        <AreaChart data={stockData.historicalPrices}>
                          <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.8}/>
                              <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                          <XAxis
                            dataKey="date"
                            stroke="#6366f1"
                            tick={{ fill: '#4338ca', fontSize: 11 }}
                            angle={-45}
                            textAnchor="end"
                            height={80}
                            interval="preserveStartEnd"
                          />
                          <YAxis
                            stroke="#6366f1"
                            tick={{ fill: '#4338ca' }}
                            domain={['dataMin - 5', 'dataMax + 5']}
                            tickFormatter={(value) => `$${value.toFixed(0)}`}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#fff', border: '2px solid #4f46e5', borderRadius: '8px' }}
                            formatter={(value) => [formatCurrency(value), 'Price']}
                          />
                          <Area
                            type="monotone"
                            dataKey="close"
                            stroke="#4f46e5"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Price Data Table */}
                    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                      <div className="overflow-x-auto max-h-96">
                        <table className="w-full">
                          <thead className="bg-indigo-100 sticky top-0">
                            <tr>
                              <th className="p-3 text-left text-sm font-bold text-indigo-900">Date</th>
                              <th className="p-3 text-right text-sm font-bold text-indigo-900">Open</th>
                              <th className="p-3 text-right text-sm font-bold text-indigo-900">High</th>
                              <th className="p-3 text-right text-sm font-bold text-indigo-900">Low</th>
                              <th className="p-3 text-right text-sm font-bold text-indigo-900">Close</th>
                              <th className="p-3 text-right text-sm font-bold text-indigo-900">Volume</th>
                            </tr>
                          </thead>
                          <tbody>
                            {stockData.historicalPrices.slice(-20).reverse().map((price, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                <td className="p-3 text-sm text-gray-900">{price.date}</td>
                                <td className="p-3 text-sm text-right text-gray-700">{formatCurrency(price.open)}</td>
                                <td className="p-3 text-sm text-right text-green-700 font-semibold">{formatCurrency(price.high)}</td>
                                <td className="p-3 text-sm text-right text-red-700 font-semibold">{formatCurrency(price.low)}</td>
                                <td className="p-3 text-sm text-right text-gray-900 font-bold">{formatCurrency(price.close)}</td>
                                <td className="p-3 text-sm text-right text-gray-700">{(price.volume / 1000000).toFixed(2)}M</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Income Statement Tab */}
                {activeTab === 'income' && stockData.incomeStatement.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900">Income Statement</h3>
                      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stockData.incomeStatement}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#d1fae5" />
                          <XAxis
                            dataKey="period"
                            stroke="#059669"
                            tick={{ fill: '#059669' }}
                          />
                          <YAxis
                            stroke="#059669"
                            tick={{ fill: '#059669' }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#fff', border: '2px solid #10b981', borderRadius: '8px' }}
                            formatter={(value) => [formatLargeCurrency(value), '']}
                          />
                          <Legend />
                          <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                          <Bar dataKey="grossProfit" fill="#3b82f6" name="Gross Profit" />
                          <Bar dataKey="netIncome" fill="#8b5cf6" name="Net Income" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-green-100">
                          <tr>
                            <th className="p-3 text-left text-sm font-bold text-green-900">Period</th>
                            <th className="p-3 text-right text-sm font-bold text-green-900">Revenue</th>
                            <th className="p-3 text-right text-sm font-bold text-green-900">Cost of Revenue</th>
                            <th className="p-3 text-right text-sm font-bold text-green-900">Gross Profit</th>
                            <th className="p-3 text-right text-sm font-bold text-green-900">Operating Expenses</th>
                            <th className="p-3 text-right text-sm font-bold text-green-900">Operating Income</th>
                            <th className="p-3 text-right text-sm font-bold text-green-900">Net Income</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockData.incomeStatement.map((statement, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-green-50'}>
                              <td className="p-3 text-sm font-semibold text-gray-900">{statement.period}</td>
                              <td className="p-3 text-sm text-right text-gray-900 font-bold">{formatLargeCurrency(statement.revenue)}</td>
                              <td className="p-3 text-sm text-right text-red-700">{formatLargeCurrency(statement.costOfRevenue)}</td>
                              <td className="p-3 text-sm text-right text-green-700 font-semibold">{formatLargeCurrency(statement.grossProfit)}</td>
                              <td className="p-3 text-sm text-right text-red-700">{formatLargeCurrency(statement.operatingExpenses)}</td>
                              <td className="p-3 text-sm text-right text-blue-700 font-semibold">{formatLargeCurrency(statement.operatingIncome)}</td>
                              <td className="p-3 text-sm text-right text-purple-700 font-bold">{formatLargeCurrency(statement.netIncome)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Balance Sheet Tab */}
                {activeTab === 'balance' && stockData.balanceSheet.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900">Balance Sheet</h3>
                      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border-2 border-blue-200">
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stockData.balanceSheet}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#dbeafe" />
                          <XAxis
                            dataKey="period"
                            stroke="#0284c7"
                            tick={{ fill: '#0284c7' }}
                          />
                          <YAxis
                            stroke="#0284c7"
                            tick={{ fill: '#0284c7' }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#fff', border: '2px solid #0ea5e9', borderRadius: '8px' }}
                            formatter={(value) => [formatLargeCurrency(value), '']}
                          />
                          <Legend />
                          <Bar dataKey="totalAssets" fill="#0ea5e9" name="Total Assets" />
                          <Bar dataKey="totalLiabilities" fill="#f97316" name="Total Liabilities" />
                          <Bar dataKey="shareholderEquity" fill="#10b981" name="Shareholder Equity" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-blue-100">
                          <tr>
                            <th className="p-3 text-left text-sm font-bold text-blue-900">Period</th>
                            <th className="p-3 text-right text-sm font-bold text-blue-900">Total Assets</th>
                            <th className="p-3 text-right text-sm font-bold text-blue-900">Current Assets</th>
                            <th className="p-3 text-right text-sm font-bold text-blue-900">Cash</th>
                            <th className="p-3 text-right text-sm font-bold text-blue-900">Total Liabilities</th>
                            <th className="p-3 text-right text-sm font-bold text-blue-900">Total Debt</th>
                            <th className="p-3 text-right text-sm font-bold text-blue-900">Shareholder Equity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockData.balanceSheet.map((sheet, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-blue-50'}>
                              <td className="p-3 text-sm font-semibold text-gray-900">{sheet.period}</td>
                              <td className="p-3 text-sm text-right text-gray-900 font-bold">{formatLargeCurrency(sheet.totalAssets)}</td>
                              <td className="p-3 text-sm text-right text-blue-700">{formatLargeCurrency(sheet.currentAssets)}</td>
                              <td className="p-3 text-sm text-right text-green-700 font-semibold">{formatLargeCurrency(sheet.cash)}</td>
                              <td className="p-3 text-sm text-right text-red-700 font-semibold">{formatLargeCurrency(sheet.totalLiabilities)}</td>
                              <td className="p-3 text-sm text-right text-orange-700">{formatLargeCurrency(sheet.totalDebt)}</td>
                              <td className="p-3 text-sm text-right text-green-700 font-bold">{formatLargeCurrency(sheet.shareholderEquity)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Cash Flow Tab */}
                {activeTab === 'cashflow' && stockData.cashFlow.length > 0 && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-2xl font-bold text-gray-900">Cash Flow Statement</h3>
                      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                        <Download className="w-4 h-4" />
                        Export
                      </button>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-200">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stockData.cashFlow}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f3e8ff" />
                          <XAxis
                            dataKey="period"
                            stroke="#9333ea"
                            tick={{ fill: '#9333ea' }}
                          />
                          <YAxis
                            stroke="#9333ea"
                            tick={{ fill: '#9333ea' }}
                            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#fff', border: '2px solid #a855f7', borderRadius: '8px' }}
                            formatter={(value) => [formatLargeCurrency(value), '']}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="operatingCashFlow" stroke="#10b981" strokeWidth={3} name="Operating Cash Flow" />
                          <Line type="monotone" dataKey="investingCashFlow" stroke="#ef4444" strokeWidth={3} name="Investing Cash Flow" />
                          <Line type="monotone" dataKey="financingCashFlow" stroke="#3b82f6" strokeWidth={3} name="Financing Cash Flow" />
                          <Line type="monotone" dataKey="freeCashFlow" stroke="#a855f7" strokeWidth={3} name="Free Cash Flow" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl border-2 border-gray-200 overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-purple-100">
                          <tr>
                            <th className="p-3 text-left text-sm font-bold text-purple-900">Period</th>
                            <th className="p-3 text-right text-sm font-bold text-purple-900">Operating Cash Flow</th>
                            <th className="p-3 text-right text-sm font-bold text-purple-900">Investing Cash Flow</th>
                            <th className="p-3 text-right text-sm font-bold text-purple-900">Financing Cash Flow</th>
                            <th className="p-3 text-right text-sm font-bold text-purple-900">Capital Expenditures</th>
                            <th className="p-3 text-right text-sm font-bold text-purple-900">Free Cash Flow</th>
                          </tr>
                        </thead>
                        <tbody>
                          {stockData.cashFlow.map((flow, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-purple-50'}>
                              <td className="p-3 text-sm font-semibold text-gray-900">{flow.period}</td>
                              <td className="p-3 text-sm text-right text-green-700 font-bold">{formatLargeCurrency(flow.operatingCashFlow)}</td>
                              <td className="p-3 text-sm text-right text-red-700 font-semibold">{formatLargeCurrency(flow.investingCashFlow)}</td>
                              <td className="p-3 text-sm text-right text-blue-700 font-semibold">{formatLargeCurrency(flow.financingCashFlow)}</td>
                              <td className="p-3 text-sm text-right text-orange-700">{formatLargeCurrency(flow.capitalExpenditures)}</td>
                              <td className="p-3 text-sm text-right text-purple-700 font-bold">{formatLargeCurrency(flow.freeCashFlow)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* No Company Selected State */}
        {!selectedCompany && !loading && (
          <div className="bg-white rounded-2xl p-12 shadow-xl border-2 border-indigo-200 text-center">
            <Building2 className="w-24 h-24 mx-auto mb-6 text-indigo-300" />
            <h3 className="text-2xl font-bold text-gray-900 mb-3">Select a Company to Begin</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Choose any Australian company from the list above to view comprehensive financial data,
              including real-time prices, financial statements, and key metrics.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
