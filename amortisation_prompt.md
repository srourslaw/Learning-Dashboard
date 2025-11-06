```txt
You are an expert React developer and financial software engineer. Create a comprehensive, production-ready Amortization Calculator as a single React component for an MBA Financial Management course (FINM708). This must be a complete, standalone, professional-grade educational tool.

IMPORTANT: This is a single-file React component. Include ALL code, logic, and styling in one file. Use only libraries available in the Claude artifacts environment: React, Recharts, lucide-react, date-fns, and Tailwind CSS.

═══════════════════════════════════════════════════════════════════
PART 1: INPUT FORM SECTION
═══════════════════════════════════════════════════════════════════

Create a beautiful, organized input form with the following sections:

**SECTION A: BASIC LOAN DETAILS**
- Principal Amount: Number input, formatted with $ and commas, validation (> 0)
- Annual Interest Rate: Number input with % symbol, validation (0-30%), step 0.01
- Loan Term: Number input in years, validation (1-50 years)
- Payment Frequency: Dropdown with options:
  * Monthly (12 payments/year) - DEFAULT
  * Bi-weekly (26 payments/year)
  * Weekly (52 payments/year)
  * Quarterly (4 payments/year)
  * Semi-annually (2 payments/year)
  * Annually (1 payment/year)
- Loan Start Date: Date picker (default to today)
- Loan Type: Toggle between "Fixed Rate" and "Variable Rate"

**SECTION B: EXTRA PAYMENTS (Optional, collapsible)**
- Enable Extra Payments: Checkbox
- Extra Payment Amount: Dollar input
- Extra Payment Frequency: Dropdown (One-time, Every payment, Monthly, Annually)
- Extra Payment Start Date: Date picker
- Extra Payment End Date: Date picker (optional, for limited-time extra payments)

**SECTION C: OFFSET ACCOUNT (Optional, collapsible with info icon)**
- Enable Offset Account: Checkbox with tooltip: "An offset account reduces the interest charged by offsetting your savings against your loan balance"
- Initial Offset Balance: Dollar input
- Monthly Offset Contributions: Dollar input (can be 0)
- Show detailed explanation when enabled

**SECTION D: VARIABLE INTEREST RATES (Only show if "Variable Rate" selected)**
- Dynamic table to add multiple rate changes
- Each row contains:
  * Change Date: Date picker
  * New Interest Rate: Percentage input
  * Remove button (X icon)
- "Add Rate Change" button to add new rows
- Must validate dates are in chronological order and within loan period

**INPUT FORM REQUIREMENTS:**
- Clean, card-based layout with sections
- All inputs have labels, placeholders, and tooltips
- Real-time validation with error messages
- Quick preset buttons: "First Home ($500k, 6%, 30yr)", "Investment ($800k, 5.5%, 25yr)", "Car Loan ($30k, 7%, 5yr)"
- "Calculate" button (large, primary color, disabled if validation fails)
- "Reset All" button (secondary style)
- "Save Scenario" and "Load Scenario" buttons (use localStorage)

═══════════════════════════════════════════════════════════════════
PART 2: SUMMARY DASHBOARD
═══════════════════════════════════════════════════════════════════

Display key metrics in a responsive grid of cards at the top of results:

**CARD 1: LOAN OVERVIEW**
- Total Loan Amount
- Total Interest (Standard)
- Total Interest (With Offset/Extra Payments)
- Total Amount Paid
- Final Payment Date

**CARD 2: SAVINGS ANALYSIS** (if offset or extra payments used)
- Total Interest Saved: $XX,XXX.XX (in green)
- Time Saved: X years Y months (in green)
- Percentage Reduction: XX.X%
- Effective Interest Rate

**CARD 3: PAYMENT BREAKDOWN**
- Scheduled Payment Amount
- Payment Frequency
- Total Number of Payments
- Average Monthly Equivalent
- First Payment Date / Last Payment Date

**CARD 4: OFFSET IMPACT** (if enabled)
- Final Offset Balance
- Total Interest Offset
- Average Effective Balance
- Peak Offset Benefit Month

Make cards visually stunning with:
- Gradient backgrounds
- Large numbers with currency formatting
- Icons from lucide-react
- Comparison indicators (up/down arrows, percentages)
- Subtle animations on load

═══════════════════════════════════════════════════════════════════
PART 3: AMORTIZATION TABLE
═══════════════════════════════════════════════════════════════════

Create a comprehensive, scrollable table with these columns:

**REQUIRED COLUMNS:**
1. # (Payment Number) - Right aligned, bold
2. Date - Format: DD MMM YYYY (e.g., 15 Jan 2024)
3. Payment ($) - Scheduled payment amount
4. Extra Payment ($) - Show if applicable, otherwise dash
5. Interest ($) - Interest portion, red text
6. Principal ($) - Principal portion, blue text
7. Remaining Balance ($) - Bold
8. Interest Rate (%) - Highlight in yellow when it changes
9. Offset Balance ($) - Show if enabled
10. Net Interest ($) - After offset reduction, green if different from Interest
11. Cumulative Interest ($) - Running total
12. Cumulative Principal ($) - Running total
13. Interest Saved ($) - Compared to no offset/extra payments

**TABLE FEATURES:**
- Sticky header row (stays visible when scrolling)
- Alternating row colors for readability
- Conditional formatting:
  * Rate change rows: Yellow/orange background
  * Extra payment rows: Light green highlight
  * Final payment row: Bold with celebration color
  * Every 12th payment (annual boundary): Subtle separator line
- Hover effects showing tooltips with details
- Each row has expandable "Show Calculation" button (chevron icon)
- When expanded, show detailed calculation breakdown (see Part 5)
- Virtual scrolling if >500 rows (performance optimization)
- Annual summary rows (collapsible year groups with totals)

**TABLE CONTROLS (above table):**
- Search/Filter: Input to filter by payment number or date range
- Export Dropdown: "Export as CSV", "Export as Excel", "Copy to Clipboard", "Print"
- View Options: Toggle "Show Calculations", "Show Annual Summaries Only", "Compact View"
- Pagination: Option to show 12/24/36/All payments per page

═══════════════════════════════════════════════════════════════════
PART 4: INTERACTIVE VISUALIZATIONS
═══════════════════════════════════════════════════════════════════

Create 4 professional charts using Recharts:

**CHART 1: PAYMENT COMPOSITION OVER TIME (Stacked Area Chart)**
- X-axis: Payment number or Date
- Y-axis: Dollar amount
- Two areas: Principal (bottom, blue) and Interest (top, red)
- Show how interest decreases and principal increases over time
- Tooltip showing exact values
- Legend
- Responsive container (height: 400px)

**CHART 2: BALANCE REDUCTION COMPARISON (Line Chart)**
- X-axis: Time (months or years)
- Y-axis: Remaining balance ($)
- Multiple lines:
  * Baseline (no extra payments, no offset) - Gray dashed
  * With Offset Account - Green solid
  * With Extra Payments - Blue solid
  * With Both - Purple solid (if applicable)
- Show the difference clearly
- Markers at key milestones (25%, 50%, 75% paid off)

**CHART 3: INTEREST COMPARISON (Bar Chart)**
- Three bars side by side:
  * Standard Loan (no extras)
  * With Offset Account
  * With Extra Payments
  * With Both
- Show total interest paid for each scenario
- Color code: Red (standard), Orange, Yellow, Green (best)
- Value labels on bars
- Title: "Total Interest Paid - Scenario Comparison"

**CHART 4: CUMULATIVE INTEREST VS PRINCIPAL (Dual Line Chart)**
- X-axis: Time
- Y-axis: Cumulative amount ($)
- Two lines:
  * Cumulative Interest Paid (red)
  * Cumulative Principal Paid (blue)
- Show crossover point
- Area fill under lines

**CHART 5: OFFSET ACCOUNT IMPACT** (if enabled) (Area Chart)
- Show offset balance growth over time
- Show interest saved per period
- Highlight total savings

All charts must:
- Be fully responsive
- Have professional color schemes
- Include tooltips with detailed information
- Have export functionality (download as PNG)
- Be placed in a grid layout (2x2 or 2x3 depending on screen size)

═══════════════════════════════════════════════════════════════════
PART 5: DETAILED CALCULATION BREAKDOWN
═══════════════════════════════════════════════════════════════════

For each payment row in the table, when user clicks "Show Calculation" or expands the row, display a detailed breakdown panel:

**FORMAT:**
```
═══════════════════════════════════════════════════════════════════
PAYMENT #15 - CALCULATION BREAKDOWN (15 Feb 2025)
═══════════════════════════════════════════════════════════════════

