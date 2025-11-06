/**
 * Financial Calculator Utilities
 * Shared calculation functions used across course modules
 */

/**
 * Newton-Raphson method for solving rates (IRR calculation - standard in finance)
 * @param {number} targetValue - The target value to solve for
 * @param {function} calcFunction - Function that calculates value given a rate
 * @param {number} initialGuess - Initial guess for the rate (default 0.1 = 10%)
 * @param {number} maxIterations - Maximum iterations (default 100)
 * @param {number} tolerance - Convergence tolerance (default 0.0001)
 * @returns {number} - Solved rate as percentage
 */
export function solveRate(targetValue, calcFunction, initialGuess = 0.1, maxIterations = 100, tolerance = 0.0001) {
  let rate = initialGuess;
  for (let i = 0; i < maxIterations; i++) {
    const value = calcFunction(rate);
    const derivative = (calcFunction(rate + tolerance) - value) / tolerance;

    if (Math.abs(derivative) < 1e-10) {
      // Derivative too small, avoid division by zero
      break;
    }

    const newRate = rate - (value - targetValue) / derivative;

    if (Math.abs(newRate - rate) < tolerance) {
      return newRate * 100; // Return as percentage
    }
    rate = newRate;
  }
  return rate * 100; // Return as percentage even if not fully converged
}

/**
 * Newton-Raphson method for solving non-rate variables (m, n, etc.)
 * @param {number} targetValue - The target value to solve for
 * @param {function} calcFunction - Function that calculates value given a variable
 * @param {number} initialGuess - Initial guess (default 10)
 * @param {number} maxIterations - Maximum iterations (default 100)
 * @param {number} tolerance - Convergence tolerance (default 0.001)
 * @returns {number} - Solved variable (no percentage conversion)
 */
export function solveForVariable(targetValue, calcFunction, initialGuess = 10, maxIterations = 100, tolerance = 0.001) {
  let variable = initialGuess;
  for (let i = 0; i < maxIterations; i++) {
    const value = calcFunction(variable);
    const derivative = (calcFunction(variable + tolerance) - value) / tolerance;

    if (Math.abs(derivative) < 1e-10) {
      // Derivative too small, avoid division by zero
      break;
    }

    const newVariable = variable - (value - targetValue) / derivative;

    if (Math.abs(newVariable - variable) < tolerance) {
      return newVariable; // Return as-is (no percentage conversion)
    }
    variable = newVariable;
  }
  return variable; // Return as-is even if not fully converged
}

/**
 * Format a number as currency
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {string} - Formatted currency string
 */
export function formatCurrency(value, decimals = 2) {
  if (isNaN(value) || !isFinite(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Format a number as percentage
 * @param {number} value - Value to format (e.g., 5.5 for 5.5%)
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {string} - Formatted percentage string
 */
export function formatPercentage(value, decimals = 2) {
  if (isNaN(value) || !isFinite(value)) return 'N/A';
  return `${value.toFixed(decimals)}%`;
}

/**
 * Format a number with commas and specified decimals
 * @param {number} value - Value to format
 * @param {number} decimals - Number of decimal places (default 2)
 * @returns {string} - Formatted number string
 */
export function formatNumber(value, decimals = 2) {
  if (isNaN(value) || !isFinite(value)) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value);
}

/**
 * Calculate compound interest
 * @param {number} principal - Initial amount
 * @param {number} rate - Annual interest rate (as percentage, e.g., 5 for 5%)
 * @param {number} years - Number of years
 * @param {number} periodsPerYear - Compounding periods per year (default 1)
 * @returns {number} - Future value
 */
export function compoundInterest(principal, rate, years, periodsPerYear = 1) {
  const r = rate / 100;
  return principal * Math.pow(1 + r / periodsPerYear, years * periodsPerYear);
}

/**
 * Calculate present value
 * @param {number} futureValue - Future amount
 * @param {number} rate - Discount rate (as percentage, e.g., 5 for 5%)
 * @param {number} years - Number of years
 * @param {number} periodsPerYear - Compounding periods per year (default 1)
 * @returns {number} - Present value
 */
export function presentValue(futureValue, rate, years, periodsPerYear = 1) {
  const r = rate / 100;
  return futureValue / Math.pow(1 + r / periodsPerYear, years * periodsPerYear);
}

/**
 * Calculate annuity present value
 * @param {number} payment - Periodic payment amount
 * @param {number} rate - Annual interest rate (as percentage)
 * @param {number} periods - Total number of periods
 * @returns {number} - Present value of annuity
 */
export function annuityPV(payment, rate, periods) {
  const r = rate / 100;
  if (r === 0) return payment * periods;
  return payment * (1 - Math.pow(1 + r, -periods)) / r;
}

/**
 * Calculate annuity future value
 * @param {number} payment - Periodic payment amount
 * @param {number} rate - Periodic interest rate (as percentage)
 * @param {number} periods - Total number of periods
 * @returns {number} - Future value of annuity
 */
export function annuityFV(payment, rate, periods) {
  const r = rate / 100;
  if (r === 0) return payment * periods;
  return payment * (Math.pow(1 + r, periods) - 1) / r;
}

/**
 * Calculate perpetuity value
 * @param {number} payment - Periodic payment amount
 * @param {number} rate - Discount rate (as percentage)
 * @returns {number} - Present value of perpetuity
 */
export function perpetuityPV(payment, rate) {
  const r = rate / 100;
  if (r === 0) return Infinity;
  return payment / r;
}

/**
 * Calculate growing perpetuity value
 * @param {number} payment - Initial periodic payment
 * @param {number} rate - Discount rate (as percentage)
 * @param {number} growthRate - Growth rate (as percentage)
 * @returns {number} - Present value of growing perpetuity
 */
export function growingPerpetuityPV(payment, rate, growthRate) {
  const r = rate / 100;
  const g = growthRate / 100;
  if (r <= g) return Infinity;
  return payment / (r - g);
}

/**
 * Validate numeric input
 * @param {any} value - Value to validate
 * @param {number} min - Minimum allowed value (optional)
 * @param {number} max - Maximum allowed value (optional)
 * @returns {boolean} - True if valid
 */
export function isValidNumber(value, min = -Infinity, max = Infinity) {
  const num = parseFloat(value);
  return !isNaN(num) && isFinite(num) && num >= min && num <= max;
}

/**
 * Generate timeline data for charts
 * @param {number} principal - Starting value
 * @param {number} rate - Growth rate (as percentage)
 * @param {number} years - Number of years
 * @param {number} periodsPerYear - Periods per year (default 1)
 * @returns {Array} - Array of {year, value} objects
 */
export function generateTimelineData(principal, rate, years, periodsPerYear = 1) {
  const data = [];
  const r = rate / 100 / periodsPerYear;

  for (let i = 0; i <= years * periodsPerYear; i++) {
    const period = i / periodsPerYear;
    const value = principal * Math.pow(1 + r, i);
    data.push({
      year: period,
      value: value,
      label: period.toFixed(1)
    });
  }

  return data;
}

export default {
  solveRate,
  solveForVariable,
  formatCurrency,
  formatPercentage,
  formatNumber,
  compoundInterest,
  presentValue,
  annuityPV,
  annuityFV,
  perpetuityPV,
  growingPerpetuityPV,
  isValidNumber,
  generateTimelineData
};
