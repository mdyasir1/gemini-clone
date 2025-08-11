import React from 'react';

const Skeleton: React.FC = () => {
  return (
    <div className="flex space-x-2 animate-pulse w-full max-w-sm mx-auto">
      <div className="w-8 h-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
        <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );
};

export default Skeleton;