STEP 1: CALCULATE INTEREST FOR THIS PERIOD
───────────────────────────────────────────────────────────────────
Starting Balance:               $487,234.56
Annual Interest Rate:           6.00%
Payment Frequency:              Monthly (12 per year)
Periodic Interest Rate:         0.5000% (6.00% ÷ 12)

Interest Calculation:
Interest = Starting Balance × Periodic Rate
         = $487,234.56 × 0.005000
         = $2,436.17

STEP 2: APPLY OFFSET ACCOUNT (if applicable)
───────────────────────────────────────────────────────────────────
Offset Account Balance:         $52,500.00
Effective Balance:              $434,734.56 ($487,234.56 - $52,500.00)
Net Interest After Offset:      $2,173.67 ($434,734.56 × 0.005000)
Interest Saved This Payment:    $262.50 ($2,436.17 - $2,173.67)

STEP 3: CALCULATE PRINCIPAL PAYMENT
───────────────────────────────────────────────────────────────────
Scheduled Payment Amount:       $2,997.75
Less: Net Interest:             -$2,173.67
Principal from Scheduled Pmt:   $824.08

Extra Payment:                  $500.00
Total Principal Paid:           $1,324.08

STEP 4: CALCULATE NEW BALANCE
───────────────────────────────────────────────────────────────────
Starting Balance:               $487,234.56
Less: Total Principal Paid:     -$1,324.08
Ending Balance:                 $485,910.48

