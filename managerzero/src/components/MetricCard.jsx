import React from 'react';
import PropTypes from 'prop-types';

/**
 * Metric Card Component for dashboards
 */
const MetricCard = ({ title, value, subtitle, valueColor = 'text-white' }) => {
  return (
    <div className="bg-card border border-border p-5 rounded-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:border-accent/30 hover:-translate-y-1 group">
      <h3 className="text-gray-400 font-medium text-sm mb-2">{title}</h3>
      <div className="flex flex-col">
        <span className={`text-3xl font-bold font-mono tracking-tight ${valueColor}`}>
          {value}
        </span>
        <span className="text-xs text-gray-500 mt-1">{subtitle}</span>
      </div>
    </div>
  );
};

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  subtitle: PropTypes.string,
  valueColor: PropTypes.string
};

export default MetricCard;
