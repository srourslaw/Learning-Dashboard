import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calculator, TrendingUp, Clock, DollarSign, BarChart3, Save, X, Trash2, FolderOpen, RotateCcw, Check, ArrowLeft, BookOpen, ChevronDown, ChevronUp, Percent, Calendar, Coins, TrendingDown, ArrowRight, Info, Menu, ChevronRight, GraduationCap, PieChart, Table, LineChart as LineChartIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, AreaChart, Area, Cell } from 'recharts';
import { DisplayEquation, InlineEquation } from '../components/MathEquation';
import Amortization from '../components/Amortization';
import 'katex/dist/katex.min.css';

export default function TimeValueOfMoney() {
  const navigate = useNavigate();
  const [activeFormula, setActiveFormula] = useState('fv');
  const [activeVariation, setActiveVariation] = useState('FV'); // Which variable to solve for
  const [results, setResults] = useState({});
  const [showComparison, setShowComparison] = useState(false);
  const [savedCalculations, setSavedCalculations] = useState(() => {
    const saved = localStorage.getItem('tvm_saved_calculations');
    return saved ? JSON.parse(saved) : [];
  });
  const [showSavedPanel, setShowSavedPanel] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [showInterestRatesGuide, setShowInterestRatesGuide] = useState(false);
  const [activeSection, setActiveSection] = useState('learn');
  const [expandedCategories, setExpandedCategories] = useState({ calculators: true, 'Interest Types': true });

  // Practice Problems State
  const [expandedProblems, setExpandedProblems] = useState({});
  const [completedProblems, setCompletedProblems] = useState({});
  const [shownHints, setShownHints] = useState({});
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Chart input controls
  const [chartInputs, setChartInputs] = useState({
    principal: 1000,
    rate: 8,
    years: 15
  });

  // Compounding frequency chart inputs
  const [freqInputs, setFreqInputs] = useState({
    principal: 1000,
    rate: 8,
    years: 10
  });

  // Component Growth Over Time chart inputs (Scenario A & B for comparison)
  const [growthInputsA, setGrowthInputsA] = useState({
    principal: 10000,
    rate: 6,
    years: 10,
    compounding: 1  // m value: 1=annually, 2=semi-annually, 4=quarterly, 12=monthly
  });
  const [growthInputsB, setGrowthInputsB] = useState({
    principal: 10000,
    rate: 10,
    years: 10,
    compounding: 1
  });

  // Compounding Frequency Comparison chart inputs (Scenario A & B)
  const [comparisonInputsA, setComparisonInputsA] = useState({
    principal: 1000,
    rate: 6,
    years: 20
  });
  const [comparisonInputsB, setComparisonInputsB] = useState({
    principal: 1000,
    rate: 10,
    years: 20
  });

  // Snowball Effect table inputs (Scenario A & B)
  const [snowballInputsA, setSnowballInputsA] = useState({
    principal: 10000,
    rate: 6,
    years: 10
  });
  const [snowballInputsB, setSnowballInputsB] = useState({
    principal: 10000,
    rate: 10,
    years: 10
  });

  // Reset variation when formula changes
  React.useEffect(() => {
    const formula = formulas[activeFormula];
    if (formula.variations) {
      // Set to first variation
      const firstVariation = Object.keys(formula.variations)[0];
      setActiveVariation(firstVariation);
    } else {
      setActiveVariation(null);
    }
  }, [activeFormula]);

  const [inputs, setInputs] = useState({
    si_pv: 1000, si_r: 5, si_t: 10, si_fv: 1500,
    ci_pv: 1000, ci_r: 5, ci_n: 10, ci_fv: 1628.89,
    cim_pv: 1000, cim_r: 5, cim_n: 10, cim_m: 12, cim_fv: 1647.01,
    cc_pv: 1000, cc_r: 5, cc_t: 10, cc_fv: 1648.72,
    ear_r: 12, ear_m: 12, ear_ear: 12.68,
    fv_pv: 1000, fv_r: 5, fv_n: 10, fv_m: 1, fv_fv: 1628.89,
    pv_fv: 1628.89, pv_r: 5, pv_n: 10, pv_m: 1, pv_pv: 1000,
    ann_pv_pmt: 100, ann_pv_r: 5, ann_pv_n: 10, ann_pv_m: 1, ann_pv_pv: 772.17,
    ann_fv_pmt: 100, ann_fv_r: 5, ann_fv_n: 10, ann_fv_m: 1, ann_fv_fv: 1257.79,
    annd_pv_pmt: 100, annd_pv_r: 5, annd_pv_n: 10, annd_pv_m: 1, annd_pv_pv: 810.78,
    annd_fv_pmt: 100, annd_fv_r: 5, annd_fv_n: 10, annd_fv_m: 1, annd_fv_fv: 1320.68,
    perp_pmt: 100, perp_r: 5, perp_pv: 2000,
    gperp_pmt: 100, gperp_r: 8, gperp_g: 3, gperp_pv: 2000,
    gann_pv_pmt: 100, gann_pv_r: 8, gann_pv_g: 3, gann_pv_n: 10, gann_pv_m: 1, gann_pv_pv: 656.6,
    gann_fv_pmt: 100, gann_fv_r: 8, gann_fv_g: 3, gann_fv_n: 10, gann_fv_m: 1, gann_fv_fv: 1416.84,
    gann_due_pv_pmt: 100, gann_due_pv_r: 8, gann_due_pv_g: 3, gann_due_pv_n: 10, gann_due_pv_m: 1, gann_due_pv_pv: 709.13,
    gann_due_fv_pmt: 100, gann_due_fv_r: 8, gann_due_fv_g: 3, gann_due_fv_n: 10, gann_due_fv_m: 1, gann_due_fv_fv: 1530.19,
  });

  // Newton-Raphson method for solving rate (IRR calculation - standard in finance)
  const solveRate = (targetValue, calcFunction, initialGuess = 0.1, maxIterations = 100, tolerance = 0.0001) => {
    let rate = initialGuess;
    for (let i = 0; i < maxIterations; i++) {
      const value = calcFunction(rate);
      const derivative = (calcFunction(rate + tolerance) - value) / tolerance;
      const newRate = rate - (value - targetValue) / derivative;

      if (Math.abs(newRate - rate) < tolerance) {
        return newRate * 100; // Return as percentage
      }
      rate = newRate;
    }
    return rate * 100; // Return as percentage even if not fully converged
  };

  // Newton-Raphson method for solving non-rate variables (m, n) - returns raw value without percentage conversion
  const solveForVariable = (targetValue, calcFunction, initialGuess = 10, maxIterations = 100, tolerance = 0.001) => {
    let variable = initialGuess;
    for (let i = 0; i < maxIterations; i++) {
      const value = calcFunction(variable);
      const derivative = (calcFunction(variable + tolerance) - value) / tolerance;
      const newVariable = variable - (value - targetValue) / derivative;

      if (Math.abs(newVariable - variable) < tolerance) {
        return newVariable; // Return as-is (no percentage conversion)
      }
      variable = newVariable;
    }
    return variable; // Return as-is even if not fully converged
  };

  const formulas = {
    si: {
      name: 'Simple Interest',
      formula: '\\color{blue}{FV} = \\color{green}{PV} \\times (1 + \\color{red}{r} \\times \\color{purple}{t})',
      latexFormula: '\\color{blue}{FV} = \\color{green}{PV} \\times (1 + \\color{red}{r} \\times \\color{purple}{t})',
      description: 'Interest calculated only on principal amount',
      category: 'Interest Types',
      variables: [
        { key: 'si_pv', label: 'Principal (PV)', symbol: 'PV' },
        { key: 'si_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'si_t', label: 'Time in Years (t)', symbol: 't' }
      ],
      calculate: (inp) => inp.si_pv * (1 + (inp.si_r / 100) * inp.si_t),
      timeline: true,
      variations: {
        FV: {
          name: 'Solve for FV',
          latexFormula: '\\color{blue}{FV} = \\color{green}{PV} \\times (1 + \\color{red}{r} \\times \\color{purple}{t})',
          inputs: ['si_pv', 'si_r', 'si_t'],
          calculate: (inp) => inp.si_pv * (1 + (inp.si_r / 100) * inp.si_t)
        },
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\frac{\\color{blue}{FV}}{1 + \\color{red}{r} \\times \\color{purple}{t}}',
          inputs: ['si_fv', 'si_r', 'si_t'],
          calculate: (inp) => inp.si_fv / (1 + (inp.si_r / 100) * inp.si_t)
        },
        r: {
          name: 'Solve for r',
          latexFormula: '\\color{red}{r} = \\frac{\\frac{\\color{blue}{FV}}{\\color{green}{PV}} - 1}{\\color{purple}{t}}',
          inputs: ['si_fv', 'si_pv', 'si_t'],
          calculate: (inp) => ((inp.si_fv / inp.si_pv - 1) / inp.si_t) * 100
        },
        t: {
          name: 'Solve for t',
          latexFormula: '\\color{purple}{t} = \\frac{\\frac{\\color{blue}{FV}}{\\color{green}{PV}} - 1}{\\color{red}{r}}',
          inputs: ['si_fv', 'si_pv', 'si_r'],
          calculate: (inp) => (inp.si_fv / inp.si_pv - 1) / (inp.si_r / 100)
        }
      }
    },
    ci: {
      name: 'Compound Interest (Annual)',
      formula: 'FV = PV × (1 + r)ⁿ',
      latexFormula: '\\color{blue}{FV} = \\color{green}{PV} \\times (1 + \\color{red}{r})^{\\color{purple}{n}}',
      description: 'Interest compounded once per year',
      category: 'Interest Types',
      variables: [
        { key: 'ci_pv', label: 'Principal (PV)', symbol: 'PV' },
        { key: 'ci_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'ci_n', label: 'Number of Years (n)', symbol: 'n' }
      ],
      calculate: (inp) => inp.ci_pv * Math.pow(1 + inp.ci_r / 100, inp.ci_n),
      timeline: true,
      variations: {
        FV: {
          name: 'Solve for FV',
          latexFormula: '\\color{blue}{FV} = \\color{green}{PV} \\times (1 + \\color{red}{r})^{\\color{purple}{n}}',
          inputs: ['ci_pv', 'ci_r', 'ci_n'],
          calculate: (inp) => inp.ci_pv * Math.pow(1 + inp.ci_r / 100, inp.ci_n)
        },
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\frac{\\color{blue}{FV}}{(1 + \\color{red}{r})^{\\color{purple}{n}}}',
          inputs: ['ci_fv', 'ci_r', 'ci_n'],
          calculate: (inp) => inp.ci_fv / Math.pow(1 + inp.ci_r / 100, inp.ci_n)
        },
        r: {
          name: 'Solve for r',
          latexFormula: '\\color{red}{r} = \\left(\\frac{\\color{blue}{FV}}{\\color{green}{PV}}\\right)^{\\frac{1}{\\color{purple}{n}}} - 1',
          inputs: ['ci_fv', 'ci_pv', 'ci_n'],
          calculate: (inp) => (Math.pow(inp.ci_fv / inp.ci_pv, 1 / inp.ci_n) - 1) * 100
        },
        n: {
          name: 'Solve for n',
          latexFormula: '\\color{purple}{n} = \\frac{\\ln\\left(\\frac{\\color{blue}{FV}}{\\color{green}{PV}}\\right)}{\\ln(1 + \\color{red}{r})}',
          inputs: ['ci_fv', 'ci_pv', 'ci_r'],
          calculate: (inp) => Math.log(inp.ci_fv / inp.ci_pv) / Math.log(1 + inp.ci_r / 100)
        }
      }
    },
    cim: {
      name: 'Compound Interest (m periods/year)',
      formula: 'FV = PV × (1 + r/m)^(n×m)',
      latexFormula: '\\color{blue}{FV} = \\color{green}{PV} \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}',
      description: 'Interest compounded m times per year',
      category: 'Interest Types',
      variables: [
        { key: 'cim_pv', label: 'Principal (PV)', symbol: 'PV' },
        { key: 'cim_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'cim_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'cim_m', label: 'Compounding Periods/Year (m)', symbol: 'm', hint: '1=Annual, 4=Quarterly, 12=Monthly, 365=Daily' }
      ],
      calculate: (inp) => inp.cim_pv * Math.pow(1 + inp.cim_r / 100 / inp.cim_m, inp.cim_n * inp.cim_m),
      timeline: true,
      variations: {
        FV: {
          name: 'Solve for FV',
          latexFormula: '\\color{blue}{FV} = \\color{green}{PV} \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}',
          inputs: ['cim_pv', 'cim_r', 'cim_n', 'cim_m'],
          calculate: (inp) => inp.cim_pv * Math.pow(1 + inp.cim_r / 100 / inp.cim_m, inp.cim_n * inp.cim_m)
        },
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\frac{\\color{blue}{FV}}{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}}',
          inputs: ['cim_fv', 'cim_r', 'cim_n', 'cim_m'],
          calculate: (inp) => inp.cim_fv / Math.pow(1 + inp.cim_r / 100 / inp.cim_m, inp.cim_n * inp.cim_m)
        },
        r: {
          name: 'Solve for r (IRR)',
          latexFormula: '\\color{red}{r} = \\color{orange}{m} \\times \\left[\\left(\\frac{\\color{blue}{FV}}{\\color{green}{PV}}\\right)^{\\frac{1}{\\color{purple}{n} \\times \\color{orange}{m}}} - 1\\right]',
          inputs: ['cim_fv', 'cim_pv', 'cim_n', 'cim_m'],
          calculate: (inp) => inp.cim_m * (Math.pow(inp.cim_fv / inp.cim_pv, 1 / (inp.cim_n * inp.cim_m)) - 1) * 100
        },
        n: {
          name: 'Solve for n',
          latexFormula: '\\color{purple}{n} = \\frac{\\ln\\left(\\frac{\\color{blue}{FV}}{\\color{green}{PV}}\\right)}{\\color{orange}{m} \\times \\ln\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}',
          inputs: ['cim_fv', 'cim_pv', 'cim_r', 'cim_m'],
          calculate: (inp) => Math.log(inp.cim_fv / inp.cim_pv) / (inp.cim_m * Math.log(1 + inp.cim_r / 100 / inp.cim_m))
        },
        m: {
          name: 'Solve for m (Numerical)',
          latexFormula: '\\color{orange}{m} \\text{ solved numerically from: } \\color{blue}{FV} = \\color{green}{PV} \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}',
          inputs: ['cim_fv', 'cim_pv', 'cim_r', 'cim_n'],
          calculate: (inp) => {
            const targetFV = inp.cim_fv;
            const calcFV = (m) => inp.cim_pv * Math.pow(1 + inp.cim_r / 100 / m, inp.cim_n * m);
            return solveForVariable(targetFV, calcFV, 12, 100, 0.001);
          }
        }
      }
    },
    cc: {
      name: 'Continuous Compounding',
      formula: 'FV = PV × e^(r×t)',
      latexFormula: '\\color{blue}{FV} = \\color{green}{PV} \\times e^{\\color{red}{r} \\times \\color{purple}{t}}',
      description: 'Interest compounded infinitely',
      category: 'Interest Types',
      variables: [
        { key: 'cc_pv', label: 'Principal (PV)', symbol: 'PV' },
        { key: 'cc_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'cc_t', label: 'Time in Years (t)', symbol: 't' }
      ],
      calculate: (inp) => inp.cc_pv * Math.exp((inp.cc_r / 100) * inp.cc_t),
      timeline: true,
      variations: {
        FV: {
          name: 'Solve for FV',
          latexFormula: '\\color{blue}{FV} = \\color{green}{PV} \\times e^{\\color{red}{r} \\times \\color{purple}{t}}',
          inputs: ['cc_pv', 'cc_r', 'cc_t'],
          calculate: (inp) => inp.cc_pv * Math.exp((inp.cc_r / 100) * inp.cc_t)
        },
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\frac{\\color{blue}{FV}}{e^{\\color{red}{r} \\times \\color{purple}{t}}}',
          inputs: ['cc_fv', 'cc_r', 'cc_t'],
          calculate: (inp) => inp.cc_fv / Math.exp((inp.cc_r / 100) * inp.cc_t)
        },
        r: {
          name: 'Solve for r',
          latexFormula: '\\color{red}{r} = \\frac{\\ln\\left(\\frac{\\color{blue}{FV}}{\\color{green}{PV}}\\right)}{\\color{purple}{t}}',
          inputs: ['cc_fv', 'cc_pv', 'cc_t'],
          calculate: (inp) => (Math.log(inp.cc_fv / inp.cc_pv) / inp.cc_t) * 100
        },
        t: {
          name: 'Solve for t',
          latexFormula: '\\color{purple}{t} = \\frac{\\ln\\left(\\frac{\\color{blue}{FV}}{\\color{green}{PV}}\\right)}{\\color{red}{r}}',
          inputs: ['cc_fv', 'cc_pv', 'cc_r'],
          calculate: (inp) => Math.log(inp.cc_fv / inp.cc_pv) / (inp.cc_r / 100)
        }
      }
    },
    ear: {
      name: 'Effective Annual Rate (EAR)',
      formula: 'EAR = (1 + r/m)^m - 1',
      latexFormula: '\\color{green}{EAR} = \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{orange}{m}} - 1',
      description: 'Convert nominal rate to effective annual rate',
      category: 'Interest Types',
      variables: [
        { key: 'ear_r', label: 'Nominal Annual Rate (%)', symbol: 'r' },
        { key: 'ear_m', label: 'Compounding Periods/Year (m)', symbol: 'm', hint: '1=Annual, 4=Quarterly, 12=Monthly, 365=Daily' }
      ],
      calculate: (inp) => (Math.pow(1 + inp.ear_r / 100 / inp.ear_m, inp.ear_m) - 1) * 100,
      timeline: false,
      variations: {
        EAR: {
          name: 'Solve for EAR',
          latexFormula: '\\color{green}{EAR} = \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{orange}{m}} - 1',
          inputs: ['ear_r', 'ear_m'],
          calculate: (inp) => (Math.pow(1 + inp.ear_r / 100 / inp.ear_m, inp.ear_m) - 1) * 100
        },
        r: {
          name: 'Solve for Nominal Rate',
          latexFormula: '\\color{red}{r} = \\color{orange}{m} \\times \\left[\\left(1 + \\color{green}{EAR}\\right)^{\\frac{1}{\\color{orange}{m}}} - 1\\right]',
          inputs: ['ear_ear', 'ear_m'],
          calculate: (inp) => inp.ear_m * (Math.pow(1 + inp.ear_ear / 100, 1 / inp.ear_m) - 1) * 100
        },
        m: {
          name: 'Solve for m (Numerical)',
          latexFormula: '\\color{orange}{m} \\text{ solved numerically from: } \\color{green}{EAR} = \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{orange}{m}} - 1',
          inputs: ['ear_ear', 'ear_r'],
          calculate: (inp) => {
            const targetEAR = inp.ear_ear / 100;
            const calcEAR = (m) => Math.pow(1 + inp.ear_r / 100 / m, m) - 1;
            return solveForVariable(targetEAR, calcEAR, 12, 100, 0.001);
          }
        }
      }
    },
    fv: {
      name: 'Future Value (Lump Sum)',
      formula: 'FV = PV × (1 + r/m)^(n×m)',
      latexFormula: '\\color{blue}{FV} = \\color{green}{PV} \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}',
      description: 'Future value with periodic compounding',
      category: 'Lump Sum',
      variables: [
        { key: 'fv_pv', label: 'Present Value (PV)', symbol: 'PV' },
        { key: 'fv_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'fv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'fv_m', label: 'Compounding Periods/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => inp.fv_pv * Math.pow(1 + inp.fv_r / 100 / inp.fv_m, inp.fv_n * inp.fv_m),
      timeline: true,
      variations: {
        FV: {
          name: 'Solve for FV',
          latexFormula: '\\color{blue}{FV} = \\color{green}{PV} \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}',
          inputs: ['fv_pv', 'fv_r', 'fv_n', 'fv_m'],
          calculate: (inp) => inp.fv_pv * Math.pow(1 + inp.fv_r / 100 / inp.fv_m, inp.fv_n * inp.fv_m)
        },
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\frac{\\color{blue}{FV}}{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}}',
          inputs: ['fv_fv', 'fv_r', 'fv_n', 'fv_m'],
          calculate: (inp) => inp.fv_fv / Math.pow(1 + inp.fv_r / 100 / inp.fv_m, inp.fv_n * inp.fv_m)
        },
        r: {
          name: 'Solve for r',
          latexFormula: '\\color{red}{r} = \\color{orange}{m} \\times \\left[\\left(\\frac{\\color{blue}{FV}}{\\color{green}{PV}}\\right)^{\\frac{1}{\\color{purple}{n} \\times \\color{orange}{m}}} - 1\\right]',
          inputs: ['fv_fv', 'fv_pv', 'fv_n', 'fv_m'],
          calculate: (inp) => inp.fv_m * (Math.pow(inp.fv_fv / inp.fv_pv, 1 / (inp.fv_n * inp.fv_m)) - 1) * 100
        },
        n: {
          name: 'Solve for n',
          latexFormula: '\\color{purple}{n} = \\frac{\\ln\\left(\\frac{\\color{blue}{FV}}{\\color{green}{PV}}\\right)}{\\color{orange}{m} \\times \\ln\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}',
          inputs: ['fv_fv', 'fv_pv', 'fv_r', 'fv_m'],
          calculate: (inp) => Math.log(inp.fv_fv / inp.fv_pv) / (inp.fv_m * Math.log(1 + inp.fv_r / 100 / inp.fv_m))
        },
        m: {
          name: 'Solve for m (Numerical)',
          latexFormula: '\\color{orange}{m} \\text{ solved numerically from: } \\color{blue}{FV} = \\color{green}{PV} \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}',
          inputs: ['fv_fv', 'fv_pv', 'fv_r', 'fv_n'],
          calculate: (inp) => {
            const targetFV = inp.fv_fv;
            const calcFV = (m) => inp.fv_pv * Math.pow(1 + inp.fv_r / 100 / m, inp.fv_n * m);
            return solveForVariable(targetFV, calcFV, 12, 100, 0.001);
          }
        }
      }
    },
    pv: {
      name: 'Present Value (Lump Sum)',
      formula: 'PV = FV / (1 + r/m)^(n×m)',
      latexFormula: '\\color{green}{PV} = \\frac{\\color{blue}{FV}}{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}}',
      description: 'Present value with periodic compounding',
      category: 'Lump Sum',
      variables: [
        { key: 'pv_fv', label: 'Future Value (FV)', symbol: 'FV' },
        { key: 'pv_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'pv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'pv_m', label: 'Compounding Periods/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => inp.pv_fv / Math.pow(1 + inp.pv_r / 100 / inp.pv_m, inp.pv_n * inp.pv_m),
      timeline: true,
      variations: {
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\frac{\\color{blue}{FV}}{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}}',
          inputs: ['pv_fv', 'pv_r', 'pv_n', 'pv_m'],
          calculate: (inp) => inp.pv_fv / Math.pow(1 + inp.pv_r / 100 / inp.pv_m, inp.pv_n * inp.pv_m)
        },
        FV: {
          name: 'Solve for FV',
          latexFormula: '\\color{blue}{FV} = \\color{green}{PV} \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}',
          inputs: ['pv_pv', 'pv_r', 'pv_n', 'pv_m'],
          calculate: (inp) => inp.pv_pv * Math.pow(1 + inp.pv_r / 100 / inp.pv_m, inp.pv_n * inp.pv_m)
        },
        r: {
          name: 'Solve for r',
          latexFormula: '\\color{red}{r} = \\color{orange}{m} \\times \\left[\\left(\\frac{\\color{blue}{FV}}{\\color{green}{PV}}\\right)^{\\frac{1}{\\color{purple}{n} \\times \\color{orange}{m}}} - 1\\right]',
          inputs: ['pv_fv', 'pv_pv', 'pv_n', 'pv_m'],
          calculate: (inp) => inp.pv_m * (Math.pow(inp.pv_fv / inp.pv_pv, 1 / (inp.pv_n * inp.pv_m)) - 1) * 100
        },
        n: {
          name: 'Solve for n',
          latexFormula: '\\color{purple}{n} = \\frac{\\ln\\left(\\frac{\\color{blue}{FV}}{\\color{green}{PV}}\\right)}{\\color{orange}{m} \\times \\ln\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}',
          inputs: ['pv_fv', 'pv_pv', 'pv_r', 'pv_m'],
          calculate: (inp) => Math.log(inp.pv_fv / inp.pv_pv) / (inp.pv_m * Math.log(1 + inp.pv_r / 100 / inp.pv_m))
        },
        m: {
          name: 'Solve for m (Numerical)',
          latexFormula: '\\color{orange}{m} \\text{ solved numerically from: } \\color{green}{PV} = \\frac{\\color{blue}{FV}}{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}}',
          inputs: ['pv_fv', 'pv_pv', 'pv_r', 'pv_n'],
          calculate: (inp) => {
            const targetPV = inp.pv_pv;
            const calcPV = (m) => inp.pv_fv / Math.pow(1 + inp.pv_r / 100 / m, inp.pv_n * m);
            return solveForVariable(targetPV, calcPV, 12, 100, 0.001);
          }
        }
      }
    },
    perp: {
      name: 'Perpetuity (No Growth)',
      formula: 'PV = PMT / r',
      latexFormula: '\\color{green}{PV} = \\frac{\\color{teal}{PMT}}{\\color{red}{r}}',
      description: 'Infinite stream of equal payments',
      category: 'Perpetuities',
      variables: [
        { key: 'perp_pmt', label: 'Payment (PMT)', symbol: 'PMT' },
        { key: 'perp_r', label: 'Interest Rate (%)', symbol: 'r' }
      ],
      calculate: (inp) => inp.perp_pmt / (inp.perp_r / 100),
      timeline: false,
      variations: {
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\frac{\\color{teal}{PMT}}{\\color{red}{r}}',
          inputs: ['perp_pmt', 'perp_r'],
          calculate: (inp) => inp.perp_pmt / (inp.perp_r / 100)
        },
        PMT: {
          name: 'Solve for PMT',
          latexFormula: '\\color{teal}{PMT} = \\color{green}{PV} \\times \\color{red}{r}',
          inputs: ['perp_pv', 'perp_r'],
          calculate: (inp) => inp.perp_pv * (inp.perp_r / 100)
        },
        r: {
          name: 'Solve for r',
          latexFormula: '\\color{red}{r} = \\frac{\\color{teal}{PMT}}{\\color{green}{PV}}',
          inputs: ['perp_pmt', 'perp_pv'],
          calculate: (inp) => (inp.perp_pmt / inp.perp_pv) * 100
        }
      }
    },
    gperp: {
      name: 'Growing Perpetuity',
      formula: 'PV = PMT / (r - g)',
      latexFormula: '\\color{green}{PV} = \\frac{\\color{teal}{PMT}}{\\color{red}{r} - \\color{violet}{g}}',
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
      timeline: false,
      variations: {
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\frac{\\color{teal}{PMT}}{\\color{red}{r} - \\color{violet}{g}}',
          inputs: ['gperp_pmt', 'gperp_r', 'gperp_g'],
          calculate: (inp) => {
            const r = inp.gperp_r / 100;
            const g = inp.gperp_g / 100;
            if (r <= g) return 'Error: r must be > g';
            return inp.gperp_pmt / (r - g);
          }
        },
        PMT: {
          name: 'Solve for PMT',
          latexFormula: '\\color{teal}{PMT} = \\color{green}{PV} \\times (\\color{red}{r} - \\color{violet}{g})',
          inputs: ['gperp_pv', 'gperp_r', 'gperp_g'],
          calculate: (inp) => inp.gperp_pv * (inp.gperp_r / 100 - inp.gperp_g / 100)
        },
        r: {
          name: 'Solve for r',
          latexFormula: '\\color{red}{r} = \\frac{\\color{teal}{PMT}}{\\color{green}{PV}} + \\color{violet}{g}',
          inputs: ['gperp_pmt', 'gperp_pv', 'gperp_g'],
          calculate: (inp) => (inp.gperp_pmt / inp.gperp_pv + inp.gperp_g / 100) * 100
        },
        g: {
          name: 'Solve for g',
          latexFormula: '\\color{violet}{g} = \\color{red}{r} - \\frac{\\color{teal}{PMT}}{\\color{green}{PV}}',
          inputs: ['gperp_pmt', 'gperp_pv', 'gperp_r'],
          calculate: (inp) => (inp.gperp_r / 100 - inp.gperp_pmt / inp.gperp_pv) * 100
        }
      }
    },
    ann_pv: {
      name: 'PV of Ordinary Annuity',
      formula: 'PV = PMT × [(1 - (1 + r/m)^(-n×m)) / (r/m)]',
      latexFormula: '\\color{green}{PV} = \\color{teal}{PMT} \\times \\left[\\frac{1 - \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{-\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right]',
      description: 'Payments at END of each period',
      category: 'Ordinary Annuities',
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
      timeline: true,
      variations: {
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\color{teal}{PMT} \\times \\left[\\frac{1 - \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{-\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right]',
          inputs: ['ann_pv_pmt', 'ann_pv_r', 'ann_pv_n', 'ann_pv_m'],
          calculate: (inp) => {
            const r = inp.ann_pv_r / 100 / inp.ann_pv_m;
            const n = inp.ann_pv_n * inp.ann_pv_m;
            return inp.ann_pv_pmt * ((1 - Math.pow(1 + r, -n)) / r);
          }
        },
        PMT: {
          name: 'Solve for PMT',
          latexFormula: '\\color{teal}{PMT} = \\frac{\\color{green}{PV}}{\\left[\\frac{1 - \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{-\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right]}',
          inputs: ['ann_pv_pv', 'ann_pv_r', 'ann_pv_n', 'ann_pv_m'],
          calculate: (inp) => {
            const r = inp.ann_pv_r / 100 / inp.ann_pv_m;
            const n = inp.ann_pv_n * inp.ann_pv_m;
            return inp.ann_pv_pv / ((1 - Math.pow(1 + r, -n)) / r);
          }
        },
        r: {
          name: 'Solve for r (IRR)',
          latexFormula: '\\color{red}{r} \\text{ solved numerically (IRR method)}',
          inputs: ['ann_pv_pv', 'ann_pv_pmt', 'ann_pv_n', 'ann_pv_m'],
          calculate: (inp) => {
            const targetPV = inp.ann_pv_pv;
            const calcPV = (annualRate) => {
              const r = annualRate / inp.ann_pv_m;
              const n = inp.ann_pv_n * inp.ann_pv_m;
              return inp.ann_pv_pmt * ((1 - Math.pow(1 + r, -n)) / r);
            };
            return solveRate(targetPV, calcPV, 0.05, 100, 0.00001);
          }
        },
        n: {
          name: 'Solve for n',
          latexFormula: '\\color{purple}{n} = -\\frac{\\ln\\left(1 - \\frac{\\color{green}{PV} \\times \\frac{\\color{red}{r}}{\\color{orange}{m}}}{\\color{teal}{PMT}}\\right)}{\\color{orange}{m} \\times \\ln\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}',
          inputs: ['ann_pv_pv', 'ann_pv_pmt', 'ann_pv_r', 'ann_pv_m'],
          calculate: (inp) => {
            const r = inp.ann_pv_r / 100 / inp.ann_pv_m;
            return -Math.log(1 - (inp.ann_pv_pv * r) / inp.ann_pv_pmt) / (inp.ann_pv_m * Math.log(1 + r));
          }
        },
        m: {
          name: 'Solve for m (Numerical)',
          latexFormula: '\\color{orange}{m} \\text{ solved numerically from: } \\color{green}{PV} = \\color{teal}{PMT} \\times \\left[\\frac{1 - \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{-\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right]',
          inputs: ['ann_pv_pv', 'ann_pv_pmt', 'ann_pv_r', 'ann_pv_n'],
          calculate: (inp) => {
            const targetPV = inp.ann_pv_pv;
            const calcPV = (m) => {
              const r = inp.ann_pv_r / 100 / m;
              const n = inp.ann_pv_n * m;
              return inp.ann_pv_pmt * ((1 - Math.pow(1 + r, -n)) / r);
            };
            return solveForVariable(targetPV, calcPV, 12, 100, 0.001);
          }
        }
      }
    },
    ann_fv: {
      name: 'FV of Ordinary Annuity',
      formula: 'FV = PMT × [((1 + r/m)^(n×m) - 1) / (r/m)]',
      latexFormula: '\\color{blue}{FV} = \\color{teal}{PMT} \\times \\left[\\frac{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - 1}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right]',
      description: 'Payments at END of each period',
      category: 'Ordinary Annuities',
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
      timeline: true,
      variations: {
        FV: {
          name: 'Solve for FV',
          latexFormula: '\\color{blue}{FV} = \\color{teal}{PMT} \\times \\left[\\frac{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - 1}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right]',
          inputs: ['ann_fv_pmt', 'ann_fv_r', 'ann_fv_n', 'ann_fv_m'],
          calculate: (inp) => {
            const r = inp.ann_fv_r / 100 / inp.ann_fv_m;
            const n = inp.ann_fv_n * inp.ann_fv_m;
            return inp.ann_fv_pmt * ((Math.pow(1 + r, n) - 1) / r);
          }
        },
        PMT: {
          name: 'Solve for PMT',
          latexFormula: '\\color{teal}{PMT} = \\frac{\\color{blue}{FV}}{\\left[\\frac{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - 1}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right]}',
          inputs: ['ann_fv_fv', 'ann_fv_r', 'ann_fv_n', 'ann_fv_m'],
          calculate: (inp) => {
            const r = inp.ann_fv_r / 100 / inp.ann_fv_m;
            const n = inp.ann_fv_n * inp.ann_fv_m;
            return inp.ann_fv_fv / ((Math.pow(1 + r, n) - 1) / r);
          }
        },
        r: {
          name: 'Solve for r (IRR)',
          latexFormula: '\\color{red}{r} \\text{ solved numerically (IRR method)}',
          inputs: ['ann_fv_fv', 'ann_fv_pmt', 'ann_fv_n', 'ann_fv_m'],
          calculate: (inp) => {
            const targetFV = inp.ann_fv_fv;
            const calcFV = (annualRate) => {
              const r = annualRate / inp.ann_fv_m;
              const n = inp.ann_fv_n * inp.ann_fv_m;
              return inp.ann_fv_pmt * ((Math.pow(1 + r, n) - 1) / r);
            };
            return solveRate(targetFV, calcFV, 0.05, 100, 0.00001);
          }
        },
        n: {
          name: 'Solve for n',
          latexFormula: '\\color{purple}{n} = \\frac{\\ln\\left(1 + \\frac{\\color{blue}{FV} \\times \\frac{\\color{red}{r}}{\\color{orange}{m}}}{\\color{teal}{PMT}}\\right)}{\\color{orange}{m} \\times \\ln\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}',
          inputs: ['ann_fv_fv', 'ann_fv_pmt', 'ann_fv_r', 'ann_fv_m'],
          calculate: (inp) => {
            const r = inp.ann_fv_r / 100 / inp.ann_fv_m;
            return Math.log(1 + (inp.ann_fv_fv * r) / inp.ann_fv_pmt) / (inp.ann_fv_m * Math.log(1 + r));
          }
        },
        m: {
          name: 'Solve for m (Numerical)',
          latexFormula: '\\color{orange}{m} \\text{ solved numerically from: } \\color{blue}{FV} = \\color{teal}{PMT} \\times \\left[\\frac{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - 1}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right]',
          inputs: ['ann_fv_fv', 'ann_fv_pmt', 'ann_fv_r', 'ann_fv_n'],
          calculate: (inp) => {
            const targetFV = inp.ann_fv_fv;
            const calcFV = (m) => {
              const r = inp.ann_fv_r / 100 / m;
              const n = inp.ann_fv_n * m;
              return inp.ann_fv_pmt * ((Math.pow(1 + r, n) - 1) / r);
            };
            return solveForVariable(targetFV, calcFV, 12, 100, 0.001);
          }
        }
      }
    },
    annd_pv: {
      name: 'PV of Annuity Due',
      formula: 'PV = PMT × [(1 - (1 + r/m)^(-n×m)) / (r/m)] × (1 + r/m)',
      latexFormula: '\\color{green}{PV} = \\color{teal}{PMT} \\times \\left[\\frac{1 - \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{-\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)',
      description: 'Payments at BEGINNING of each period',
      category: 'Annuities Due',
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
      timeline: true,
      variations: {
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\color{teal}{PMT} \\times \\left[\\frac{1 - \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{-\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)',
          inputs: ['annd_pv_pmt', 'annd_pv_r', 'annd_pv_n', 'annd_pv_m'],
          calculate: (inp) => {
            const r = inp.annd_pv_r / 100 / inp.annd_pv_m;
            const n = inp.annd_pv_n * inp.annd_pv_m;
            return inp.annd_pv_pmt * ((1 - Math.pow(1 + r, -n)) / r) * (1 + r);
          }
        },
        PMT: {
          name: 'Solve for PMT',
          latexFormula: '\\color{teal}{PMT} = \\frac{\\color{green}{PV}}{\\left[\\frac{1 - \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{-\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}',
          inputs: ['annd_pv_pv', 'annd_pv_r', 'annd_pv_n', 'annd_pv_m'],
          calculate: (inp) => {
            const r = inp.annd_pv_r / 100 / inp.annd_pv_m;
            const n = inp.annd_pv_n * inp.annd_pv_m;
            return inp.annd_pv_pv / (((1 - Math.pow(1 + r, -n)) / r) * (1 + r));
          }
        },
        r: {
          name: 'Solve for r (IRR)',
          latexFormula: '\\color{red}{r} \\text{ solved numerically (IRR method)}',
          inputs: ['annd_pv_pv', 'annd_pv_pmt', 'annd_pv_n', 'annd_pv_m'],
          calculate: (inp) => {
            const targetPV = inp.annd_pv_pv;
            const calcPV = (annualRate) => {
              const r = annualRate / inp.annd_pv_m;
              const n = inp.annd_pv_n * inp.annd_pv_m;
              return inp.annd_pv_pmt * ((1 - Math.pow(1 + r, -n)) / r) * (1 + r);
            };
            return solveRate(targetPV, calcPV, 0.05, 100, 0.00001);
          }
        },
        n: {
          name: 'Solve for n',
          latexFormula: '\\color{purple}{n} = \\frac{-\\ln\\left(1 - \\frac{\\color{green}{PV} \\times \\frac{\\color{red}{r}}{\\color{orange}{m}}}{\\color{teal}{PMT} \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}\\right)}{\\color{orange}{m} \\times \\ln\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}',
          inputs: ['annd_pv_pv', 'annd_pv_pmt', 'annd_pv_r', 'annd_pv_m'],
          calculate: (inp) => {
            const r = inp.annd_pv_r / 100 / inp.annd_pv_m;
            return -Math.log(1 - (inp.annd_pv_pv * r) / (inp.annd_pv_pmt * (1 + r))) / (inp.annd_pv_m * Math.log(1 + r));
          }
        },
        m: {
          name: 'Solve for m (Numerical)',
          latexFormula: '\\color{orange}{m} \\text{ solved numerically}',
          inputs: ['annd_pv_pv', 'annd_pv_pmt', 'annd_pv_r', 'annd_pv_n'],
          calculate: (inp) => {
            const targetPV = inp.annd_pv_pv;
            const calcPV = (m) => {
              const r = inp.annd_pv_r / 100 / m;
              const n = inp.annd_pv_n * m;
              return inp.annd_pv_pmt * ((1 - Math.pow(1 + r, -n)) / r) * (1 + r);
            };
            return solveForVariable(targetPV, calcPV, 12, 100, 0.001);
          }
        }
      }
    },
    annd_fv: {
      name: 'FV of Annuity Due',
      formula: 'FV = PMT × [((1 + r/m)^(n×m) - 1) / (r/m)] × (1 + r/m)',
      latexFormula: '\\color{blue}{FV} = \\color{teal}{PMT} \\times \\left[\\frac{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - 1}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)',
      description: 'Payments at BEGINNING of each period',
      category: 'Annuities Due',
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
      timeline: true,
      variations: {
        FV: {
          name: 'Solve for FV',
          latexFormula: '\\color{blue}{FV} = \\color{teal}{PMT} \\times \\left[\\frac{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - 1}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)',
          inputs: ['annd_fv_pmt', 'annd_fv_r', 'annd_fv_n', 'annd_fv_m'],
          calculate: (inp) => {
            const r = inp.annd_fv_r / 100 / inp.annd_fv_m;
            const n = inp.annd_fv_n * inp.annd_fv_m;
            return inp.annd_fv_pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
          }
        },
        PMT: {
          name: 'Solve for PMT',
          latexFormula: '\\color{teal}{PMT} = \\frac{\\color{blue}{FV}}{\\left[\\frac{\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - 1}{\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}',
          inputs: ['annd_fv_fv', 'annd_fv_r', 'annd_fv_n', 'annd_fv_m'],
          calculate: (inp) => {
            const r = inp.annd_fv_r / 100 / inp.annd_fv_m;
            const n = inp.annd_fv_n * inp.annd_fv_m;
            return inp.annd_fv_fv / (((Math.pow(1 + r, n) - 1) / r) * (1 + r));
          }
        },
        r: {
          name: 'Solve for r (IRR)',
          latexFormula: '\\color{red}{r} \\text{ solved numerically (IRR method)}',
          inputs: ['annd_fv_fv', 'annd_fv_pmt', 'annd_fv_n', 'annd_fv_m'],
          calculate: (inp) => {
            const targetFV = inp.annd_fv_fv;
            const calcFV = (annualRate) => {
              const r = annualRate / inp.annd_fv_m;
              const n = inp.annd_fv_n * inp.annd_fv_m;
              return inp.annd_fv_pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
            };
            return solveRate(targetFV, calcFV, 0.05, 100, 0.00001);
          }
        },
        n: {
          name: 'Solve for n',
          latexFormula: '\\color{purple}{n} = \\frac{\\ln\\left(1 + \\frac{\\color{blue}{FV} \\times \\frac{\\color{red}{r}}{\\color{orange}{m}}}{\\color{teal}{PMT} \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}\\right)}{\\color{orange}{m} \\times \\ln\\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}',
          inputs: ['annd_fv_fv', 'annd_fv_pmt', 'annd_fv_r', 'annd_fv_m'],
          calculate: (inp) => {
            const r = inp.annd_fv_r / 100 / inp.annd_fv_m;
            return Math.log(1 + (inp.annd_fv_fv * r) / (inp.annd_fv_pmt * (1 + r))) / (inp.annd_fv_m * Math.log(1 + r));
          }
        },
        m: {
          name: 'Solve for m (Numerical)',
          latexFormula: '\\color{orange}{m} \\text{ solved numerically}',
          inputs: ['annd_fv_fv', 'annd_fv_pmt', 'annd_fv_r', 'annd_fv_n'],
          calculate: (inp) => {
            const targetFV = inp.annd_fv_fv;
            const calcFV = (m) => {
              const r = inp.annd_fv_r / 100 / m;
              const n = inp.annd_fv_n * m;
              return inp.annd_fv_pmt * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
            };
            return solveForVariable(targetFV, calcFV, 12, 100, 0.001);
          }
        }
      }
    },
    gann_pv: {
      name: 'PV of Growing Annuity',
      formula: 'PV = PMT × [(1 - ((1+g)/(1+r/m))^(n×m)) / (r/m - g)]',
      latexFormula: '\\color{green}{PV} = \\color{teal}{PMT} \\times \\left[\\frac{1 - \\left(\\frac{1+\\color{violet}{g}}{1+\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right]',
      description: 'Finite stream of growing payments',
      category: 'Ordinary Annuities',
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
      timeline: true,
      variations: {
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\color{teal}{PMT} \\times \\left[\\frac{1 - \\left(\\frac{1+\\color{violet}{g}}{1+\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right]',
          inputs: ['gann_pv_pmt', 'gann_pv_r', 'gann_pv_g', 'gann_pv_n', 'gann_pv_m'],
          calculate: (inp) => {
            const r = inp.gann_pv_r / 100 / inp.gann_pv_m;
            const g = inp.gann_pv_g / 100;
            const n = inp.gann_pv_n * inp.gann_pv_m;
            if (r === g) return inp.gann_pv_pmt * n / (1 + r);
            return inp.gann_pv_pmt * ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g));
          }
        },
        PMT: {
          name: 'Solve for PMT',
          latexFormula: '\\color{teal}{PMT} = \\frac{\\color{green}{PV}}{\\left[\\frac{1 - \\left(\\frac{1+\\color{violet}{g}}{1+\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right]}',
          inputs: ['gann_pv_pv', 'gann_pv_r', 'gann_pv_g', 'gann_pv_n', 'gann_pv_m'],
          calculate: (inp) => {
            const r = inp.gann_pv_r / 100 / inp.gann_pv_m;
            const g = inp.gann_pv_g / 100;
            const n = inp.gann_pv_n * inp.gann_pv_m;
            if (r === g) return inp.gann_pv_pv * (1 + r) / n;
            return inp.gann_pv_pv / ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g));
          }
        },
        r: {
          name: 'Solve for r (IRR)',
          latexFormula: '\\color{red}{r} \\text{ solved numerically (IRR method)}',
          inputs: ['gann_pv_pv', 'gann_pv_pmt', 'gann_pv_g', 'gann_pv_n', 'gann_pv_m'],
          calculate: (inp) => {
            const targetPV = inp.gann_pv_pv;
            const calcPV = (annualRate) => {
              const r = annualRate / inp.gann_pv_m;
              const g = inp.gann_pv_g / 100;
              const n = inp.gann_pv_n * inp.gann_pv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_pv_pmt * n / (1 + r);
              return inp.gann_pv_pmt * ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g));
            };
            return solveRate(targetPV, calcPV, 0.08, 100, 0.00001);
          }
        },
        n: {
          name: 'Solve for n (Numerical)',
          latexFormula: '\\color{purple}{n} \\text{ solved numerically from growing annuity formula}',
          inputs: ['gann_pv_pv', 'gann_pv_pmt', 'gann_pv_r', 'gann_pv_g', 'gann_pv_m'],
          calculate: (inp) => {
            const targetPV = inp.gann_pv_pv;
            const calcPV = (years) => {
              const r = inp.gann_pv_r / 100 / inp.gann_pv_m;
              const g = inp.gann_pv_g / 100;
              const n = years * inp.gann_pv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_pv_pmt * n / (1 + r);
              return inp.gann_pv_pmt * ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g));
            };
            return solveForVariable(targetPV, calcPV, 10, 100, 0.001);
          }
        },
        g: {
          name: 'Solve for g (Numerical)',
          latexFormula: '\\color{violet}{g} \\text{ solved numerically from growing annuity formula}',
          inputs: ['gann_pv_pv', 'gann_pv_pmt', 'gann_pv_r', 'gann_pv_n', 'gann_pv_m'],
          calculate: (inp) => {
            const targetPV = inp.gann_pv_pv;
            const calcPV = (growthRate) => {
              const r = inp.gann_pv_r / 100 / inp.gann_pv_m;
              const g = growthRate / 100;
              const n = inp.gann_pv_n * inp.gann_pv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_pv_pmt * n / (1 + r);
              return inp.gann_pv_pmt * ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g));
            };
            return solveRate(targetPV, calcPV, 3, 100, 0.00001);
          }
        }
      }
    },
    gann_fv: {
      name: 'FV of Growing Annuity',
      formula: 'FV = PMT × [((1+r/m)^(n×m) - (1+g)^(n×m)) / (r/m - g)]',
      latexFormula: '\\color{blue}{FV} = \\color{teal}{PMT} \\times \\left[\\frac{\\left(1+\\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - (1+\\color{violet}{g})^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right]',
      description: 'Future value of finite growing payments',
      category: 'Ordinary Annuities',
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
      timeline: true,
      variations: {
        FV: {
          name: 'Solve for FV',
          latexFormula: '\\color{blue}{FV} = \\color{teal}{PMT} \\times \\left[\\frac{\\left(1+\\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - (1+\\color{violet}{g})^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right]',
          inputs: ['gann_fv_pmt', 'gann_fv_r', 'gann_fv_g', 'gann_fv_n', 'gann_fv_m'],
          calculate: (inp) => {
            const r = inp.gann_fv_r / 100 / inp.gann_fv_m;
            const g = inp.gann_fv_g / 100;
            const n = inp.gann_fv_n * inp.gann_fv_m;
            if (r === g) return inp.gann_fv_pmt * n * Math.pow(1 + r, n - 1);
            return inp.gann_fv_pmt * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g));
          }
        },
        PMT: {
          name: 'Solve for PMT',
          latexFormula: '\\color{teal}{PMT} = \\frac{\\color{blue}{FV}}{\\left[\\frac{\\left(1+\\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - (1+\\color{violet}{g})^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right]}',
          inputs: ['gann_fv_fv', 'gann_fv_r', 'gann_fv_g', 'gann_fv_n', 'gann_fv_m'],
          calculate: (inp) => {
            const r = inp.gann_fv_r / 100 / inp.gann_fv_m;
            const g = inp.gann_fv_g / 100;
            const n = inp.gann_fv_n * inp.gann_fv_m;
            if (r === g) return inp.gann_fv_fv / (n * Math.pow(1 + r, n - 1));
            return inp.gann_fv_fv / ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g));
          }
        },
        r: {
          name: 'Solve for r (IRR)',
          latexFormula: '\\color{red}{r} \\text{ solved numerically (IRR method)}',
          inputs: ['gann_fv_fv', 'gann_fv_pmt', 'gann_fv_g', 'gann_fv_n', 'gann_fv_m'],
          calculate: (inp) => {
            const targetFV = inp.gann_fv_fv;
            const calcFV = (annualRate) => {
              const r = annualRate / inp.gann_fv_m;
              const g = inp.gann_fv_g / 100;
              const n = inp.gann_fv_n * inp.gann_fv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_fv_pmt * n * Math.pow(1 + r, n - 1);
              return inp.gann_fv_pmt * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g));
            };
            return solveRate(targetFV, calcFV, 0.08, 100, 0.00001);
          }
        },
        n: {
          name: 'Solve for n (Numerical)',
          latexFormula: '\\color{purple}{n} \\text{ solved numerically from growing annuity formula}',
          inputs: ['gann_fv_fv', 'gann_fv_pmt', 'gann_fv_r', 'gann_fv_g', 'gann_fv_m'],
          calculate: (inp) => {
            const targetFV = inp.gann_fv_fv;
            const calcFV = (years) => {
              const r = inp.gann_fv_r / 100 / inp.gann_fv_m;
              const g = inp.gann_fv_g / 100;
              const n = years * inp.gann_fv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_fv_pmt * n * Math.pow(1 + r, n - 1);
              return inp.gann_fv_pmt * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g));
            };
            return solveForVariable(targetFV, calcFV, 10, 100, 0.001);
          }
        },
        g: {
          name: 'Solve for g (Numerical)',
          latexFormula: '\\color{violet}{g} \\text{ solved numerically from growing annuity formula}',
          inputs: ['gann_fv_fv', 'gann_fv_pmt', 'gann_fv_r', 'gann_fv_n', 'gann_fv_m'],
          calculate: (inp) => {
            const targetFV = inp.gann_fv_fv;
            const calcFV = (growthRate) => {
              const r = inp.gann_fv_r / 100 / inp.gann_fv_m;
              const g = growthRate / 100;
              const n = inp.gann_fv_n * inp.gann_fv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_fv_pmt * n * Math.pow(1 + r, n - 1);
              return inp.gann_fv_pmt * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g));
            };
            return solveRate(targetFV, calcFV, 3, 100, 0.00001);
          }
        }
      }
    },
    gann_due_pv: {
      name: 'PV of Growing Annuity Due',
      formula: 'PV = PMT × [(1 - ((1+g)/(1+r/m))^(n×m)) / (r/m - g)] × (1 + r/m)',
      latexFormula: '\\color{green}{PV} = \\color{teal}{PMT} \\times \\left[\\frac{1 - \\left(\\frac{1+\\color{violet}{g}}{1+\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)',
      description: 'Payments at START of each period, growing',
      category: 'Annuities Due',
      variables: [
        { key: 'gann_due_pv_pmt', label: 'Initial Payment (PMT)', symbol: 'PMT' },
        { key: 'gann_due_pv_r', label: 'Annual Discount Rate (%)', symbol: 'r' },
        { key: 'gann_due_pv_g', label: 'Growth Rate per Period (%)', symbol: 'g' },
        { key: 'gann_due_pv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'gann_due_pv_m', label: 'Payments/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => {
        const r = inp.gann_due_pv_r / 100 / inp.gann_due_pv_m;
        const g = inp.gann_due_pv_g / 100;
        const n = inp.gann_due_pv_n * inp.gann_due_pv_m;
        if (r === g) return inp.gann_due_pv_pmt * n;
        return inp.gann_due_pv_pmt * ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g)) * (1 + r);
      },
      timeline: true,
      variations: {
        PV: {
          name: 'Solve for PV',
          latexFormula: '\\color{green}{PV} = \\color{teal}{PMT} \\times \\left[\\frac{1 - \\left(\\frac{1+\\color{violet}{g}}{1+\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)',
          inputs: ['gann_due_pv_pmt', 'gann_due_pv_r', 'gann_due_pv_g', 'gann_due_pv_n', 'gann_due_pv_m'],
          calculate: (inp) => {
            const r = inp.gann_due_pv_r / 100 / inp.gann_due_pv_m;
            const g = inp.gann_due_pv_g / 100;
            const n = inp.gann_due_pv_n * inp.gann_due_pv_m;
            if (r === g) return inp.gann_due_pv_pmt * n;
            return inp.gann_due_pv_pmt * ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g)) * (1 + r);
          }
        },
        PMT: {
          name: 'Solve for PMT',
          latexFormula: '\\color{teal}{PMT} = \\frac{\\color{green}{PV}}{\\left[\\frac{1 - \\left(\\frac{1+\\color{violet}{g}}{1+\\frac{\\color{red}{r}}{\\color{orange}{m}}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}',
          inputs: ['gann_due_pv_pv', 'gann_due_pv_r', 'gann_due_pv_g', 'gann_due_pv_n', 'gann_due_pv_m'],
          calculate: (inp) => {
            const r = inp.gann_due_pv_r / 100 / inp.gann_due_pv_m;
            const g = inp.gann_due_pv_g / 100;
            const n = inp.gann_due_pv_n * inp.gann_due_pv_m;
            if (r === g) return inp.gann_due_pv_pv / n;
            return inp.gann_due_pv_pv / (((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g)) * (1 + r));
          }
        },
        r: {
          name: 'Solve for r (IRR)',
          latexFormula: '\\color{red}{r} \\text{ solved numerically (IRR method)}',
          inputs: ['gann_due_pv_pv', 'gann_due_pv_pmt', 'gann_due_pv_g', 'gann_due_pv_n', 'gann_due_pv_m'],
          calculate: (inp) => {
            const targetPV = inp.gann_due_pv_pv;
            const calcPV = (annualRate) => {
              const r = annualRate / inp.gann_due_pv_m;
              const g = inp.gann_due_pv_g / 100;
              const n = inp.gann_due_pv_n * inp.gann_due_pv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_due_pv_pmt * n;
              return inp.gann_due_pv_pmt * ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g)) * (1 + r);
            };
            return solveRate(targetPV, calcPV, 0.08, 100, 0.00001);
          }
        },
        n: {
          name: 'Solve for n (Numerical)',
          latexFormula: '\\color{purple}{n} \\text{ solved numerically from growing annuity due formula}',
          inputs: ['gann_due_pv_pv', 'gann_due_pv_pmt', 'gann_due_pv_r', 'gann_due_pv_g', 'gann_due_pv_m'],
          calculate: (inp) => {
            const targetPV = inp.gann_due_pv_pv;
            const calcPV = (years) => {
              const r = inp.gann_due_pv_r / 100 / inp.gann_due_pv_m;
              const g = inp.gann_due_pv_g / 100;
              const n = years * inp.gann_due_pv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_due_pv_pmt * n;
              return inp.gann_due_pv_pmt * ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g)) * (1 + r);
            };
            return solveForVariable(targetPV, calcPV, 10, 100, 0.001);
          }
        },
        g: {
          name: 'Solve for g (Numerical)',
          latexFormula: '\\color{violet}{g} \\text{ solved numerically from growing annuity due formula}',
          inputs: ['gann_due_pv_pv', 'gann_due_pv_pmt', 'gann_due_pv_r', 'gann_due_pv_n', 'gann_due_pv_m'],
          calculate: (inp) => {
            const targetPV = inp.gann_due_pv_pv;
            const calcPV = (growthRate) => {
              const r = inp.gann_due_pv_r / 100 / inp.gann_due_pv_m;
              const g = growthRate / 100;
              const n = inp.gann_due_pv_n * inp.gann_due_pv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_due_pv_pmt * n;
              return inp.gann_due_pv_pmt * ((1 - Math.pow((1 + g) / (1 + r), n)) / (r - g)) * (1 + r);
            };
            return solveRate(targetPV, calcPV, 3, 100, 0.00001);
          }
        }
      }
    },
    gann_due_fv: {
      name: 'FV of Growing Annuity Due',
      formula: 'FV = PMT × [((1+r/m)^(n×m) - (1+g)^(n×m)) / (r/m - g)] × (1 + r/m)',
      latexFormula: '\\color{blue}{FV} = \\color{teal}{PMT} \\times \\left[\\frac{\\left(1+\\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - (1+\\color{violet}{g})^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)',
      description: 'Payments at START of each period, growing',
      category: 'Annuities Due',
      variables: [
        { key: 'gann_due_fv_pmt', label: 'Initial Payment (PMT)', symbol: 'PMT' },
        { key: 'gann_due_fv_r', label: 'Annual Interest Rate (%)', symbol: 'r' },
        { key: 'gann_due_fv_g', label: 'Growth Rate per Period (%)', symbol: 'g' },
        { key: 'gann_due_fv_n', label: 'Number of Years (n)', symbol: 'n' },
        { key: 'gann_due_fv_m', label: 'Payments/Year (m)', symbol: 'm' }
      ],
      calculate: (inp) => {
        const r = inp.gann_due_fv_r / 100 / inp.gann_due_fv_m;
        const g = inp.gann_due_fv_g / 100;
        const n = inp.gann_due_fv_n * inp.gann_due_fv_m;
        if (r === g) return inp.gann_due_fv_pmt * n * Math.pow(1 + r, n);
        return inp.gann_due_fv_pmt * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g)) * (1 + r);
      },
      timeline: true,
      variations: {
        FV: {
          name: 'Solve for FV',
          latexFormula: '\\color{blue}{FV} = \\color{teal}{PMT} \\times \\left[\\frac{\\left(1+\\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - (1+\\color{violet}{g})^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)',
          inputs: ['gann_due_fv_pmt', 'gann_due_fv_r', 'gann_due_fv_g', 'gann_due_fv_n', 'gann_due_fv_m'],
          calculate: (inp) => {
            const r = inp.gann_due_fv_r / 100 / inp.gann_due_fv_m;
            const g = inp.gann_due_fv_g / 100;
            const n = inp.gann_due_fv_n * inp.gann_due_fv_m;
            if (r === g) return inp.gann_due_fv_pmt * n * Math.pow(1 + r, n);
            return inp.gann_due_fv_pmt * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g)) * (1 + r);
          }
        },
        PMT: {
          name: 'Solve for PMT',
          latexFormula: '\\color{teal}{PMT} = \\frac{\\color{blue}{FV}}{\\left[\\frac{\\left(1+\\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{purple}{n} \\times \\color{orange}{m}} - (1+\\color{violet}{g})^{\\color{purple}{n} \\times \\color{orange}{m}}}{\\frac{\\color{red}{r}}{\\color{orange}{m}} - \\color{violet}{g}}\\right] \\times \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)}',
          inputs: ['gann_due_fv_fv', 'gann_due_fv_r', 'gann_due_fv_g', 'gann_due_fv_n', 'gann_due_fv_m'],
          calculate: (inp) => {
            const r = inp.gann_due_fv_r / 100 / inp.gann_due_fv_m;
            const g = inp.gann_due_fv_g / 100;
            const n = inp.gann_due_fv_n * inp.gann_due_fv_m;
            if (r === g) return inp.gann_due_fv_fv / (n * Math.pow(1 + r, n));
            return inp.gann_due_fv_fv / (((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g)) * (1 + r));
          }
        },
        r: {
          name: 'Solve for r (IRR)',
          latexFormula: '\\color{red}{r} \\text{ solved numerically (IRR method)}',
          inputs: ['gann_due_fv_fv', 'gann_due_fv_pmt', 'gann_due_fv_g', 'gann_due_fv_n', 'gann_due_fv_m'],
          calculate: (inp) => {
            const targetFV = inp.gann_due_fv_fv;
            const calcFV = (annualRate) => {
              const r = annualRate / inp.gann_due_fv_m;
              const g = inp.gann_due_fv_g / 100;
              const n = inp.gann_due_fv_n * inp.gann_due_fv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_due_fv_pmt * n * Math.pow(1 + r, n);
              return inp.gann_due_fv_pmt * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g)) * (1 + r);
            };
            return solveRate(targetFV, calcFV, 0.08, 100, 0.00001);
          }
        },
        n: {
          name: 'Solve for n (Numerical)',
          latexFormula: '\\color{purple}{n} \\text{ solved numerically from growing annuity due formula}',
          inputs: ['gann_due_fv_fv', 'gann_due_fv_pmt', 'gann_due_fv_r', 'gann_due_fv_g', 'gann_due_fv_m'],
          calculate: (inp) => {
            const targetFV = inp.gann_due_fv_fv;
            const calcFV = (years) => {
              const r = inp.gann_due_fv_r / 100 / inp.gann_due_fv_m;
              const g = inp.gann_due_fv_g / 100;
              const n = years * inp.gann_due_fv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_due_fv_pmt * n * Math.pow(1 + r, n);
              return inp.gann_due_fv_pmt * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g)) * (1 + r);
            };
            return solveForVariable(targetFV, calcFV, 10, 100, 0.001);
          }
        },
        g: {
          name: 'Solve for g (Numerical)',
          latexFormula: '\\color{violet}{g} \\text{ solved numerically from growing annuity due formula}',
          inputs: ['gann_due_fv_fv', 'gann_due_fv_pmt', 'gann_due_fv_r', 'gann_due_fv_n', 'gann_due_fv_m'],
          calculate: (inp) => {
            const targetFV = inp.gann_due_fv_fv;
            const calcFV = (growthRate) => {
              const r = inp.gann_due_fv_r / 100 / inp.gann_due_fv_m;
              const g = growthRate / 100;
              const n = inp.gann_due_fv_n * inp.gann_due_fv_m;
              if (Math.abs(r - g) < 0.0000001) return inp.gann_due_fv_pmt * n * Math.pow(1 + r, n);
              return inp.gann_due_fv_pmt * ((Math.pow(1 + r, n) - Math.pow(1 + g, n)) / (r - g)) * (1 + r);
            };
            return solveRate(targetFV, calcFV, 3, 100, 0.00001);
          }
        }
      }
    }
  };

  // Practice Problems Data Structure
  const practiceProblems = [
    {
      id: 1,
      title: 'Saving for College',
      difficulty: 'beginner',
      category: 'Future Value',
      type: 'Calculation',
      problem: 'You want to save $50,000 for your child\'s college education in 10 years. If you can invest at an annual rate of 7%, compounded annually, how much do you need to invest today?',
      hint: 'This is a Present Value problem. You know the Future Value ($50,000), the rate (7%), and the time (10 years). Use the PV formula.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the variables', detail: 'FV = $50,000, r = 7% = 0.07, n = 10 years', latex: '\\begin{aligned} FV &= \\$50{,}000 \\\\ r &= 7\\% = 0.07 \\\\ n &= 10 \\text{ years} \\end{aligned}' },
          { step: 2, description: 'Choose the formula', detail: 'Use the Present Value formula', latex: 'PV = \\frac{FV}{(1 + r)^n}' },
          { step: 3, description: 'Substitute values', detail: 'Substitute the known values into the formula', latex: 'PV = \\frac{\\$50{,}000}{(1 + 0.07)^{10}}' },
          { step: 4, description: 'Calculate (1 + r)^n', detail: 'First calculate the denominator', latex: '(1 + 0.07)^{10} = (1.07)^{10} = 1.9672' },
          { step: 5, description: 'Complete the calculation', detail: 'Divide to find the present value', latex: 'PV = \\frac{\\$50{,}000}{1.9672} = \\$25{,}417.61' }
        ],
        answer: '$25,417.61',
        explanation: 'You need to invest $25,417.61 today at 7% annual interest to have $50,000 in 10 years.'
      }
    },
    {
      id: 2,
      title: 'Loan Payment Calculation',
      difficulty: 'intermediate',
      category: 'Annuities',
      type: 'Application',
      problem: 'You take out a $200,000 mortgage at 4.5% annual interest for 30 years, with monthly payments. What is your monthly payment?',
      hint: 'This is an annuity present value problem where you need to solve for PMT. Remember to adjust the rate and periods for monthly compounding.',
      solution: {
        steps: [
          { step: 1, description: 'Identify and convert variables', detail: 'Convert annual rate and years to monthly values', latex: '\\begin{aligned} PV &= \\$200{,}000 \\\\ r_{\\text{annual}} &= 4.5\\% \\\\ r_{\\text{monthly}} &= \\frac{0.045}{12} = 0.00375 \\\\ n &= 30 \\times 12 = 360 \\text{ months} \\end{aligned}' },
          { step: 2, description: 'Choose the annuity formula', detail: 'Present value of ordinary annuity formula', latex: 'PV = PMT \\times \\frac{1 - (1 + r)^{-n}}{r}' },
          { step: 3, description: 'Rearrange to solve for PMT', detail: 'Isolate the payment variable', latex: 'PMT = PV \\times \\frac{r}{1 - (1 + r)^{-n}}' },
          { step: 4, description: 'Calculate the discount factor', detail: 'Calculate the denominator term', latex: '\\frac{0.00375}{1 - (1.00375)^{-360}} = \\frac{0.00375}{1 - 0.2604} = \\frac{0.00375}{0.7396} = 0.005067' },
          { step: 5, description: 'Calculate the monthly payment', detail: 'Multiply by the loan amount', latex: 'PMT = \\$200{,}000 \\times 0.005067 = \\$1{,}013.37' }
        ],
        answer: '$1,013.37 per month',
        explanation: 'Your monthly mortgage payment would be $1,013.37 for 30 years to pay off the $200,000 loan.'
      }
    },
    {
      id: 3,
      title: 'Investment Growth Comparison',
      difficulty: 'beginner',
      category: 'Compound Interest',
      type: 'Conceptual',
      problem: 'You invest $10,000 at 6% annual interest. How much more will you have after 20 years with monthly compounding versus annual compounding?',
      hint: 'Calculate the future value with both compounding frequencies and find the difference.',
      solution: {
        steps: [
          { step: 1, description: 'Calculate FV with annual compounding', detail: 'Use m = 1 for annual compounding', latex: 'FV_{\\text{annual}} = \\$10{,}000 \\times (1.06)^{20} = \\$10{,}000 \\times 3.2071 = \\$32{,}071.35' },
          { step: 2, description: 'Calculate FV with monthly compounding', detail: 'Use m = 12 for monthly compounding', latex: 'FV_{\\text{monthly}} = \\$10{,}000 \\times \\left(1 + \\frac{0.06}{12}\\right)^{20 \\times 12} = \\$10{,}000 \\times (1.005)^{240}' },
          { step: 3, description: 'Evaluate the monthly compounding result', detail: 'Calculate the exponential term', latex: 'FV_{\\text{monthly}} = \\$10{,}000 \\times 3.3102 = \\$33{,}102.04' },
          { step: 4, description: 'Find the difference', detail: 'Subtract annual from monthly result', latex: '\\text{Difference} = \\$33{,}102.04 - \\$32{,}071.35 = \\$1{,}030.69' }
        ],
        answer: '$1,030.69',
        explanation: 'Monthly compounding results in $1,030.69 more than annual compounding due to more frequent interest calculations.'
      }
    },
    {
      id: 4,
      title: 'Retirement Savings Goal',
      difficulty: 'intermediate',
      category: 'Annuities',
      type: 'Calculation',
      problem: 'You want to have $1,000,000 saved for retirement in 25 years. If you can earn 8% annually and make monthly contributions, how much should you save each month?',
      hint: 'This is a future value of annuity problem. You need to solve for the payment (PMT) given the future value target.',
      solution: {
        steps: [
          { step: 1, description: 'Identify and convert variables', detail: 'Convert annual values to monthly', latex: '\\begin{aligned} FV &= \\$1{,}000{,}000 \\\\ r_{\\text{monthly}} &= \\frac{0.08}{12} = 0.006667 \\\\ n &= 25 \\times 12 = 300 \\text{ months} \\end{aligned}' },
          { step: 2, description: 'Future value of annuity formula', detail: 'Formula for FV of ordinary annuity', latex: 'FV = PMT \\times \\frac{(1 + r)^n - 1}{r}' },
          { step: 3, description: 'Rearrange to solve for PMT', detail: 'Isolate the payment', latex: 'PMT = FV \\times \\frac{r}{(1 + r)^n - 1}' },
          { step: 4, description: 'Calculate the growth factor', detail: 'Evaluate the denominator', latex: '(1.006667)^{300} - 1 = 7.6757 - 1 = 6.6757' },
          { step: 5, description: 'Calculate monthly payment', detail: 'Final calculation', latex: 'PMT = \\$1{,}000{,}000 \\times \\frac{0.006667}{6.6757} = \\$1{,}000{,}000 \\times 0.000999 = \\$869.00' }
        ],
        answer: '$869.00 per month',
        explanation: 'By saving $869 per month for 25 years at 8% annual return, you will accumulate $1,000,000 for retirement.'
      }
    },
    {
      id: 5,
      title: 'Effective Annual Rate',
      difficulty: 'advanced',
      category: 'Interest Rates',
      type: 'Calculation',
      problem: 'A credit card charges 18% APR with daily compounding. What is the Effective Annual Rate (EAR)?',
      hint: 'Use the EAR formula: EAR = (1 + r/m)^m - 1, where m is the number of compounding periods per year.',
      solution: {
        steps: [
          { step: 1, description: 'Identify the variables', detail: 'Stated APR and compounding frequency', latex: '\\begin{aligned} \\text{APR} &= 18\\% = 0.18 \\\\ m &= 365 \\text{ (daily compounding)} \\end{aligned}' },
          { step: 2, description: 'Apply the EAR formula', detail: 'Effective Annual Rate formula', latex: 'EAR = \\left(1 + \\frac{r}{m}\\right)^m - 1' },
          { step: 3, description: 'Substitute values', detail: 'Plug in APR and m', latex: 'EAR = \\left(1 + \\frac{0.18}{365}\\right)^{365} - 1' },
          { step: 4, description: 'Calculate daily rate', detail: 'First find the daily rate', latex: '\\frac{0.18}{365} = 0.0004932 \\text{ per day}' },
          { step: 5, description: 'Complete the calculation', detail: 'Raise to the 365th power and subtract 1', latex: 'EAR = (1.0004932)^{365} - 1 = 1.1972 - 1 = 0.1972 = 19.72\\%' }
        ],
        answer: '19.72%',
        explanation: 'The true annual rate is 19.72%, which is higher than the stated 18% APR due to daily compounding.'
      }
    },
    {
      id: 6,
      title: 'Perpetuity Valuation',
      difficulty: 'advanced',
      category: 'Perpetuities',
      type: 'Application',
      problem: 'A preferred stock pays a $5 dividend annually forever. If the required return is 8%, what is the value of this stock?',
      hint: 'This is a perpetuity. Use the simple perpetuity formula: PV = PMT / r',
      solution: {
        steps: [
          { step: 1, description: 'Identify the problem type', detail: 'This is a perpetuity since dividends continue forever', latex: '\\text{Perpetuity: } n \\to \\infty' },
          { step: 2, description: 'Identify the variables', detail: 'Annual payment and required return', latex: '\\begin{aligned} PMT &= \\$5 \\text{ per year} \\\\ r &= 8\\% = 0.08 \\end{aligned}' },
          { step: 3, description: 'Apply perpetuity formula', detail: 'The simplified perpetuity formula', latex: 'PV_{\\text{perpetuity}} = \\frac{PMT}{r}' },
          { step: 4, description: 'Substitute and calculate', detail: 'Calculate the present value', latex: 'PV = \\frac{\\$5}{0.08} = \\$62.50' }
        ],
        answer: '$62.50',
        explanation: 'The preferred stock is worth $62.50. At this price, the $5 annual dividend provides an 8% return forever.'
      }
    }
  ];

  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const calculateResult = () => {
    const formula = formulas[activeFormula];
    let result;

    if (formula.variations && activeVariation) {
      // Use variation formula
      result = formula.variations[activeVariation].calculate(inputs);
    } else {
      // Use default formula
      result = formula.calculate(inputs);
    }

    setResults(prev => ({ ...prev, [`${activeFormula}_${activeVariation || 'default'}`]: result }));
  };

  const saveCalculation = () => {
    const formula = formulas[activeFormula];
    const currentResult = results[`${activeFormula}_${activeVariation || 'default'}`];

    if (currentResult === undefined) {
      return; // Silently do nothing if no result
    }

    const calculation = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      formulaKey: activeFormula,
      formulaName: formula.name,
      variation: activeVariation,
      variationName: activeVariation ? formula.variations[activeVariation].name : 'Default',
      inputs: { ...inputs },
      result: currentResult,
    };

    const updated = [...savedCalculations, calculation];
    setSavedCalculations(updated);
    localStorage.setItem('tvm_saved_calculations', JSON.stringify(updated));

    // Show toast notification
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const deleteCalculation = (id) => {
    const updated = savedCalculations.filter(calc => calc.id !== id);
    setSavedCalculations(updated);
    localStorage.setItem('tvm_saved_calculations', JSON.stringify(updated));
  };

  const restoreCalculation = (calculation) => {
    // Restore the formula
    setActiveFormula(calculation.formulaKey);

    // Restore inputs
    setInputs(calculation.inputs);

    // Restore variation
    if (calculation.variation) {
      setActiveVariation(calculation.variation);
    }

    // Restore result
    setResults(prev => ({
      ...prev,
      [`${calculation.formulaKey}_${calculation.variation || 'default'}`]: calculation.result
    }));

    // Close the panel
    setShowSavedPanel(false);
  };

  // Helper function that can work with any inputs
  const generateComparisonDataWith = (inputs) => {
    const pv = inputs.principal;
    const rate = inputs.rate;
    const years = inputs.years;
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

  // Legacy wrapper for existing code
  const generateComparisonData = () => generateComparisonDataWith(comparisonInputsA);

  const generateCompoundingFrequencyComparison = () => {
    const pv = freqInputs.principal;
    const rate = freqInputs.rate;
    const years = freqInputs.years;
    const r = rate / 100;

    return [
      { name: 'Simple', value: pv * (1 + r * years), periods: 0, m: 0 },
      { name: 'Annual', value: pv * Math.pow(1 + r, years), periods: 1, m: 1 },
      { name: 'Semi-Annual', value: pv * Math.pow(1 + r / 2, years * 2), periods: 2, m: 2 },
      { name: 'Quarterly', value: pv * Math.pow(1 + r / 4, years * 4), periods: 4, m: 4 },
      { name: 'Monthly', value: pv * Math.pow(1 + r / 12, years * 12), periods: 12, m: 12 },
      { name: 'Weekly', value: pv * Math.pow(1 + r / 52, years * 52), periods: 52, m: 52 },
      { name: 'Daily', value: pv * Math.pow(1 + r / 365, years * 365), periods: 365, m: 365 },
      { name: 'Hourly', value: pv * Math.pow(1 + r / 8760, years * 8760), periods: 8760, m: 8760 },
      { name: 'Per Second', value: pv * Math.pow(1 + r / 31536000, years * 31536000), periods: 31536000, m: 31536000 },
      { name: 'Continuous', value: pv * Math.exp(r * years), periods: Infinity, m: Infinity }
    ];
  };

  // Calculate e approximation as m → ∞ for (1 + 1/m)^m
  const calculateEApproximation = () => {
    const values = [];
    const mValues = [1, 2, 4, 10, 12, 52, 100, 365, 1000, 8760, 10000, 31536000, 100000, 1000000, 10000000];

    mValues.forEach(m => {
      const approximation = Math.pow(1 + 1/m, m);
      values.push({
        m: m,
        value: approximation,
        name: m >= 1000000 ? `${(m/1000000).toFixed(1)}M` : m >= 1000 ? `${(m/1000).toFixed(0)}K` : m.toString()
      });
    });

    return values;
  };

  // Generate "Interest on Interest" breakdown data - THIS IS THE MAGIC OF COMPOUNDING!
  const generateInterestOnInterestDataWith = (inputs) => {
    const pv = inputs.principal;
    const rate = inputs.rate;
    const years = inputs.years;
    const r = rate / 100;
    const data = [];

    for (let year = 0; year <= years; year++) {
      // Total value with compound interest
      const totalValue = pv * Math.pow(1 + r, year);

      // Simple interest that would be earned (interest on principal only)
      const simpleInterest = pv * r * year;

      // Total interest earned (compound)
      const totalInterest = totalValue - pv;

      // Interest on interest = total interest - simple interest
      const interestOnInterest = totalInterest - simpleInterest;

      data.push({
        year,
        principal: pv,
        interestOnPrincipal: simpleInterest,
        interestOnInterest: Math.max(0, interestOnInterest),
        totalValue: totalValue
      });
    }

    return data;
  };

  // Legacy wrapper for existing code (uses chartInputs for the big bar chart)
  const generateInterestOnInterestData = () => generateInterestOnInterestDataWith(chartInputs);

  // Generate detailed year-by-year breakdown showing the snowball effect
  const generateSnowballEffectWith = (inputs) => {
    const pv = inputs.principal;
    const rate = inputs.rate;
    const years = inputs.years;
    const r = rate / 100;
    const data = [];

    let previousBalance = pv;

    for (let year = 1; year <= years; year++) {
      const interestEarned = previousBalance * r;
      const newBalance = previousBalance + interestEarned;

      data.push({
        year,
        startingBalance: previousBalance,
        interestEarned: interestEarned,
        endingBalance: newBalance,
        cumulativeGrowth: ((newBalance / pv - 1) * 100)
      });

      previousBalance = newBalance;
    }

    return data;
  };

  // Legacy wrapper for existing code
  const generateSnowballEffect = () => generateSnowballEffectWith(snowballInputsA);

  // Calculate final values for summary cards
  const calculateSummaryValuesWith = (inputs) => {
    const pv = inputs.principal;
    const rate = inputs.rate;
    const years = inputs.years;
    const r = rate / 100;

    const compoundValue = pv * Math.pow(1 + r, years);
    const simpleValue = pv + (pv * r * years);
    const totalInterest = compoundValue - pv;
    const interestOnPrincipal = pv * r * years;
    const interestOnInterest = totalInterest - interestOnPrincipal;

    return {
      principal: pv,
      interestOnPrincipal,
      interestOnInterest,
      simpleValue,
      compoundValue,
      extraFromCompounding: compoundValue - simpleValue,
      percentageGain: ((compoundValue - simpleValue) / simpleValue) * 100
    };
  };

  // Legacy wrapper for existing code (uses chartInputs for existing section)
  const calculateSummaryValues = () => calculateSummaryValuesWith(chartInputs);

  // Generate dynamic equation with actual values
  const generateDynamicEquation = (formulaKey, variation = null, solvingFor = null) => {
    const formula = formulas[formulaKey];
    // Use variation's latexFormula if variation is provided, otherwise use default formula
    let eq = variation?.latexFormula || formula.latexFormula;

    // Replace variables with actual colored values
    const varMap = {
      'si': { PV: inputs.si_pv, r: inputs.si_r/100, t: inputs.si_t },
      'ci': { PV: inputs.ci_pv, r: inputs.ci_r/100, n: inputs.ci_n },
      'cim': { PV: inputs.cim_pv, r: inputs.cim_r/100, n: inputs.cim_n, m: inputs.cim_m },
      'cc': { PV: inputs.cc_pv, r: inputs.cc_r/100, t: inputs.cc_t },
      'fv': { PV: inputs.fv_pv, r: inputs.fv_r/100, n: inputs.fv_n, m: inputs.fv_m },
      'pv': { FV: inputs.pv_fv, r: inputs.pv_r/100, n: inputs.pv_n, m: inputs.pv_m },
      'ear': { r: inputs.ear_r/100, m: inputs.ear_m, EAR: inputs.ear_ear/100 },
      'ann_pv': { PV: inputs.ann_pv_pv, PMT: inputs.ann_pv_pmt, r: inputs.ann_pv_r/100, n: inputs.ann_pv_n, m: inputs.ann_pv_m },
      'ann_fv': { PMT: inputs.ann_fv_pmt, r: inputs.ann_fv_r/100, n: inputs.ann_fv_n, m: inputs.ann_fv_m },
      'annd_pv': { PV: inputs.annd_pv_pv, PMT: inputs.annd_pv_pmt, r: inputs.annd_pv_r/100, n: inputs.annd_pv_n, m: inputs.annd_pv_m },
      'annd_fv': { PMT: inputs.annd_fv_pmt, r: inputs.annd_fv_r/100, n: inputs.annd_fv_n, m: inputs.annd_fv_m },
      'perp': { PV: inputs.perp_pv, PMT: inputs.perp_pmt, r: inputs.perp_r/100 },
      'gperp': { PV: inputs.gperp_pv, PMT: inputs.gperp_pmt, r: inputs.gperp_r/100, g: inputs.gperp_g/100 },
      'gann_pv': { PV: inputs.gann_pv_pv, PMT: inputs.gann_pv_pmt, r: inputs.gann_pv_r/100, g: inputs.gann_pv_g/100, n: inputs.gann_pv_n, m: inputs.gann_pv_m },
      'gann_fv': { PMT: inputs.gann_fv_pmt, r: inputs.gann_fv_r/100, g: inputs.gann_fv_g/100, n: inputs.gann_fv_n, m: inputs.gann_fv_m },
      'gann_due_pv': { PV: inputs.gann_due_pv_pv, PMT: inputs.gann_due_pv_pmt, r: inputs.gann_due_pv_r/100, g: inputs.gann_due_pv_g/100, n: inputs.gann_due_pv_n, m: inputs.gann_due_pv_m },
      'gann_due_fv': { PMT: inputs.gann_due_fv_pmt, r: inputs.gann_due_fv_r/100, g: inputs.gann_due_fv_g/100, n: inputs.gann_due_fv_n, m: inputs.gann_due_fv_m }
    };

    const vals = varMap[formulaKey] || {};

    // Build equation with values, but skip the variable being solved for
    Object.entries(vals).forEach(([key, value]) => {
      // Skip the variable we're solving for - it should remain as a variable
      if (solvingFor && key === solvingFor) {
        return;
      }
      const displayVal = key === 'r' || key === 'g' ? (value * 100).toFixed(1) + '\\%' : value.toFixed(2);
      eq = eq.replace(new RegExp(`{${key}}`, 'g'), `{\\mathbf{${displayVal}}}`);
    });

    return eq;
  };

  // Enhanced Timeline - Compact Full-Width Display with Zoom
  const Timeline = ({ type, solvingFor }) => {
    const [zoomLevel, setZoomLevel] = React.useState(1);
    const isAnnuity = type.includes('ann');
    const isDue = type.includes('annd');
    const isGrowing = type.includes('gann') || type.includes('gperp');
    const showPayments = isAnnuity && solvingFor !== 'PMT'; // Don't show payment badges when solving for PMT

    // Get the relevant inputs based on formula type
    let pv, r, n, m, pmt, g;

    if (type === 'fv' || type === 'cim') {
      pv = inputs[`${type}_pv`] || inputs.cim_pv;
      r = (inputs[`${type}_r`] || inputs.cim_r) / 100;
      n = inputs[`${type}_n`] || inputs.cim_n;
      m = inputs[`${type}_m`] || inputs.cim_m || 1;
    } else if (type === 'ci') {
      pv = inputs.ci_pv;
      r = inputs.ci_r / 100;
      n = inputs.ci_n;
      m = 1;
    } else if (type === 'si') {
      pv = inputs.si_pv;
      r = inputs.si_r / 100;
      n = inputs.si_t;
      m = 1;
    } else if (type === 'pv') {
      pv = 0;
      r = inputs.pv_r / 100;
      n = inputs.pv_n;
      m = inputs.pv_m || 1;
    } else if (isAnnuity) {
      pmt = inputs[`${type}_pmt`] || 0;
      r = (inputs[`${type}_r`] || 0) / 100;
      n = inputs[`${type}_n`] || 5;
      m = inputs[`${type}_m`] || 1;
      g = isGrowing ? (inputs[`${type}_g`] || 0) / 100 : 0;
      pv = 0;
    }

    // Generate data for all years
    const yearData = [];
    for (let year = 0; year <= n; year++) {
      let value = 0;
      const totalPeriods = year * m;

      if (!isAnnuity && pv) {
        value = pv * Math.pow(1 + r / m, totalPeriods);
      } else if (isAnnuity && pmt) {
        if (totalPeriods === 0) {
          value = isDue ? pmt : 0;
        } else {
          const periodicRate = r / m;
          value = pmt * ((Math.pow(1 + periodicRate, totalPeriods) - 1) / periodicRate);
          if (isDue) value *= (1 + periodicRate);
        }
      }

      // Calculate compounding period values within this year
      const compoundingPeriods = [];
      if (year < n && m > 1) {
        for (let p = 1; p < m; p++) {
          const period = totalPeriods + p;
          let periodValue = 0;

          if (!isAnnuity && pv) {
            periodValue = pv * Math.pow(1 + r / m, period);
          } else if (isAnnuity && pmt) {
            const periodicRate = r / m;
            periodValue = pmt * ((Math.pow(1 + periodicRate, period) - 1) / periodicRate);
            if (isDue) periodValue *= (1 + periodicRate);
          }

          compoundingPeriods.push({
            periodNum: p,
            value: periodValue,
            time: year + (p / m)
          });
        }
      }

      yearData.push({ year, value, compoundingPeriods });
    }

    // Determine if zoom controls should be shown
    const needsZoom = n > 5 || m >= 12;
    const totalPoints = n * m;

    // Smart auto-zoom based on data complexity
    React.useEffect(() => {
      if (needsZoom) {
        // Auto-adjust zoom based on number of points
        if (totalPoints > 100) setZoomLevel(4);
        else if (totalPoints > 50) setZoomLevel(3);
        else if (n > 10) setZoomLevel(2);
        else setZoomLevel(1.5);
      } else {
        setZoomLevel(1);
      }
    }, [n, m, totalPoints, needsZoom]);

    const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.5, 20)); // Max 2000% zoom
    const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.5, 1));
    const handleResetZoom = () => setZoomLevel(1);

    return (
      <div className="mt-6">
        {/* Header with Zoom Controls */}
        <div className="flex items-center justify-between mb-3 px-2">
          <h4 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Timeline
          </h4>
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-600">
              {n} {n === 1 ? 'year' : 'years'}
              {m > 1 && <span className="ml-2">• {m} periods/year</span>}
              {needsZoom && <span className="ml-2 text-orange-600 font-semibold">• {totalPoints} total points</span>}
            </div>
            {needsZoom && (
              <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1.5 border border-gray-300 shadow-sm">
                <button
                  onClick={handleZoomOut}
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold transition-colors"
                  title="Zoom Out"
                >
                  −
                </button>
                <span className="text-xs font-semibold text-gray-700 min-w-[50px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded text-gray-700 font-bold transition-colors"
                  title="Zoom In"
                >
                  +
                </button>
                <button
                  onClick={handleResetZoom}
                  className="ml-2 px-2 py-0.5 bg-indigo-100 hover:bg-indigo-200 rounded text-xs font-semibold text-indigo-700 transition-colors"
                  title="Reset Zoom"
                >
                  Reset
                </button>
              </div>
            )}
          </div>
        </div>

        {needsZoom && (
          <div className="mb-3 px-2 py-2 bg-blue-100 border border-blue-300 rounded-lg">
            <p className="text-xs text-blue-800 flex items-center gap-2">
              <span className="font-semibold">💡 Tip:</span>
              Use zoom controls above and scroll horizontally to explore all {totalPoints} compounding periods across {n} years
            </p>
          </div>
        )}

        {/* Timeline Container - Scrollable when zoomed */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200 overflow-x-auto">
          <div
            className="relative px-4 transition-transform duration-300 origin-left"
            style={{
              minHeight: '120px',
              width: needsZoom ? `${zoomLevel * 100}%` : '100%',
              minWidth: '100%'
            }}
          >
            {/* Main timeline line - centered vertically */}
            <div className="absolute left-4 right-4 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400" style={{ top: '60px' }} />

            {/* Container for all markers */}
            <div className="relative" style={{ height: '120px' }}>
              {/* Year markers - absolutely positioned */}
              {yearData.map((data, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === yearData.length - 1;
                const leftPosition = (idx / (yearData.length - 1)) * 100;

                return (
                  <div key={data.year}>
                    {/* Year marker and labels */}
                    <div
                      className="absolute flex flex-col items-center"
                      style={{
                        left: `${leftPosition}%`,
                        transform: 'translateX(-50%)',
                        top: 0
                      }}
                    >
                      {/* Year label above - closer to line, adapts to zoom */}
                      <div className={`font-bold text-gray-700 ${zoomLevel >= 2 ? 'text-sm' : 'text-xs'}`} style={{ marginTop: '14px', marginBottom: '2px' }}>
                        Y{data.year}
                      </div>

                      {/* Year marker dot - exactly ON the line */}
                      <div
                        className={`w-3 h-3 rounded-full z-10 ${
                          isFirst ? 'bg-blue-600' :
                          isLast ? 'bg-purple-600' :
                          'bg-indigo-500'
                        }`}
                        style={{ marginTop: '22.5px' }}
                      />

                      {/* Value below - adapts to zoom */}
                      {data.value > 0 && (
                        <div className={`mt-2 font-bold ${isLast ? 'text-purple-700' : isFirst ? 'text-blue-700' : 'text-indigo-700'} ${
                          zoomLevel >= 2 ? 'text-sm' : 'text-xs'
                        }`}>
                          ${zoomLevel >= 2 ? data.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : data.value.toFixed(2)}
                        </div>
                      )}

                      {/* Payment indicator for annuities (only when NOT solving for PMT) */}
                      {showPayments && !isFirst && (
                        <div className={`mt-1 px-1.5 py-0.5 ${isGrowing ? 'bg-gradient-to-r from-teal-100 to-green-100 border-green-400' : 'bg-teal-100 border-teal-400'} border rounded text-[9px] font-semibold ${isGrowing ? 'text-green-700' : 'text-teal-700'} whitespace-nowrap`}>
                          {isGrowing ? (
                            <>
                              PMT: ${(pmt * Math.pow(1 + g, data.year - 1)).toFixed(2)}
                              {g > 0 && (
                                <span className="ml-1 text-[8px] text-green-600">
                                  ↗{(g * 100).toFixed(1)}%
                                </span>
                              )}
                            </>
                          ) : (
                            <>PMT: ${pmt}</>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Compounding period markers between this year and next */}
                    {!isLast && data.compoundingPeriods.length > 0 && data.compoundingPeriods.map((cp, cpIdx) => {
                      const nextYearPos = ((idx + 1) / (yearData.length - 1)) * 100;
                      const periodPosition = leftPosition + ((nextYearPos - leftPosition) * ((cpIdx + 1) / m));

                      // Smart value display logic - adapts to zoom level
                      let shouldShowValue, showEllipsis;

                      if (zoomLevel >= 3) {
                        // High zoom: show ALL values
                        shouldShowValue = true;
                        showEllipsis = false;
                      } else if (zoomLevel >= 2) {
                        // Medium zoom: show every other value
                        shouldShowValue = cpIdx % 2 === 0 || cpIdx === data.compoundingPeriods.length - 1;
                        showEllipsis = false;
                      } else if (zoomLevel >= 1.5) {
                        // Low zoom: show first, last, and middle
                        shouldShowValue = cpIdx === 0 || cpIdx === data.compoundingPeriods.length - 1 || cpIdx === Math.floor(data.compoundingPeriods.length / 2);
                        showEllipsis = m > 4 && cpIdx === 1;
                      } else {
                        // No zoom: original logic
                        shouldShowValue = m <= 4 || cpIdx === 0 || cpIdx === data.compoundingPeriods.length - 1;
                        showEllipsis = m > 4 && cpIdx === 1 && data.compoundingPeriods.length > 2;
                      }

                      return (
                        <div
                          key={`${data.year}-${cpIdx}`}
                          className="absolute group"
                          style={{
                            left: `${periodPosition}%`,
                            transform: 'translateX(-50%)',
                            top: '61px'
                          }}
                        >
                          {/* Orange period dot - ON the line */}
                          <div
                            className="w-2 h-2 rounded-full bg-orange-500 shadow-md border border-orange-600 transform -translate-y-1/2 z-5"
                          />

                          {/* Period number below - adapts to zoom */}
                          <div className={`absolute top-3 left-1/2 transform -translate-x-1/2 font-semibold text-orange-700 whitespace-nowrap ${
                            zoomLevel >= 2.5 ? 'text-[11px]' : 'text-[9px]'
                          }`}>
                            {showEllipsis ? '...' : cp.periodNum}
                          </div>

                          {/* Value display above dot - adapts to zoom */}
                          {shouldShowValue && (
                            <div className={`absolute -top-6 left-1/2 transform -translate-x-1/2 font-bold text-orange-600 whitespace-nowrap ${
                              zoomLevel >= 2.5 ? 'text-[10px]' : 'text-[8px]'
                            }`}>
                              {zoomLevel >= 2.5
                                ? `$${cp.value.toFixed(2)}`  // Full precision when zoomed in
                                : cp.value >= 1000
                                  ? `$${(cp.value / 1000).toFixed(1)}k`  // Abbreviated when zoomed out
                                  : `$${cp.value.toFixed(0)}`
                              }
                            </div>
                          )}

                          {showEllipsis && (
                            <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-[8px] font-bold text-orange-400 whitespace-nowrap">
                              ...
                            </div>
                          )}

                          {/* Hover tooltip */}
                          <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 hidden group-hover:block bg-white border-2 border-orange-400 rounded px-2 py-1 text-xs whitespace-nowrap shadow-lg z-20">
                            <div className="font-bold text-orange-700">${cp.value.toFixed(2)}</div>
                            <div className="text-gray-500 text-[10px]">Period {cp.periodNum} • t={cp.time.toFixed(2)}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Compact Summary */}
          <div className="mt-4 pt-3 border-t border-blue-200 flex justify-between text-xs">
            <div className="text-center">
              <span className="text-gray-600">Start: </span>
              <span className="font-bold text-blue-600">${(pv || 0).toFixed(2)}</span>
            </div>
            <div className="text-center">
              <span className="text-gray-600">Rate: </span>
              <span className="font-bold text-indigo-600">{((r || 0) * 100).toFixed(1)}%</span>
              {m > 1 && <span className="text-gray-500"> (×{m}/yr)</span>}
            </div>
            {isGrowing && g > 0 && (
              <div className="text-center">
                <span className="text-gray-600">Growth: </span>
                <span className="font-bold text-green-600">{(g * 100).toFixed(1)}%/yr ↗</span>
              </div>
            )}
            <div className="text-center">
              <span className="text-gray-600">End: </span>
              <span className="font-bold text-purple-600">${yearData[yearData.length - 1]?.value.toFixed(2) || '0.00'}</span>
            </div>
          </div>

          {/* Info Box when solving for PMT */}
          {solvingFor === 'PMT' && isAnnuity && (
            <div className="mt-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-300 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="text-blue-600 font-bold text-sm">🧮</div>
                <div>
                  <h5 className="text-xs font-bold text-blue-800 mb-1">Calculating Payment Amount</h5>
                  <p className="text-xs text-blue-700 leading-relaxed">
                    The timeline shows the cumulative future value. The required payment amount (PMT) is shown in the result above.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Growing Payment Info Box (only when NOT solving for PMT) */}
          {isGrowing && g > 0 && showPayments && (
            <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-300 rounded-lg">
              <div className="flex items-start gap-2">
                <div className="text-green-600 font-bold text-sm">📈</div>
                <div>
                  <h5 className="text-xs font-bold text-green-800 mb-1">Growing Payments</h5>
                  <p className="text-xs text-green-700 leading-relaxed">
                    Each payment grows by <span className="font-bold">{(g * 100).toFixed(1)}%</span> per year:
                  </p>
                  <div className="mt-2 space-y-1 text-[10px] text-green-600">
                    <div>• Year 1: <span className="font-semibold">${pmt.toFixed(2)}</span></div>
                    <div>• Year 2: <span className="font-semibold">${(pmt * (1 + g)).toFixed(2)}</span> <span className="text-green-500">(+{(g * 100).toFixed(1)}%)</span></div>
                    <div>• Year 3: <span className="font-semibold">${(pmt * Math.pow(1 + g, 2)).toFixed(2)}</span> <span className="text-green-500">(+{(g * 100).toFixed(1)}%)</span></div>
                    {n > 3 && (
                      <div>• Year {n}: <span className="font-semibold">${(pmt * Math.pow(1 + g, n - 1)).toFixed(2)}</span></div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Legend if compounding periods exist */}
          {m > 1 && (
            <div className="mt-2 pt-2 border-t border-blue-100 flex items-center justify-center gap-6 text-[10px] text-gray-600">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded-full bg-indigo-500" />
                <span>Year markers</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500 border border-orange-600" />
                <span>Periods (1, 2, 3... = {m}x/year)</span>
              </div>
              <div className="text-gray-500">
                💡 Hover periods for exact values
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const currentFormula = formulas[activeFormula];
  const currentVariation = currentFormula.variations?.[activeVariation];
  const currentResult = results[`${activeFormula}_${activeVariation || 'default'}`];
  const categories = [...new Set(Object.values(formulas).map(f => f.category))];

  // Sidebar navigation structure
  const sidebarSections = [
    {
      id: 'learn',
      label: 'Interest Rates Guide',
      icon: BookOpen,
      color: 'from-purple-600 to-indigo-600'
    },
    {
      id: 'calculators',
      label: 'Calculators',
      icon: Calculator,
      color: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'amortization',
      label: 'Amortization Table',
      icon: Table,
      color: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'analysis',
      label: 'Visual Analysis',
      icon: PieChart,
      color: 'from-orange-600 to-amber-600'
    },
    {
      id: 'practice',
      label: 'Practice Problems',
      icon: GraduationCap,
      color: 'from-violet-600 to-purple-600'
    },
    {
      id: 'saved',
      label: 'Saved Calculations',
      icon: FolderOpen,
      color: 'from-pink-600 to-rose-600',
      badge: savedCalculations.length
    }
  ];

  const toggleCategory = (category) => {
    setExpandedCategories(prev => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  // Get display formula and variables based on variation or default
  const displayFormula = currentVariation?.latexFormula || currentFormula.latexFormula;
  const displayVariables = currentVariation?.inputs || currentFormula.variables.map(v => v.key);

  // Get variable metadata
  const getVariableMeta = (key) => {
    // Try to find in current formula variables
    const found = currentFormula.variables.find(v => v.key === key);
    if (found) return found;

    // Generate from key (e.g., 'ci_fv' -> { key: 'ci_fv', label: 'Future Value (FV)', symbol: 'FV' })
    const parts = key.split('_');
    const varName = parts[parts.length - 1].toUpperCase();
    const labelMap = {
      'fv': 'Future Value (FV)',
      'pv': 'Present Value (PV)',
      'r': 'Annual Interest Rate (%)',
      'n': 'Number of Years (n)',
      't': 'Time in Years (t)',
      'm': 'Compounding Periods/Year (m)',
      'pmt': 'Payment (PMT)',
      'g': 'Growth Rate (%)'
    };
    return {
      key,
      label: labelMap[parts[parts.length - 1]] || varName,
      symbol: varName
    };
  };

  // Format result based on variable type
  const formatResult = (value) => {
    if (typeof value !== 'number') return value;

    // Determine what we're solving for
    const solvingFor = activeVariation || 'default';

    // Rate variables (r, g) -> percentage
    if (solvingFor === 'r' || solvingFor === 'g') {
      return `${value.toFixed(4)}%`;
    }

    // Time/period variables (n, t, m) -> numerical with label
    if (solvingFor === 'n') {
      return `${value.toFixed(2)} years`;
    }
    if (solvingFor === 't') {
      return `${value.toFixed(2)} years`;
    }
    if (solvingFor === 'm') {
      return `${value.toFixed(2)} periods/year`;
    }

    // Monetary values (FV, PV, PMT) -> currency
    if (solvingFor === 'FV' || solvingFor === 'PV' || solvingFor === 'PMT') {
      return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    }

    // Default case (shouldn't reach here, but just in case)
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Generate Excel formula guide based on current formula and variation
  const getExcelFormulaGuide = () => {
    const variation = activeVariation || 'default';
    const formulaKey = activeFormula;

    // Build input table data
    const tableRows = displayVariables.map((varKey, idx) => {
      const variable = getVariableMeta(varKey);
      const value = inputs[variable.key] || 0;

      // Format value for Excel display
      let displayValue = value;
      if (variable.label.includes('Rate')) {
        displayValue = value / 100; // Excel rates are decimal (0.06 not 6)
      }

      return {
        row: idx + 1,
        label: variable.label.replace(/\s*\([^)]*\)/g, ''), // Remove symbols in parentheses
        value: displayValue,
        cellRef: `B${idx + 1}`,
        isRate: variable.label.includes('Rate')
      };
    });

    // Generate Excel formula based on formula type and variation
    let excelFormula = '';
    let excelFormulaCell = `B${tableRows.length + 2}`;
    let notes = [];
    let useNativeFunction = true;

    // Map formula types to Excel functions
    if (formulaKey === 'si') {
      // Simple Interest: FV = PV * (1 + r * t)
      if (variation === 'FV') {
        excelFormula = `=B1*(1+B2*B3)`;
        notes.push('Simple Interest has no native Excel function');
      } else if (variation === 'PV') {
        excelFormula = `=B1/(1+B2*B3)`;
      } else if (variation === 'r') {
        excelFormula = `=((B1/B2)-1)/B3`;
      } else if (variation === 't') {
        excelFormula = `=((B1/B2)-1)/B3`;
      }
      useNativeFunction = false;
    }
    else if (formulaKey === 'ci') {
      // Compound Interest Annual: FV = PV * (1 + r)^n
      if (variation === 'FV') {
        excelFormula = `=B1*(1+B2)^B3`;
        notes.push('Or use: =FV(B2, B3, 0, -B1)');
      } else if (variation === 'PV') {
        excelFormula = `=B1/(1+B2)^B3`;
        notes.push('Or use: =PV(B2, B3, 0, B1)');
      } else if (variation === 'r') {
        excelFormula = `=(B1/B2)^(1/B3)-1`;
        notes.push('Or use: =RATE(B3, 0, -B2, B1)');
      } else if (variation === 'n') {
        excelFormula = `=LN(B1/B2)/LN(1+B3)`;
        notes.push('Or use: =NPER(B3, 0, -B2, B1)');
      }
      useNativeFunction = false;
    }
    else if (formulaKey === 'cim' || formulaKey === 'fv') {
      // Compound Interest with m periods or FV
      if (variation === 'FV') {
        const pvCell = 'B1', rCell = 'B2', nCell = 'B3', mCell = 'B4';
        excelFormula = `=FV(${rCell}/${mCell}, ${nCell}*${mCell}, 0, -${pvCell})`;
        notes.push(`Excel's FV function: =FV(rate, nper, pmt, pv, type)`);
        notes.push(`rate = annual rate / periods per year`);
        notes.push(`nper = years × periods per year`);
      } else if (variation === 'PV') {
        excelFormula = `=PV(B2/B4, B3*B4, 0, B1)`;
        notes.push(`Excel's PV function: =PV(rate, nper, pmt, fv, type)`);
      } else if (variation === 'r') {
        excelFormula = `=RATE(B3*B4, 0, -B2, B1)*B4`;
        notes.push('Multiply by m to get annual rate');
      } else if (variation === 'n') {
        excelFormula = `=NPER(B3/B4, 0, -B2, B1)/B4`;
        notes.push('Divide by m to get years');
      } else if (variation === 'm') {
        excelFormula = `No direct Excel function - use Goal Seek`;
        notes.push('Use Excel Goal Seek or Solver');
        useNativeFunction = false;
      }
    }
    else if (formulaKey === 'pv') {
      // Present Value
      if (variation === 'PV') {
        excelFormula = `=PV(B2/B4, B3*B4, 0, B1)`;
        notes.push(`Excel's PV function: =PV(rate, nper, pmt, fv, type)`);
      } else if (variation === 'FV') {
        excelFormula = `=FV(B2/B4, B3*B4, 0, -B1)`;
      } else if (variation === 'r') {
        excelFormula = `=RATE(B2*B4, 0, -B3, B1)*B4`;
      } else if (variation === 'n') {
        excelFormula = `=NPER(B2/B4, 0, -B3, B1)/B4`;
      }
    }
    else if (formulaKey === 'cc') {
      // Continuous Compounding: FV = PV * e^(r*t)
      if (variation === 'FV') {
        excelFormula = `=B1*EXP(B2*B3)`;
      } else if (variation === 'PV') {
        excelFormula = `=B1/EXP(B2*B3)`;
      } else if (variation === 'r') {
        excelFormula = `=LN(B1/B2)/B3`;
      } else if (variation === 't') {
        excelFormula = `=LN(B1/B2)/B3`;
      }
      notes.push('Use EXP() function for e^x in Excel');
      useNativeFunction = false;
    }
    else if (formulaKey === 'ann_pv') {
      // PV of Ordinary Annuity
      if (variation === 'PV') {
        excelFormula = `=PV(B2/B4, B3*B4, -B1, 0, 0)`;
        notes.push('Last parameter 0 = ordinary annuity (payments at END)');
      } else if (variation === 'PMT') {
        excelFormula = `=PMT(B2/B4, B3*B4, -B1, 0, 0)`;
      } else if (variation === 'r') {
        excelFormula = `=RATE(B3*B4, -B1, B2)*B4`;
      } else if (variation === 'n') {
        excelFormula = `=NPER(B2/B4, -B1, B3)/B4`;
      }
    }
    else if (formulaKey === 'ann_fv') {
      // FV of Ordinary Annuity
      if (variation === 'FV') {
        excelFormula = `=FV(B2/B4, B3*B4, -B1, 0, 0)`;
        notes.push('Last parameter 0 = ordinary annuity (payments at END)');
      } else if (variation === 'PMT') {
        excelFormula = `=PMT(B2/B4, B3*B4, 0, -B1, 0)`;
      } else if (variation === 'r') {
        excelFormula = `=RATE(B3*B4, -B1, 0, B2)*B4`;
      } else if (variation === 'n') {
        excelFormula = `=NPER(B2/B4, -B1, 0, B3)/B4`;
      }
    }
    else if (formulaKey === 'annd_pv' || formulaKey === 'anndue_pv') {
      // PV of Annuity Due
      if (variation === 'PV') {
        excelFormula = `=PV(B2/B4, B3*B4, -B1, 0, 1)`;
        notes.push('Last parameter 1 = annuity due (payments at START)');
      } else if (variation === 'PMT') {
        excelFormula = `=PMT(B2/B4, B3*B4, -B1, 0, 1)`;
      }
    }
    else if (formulaKey === 'annd_fv' || formulaKey === 'anndue_fv') {
      // FV of Annuity Due
      if (variation === 'FV') {
        excelFormula = `=FV(B2/B4, B3*B4, -B1, 0, 1)`;
        notes.push('Last parameter 1 = annuity due (payments at START)');
      } else if (variation === 'PMT') {
        excelFormula = `=PMT(B2/B4, B3*B4, 0, -B1, 1)`;
      }
    }
    else if (formulaKey === 'perp') {
      // Perpetuity: PV = PMT / r
      if (variation === 'PV') {
        excelFormula = `=B1/B2`;
      } else if (variation === 'PMT') {
        excelFormula = `=B1*B2`;
      } else if (variation === 'r') {
        excelFormula = `=B1/B2`;
      }
      notes.push('Perpetuity has no native Excel function');
      notes.push('Simply divide payment by rate');
      useNativeFunction = false;
    }
    else if (formulaKey === 'gperp') {
      // Growing Perpetuity: PV = PMT / (r - g)
      if (variation === 'PV') {
        excelFormula = `=B1/(B2-B3)`;
      } else if (variation === 'PMT') {
        excelFormula = `=B1*(B2-B3)`;
      } else if (variation === 'r') {
        excelFormula = `=B1/B2+B3`;
      } else if (variation === 'g') {
        excelFormula = `=B2-B1/B3`;
      }
      notes.push('Growing Perpetuity has no native Excel function');
      notes.push('Formula: PV = PMT / (r - g) where r > g');
      useNativeFunction = false;
    }
    else if (formulaKey === 'gann_pv') {
      // PV of Growing Annuity: PV = PMT × [(1 - ((1+g)/(1+r/m))^(n×m)) / (r/m - g)]
      if (variation === 'PV') {
        excelFormula = `=B1*((1-((1+B3)/(1+B2/B5))^(B4*B5))/(B2/B5-B3))`;
        notes.push('Growing Annuity has no native Excel function');
        notes.push('Formula: PV = PMT × [(1 - ((1+g)/(1+r/m))^(n×m)) / (r/m - g)]');
        notes.push('Where: B1=PMT, B2=r, B3=g, B4=n, B5=m');
      } else if (variation === 'PMT') {
        excelFormula = `=B1/((1-((1+B3)/(1+B2/B5))^(B4*B5))/(B2/B5-B3))`;
        notes.push('Solve for PMT by dividing PV by the annuity factor');
      } else {
        excelFormula = `Complex - use Goal Seek or Solver`;
        notes.push('For solving r, g, n, or m: use Excel Goal Seek');
        notes.push('Set cell with formula equal to target by changing input cell');
      }
      useNativeFunction = false;
    }
    else if (formulaKey === 'gann_fv') {
      // FV of Growing Annuity: FV = PMT × [((1+r/m)^(n×m) - (1+g)^(n×m)) / (r/m - g)]
      if (variation === 'FV') {
        excelFormula = `=B1*(((1+B2/B5)^(B4*B5)-(1+B3)^(B4*B5))/(B2/B5-B3))`;
        notes.push('Growing Annuity has no native Excel function');
        notes.push('Formula: FV = PMT × [((1+r/m)^(n×m) - (1+g)^(n×m)) / (r/m - g)]');
        notes.push('Where: B1=PMT, B2=r, B3=g, B4=n, B5=m');
      } else if (variation === 'PMT') {
        excelFormula = `=B1/(((1+B2/B5)^(B4*B5)-(1+B3)^(B4*B5))/(B2/B5-B3))`;
        notes.push('Solve for PMT by dividing FV by the annuity factor');
      } else {
        excelFormula = `Complex - use Goal Seek or Solver`;
        notes.push('For solving r, g, n, or m: use Excel Goal Seek');
        notes.push('Set cell with formula equal to target by changing input cell');
      }
      useNativeFunction = false;
    }
    else if (formulaKey === 'ear') {
      // Effective Annual Rate: EAR = (1 + r/m)^m - 1
      if (variation === 'EAR') {
        excelFormula = `=(1+B1/B2)^B2-1`;
        notes.push('Effective Annual Rate has no native Excel function');
        notes.push('Formula: EAR = (1 + r/m)^m - 1');
        notes.push('Where: B1=nominal rate (as decimal), B2=m (compounding periods)');
      } else if (variation === 'r') {
        excelFormula = `=(((1+B1)^(1/B2))-1)*B2`;
        notes.push('Solve for nominal rate from EAR');
        notes.push('Formula: r = m × ((1+EAR)^(1/m) - 1)');
      } else if (variation === 'm') {
        excelFormula = `Complex - use Goal Seek or Solver`;
        notes.push('For solving m: use Excel Goal Seek');
        notes.push('Set cell with EAR formula equal to target by changing m');
      }
      useNativeFunction = false;
    }
    else if (formulaKey === 'gann_due_pv') {
      // PV of Growing Annuity Due: PV = PMT × [(1 - ((1+g)/(1+r/m))^(n×m)) / (r/m - g)] × (1 + r/m)
      if (variation === 'PV') {
        excelFormula = `=B1*((1-((1+B3)/(1+B2/B5))^(B4*B5))/(B2/B5-B3))*(1+B2/B5)`;
        notes.push('Growing Annuity Due has no native Excel function');
        notes.push('Formula: PV = PMT × [(1 - ((1+g)/(1+r/m))^(n×m)) / (r/m - g)] × (1 + r/m)');
        notes.push('Where: B1=PMT, B2=r, B3=g, B4=n, B5=m');
        notes.push('The (1+r/m) factor accounts for payments at START of period');
      } else if (variation === 'PMT') {
        excelFormula = `=B1/(((1-((1+B3)/(1+B2/B5))^(B4*B5))/(B2/B5-B3))*(1+B2/B5))`;
        notes.push('Solve for PMT by dividing PV by the annuity due factor');
      } else {
        excelFormula = `Complex - use Goal Seek or Solver`;
        notes.push('For solving r, g, n, or m: use Excel Goal Seek');
        notes.push('Set cell with formula equal to target by changing input cell');
      }
      useNativeFunction = false;
    }
    else if (formulaKey === 'gann_due_fv') {
      // FV of Growing Annuity Due: FV = PMT × [((1+r/m)^(n×m) - (1+g)^(n×m)) / (r/m - g)] × (1 + r/m)
      if (variation === 'FV') {
        excelFormula = `=B1*(((1+B2/B5)^(B4*B5)-(1+B3)^(B4*B5))/(B2/B5-B3))*(1+B2/B5)`;
        notes.push('Growing Annuity Due has no native Excel function');
        notes.push('Formula: FV = PMT × [((1+r/m)^(n×m) - (1+g)^(n×m)) / (r/m - g)] × (1 + r/m)');
        notes.push('Where: B1=PMT, B2=r, B3=g, B4=n, B5=m');
        notes.push('The (1+r/m) factor accounts for payments at START of period');
      } else if (variation === 'PMT') {
        excelFormula = `=B1/((((1+B2/B5)^(B4*B5)-(1+B3)^(B4*B5))/(B2/B5-B3))*(1+B2/B5))`;
        notes.push('Solve for PMT by dividing FV by the annuity due factor');
      } else {
        excelFormula = `Complex - use Goal Seek or Solver`;
        notes.push('For solving r, g, n, or m: use Excel Goal Seek');
        notes.push('Set cell with formula equal to target by changing input cell');
      }
      useNativeFunction = false;
    }
    else {
      excelFormula = `See manual calculation`;
      notes.push('Custom formula - refer to equation above');
      useNativeFunction = false;
    }

    return {
      tableRows,
      excelFormula,
      excelFormulaCell,
      notes,
      useNativeFunction,
      resultLabel: `Result (${variation}):`
    };
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
                <h1 className="text-2xl font-bold text-gray-900">Time Value of Money</h1>
                <p className="text-sm text-gray-500">Interactive Learning Platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-6">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-xl p-4 sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto">
              <h2 className="text-lg font-bold text-gray-800 mb-4 px-2">Sections</h2>
              <nav className="space-y-1">
                {sidebarSections.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;

                  return (
                    <div key={section.id}>
                      <button
                        onClick={() => {
                          if (section.id === 'calculators') {
                            toggleCategory('calculators');
                            if (!expandedCategories['calculators']) {
                              setActiveSection('calculators');
                            }
                          } else {
                            setActiveSection(section.id);
                          }
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                          isActive
                            ? `bg-gradient-to-r ${section.color} text-white shadow-lg transform scale-105`
                            : 'hover:bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        <span className="font-semibold text-sm">{section.label}</span>
                        {section.id === 'calculators' && (
                          expandedCategories['calculators'] ?
                            <ChevronUp className={`w-4 h-4 ml-auto ${isActive ? 'text-white' : 'text-gray-500'}`} /> :
                            <ChevronDown className={`w-4 h-4 ml-auto ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        )}
                        {section.badge && section.id !== 'calculators' && (
                          <span className={`ml-auto px-2 py-0.5 rounded-full text-xs font-bold ${
                            isActive
                              ? 'bg-white/20 text-white'
                              : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {section.badge}
                          </span>
                        )}
                      </button>

                      {/* Expanded Calculators Dropdown */}
                      {section.id === 'calculators' && expandedCategories['calculators'] && (
                        <div className="ml-4 mt-2 space-y-3 border-l-2 border-gray-200 pl-3">
                          {categories.map(category => (
                            <div key={category}>
                              <button
                                onClick={() => toggleCategory(category)}
                                className="w-full flex items-center gap-2 px-2 py-1.5 text-xs font-semibold text-gray-700 hover:text-indigo-600 transition-colors"
                              >
                                {expandedCategories[category] ?
                                  <ChevronDown className="w-3 h-3" /> :
                                  <ChevronRight className="w-3 h-3" />
                                }
                                <span>{category}</span>
                              </button>

                              {expandedCategories[category] && (
                                <div className="ml-4 mt-1 space-y-1">
                                  {Object.entries(formulas)
                                    .filter(([, formula]) => formula.category === category)
                                    .map(([key, formula]) => (
                                      <button
                                        key={key}
                                        onClick={() => {
                                          setActiveFormula(key);
                                          setActiveSection('calculators');
                                        }}
                                        className={`w-full text-left px-2 py-1.5 text-xs rounded transition-colors ${
                                          activeFormula === key && activeSection === 'calculators'
                                            ? 'bg-indigo-100 text-indigo-700 font-semibold'
                                            : 'text-gray-600 hover:bg-gray-100'
                                        }`}
                                      >
                                        {formula.name}
                                      </button>
                                    ))}
                                </div>
                              )}
                            </div>
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

            {/* Learn Section: Interest Rates Guide */}
            {activeSection === 'learn' && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Understanding Interest Rates</h2>
                      <p className="text-gray-600">Master the fundamentals before calculating</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
              {/* Introduction */}
              <div className="bg-white/95 backdrop-blur rounded-xl p-6 shadow-lg">
                <div className="flex items-start gap-3 mb-4">
                  <Info className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">Why Multiple Rate Types?</h3>
                    <p className="text-gray-700 leading-relaxed">
                      Interest rates can be expressed in different ways depending on how frequently compounding occurs.
                      Understanding these different rate types is crucial for making accurate financial calculations and comparisons.
                    </p>
                  </div>
                </div>
              </div>

              {/* Rate Types Grid */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Periodic Rate */}
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-blue-600 rounded-lg">
                      <Calendar className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-blue-900">Periodic Rate (r/m)</h3>
                  </div>
                  <p className="text-gray-700 mb-3 font-semibold">The interest rate per compounding period</p>
                  <div className="bg-white rounded-lg p-4 mb-3">
                    <DisplayEquation>{'\\text{Periodic Rate} = \\frac{\\color{red}{r}}{\\color{orange}{m}}'}</DisplayEquation>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700"><span className="font-bold">Where:</span></p>
                    <p className="text-gray-700">• <span className="font-semibold text-red-700">r</span> = Annual interest rate (APR)</p>
                    <p className="text-gray-700">• <span className="font-semibold text-orange-700">m</span> = Number of compounding periods per year</p>
                  </div>
                  <div className="mt-4 bg-blue-600 text-white rounded-lg p-3">
                    <p className="font-bold mb-1">Example:</p>
                    <p className="text-sm">12% APR with monthly compounding:</p>
                    <p className="text-sm mt-1">Periodic Rate = 12% ÷ 12 = <span className="font-bold">1% per month</span></p>
                  </div>
                </div>

                {/* APR */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-green-600 rounded-lg">
                      <Percent className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-green-900">APR (Annual Percentage Rate)</h3>
                  </div>
                  <p className="text-gray-700 mb-3 font-semibold">The nominal annual interest rate</p>
                  <div className="bg-white rounded-lg p-4 mb-3">
                    <DisplayEquation>{'\\text{APR} = \\text{Periodic Rate} \\times \\color{orange}{m}'}</DisplayEquation>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700"><span className="font-bold">Characteristics:</span></p>
                    <p className="text-gray-700">• Does NOT account for compounding effects</p>
                    <p className="text-gray-700">• Simple multiplication of periodic rate</p>
                    <p className="text-gray-700">• Used for disclosure and comparison</p>
                  </div>
                  <div className="mt-4 bg-green-600 text-white rounded-lg p-3">
                    <p className="font-bold mb-1">Example:</p>
                    <p className="text-sm">1% monthly rate:</p>
                    <p className="text-sm mt-1">APR = 1% × 12 = <span className="font-bold">12% per year</span></p>
                  </div>
                </div>

                {/* EAR */}
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-2 border-purple-300 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-600 rounded-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-purple-900">EAR (Effective Annual Rate)</h3>
                  </div>
                  <p className="text-gray-700 mb-3 font-semibold">The actual annual rate with compounding</p>
                  <div className="bg-white rounded-lg p-4 mb-3">
                    <DisplayEquation>{'\\text{EAR} = \\left(1 + \\frac{\\color{red}{r}}{\\color{orange}{m}}\\right)^{\\color{orange}{m}} - 1'}</DisplayEquation>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700"><span className="font-bold">Characteristics:</span></p>
                    <p className="text-gray-700">• DOES account for compounding effects</p>
                    <p className="text-gray-700">• Always ≥ APR (equal only if m = 1)</p>
                    <p className="text-gray-700">• True measure of investment return</p>
                  </div>
                  <div className="mt-4 bg-purple-600 text-white rounded-lg p-3">
                    <p className="font-bold mb-1">Example:</p>
                    <p className="text-sm">12% APR, monthly compounding:</p>
                    <p className="text-sm mt-1">EAR = (1 + 0.12/12)^12 - 1 = <span className="font-bold">12.68%</span></p>
                  </div>
                </div>

                {/* APY */}
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 border-2 border-amber-300 rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-amber-600 rounded-lg">
                      <Coins className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-amber-900">APY (Annual Percentage Yield)</h3>
                  </div>
                  <p className="text-gray-700 mb-3 font-semibold">Essentially the same as EAR</p>
                  <div className="bg-white rounded-lg p-4 mb-3">
                    <DisplayEquation>{'\\text{APY} = \\text{EAR}'}</DisplayEquation>
                  </div>
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700"><span className="font-bold">Key Points:</span></p>
                    <p className="text-gray-700">• Used by banks for savings accounts</p>
                    <p className="text-gray-700">• Reflects actual earnings with compounding</p>
                    <p className="text-gray-700">• APY = EAR (just different terminology)</p>
                  </div>
                  <div className="mt-4 bg-amber-600 text-white rounded-lg p-3">
                    <p className="font-bold mb-1">Note:</p>
                    <p className="text-sm">APY and EAR are mathematically identical. APY is commonly used in banking, while EAR is used in finance.</p>
                  </div>
                </div>
              </div>

              {/* Comparison Example */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-indigo-600" />
                  Real-World Comparison: $10,000 Investment
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Compounding Frequency</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">m (periods/year)</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">APR</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Periodic Rate</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">EAR / APY</th>
                        <th className="text-left py-3 px-4 font-bold text-gray-700">Value After 1 Year</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                        <td className="py-3 px-4 font-semibold">Annual</td>
                        <td className="py-3 px-4">1</td>
                        <td className="py-3 px-4">12%</td>
                        <td className="py-3 px-4">12%</td>
                        <td className="py-3 px-4 font-bold text-purple-600">12.00%</td>
                        <td className="py-3 px-4 font-bold text-green-600">$11,200.00</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                        <td className="py-3 px-4 font-semibold">Semi-Annual</td>
                        <td className="py-3 px-4">2</td>
                        <td className="py-3 px-4">12%</td>
                        <td className="py-3 px-4">6%</td>
                        <td className="py-3 px-4 font-bold text-purple-600">12.36%</td>
                        <td className="py-3 px-4 font-bold text-green-600">$11,236.00</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                        <td className="py-3 px-4 font-semibold">Quarterly</td>
                        <td className="py-3 px-4">4</td>
                        <td className="py-3 px-4">12%</td>
                        <td className="py-3 px-4">3%</td>
                        <td className="py-3 px-4 font-bold text-purple-600">12.55%</td>
                        <td className="py-3 px-4 font-bold text-green-600">$11,255.09</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                        <td className="py-3 px-4 font-semibold">Monthly</td>
                        <td className="py-3 px-4">12</td>
                        <td className="py-3 px-4">12%</td>
                        <td className="py-3 px-4">1%</td>
                        <td className="py-3 px-4 font-bold text-purple-600">12.68%</td>
                        <td className="py-3 px-4 font-bold text-green-600">$11,268.25</td>
                      </tr>
                      <tr className="border-b border-gray-200 hover:bg-blue-50">
                        <td className="py-3 px-4 font-semibold">Daily</td>
                        <td className="py-3 px-4">365</td>
                        <td className="py-3 px-4">12%</td>
                        <td className="py-3 px-4">0.0329%</td>
                        <td className="py-3 px-4 font-bold text-purple-600">12.75%</td>
                        <td className="py-3 px-4 font-bold text-green-600">$11,274.75</td>
                      </tr>
                      <tr className="bg-indigo-50 hover:bg-indigo-100">
                        <td className="py-3 px-4 font-bold">Continuous</td>
                        <td className="py-3 px-4">∞</td>
                        <td className="py-3 px-4">12%</td>
                        <td className="py-3 px-4">—</td>
                        <td className="py-3 px-4 font-bold text-purple-600">12.75%</td>
                        <td className="py-3 px-4 font-bold text-green-600">$11,274.97</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 bg-indigo-50 rounded-lg p-4 border border-indigo-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">Key Insight:</span> With the same 12% APR, you earn more as compounding frequency increases.
                    The difference between annual and monthly compounding is <span className="font-bold text-indigo-600">$68.25 extra</span> on a $10,000 investment!
                  </p>
                </div>
              </div>

              {/* Key Relationships */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-lg border-2 border-indigo-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ArrowRight className="w-6 h-6 text-indigo-600" />
                  Key Relationships to Remember
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-white rounded-lg p-4 border-l-4 border-blue-500">
                    <p className="font-bold text-gray-800 mb-2">1. APR vs EAR</p>
                    <p className="text-sm text-gray-700">EAR is always ≥ APR. They're equal only when m = 1 (annual compounding)</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-green-500">
                    <p className="font-bold text-gray-800 mb-2">2. More Compounding = Higher Returns</p>
                    <p className="text-sm text-gray-700">As m increases, EAR increases (for a fixed APR)</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                    <p className="font-bold text-gray-800 mb-2">3. EAR = APY</p>
                    <p className="text-sm text-gray-700">These are the same concept, just different terminology used in different contexts</p>
                  </div>
                  <div className="bg-white rounded-lg p-4 border-l-4 border-amber-500">
                    <p className="font-bold text-gray-800 mb-2">4. Use EAR for Comparisons</p>
                    <p className="text-sm text-gray-700">Always compare investments using EAR, not APR, to account for compounding differences</p>
                  </div>
                </div>
              </div>

              {/* Formula Reference */}
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <Calculator className="w-6 h-6 text-indigo-600" />
                  Quick Formula Reference
                </h3>
                <div className="space-y-3">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-700 mb-2">Convert APR to Periodic Rate:</p>
                    <DisplayEquation>{'\\text{Periodic Rate} = \\frac{\\text{APR}}{m}'}</DisplayEquation>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-700 mb-2">Convert APR to EAR:</p>
                    <DisplayEquation>{'\\text{EAR} = \\left(1 + \\frac{\\text{APR}}{m}\\right)^m - 1'}</DisplayEquation>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="font-semibold text-gray-700 mb-2">Convert EAR to APR:</p>
                    <DisplayEquation>{'\\text{APR} = m \\times \\left[(1 + \\text{EAR})^{1/m} - 1\\right]'}</DisplayEquation>
                  </div>
                </div>
              </div>
            </div>
          </div>
            )}

            {/* Calculators Section */}
            {activeSection === 'calculators' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-gray-800 mb-1">{currentFormula.name}</h3>
              <p className="text-gray-600 text-xs">{currentFormula.description}</p>

              {/* Variation Tabs */}
              {currentFormula.variations && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {Object.entries(currentFormula.variations).map(([key, variation]) => (
                    <button
                      key={key}
                      onClick={() => setActiveVariation(key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        activeVariation === key
                          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
                      }`}
                    >
                      {variation.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Compact Formula Display */}
            <div className="grid grid-cols-1 gap-3 mb-4">
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-3 border border-indigo-200">
                <div className="text-[10px] font-bold text-indigo-600 mb-1 uppercase tracking-wide">
                  {currentVariation ? currentVariation.name : 'Formula Template'}
                </div>
                <div className="flex items-center justify-center overflow-x-auto">
                  <div style={{ fontSize: '0.9em' }}>
                    <DisplayEquation>{displayFormula}</DisplayEquation>
                  </div>
                </div>
              </div>

              {currentResult !== undefined && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200">
                  <div className="text-[10px] font-bold text-green-600 mb-1 uppercase tracking-wide">With Your Values</div>
                  <div className="flex items-center justify-center overflow-x-auto">
                    <div style={{ fontSize: '0.9em' }}>
                      <DisplayEquation>{generateDynamicEquation(activeFormula, currentVariation, activeVariation)}</DisplayEquation>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Compact Input Fields */}
            <div className="space-y-2.5 mb-4">
              {displayVariables.map(varKey => {
                const variable = getVariableMeta(varKey);
                return (
                  <div key={variable.key} className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      {variable.label}
                    </label>
                    {variable.hint && (
                      <p className="text-[10px] text-gray-500 mb-1.5">{variable.hint}</p>
                    )}
                    <input
                      type="number"
                      value={inputs[variable.key] || 0}
                      onChange={(e) => handleInputChange(variable.key, e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-sm font-semibold"
                      step="any"
                    />
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              <button
                onClick={calculateResult}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-bold text-sm hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Calculate Result
              </button>

              <button
                onClick={saveCalculation}
                className="w-full bg-gradient-to-r from-green-600 to-teal-600 text-white py-2.5 rounded-lg font-semibold text-sm hover:from-green-700 hover:to-teal-700 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                Save Calculation
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Result
            </h3>

            {currentResult !== undefined ? (
              <>
                {/* Result Card - Full Display */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200 mb-4">
                  <div className="text-[10px] font-bold text-gray-600 mb-2 uppercase tracking-wide">Final Result</div>
                  <div className="text-5xl font-bold text-green-600 mb-3 flex items-center justify-center break-all">
                    {formatResult(currentResult)}
                  </div>
                  {typeof currentResult === 'number' && (
                    <>
                      <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-green-200">
                        {/* Show breakdown for compound interest - only when solving for FV */}
                        {(activeFormula.includes('fv') || activeFormula.includes('ci') || activeFormula.includes('cim')) &&
                         (activeVariation === 'FV' || !currentFormula.variations) && (
                          <>
                            <div className="text-center">
                              <div className="text-[10px] text-gray-600 uppercase tracking-wide">Principal</div>
                              <div className="text-base font-bold text-blue-600">
                                ${inputs[`${activeFormula}_pv`]?.toFixed(2) || inputs.cim_pv?.toFixed(2) || inputs.ci_pv?.toFixed(2) || '0'}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-[10px] text-gray-600 uppercase tracking-wide">Interest</div>
                              <div className="text-base font-bold text-purple-600">
                                ${(currentResult - (inputs[`${activeFormula}_pv`] || inputs.cim_pv || inputs.ci_pv || 0)).toFixed(2)}
                              </div>
                            </div>
                          </>
                        )}
                        {/* Show rate of return percentage - only when solving for PV */}
                        {activeFormula.includes('pv') && (activeVariation === 'PV' || !currentFormula.variations) && (
                          <>
                            <div className="text-center">
                              <div className="text-[10px] text-gray-600 uppercase tracking-wide">Future Value</div>
                              <div className="text-base font-bold text-blue-600">
                                ${inputs.pv_fv?.toFixed(2) || '0'}
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-[10px] text-gray-600 uppercase tracking-wide">Discount</div>
                              <div className="text-base font-bold text-purple-600">
                                ${(inputs.pv_fv - currentResult).toFixed(2)}
                              </div>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Growth multiplier - only when solving for FV */}
                      {(activeFormula.includes('fv') || activeFormula.includes('ci') || activeFormula.includes('cim')) &&
                       (activeVariation === 'FV' || !currentFormula.variations) &&
                       inputs[`${activeFormula}_pv`] > 0 && (
                        <div className="mt-4 pt-4 border-t border-green-200 text-center">
                          <div className="text-[10px] text-gray-600 mb-1 uppercase tracking-wide">Growth Multiplier</div>
                          <div className="text-xl font-bold text-indigo-600">
                            {(currentResult / (inputs[`${activeFormula}_pv`] || inputs.cim_pv || inputs.ci_pv)).toFixed(3)}x
                          </div>
                          <div className="text-[10px] text-gray-500 mt-1">
                            Money grew {((currentResult / (inputs[`${activeFormula}_pv`] || inputs.cim_pv || inputs.ci_pv) - 1) * 100).toFixed(1)}%
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Excel Formula Guide - Mini Spreadsheet - Stacked Below */}
                {typeof currentResult === 'number' && (() => {
                  const excelGuide = getExcelFormulaGuide();
                  return (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 mb-4">
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
                            {excelGuide.tableRows.map((row) => (
                              <tr key={row.row} className="border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">{row.row}</td>
                                <td className="px-3 py-2 text-left font-medium text-gray-700 border-r border-gray-200">{row.label}</td>
                                <td className="px-3 py-2 text-right font-mono text-gray-800 bg-blue-50">
                                  {row.isRate ? row.value.toFixed(4) : row.value.toFixed(2)}
                                </td>
                              </tr>
                            ))}
                            <tr className="bg-yellow-50 border-t-2 border-yellow-400">
                              <td className="px-2 py-2 text-center font-bold text-gray-500 bg-gray-100 border-r border-gray-300">{excelGuide.tableRows.length + 1}</td>
                              <td className="px-3 py-2 text-left font-bold text-green-700">{excelGuide.resultLabel}</td>
                              <td className="px-3 py-2 text-right font-mono text-green-700 font-bold">
                                {typeof currentResult === 'number' ? currentResult.toFixed(2) : currentResult}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Excel Formula */}
                      <div className="bg-green-100 border border-green-300 rounded-lg px-4 py-3 mb-3">
                        <div className="text-xs text-gray-700 font-bold mb-1 uppercase tracking-wide">Excel Formula (Cell {excelGuide.excelFormulaCell}):</div>
                        <div className="font-mono text-base text-green-800 font-bold break-all">{excelGuide.excelFormula}</div>
                      </div>

                      {/* Notes */}
                      {excelGuide.notes.length > 0 && (
                        <div className="space-y-1.5">
                          {excelGuide.notes.map((note, idx) => (
                            <div key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                              <span className="text-blue-600 font-bold text-sm">•</span>
                              <span>{note}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="bg-gray-50 rounded-xl p-8 text-center border-2 border-dashed border-gray-300 mb-4">
                <Calculator className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-semibold">Enter values and click Calculate</p>
                <p className="text-gray-400 text-xs mt-1">Fill in all fields to see results</p>
              </div>
            )}

            <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-600">
              <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">Key Concepts</h4>
              <ul className="text-xs text-gray-600 space-y-1.5">
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

        {/* Full-Width Timeline Section */}
        {currentFormula.timeline && currentResult !== undefined && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
            <Timeline type={activeFormula} solvingFor={activeVariation} />
          </div>
        )}

              </div>
            )}

            {/* Amortization Section */}
            {activeSection === 'amortization' && <Amortization />}

            {/* Saved Calculations Section */}
            {activeSection === 'saved' && (
              <div className="bg-white rounded-2xl shadow-2xl p-8 animate-fadeIn">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-3 bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl">
                      <FolderOpen className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Saved Calculations</h2>
                      <p className="text-gray-600">{savedCalculations.length} calculation{savedCalculations.length !== 1 ? 's' : ''} saved</p>
                    </div>
                  </div>
                </div>

                {savedCalculations.length === 0 ? (
                  <div className="text-center py-12">
                    <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-2">No saved calculations yet</p>
                    <p className="text-gray-400 text-sm">Save your calculations from the calculator section to access them here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedCalculations.map((calc) => (
                      <div
                        key={calc.id}
                        className="bg-gradient-to-r from-pink-50 to-rose-50 border border-pink-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{calc.formulaName}</h3>
                            <p className="text-sm text-indigo-600 font-semibold">{calc.variationName}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              Saved: {new Date(calc.timestamp).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <button
                            onClick={() => {
                              const updated = savedCalculations.filter(c => c.id !== calc.id);
                              setSavedCalculations(updated);
                              localStorage.setItem('tvm_saved_calculations', JSON.stringify(updated));
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="bg-white rounded-lg p-4">
                          <div className="text-xs font-bold text-gray-600 mb-3 uppercase tracking-wide">
                            Input Values
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                            {Object.entries(calc.inputs)
                              .filter(([key]) => key.startsWith(calc.formulaKey + '_'))
                              .map(([key, value]) => {
                                const variableName = key.split('_').pop().toUpperCase();
                                return (
                                  <div key={key} className="bg-gray-50 rounded-lg px-3 py-2">
                                    <div className="text-xs text-gray-600 font-medium">{variableName}</div>
                                    <div className="text-sm font-bold text-gray-800">
                                      {typeof value === 'number' ? value.toFixed(2) : value}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                          <div className="pt-3 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-semibold text-gray-700">Result:</span>
                              <span className="text-2xl font-bold text-green-600">
                                {formatResult(calc.result)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setInputs(calc.inputs);
                            setActiveFormula(calc.formulaKey);
                            setActiveSection('calculators');
                          }}
                          className="mt-3 w-full py-2 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-lg font-semibold hover:from-pink-700 hover:to-rose-700 transition-all"
                        >
                          Load & Edit
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Analysis Section */}
            {activeSection === 'analysis' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="bg-white rounded-2xl shadow-2xl p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-orange-600 to-amber-600 rounded-xl">
                      <PieChart className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">Interactive Scenario Comparison</h2>
                      <p className="text-gray-600">Compare different investment scenarios side-by-side</p>
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">Quick Scenarios</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <button
                        onClick={() => {
                          setGrowthInputsA({ principal: 10000, rate: 4, years: 30 });
                          setGrowthInputsB({ principal: 10000, rate: 4, years: 30 });
                        }}
                        className="p-4 bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl transition-all text-left"
                      >
                        <div className="font-semibold text-blue-900 text-sm">Conservative</div>
                        <div className="text-xs text-blue-700 mt-1">4% return, 30 years</div>
                      </button>
                      <button
                        onClick={() => {
                          setGrowthInputsA({ principal: 10000, rate: 7, years: 30 });
                          setGrowthInputsB({ principal: 10000, rate: 7, years: 30 });
                        }}
                        className="p-4 bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl transition-all text-left"
                      >
                        <div className="font-semibold text-green-900 text-sm">Moderate</div>
                        <div className="text-xs text-green-700 mt-1">7% return, 30 years</div>
                      </button>
                      <button
                        onClick={() => {
                          setGrowthInputsA({ principal: 10000, rate: 10, years: 30 });
                          setGrowthInputsB({ principal: 10000, rate: 10, years: 30 });
                        }}
                        className="p-4 bg-orange-50 hover:bg-orange-100 border-2 border-orange-200 rounded-xl transition-all text-left"
                      >
                        <div className="font-semibold text-orange-900 text-sm">Aggressive</div>
                        <div className="text-xs text-orange-700 mt-1">10% return, 30 years</div>
                      </button>
                      <button
                        onClick={() => {
                          setGrowthInputsA({ principal: 5000, rate: 6, years: 10 });
                          setGrowthInputsB({ principal: 10000, rate: 6, years: 10 });
                        }}
                        className="p-4 bg-purple-50 hover:bg-purple-100 border-2 border-purple-200 rounded-xl transition-all text-left"
                      >
                        <div className="font-semibold text-purple-900 text-sm">Doubling Principal</div>
                        <div className="text-xs text-purple-700 mt-1">Compare $5K vs $10K</div>
                      </button>
                    </div>
                  </div>

                  {/* Scenario A & B Comparison */}
                  <div className="grid md:grid-cols-2 gap-6 mb-8">
                    {/* Scenario A */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                      <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        Scenario A
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Principal: ${growthInputsA.principal.toLocaleString()}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1000000"
                            step="1000"
                            value={growthInputsA.principal}
                            onChange={(e) => setGrowthInputsA({ ...growthInputsA, principal: Number(e.target.value) })}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Annual Rate: {growthInputsA.rate}%
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            step="0.5"
                            value={growthInputsA.rate}
                            onChange={(e) => setGrowthInputsA({ ...growthInputsA, rate: Number(e.target.value) })}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Years: {growthInputsA.years}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="50"
                            step="1"
                            value={growthInputsA.years}
                            onChange={(e) => setGrowthInputsA({ ...growthInputsA, years: Number(e.target.value) })}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Compounding (m): {growthInputsA.compounding === 1 ? 'Annually' : growthInputsA.compounding === 2 ? 'Semi-annually' : growthInputsA.compounding === 4 ? 'Quarterly' : growthInputsA.compounding === 12 ? 'Monthly' : growthInputsA.compounding === 52 ? 'Weekly' : growthInputsA.compounding === 365 ? 'Daily' : `${growthInputsA.compounding}x/year`}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="365"
                            step="1"
                            value={growthInputsA.compounding}
                            onChange={(e) => setGrowthInputsA({ ...growthInputsA, compounding: Number(e.target.value) })}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1 (Annual)</span>
                            <span>12 (Monthly)</span>
                            <span>365 (Daily)</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t-2 border-blue-200">
                          <div className="text-sm text-gray-600">Future Value:</div>
                          <div className="text-3xl font-bold text-blue-900">
                            ${(growthInputsA.principal * Math.pow(1 + growthInputsA.rate / 100 / growthInputsA.compounding, growthInputsA.compounding * growthInputsA.years)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            Total Gain: ${((growthInputsA.principal * Math.pow(1 + growthInputsA.rate / 100 / growthInputsA.compounding, growthInputsA.compounding * growthInputsA.years)) - growthInputsA.principal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Scenario B */}
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                      <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                        Scenario B
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Principal: ${growthInputsB.principal.toLocaleString()}
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="1000000"
                            step="1000"
                            value={growthInputsB.principal}
                            onChange={(e) => setGrowthInputsB({ ...growthInputsB, principal: Number(e.target.value) })}
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Annual Rate: {growthInputsB.rate}%
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="20"
                            step="0.5"
                            value={growthInputsB.rate}
                            onChange={(e) => setGrowthInputsB({ ...growthInputsB, rate: Number(e.target.value) })}
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Years: {growthInputsB.years}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="50"
                            step="1"
                            value={growthInputsB.years}
                            onChange={(e) => setGrowthInputsB({ ...growthInputsB, years: Number(e.target.value) })}
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Compounding (m): {growthInputsB.compounding === 1 ? 'Annually' : growthInputsB.compounding === 2 ? 'Semi-annually' : growthInputsB.compounding === 4 ? 'Quarterly' : growthInputsB.compounding === 12 ? 'Monthly' : growthInputsB.compounding === 52 ? 'Weekly' : growthInputsB.compounding === 365 ? 'Daily' : `${growthInputsB.compounding}x/year`}
                          </label>
                          <input
                            type="range"
                            min="1"
                            max="365"
                            step="1"
                            value={growthInputsB.compounding}
                            onChange={(e) => setGrowthInputsB({ ...growthInputsB, compounding: Number(e.target.value) })}
                            className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>1 (Annual)</span>
                            <span>12 (Monthly)</span>
                            <span>365 (Daily)</span>
                          </div>
                        </div>
                        <div className="pt-4 border-t-2 border-green-200">
                          <div className="text-sm text-gray-600">Future Value:</div>
                          <div className="text-3xl font-bold text-green-900">
                            ${(growthInputsB.principal * Math.pow(1 + growthInputsB.rate / 100 / growthInputsB.compounding, growthInputsB.compounding * growthInputsB.years)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className="text-sm text-gray-600 mt-2">
                            Total Gain: ${((growthInputsB.principal * Math.pow(1 + growthInputsB.rate / 100 / growthInputsB.compounding, growthInputsB.compounding * growthInputsB.years)) - growthInputsB.principal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Comparison Insights */}
                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                      <div className="text-sm font-semibold text-amber-900 mb-1">Difference in Returns</div>
                      <div className="text-2xl font-bold text-amber-800">
                        ${Math.abs((growthInputsB.principal * Math.pow(1 + growthInputsB.rate / 100 / growthInputsB.compounding, growthInputsB.compounding * growthInputsB.years)) - (growthInputsA.principal * Math.pow(1 + growthInputsA.rate / 100 / growthInputsA.compounding, growthInputsA.compounding * growthInputsA.years))).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-amber-700 mt-1">
                        {(growthInputsB.principal * Math.pow(1 + growthInputsB.rate / 100 / growthInputsB.compounding, growthInputsB.compounding * growthInputsB.years)) > (growthInputsA.principal * Math.pow(1 + growthInputsA.rate / 100 / growthInputsA.compounding, growthInputsA.compounding * growthInputsA.years)) ? 'Scenario B is higher' : 'Scenario A is higher'}
                      </div>
                    </div>
                    <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
                      <div className="text-sm font-semibold text-purple-900 mb-1">Rate Impact</div>
                      <div className="text-2xl font-bold text-purple-800">
                        {Math.abs(growthInputsB.rate - growthInputsA.rate).toFixed(1)}%
                      </div>
                      <div className="text-xs text-purple-700 mt-1">
                        Difference in annual returns
                      </div>
                    </div>
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                      <div className="text-sm font-semibold text-indigo-900 mb-1">Time Value</div>
                      <div className="text-2xl font-bold text-indigo-800">
                        {Math.max(growthInputsA.years, growthInputsB.years)} years
                      </div>
                      <div className="text-xs text-indigo-700 mt-1">
                        Longer timeline amplifies growth
                      </div>
                    </div>
                  </div>

                  {/* Visual Charts */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Bar Chart */}
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Growth Comparison (Bar)</h3>
                      <div className="h-64 flex items-end justify-between gap-2">
                      {(() => {
                        const maxYears = Math.max(growthInputsA.years, growthInputsB.years);
                        const years = Array.from({ length: Math.min(maxYears, 20) }, (_, i) => i + 1);
                        const maxValue = Math.max(
                          growthInputsA.principal * Math.pow(1 + growthInputsA.rate / 100 / growthInputsA.compounding, growthInputsA.compounding * maxYears),
                          growthInputsB.principal * Math.pow(1 + growthInputsB.rate / 100 / growthInputsB.compounding, growthInputsB.compounding * maxYears)
                        );

                        return years.map((year) => {
                          const valueA = year <= growthInputsA.years ? growthInputsA.principal * Math.pow(1 + growthInputsA.rate / 100 / growthInputsA.compounding, growthInputsA.compounding * year) : 0;
                          const valueB = year <= growthInputsB.years ? growthInputsB.principal * Math.pow(1 + growthInputsB.rate / 100 / growthInputsB.compounding, growthInputsB.compounding * year) : 0;
                          const heightA = (valueA / maxValue) * 100;
                          const heightB = (valueB / maxValue) * 100;

                          return (
                            <div key={year} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full flex gap-1 items-end" style={{ height: '200px' }}>
                                <div
                                  className="flex-1 bg-gradient-to-t from-blue-500 to-blue-300 rounded-t hover:from-blue-600 hover:to-blue-400 transition-all relative group"
                                  style={{ height: `${heightA}%` }}
                                >
                                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-blue-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ${valueA.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </div>
                                </div>
                                <div
                                  className="flex-1 bg-gradient-to-t from-green-500 to-green-300 rounded-t hover:from-green-600 hover:to-green-400 transition-all relative group"
                                  style={{ height: `${heightB}%` }}
                                >
                                  <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-green-900 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    ${valueB.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                  </div>
                                </div>
                              </div>
                              <div className="text-xs text-gray-600 font-semibold">{year}</div>
                            </div>
                          );
                        });
                      })()}
                      </div>
                      <div className="flex justify-center gap-6 mt-4">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-blue-500 rounded"></div>
                          <span className="text-sm text-gray-700">Scenario A</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 bg-green-500 rounded"></div>
                          <span className="text-sm text-gray-700">Scenario B</span>
                        </div>
                      </div>
                    </div>

                    {/* Line Chart */}
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-4">Growth Over Time (Line)</h3>
                      <ResponsiveContainer width="100%" height={280}>
                        <LineChart data={(() => {
                          const maxYears = Math.max(growthInputsA.years, growthInputsB.years);
                          const years = Array.from({ length: Math.min(maxYears, 30) }, (_, i) => i);
                          return years.map((year) => ({
                            year,
                            'Scenario A': year <= growthInputsA.years ? growthInputsA.principal * Math.pow(1 + growthInputsA.rate / 100 / growthInputsA.compounding, growthInputsA.compounding * year) : null,
                            'Scenario B': year <= growthInputsB.years ? growthInputsB.principal * Math.pow(1 + growthInputsB.rate / 100 / growthInputsB.compounding, growthInputsB.compounding * year) : null
                          }));
                        })()}>
                          <defs>
                            <linearGradient id="colorScenarioA" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
                            </linearGradient>
                            <linearGradient id="colorScenarioB" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                          <XAxis
                            dataKey="year"
                            label={{ value: 'Years', position: 'insideBottom', offset: -5 }}
                            tick={{ fontSize: 12 }}
                          />
                          <YAxis
                            label={{ value: 'Future Value ($)', angle: -90, position: 'insideLeft' }}
                            tick={{ fontSize: 12 }}
                            tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                          />
                          <Tooltip
                            formatter={(value) => value ? `$${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                            contentStyle={{ backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '8px' }}
                          />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="Scenario A"
                            stroke="#3B82F6"
                            strokeWidth={3}
                            dot={{ fill: '#3B82F6', r: 4 }}
                            activeDot={{ r: 6 }}
                            fill="url(#colorScenarioA)"
                          />
                          <Line
                            type="monotone"
                            dataKey="Scenario B"
                            stroke="#10B981"
                            strokeWidth={3}
                            dot={{ fill: '#10B981', r: 4 }}
                            activeDot={{ r: 6 }}
                            fill="url(#colorScenarioB)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="mt-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-purple-200">
                    <h3 className="text-lg font-bold text-purple-900 mb-3 flex items-center gap-2">
                      <Info className="w-5 h-5" />
                      Key Insights
                    </h3>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Time is powerful:</strong> Even small rate differences compound significantly over long periods</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Rate matters:</strong> A {Math.abs(growthInputsB.rate - growthInputsA.rate).toFixed(1)}% difference in returns creates a ${Math.abs((growthInputsB.principal * Math.pow(1 + growthInputsB.rate / 100 / growthInputsB.compounding, growthInputsB.compounding * growthInputsB.years)) - (growthInputsA.principal * Math.pow(1 + growthInputsA.rate / 100 / growthInputsA.compounding, growthInputsA.compounding * growthInputsA.years))).toLocaleString(undefined, { maximumFractionDigits: 0 })} gap</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span><strong>Start early:</strong> The earlier you invest, the more time compound interest has to work</span>
                      </li>
                    </ul>
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
              <div className="space-y-6 mb-8">
                {/* Compounding Frequency Impact - Side-by-Side Comparison */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-6 border-2 border-teal-300">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Clock className="w-6 h-6 text-teal-600" />
                    Compounding Frequency Comparison
                  </h3>
                  <p className="text-sm text-gray-700 mb-6">
                    Compare how different compounding frequencies affect returns over time - see the power of more frequent compounding!
                  </p>

                  {/* Side-by-Side Charts */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Scenario A */}
                    <div className="bg-white rounded-xl p-4 border-2 border-teal-200">
                      <h4 className="text-md font-bold text-teal-700 mb-3 flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Scenario A
                      </h4>

                      {/* Inputs for Scenario A */}
                      <div className="bg-teal-50 rounded-lg p-3 mb-4 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Principal ($)</label>
                            <input
                              type="number"
                              value={comparisonInputsA.principal}
                              onChange={(e) => setComparisonInputsA(prev => ({ ...prev, principal: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-teal-300 rounded focus:border-teal-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Rate (%)</label>
                            <input
                              type="number"
                              value={comparisonInputsA.rate}
                              onChange={(e) => setComparisonInputsA(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-teal-300 rounded focus:border-teal-500 focus:outline-none"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Years</label>
                            <input
                              type="number"
                              value={comparisonInputsA.years}
                              onChange={(e) => setComparisonInputsA(prev => ({ ...prev, years: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-teal-300 rounded focus:border-teal-500 focus:outline-none"
                              max="30"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Chart A */}
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart
                          data={generateComparisonDataWith(comparisonInputsA)}
                          margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                          <YAxis width={60} tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} tick={{ fontSize: 9 }} />
                          <Tooltip
                            formatter={(value) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                            contentStyle={{ fontSize: '10px', padding: '4px', borderRadius: '6px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Line type="monotone" dataKey="simple" stroke="#ef4444" name="Simple" strokeWidth={1.5} dot={false} />
                          <Line type="monotone" dataKey="annual" stroke="#f59e0b" name="Annual" strokeWidth={1.5} dot={false} />
                          <Line type="monotone" dataKey="monthly" stroke="#3b82f6" name="Monthly" strokeWidth={1.5} dot={false} />
                          <Line type="monotone" dataKey="continuous" stroke="#10b981" name="Continuous" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>

                      {/* Summary A */}
                      <div className="mt-3 grid grid-cols-4 gap-1">
                        {(() => {
                          const data = generateComparisonDataWith(comparisonInputsA);
                          const final = data[data.length - 1];
                          return (
                            <>
                              <div className="bg-red-50 rounded px-1 py-1 text-center border border-red-200">
                                <div className="text-xs text-red-600">Simple</div>
                                <div className="text-xs font-bold text-red-700">${(final.simple/1000).toFixed(1)}k</div>
                              </div>
                              <div className="bg-amber-50 rounded px-1 py-1 text-center border border-amber-200">
                                <div className="text-xs text-amber-600">Annual</div>
                                <div className="text-xs font-bold text-amber-700">${(final.annual/1000).toFixed(1)}k</div>
                              </div>
                              <div className="bg-blue-50 rounded px-1 py-1 text-center border border-blue-200">
                                <div className="text-xs text-blue-600">Monthly</div>
                                <div className="text-xs font-bold text-blue-700">${(final.monthly/1000).toFixed(1)}k</div>
                              </div>
                              <div className="bg-green-50 rounded px-1 py-1 text-center border border-green-300">
                                <div className="text-xs text-green-700 font-semibold">Continuous</div>
                                <div className="text-xs font-bold text-green-800">${(final.continuous/1000).toFixed(1)}k</div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Scenario B */}
                    <div className="bg-white rounded-xl p-4 border-2 border-cyan-200">
                      <h4 className="text-md font-bold text-cyan-700 mb-3 flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Scenario B
                      </h4>

                      {/* Inputs for Scenario B */}
                      <div className="bg-cyan-50 rounded-lg p-3 mb-4 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Principal ($)</label>
                            <input
                              type="number"
                              value={comparisonInputsB.principal}
                              onChange={(e) => setComparisonInputsB(prev => ({ ...prev, principal: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-cyan-300 rounded focus:border-cyan-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Rate (%)</label>
                            <input
                              type="number"
                              value={comparisonInputsB.rate}
                              onChange={(e) => setComparisonInputsB(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-cyan-300 rounded focus:border-cyan-500 focus:outline-none"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Years</label>
                            <input
                              type="number"
                              value={comparisonInputsB.years}
                              onChange={(e) => setComparisonInputsB(prev => ({ ...prev, years: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-cyan-300 rounded focus:border-cyan-500 focus:outline-none"
                              max="30"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Chart B */}
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart
                          data={generateComparisonDataWith(comparisonInputsB)}
                          margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                          <YAxis width={60} tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} tick={{ fontSize: 9 }} />
                          <Tooltip
                            formatter={(value) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                            contentStyle={{ fontSize: '10px', padding: '4px', borderRadius: '6px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Line type="monotone" dataKey="simple" stroke="#ef4444" name="Simple" strokeWidth={1.5} dot={false} />
                          <Line type="monotone" dataKey="annual" stroke="#f59e0b" name="Annual" strokeWidth={1.5} dot={false} />
                          <Line type="monotone" dataKey="monthly" stroke="#3b82f6" name="Monthly" strokeWidth={1.5} dot={false} />
                          <Line type="monotone" dataKey="continuous" stroke="#10b981" name="Continuous" strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>

                      {/* Summary B */}
                      <div className="mt-3 grid grid-cols-4 gap-1">
                        {(() => {
                          const data = generateComparisonDataWith(comparisonInputsB);
                          const final = data[data.length - 1];
                          return (
                            <>
                              <div className="bg-red-50 rounded px-1 py-1 text-center border border-red-200">
                                <div className="text-xs text-red-600">Simple</div>
                                <div className="text-xs font-bold text-red-700">${(final.simple/1000).toFixed(1)}k</div>
                              </div>
                              <div className="bg-amber-50 rounded px-1 py-1 text-center border border-amber-200">
                                <div className="text-xs text-amber-600">Annual</div>
                                <div className="text-xs font-bold text-amber-700">${(final.annual/1000).toFixed(1)}k</div>
                              </div>
                              <div className="bg-blue-50 rounded px-1 py-1 text-center border border-blue-200">
                                <div className="text-xs text-blue-600">Monthly</div>
                                <div className="text-xs font-bold text-blue-700">${(final.monthly/1000).toFixed(1)}k</div>
                              </div>
                              <div className="bg-green-50 rounded px-1 py-1 text-center border border-green-300">
                                <div className="text-xs text-green-700 font-semibold">Continuous</div>
                                <div className="text-xs font-bold text-green-800">${(final.continuous/1000).toFixed(1)}k</div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Comparison Insight */}
                  <div className="mt-6 bg-gradient-to-r from-teal-100 to-cyan-100 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2">Key Insight:</h5>
                    <p className="text-sm text-gray-700">
                      More frequent compounding leads to higher returns! The difference between simple and continuous compounding grows larger over time.
                      Notice how monthly and continuous compounding produce very similar results.
                    </p>
                  </div>
                </div>

                {/* Compounding Frequency - Educational Deep Dive */}
                <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-2xl p-8 border-2 border-indigo-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
                      <Clock className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-800">The Effect of Compounding Frequency</h3>
                      <p className="text-gray-600 font-semibold">Understanding the Path to Continuous Compounding & Euler's Number (e)</p>
                    </div>
                  </div>

                  {/* User Controls */}
                  <div className="bg-white rounded-xl p-6 mb-6 border-2 border-indigo-300 shadow-lg">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-indigo-600" />
                      Experiment with Different Scenarios
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Principal Amount ($)
                        </label>
                        <input
                          type="number"
                          value={freqInputs.principal}
                          onChange={(e) => setFreqInputs(prev => ({ ...prev, principal: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-lg font-semibold"
                          min="0"
                          step="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Annual Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          value={freqInputs.rate}
                          onChange={(e) => setFreqInputs(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-lg font-semibold"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Time Period (Years)
                        </label>
                        <input
                          type="number"
                          value={freqInputs.years}
                          onChange={(e) => setFreqInputs(prev => ({ ...prev, years: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none transition-colors text-lg font-semibold"
                          min="1"
                          max="50"
                          step="1"
                        />
                      </div>
                    </div>
                  </div>

                  {/* TWO CHARTS SIDE BY SIDE - COMPACT */}
                  <div className="grid lg:grid-cols-2 gap-4 mb-6">
                    {/* Line Chart with Scatter Points */}
                    <div className="bg-white rounded-xl p-5 border-2 border-indigo-200">
                      <h4 className="text-base font-bold text-indigo-700 mb-2">Convergence to Continuous Compounding</h4>
                      <p className="text-xs text-gray-600 mb-3">
                        As <InlineEquation>m</InlineEquation> increases, value converges to <InlineEquation>{"Pe^{rt}"}</InlineEquation>
                      </p>
                      <ResponsiveContainer width="100%" height={350}>
                      <LineChart
                        data={generateCompoundingFrequencyComparison()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={100}
                          interval={0}
                          tick={{ fontSize: 11, fontWeight: 600 }}
                        />
                        <YAxis
                          label={{ value: 'Final Value ($)', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold' } }}
                          domain={['dataMin - 50', 'dataMax + 20']}
                          width={80}
                          tickFormatter={(value) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                          tick={{ fontSize: 11, fontWeight: 600 }}
                        />
                        <Tooltip
                          formatter={(value, name, props) => {
                            const diff = props.payload.m === Infinity ? 0 : (freqInputs.principal * Math.exp((freqInputs.rate/100) * freqInputs.years) - value);
                            return [
                              `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                              `Final Value ${props.payload.m !== Infinity && props.payload.m !== 0 ? `(m=${props.payload.m})` : ''}`
                            ];
                          }}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                            border: '2px solid #6366f1',
                            borderRadius: '12px',
                            padding: '12px',
                            fontWeight: '600'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#6366f1"
                          strokeWidth={3}
                          dot={{ fill: '#8b5cf6', r: 6, strokeWidth: 2, stroke: '#fff' }}
                          activeDot={{ r: 8, fill: '#ec4899' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    </div>

                    {/* Euler's Number e Demonstration */}
                    <div className="bg-white rounded-xl p-5 border-2 border-purple-300">
                      <h4 className="text-base font-bold text-purple-700 mb-2">Understanding Euler's Number (e ≈ 2.71828...)</h4>
                      <p className="text-xs text-gray-600 mb-3">
                        <InlineEquation>{"\\left(1 + \\frac{1}{m}\\right)^m"}</InlineEquation> → <InlineEquation>e</InlineEquation> as <InlineEquation>{"m \\to \\infty"}</InlineEquation>
                      </p>
                      <ResponsiveContainer width="100%" height={350}>
                      <LineChart
                        data={calculateEApproximation()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="name"
                          label={{ value: 'Compounding Frequency (m)', position: 'insideBottom', offset: -5, style: { fontWeight: 'bold', fontSize: 11 } }}
                          tick={{ fontSize: 10, fontWeight: 600 }}
                        />
                        <YAxis
                          domain={[2, 2.72]}
                          label={{ value: '(1 + 1/m)^m', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold', fontSize: 11 } }}
                          width={60}
                          tickFormatter={(value) => value.toFixed(2)}
                          tick={{ fontSize: 10, fontWeight: 600 }}
                        />
                        <Tooltip
                          formatter={(value, name, props) => {
                            const diff = Math.E - value;
                            return [
                              `${value.toFixed(8)}`,
                              `Value (${diff.toFixed(8)} from e)`
                            ];
                          }}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                            border: '2px solid #a855f7',
                            borderRadius: '12px',
                            padding: '12px',
                            fontWeight: '600'
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="value"
                          stroke="#a855f7"
                          strokeWidth={3}
                          dot={{ fill: '#c084fc', r: 5, strokeWidth: 2, stroke: '#fff' }}
                        />
                        <Line
                          type="monotone"
                          dataKey={() => Math.E}
                          stroke="#ef4444"
                          strokeWidth={2}
                          strokeDasharray="5 5"
                          dot={false}
                          name="e = 2.71828..."
                        />
                      </LineChart>
                    </ResponsiveContainer>
                    <div className="mt-3 text-center bg-purple-50 rounded-lg p-2">
                      <p className="text-xs font-bold text-purple-700">
                        <InlineEquation>{"e = 2.718281828459045..."}</InlineEquation> (red line)
                      </p>
                    </div>
                    </div>
                  </div>

                  {/* Formula Transformation - COMPACT */}
                  <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-4 text-white mb-6 shadow-lg">
                    <h4 className="text-lg font-bold mb-3">Formula Transformation: Discrete → Continuous</h4>
                    <div className="grid md:grid-cols-3 gap-3 text-xs">
                      <div className="bg-white/10 rounded-lg p-3 backdrop-blur">
                        <p className="font-bold mb-1 text-sm">Step 1: Discrete</p>
                        <div className="my-2">
                          <DisplayEquation>{"FV = PV \\times \\left(1 + \\frac{r}{m}\\right)^{m \\times n}"}</DisplayEquation>
                        </div>
                        <p className="text-indigo-100 leading-tight">where <InlineEquation>m</InlineEquation> = periods/year</p>
                      </div>
                      <div className="bg-white/15 rounded-lg p-3 backdrop-blur">
                        <p className="font-bold mb-1 text-sm">Step 2: Limit</p>
                        <div className="my-2">
                          <DisplayEquation>{"\\lim_{m \\to \\infty} \\left(1 + \\frac{r}{m}\\right)^{m \\times n} = e^{r \\times n}"}</DisplayEquation>
                        </div>
                        <p className="text-indigo-100 leading-tight">As <InlineEquation>m \to \infty</InlineEquation></p>
                      </div>
                      <div className="bg-white/20 rounded-lg p-3 backdrop-blur border-2 border-white/50">
                        <p className="font-bold mb-1 text-sm">Step 3: Continuous</p>
                        <div className="my-2">
                          <DisplayEquation>{"FV = PV \\times e^{r \\times t}"}</DisplayEquation>
                        </div>
                        <p className="text-indigo-100 leading-tight">Maximum growth</p>
                      </div>
                    </div>
                  </div>

                  {/* Data Table */}
                  <div className="bg-white rounded-xl p-6 border-2 border-indigo-200">
                    <h4 className="text-lg font-bold text-indigo-700 mb-3">Detailed Comparison</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-sm">
                        <thead>
                          <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                            <th className="p-3 text-left font-bold border-2 border-white">Frequency</th>
                            <th className="p-3 text-center font-bold border-2 border-white">m (periods/year)</th>
                            <th className="p-3 text-right font-bold border-2 border-white">Formula</th>
                            <th className="p-3 text-right font-bold border-2 border-white">Final Value</th>
                            <th className="p-3 text-right font-bold border-2 border-white">Difference from Continuous</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generateCompoundingFrequencyComparison().map((item, idx) => {
                            const continuousValue = freqInputs.principal * Math.exp((freqInputs.rate/100) * freqInputs.years);
                            const diff = continuousValue - item.value;
                            return (
                              <tr key={idx} className={`${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-indigo-50 transition-colors`}>
                                <td className="p-3 font-bold text-indigo-600 border border-gray-200">{item.name}</td>
                                <td className="p-3 text-center font-semibold text-gray-700 border border-gray-200">
                                  {item.m === 0 ? 'N/A' : item.m === Infinity ? '∞' : item.m.toLocaleString()}
                                </td>
                                <td className="p-3 text-right text-xs text-gray-600 border border-gray-200">
                                  {item.m === 0 ? (
                                    <InlineEquation>{"PV(1 + rt)"}</InlineEquation>
                                  ) : item.m === Infinity ? (
                                    <InlineEquation>{"PV \\times e^{rt}"}</InlineEquation>
                                  ) : (
                                    <InlineEquation>{`PV\\left(1 + \\frac{r}{${item.m}}\\right)^{${item.m} \\times t}`}</InlineEquation>
                                  )}
                                </td>
                                <td className="p-3 text-right font-bold text-purple-600 border border-gray-200">
                                  ${item.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="p-3 text-right font-semibold border border-gray-200">
                                  {diff > 0 ? (
                                    <span className="text-orange-600">-${diff.toFixed(2)}</span>
                                  ) : (
                                    <span className="text-green-600">$0.00</span>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Key Insights */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-5 border-2 border-blue-300">
                      <h5 className="font-bold text-blue-800 mb-3">Key Insight #1</h5>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        As compounding frequency increases, returns increase but at a <strong>diminishing rate</strong>.
                        Going from annual to daily gives significant gains, but daily to per-second gives negligible improvement.
                      </p>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-300">
                      <h5 className="font-bold text-purple-800 mb-3">Key Insight #2</h5>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Continuous compounding (<InlineEquation>{"Pe^{rt}"}</InlineEquation>) represents the <strong>theoretical maximum</strong> return
                        for a given rate. In practice, daily compounding gets you 99.9% of the way there!
                      </p>
                    </div>
                  </div>
                </div>

                {/* THE MAGIC: Interest on Interest Breakdown */}
                <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-2xl shadow-2xl p-8 border-2 border-green-300">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-3xl font-bold text-gray-800">The Power of Compound Interest</h3>
                      <p className="text-gray-600 font-semibold">Visualizing Interest on Interest</p>
                    </div>
                  </div>

                  {/* Input Controls */}
                  <div className="bg-white rounded-xl p-6 mb-6 border-2 border-green-300 shadow-lg">
                    <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      Customize Your Analysis
                    </h4>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Principal Amount ($)
                        </label>
                        <input
                          type="number"
                          value={chartInputs.principal}
                          onChange={(e) => setChartInputs(prev => ({ ...prev, principal: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-lg font-semibold"
                          min="0"
                          step="100"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Annual Interest Rate (%)
                        </label>
                        <input
                          type="number"
                          value={chartInputs.rate}
                          onChange={(e) => setChartInputs(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-lg font-semibold"
                          min="0"
                          max="100"
                          step="0.1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">
                          Time Period (Years)
                        </label>
                        <input
                          type="number"
                          value={chartInputs.years}
                          onChange={(e) => setChartInputs(prev => ({ ...prev, years: parseFloat(e.target.value) || 0 }))}
                          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors text-lg font-semibold"
                          min="1"
                          max="50"
                          step="1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 mb-6 border-2 border-green-200">
                    <h4 className="text-lg font-bold text-green-700 mb-3">Stacked Breakdown: Where Your Money Comes From</h4>
                    <p className="text-sm text-gray-600 mb-4">
                      ${chartInputs.principal.toLocaleString()} invested at {chartInputs.rate}% for {chartInputs.years} years - Notice how the GREEN section (interest on interest) grows exponentially!
                    </p>
                    <ResponsiveContainer width="100%" height={450}>
                      <BarChart
                        data={generateInterestOnInterestData()}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis
                          dataKey="year"
                          label={{ value: 'Year', position: 'insideBottom', offset: -5, style: { fontWeight: 'bold' } }}
                        />
                        <YAxis
                          label={{ value: 'Total Value ($)', angle: -90, position: 'insideLeft', style: { fontWeight: 'bold' } }}
                          width={80}
                          tickFormatter={(value) => `$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                          tick={{ fontSize: 11, fontWeight: 600 }}
                        />
                        <Tooltip
                          formatter={(value, name) => {
                            const nameMap = {
                              principal: 'Principal',
                              interestOnPrincipal: 'Interest on Principal',
                              interestOnInterest: 'Interest on Interest'
                            };
                            return [`$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, nameMap[name] || name];
                          }}
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.98)',
                            border: '2px solid #10b981',
                            borderRadius: '12px',
                            padding: '12px',
                            fontWeight: '600'
                          }}
                        />
                        <Legend
                          wrapperStyle={{ paddingTop: '20px', fontWeight: '600' }}
                          formatter={(value) => {
                            const nameMap = {
                              principal: 'Principal',
                              interestOnPrincipal: 'Interest on Principal',
                              interestOnInterest: 'Interest on Interest'
                            };
                            return nameMap[value] || value;
                          }}
                        />
                        <Bar dataKey="principal" stackId="a" fill="#94a3b8" name="principal" radius={[0, 0, 0, 0]}>
                          {generateInterestOnInterestData().map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                          ))}
                        </Bar>
                        <Bar dataKey="interestOnPrincipal" stackId="a" fill="#fbbf24" name="interestOnPrincipal" />
                        <Bar dataKey="interestOnInterest" stackId="a" fill="#34d399" name="interestOnInterest" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    {(() => {
                      const summary = calculateSummaryValues();
                      return (
                        <>
                          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-5 border-2 border-gray-400 text-center">
                            <div className="text-sm font-bold text-gray-700 mb-1 uppercase tracking-wide">Principal</div>
                            <div className="text-3xl font-bold text-gray-800 my-3">
                              ${summary.principal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-gray-600">Your original investment</div>
                            <div className="text-xs text-gray-500 mt-1">(Stays constant)</div>
                          </div>
                          <div className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl p-5 border-2 border-blue-400 text-center">
                            <div className="text-sm font-bold text-blue-700 mb-1 uppercase tracking-wide">Interest on Principal</div>
                            <div className="text-3xl font-bold text-blue-800 my-3">
                              ${summary.interestOnPrincipal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-blue-700">{chartInputs.rate}% × ${chartInputs.principal.toLocaleString()} × {chartInputs.years} years</div>
                            <div className="text-xs text-blue-600 mt-1 font-semibold">(Linear growth)</div>
                          </div>
                          <div className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-5 border-2 border-green-500 text-center shadow-lg">
                            <div className="text-sm font-bold text-green-700 mb-1 uppercase tracking-wide">Interest on Interest</div>
                            <div className="text-3xl font-bold text-green-800 my-3">
                              ${summary.interestOnInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-xs text-green-700">Interest earning interest</div>
                            <div className="text-xs text-green-600 mt-1 font-semibold">(Exponential growth!)</div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl p-6 text-white shadow-lg">
                    {(() => {
                      const summary = calculateSummaryValues();
                      return (
                        <>
                          <h4 className="text-xl font-bold mb-4">Key Insight: The Power of Compounding</h4>
                          <div className="grid md:grid-cols-2 gap-4 text-sm">
                            <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                              <p className="font-semibold mb-2">Simple Interest</p>
                              <p className="text-xs text-green-100 mb-2">({chartInputs.rate}% × ${chartInputs.principal.toLocaleString()} × {chartInputs.years} years)</p>
                              <p className="text-3xl font-bold">
                                ${summary.simpleValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                              <p className="text-xs mt-2 text-green-100">Principal + Interest on Principal only</p>
                            </div>
                            <div className="bg-white/20 rounded-lg p-4 backdrop-blur border-2 border-white/50">
                              <p className="font-semibold mb-2">Compound Interest</p>
                              <p className="text-xs text-green-100 mb-2">(Annual compounding)</p>
                              <p className="text-3xl font-bold">
                                ${summary.compoundValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                              </p>
                              <p className="text-xs mt-2 text-green-100">Principal + Interest on Principal + Interest on Interest</p>
                            </div>
                          </div>
                          <div className="mt-4 text-center bg-white/10 rounded-lg p-3 backdrop-blur">
                            <p className="text-lg font-bold">
                              Extra ${summary.extraFromCompounding.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} from compounding = {summary.percentageGain.toFixed(1)}% more money!
                            </p>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>

                {/* Component Growth Over Time - Side-by-Side Comparison */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-indigo-300 mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-6 h-6 text-indigo-600" />
                    Component Growth Comparison: Principal vs Interest
                  </h3>
                  <p className="text-sm text-gray-700 mb-6">
                    Compare how different scenarios affect the breakdown between Principal, Simple Interest, and Compound Interest over time!
                  </p>

                  {/* Side-by-Side Charts */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Scenario A */}
                    <div className="bg-white rounded-xl p-4 border-2 border-blue-200">
                      <h4 className="text-md font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Scenario A
                      </h4>

                      {/* Inputs for Scenario A */}
                      <div className="bg-blue-50 rounded-lg p-3 mb-4 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Principal ($)</label>
                            <input
                              type="number"
                              value={growthInputsA.principal}
                              onChange={(e) => setGrowthInputsA(prev => ({ ...prev, principal: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Rate (%)</label>
                            <input
                              type="number"
                              value={growthInputsA.rate}
                              onChange={(e) => setGrowthInputsA(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Years</label>
                            <input
                              type="number"
                              value={growthInputsA.years}
                              onChange={(e) => setGrowthInputsA(prev => ({ ...prev, years: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-blue-300 rounded focus:border-blue-500 focus:outline-none"
                              max="30"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Chart A */}
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart
                          data={generateInterestOnInterestDataWith(growthInputsA)}
                          margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                          <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                          <YAxis width={60} tick={{ fontSize: 9 }} tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                          <Tooltip
                            formatter={(value, name) => {
                              const nameMap = { principal: 'Principal', interestOnPrincipal: 'Simple Int', interestOnInterest: 'Compound Int' };
                              return [`$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, nameMap[name] || name];
                            }}
                            contentStyle={{ fontSize: '10px', padding: '4px', borderRadius: '6px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Area type="monotone" dataKey="principal" stackId="1" stroke="#94a3b8" fill="#e2e8f0" name="Principal" />
                          <Area type="monotone" dataKey="interestOnPrincipal" stackId="1" stroke="#f59e0b" fill="#fde68a" name="Simple Int" />
                          <Area type="monotone" dataKey="interestOnInterest" stackId="1" stroke="#059669" fill="#86efac" name="Compound Int" />
                        </AreaChart>
                      </ResponsiveContainer>

                      {/* Summary A */}
                      <div className="mt-3 grid grid-cols-3 gap-1 text-center">
                        {(() => {
                          const summary = calculateSummaryValuesWith(growthInputsA);
                          return (
                            <>
                              <div className="bg-slate-100 rounded px-1 py-1">
                                <div className="text-xs text-gray-600">Principal</div>
                                <div className="text-xs font-bold text-gray-800">${(summary.principal/1000).toFixed(1)}k</div>
                              </div>
                              <div className="bg-amber-100 rounded px-1 py-1">
                                <div className="text-xs text-amber-700">Simple</div>
                                <div className="text-xs font-bold text-amber-800">${(summary.interestOnPrincipal/1000).toFixed(1)}k</div>
                              </div>
                              <div className="bg-green-100 rounded px-1 py-1">
                                <div className="text-xs text-green-700">Compound</div>
                                <div className="text-xs font-bold text-green-800">${(summary.interestOnInterest/1000).toFixed(1)}k</div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Scenario B */}
                    <div className="bg-white rounded-xl p-4 border-2 border-indigo-200">
                      <h4 className="text-md font-bold text-indigo-700 mb-3 flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Scenario B
                      </h4>

                      {/* Inputs for Scenario B */}
                      <div className="bg-indigo-50 rounded-lg p-3 mb-4 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Principal ($)</label>
                            <input
                              type="number"
                              value={growthInputsB.principal}
                              onChange={(e) => setGrowthInputsB(prev => ({ ...prev, principal: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-indigo-300 rounded focus:border-indigo-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Rate (%)</label>
                            <input
                              type="number"
                              value={growthInputsB.rate}
                              onChange={(e) => setGrowthInputsB(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-indigo-300 rounded focus:border-indigo-500 focus:outline-none"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Years</label>
                            <input
                              type="number"
                              value={growthInputsB.years}
                              onChange={(e) => setGrowthInputsB(prev => ({ ...prev, years: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-indigo-300 rounded focus:border-indigo-500 focus:outline-none"
                              max="30"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Chart B */}
                      <ResponsiveContainer width="100%" height={250}>
                        <AreaChart
                          data={generateInterestOnInterestDataWith(growthInputsB)}
                          margin={{ top: 5, right: 10, left: 5, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                          <XAxis dataKey="year" tick={{ fontSize: 9 }} />
                          <YAxis width={60} tick={{ fontSize: 9 }} tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                          <Tooltip
                            formatter={(value, name) => {
                              const nameMap = { principal: 'Principal', interestOnPrincipal: 'Simple Int', interestOnInterest: 'Compound Int' };
                              return [`$${value.toLocaleString('en-US', { maximumFractionDigits: 0 })}`, nameMap[name] || name];
                            }}
                            contentStyle={{ fontSize: '10px', padding: '4px', borderRadius: '6px' }}
                          />
                          <Legend wrapperStyle={{ fontSize: '10px' }} />
                          <Area type="monotone" dataKey="principal" stackId="1" stroke="#94a3b8" fill="#e2e8f0" name="Principal" />
                          <Area type="monotone" dataKey="interestOnPrincipal" stackId="1" stroke="#f59e0b" fill="#fde68a" name="Simple Int" />
                          <Area type="monotone" dataKey="interestOnInterest" stackId="1" stroke="#059669" fill="#86efac" name="Compound Int" />
                        </AreaChart>
                      </ResponsiveContainer>

                      {/* Summary B */}
                      <div className="mt-3 grid grid-cols-3 gap-1 text-center">
                        {(() => {
                          const summary = calculateSummaryValuesWith(growthInputsB);
                          return (
                            <>
                              <div className="bg-slate-100 rounded px-1 py-1">
                                <div className="text-xs text-gray-600">Principal</div>
                                <div className="text-xs font-bold text-gray-800">${(summary.principal/1000).toFixed(1)}k</div>
                              </div>
                              <div className="bg-amber-100 rounded px-1 py-1">
                                <div className="text-xs text-amber-700">Simple</div>
                                <div className="text-xs font-bold text-amber-800">${(summary.interestOnPrincipal/1000).toFixed(1)}k</div>
                              </div>
                              <div className="bg-green-100 rounded px-1 py-1">
                                <div className="text-xs text-green-700">Compound</div>
                                <div className="text-xs font-bold text-green-800">${(summary.interestOnInterest/1000).toFixed(1)}k</div>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                    </div>
                  </div>

                  {/* Comparison Insight */}
                  <div className="mt-6 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2">Key Insight:</h5>
                    <p className="text-sm text-gray-700">
                      The green area (compound interest) represents "interest on interest" - this is what makes your money grow exponentially over time!
                    </p>
                  </div>
                </div>

                {/* Snowball Effect: Side-by-Side Comparison */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border-2 border-purple-300">
                  <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                    Snowball Effect Comparison: Year-by-Year Growth
                  </h3>
                  <p className="text-sm text-gray-700 mb-6">
                    Compare how different scenarios affect compound interest accumulation over time - notice how interest earned accelerates each year!
                  </p>

                  {/* Side-by-Side Tables */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Scenario A */}
                    <div className="bg-white rounded-xl p-4 border-2 border-purple-200">
                      <h4 className="text-md font-bold text-purple-700 mb-3 flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Scenario A
                      </h4>

                      {/* Inputs for Scenario A */}
                      <div className="bg-purple-50 rounded-lg p-3 mb-4 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Principal ($)</label>
                            <input
                              type="number"
                              value={snowballInputsA.principal}
                              onChange={(e) => setSnowballInputsA(prev => ({ ...prev, principal: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-purple-300 rounded focus:border-purple-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Rate (%)</label>
                            <input
                              type="number"
                              value={snowballInputsA.rate}
                              onChange={(e) => setSnowballInputsA(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-purple-300 rounded focus:border-purple-500 focus:outline-none"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Years</label>
                            <input
                              type="number"
                              value={snowballInputsA.years}
                              onChange={(e) => setSnowballInputsA(prev => ({ ...prev, years: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-purple-300 rounded focus:border-purple-500 focus:outline-none"
                              max="30"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Table A */}
                      <div className="overflow-y-auto max-h-96">
                        <table className="w-full border-collapse text-xs">
                          <thead className="sticky top-0">
                            <tr className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                              <th className="py-1 px-1 text-left font-semibold border border-white/20">Yr</th>
                              <th className="py-1 px-1 text-right font-semibold border border-white/20">Start</th>
                              <th className="py-1 px-1 text-right font-semibold border border-white/20">Interest</th>
                              <th className="py-1 px-1 text-right font-semibold border border-white/20">End</th>
                            </tr>
                          </thead>
                          <tbody>
                            {generateSnowballEffectWith(snowballInputsA).map((row) => (
                              <tr key={row.year} className="bg-white hover:bg-purple-50 transition-colors">
                                <td className="py-1 px-1 font-bold text-purple-600 border border-gray-200">{row.year}</td>
                                <td className="py-1 px-1 text-right font-medium text-gray-700 border border-gray-200 text-xs">
                                  ${row.startingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="py-1 px-1 text-right font-bold text-green-600 border border-gray-200 text-xs">
                                  ${row.interestEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="py-1 px-1 text-right font-bold text-purple-600 border border-gray-200 text-xs">
                                  ${row.endingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Scenario B */}
                    <div className="bg-white rounded-xl p-4 border-2 border-pink-200">
                      <h4 className="text-md font-bold text-pink-700 mb-3 flex items-center gap-2">
                        <Calculator className="w-5 h-5" />
                        Scenario B
                      </h4>

                      {/* Inputs for Scenario B */}
                      <div className="bg-pink-50 rounded-lg p-3 mb-4 space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Principal ($)</label>
                            <input
                              type="number"
                              value={snowballInputsB.principal}
                              onChange={(e) => setSnowballInputsB(prev => ({ ...prev, principal: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-pink-300 rounded focus:border-pink-500 focus:outline-none"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Rate (%)</label>
                            <input
                              type="number"
                              value={snowballInputsB.rate}
                              onChange={(e) => setSnowballInputsB(prev => ({ ...prev, rate: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-pink-300 rounded focus:border-pink-500 focus:outline-none"
                              step="0.1"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1">Years</label>
                            <input
                              type="number"
                              value={snowballInputsB.years}
                              onChange={(e) => setSnowballInputsB(prev => ({ ...prev, years: parseFloat(e.target.value) || 0 }))}
                              className="w-full px-2 py-1 text-xs border border-pink-300 rounded focus:border-pink-500 focus:outline-none"
                              max="30"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Table B */}
                      <div className="overflow-y-auto max-h-96">
                        <table className="w-full border-collapse text-xs">
                          <thead className="sticky top-0">
                            <tr className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
                              <th className="py-1 px-1 text-left font-semibold border border-white/20">Yr</th>
                              <th className="py-1 px-1 text-right font-semibold border border-white/20">Start</th>
                              <th className="py-1 px-1 text-right font-semibold border border-white/20">Interest</th>
                              <th className="py-1 px-1 text-right font-semibold border border-white/20">End</th>
                            </tr>
                          </thead>
                          <tbody>
                            {generateSnowballEffectWith(snowballInputsB).map((row) => (
                              <tr key={row.year} className="bg-white hover:bg-pink-50 transition-colors">
                                <td className="py-1 px-1 font-bold text-pink-600 border border-gray-200">{row.year}</td>
                                <td className="py-1 px-1 text-right font-medium text-gray-700 border border-gray-200 text-xs">
                                  ${row.startingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="py-1 px-1 text-right font-bold text-green-600 border border-gray-200 text-xs">
                                  ${row.interestEarned.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                                <td className="py-1 px-1 text-right font-bold text-pink-600 border border-gray-200 text-xs">
                                  ${row.endingBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {/* Comparison Summary */}
                  <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4">
                    <h5 className="font-bold text-gray-800 mb-2">Key Insight:</h5>
                    <p className="text-sm text-gray-700">
                      The "snowball effect" shows how compound interest accelerates over time. In early years, interest grows slowly,
                      but as your balance increases, you earn interest on a larger amount each year, creating exponential growth.
                    </p>
                  </div>
                </div>
            </div>
            )}

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
                      <p className="text-gray-600">Master TVM concepts through hands-on problem solving</p>
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

      {/* Saved Calculations Sliding Panel */}
      {showSavedPanel && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowSavedPanel(false)}
          />

          {/* Sliding Panel */}
          <div className="fixed top-0 right-0 h-full w-full md:w-2/3 lg:w-1/2 bg-white shadow-2xl z-50 overflow-y-auto">
            <div className="sticky top-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 shadow-lg z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FolderOpen className="w-6 h-6" />
                  <div>
                    <h2 className="text-2xl font-bold">Saved Calculations</h2>
                    <p className="text-sm text-amber-100">
                      {savedCalculations.length} calculation{savedCalculations.length !== 1 ? 's' : ''} saved
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSavedPanel(false)}
                  className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6">
              {savedCalculations.length === 0 ? (
                <div className="text-center py-16">
                  <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-bold text-gray-600 mb-2">No Saved Calculations</h3>
                  <p className="text-gray-500 text-sm">
                    Calculate a result and click "Save Calculation" to save it here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {savedCalculations.map((calc) => (
                    <div
                      key={calc.id}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 border-2 border-gray-200 hover:border-indigo-400 transition-all shadow-md"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800 text-lg mb-1">
                            {calc.formulaName}
                          </h3>
                          <p className="text-sm text-indigo-600 font-semibold">
                            {calc.variationName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(calc.timestamp).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: 'numeric',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-semibold text-gray-600 mb-1">Result</div>
                          <div className="text-2xl font-bold text-green-600">
                            {formatResult(calc.result)}
                          </div>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-3 mb-3">
                        <div className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">
                          Input Values
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(calc.inputs)
                            .filter(([key]) => key.startsWith(calc.formulaKey + '_'))
                            .map(([key, value]) => {
                              const label = key.split('_').pop().toUpperCase();
                              return (
                                <div key={key} className="flex justify-between bg-gray-50 rounded px-2 py-1">
                                  <span className="font-medium text-gray-700">{label}:</span>
                                  <span className="font-bold text-indigo-700">{value}</span>
                                </div>
                              );
                            })}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => restoreCalculation(calc)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Restore
                        </button>
                        <button
                          onClick={() => deleteCalculation(calc.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-semibold hover:from-red-700 hover:to-pink-700 transition-all shadow-md"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 right-8 z-50 animate-slide-up">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 border-2 border-green-400">
            <div className="p-1 bg-white/20 rounded-full">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-lg">Saved!</p>
              <p className="text-sm text-green-50">Calculation saved successfully</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}