CUMULATIVE TOTALS (Through Payment #15)
───────────────────────────────────────────────────────────────────
Total Interest Paid:            $34,567.89
Total Interest Saved (Offset):  $3,892.45
Total Principal Paid:           $14,089.52
Remaining Balance:              $485,910.48
Progress: 2.82% of loan paid off
═══════════════════════════════════════════════════════════════════
```

Make this collapsible, well-formatted, and easy to read. Use monospace font for the calculations.

═══════════════════════════════════════════════════════════════════
PART 6: FORMULAS REFERENCE SECTION
═══════════════════════════════════════════════════════════════════

Create a collapsible "Formulas & Methodology" panel that explains:

**1. MONTHLY PAYMENT FORMULA (PMT)**
```
PMT = P × [r(1+r)^n] / [(1+r)^n - 1]

Where:
P = Principal (loan amount)
r = Periodic interest rate (annual rate ÷ payments per year)
n = Total number of payments (years × payments per year)
```

**2. INTEREST CALCULATION**
```
Interest = Remaining Balance × Periodic Interest Rate
```

**3. PRINCIPAL CALCULATION**
```
Principal = Payment - Interest
```

**4. OFFSET ACCOUNT EFFECT**
```
Effective Balance = Loan Balance - Offset Balance
Net Interest = Effective Balance × Periodic Rate
Interest Saved = (Loan Balance × Rate) - (Effective Balance × Rate)
```

**5. REMAINING BALANCE CALCULATION**
```
New Balance = Previous Balance - Principal Paid
```

Include worked examples for each formula with actual numbers from the user's loan.

═══════════════════════════════════════════════════════════════════
PART 7: SCENARIO COMPARISON TOOL
═══════════════════════════════════════════════════════════════════

Create a side-by-side comparison section showing:

**SCENARIO A: Standard Loan** (baseline)
- No extra payments
- No offset account
- Show: Total interest, Total cost, Payoff date, Number of payments

**SCENARIO B: With Offset Account**
- Include offset as configured
- Show: Interest saved, Time saved, Total cost, Payoff date

**SCENARIO C: With Extra Payments**
- Include extra payments as configured
- Show: Interest saved, Time saved, Total cost, Payoff date

**SCENARIO D: Optimized** (both offset and extra payments)
- Best case scenario
- Show: Maximum savings, Shortest time, Total cost, Payoff date

Display in a responsive table or card grid with:
- Visual comparison bars
- Percentage differences highlighted
- Recommendations text (e.g., "Using offset account saves you $45,231 and 3.2 years")

═══════════════════════════════════════════════════════════════════
PART 8: EDUCATIONAL COMPONENTS
═══════════════════════════════════════════════════════════════════

**INFO PANELS (collapsible sections):**

1. **"How Offset Accounts Work"**
   - Simple explanation with diagram
   - Example: "$50k in offset on $500k loan = only charged interest on $450k"
   - Benefits and considerations
   - Common misconceptions

2. **"The Power of Extra Payments"**
   - Show impact of small extra payments
   - Interactive slider: "What if I paid $X extra per month?"
   - Real-time calculation of savings
   - Visual before/after comparison

3. **"Understanding Amortization"**
   - Explain why early payments are mostly interest
   - Graph showing interest vs principal over time
   - Explain the math behind it

4. **"Variable vs Fixed Rates"**
   - Pros and cons
   - Risk analysis
   - When rate changes help/hurt

**GLOSSARY POPUP:**
Create a glossary with definitions for:
- Amortization
- Principal
- Interest
- Offset Account
- Effective Interest Rate
- Loan Term
- Payment Frequency
- Extra Payments
- Variable Rate
- Fixed Rate

═══════════════════════════════════════════════════════════════════
PART 9: EXPORT & SAVE FUNCTIONALITY
═══════════════════════════════════════════════════════════════════

**EXPORT OPTIONS:**
1. Export Full Amortization Table as CSV (use papaparse)
2. Export Summary Report as formatted text
3. Copy Table to Clipboard
4. Print-Friendly View (CSS @media print)

**SAVE/LOAD SCENARIOS:**
- Save current configuration to localStorage with a name
- Load previously saved scenarios from dropdown
- Delete saved scenarios
- Show list of saved scenarios with date saved

═══════════════════════════════════════════════════════════════════
PART 10: STYLING & UX REQUIREMENTS
═══════════════════════════════════════════════════════════════════

**DESIGN SYSTEM:**
- Match the existing TVM calculator aesthetic (gradient backgrounds, modern cards)
- Color palette:
  * Primary: Indigo/Purple gradient (#4F46E5 to #7C3AED)
  * Success/Savings: Green (#10B981)
  * Warning/Rate Changes: Orange/Yellow (#F59E0B)
  * Danger/Interest: Red (#EF4444)
  * Principal: Blue (#3B82F6)
  * Neutral: Gray scale (#F9FAFB to #111827)

**COMPONENTS MUST HAVE:**
- Smooth transitions and animations (transition-all duration-300)
- Hover effects on interactive elements
- Loading states during calculations (spinner or skeleton)
- Responsive design (mobile-first, works on phones/tablets/desktops)
- Proper spacing and padding (use Tailwind's spacing scale)
- Rounded corners (rounded-xl, rounded-2xl)
- Shadows for depth (shadow-lg, shadow-xl)
- Icons from lucide-react for visual clarity

**ACCESSIBILITY:**
- ARIA labels on all interactive elements
- Keyboard navigation support
- Sufficient color contrast (WCAG AA)
- Focus indicators
- Screen reader friendly

═══════════════════════════════════════════════════════════════════
PART 11: CALCULATION LOGIC REQUIREMENTS
═══════════════════════════════════════════════════════════════════

**CORE CALCULATIONS:**
1. Calculate periodic payment using PMT formula
2. Generate complete amortization schedule array with all data points
3. Handle different payment frequencies correctly:
   - Monthly: 12 payments/year
   - Bi-weekly: 26 payments/year (NOT 24)
   - Weekly: 52 payments/year
   - Adjust interest rate accordingly

4. **Variable Rate Handling:**
   - Apply new rates from specified dates
   - Recalculate payment amount when rate changes (or keep payment same and adjust term - give option)
   - Show clear indicators in table

5. **Offset Account Logic:**
   - Reduce effective balance each period
   - Calculate net interest on reduced balance
   - Track offset balance growth with contributions
   - Handle case where offset > loan balance (no interest charged)

6. **Extra Payment Logic:**
   - Apply extra payments correctly (to principal only)
   - Handle different frequencies
   - Detect early payoff
   - Last payment adjustment (partial payment)

**EDGE CASES TO HANDLE:**
- Loan paid off before scheduled end (adjust last payment)
- Offset balance exceeds loan balance (cap at loan amount)
- Interest rate of 0% (no interest, only principal)
- Very short loans (<1 year)
- Very long loans (>30 years)
- Floating point precision (use toFixed(2) for currency)
- Date calculations across different payment frequencies
- Leap years

**PERFORMANCE:**
- Use useMemo for expensive calculations
- Debounce input changes (300ms)
- Virtual scrolling for tables >500 rows
- Lazy load charts (only render when visible)

═══════════════════════════════════════════════════════════════════
PART 12: CODE STRUCTURE & QUALITY
═══════════════════════════════════════════════════════════════════

**REQUIRED CODE ORGANIZATION:**

1. **Pure calculation functions** (outside component):
   ```javascript
   function calculateMonthlyPayment(principal, annualRate, termYears, paymentsPerYear) { }
   function generateAmortizationSchedule(params) { }
   function calculateOffsetSavings(schedule, offsetParams) { }
   ```

2. **React component structure:**
   - State management with useState
   - Memoized calculations with useMemo
   - Helper functions with useCallback
   - Sub-components for major sections

3. **Comments:**
   - Explain all complex calculations
   - Document function parameters and return values
   - Add inline comments for tricky logic

4. **Error Handling:**
   - Validate all inputs
   - Show friendly error messages
   - Prevent crashes from invalid data
   - Graceful degradation

**CODE QUALITY:**
- No console errors or warnings
- Proper key props on mapped elements
- Clean, readable code with consistent formatting
- DRY principle (don't repeat yourself)
- Descriptive variable names
- Type-safe calculations (avoid NaN, Infinity)

═══════════════════════════════════════════════════════════════════
FINAL CHECKLIST
═══════════════════════════════════════════════════════════════════

Before providing the code, ensure:
☐ All 12 parts above are implemented
☐ Component is self-contained (single file)
☐ All calculations are accurate and tested
☐ Responsive design works on mobile/tablet/desktop
☐ All charts render correctly
☐ Export functionality works
☐ Save/load scenarios works
☐ No React errors or warnings
☐ Performance is optimized
☐ Accessibility standards met
☐ Professional, polished appearance
☐ Educational value for MBA students
☐ Comprehensive documentation in code comments

═══════════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════════

Provide the complete React component as a single file with:
- All imports at the top
- Helper functions before the main component
- Main component with all features
- Export at the bottom
- Inline Tailwind CSS styling
- Comments explaining key sections

The component should be production-ready, bug-free, and provide an exceptional user experience for MBA students learning about loan amortization, offset accounts, and mortgage optimization strategies.

Make this the most comprehensive, professional, and educational amortization calculator possible. Spare no detail. This should be publication-quality code suitable for a top-tier educational institution.
```

This prompt is comprehensive, structured, and detailed enough for any AI (Claude Code, ChatGPT, or another Claude instance) to build exactly what you need. Save this as a .txt file and use it with Claude Code for best results!