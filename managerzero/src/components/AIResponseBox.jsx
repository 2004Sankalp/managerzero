import React from 'react';
import PropTypes from 'prop-types';
import { Sparkles } from 'lucide-react';

/**
 * AI Response Box wrapper for AI generated content emphasis
 */
const AIResponseBox = ({ text, type = 'info', isTyping = false }) => {
  const colorMap = {
    info: { bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent', icon: 'text-accent' },
    alert: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400', icon: 'text-red-400' },
  };

  const style = colorMap[type] || colorMap.info;

  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 animate-fade-in relative overflow-hidden`}>
      <div className="flex items-start">
        <Sparkles className={`w-5 h-5 ${style.icon} shrink-0 mt-0.5 mr-3 hidden sm:block animate-pulse`} />
        <div>
          {isTyping ? (
            <div className="flex items-center space-x-1 py-1">
              <span className={`w-2 h-2 rounded-full ${style.bg} block animate-bounce`}></span>
              <span className={`w-2 h-2 rounded-full ${style.bg} block animate-bounce delay-100`}></span>
              <span className={`w-2 h-2 rounded-full ${style.bg} block animate-bounce delay-200`}></span>
            </div>
          ) : (
            <p className={`text-sm ${style.text} leading-relaxed`}>{text}</p>
          )}
        </div>
      </div>
    </div>
  );
};

AIResponseBox.propTypes = {
  text: PropTypes.string,
  type: PropTypes.oneOf(['info', 'alert']),
  isTyping: PropTypes.bool
};

export default AIResponseBox;
