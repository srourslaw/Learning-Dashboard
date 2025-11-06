import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, CreditCard, Shield, Clock, Users } from 'lucide-react';

export default function Subscription() {
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('monthly');
  const { currentUser, activateSubscription } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'monthly',
      name: 'Monthly Plan',
      price: 49,
      period: 'month',
      features: [
        'Access to all course materials',
        'Interactive calculators',
        'Progress tracking',
        'Certificate upon completion',
        'Email support'
      ]
    },
    {
      id: 'semester',
      name: 'Full Semester',
      price: 199,
      period: 'semester',
      popular: true,
      features: [
        'All Monthly Plan features',
        'Save $95 compared to monthly',
        'Priority support',
        'Downloadable resources',
        'Lifetime access to materials'
      ]
    }
  ];

  async function handlePayment() {
    setLoading(true);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Activate subscription
    await activateSubscription(currentUser.id);

    setLoading(false);
    navigate('/dashboard');
  }

  if (currentUser?.hasActiveSubscription) {
    navigate('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">
            Get full access to course materials
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`bg-white rounded-2xl shadow-xl p-8 relative ${
                selectedPlan === plan.id ? 'ring-4 ring-indigo-600' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {plan.name}
                </h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-indigo-600">
                    ${plan.price}
                  </span>
                  <span className="text-gray-600">/ {plan.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="p-1 bg-green-100 rounded-full mt-0.5">
                      <Check className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setSelectedPlan(plan.id)}
                className={`w-full py-3 rounded-lg font-semibold transition-all ${
                  selectedPlan === plan.id
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                {selectedPlan === plan.id ? 'Selected' : 'Select Plan'}
              </button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <CreditCard className="w-6 h-6 text-indigo-600" />
            Payment Information (Mock)
          </h3>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Development Mode:</strong> This is a mock payment system. No real payment will be processed.
              Click "Complete Payment" to simulate a successful payment and activate your subscription.
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="4242 4242 4242 4242"
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CVC
                </label>
                <input
                  type="text"
                  placeholder="123"
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
          >
            {loading ? 'Processing...' : `Complete Payment - $${plans.find(p => p.id === selectedPlan)?.price}`}
          </button>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Secure Payment</p>
                <p className="text-xs text-gray-600">256-bit SSL encryption</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Instant Access</p>
                <p className="text-xs text-gray-600">Start learning immediately</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Users className="w-8 h-8 text-indigo-600" />
              <div>
                <p className="font-semibold text-gray-800 text-sm">Join 500+ Students</p>
                <p className="text-xs text-gray-600">Trusted by students</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
