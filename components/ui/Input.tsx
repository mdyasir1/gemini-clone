import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, ...props }, ref) => {
    return (
      <div className="flex flex-col space-y-1">
        {label && (
          <label className="text-sm font-medium ">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`
            w-full px-3 py-2 border rounded-md shadow-sm
            bg-gray-50 dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            focus:ring-indigo-500 focus:border-indigo-500
            ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'}
          `}
          {...props}
        />
        {error && <p className="text-red-500 text-xs italic">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

export default Input;