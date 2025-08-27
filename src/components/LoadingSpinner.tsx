import React from 'react';
import { BookOpen } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <BookOpen className="h-6 w-6 text-blue-600 animate-pulse" />
        </div>
      </div>
      <div className="mt-6 text-center">
        <p className="text-lg font-semibold text-slate-700">Searching for books...</p>
        <p className="text-sm text-slate-500 mt-1">This may take a few moments</p>
      </div>
      
      {/* Loading Animation */}
      <div className="mt-8 flex space-x-2">
        {Array.from({ length: 3 }, (_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSpinner;