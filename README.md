# UQ MBA Learning Dashboard

A professional subscription-based learning management system for MBA Financial Management courses.

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open http://localhost:3000 in your browser.

---

## 📋 What's Built

### 1. Authentication System (Mock - LocalStorage)
- Login page with email/password
- Signup page for new students
- Automatic role-based routing (Admin vs Student)
- Session management using LocalStorage

### 2. Admin Dashboard
- View all registered students
- Track active subscriptions
- Monitor revenue and conversion rates
- Manage course modules
- **Demo Login:** `admin@uqmba.com` / `admin123`

### 3. Student Dashboard
- Course overview (Week 1-4)
- Progress tracking
- Subscription status
- Access to course materials
- Protected routes requiring active subscription

### 4. Subscription/Payment Page (Mock)
- Monthly Plan: $49/month
- Semester Plan: $199/semester (save $95)
- Mock payment form (no real payment processing)
- Click "Complete Payment" to simulate subscription activation

### 5. Time Value of Money Course (Week 1)
- Interactive calculator with all TVM formulas
- Visual charts and timelines
- Responsive design
- Protected - requires active subscription

---

## 🧪 How to Test Locally

### Option 1: Test as Admin
1. Go to http://localhost:3000
2. Click "Sign In"
3. Login with: `admin@uqmba.com` / `admin123`
4. Access the **Admin Dashboard** with student management features

### Option 2: Test as Student
1. Go to http://localhost:3000
2. Click "Sign up"
3. Create a new account (use any email/password)
4. Complete the mock payment process
5. Access the **Student Dashboard**
6. Click "Start Learning" on Week 1 to access the Time Value of Money calculator

---

## 📁 Project Structure

```
UQ_MBA/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx      # Route protection logic
│   ├── context/
│   │   └── AuthContext.jsx         # Authentication state management
│   ├── pages/
│   │   ├── Login.jsx               # Login page
│   │   ├── Signup.jsx              # Signup page
│   │   ├── Subscription.jsx        # Payment mockup page
│   │   ├── StudentDashboard.jsx    # Student dashboard view
│   │   ├── AdminDashboard.jsx      # Admin dashboard view
│   │   └── TimeValueOfMoney.jsx    # Week 1 course content
│   ├── App.jsx                     # Main routing configuration
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Tailwind CSS styles
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

---

## 💾 Data Storage (Current: LocalStorage)

All data is currently stored in browser LocalStorage:
- **Users:** Array of user objects in `users` key
- **Current Session:** Active user in `currentUser` key
- **No database required for local development**

### LocalStorage Structure:
```javascript
// users array
[
  {
    id: "unique_id",
    email: "student@example.com",
    password: "password123", // In production, this will be hashed server-side
    name: "Student Name",
    role: "student",
    hasActiveSubscription: true,
    createdAt: "2025-11-02T00:00:00.000Z"
  }
]

