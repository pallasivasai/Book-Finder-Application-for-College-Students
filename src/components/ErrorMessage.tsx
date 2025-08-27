import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
      <div className="flex flex-col items-center space-y-4">
        <div className="p-3 bg-red-100 rounded-full">
          <AlertCircle className="h-8 w-8 text-red-600" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-red-700 mb-4 max-w-md">
            {message}
          </p>
        </div>

        {onRetry && (
          <button
            onClick={onRetry}
            className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </button>
        )}

        <div className="text-sm text-red-600">
          <p>Having trouble? Try:</p>
          <ul className="mt-2 space-y-1 text-left">
            <li>• Checking your internet connection</li>
            <li>• Using different search terms</li>
            <li>• Refreshing the page</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;