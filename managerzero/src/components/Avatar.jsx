import React from 'react';
import PropTypes from 'prop-types';

/**
 * Custom Avatar component showing initials
 */
const Avatar = ({ name, size = 'md' }) => {
  const getInitials = (str) => {
    if (!str) return '?';
    const names = str.trim().split(' ');
    if (names.length >= 2) return (names[0][0] + names[1][0]).toUpperCase();
    return str.substring(0, 2).toUpperCase();
  };

  // Color selection based on string hash for consistent colors relative to name
  const colors = [
    'bg-blue-500/20 text-blue-400',
    'bg-emerald-500/20 text-emerald-400',
    'bg-amber-500/20 text-amber-400',
    'bg-purple-500/20 text-purple-400',
    'bg-rose-500/20 text-rose-400'
  ];
  
  const charCodeSize = name ? name.charCodeAt(0) : 0;
  const colorClass = colors[charCodeSize % colors.length];

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base'
  };

  return (
    <div className={`${sizeClasses[size]} ${colorClass} rounded-full flex items-center justify-center font-bold flex-shrink-0`}>
      {getInitials(name)}
    </div>
  );
};

Avatar.propTypes = {
  name: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
};

export default Avatar;
