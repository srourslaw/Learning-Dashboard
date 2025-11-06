# Refactoring Guide

## Overview

This guide documents the structure of large component files and provides a roadmap for future refactoring efforts.

## Current Status

### Large Files Identified

1. **PortfolioTheory.jsx** - 6,117 lines
2. **TimeValueOfMoney.jsx** - 5,084 lines

These files are fully functional but could benefit from modularization for improved maintainability.

## Completed Improvements

### ✅ Performance Optimizations
- [x] Added code splitting with React.lazy() for all course pages
- [x] Implemented Error Boundaries for graceful error handling
- [x] Created LoadingSpinner component for better UX
- [x] Configured Vite build optimization with manual chunks
- [x] Separated vendor bundles (react, charts, math, icons)

### ✅ Shared Utilities Created
- [x] `/src/utils/calculatorUtils.js` - Shared financial calculation functions
- [x] `/src/components/charts/FinancialCharts.jsx` - Reusable chart components
- [x] `/src/components/ErrorBoundary.jsx` - Error handling component
- [x] `/src/components/LoadingSpinner.jsx` - Loading states

## File Structure Analysis

### TimeValueOfMoney.jsx Structure
```
Lines 1-150: Imports, state, and utility functions
Lines 150-1400: Massive formulas object with all TVM calculations
Lines 1400-3000: Practice problems data
Lines 3000-5084: JSX rendering (calculators, charts, UI)
```

**Recommended Split:**
1. `data/tvmFormulas.js` - Formula definitions
2. `data/tvmProblems.js` - Practice problems
3. `components/tvm/Calculator.jsx` - Calculator UI
4. `components/tvm/Charts.jsx` - Chart visualizations
5. `pages/TimeValueOfMoney.jsx` - Main orchestrator (reduced to ~500 lines)

### PortfolioTheory.jsx Structure
```
Lines 1-200: Imports and state setup
Lines 200-2000: Portfolio calculation functions and data
Lines 2000-4000: Interactive examples and scenarios
Lines 4000-6117: JSX rendering (charts, tables, explanations)
```

**Recommended Split:**
1. `data/portfolioData.js` - Portfolio examples and scenarios
2. `utils/portfolioCalculations.js` - Portfolio math functions
3. `components/portfolio/EfficientFrontier.jsx` - Efficient frontier chart
4. `components/portfolio/PortfolioTable.jsx` - Portfolio composition table
5. `pages/PortfolioTheory.jsx` - Main orchestrator (reduced to ~500 lines)

## Refactoring Strategy

### Phase 1: Extract Data (Low Risk)
**Time: 2-3 hours per file**

1. Create `/src/data` directory
2. Extract formula/data objects to separate files
3. Import back into main component
4. Test thoroughly

Example:
```javascript
// Before (in TimeValueOfMoney.jsx)
const formulas = {
  si: { name: '...', calculate: () => {} },
  ci: { name: '...', calculate: () => {} },
  // ... 1000+ more lines
};

// After
// data/tvmFormulas.js
export const formulas = { ... };

// TimeValueOfMoney.jsx
import { formulas } from '../data/tvmFormulas';
```

### Phase 2: Extract Utility Functions (Low Risk)
**Time: 1-2 hours per file**

1. Move calculation functions to `/src/utils/calculatorUtils.js` (already created)
2. Use existing utility functions where possible
3. Test calculations

### Phase 3: Extract Sub-Components (Medium Risk)
**Time: 4-6 hours per file**

1. Identify repeated JSX patterns
2. Create reusable components (use existing FinancialCharts where applicable)
3. Pass data and handlers as props
4. Test interactivity

Example components to extract:
- `CalculatorInput.jsx` - Reusable input field with validation
- `FormulaDisplay.jsx` - Reusable formula rendering with KaTeX
- `ResultCard.jsx` - Reusable result display
- `SavedCalculations.jsx` - Reusable saved items panel

### Phase 4: Create Domain Components (Higher Risk)
**Time: 8-12 hours per file**

Split main component into logical sections:
- Header/Navigation
- Calculator Section
- Charts Section
- Practice Problems Section

## Best Practices

### When Refactoring:

1. **Always Test First**
   ```bash
   npm run build
   npm run dev
   # Test all functionality
   ```

2. **Refactor Incrementally**
   - Extract one section at a time
   - Test after each extraction
   - Commit working changes

3. **Maintain Functionality**
   - Don't add new features during refactoring
   - Keep the same user experience
   - Preserve all calculations and logic

4. **Use TypeScript Gradually**
   - Add `.ts`/`.tsx` for new files
   - Convert old files as you refactor
   - Use `// @ts-check` for gradual typing

5. **Write Tests**
   - Unit tests for calculation functions
   - Integration tests for calculators
   - Snapshot tests for UI components

## Priority Recommendations

### High Priority (Do Next)
- [ ] Extract formula data objects from both large files
- [ ] Create reusable `CalculatorInput` component
- [ ] Add unit tests for calculation utilities

### Medium Priority
- [ ] Extract chart rendering logic to use shared FinancialCharts
- [ ] Create shared `FormulaDisplay` component
- [ ] Extract practice problems to separate files

### Low Priority
- [ ] Convert to TypeScript
- [ ] Add E2E tests
- [ ] Performance profiling and optimization

## Helpful Commands

```bash
# Check file sizes
find src -name "*.jsx" -exec wc -l {} + | sort -n

# Find duplicated code
# (install jscpd: npm install -g jscpd)
jscpd src/

# Run build and check bundle sizes
npm run build
du -sh dist/assets/*

# Test specific page
npm run dev
# Navigate to /course/time-value-of-money
```

## Testing Checklist

After any refactoring:
- [ ] All calculators still work
- [ ] Charts render correctly
- [ ] Saved calculations persist
- [ ] Navigation works
- [ ] Error handling works
- [ ] Build succeeds without warnings
- [ ] Bundle size hasn't increased significantly

## Resources

- [React Component Patterns](https://reactpatterns.com/)
- [Refactoring Techniques](https://refactoring.guru/)
- [Code Splitting](https://reactjs.org/docs/code-splitting.html)

## Notes

**Why Not Refactor Everything Now?**
- Files are working correctly (don't break what works)
- High risk of introducing bugs in 11,000+ lines
- Incremental approach is safer
- New utilities provide immediate value
- Team can learn patterns from smaller extractions first

**When to Refactor:**
- When adding new features to these pages
- When fixing bugs in specific sections
- During scheduled maintenance windows
- When team has dedicated refactoring time

## Contact

For questions about refactoring approach, review the patterns in:
- `/src/utils/calculatorUtils.js`
- `/src/components/charts/FinancialCharts.jsx`
- `/src/components/ErrorBoundary.jsx`

These demonstrate the target architecture for refactored code.