// currentUser object
{
  id: "unique_id",
  email: "student@example.com",
  name: "Student Name",
  role: "student",
  hasActiveSubscription: true
}
```

---

## 🛠️ Tech Stack

### Current (Local Development)
- **Frontend Framework:** React 19
- **Build Tool:** Vite 7
- **Routing:** React Router DOM 7
- **Styling:** Tailwind CSS 3
- **Charts:** Recharts 3
- **Icons:** Lucide React
- **Authentication:** Mock (LocalStorage)
- **Payments:** Mock (Simulated)
- **Database:** LocalStorage

### Recommended (Production - When Ready)
- **Authentication:** Supabase Auth (FREE tier: 50k users)
- **Database:** Supabase PostgreSQL (FREE tier: 500MB)
- **Payments:** Stripe (2.9% + $0.30 per transaction)
- **Hosting:** Vercel (FREE tier: 100GB bandwidth)

---

## 💰 Cost Breakdown

### Development (Now)
- **Total Cost:** $0/month
- Everything runs locally

### Production (Later)
- **Starting:** $0/month (all free tiers)
- **Stripe Fees:** Only 2.9% + $0.30 per successful payment
- **Scaling:** Pay only when you grow
  - Supabase: $25/month after 50k users
  - Vercel: $20/month after 100GB bandwidth

---

## 🚀 Deployment Guide (When Ready)

### Step 1: Set Up Supabase (5 minutes)
1. Go to [supabase.com](https://supabase.com)
2. Create a free account
3. Create a new project
4. Go to Settings > API
5. Copy your `Project URL` and `anon public` key
6. Create `.env` file:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

### Step 2: Set Up Stripe (10 minutes)
1. Go to [stripe.com](https://stripe.com)
2. Create a free account
3. Get your test API keys from Dashboard
4. Create subscription products (Monthly $49, Semester $199)
5. Add to `.env`:
   ```
   VITE_STRIPE_PUBLIC_KEY=your_publishable_key
   ```

### Step 3: Deploy to Vercel (5 minutes)
1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add environment variables
5. Deploy! (automatic on every push)

**I can guide you through each step when you're ready!**

---

## 🛠️ Development Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## 📚 Course Content Structure

### Week 1: Time Value of Money ✅ (Available)
- Simple Interest
- Compound Interest (Annual, m periods/year, Continuous)
- Future Value & Present Value
- Ordinary Annuities & Annuity Due
- Perpetuities & Growing Perpetuities
- Growing Annuities
- Interactive calculators with visual timelines

### Week 2: Stock Valuation & CAPM 🔒 (Coming Soon)
- Stock Valuation
- Portfolio Theory
- Capital Asset Pricing Model

### Week 3: Project Evaluation 🔒 (Coming Soon)
- NPV (Net Present Value)
- IRR (Internal Rate of Return)
- Payback Period
- WACC (Weighted Average Cost of Capital)

### Week 4: Capital Structure 🔒 (Coming Soon)
- Debt vs Equity
- Optimal Capital Structure
- Risk Management

---

## 🔐 Security Features

### Current (Development)
- Protected routes (require authentication)
- Role-based access control (Admin vs Student)
- Subscription-gated content

### Production (When Deployed)
- Server-side authentication (Supabase)
- Encrypted passwords (bcrypt)
- Secure payment processing (Stripe PCI compliant)
- HTTPS/SSL encryption (automatic with Vercel)
- Row-level security (Supabase PostgreSQL)

---

## 🎨 Features

- ✅ Professional authentication flow
- ✅ Admin/Student role separation
- ✅ Subscription payment mockup
- ✅ Protected routes
- ✅ Responsive design (mobile-friendly)
- ✅ Interactive calculators
- ✅ Visual charts and graphs
- ✅ Progress tracking
- ✅ Clean, modern UI with Tailwind CSS
- ✅ Ready for real backend integration

---

## 📝 Adding More Course Content

To add new course pages:

1. Create a new page in `src/pages/` (e.g., `StockValuation.jsx`)
2. Add route in `src/App.jsx`:
   ```jsx
   <Route
     path="/course/stock-valuation"
     element={
       <ProtectedRoute requireSubscription={true}>
         <StockValuation />
       </ProtectedRoute>
     }
   />
   ```
3. Update `StudentDashboard.jsx` to enable the module
4. Change status from `'locked'` to `'available'`

---

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill the process using port 3000
lsof -ti:3000 | xargs kill -9
npm run dev
```

### Dependencies issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### LocalStorage issues
Open browser DevTools > Application > LocalStorage > Clear all

---

## 📞 Support

For questions or issues:
1. Check this README first
2. Review the code comments
3. Test in a different browser
4. Clear LocalStorage and try again

---

## 📄 License

Private project - All rights reserved

---

## 🎯 Next Steps

1. ✅ ~~Set up local development~~
2. ✅ ~~Build authentication system~~
3. ✅ ~~Create admin dashboard~~
4. ✅ ~~Create student dashboard~~
5. ✅ ~~Add subscription flow~~
6. ✅ ~~Integrate Week 1 content~~
7. 🔄 Add Week 2-4 course content
8. 🔄 Deploy to production
9. 🔄 Connect real payment processing
10. 🔄 Market to students

---

**Built with ❤️ for UQ MBA Students**

Last Updated: November 2, 2025
