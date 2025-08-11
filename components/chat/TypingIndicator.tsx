import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex items-center space-x-2 my-2">
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse"></div>
      <span className="text-gray-500 dark:text-gray-400 text-sm">
        Gemini is typing...
      </span>
    </div>
  );
};

export default TypingIndicator;