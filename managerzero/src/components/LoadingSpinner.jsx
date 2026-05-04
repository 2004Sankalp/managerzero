import React from 'react';
import PropTypes from 'prop-types';

/**
 * Animated Loading Spinner for async actions
 */
const LoadingSpinner = ({ message = "Loading...", size = "md" }) => {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 animate-fade-in">
      <div className={`${sizeMap[size]} border-2 border-border border-t-accent rounded-full animate-spin mb-3`}></div>
      {message && <p className="text-sm text-gray-400 font-medium">{message}</p>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  message: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg'])
};

export default LoadingSpinner;
