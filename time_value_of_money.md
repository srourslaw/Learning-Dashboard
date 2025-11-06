import React, { useState } from 'react';
import { Calculator, TrendingUp, Clock, DollarSign, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function TimeValueOfMoney() {
  const [activeFormula, setActiveFormula] = useState('fv');
  const [results, setResults] = useState({});
  const [showComparison, setShowComparison] = useState(false);

  const [inputs, setInputs] = useState({
    si_pv: 1000, si_r: 5, si_t: 10,
    ci_pv: 1000, ci_r: 5, ci_n: 10,
    cim_pv: 1000, cim_r: 5, cim_n: 10, cim_m: 12,
    cc_pv: 1000, cc_r: 5, cc_t: 10,
    fv_pv: 1000, fv_r: 5, fv_n: 10, fv_m: 1,
    pv_fv: 1628.89, pv_r: 5, pv_n: 10, pv_m: 1,
    ann_pv_pmt: 100, ann_pv_r: 5, ann_pv_n: 10, ann_pv_m: 1,
    ann_fv_pmt: 100, ann_fv_r: 5, ann_fv_n: 10, ann_fv_m: 1,
    annd_pv_pmt: 100, annd_pv_r: 5, annd_pv_n: 10, annd_pv_m: 1,
    annd_fv_pmt: 100, annd_fv_r: 5, annd_fv_n: 10, annd_fv_m: 1,
    perp_pmt: 100, perp_r: 5,
    gperp_pmt: 100, gperp_r: 8, gperp_g: 3,
    gann_pv_pmt: 100, gann_pv_r: 8, gann_pv_g: 3, gann_pv_n: 10, gann_pv_m: 1,
    gann_fv_pmt: 100, gann_fv_r: 8, gann_fv_g: 3, gann_fv_n: 10, gann_fv_m: 1,
  });

  const formulas = {
    si: {
      name: 'Simple Interest',
      formula: 'FV = PV × (1 + r × t)',
      description: 'Interest calculated only on principal amount',
      category: 'Interest Types',
      variables: [
        { key: 'si_pv', label: 'Principal (PV)', symbol: 'PV' },
        { key: 'si_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'si_t', label: 'Time in Years (t)', symbol: 't' }
      ],
      calculate: (inp) => inp.si_pv * (1 + (inp.si_r / 100) * inp.si_t),
      timeline: true
    },
    ci: {
      name: 'Compound Interest (Annual)',
      formula: 'FV = PV × (1 + r)ⁿ',
      description: 'Interest compounded once per year',
      category: 'Interest Types',
      variables: [
        { key: 'ci_pv', label: 'Principal (PV)', symbol: 'PV' },
        { key: 'ci_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'ci_n', label: 'Number of Years (n)', symbol: 'n' }
      ],
      calculate: (inp) => inp.ci_pv * Math.pow(1 + inp.ci_r / 100, inp.ci_n),
      timeline: true
    },
    cim: {
      name: 'Compound Interest (m periods/year)',
      formula: 'FV = PV × (1 + r/m)^(n×m)',
      description: 'Interest compounded m times per year',
      category: 'Interest Types',
      variables: [
        { key: 'cim_pv', label: 'Principal (PV)', symbol: 'PV' },
        { key: 'cim_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'cim_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'cim_m', label: 'Compounding Periods/Year (m)', symbol: 'm', hint: '1=Annual, 4=Quarterly, 12=Monthly, 365=Daily' }
      ],
      calculate: (inp) => inp.cim_pv * Math.pow(1 + inp.cim_r / 100 / inp.cim_m, inp.cim_n * inp.cim_m),
      timeline: true
    },
    cc: {
      name: 'Continuous Compounding',
      formula: 'FV = PV × e^(r×t)',
      description: 'Interest compounded infinitely',
      category: 'Interest Types',
      variables: [
        { key: 'cc_pv', label: 'Principal (PV)', symbol: 'PV' },
        { key: 'cc_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'cc_t', label: 'Time in Years (t)', symbol: 't' }
      ],
      calculate: (inp) => inp.cc_pv * Math.exp((inp.cc_r / 100) * inp.cc_t),
      timeline: true
    },
    fv: {
      name: 'Future Value (Lump Sum)',
      formula: 'FV = PV × (1 + r/m)^(n×m)',
      description: 'Future value with periodic compounding',
      category: 'Lump Sum',
      variables: [
        { key: 'fv_pv', label: 'Present Value (PV)', symbol: 'PV' },
        { key: 'fv_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'fv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'fv_m', label: 'Compounding Periods/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => inp.fv_pv * Math.pow(1 + inp.fv_r / 100 / inp.fv_m, inp.fv_n * inp.fv_m),
      timeline: true
    },
    pv: {
      name: 'Present Value (Lump Sum)',
      formula: 'PV = FV / (1 + r/m)^(n×m)',
      description: 'Present value with periodic compounding',
      category: 'Lump Sum',
      variables: [
        { key: 'pv_fv', label: 'Future Value (FV)', symbol: 'FV' },
        { key: 'pv_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'pv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'pv_m', label: 'Compounding Periods/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => inp.pv_fv / Math.pow(1 + inp.pv_r / 100 / inp.pv_m, inp.pv_n * inp.pv_m),
      timeline: true
    },
    ann_pv: {
      name: 'PV of Ordinary Annuity',
      formula: 'PV = PMT × [(1 - (1 + r/m)^(-n×m)) / (r/m)]',
      description: 'Payments at END of each period',
      category: 'Ordinary Annuity',
      variables: [
        { key: 'ann_pv_pmt', label: 'Payment per Period (PMT)', symbol: 'PMT' },
        { key: 'ann_pv_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'ann_pv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'ann_pv_m', label: 'Payments/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => {
        const r = inp.ann_pv_r / 100 / inp.ann_pv_m;
        const n = inp.ann_pv_n * inp.ann_pv_m;
        return inp.ann_pv_pmt * ((1 - Math.pow(1 + r, -n)) / r);
      },
      timeline: true
    },
    ann_fv: {
      name: 'FV of Ordinary Annuity',
      formula: 'FV = PMT × [((1 + r/m)^(n×m) - 1) / (r/m)]',
      description: 'Payments at END of each period',
      category: 'Ordinary Annuity',
      variables: [
        { key: 'ann_fv_pmt', label: 'Payment per Period (PMT)', symbol: 'PMT' },
        { key: 'ann_fv_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'ann_fv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'ann_fv_m', label: 'Payments/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => {
        const r = inp.ann_fv_r / 100 / inp.ann_fv_m;
        const n = inp.ann_fv_n * inp.ann_fv_m;
        return inp.ann_fv_pmt * ((Math.pow(1 + r, n) - 1) / r);
      },
      timeline: true
    },
    annd_pv: {
      name: 'PV of Annuity Due',
      formula: 'PV = PMT × [(1 - (1 + r/m)^(-n×m)) / (r/m)] × (1 + r/m)',
      description: 'Payments at BEGINNING of each period',
      category: 'Annuity Due',
      variables: [
        { key: 'annd_pv_pmt', label: 'Payment per Period (PMT)', symbol: 'PMT' },
        { key: 'annd_pv_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'annd_pv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'annd_pv_m', label: 'Payments/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => {
        const r = inp.annd_pv_r / 100 / inp.annd_pv_m;
        const n = inp.annd_pv_n * inp.annd_pv_m;
        return inp.annd_pv_pmt * ((1 - Math.pow(1 + r, -n)) / r) * (1 + r);
      },
      timeline: true
    },
    annd_fv: {
      name: 'FV of Annuity Due',
      formula: 'FV = PMT × [((1 + r/m)^(n×m) - 1) / (r/m)] × (1 + r/m)',
      description: 'Payments at BEGINNING of each period',
      category: 'Annuity Due',
      variables: [
        { key: 'annd_fv_pmt', label: 'Payment per Period (PMT)', symbol: 'PMT' },
        { key: 'annd_fv_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'annd_fv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'annd_fv_m', label: 'Payments/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => {
        const r = inp.annd_fv_r / 100 / inp.annd_fv_m;
        const n = inp.annd_fv_n * inp.annd_fv_m;
        return inp.annd_fv_pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      },
      timeline: true
    },
    perp: {
      name: 'Perpetuity (No Growth)',
      formula: 'PV = PMT / r',
      description: 'Infinite stream of equal payments',
      category: 'Perpetuities',
      variables: [
        { key: 'perp_pmt', label: 'Payment (PMT)', symbol: 'PMT' },
        { key: 'perp_r', label: 'Interest Rate (%)', symbol: 'r' }
      ],
      calculate: (inp) => inp.perp_pmt / (inp.perp_r / 100),
      timeline: false
    },
    gperp: {
      name: 'Growing Perpetuity',
      formula: 'PV = PMT / (r - g)',
      description: 'Infinite stream of growing payments',
      category: 'Perpetuities',
      variables: [
        { key: 'gperp_pmt', label: 'Initial Payment (PMT)', symbol: 'PMT' },
        { key: 'gperp_r', label: 'Discount Rate (%)', symbol: 'r' },
        { key: 'gperp_g', label: 'Growth Rate (%)', symbol: 'g' }
      ],
      calculate: (inp) => {
        const r = inp.gperp_r / 100;
        const g = inp.gperp_g / 100;
        if (r <= g) return 'Error: r must be > g';
        return inp.gperp_pmt / (r - g);
      },
      timeline: false
    },
    gann_pv: {
      name: 'PV of Growing Annuity',
      formula: 'PV = PMT × [(1 - ((1+g)/(1+r/m))^(n×m)) / (r/m - g)]',
      description: 'Finite stream of growing payments',
      category: 'Growing Annuities',
      variables: [
        { key: 'gann_pv_pmt', label: 'Initial Payment (PMT)', symbol: 'PMT' },
        { key: 'gann_pv_r', label: 'Annual Discount Rate (%)', symbol: 'r' },
        { key: 'gann_pv_g', label: 'Growth Rate per Period (%)', symbol: 'g' },
        { key: 'gann_pv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'gann_pv_m', label: 'Payments/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => {
        const r = inp.gann_pv_r / 100 / inp.gann_pv_m;
        const g = inp.gann_pv_g / 100;
        const n = inp.gann_pv_n * inp.gann_pv_m;
        if (r === g) return inp.gann_pv_pmt * n / (1 + r);
        return inp.gann_pv_pmt * ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g));
      },
      timeline: true
    },
    gann_fv: {
      name: 'FV of Growing Annuity',
      formula: 'FV = PMT × [((1+r/m)^(n×m) - (1+g)^(n×m)) / (r/m - g)]',
      description: 'Future value of finite growing payments',
      category: 'Growing Annuities',
      variables: [
        { key: 'gann_fv_pmt', label: 'Initial Payment (PMT)', symbol: 'PMT' },
        { key: 'gann_fv_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'gann_fv_g', label: 'Growth Rate per Period (%)', symbol: 'g' },
        { key: 'gann_fv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'gann_fv_m', label: 'Payments/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => {
        const r = inp.gann_fv_r / 100 / inp.gann_fv_m;
        const g = inp.gann_fv_g / 100;
        const n = inp.gann_fv_n * inp.gann_fv_m;
        if (r === g) return inp.gann_fv_pmt * n * Math.pow(1 + r, n - 1);
        return inp.gann_fv_pmt * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g));
      },
      timeline: true
    }
  };

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const calculateResult = () => {
    const result = formulas[activeFormula].calculate(inputs);
    setResults(prev => ({ ...prev, [activeFormula]: result }));
  };

  const generateComparisonData = () => {
    const pv = 1000;
    const rate = 8;
    const years = 20;
    const data = [];
    
    for (let year = 0; year <= years; year++) {
      const r = rate / 100;
      data.push({
        year,
        simple: pv * (1 + r * year),
        annual: pv * Math.pow(1 + r, year),
        quarterly: pv * Math.pow(1 + r / 4, year * 4),
        monthly: pv * Math.pow(1 + r / 12, year * 12),
        daily: pv * Math.pow(1 + r / 365, year * 365),
        continuous: pv * Math.exp(r * year)
      });
    }
    return data;
  };

  const generateCompoundingFrequencyComparison = () => {
    const pv = 1000;
    const rate = 8;
    const years = 10;
    const r = rate / 100;
    
    return [
      { name: 'Simple', value: pv * (1 + r * years), periods: 0 },
      { name: 'Annual', value: pv * Math.pow(1 + r, years), periods: 1 },
      { name: 'Semi-Annual', value: pv * Math.pow(1 + r / 2, years * 2), periods: 2 },
      { name: 'Quarterly', value: pv * Math.pow(1 + r / 4, years * 4), periods: 4 },
      { name: 'Monthly', value: pv * Math.pow(1 + r / 12, years * 12), periods: 12 },
      { name: 'Daily', value: pv * Math.pow(1 + r / 365, years * 365), periods: 365 },
      { name: 'Continuous', value: pv * Math.exp(r * years), periods: Infinity }
    ];
  };

  const Timeline = ({ type }) => {
    const periods = type.includes('ann') ? 5 : 3;
    const isAnnuity = type.includes('ann');
    const isDue = type.includes('annd');
    
    return (
      <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl">
        <h4 className="text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4" />
          Cash Flow Timeline
        </h4>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-400" />
          {[...Array(periods + 1)].map((_, i) => (
            <div key={i} className="flex flex-col items-center z-10 relative">
              <div className="w-3 h-3 bg-indigo-600 rounded-full mb-2 shadow-lg" />
              <div className="text-xs font-semibold text-gray-600 mb-2">t = {i}</div>
              {isAnnuity && i > 0 && i <= periods && (
                <div className="mt-2 px-3 py-1.5 bg-white border-2 border-green-400 rounded-lg shadow-md">
                  <div className="text-xs font-bold text-green-600">
                    {isDue && i === 1 ? 'PMT (Start)' : 'PMT'}
                  </div>
                </div>
              )}
              {!isAnnuity && (type === 'fv' || type === 'ci' || type === 'cim' || type === 'cc' || type === 'si') && i === 0 && (
                <div className="mt-2 px-3 py-1.5 bg-white border-2 border-blue-400 rounded-lg shadow-md">
                  <div className="text-xs font-bold text-blue-600">PV</div>
                </div>
              )}
              {!isAnnuity && (type === 'fv' || type === 'ci' || type === 'cim' || type === 'cc' || type === 'si') && i === periods && (
                <div className="mt-2 px-3 py-1.5 bg-white border-2 border-purple-400 rounded-lg shadow-md">
                  <div className="text-xs font-bold text-purple-600">FV</div>
                </div>
              )}
              {type === 'pv' && i === periods && (
                <div className="mt-2 px-3 py-1.5 bg-white border-2 border-blue-400 rounded-lg shadow-md">
                  <div className="text-xs font-bold text-blue-600">FV</div>
                </div>
              )}
              {type === 'pv' && i === 0 && (
                <div className="mt-2 px-3 py-1.5 bg-white border-2 border-purple-400 rounded-lg shadow-md">
                  <div className="text-xs font-bold text-purple-600">PV</div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const currentFormula = formulas[activeFormula];
  const currentResult = results[activeFormula];
  const categories = [...new Set(Object.values(formulas).map(f => f.category))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-8 border-t-4 border-indigo-600">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-lg">
              <DollarSign className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-800">Time Value of Money</h1>
              <p className="text-gray-600 mt-1">FINM708 - Week 1 Interactive Calculator</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            Select Formula Type
          </h2>
          {categories.map(category => (
            <div key={category} className="mb-6">
              <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase tracking-wide">{category}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {Object.entries(formulas)
                  .filter(([, formula]) => formula.category === category)
                  .map(([key, formula]) => (
                    <button
                      key={key}
                      onClick={() => setActiveFormula(key)}
                      className={`p-4 rounded-xl font-semibold text-sm transition-all transform hover:scale-105 ${
                        activeFormula === key
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {formula.name}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">{currentFormula.name}</h3>
              <p className="text-gray-600 text-sm">{currentFormula.description}</p>
            </div>

            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6 border-l-4 border-indigo-600">
              <div className="text-xs font-semibold text-gray-600 mb-2">FORMULA</div>
              <div className="text-xl font-bold text-indigo-900 font-mono break-all">{currentFormula.formula}</div>
            </div>

            <div className="space-y-4 mb-6">
              {currentFormula.variables.map(variable => (
                <div key={variable.key}>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    {variable.label}
                  </label>
                  {variable.hint && (
                    <p className="text-xs text-gray-500 mb-1">{variable.hint}</p>
                  )}
                  <input
                    type="number"
                    value={inputs[variable.key]}
                    onChange={(e) => handleInputChange(variable.key, e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-indigo-500 focus:outline-none transition-colors text-lg"
                    step="any"
                  />
                </div>
              ))}
            </div>

            <button
              onClick={calculateResult}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <Calculator className="w-5 h-5" />
              Calculate Result
            </button>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-green-600" />
              Result
            </h3>

            {currentResult !== undefined ? (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border-2 border-green-200 mb-6">
                <div className="text-sm font-semibold text-gray-600 mb-2">CALCULATED VALUE</div>
                <div className="text-5xl font-bold text-green-600 mb-2">
                  {typeof currentResult === 'number' ? `$${currentResult.toFixed(2)}` : currentResult}
                </div>
                {typeof currentResult === 'number' && (
                  <div className="text-sm text-gray-600 mt-4">
                    {currentResult.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300 mb-6">
                <Calculator className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">Enter values and click Calculate</p>
              </div>
            )}

            {currentFormula.timeline && <Timeline type={activeFormula} />}

            <div className="mt-6 p-6 bg-blue-50 rounded-xl border-l-4 border-blue-600">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">Key Concepts</h4>
              <ul className="text-sm text-gray-600 space-y-2">
                {activeFormula === 'si' && (
                  <>
                    <li>• Simple Interest: calculated only on principal</li>
                    <li>• No compounding - linear growth</li>
                  </>
                )}
                {(activeFormula === 'ci' || activeFormula === 'cim') && (
                  <>
                    <li>• Compound Interest: interest earns interest</li>
                    <li>• More frequent compounding = higher returns</li>
                  </>
                )}
                {activeFormula === 'cc' && (
                  <>
                    <li>• Continuous Compounding: limit as m goes to infinity</li>
                    <li>• Uses natural exponential e ≈ 2.71828</li>
                    <li>• Maximum possible return for given rate</li>
                  </>
                )}
                {activeFormula.includes('ann') && !activeFormula.includes('annd') && (
                  <li>• Ordinary Annuity: payments at END of period</li>
                )}
                {activeFormula.includes('annd') && (
                  <li>• Annuity Due: payments at BEGINNING of period</li>
                )}
                {activeFormula.includes('perp') && (
                  <li>• Perpetuity: infinite stream of payments</li>
                )}
                {activeFormula.includes('g') && (
                  <li>• Growth Rate: payments increase by g% each period</li>
                )}
                {currentFormula.variables.some(v => v.key.includes('_m')) && (
                  <li>• Compounding Frequency m: more periods = higher value</li>
                )}
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <button
            onClick={() => setShowComparison(!showComparison)}
            className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl hover:from-purple-200 hover:to-pink-200 transition-all"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              <span className="text-xl font-bold text-gray-800">
                {showComparison ? 'Hide' : 'Show'} Compounding Comparison Charts
              </span>
            </div>
            <span className="text-2xl text-purple-600">{showComparison ? '−' : '+'}</span>
          </button>
        </div>

        {showComparison && (
          <div className="space-y-8 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Growth Comparison Over Time</h3>
              <p className="text-gray-600 mb-6">$1,000 invested at 8% annual rate for 20 years</p>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={generateComparisonData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" label={{ value: 'Years', position: 'insideBottom', offset: -5 }} />
                  <YAxis label={{ value: 'Value ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value.toFixed(2)}`} />
                  <Legend />
                  <Line type="monotone" dataKey="simple" stroke="#ef4444" name="Simple Interest" strokeWidth={2} />
                  <Line type="monotone" dataKey="annual" stroke="#f59e0b" name="Annual" strokeWidth={2} />
                  <Line type="monotone" dataKey="quarterly" stroke="#10b981" name="Quarterly" strokeWidth={2} />
                  <Line type="monotone" dataKey="monthly" stroke="#3b82f6" name="Monthly" strokeWidth={2} />
                  <Line type="monotone" dataKey="daily" stroke="#8b5cf6" name="Daily" strokeWidth={2} />
                  <Line type="monotone" dataKey="continuous" stroke="#ec4899" name="Continuous" strokeWidth={3} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Effect of Compounding Frequency</h3>
              <p className="text-gray-600 mb-6">Final value of $1,000 at 8% for 10 years</p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={generateCompoundingFrequencyComparison()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis label={{ value: 'Final Value ($)', angle: -90, position: 'insideLeft' }} />
                  <Tooltip formatter={(value) => `${value.toFixed(2)}`} />
                  <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {generateCompoundingFrequencyComparison().map((item, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="text-xs font-semibold text-gray-600">{item.name}</div>
                    <div className="text-lg font-bold text-purple-600">${item.value.toFixed(2)}</div>
                    {item.periods !== 0 && item.periods !== Infinity && (
                      <div className="text-xs text-gray-500">m = {item.periods}</div>
                    )}
                    {item.periods === Infinity && (
                      <div className="text-xs text-gray-500">m → ∞</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6">Complete Formula Reference Guide</h3>
          {categories.map(category => (
            <div key={category} className="mb-8">
              <h4 className="text-lg font-bold text-indigo-600 mb-4 pb-2 border-b-2 border-indigo-200">{category}</h4>
              <div className="grid md:grid-cols-2 gap-4">
                {Object.entries(formulas)
                  .filter(([, formula]) => formula.category === category)
                  .map(([key, formula]) => (
                    <div key={key} className="p-5 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
                      <h5 className="font-bold text-gray-800 text-sm mb-2">{formula.name}</h5>
                      <div className="text-xs font-mono text-indigo-700 bg-white p-3 rounded mb-2 overflow-x-auto">
                        {formula.formula}
                      </div>
                      <p className="text-xs text-gray-600">{formula.description}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-6">Key Takeaways - Compounding Periods</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
              <h4 className="font-bold mb-3 text-lg">Understanding m (Compounding Frequency)</h4>
              <ul className="space-y-2 text-sm">
                <li>• m = 1: Annual compounding</li>
                <li>• m = 2: Semi-annual (twice per year)</li>
                <li>• m = 4: Quarterly compounding</li>
                <li>• m = 12: Monthly compounding</li>
                <li>• m = 365: Daily compounding</li>
                <li>• m → ∞: Continuous compounding (uses e)</li>
              </ul>
            </div>
            <div className="bg-white/10 rounded-xl p-6 backdrop-blur">
              <h4 className="font-bold mb-3 text-lg">The Power of Compounding</h4>
              <ul className="space-y-2 text-sm">
                <li>• More frequent compounding = Higher returns</li>
                <li>• Effect is most dramatic over longer periods</li>
                <li>• Continuous compounding is theoretical maximum</li>
                <li>• Daily vs Continuous: minimal difference</li>
                <li>• Einstein: Compound interest is the 8th wonder</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}