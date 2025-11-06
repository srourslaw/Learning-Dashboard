import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, Users, DollarSign, TrendingUp, BookOpen, UserCheck, UserX, Eye } from 'lucide-react';

export default function AdminDashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Load students from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    setStudents(users.filter(u => u.role === 'student'));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalStudents = students.length;
  const activeSubscriptions = students.filter(s => s.hasActiveSubscription).length;
  const totalRevenue = activeSubscriptions * 49; // Mock revenue calculation

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-100">
      {/* Navigation Bar */}
      <nav className="bg-gradient-to-r from-purple-700 to-pink-600 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-purple-100">Management</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors backdrop-blur text-white font-semibold text-sm"
                title="Preview Student Dashboard"
              >
                <Eye className="w-4 h-4" />
                <span className="hidden md:inline">Preview Student View</span>
              </button>
              <div className="text-right">
                <p className="text-sm font-semibold text-white">{currentUser?.name}</p>
                <p className="text-xs text-purple-100">Administrator</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-white hover:bg-white/20 rounded-lg transition-colors backdrop-blur"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 mb-8 text-white">
          <div className="flex items-center gap-3 mb-3">
            <Shield className="w-10 h-10" />
            <div>
              <h2 className="text-3xl font-bold">Admin Control Panel</h2>
              <p className="text-purple-100">Manage students, subscriptions, and content</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Total Students</p>
            </div>
            <p className="text-4xl font-bold text-gray-800">{totalStudents}</p>
            <p className="text-xs text-gray-500 mt-1">Registered users</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <UserCheck className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Active Subscriptions</p>
            </div>
            <p className="text-4xl font-bold text-gray-800">{activeSubscriptions}</p>
            <p className="text-xs text-gray-500 mt-1">Paying students</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-amber-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-amber-600" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Monthly Revenue</p>
            </div>
            <p className="text-4xl font-bold text-gray-800">${totalRevenue}</p>
            <p className="text-xs text-gray-500 mt-1">Estimated</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-semibold text-gray-600">Conversion Rate</p>
            </div>
            <p className="text-4xl font-bold text-gray-800">
              {totalStudents > 0 ? Math.round((activeSubscriptions / totalStudents) * 100) : 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Signup to paid</p>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-600" />
              Student Management
            </h3>
          </div>

          {students.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No students registered yet</p>
              <p className="text-gray-400 text-sm mt-2">Students will appear here after signing up</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Subscription</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                            {student.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-gray-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{student.email}</td>
                      <td className="py-4 px-4">
                        {student.hasActiveSubscription ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                            <UserCheck className="w-4 h-4" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold">
                            <UserX className="w-4 h-4" />
                            Inactive
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Course Modules Management */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-purple-600" />
            Course Modules
          </h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-6 border-2 border-green-200 bg-green-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Module 1: Time Value of Money</h4>
                <span className="px-3 py-1 bg-green-600 text-white rounded-full text-xs font-semibold">
                  Published
                </span>
              </div>
              <p className="text-sm text-gray-600">Interactive calculator with all TVM formulas</p>
            </div>

            <div className="p-6 border-2 border-gray-200 bg-gray-50 rounded-xl opacity-60">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Module 2: Stock Valuation</h4>
                <span className="px-3 py-1 bg-gray-400 text-white rounded-full text-xs font-semibold">
                  Draft
                </span>
              </div>
              <p className="text-sm text-gray-600">Coming soon...</p>
            </div>

            <div className="p-6 border-2 border-gray-200 bg-gray-50 rounded-xl opacity-60">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Module 3: Project Evaluation</h4>
                <span className="px-3 py-1 bg-gray-400 text-white rounded-full text-xs font-semibold">
                  Draft
                </span>
              </div>
              <p className="text-sm text-gray-600">Coming soon...</p>
            </div>

            <div className="p-6 border-2 border-gray-200 bg-gray-50 rounded-xl opacity-60">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-bold text-gray-800">Module 4: Capital Structure</h4>
                <span className="px-3 py-1 bg-gray-400 text-white rounded-full text-xs font-semibold">
                  Draft
                </span>
              </div>
              <p className="text-sm text-gray-600">Coming soon...</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
