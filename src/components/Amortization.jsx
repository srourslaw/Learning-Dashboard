import React, { useState, useMemo, useCallback } from 'react';
import {
  Table, Download, Save, FolderOpen, Calculator, TrendingDown, DollarSign,
  Calendar, Percent, ChevronDown, ChevronUp, Info, BarChart3, PieChart,
  HelpCircle, X, Plus, Trash2, CheckCircle, AlertCircle, Clock, Home, Car
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';

// ═══════════════════════════════════════════════════════════════════
// CALCULATION FUNCTIONS
// ═══════════════════════════════════════════════════════════════════

/**
 * Calculate periodic payment amount (PMT formula)
 * @param {number} principal - Loan amount
 * @param {number} annualRate - Annual interest rate (as decimal, e.g., 0.06 for 6%)
 * @param {number} termYears - Loan term in years
 * @param {number} paymentsPerYear - Payment frequency (12 for monthly, 26 for bi-weekly, etc.)
 * @returns {number} Periodic payment amount
 */
function calculateMonthlyPayment(principal, annualRate, termYears, paymentsPerYear) {
  if (annualRate === 0) {
    return principal / (termYears * paymentsPerYear);
  }

  const periodicRate = annualRate / paymentsPerYear;
  const totalPayments = termYears * paymentsPerYear;

  const payment = principal * (periodicRate * Math.pow(1 + periodicRate, totalPayments)) /
                  (Math.pow(1 + periodicRate, totalPayments) - 1);

  return payment;
}

/**
 * Generate complete amortization schedule
 * @param {Object} params - Loan parameters
 * @returns {Array} Array of payment objects
 */
function generateAmortizationSchedule(params) {
  const {
    principal,
    annualRate,
    termYears,
    paymentsPerYear,
    startDate,
    extraPayment = 0,
    extraPaymentFrequency = 'none',
    offsetEnabled = false,
    initialOffsetBalance = 0,
    monthlyOffsetContribution = 0,
    rateChanges = []
  } = params;

  // Sort rate changes by date
  const sortedRateChanges = [...rateChanges].sort((a, b) =>
    new Date(a.date) - new Date(b.date)
  );

  let currentRate = annualRate;
  let periodicRate = annualRate / paymentsPerYear;
  const scheduledPayment = calculateMonthlyPayment(principal, annualRate, termYears, paymentsPerYear);
  const schedule = [];

  let remainingBalance = principal;
  let offsetBalance = initialOffsetBalance;
  let paymentNumber = 0;
  let currentDate = new Date(startDate);
  let cumulativeInterest = 0;
  let cumulativePrincipal = 0;
  let cumulativeInterestSaved = 0;
  let nextRateChangeIndex = 0;

  // Calculate payment interval in days based on frequency
  const getDaysToAdd = (frequency) => {
    switch (frequency) {
      case 12: return 30.4167; // Monthly (365.25/12)
      case 26: return 14; // Bi-weekly
      case 52: return 7; // Weekly
      case 4: return 91.3125; // Quarterly (365.25/4)
      case 2: return 182.625; // Semi-annually (365.25/2)
      case 1: return 365.25; // Annually
      default: return 30.4167;
    }
  };

  const daysToAdd = getDaysToAdd(paymentsPerYear);

  while (remainingBalance > 0.01 && paymentNumber < termYears * paymentsPerYear + 100) {
    paymentNumber++;

    // Check if there's a rate change for this payment
    let rateChanged = false;
    if (nextRateChangeIndex < sortedRateChanges.length) {
      const nextRateChange = sortedRateChanges[nextRateChangeIndex];
      if (new Date(nextRateChange.date) <= currentDate) {
        currentRate = nextRateChange.rate / 100;
        periodicRate = currentRate / paymentsPerYear;
        nextRateChangeIndex++;
        rateChanged = true;
      }
    }

    // Calculate interest for this period
    const effectiveBalance = offsetEnabled ? Math.max(0, remainingBalance - offsetBalance) : remainingBalance;
    const interestPayment = effectiveBalance * periodicRate;
    const standardInterest = remainingBalance * periodicRate;
    const interestSaved = standardInterest - interestPayment;

    // Determine if extra payment applies this period
    let extraPaymentAmount = 0;
    if (extraPaymentFrequency === 'everyPayment') {
      extraPaymentAmount = extraPayment;
    } else if (extraPaymentFrequency === 'monthly' && paymentNumber % Math.ceil(paymentsPerYear / 12) === 0) {
      extraPaymentAmount = extraPayment;
    } else if (extraPaymentFrequency === 'annually' && paymentNumber % paymentsPerYear === 0) {
      extraPaymentAmount = extraPayment;
    }

    // Calculate principal payment
    const principalFromScheduled = Math.min(scheduledPayment - interestPayment, remainingBalance);
    const totalPrincipal = Math.min(principalFromScheduled + extraPaymentAmount, remainingBalance);
    const actualPayment = interestPayment + totalPrincipal;

    // Update balances
    remainingBalance -= totalPrincipal;
    if (remainingBalance < 0) remainingBalance = 0;

    // Update offset balance
    if (offsetEnabled) {
      offsetBalance += monthlyOffsetContribution * (paymentsPerYear / 12);
    }

    // Update cumulative totals
    cumulativeInterest += interestPayment;
    cumulativePrincipal += totalPrincipal;
    cumulativeInterestSaved += interestSaved;

    // Add to schedule
    schedule.push({
      paymentNumber,
      date: new Date(currentDate),
      scheduledPayment,
      extraPayment: extraPaymentAmount,
      interestPayment,
      principalPayment: totalPrincipal,
      remainingBalance,
      interestRate: currentRate * 100,
      offsetBalance: offsetEnabled ? offsetBalance : 0,
      netInterest: interestPayment,
      interestSaved,
      cumulativeInterest,
      cumulativePrincipal,
      cumulativeInterestSaved,
      effectiveBalance,
      rateChanged
    });

    // Move to next payment date
    currentDate = new Date(currentDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

    // Safety check
    if (remainingBalance <= 0.01) break;
  }

  return schedule;
}

export default function Amortization() {
  // ═══════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════

  const [loanParams, setLoanParams] = useState({
    principal: 500000,
    annualRate: 6.0,
    termYears: 30,
    paymentsPerYear: 12,
    startDate: new Date().toISOString().split('T')[0],
    loanType: 'fixed'
  });

  const [rateChanges, setRateChanges] = useState([]);

  const [extraPayments, setExtraPayments] = useState({
    enabled: false,
    amount: 500,
    frequency: 'everyPayment',
    startDate: new Date().toISOString().split('T')[0]
  });

  const [offsetAccount, setOffsetAccount] = useState({
    enabled: false,
    initialBalance: 50000,
    monthlyContribution: 1000
  });

  const [showCalculation, setShowCalculation] = useState(null);
  const [showFormulas, setShowFormulas] = useState(false);
  const [showEducation, setShowEducation] = useState({});
  const [activeChart, setActiveChart] = useState('composition');

  // ═══════════════════════════════════════════════════════════════════
  // CALCULATED VALUES
  // ═══════════════════════════════════════════════════════════════════

  const schedule = useMemo(() => {
    return generateAmortizationSchedule({
      ...loanParams,
      annualRate: loanParams.annualRate / 100,
      extraPayment: extraPayments.enabled ? extraPayments.amount : 0,
      extraPaymentFrequency: extraPayments.enabled ? extraPayments.frequency : 'none',
      offsetEnabled: offsetAccount.enabled,
      initialOffsetBalance: offsetAccount.initialBalance,
      monthlyOffsetContribution: offsetAccount.monthlyContribution,
      rateChanges: loanParams.loanType === 'variable' ? rateChanges : []
    });
  }, [loanParams, extraPayments, offsetAccount, rateChanges]);

  const baselineSchedule = useMemo(() => {
    return generateAmortizationSchedule({
      ...loanParams,
      annualRate: loanParams.annualRate / 100,
      extraPayment: 0,
      extraPaymentFrequency: 'none',
      offsetEnabled: false,
      initialOffsetBalance: 0,
      monthlyOffsetContribution: 0
    });
  }, [loanParams]);

  const summaryMetrics = useMemo(() => {
    if (!schedule || schedule.length === 0) return null;

    const totalInterest = schedule[schedule.length - 1]?.cumulativeInterest || 0;
    const totalPrincipal = loanParams.principal;
    const baselineInterest = baselineSchedule[baselineSchedule.length - 1]?.cumulativeInterest || 0;
    const interestSaved = baselineInterest - totalInterest;
    const paymentsSaved = baselineSchedule.length - schedule.length;
    const finalDate = schedule[schedule.length - 1]?.date;

    return {
      totalInterest,
      totalPaid: totalInterest + totalPrincipal,
      baselineInterest,
      interestSaved,
      paymentsSaved,
      percentageSaved: (interestSaved / baselineInterest) * 100,
      finalPaymentDate: finalDate,
      numberOfPayments: schedule.length,
      scheduledPayment: schedule[0]?.scheduledPayment || 0
    };
  }, [schedule, baselineSchedule, loanParams.principal]);

  // ═══════════════════════════════════════════════════════════════════
  // PRESET FUNCTIONS
  // ═══════════════════════════════════════════════════════════════════

  const applyPreset = (preset) => {
    const presets = {
      firstHome: {
        principal: 500000,
        annualRate: 6.0,
        termYears: 30,
        paymentsPerYear: 12
      },
      investment: {
        principal: 800000,
        annualRate: 5.5,
        termYears: 25,
        paymentsPerYear: 12
      },
      carLoan: {
        principal: 30000,
        annualRate: 7.0,
        termYears: 5,
        paymentsPerYear: 12
      }
    };

    if (presets[preset]) {
      setLoanParams({ ...loanParams, ...presets[preset] });
    }
  };

  // ═══════════════════════════════════════════════════════════════════
  // CHART DATA
  // ═══════════════════════════════════════════════════════════════════

  const compositionChartData = useMemo(() => {
    const step = Math.ceil(schedule.length / 60); // ~60 data points
    return schedule.filter((_, i) => i % step === 0).map(payment => {
      const yearMonth = `${payment.date.getFullYear()}-${String(payment.date.getMonth() + 1).padStart(2, '0')}`;
      return {
        date: yearMonth,
        year: Math.floor(payment.paymentNumber / loanParams.paymentsPerYear),
        Principal: payment.principalPayment,
        Interest: payment.interestPayment
      };
    });
  }, [schedule, loanParams.paymentsPerYear]);

  const balanceOverTimeData = useMemo(() => {
    const step = Math.ceil(schedule.length / 60);
    return schedule.filter((_, i) => i % step === 0).map(payment => {
      const yearMonth = `${payment.date.getFullYear()}-${String(payment.date.getMonth() + 1).padStart(2, '0')}`;
      return {
        date: yearMonth,
        year: Math.floor(payment.paymentNumber / loanParams.paymentsPerYear),
        Balance: payment.remainingBalance,
        Offset: payment.offsetBalance
      };
    });
  }, [schedule, loanParams.paymentsPerYear]);

  const cumulativeChartData = useMemo(() => {
    const step = Math.ceil(schedule.length / 60);
    return schedule.filter((_, i) => i % step === 0).map(payment => {
      const yearMonth = `${payment.date.getFullYear()}-${String(payment.date.getMonth() + 1).padStart(2, '0')}`;
      return {
        date: yearMonth,
        year: Math.floor(payment.paymentNumber / loanParams.paymentsPerYear),
        'Total Interest': payment.cumulativeInterest,
        'Total Principal': payment.cumulativePrincipal,
        'Interest Saved': payment.cumulativeInterestSaved
      };
    });
  }, [schedule, loanParams.paymentsPerYear]);

  const savingsComparisonData = useMemo(() => {
    const baselineTotal = baselineSchedule[baselineSchedule.length - 1]?.cumulativeInterest || 0;
    const actualTotal = schedule[schedule.length - 1]?.cumulativeInterest || 0;

    return [
      {
        scenario: 'Standard',
        interest: baselineTotal,
        fill: '#EF4444'
      },
      {
        scenario: 'With Extras/Offset',
        interest: actualTotal,
        fill: '#10B981'
      }
    ];
  }, [schedule, baselineSchedule]);

  const compoundingFrequencyData = useMemo(() => {
    // Compare different payment frequencies
    const frequencies = [
      { label: 'Monthly (12)', value: 12 },
      { label: 'Bi-Weekly (26)', value: 26 },
      { label: 'Weekly (52)', value: 52 }
    ];

    return frequencies.map(freq => {
      const tempSchedule = generateAmortizationSchedule({
        ...loanParams,
        annualRate: loanParams.annualRate / 100,
        paymentsPerYear: freq.value,
        extraPayment: 0,
        extraPaymentFrequency: 'none',
        offsetEnabled: false,
        initialOffsetBalance: 0,
        monthlyOffsetContribution: 0,
        rateChanges: []
      });

      const totalInterest = tempSchedule[tempSchedule.length - 1]?.cumulativeInterest || 0;
      const payment = calculateMonthlyPayment(
        loanParams.principal,
        loanParams.annualRate / 100,
        loanParams.termYears,
        freq.value
      );

      return {
        frequency: freq.label,
        'Total Interest': totalInterest,
        'Payment Amount': payment,
        'Total Payments': tempSchedule.length
      };
    });
  }, [loanParams]);

  // ═══════════════════════════════════════════════════════════════════
  // RENDER: INPUT FORM
  // ═══════════════════════════════════════════════════════════════════

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Title */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur">
            <Table className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Amortization Calculator</h1>
            <p className="text-emerald-100">Comprehensive loan analysis with offset accounts and extra payments</p>
          </div>
        </div>
      </div>

      {/* Preset Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => applyPreset('firstHome')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg transition-colors border border-blue-200"
        >
          <Home className="w-4 h-4" />
          First Home ($500k, 6%, 30yr)
        </button>
        <button
          onClick={() => applyPreset('investment')}
          className="flex items-center gap-2 px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg transition-colors border border-purple-200"
        >
          <TrendingDown className="w-4 h-4" />
          Investment ($800k, 5.5%, 25yr)
        </button>
        <button
          onClick={() => applyPreset('carLoan')}
          className="flex items-center gap-2 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-lg transition-colors border border-orange-200"
        >
          <Car className="w-4 h-4" />
          Car Loan ($30k, 7%, 5yr)
        </button>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600" />
          Loan Details
        </h2>

        <div className="grid md:grid-cols-3 gap-4">
          {/* Principal Amount */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Principal Amount
            </label>
            <div className="relative">
              <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
              <input
                type="number"
                value={loanParams.principal}
                onChange={(e) => setLoanParams({ ...loanParams, principal: parseFloat(e.target.value) || 0 })}
                className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="500000"
              />
            </div>
          </div>

          {/* Annual Interest Rate */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Annual Interest Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              value={loanParams.annualRate}
              onChange={(e) => setLoanParams({ ...loanParams, annualRate: parseFloat(e.target.value) || 0 })}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="6.0"
            />
          </div>

          {/* Loan Term */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Loan Term (Years)
            </label>
            <input
              type="number"
              value={loanParams.termYears}
              onChange={(e) => setLoanParams({ ...loanParams, termYears: parseInt(e.target.value) || 0 })}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="30"
            />
          </div>

          {/* Payment Frequency */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Payment Frequency
            </label>
            <select
              value={loanParams.paymentsPerYear}
              onChange={(e) => setLoanParams({ ...loanParams, paymentsPerYear: parseInt(e.target.value) })}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value={12}>Monthly</option>
              <option value={26}>Bi-weekly</option>
              <option value={52}>Weekly</option>
              <option value={4}>Quarterly</option>
              <option value={2}>Semi-annually</option>
              <option value={1}>Annually</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={loanParams.startDate}
              onChange={(e) => setLoanParams({ ...loanParams, startDate: e.target.value })}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>

          {/* Loan Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Loan Type
            </label>
            <select
              value={loanParams.loanType}
              onChange={(e) => setLoanParams({ ...loanParams, loanType: e.target.value })}
              className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="fixed">Fixed Rate</option>
              <option value="variable">Variable Rate</option>
            </select>
          </div>
        </div>

        {/* Variable Rate Changes Section */}
        {loanParams.loanType === 'variable' && (
          <div className="mt-8 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Percent className="w-5 h-5 text-yellow-600" />
                Interest Rate Changes
              </h3>
              <button
                onClick={() => setRateChanges([...rateChanges, { date: '', rate: loanParams.annualRate }])}
                className="flex items-center gap-2 px-3 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-semibold"
              >
                <Plus className="w-4 h-4" />
                Add Rate Change
              </button>
            </div>

            <div className="space-y-3">
              {rateChanges.map((rateChange, index) => (
                <div key={index} className="flex items-center gap-3 bg-white p-3 rounded-lg">
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      Change Date
                    </label>
                    <input
                      type="date"
                      value={rateChange.date}
                      onChange={(e) => {
                        const updated = [...rateChanges];
                        updated[index].date = e.target.value;
                        setRateChanges(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      New Rate (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={rateChange.rate}
                      onChange={(e) => {
                        const updated = [...rateChanges];
                        updated[index].rate = parseFloat(e.target.value) || 0;
                        setRateChanges(updated);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                  <button
                    onClick={() => setRateChanges(rateChanges.filter((_, i) => i !== index))}
                    className="mt-5 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Remove"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))}

              {rateChanges.length === 0 && (
                <div className="text-center py-6">
                  <Percent className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No rate changes scheduled</p>
                  <p className="text-gray-400 text-xs mt-1">Click "Add Rate Change" to schedule future rate changes</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Extra Payments and Offset Account Section */}
        <div className="mt-6 grid md:grid-cols-2 gap-4">
          {/* Extra Payments Section */}
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-blue-600" />
                Extra Payments
              </h3>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={extraPayments.enabled}
                  onChange={(e) => setExtraPayments({ ...extraPayments, enabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-gray-700">Enable</span>
              </label>
            </div>

            {extraPayments.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Amount
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={extraPayments.amount}
                      onChange={(e) => setExtraPayments({ ...extraPayments, amount: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Frequency
                  </label>
                  <select
                    value={extraPayments.frequency}
                    onChange={(e) => setExtraPayments({ ...extraPayments, frequency: e.target.value })}
                    className="w-full px-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="everyPayment">Every Payment</option>
                    <option value="monthly">Monthly</option>
                    <option value="annually">Annually</option>
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Offset Account Section */}
          <div className="p-4 bg-green-50 rounded-xl border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-green-600" />
                Offset Account
                <button
                  className="text-green-600 hover:text-green-700"
                  title="An offset account reduces interest by offsetting savings against loan balance"
                >
                  <Info className="w-3 h-3" />
                </button>
              </h3>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={offsetAccount.enabled}
                  onChange={(e) => setOffsetAccount({ ...offsetAccount, enabled: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded focus:ring-2 focus:ring-emerald-500"
                />
                <span className="text-xs font-semibold text-gray-700">Enable</span>
              </label>
            </div>

            {offsetAccount.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Initial Balance
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={offsetAccount.initialBalance}
                      onChange={(e) => setOffsetAccount({ ...offsetAccount, initialBalance: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="50000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Monthly Contribution
                  </label>
                  <div className="relative">
                    <span className="absolute left-2 top-2 text-gray-500 text-sm">$</span>
                    <input
                      type="number"
                      value={offsetAccount.monthlyContribution}
                      onChange={(e) => setOffsetAccount({ ...offsetAccount, monthlyContribution: parseFloat(e.target.value) || 0 })}
                      className="w-full pl-6 pr-2 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Summary Dashboard */}
      {summaryMetrics && (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Loan Overview Card */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Calculator className="w-4 h-4" />
              <h3 className="text-xs font-semibold opacity-90">Loan Overview</h3>
            </div>
            <p className="text-2xl font-bold mb-0.5">${summaryMetrics.totalPaid.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            <p className="text-xs opacity-80">Total Amount Paid</p>
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-xs">Interest: ${summaryMetrics.totalInterest.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            </div>
          </div>

          {/* Savings Analysis Card */}
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-4 text-white">
            <div className="flex items-center gap-1.5 mb-1.5">
              <TrendingDown className="w-4 h-4" />
              <h3 className="text-xs font-semibold opacity-90">Savings Analysis</h3>
            </div>
            <p className="text-2xl font-bold mb-0.5">${summaryMetrics.interestSaved.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
            <p className="text-xs opacity-80">Interest Saved</p>
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-xs">{summaryMetrics.paymentsSaved} payments saved</p>
            </div>
          </div>

          {/* Payment Breakdown Card */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-4 text-white">
            <div className="flex items-center gap-1.5 mb-1.5">
              <DollarSign className="w-4 h-4" />
              <h3 className="text-xs font-semibold opacity-90">Payment Details</h3>
            </div>
            <p className="text-2xl font-bold mb-0.5">${summaryMetrics.scheduledPayment.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            <p className="text-xs opacity-80">Per Payment</p>
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-xs">{summaryMetrics.numberOfPayments} total payments</p>
            </div>
          </div>

          {/* Final Date Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-4 text-white">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Calendar className="w-4 h-4" />
              <h3 className="text-xs font-semibold opacity-90">Payoff Date</h3>
            </div>
            <p className="text-xl font-bold mb-0.5">
              {summaryMetrics.finalPaymentDate?.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </p>
            <p className="text-xs opacity-80">Loan Paid Off</p>
            <div className="mt-2 pt-2 border-t border-white/20">
              <p className="text-xs">{Math.round(summaryMetrics.numberOfPayments / loanParams.paymentsPerYear * 10) / 10} years</p>
            </div>
          </div>
        </div>
      )}

      {/* Visualization Section */}
      <div className="bg-white rounded-2xl shadow-xl p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-emerald-600" />
          Visual Analysis
        </h2>

        {/* Chart Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button
            onClick={() => setActiveChart('composition')}
            className={`px-3 py-1.5 text-sm rounded-lg font-semibold transition-colors ${
              activeChart === 'composition'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Principal vs Interest
          </button>
          <button
            onClick={() => setActiveChart('balance')}
            className={`px-3 py-1.5 text-sm rounded-lg font-semibold transition-colors ${
              activeChart === 'balance'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Remaining Balance
          </button>
          <button
            onClick={() => setActiveChart('cumulative')}
            className={`px-3 py-1.5 text-sm rounded-lg font-semibold transition-colors ${
              activeChart === 'cumulative'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Cumulative Totals
          </button>
          <button
            onClick={() => setActiveChart('savings')}
            className={`px-3 py-1.5 text-sm rounded-lg font-semibold transition-colors ${
              activeChart === 'savings'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Interest Comparison
          </button>
          <button
            onClick={() => setActiveChart('compounding')}
            className={`px-3 py-1.5 text-sm rounded-lg font-semibold transition-colors ${
              activeChart === 'compounding'
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Compounding Frequency
          </button>
        </div>

        {/* Payment Composition Chart */}
        {activeChart === 'composition' && (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              See how your monthly payment is split between principal and interest over the life of the loan
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={compositionChartData}>
                <defs>
                  <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  </linearGradient>
                  <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0.3}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="year"
                  label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Principal" stackId="1" stroke="#3B82F6" fill="url(#colorPrincipal)" strokeWidth={2} />
                <Area type="monotone" dataKey="Interest" stackId="1" stroke="#EF4444" fill="url(#colorInterest)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-2 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded"></div>
                <span className="text-gray-600">Principal: Reduces your loan balance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded"></div>
                <span className="text-gray-600">Interest: Cost of borrowing</span>
              </div>
            </div>
          </div>
        )}

        {/* Balance Over Time Chart */}
        {activeChart === 'balance' && (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Track how your loan balance decreases over time {offsetAccount.enabled && 'compared to your offset account growth'}
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={balanceOverTimeData}>
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="year"
                  label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  label={{ value: 'Balance ($)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Area type="monotone" dataKey="Balance" stroke="#8B5CF6" fill="url(#balanceGradient)" strokeWidth={3} name="Loan Balance" />
                {offsetAccount.enabled && (
                  <Line type="monotone" dataKey="Offset" stroke="#10B981" strokeWidth={2} name="Offset Account" strokeDasharray="5 5" />
                )}
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-3 text-xs text-gray-600 bg-purple-50 p-3 rounded-lg">
              💡 The steeper the decline, the faster you're paying off your loan
            </div>
          </div>
        )}

        {/* Cumulative Totals Chart */}
        {activeChart === 'cumulative' && (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Watch your total interest and principal payments accumulate over time
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={cumulativeChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="year"
                  label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  label={{ value: 'Cumulative Amount ($)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Total Interest" stroke="#EF4444" strokeWidth={2} />
                <Line type="monotone" dataKey="Total Principal" stroke="#3B82F6" strokeWidth={2} />
                {(extraPayments.enabled || offsetAccount.enabled) && (
                  <Line type="monotone" dataKey="Interest Saved" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Interest Comparison Bar Chart */}
        {activeChart === 'savings' && (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              Compare total interest paid with and without extra payments/offset account
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={savingsComparisonData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  type="number"
                  label={{ value: 'Total Interest Paid ($)', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                />
                <YAxis type="category" dataKey="scenario" tick={{ fontSize: 12 }} width={150} />
                <Tooltip
                  formatter={(value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                />
                <Bar dataKey="interest" radius={[0, 8, 8, 0]}>
                  {savingsComparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-red-700 font-semibold">Standard Loan</p>
                <p className="text-2xl font-bold text-red-600">
                  ${savingsComparisonData[0]?.interest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg">
                <p className="text-green-700 font-semibold">With Extras/Offset</p>
                <p className="text-2xl font-bold text-green-600">
                  ${savingsComparisonData[1]?.interest.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  💰 Save ${(savingsComparisonData[0]?.interest - savingsComparisonData[1]?.interest).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Compounding Frequency Chart */}
        {activeChart === 'compounding' && (
          <div>
            <p className="text-sm text-gray-600 mb-3">
              See how different payment frequencies affect total interest paid and payment amounts
            </p>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={compoundingFrequencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis
                  dataKey="frequency"
                  label={{ value: 'Payment Frequency', position: 'insideBottom', offset: -5 }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="left"
                  label={{ value: 'Total Interest ($)', angle: -90, position: 'insideLeft' }}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: 'Payment Amount ($)', angle: 90, position: 'insideRight' }}
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value.toFixed(0)}`}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === 'Total Payments') return value;
                    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                  }}
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                />
                <Legend />
                <Bar yAxisId="left" dataKey="Total Interest" fill="#EF4444" radius={[8, 8, 0, 0]} />
                <Bar yAxisId="right" dataKey="Payment Amount" fill="#3B82F6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
              {compoundingFrequencyData.map((data, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-50 to-blue-50 p-3 rounded-lg border border-indigo-200">
                  <p className="font-semibold text-indigo-900">{data.frequency}</p>
                  <p className="text-xs text-indigo-700 mt-1">Interest: ${data['Total Interest'].toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                  <p className="text-xs text-indigo-700">Payment: ${data['Payment Amount'].toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
                  <p className="text-xs text-indigo-600 mt-1">{data['Total Payments']} payments</p>
                </div>
              ))}
            </div>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                <strong>Note:</strong> More frequent payments reduce total interest by paying down principal faster,
                but require smaller individual payment amounts more often. The compounding frequency (m) affects
                how interest accrues over time.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Amortization Table */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Table className="w-6 h-6 text-emerald-600" />
            Amortization Schedule
          </h2>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4" />
            Export CSV
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">#</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">Date</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Payment</th>
                {extraPayments.enabled && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Extra</th>
                )}
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Interest</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Principal</th>
                <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Balance</th>
                {loanParams.loanType === 'variable' && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Rate %</th>
                )}
                {offsetAccount.enabled && (
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">Offset</th>
                )}
              </tr>
            </thead>
            <tbody>
              {schedule.slice(0, 100).map((payment, index) => (
                <tr
                  key={index}
                  className={`border-b ${
                    payment.rateChanged
                      ? 'bg-yellow-100 border-yellow-300'
                      : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } hover:bg-emerald-50 transition-colors`}
                >
                  <td className="px-4 py-3 text-sm font-bold text-gray-900">
                    {payment.paymentNumber}
                    {payment.rateChanged && (
                      <span className="ml-1 text-yellow-600" title="Rate Changed">⚠️</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {payment.date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-gray-900">
                    ${payment.scheduledPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  {extraPayments.enabled && (
                    <td className="px-4 py-3 text-sm text-right text-green-600 font-semibold">
                      {payment.extraPayment > 0 ? `$${payment.extraPayment.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-right text-red-600">
                    ${payment.interestPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-right text-blue-600 font-semibold">
                    ${payment.principalPayment.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 text-sm text-right font-bold text-gray-900">
                    ${payment.remainingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  {loanParams.loanType === 'variable' && (
                    <td className={`px-4 py-3 text-sm text-right ${payment.rateChanged ? 'font-bold text-yellow-700' : 'text-gray-600'}`}>
                      {payment.interestRate.toFixed(2)}%
                    </td>
                  )}
                  {offsetAccount.enabled && (
                    <td className="px-4 py-3 text-sm text-right text-green-600">
                      ${payment.offsetBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {schedule.length > 100 && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600">
                Showing first 100 of {schedule.length} payments.
                <button className="ml-2 text-emerald-600 hover:text-emerald-700 font-semibold">
                  Download full schedule
                </button>
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Formulas Reference */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <button
          onClick={() => setShowFormulas(!showFormulas)}
          className="w-full flex items-center justify-between mb-4"
        >
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HelpCircle className="w-6 h-6 text-emerald-600" />
            Formulas & Methodology
          </h2>
          {showFormulas ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
        </button>

        {showFormulas && (
          <div className="space-y-6">
            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Monthly Payment Formula (PMT)</h3>
              <div className="bg-white p-4 rounded-lg font-mono text-sm">
                <p>PMT = P × [r(1+r)^n] / [(1+r)^n - 1]</p>
                <p className="mt-2 text-gray-600">Where:</p>
                <p className="text-gray-600">P = Principal (loan amount)</p>
                <p className="text-gray-600">r = Periodic interest rate (annual rate ÷ payments per year)</p>
                <p className="text-gray-600">n = Total number of payments (years × payments per year)</p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Interest Calculation</h3>
              <div className="bg-white p-4 rounded-lg font-mono text-sm">
                <p>Interest = Remaining Balance × Periodic Interest Rate</p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Principal Calculation</h3>
              <div className="bg-white p-4 rounded-lg font-mono text-sm">
                <p>Principal = Payment - Interest</p>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-bold text-gray-800 mb-3">Offset Account Effect</h3>
              <div className="bg-white p-4 rounded-lg font-mono text-sm">
                <p>Effective Balance = Loan Balance - Offset Balance</p>
                <p className="mt-2">Net Interest = Effective Balance × Periodic Rate</p>
                <p className="mt-2">Interest Saved = (Loan Balance × Rate) - (Effective Balance × Rate)</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Educational Component: How Offset Accounts Work */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-lg p-8 border border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-green-600 rounded-xl">
            <Info className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-800">How Offset Accounts Work</h3>
        </div>
        <p className="text-gray-700 mb-4">
          An offset account is a transaction or savings account linked to your home loan. The balance in your offset account is "offset" against your loan balance, meaning you only pay interest on the difference.
        </p>
        <div className="bg-white p-6 rounded-xl">
          <h4 className="font-bold text-gray-800 mb-2">Example:</h4>
          <p className="text-gray-700">
            If you have a $500,000 loan and $50,000 in your offset account, you only pay interest on $450,000.
          </p>
          <p className="text-green-600 font-semibold mt-2">
            Savings: Interest is only charged on $450,000 instead of $500,000!
          </p>
        </div>
      </div>
    </div>
  );
}
