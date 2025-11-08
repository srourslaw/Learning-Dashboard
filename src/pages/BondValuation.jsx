import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calculator,
  Activity,
  GraduationCap,
  Check,
  Info,
  ChevronDown,
  ChevronUp,
  Percent,
  Clock,
  Target,
  Save,
  RotateCcw,
  Trash2,
  AlertCircle,
  BookOpen,
  Zap
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { DisplayEquation, InlineEquation } from '../components/MathEquation';

export default function BondValuation() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('learn');
  const [activeCalculator, setActiveCalculator] = useState('price');

  // Calculator inputs
  const [inputs, setInputs] = useState({
    // Bond Pricing
    faceValue: 1000,
    couponRate: 6,
    ytm: 8,
    yearsToMaturity: 5,
    paymentsPerYear: 2,

    // YTM Calculator
    ytm_price: 950,
    ytm_faceValue: 1000,
    ytm_couponRate: 7,
    ytm_years: 10,
    ytm_paymentsPerYear: 2,

    // Duration
    dur_faceValue: 1000,
    dur_couponRate: 8,
    dur_ytm: 6,
    dur_years: 3,
    dur_paymentsPerYear: 2,

    // Price Change
    change_price: 1053.55,
    change_duration: 2.79,
    change_convexity: 9.5,
    change_yieldFrom: 6,
    change_yieldTo: 7,

    // Zero Coupon
    zero_faceValue: 1000,
    zero_ytm: 5,
    zero_years: 8,

    // Clean & Dirty Price
    clean_faceValue: 1000,
    clean_couponRate: 6,
    clean_ytm: 7,
    clean_yearsToMaturity: 5,
    clean_paymentsPerYear: 2,
    clean_daysSinceLastCoupon: 45,
    clean_daysInCouponPeriod: 182,

    // Accrued Interest
    acc_faceValue: 1000,
    acc_couponRate: 5,
    acc_paymentsPerYear: 2,
    acc_daysSinceLastCoupon: 90,
    acc_daysInCouponPeriod: 182
  });

  const [results, setResults] = useState({});
  const [savedCalculations, setSavedCalculations] = useState([]);

  // Bond Comparison State
  const [bonds, setBonds] = useState([
    { id: 1, name: 'Bond A', faceValue: 1000, couponRate: 5, ytm: 6, years: 5, paymentsPerYear: 2 },
    { id: 2, name: 'Bond B', faceValue: 1000, couponRate: 7, ytm: 6, years: 5, paymentsPerYear: 2 }
  ]);
  const [nextBondId, setNextBondId] = useState(3);

  // Practice Problems State
  const [expandedProblems, setExpandedProblems] = useState({});
  const [completedProblems, setCompletedProblems] = useState({});
  const [shownHints, setShownHints] = useState({});
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Bond visualization states
  const [comparisonScenario, setComparisonScenario] = useState({
    scenario1: { couponRate: 5, ytm: 6 },
    scenario2: { couponRate: 8, ytm: 6 }
  });

  const sections = [
    { id: 'learn', label: 'Learn', icon: BookOpen, color: 'from-blue-600 to-indigo-600' },
    { id: 'calculators', label: 'Calculators', icon: Calculator, color: 'from-green-600 to-emerald-600' },
    { id: 'visualize', label: 'Visualize', icon: BarChart3, color: 'from-purple-600 to-pink-600' },
    { id: 'practice', label: 'Practice', icon: GraduationCap, color: 'from-violet-600 to-purple-600' }
  ];

  const calculatorTypes = [
    { id: 'price', name: 'Bond Price', icon: DollarSign, color: 'from-green-500 to-emerald-500' },
    { id: 'ytm', name: 'Yield to Maturity', icon: Percent, color: 'from-blue-500 to-indigo-500' },
    { id: 'duration', name: 'Duration & Convexity', icon: Clock, color: 'from-purple-500 to-pink-500' },
    { id: 'priceChange', name: 'Price Change', icon: TrendingUp, color: 'from-orange-500 to-red-500' },
    { id: 'zeroCoupon', name: 'Zero-Coupon Bond', icon: Target, color: 'from-teal-500 to-cyan-500' },
    { id: 'cleanDirty', name: 'Clean & Dirty Price', icon: Calendar, color: 'from-amber-500 to-yellow-500' },
    { id: 'accrued', name: 'Accrued Interest', icon: Activity, color: 'from-rose-500 to-pink-500' }
  ];

  // Handle input changes
  const handleInputChange = (key, value) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  // Calculate Bond Price
  const calculateBondPrice = () => {
    const { faceValue, couponRate, ytm, yearsToMaturity, paymentsPerYear } = inputs;
    const periodicCoupon = (faceValue * couponRate / 100) / paymentsPerYear;
    const periodicYield = ytm / 100 / paymentsPerYear;
    const totalPeriods = yearsToMaturity * paymentsPerYear;

    let pvCoupons = 0;
    for (let t = 1; t <= totalPeriods; t++) {
      pvCoupons += periodicCoupon / Math.pow(1 + periodicYield, t);
    }

    const pvFaceValue = faceValue / Math.pow(1 + periodicYield, totalPeriods);
    const bondPrice = pvCoupons + pvFaceValue;

    const premium = bondPrice - faceValue;
    const premiumPercent = (premium / faceValue) * 100;

    setResults({
      ...results,
      price: {
        bondPrice,
        pvCoupons,
        pvFaceValue,
        premium,
        premiumPercent,
        periodicCoupon,
        totalPeriods
      }
    });
  };

  // Calculate Yield to Maturity (approximation)
  const calculateYTM = () => {
    const { ytm_price, ytm_faceValue, ytm_couponRate, ytm_years, ytm_paymentsPerYear } = inputs;
    const annualCoupon = ytm_faceValue * ytm_couponRate / 100;

    // Approximate YTM formula
    const numerator = annualCoupon + (ytm_faceValue - ytm_price) / ytm_years;
    const denominator = (ytm_faceValue + ytm_price) / 2;
    const ytmApprox = (numerator / denominator) * 100;

    setResults({
      ...results,
      ytm: {
        ytmApprox,
        annualCoupon,
        capitalGainPerYear: (ytm_faceValue - ytm_price) / ytm_years
      }
    });
  };

  // Calculate Duration and Convexity
  const calculateDuration = () => {
    const { dur_faceValue, dur_couponRate, dur_ytm, dur_years, dur_paymentsPerYear } = inputs;
    const periodicCoupon = (dur_faceValue * dur_couponRate / 100) / dur_paymentsPerYear;
    const periodicYield = dur_ytm / 100 / dur_paymentsPerYear;
    const totalPeriods = dur_years * dur_paymentsPerYear;

    // Calculate bond price first
    let bondPrice = 0;
    let weightedTime = 0;
    let convexitySum = 0;

    for (let t = 1; t <= totalPeriods; t++) {
      const pv = periodicCoupon / Math.pow(1 + periodicYield, t);
      bondPrice += pv;
      weightedTime += (t / dur_paymentsPerYear) * pv;
      convexitySum += (t * (t + 1)) * pv;
    }

    // Face value
    const pvFace = dur_faceValue / Math.pow(1 + periodicYield, totalPeriods);
    bondPrice += pvFace;
    weightedTime += (totalPeriods / dur_paymentsPerYear) * pvFace;
    convexitySum += (totalPeriods * (totalPeriods + 1)) * pvFace;

    const macaulayDuration = weightedTime / bondPrice;
    const modifiedDuration = macaulayDuration / (1 + periodicYield);
    const convexity = (convexitySum / Math.pow(dur_paymentsPerYear, 2)) / (bondPrice * Math.pow(1 + periodicYield, 2));

    setResults({
      ...results,
      duration: {
        bondPrice,
        macaulayDuration,
        modifiedDuration,
        convexity
      }
    });
  };

  // Calculate Price Change
  const calculatePriceChange = () => {
    const { change_price, change_duration, change_convexity, change_yieldFrom, change_yieldTo } = inputs;
    const yieldChange = (change_yieldTo - change_yieldFrom) / 100;

    const durationEffect = -change_duration * yieldChange;
    const convexityEffect = 0.5 * change_convexity * Math.pow(yieldChange, 2);
    const totalChange = durationEffect + convexityEffect;

    const newPrice = change_price * (1 + totalChange);
    const dollarChange = newPrice - change_price;

    setResults({
      ...results,
      priceChange: {
        yieldChange: yieldChange * 100,
        durationEffect: durationEffect * 100,
        convexityEffect: convexityEffect * 100,
        totalChange: totalChange * 100,
        newPrice,
        dollarChange
      }
    });
  };

  // Calculate Zero-Coupon Bond
  const calculateZeroCoupon = () => {
    const { zero_faceValue, zero_ytm, zero_years } = inputs;
    const price = zero_faceValue / Math.pow(1 + zero_ytm / 100, zero_years);
    const discount = zero_faceValue - price;
    const discountPercent = (discount / zero_faceValue) * 100;

    setResults({
      ...results,
      zeroCoupon: {
        price,
        discount,
        discountPercent,
        annualReturn: zero_ytm
      }
    });
  };

  // Calculate Clean and Dirty Price
  const calculateCleanDirtyPrice = () => {
    const {
      clean_faceValue,
      clean_couponRate,
      clean_ytm,
      clean_yearsToMaturity,
      clean_paymentsPerYear,
      clean_daysSinceLastCoupon,
      clean_daysInCouponPeriod
    } = inputs;

    // Calculate bond price (full/dirty price)
    const periodicCoupon = (clean_faceValue * clean_couponRate / 100) / clean_paymentsPerYear;
    const periodicYield = clean_ytm / 100 / clean_paymentsPerYear;
    const totalPeriods = clean_yearsToMaturity * clean_paymentsPerYear;

    let bondPrice = 0;
    for (let t = 1; t <= totalPeriods; t++) {
      bondPrice += periodicCoupon / Math.pow(1 + periodicYield, t);
    }
    bondPrice += clean_faceValue / Math.pow(1 + periodicYield, totalPeriods);

    // Calculate accrued interest
    const accruedInterest = periodicCoupon * (clean_daysSinceLastCoupon / clean_daysInCouponPeriod);

    // Clean price = Dirty price - Accrued interest
    const cleanPrice = bondPrice - accruedInterest;
    const dirtyPrice = bondPrice;

    setResults({
      ...results,
      cleanDirty: {
        cleanPrice,
        dirtyPrice,
        accruedInterest,
        periodicCoupon,
        daysFraction: clean_daysSinceLastCoupon / clean_daysInCouponPeriod
      }
    });
  };

  // Calculate Accrued Interest
  const calculateAccruedInterest = () => {
    const {
      acc_faceValue,
      acc_couponRate,
      acc_paymentsPerYear,
      acc_daysSinceLastCoupon,
      acc_daysInCouponPeriod
    } = inputs;

    const periodicCoupon = (acc_faceValue * acc_couponRate / 100) / acc_paymentsPerYear;
    const accruedInterest = periodicCoupon * (acc_daysSinceLastCoupon / acc_daysInCouponPeriod);
    const daysFraction = acc_daysSinceLastCoupon / acc_daysInCouponPeriod;
    const daysRemaining = acc_daysInCouponPeriod - acc_daysSinceLastCoupon;

    setResults({
      ...results,
      accrued: {
        accruedInterest,
        periodicCoupon,
        daysFraction,
        daysRemaining,
        percentOfCoupon: (daysFraction * 100)
      }
    });
  };

  // Bond comparison management
  const addBond = () => {
    const newBond = {
      id: nextBondId,
      name: `Bond ${String.fromCharCode(64 + nextBondId)}`,
      faceValue: 1000,
      couponRate: 6,
      ytm: 6,
      years: 5,
      paymentsPerYear: 2
    };
    setBonds([...bonds, newBond]);
    setNextBondId(nextBondId + 1);
  };

  const removeBond = (id) => {
    if (bonds.length > 1) {
      setBonds(bonds.filter(b => b.id !== id));
    }
  };

  const updateBond = (id, field, value) => {
    setBonds(bonds.map(b =>
      b.id === id ? { ...b, [field]: field === 'name' ? value : parseFloat(value) || 0 } : b
    ));
  };

  // Generate bond price sensitivity data
  const generatePriceSensitivityData = () => {
    const { faceValue, couponRate, yearsToMaturity, paymentsPerYear } = inputs;
    const data = [];

    for (let ytm = 2; ytm <= 12; ytm += 0.5) {
      const periodicCoupon = (faceValue * couponRate / 100) / paymentsPerYear;
      const periodicYield = ytm / 100 / paymentsPerYear;
      const totalPeriods = yearsToMaturity * paymentsPerYear;

      let price = 0;
      for (let t = 1; t <= totalPeriods; t++) {
        price += periodicCoupon / Math.pow(1 + periodicYield, t);
      }
      price += faceValue / Math.pow(1 + periodicYield, totalPeriods);

      data.push({
        ytm: ytm.toFixed(1),
        price: price.toFixed(2),
        premium: ((price - faceValue) / faceValue * 100).toFixed(2)
      });
    }

    return data;
  };

  // Generate cash flow timeline
  const generateCashFlowTimeline = () => {
    const { faceValue, couponRate, yearsToMaturity, paymentsPerYear } = inputs;
    const periodicCoupon = (faceValue * couponRate / 100) / paymentsPerYear;
    const totalPeriods = yearsToMaturity * paymentsPerYear;
    const data = [];

    for (let t = 1; t <= totalPeriods; t++) {
      const year = t / paymentsPerYear;
      const cashFlow = t === totalPeriods ? periodicCoupon + faceValue : periodicCoupon;
      data.push({
        period: t,
        year: year.toFixed(2),
        cashFlow: cashFlow.toFixed(2),
        coupon: periodicCoupon.toFixed(2),
        principal: t === totalPeriods ? faceValue : 0
      });
    }

    return data;
  };

  // Generate accrued interest timeline data
  const generateAccruedInterestData = () => {
    const { acc_paymentsPerYear, acc_couponRate, acc_faceValue, acc_daysInCouponPeriod } = inputs;
    const periodicCoupon = (acc_faceValue * acc_couponRate / 100) / acc_paymentsPerYear;
    const data = [];

    for (let day = 0; day <= acc_daysInCouponPeriod; day += Math.floor(acc_daysInCouponPeriod / 20)) {
      const accruedInterest = periodicCoupon * (day / acc_daysInCouponPeriod);
      data.push({
        day,
        accruedInterest: accruedInterest.toFixed(2),
        percentOfCoupon: ((day / acc_daysInCouponPeriod) * 100).toFixed(1)
      });
    }

    return data;
  };

  // Generate bond comparison data
  const generateBondComparisonData = () => {
    return bonds.map(bond => {
      const periodicCoupon = (bond.faceValue * bond.couponRate / 100) / bond.paymentsPerYear;
      const periodicYield = bond.ytm / 100 / bond.paymentsPerYear;
      const totalPeriods = bond.years * bond.paymentsPerYear;

      let price = 0;
      let weightedTime = 0;

      for (let t = 1; t <= totalPeriods; t++) {
        const pv = periodicCoupon / Math.pow(1 + periodicYield, t);
        price += pv;
        weightedTime += (t / bond.paymentsPerYear) * pv;
      }

      const pvFace = bond.faceValue / Math.pow(1 + periodicYield, totalPeriods);
      price += pvFace;
      weightedTime += (totalPeriods / bond.paymentsPerYear) * pvFace;

      const macaulayDuration = weightedTime / price;
      const modifiedDuration = macaulayDuration / (1 + periodicYield);
      const currentYield = (bond.couponRate * bond.faceValue / 100) / price;

      return {
        name: bond.name,
        price: parseFloat(price.toFixed(2)),
        duration: parseFloat(macaulayDuration.toFixed(2)),
        modifiedDuration: parseFloat(modifiedDuration.toFixed(2)),
        currentYield: parseFloat((currentYield * 100).toFixed(2)),
        ytm: bond.ytm,
        couponRate: bond.couponRate
      };
    });
  };

  // Generate clean vs dirty price over coupon period
  const generateCleanDirtyComparison = () => {
    const {
      clean_faceValue,
      clean_couponRate,
      clean_ytm,
      clean_yearsToMaturity,
      clean_paymentsPerYear,
      clean_daysInCouponPeriod
    } = inputs;

    const periodicCoupon = (clean_faceValue * clean_couponRate / 100) / clean_paymentsPerYear;
    const periodicYield = clean_ytm / 100 / clean_paymentsPerYear;
    const totalPeriods = clean_yearsToMaturity * clean_paymentsPerYear;

    // Calculate base bond price (dirty price at coupon payment date)
    let baseBondPrice = 0;
    for (let t = 1; t <= totalPeriods; t++) {
      baseBondPrice += periodicCoupon / Math.pow(1 + periodicYield, t);
    }
    baseBondPrice += clean_faceValue / Math.pow(1 + periodicYield, totalPeriods);

    const data = [];
    for (let day = 0; day <= clean_daysInCouponPeriod; day += Math.floor(clean_daysInCouponPeriod / 20)) {
      const accruedInterest = periodicCoupon * (day / clean_daysInCouponPeriod);
      const dirtyPrice = baseBondPrice + accruedInterest;
      const cleanPrice = dirtyPrice - accruedInterest;

      data.push({
        day,
        cleanPrice: parseFloat(cleanPrice.toFixed(2)),
        dirtyPrice: parseFloat(dirtyPrice.toFixed(2)),
        accruedInterest: parseFloat(accruedInterest.toFixed(2))
      });
    }

    return data;
  };

  // Practice Problems Data
  const practiceProblems = [
    {
      id: 1,
      title: 'Basic Bond Pricing',
      difficulty: 'beginner',
      category: 'Bond Pricing',
      type: 'Calculation',
      problem: 'A bond has a face value of $1,000, coupon rate of 6% (paid annually), and 3 years to maturity. If the required yield is 8%, what is the bond price?',
      hint: 'Calculate the present value of all future coupon payments plus the present value of the face value.',
      solution: {
        steps: [
          { step: 1, description: 'Identify bond parameters', detail: 'Key information from the problem', latex: '\\begin{aligned} \\text{Face Value (FV)} &= \\$1{,}000 \\\\ \\text{Coupon Rate} &= 6\\% \\\\ \\text{Annual Coupon (C)} &= 0.06 \\times 1{,}000 = \\$60 \\\\ \\text{Years to Maturity (n)} &= 3 \\\\ \\text{Yield (r)} &= 8\\% \\end{aligned}' },
          { step: 2, description: 'Bond pricing formula', detail: 'Present value of coupons plus face value', latex: 'P = \\sum_{t=1}^{n} \\frac{C}{(1+r)^t} + \\frac{FV}{(1+r)^n}' },
          { step: 3, description: 'Calculate PV of coupons', detail: 'Discount each coupon payment', latex: '\\begin{aligned} PV_{\\text{coupons}} &= \\frac{60}{(1.08)^1} + \\frac{60}{(1.08)^2} + \\frac{60}{(1.08)^3} \\\\ &= 55.56 + 51.44 + 47.63 = \\$154.63 \\end{aligned}' },
          { step: 4, description: 'Calculate PV of face value', detail: 'Discount the principal repayment', latex: 'PV_{\\text{face}} = \\frac{1{,}000}{(1.08)^3} = \\frac{1{,}000}{1.2597} = \\$793.83' },
          { step: 5, description: 'Sum to get bond price', detail: 'Total present value', latex: 'P = 154.63 + 793.83 = \\$948.46' }
        ],
        answer: '$948.46',
        explanation: 'The bond trades at a discount ($948.46 < $1,000) because the market yield (8%) exceeds the coupon rate (6%).'
      }
    },
    {
      id: 2,
      title: 'Yield to Maturity Calculation',
      difficulty: 'intermediate',
      category: 'Yield',
      type: 'Calculation',
      problem: 'A 5-year bond with a 7% annual coupon and $1,000 face value is trading at $1,080. Estimate the yield to maturity (YTM).',
      hint: 'Use the approximate YTM formula or trial and error. YTM is the discount rate that equates price to present value.',
      solution: {
        steps: [
          { step: 1, description: 'Identify given information', detail: 'Bond characteristics', latex: '\\begin{aligned} \\text{Face Value (FV)} &= \\$1{,}000 \\\\ \\text{Coupon Rate} &= 7\\% \\\\ \\text{Annual Coupon (C)} &= \\$70 \\\\ \\text{Current Price (P)} &= \\$1{,}080 \\\\ \\text{Years to Maturity (n)} &= 5 \\end{aligned}' },
          { step: 2, description: 'Approximate YTM formula', detail: 'Quick estimation method', latex: 'YTM \\approx \\frac{C + \\frac{FV - P}{n}}{\\frac{FV + P}{2}}' },
          { step: 3, description: 'Calculate numerator', detail: 'Annual return components', latex: '\\text{Numerator} = 70 + \\frac{1{,}000 - 1{,}080}{5} = 70 + (-16) = 54' },
          { step: 4, description: 'Calculate denominator', detail: 'Average price', latex: '\\text{Denominator} = \\frac{1{,}000 + 1{,}080}{2} = 1{,}040' },
          { step: 5, description: 'Complete calculation', detail: 'Final YTM estimate', latex: 'YTM \\approx \\frac{54}{1{,}040} = 0.0519 = 5.19\\%' }
        ],
        answer: 'YTM ≈ 5.19%',
        explanation: 'The YTM is lower than the coupon rate because the bond trades at a premium. The exact YTM using iterative methods would be approximately 5.15%.'
      }
    },
    {
      id: 3,
      title: 'Macaulay Duration',
      difficulty: 'intermediate',
      category: 'Duration',
      type: 'Calculation',
      problem: 'Calculate the Macaulay duration for a 3-year bond with 8% annual coupons, $1,000 face value, and 6% yield.',
      hint: 'Duration is the weighted average time to receive cash flows, where weights are the PV of each cash flow divided by bond price.',
      solution: {
        steps: [
          { step: 1, description: 'Calculate bond price', detail: 'First find the current price', latex: '\\begin{aligned} P &= \\frac{80}{1.06} + \\frac{80}{(1.06)^2} + \\frac{1{,}080}{(1.06)^3} \\\\ &= 75.47 + 71.20 + 906.88 = \\$1{,}053.55 \\end{aligned}' },
          { step: 2, description: 'Calculate weighted cash flows', detail: 'Time × PV for each payment', latex: '\\begin{aligned} \\text{Year 1:} & \\quad 1 \\times 75.47 = 75.47 \\\\ \\text{Year 2:} & \\quad 2 \\times 71.20 = 142.40 \\\\ \\text{Year 3:} & \\quad 3 \\times 906.88 = 2{,}720.64 \\end{aligned}' },
          { step: 3, description: 'Sum weighted cash flows', detail: 'Total time-weighted value', latex: '\\sum (t \\times PV_t) = 75.47 + 142.40 + 2{,}720.64 = 2{,}938.51' },
          { step: 4, description: 'Calculate Macaulay duration', detail: 'Divide by bond price', latex: 'D_{Mac} = \\frac{2{,}938.51}{1{,}053.55} = 2.79 \\text{ years}' }
        ],
        answer: '2.79 years',
        explanation: 'The Macaulay duration of 2.79 years is less than the maturity (3 years) because the bond pays coupons, which are received before maturity.'
      }
    },
    {
      id: 4,
      title: 'Modified Duration and Price Change',
      difficulty: 'advanced',
      category: 'Duration',
      type: 'Application',
      problem: 'A bond has a Macaulay duration of 6.5 years and yields 7%. If yields increase to 7.5%, estimate the percentage price change using modified duration.',
      hint: 'Modified Duration = Macaulay Duration / (1 + yield). Then use ΔP/P ≈ -D_mod × Δy.',
      solution: {
        steps: [
          { step: 1, description: 'Given information', detail: 'Duration and yield data', latex: '\\begin{aligned} D_{Mac} &= 6.5 \\text{ years} \\\\ y_0 &= 7\\% = 0.07 \\\\ y_1 &= 7.5\\% = 0.075 \\\\ \\Delta y &= 0.005 \\end{aligned}' },
          { step: 2, description: 'Calculate modified duration', detail: 'Adjust for yield', latex: 'D_{mod} = \\frac{D_{Mac}}{1 + y} = \\frac{6.5}{1.07} = 6.075 \\text{ years}' },
          { step: 3, description: 'Price change formula', detail: 'Duration-based approximation', latex: '\\frac{\\Delta P}{P} \\approx -D_{mod} \\times \\Delta y' },
          { step: 4, description: 'Calculate percentage change', detail: 'Apply the formula', latex: '\\frac{\\Delta P}{P} \\approx -6.075 \\times 0.005 = -0.0304 = -3.04\\%' }
        ],
        answer: '-3.04%',
        explanation: 'The bond price is expected to decline by approximately 3.04% when yields increase by 50 basis points. The negative sign indicates an inverse relationship between price and yield.'
      }
    },
    {
      id: 5,
      title: 'Zero-Coupon Bond Valuation',
      difficulty: 'beginner',
      category: 'Bond Pricing',
      type: 'Calculation',
      problem: 'What is the fair price of a zero-coupon bond with $1,000 face value, 8 years to maturity, and 5% required yield (annual compounding)?',
      hint: 'Zero-coupon bonds have no coupon payments, only the face value at maturity. Use simple present value formula.',
      solution: {
        steps: [
          { step: 1, description: 'Identify parameters', detail: 'Zero-coupon bond characteristics', latex: '\\begin{aligned} FV &= \\$1{,}000 \\\\ n &= 8 \\text{ years} \\\\ r &= 5\\% = 0.05 \\\\ C &= \\$0 \\text{ (no coupons)} \\end{aligned}' },
          { step: 2, description: 'Zero-coupon bond formula', detail: 'Present value of face value only', latex: 'P = \\frac{FV}{(1 + r)^n}' },
          { step: 3, description: 'Substitute values', detail: 'Calculate present value', latex: 'P = \\frac{1{,}000}{(1.05)^8} = \\frac{1{,}000}{1.4775}' },
          { step: 4, description: 'Final calculation', detail: 'Bond price', latex: 'P = \\$676.84' }
        ],
        answer: '$676.84',
        explanation: 'The zero-coupon bond trades at a deep discount ($676.84) and will appreciate to $1,000 at maturity, providing the investor with a 5% annual return.'
      }
    },
    {
      id: 6,
      title: 'Convexity and Price Change',
      difficulty: 'advanced',
      category: 'Convexity',
      type: 'Application',
      problem: 'A bond has modified duration of 7.2 years and convexity of 65. Current yield is 6%. Estimate the price change if yield increases to 7%.',
      hint: 'Use both duration and convexity: ΔP/P ≈ -D_mod × Δy + 0.5 × Convexity × (Δy)²',
      solution: {
        steps: [
          { step: 1, description: 'Given information', detail: 'Bond risk measures', latex: '\\begin{aligned} D_{mod} &= 7.2 \\\\ \\text{Convexity} &= 65 \\\\ y_0 &= 6\\% = 0.06 \\\\ y_1 &= 7\\% = 0.07 \\\\ \\Delta y &= 0.01 \\end{aligned}' },
          { step: 2, description: 'Duration effect', detail: 'First-order approximation', latex: '\\text{Duration effect} = -D_{mod} \\times \\Delta y = -7.2 \\times 0.01 = -0.072' },
          { step: 3, description: 'Convexity effect', detail: 'Second-order adjustment', latex: '\\text{Convexity effect} = 0.5 \\times 65 \\times (0.01)^2 = 0.5 \\times 65 \\times 0.0001 = 0.00325' },
          { step: 4, description: 'Total price change', detail: 'Combine both effects', latex: '\\begin{aligned} \\frac{\\Delta P}{P} &= -0.072 + 0.00325 \\\\ &= -0.06875 = -6.875\\% \\end{aligned}' }
        ],
        answer: '-6.875%',
        explanation: 'Including convexity provides a more accurate estimate. The convexity adjustment (+0.325%) partially offsets the duration-based decline, showing bonds have positive convexity that benefits investors when yields change.'
      }
    },
    {
      id: 7,
      title: 'Clean vs Dirty Price',
      difficulty: 'intermediate',
      category: 'Bond Pricing',
      type: 'Calculation',
      problem: 'A bond with $1,000 face value and 6% semi-annual coupon is quoted at a clean price of $980. It has been 45 days since the last coupon payment. The coupon period is 182 days. What is the dirty price (invoice price)?',
      hint: 'Dirty Price = Clean Price + Accrued Interest. Calculate accrued interest based on days elapsed.',
      solution: {
        steps: [
          { step: 1, description: 'Identify given information', detail: 'Bond and timing details', latex: '\\begin{aligned} \\text{Clean Price} &= \\$980 \\\\ \\text{Face Value} &= \\$1{,}000 \\\\ \\text{Coupon Rate} &= 6\\% \\\\ \\text{Days Elapsed} &= 45 \\\\ \\text{Days in Period} &= 182 \\end{aligned}' },
          { step: 2, description: 'Calculate periodic coupon', detail: 'Semi-annual payment amount', latex: '\\text{Periodic Coupon} = \\frac{1{,}000 \\times 0.06}{2} = \\$30' },
          { step: 3, description: 'Calculate accrued interest', detail: 'Pro-rated interest earned', latex: '\\text{AI} = 30 \\times \\frac{45}{182} = 30 \\times 0.2473 = \\$7.42' },
          { step: 4, description: 'Calculate dirty price', detail: 'Invoice price', latex: '\\text{Dirty Price} = 980 + 7.42 = \\$987.42' }
        ],
        answer: '$987.42',
        explanation: 'The buyer pays the dirty price of $987.42, which includes the $7.42 accrued interest owed to the seller. On the next coupon date, the buyer receives the full $30 coupon.'
      }
    },
    {
      id: 8,
      title: 'Accrued Interest Calculation',
      difficulty: 'beginner',
      category: 'Accrued Interest',
      type: 'Calculation',
      problem: 'A corporate bond pays an annual coupon of $80. You purchase it 120 days after the last coupon payment. Assuming a 365-day year, how much accrued interest do you owe the seller?',
      hint: 'Accrued Interest = Annual Coupon × (Days Elapsed / Days in Year)',
      solution: {
        steps: [
          { step: 1, description: 'Given information', detail: 'Coupon and timing', latex: '\\begin{aligned} \\text{Annual Coupon} &= \\$80 \\\\ \\text{Days Elapsed} &= 120 \\\\ \\text{Days in Year} &= 365 \\end{aligned}' },
          { step: 2, description: 'Accrued interest formula', detail: 'Pro-rated coupon payment', latex: '\\text{AI} = \\text{Coupon} \\times \\frac{\\text{Days Elapsed}}{\\text{Days in Period}}' },
          { step: 3, description: 'Calculate accrued interest', detail: 'Amount owed to seller', latex: '\\text{AI} = 80 \\times \\frac{120}{365} = 80 \\times 0.3288 = \\$26.30' }
        ],
        answer: '$26.30',
        explanation: 'You must pay the seller $26.30 in accrued interest because they held the bond for 120 days of the coupon period and earned that portion of the interest.'
      }
    }
  ];

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
                <h1 className="text-2xl font-bold text-gray-900">Bond Valuation</h1>
                <p className="text-sm text-gray-500">Master fixed income securities & debt markets</p>
              </div>
            </div>

            {/* Section Pills */}
            <div className="flex items-center gap-2">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                      isActive
                        ? `bg-gradient-to-r ${section.color} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {section.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* LEARN SECTION */}
        {activeSection === 'learn' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-2xl p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-4 bg-white/20 backdrop-blur rounded-xl">
                  <BookOpen className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold">Bond Valuation Fundamentals</h2>
                  <p className="text-blue-100">Understanding fixed income securities</p>
                </div>
              </div>
              <p className="text-lg text-blue-50 mb-4">
                Bonds are debt securities that pay fixed or variable interest payments (coupons) and return the principal at maturity.
                Understanding bond valuation is essential for assessing investment opportunities in the debt market.
              </p>
            </div>

            {/* Key Concepts Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Bond Pricing */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Bond Pricing Formula</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  The price of a bond is the present value of all future cash flows (coupons + face value):
                </p>
                <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                  <DisplayEquation>
                    P = \sum_{'{t=1}'}^{'{n}'} \frac{'{C}'}{'{(1+r)^t}'} + \frac{'{FV}'}{'{(1+r)^n}'}
                  </DisplayEquation>
                  <div className="mt-3 text-sm text-gray-700 space-y-1">
                    <p><strong>P</strong> = Bond Price</p>
                    <p><strong>C</strong> = Periodic Coupon Payment</p>
                    <p><strong>r</strong> = Yield per Period (YTM)</p>
                    <p><strong>n</strong> = Total Number of Periods</p>
                    <p><strong>FV</strong> = Face Value (Par Value)</p>
                  </div>
                </div>
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <p className="text-sm text-blue-900 font-semibold">💡 Key Insight:</p>
                  <p className="text-sm text-blue-800">When YTM &gt; Coupon Rate → Bond trades at <strong>discount</strong></p>
                  <p className="text-sm text-blue-800">When YTM &lt; Coupon Rate → Bond trades at <strong>premium</strong></p>
                  <p className="text-sm text-blue-800">When YTM = Coupon Rate → Bond trades at <strong>par</strong></p>
                </div>
              </div>

              {/* Yield to Maturity */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                    <Percent className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Yield to Maturity (YTM)</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  YTM is the total return anticipated on a bond if held until maturity. It's the discount rate that equates the bond's price to the present value of its cash flows.
                </p>
                <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                  <p className="font-semibold text-gray-800 mb-2">Approximate YTM Formula:</p>
                  <DisplayEquation>
                    {'YTM \\approx \\frac{C + \\frac{FV - P}{n}}{\\frac{FV + P}{2}}'}
                  </DisplayEquation>
                  <div className="mt-3 text-sm text-gray-700 space-y-1">
                    <p><strong>C</strong> = Annual Coupon Payment</p>
                    <p><strong>FV</strong> = Face Value</p>
                    <p><strong>P</strong> = Current Bond Price</p>
                    <p><strong>n</strong> = Years to Maturity</p>
                  </div>
                </div>
                <div className="mt-4 bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
                  <p className="text-sm text-amber-900 font-semibold">⚠️ Note:</p>
                  <p className="text-sm text-amber-800">This is an approximation. Exact YTM requires iterative methods (Newton-Raphson) or financial calculator.</p>
                </div>
              </div>

              {/* Duration */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Duration</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Duration measures a bond's price sensitivity to interest rate changes. It's the weighted average time to receive cash flows.
                </p>
                <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                  <p className="font-semibold text-gray-800 mb-2">Macaulay Duration:</p>
                  <DisplayEquation>
                    {'D_{Mac} = \\frac{\\sum_{t=1}^{n} t \\times PV(CF_t)}{P}'}
                  </DisplayEquation>
                  <p className="font-semibold text-gray-800 mb-2 mt-4">Modified Duration:</p>
                  <DisplayEquation>
                    {'D_{mod} = \\frac{D_{Mac}}{1 + r}'}
                  </DisplayEquation>
                  <p className="font-semibold text-gray-800 mb-2 mt-4">Price Change Approximation:</p>
                  <DisplayEquation>
                    {'\\frac{\\Delta P}{P} \\approx -D_{mod} \\times \\Delta y'}
                  </DisplayEquation>
                </div>
                <div className="mt-4 bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-sm text-green-900 font-semibold">✅ Application:</p>
                  <p className="text-sm text-green-800">If duration = 5 years and yields ↑ by 1%, bond price will ↓ by approximately 5%.</p>
                </div>
              </div>

              {/* Convexity */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Convexity</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Convexity measures the curvature of the price-yield relationship. It improves duration-based price change estimates.
                </p>
                <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                  <p className="font-semibold text-gray-800 mb-2">Price Change with Convexity:</p>
                  <DisplayEquation>
                    {'\\frac{\\Delta P}{P} \\approx -D_{mod} \\times \\Delta y + \\frac{1}{2} \\times C \\times (\\Delta y)^2'}
                  </DisplayEquation>
                  <div className="mt-3 text-sm text-gray-700 space-y-1">
                    <p><strong>D<sub>mod</sub></strong> = Modified Duration</p>
                    <p><strong>C</strong> = Convexity</p>
                    <p><strong>Δy</strong> = Change in Yield</p>
                  </div>
                </div>
                <div className="mt-4 bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
                  <p className="text-sm text-purple-900 font-semibold">🎯 Why It Matters:</p>
                  <p className="text-sm text-purple-800">Bonds with higher convexity have better price performance when yields change (prices fall less when yields rise, rise more when yields fall).</p>
                </div>
              </div>
            </div>

            {/* Bond Characteristics Table */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Bond Characteristics Summary</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                      <th className="px-4 py-3 text-left rounded-tl-lg">Characteristic</th>
                      <th className="px-4 py-3 text-left">Description</th>
                      <th className="px-4 py-3 text-left rounded-tr-lg">Impact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">Par/Face Value</td>
                      <td className="px-4 py-3 text-gray-600">Principal repaid at maturity</td>
                      <td className="px-4 py-3 text-gray-600">Typically $1,000</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">Coupon Rate</td>
                      <td className="px-4 py-3 text-gray-600">Annual interest rate paid on face value</td>
                      <td className="px-4 py-3 text-gray-600">Determines periodic payments</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">Maturity</td>
                      <td className="px-4 py-3 text-gray-600">Time until principal is repaid</td>
                      <td className="px-4 py-3 text-gray-600">Longer = higher interest rate risk</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">Yield to Maturity</td>
                      <td className="px-4 py-3 text-gray-600">Market's required return</td>
                      <td className="px-4 py-3 text-gray-600">Determines bond price</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-semibold text-gray-800">Credit Rating</td>
                      <td className="px-4 py-3 text-gray-600">Issuer's creditworthiness</td>
                      <td className="px-4 py-3 text-gray-600">Lower rating = higher yield required</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Types of Bonds */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Types of Bonds</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border-2 border-blue-200">
                  <h4 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Government Bonds
                  </h4>
                  <p className="text-sm text-blue-800">Issued by governments (e.g., US Treasury bonds). Low risk, lower yields. Considered "risk-free" benchmark.</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5 border-2 border-green-200">
                  <h4 className="font-bold text-green-900 mb-2 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Corporate Bonds
                  </h4>
                  <p className="text-sm text-green-800">Issued by companies. Higher risk than government bonds, higher yields. Credit rating determines risk premium.</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5 border-2 border-purple-200">
                  <h4 className="font-bold text-purple-900 mb-2 flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Zero-Coupon Bonds
                  </h4>
                  <p className="text-sm text-purple-800">No periodic payments. Sold at deep discount, matures at face value. All return comes from price appreciation.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* CALCULATORS SECTION */}
        {activeSection === 'calculators' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Calculator Selection */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Bond Calculators</h2>
              <div className="grid md:grid-cols-5 gap-4">
                {calculatorTypes.map((calc) => {
                  const Icon = calc.icon;
                  const isActive = activeCalculator === calc.id;
                  return (
                    <button
                      key={calc.id}
                      onClick={() => setActiveCalculator(calc.id)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isActive
                          ? `border-transparent bg-gradient-to-r ${calc.color} text-white shadow-lg transform scale-105`
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <Icon className={`w-6 h-6 mx-auto mb-2 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                      <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-gray-700'}`}>
                        {calc.name}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bond Price Calculator */}
            {activeCalculator === 'price' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Bond Price Calculator</h3>
                    <p className="text-gray-600">Calculate the fair value of a coupon-paying bond</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Face Value ($)</label>
                    <input
                      type="number"
                      value={inputs.faceValue}
                      onChange={(e) => handleInputChange('faceValue', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.couponRate}
                      onChange={(e) => handleInputChange('couponRate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Yield to Maturity (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.ytm}
                      onChange={(e) => handleInputChange('ytm', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years to Maturity</label>
                    <input
                      type="number"
                      value={inputs.yearsToMaturity}
                      onChange={(e) => handleInputChange('yearsToMaturity', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payments Per Year</label>
                    <select
                      value={inputs.paymentsPerYear}
                      onChange={(e) => handleInputChange('paymentsPerYear', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
                    >
                      <option value="1">Annual</option>
                      <option value="2">Semi-Annual</option>
                      <option value="4">Quarterly</option>
                      <option value="12">Monthly</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={calculateBondPrice}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-6 h-6" />
                  Calculate Bond Price
                </button>

                {results.price && (
                  <div className="mt-6 space-y-4 animate-fadeIn">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                      <h4 className="text-lg font-semibold mb-2">Bond Price</h4>
                      <p className="text-4xl font-bold">${results.price.bondPrice.toFixed(2)}</p>
                      <p className="text-green-100 mt-2">
                        {results.price.premium > 0 ? 'Trading at Premium' : results.price.premium < 0 ? 'Trading at Discount' : 'Trading at Par'}
                        {' '}({results.price.premiumPercent > 0 ? '+' : ''}{results.price.premiumPercent.toFixed(2)}%)
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-1">PV of Coupons</p>
                        <p className="text-2xl font-bold text-blue-700">${results.price.pvCoupons.toFixed(2)}</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                        <p className="text-sm font-semibold text-purple-900 mb-1">PV of Face Value</p>
                        <p className="text-2xl font-bold text-purple-700">${results.price.pvFaceValue.toFixed(2)}</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                        <p className="text-sm font-semibold text-amber-900 mb-1">Periodic Coupon</p>
                        <p className="text-2xl font-bold text-amber-700">${results.price.periodicCoupon.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-700">
                            <strong>Interpretation:</strong> {results.price.bondPrice < inputs.faceValue
                              ? `This bond trades at a discount because the market yield (${inputs.ytm}%) exceeds the coupon rate (${inputs.couponRate}%). Investors require a higher return than what the coupon provides, so the price is below par.`
                              : results.price.bondPrice > inputs.faceValue
                              ? `This bond trades at a premium because the coupon rate (${inputs.couponRate}%) exceeds the market yield (${inputs.ytm}%). The bond pays more than required market return, making it more valuable.`
                              : `This bond trades at par because the coupon rate (${inputs.couponRate}%) equals the market yield (${inputs.ytm}%).`
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* YTM Calculator */}
            {activeCalculator === 'ytm' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl">
                    <Percent className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Yield to Maturity Calculator</h3>
                    <p className="text-gray-600">Calculate the expected return if bond is held to maturity</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Bond Price ($)</label>
                    <input
                      type="number"
                      value={inputs.ytm_price}
                      onChange={(e) => handleInputChange('ytm_price', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Face Value ($)</label>
                    <input
                      type="number"
                      value={inputs.ytm_faceValue}
                      onChange={(e) => handleInputChange('ytm_faceValue', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.ytm_couponRate}
                      onChange={(e) => handleInputChange('ytm_couponRate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years to Maturity</label>
                    <input
                      type="number"
                      value={inputs.ytm_years}
                      onChange={(e) => handleInputChange('ytm_years', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateYTM}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-6 h-6" />
                  Calculate YTM
                </button>

                {results.ytm && (
                  <div className="mt-6 space-y-4 animate-fadeIn">
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
                      <h4 className="text-lg font-semibold mb-2">Approximate Yield to Maturity</h4>
                      <p className="text-4xl font-bold">{results.ytm.ytmApprox.toFixed(2)}%</p>
                      <p className="text-blue-100 mt-2">
                        Expected annual return if held to maturity
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                        <p className="text-sm font-semibold text-green-900 mb-1">Annual Coupon Income</p>
                        <p className="text-2xl font-bold text-green-700">${results.ytm.annualCoupon.toFixed(2)}</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                        <p className="text-sm font-semibold text-purple-900 mb-1">Capital Gain per Year</p>
                        <p className="text-2xl font-bold text-purple-700">${results.ytm.capitalGainPerYear.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-500">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900 mb-1">Note:</p>
                          <p className="text-sm text-amber-800">
                            This is an approximation. The exact YTM requires iterative methods (trial and error or financial calculator).
                            The approximation works best when the bond is close to par value.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Duration Calculator */}
            {activeCalculator === 'duration' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Duration & Convexity Calculator</h3>
                    <p className="text-gray-600">Measure interest rate risk of your bond</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Face Value ($)</label>
                    <input
                      type="number"
                      value={inputs.dur_faceValue}
                      onChange={(e) => handleInputChange('dur_faceValue', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.dur_couponRate}
                      onChange={(e) => handleInputChange('dur_couponRate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Yield to Maturity (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.dur_ytm}
                      onChange={(e) => handleInputChange('dur_ytm', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years to Maturity</label>
                    <input
                      type="number"
                      value={inputs.dur_years}
                      onChange={(e) => handleInputChange('dur_years', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payments Per Year</label>
                    <select
                      value={inputs.dur_paymentsPerYear}
                      onChange={(e) => handleInputChange('dur_paymentsPerYear', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none"
                    >
                      <option value="1">Annual</option>
                      <option value="2">Semi-Annual</option>
                      <option value="4">Quarterly</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={calculateDuration}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-6 h-6" />
                  Calculate Duration & Convexity
                </button>

                {results.duration && (
                  <div className="mt-6 space-y-4 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white">
                        <h4 className="text-lg font-semibold mb-2">Macaulay Duration</h4>
                        <p className="text-4xl font-bold">{results.duration.macaulayDuration.toFixed(2)} years</p>
                        <p className="text-purple-100 mt-2">Weighted average time to cash flows</p>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl p-6 text-white">
                        <h4 className="text-lg font-semibold mb-2">Modified Duration</h4>
                        <p className="text-4xl font-bold">{results.duration.modifiedDuration.toFixed(2)}</p>
                        <p className="text-indigo-100 mt-2">Price sensitivity to yield changes</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Bond Price</p>
                        <p className="text-2xl font-bold text-blue-700">${results.duration.bondPrice.toFixed(2)}</p>
                      </div>
                      <div className="bg-orange-50 rounded-xl p-4 border-2 border-orange-200">
                        <p className="text-sm font-semibold text-orange-900 mb-1">Convexity</p>
                        <p className="text-2xl font-bold text-orange-700">{results.duration.convexity.toFixed(2)}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 border-l-4 border-green-500">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-green-900 mb-1">Interpretation:</p>
                          <p className="text-sm text-green-800">
                            If yields increase by 1%, this bond's price will decrease by approximately {results.duration.modifiedDuration.toFixed(2)}%.
                            Higher duration means greater price sensitivity to interest rate changes.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Price Change Calculator */}
            {activeCalculator === 'priceChange' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Bond Price Change Estimator</h3>
                    <p className="text-gray-600">Estimate price change using duration and convexity</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Bond Price ($)</label>
                    <input
                      type="number"
                      value={inputs.change_price}
                      onChange={(e) => handleInputChange('change_price', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Modified Duration</label>
                    <input
                      type="number"
                      step="0.01"
                      value={inputs.change_duration}
                      onChange={(e) => handleInputChange('change_duration', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Convexity</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.change_convexity}
                      onChange={(e) => handleInputChange('change_convexity', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Initial Yield (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.change_yieldFrom}
                      onChange={(e) => handleInputChange('change_yieldFrom', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">New Yield (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.change_yieldTo}
                      onChange={(e) => handleInputChange('change_yieldTo', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={calculatePriceChange}
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-6 h-6" />
                  Estimate Price Change
                </button>

                {results.priceChange && (
                  <div className="mt-6 space-y-4 animate-fadeIn">
                    <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
                      <h4 className="text-lg font-semibold mb-2">Estimated New Price</h4>
                      <p className="text-4xl font-bold">${results.priceChange.newPrice.toFixed(2)}</p>
                      <p className="text-orange-100 mt-2">
                        Change: {results.priceChange.dollarChange > 0 ? '+' : ''}${results.priceChange.dollarChange.toFixed(2)}
                        ({results.priceChange.totalChange > 0 ? '+' : ''}{results.priceChange.totalChange.toFixed(2)}%)
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-red-50 rounded-xl p-4 border-2 border-red-200">
                        <p className="text-sm font-semibold text-red-900 mb-1">Yield Change</p>
                        <p className="text-2xl font-bold text-red-700">
                          {results.priceChange.yieldChange > 0 ? '+' : ''}{results.priceChange.yieldChange.toFixed(2)}%
                        </p>
                        <p className="text-xs text-red-600 mt-1">{Math.abs(results.priceChange.yieldChange * 100).toFixed(0)} basis points</p>
                      </div>
                      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Duration Effect</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {results.priceChange.durationEffect > 0 ? '+' : ''}{results.priceChange.durationEffect.toFixed(2)}%
                        </p>
                        <p className="text-xs text-blue-600 mt-1">First-order approximation</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                        <p className="text-sm font-semibold text-green-900 mb-1">Convexity Effect</p>
                        <p className="text-2xl font-bold text-green-700">
                          +{results.priceChange.convexityEffect.toFixed(2)}%
                        </p>
                        <p className="text-xs text-green-600 mt-1">Second-order adjustment</p>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-4 border-l-4 border-purple-500">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-purple-900 mb-1">Analysis:</p>
                          <p className="text-sm text-purple-800">
                            Duration captures the linear relationship between price and yield, while convexity accounts for the curvature.
                            Convexity always helps: it reduces losses when yields rise and increases gains when yields fall.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Zero-Coupon Calculator */}
            {activeCalculator === 'zeroCoupon' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Zero-Coupon Bond Calculator</h3>
                    <p className="text-gray-600">Value bonds with no periodic coupon payments</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Face Value ($)</label>
                    <input
                      type="number"
                      value={inputs.zero_faceValue}
                      onChange={(e) => handleInputChange('zero_faceValue', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Yield to Maturity (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.zero_ytm}
                      onChange={(e) => handleInputChange('zero_ytm', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years to Maturity</label>
                    <input
                      type="number"
                      value={inputs.zero_years}
                      onChange={(e) => handleInputChange('zero_years', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-teal-500 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateZeroCoupon}
                  className="w-full bg-gradient-to-r from-teal-600 to-cyan-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-6 h-6" />
                  Calculate Zero-Coupon Price
                </button>

                {results.zeroCoupon && (
                  <div className="mt-6 space-y-4 animate-fadeIn">
                    <div className="bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl p-6 text-white">
                      <h4 className="text-lg font-semibold mb-2">Zero-Coupon Bond Price</h4>
                      <p className="text-4xl font-bold">${results.zeroCoupon.price.toFixed(2)}</p>
                      <p className="text-teal-100 mt-2">
                        Deep discount of ${results.zeroCoupon.discount.toFixed(2)} ({results.zeroCoupon.discountPercent.toFixed(2)}%)
                      </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Face Value at Maturity</p>
                        <p className="text-2xl font-bold text-blue-700">${inputs.zero_faceValue.toFixed(2)}</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                        <p className="text-sm font-semibold text-green-900 mb-1">Annual Return (YTM)</p>
                        <p className="text-2xl font-bold text-green-700">{results.zeroCoupon.annualReturn.toFixed(2)}%</p>
                      </div>
                    </div>

                    <div className="bg-indigo-50 rounded-xl p-4 border-l-4 border-indigo-500">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-indigo-900 mb-1">How It Works:</p>
                          <p className="text-sm text-indigo-800">
                            Zero-coupon bonds make no periodic interest payments. Instead, they're sold at a deep discount and mature at face value.
                            The difference between purchase price and face value represents your total return.
                            Formula: P = FV / (1 + r)^n
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* CLEAN & DIRTY PRICE CALCULATOR */}
            {activeCalculator === 'cleanDirty' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-yellow-500 rounded-xl">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Clean & Dirty Price Calculator</h3>
                    <p className="text-gray-600">Understand the difference between clean and dirty bond prices</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Face Value ($)</label>
                    <input
                      type="number"
                      value={inputs.clean_faceValue}
                      onChange={(e) => handleInputChange('clean_faceValue', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Coupon Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.clean_couponRate}
                      onChange={(e) => handleInputChange('clean_couponRate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Yield to Maturity (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.clean_ytm}
                      onChange={(e) => handleInputChange('clean_ytm', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Years to Maturity</label>
                    <input
                      type="number"
                      value={inputs.clean_yearsToMaturity}
                      onChange={(e) => handleInputChange('clean_yearsToMaturity', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payments Per Year</label>
                    <select
                      value={inputs.clean_paymentsPerYear}
                      onChange={(e) => handleInputChange('clean_paymentsPerYear', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    >
                      <option value="1">Annual</option>
                      <option value="2">Semi-Annual</option>
                      <option value="4">Quarterly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Days Since Last Coupon</label>
                    <input
                      type="number"
                      value={inputs.clean_daysSinceLastCoupon}
                      onChange={(e) => handleInputChange('clean_daysSinceLastCoupon', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Days in Coupon Period</label>
                    <input
                      type="number"
                      value={inputs.clean_daysInCouponPeriod}
                      onChange={(e) => handleInputChange('clean_daysInCouponPeriod', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-amber-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">Typically 182 days for semi-annual, 365 for annual, 91 for quarterly</p>
                  </div>
                </div>

                <button
                  onClick={calculateCleanDirtyPrice}
                  className="w-full bg-gradient-to-r from-amber-600 to-yellow-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-6 h-6" />
                  Calculate Clean & Dirty Price
                </button>

                {results.cleanDirty && (
                  <div className="mt-6 space-y-4 animate-fadeIn">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl p-6 text-white">
                        <h4 className="text-lg font-semibold mb-2">Clean Price</h4>
                        <p className="text-4xl font-bold">${results.cleanDirty.cleanPrice.toFixed(2)}</p>
                        <p className="text-green-100 mt-2">Quoted price (excludes accrued interest)</p>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl p-6 text-white">
                        <h4 className="text-lg font-semibold mb-2">Dirty Price</h4>
                        <p className="text-4xl font-bold">${results.cleanDirty.dirtyPrice.toFixed(2)}</p>
                        <p className="text-blue-100 mt-2">Invoice price (includes accrued interest)</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                        <p className="text-sm font-semibold text-amber-900 mb-1">Accrued Interest</p>
                        <p className="text-2xl font-bold text-amber-700">${results.cleanDirty.accruedInterest.toFixed(2)}</p>
                      </div>
                      <div className="bg-purple-50 rounded-xl p-4 border-2 border-purple-200">
                        <p className="text-sm font-semibold text-purple-900 mb-1">Periodic Coupon</p>
                        <p className="text-2xl font-bold text-purple-700">${results.cleanDirty.periodicCoupon.toFixed(2)}</p>
                      </div>
                      <div className="bg-pink-50 rounded-xl p-4 border-2 border-pink-200">
                        <p className="text-sm font-semibold text-pink-900 mb-1">Days Fraction</p>
                        <p className="text-2xl font-bold text-pink-700">{(results.cleanDirty.daysFraction * 100).toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="bg-amber-50 rounded-xl p-4 border-l-4 border-amber-500">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-amber-900 mb-1">Key Concept:</p>
                          <p className="text-sm text-amber-800">
                            <strong>Clean Price</strong> is the quoted price (what you see in newspapers). <strong>Dirty Price</strong> is what you actually pay - it includes accrued interest since the last coupon payment.
                            Formula: Dirty Price = Clean Price + Accrued Interest
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ACCRUED INTEREST CALCULATOR */}
            {activeCalculator === 'accrued' && (
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Accrued Interest Calculator</h3>
                    <p className="text-gray-600">Calculate interest accumulated since last coupon payment</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Face Value ($)</label>
                    <input
                      type="number"
                      value={inputs.acc_faceValue}
                      onChange={(e) => handleInputChange('acc_faceValue', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Annual Coupon Rate (%)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={inputs.acc_couponRate}
                      onChange={(e) => handleInputChange('acc_couponRate', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Payments Per Year</label>
                    <select
                      value={inputs.acc_paymentsPerYear}
                      onChange={(e) => handleInputChange('acc_paymentsPerYear', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                    >
                      <option value="1">Annual</option>
                      <option value="2">Semi-Annual</option>
                      <option value="4">Quarterly</option>
                      <option value="12">Monthly</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Days Since Last Coupon</label>
                    <input
                      type="number"
                      value={inputs.acc_daysSinceLastCoupon}
                      onChange={(e) => handleInputChange('acc_daysSinceLastCoupon', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Days in Coupon Period</label>
                    <input
                      type="number"
                      value={inputs.acc_daysInCouponPeriod}
                      onChange={(e) => handleInputChange('acc_daysInCouponPeriod', e.target.value)}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-rose-500 focus:outline-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">182 for semi-annual, 365 for annual, 91 for quarterly, 30 for monthly</p>
                  </div>
                </div>

                <button
                  onClick={calculateAccruedInterest}
                  className="w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calculator className="w-6 h-6" />
                  Calculate Accrued Interest
                </button>

                {results.accrued && (
                  <div className="mt-6 space-y-4 animate-fadeIn">
                    <div className="bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl p-6 text-white">
                      <h4 className="text-lg font-semibold mb-2">Accrued Interest</h4>
                      <p className="text-4xl font-bold">${results.accrued.accruedInterest.toFixed(2)}</p>
                      <p className="text-rose-100 mt-2">
                        {results.accrued.percentOfCoupon.toFixed(1)}% of next coupon payment
                      </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
                        <p className="text-sm font-semibold text-blue-900 mb-1">Periodic Coupon</p>
                        <p className="text-2xl font-bold text-blue-700">${results.accrued.periodicCoupon.toFixed(2)}</p>
                      </div>
                      <div className="bg-green-50 rounded-xl p-4 border-2 border-green-200">
                        <p className="text-sm font-semibold text-green-900 mb-1">Days Elapsed</p>
                        <p className="text-2xl font-bold text-green-700">{inputs.acc_daysSinceLastCoupon}</p>
                      </div>
                      <div className="bg-amber-50 rounded-xl p-4 border-2 border-amber-200">
                        <p className="text-sm font-semibold text-amber-900 mb-1">Days Remaining</p>
                        <p className="text-2xl font-bold text-amber-700">{results.accrued.daysRemaining}</p>
                      </div>
                    </div>

                    <div className="bg-rose-50 rounded-xl p-4 border-l-4 border-rose-500">
                      <div className="flex items-start gap-3">
                        <Info className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-rose-900 mb-1">Understanding Accrued Interest:</p>
                          <p className="text-sm text-rose-800">
                            When you buy a bond between coupon dates, the seller has earned some interest. You must pay this accrued interest to the seller.
                            On the next coupon date, you'll receive the full coupon payment, recovering the accrued interest you paid.
                            Formula: AI = Coupon × (Days Since Last Payment / Days in Coupon Period)
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* VISUALIZE SECTION */}
        {activeSection === 'visualize' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Price-Yield Relationship */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Bond Price-Yield Relationship</h3>
              <p className="text-gray-600 mb-6">
                See how bond prices change as market yields fluctuate. The inverse relationship is fundamental to bond investing.
              </p>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generatePriceSensitivityData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="ytm" label={{ value: 'Yield to Maturity (%)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Bond Price ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="price" stroke="#10b981" strokeWidth={3} name="Bond Price" dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <p className="text-sm font-semibold text-green-900 mb-1">Current Settings</p>
                  <p className="text-xs text-green-700">Face Value: ${inputs.faceValue}</p>
                  <p className="text-xs text-green-700">Coupon: {inputs.couponRate}%</p>
                  <p className="text-xs text-green-700">Maturity: {inputs.yearsToMaturity} years</p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
                  <p className="text-sm font-semibold text-blue-900 mb-1">Key Observation</p>
                  <p className="text-xs text-blue-700">
                    Inverse Relationship: As yields ↑, bond prices ↓
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border-2 border-purple-200">
                  <p className="text-sm font-semibold text-purple-900 mb-1">Convexity</p>
                  <p className="text-xs text-purple-700">
                    The curved line shows positive convexity - bonds benefit more from yield decreases than they lose from yield increases
                  </p>
                </div>
              </div>
            </div>

            {/* Cash Flow Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Bond Cash Flow Timeline</h3>
              <p className="text-gray-600 mb-6">
                Visualize all future cash flows from your bond investment.
              </p>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={generateCashFlowTimeline().slice(0, 20)} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" label={{ value: 'Time (Years)', position: 'insideBottom', offset: -5 }} />
                    <YAxis label={{ value: 'Cash Flow ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="coupon" stackId="a" fill="#6366f1" name="Coupon Payment" />
                    <Bar dataKey="principal" stackId="a" fill="#10b981" name="Principal Repayment" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bond Comparison Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Bond Comparison</h3>
                  <p className="text-gray-600">Compare multiple bonds side-by-side</p>
                </div>
                <button
                  onClick={addBond}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                >
                  <Zap className="w-4 h-4" />
                  Add Bond
                </button>
              </div>

              {/* Bond Input Cards */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {bonds.map(bond => (
                  <div key={bond.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border-2 border-indigo-200">
                    <div className="flex items-center justify-between mb-3">
                      <input
                        type="text"
                        value={bond.name}
                        onChange={(e) => updateBond(bond.id, 'name', e.target.value)}
                        className="text-lg font-bold text-indigo-900 bg-transparent border-b-2 border-indigo-300 focus:border-indigo-600 outline-none"
                      />
                      {bonds.length > 1 && (
                        <button
                          onClick={() => removeBond(bond.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <label className="text-xs text-gray-600">Face Value ($)</label>
                        <input
                          type="number"
                          value={bond.faceValue}
                          onChange={(e) => updateBond(bond.id, 'faceValue', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Coupon (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={bond.couponRate}
                          onChange={(e) => updateBond(bond.id, 'couponRate', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">YTM (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={bond.ytm}
                          onChange={(e) => updateBond(bond.id, 'ytm', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:border-indigo-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-gray-600">Years</label>
                        <input
                          type="number"
                          value={bond.years}
                          onChange={(e) => updateBond(bond.id, 'years', e.target.value)}
                          className="w-full px-2 py-1 border border-gray-300 rounded focus:border-indigo-500 outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Comparison Charts */}
              <div className="space-y-6">
                {/* Price Comparison */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Bond Prices</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={generateBondComparisonData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="price" fill="#6366f1" name="Bond Price">
                          {generateBondComparisonData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'][index % 5]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Duration Comparison */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Duration & Risk</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={generateBondComparisonData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Duration (Years)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="duration" fill="#8b5cf6" name="Macaulay Duration" />
                        <Bar dataKey="modifiedDuration" fill="#ec4899" name="Modified Duration" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Yield Comparison */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-700 mb-3">Yield Analysis</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={generateBondComparisonData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis label={{ value: 'Yield (%)', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="couponRate" fill="#10b981" name="Coupon Rate" />
                        <Bar dataKey="currentYield" fill="#f59e0b" name="Current Yield" />
                        <Bar dataKey="ytm" fill="#ef4444" name="Yield to Maturity" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Clean vs Dirty Price Chart */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Clean vs Dirty Price Over Time</h3>
              <p className="text-gray-600 mb-6">
                See how clean and dirty prices evolve between coupon payments. Accrued interest builds up linearly.
              </p>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateCleanDirtyComparison()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="day"
                      label={{ value: 'Days Since Last Coupon', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis label={{ value: 'Price ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white border-2 border-indigo-200 rounded-lg shadow-lg p-3">
                              <p className="font-semibold text-gray-800 mb-2">Day {payload[0].payload.day}</p>
                              {payload.map((entry, index) => (
                                <p key={index} style={{ color: entry.color }} className="text-sm font-medium">
                                  {entry.name}: ${entry.value.toFixed(2)}
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="cleanPrice" stroke="#10b981" strokeWidth={3} name="Clean Price" dot={false} />
                    <Line type="monotone" dataKey="dirtyPrice" stroke="#6366f1" strokeWidth={3} name="Dirty Price" dot={false} />
                    <Line type="monotone" dataKey="accruedInterest" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" name="Accrued Interest" dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 grid md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 border-2 border-green-200">
                  <p className="text-sm font-semibold text-green-900 mb-1">Clean Price</p>
                  <p className="text-xs text-green-700">
                    Remains constant between coupon dates (assuming no yield changes)
                  </p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 border-2 border-indigo-200">
                  <p className="text-sm font-semibold text-indigo-900 mb-1">Dirty Price</p>
                  <p className="text-xs text-indigo-700">
                    Increases linearly as accrued interest builds up, then drops on coupon date
                  </p>
                </div>
                <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                  <p className="text-sm font-semibold text-amber-900 mb-1">Accrued Interest</p>
                  <p className="text-xs text-amber-700">
                    The difference between dirty and clean prices
                  </p>
                </div>
              </div>
            </div>

            {/* Accrued Interest Timeline */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Accrued Interest Timeline</h3>
              <p className="text-gray-600 mb-6">
                Watch how accrued interest accumulates day by day between coupon payments.
              </p>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={generateAccruedInterestData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="day"
                      label={{ value: 'Days Since Last Coupon', position: 'insideBottom', offset: -5 }}
                    />
                    <YAxis label={{ value: 'Accrued Interest ($)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white border-2 border-rose-200 rounded-lg shadow-lg p-3">
                              <p className="font-semibold text-gray-800 mb-2">Day {payload[0].payload.day}</p>
                              <p className="text-sm font-medium text-rose-600">
                                Accrued Interest: ${payload[0].value}
                              </p>
                              <p className="text-xs text-gray-600 mt-1">
                                {payload[0].payload.percentOfCoupon}% of next coupon
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="accruedInterest"
                      stroke="#ec4899"
                      fill="#ec4899"
                      fillOpacity={0.6}
                      name="Accrued Interest"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 bg-rose-50 rounded-lg p-4 border-l-4 border-rose-500">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-rose-900 mb-1">Linear Accumulation:</p>
                    <p className="text-sm text-rose-800">
                      Accrued interest grows linearly from $0 on the coupon payment date to the full coupon amount just before the next payment.
                      On the payment date, it resets to $0 and starts accumulating again. This is why dirty prices show a "sawtooth" pattern.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRACTICE SECTION */}
        {activeSection === 'practice' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">Practice Problems</h2>
                  <p className="text-gray-600">Master bond valuation through hands-on problem solving</p>
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
  );
}
