import React from 'react';
import { Loader2, GraduationCap } from 'lucide-react';

export default function LoadingSpinner({ fullScreen = true, message = 'Loading...' }) {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Animated Logo */}
      <div className="relative">
        <div className="p-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg animate-pulse">
          <GraduationCap className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -top-1 -right-1">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
      </div>

      {/* Loading Text */}
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">{message}</p>
        <div className="flex gap-1 justify-center mt-2">
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      {content}
    </div>
  );
}

// Minimal loading spinner for small areas
export function MiniLoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
    </div>
  );
}
