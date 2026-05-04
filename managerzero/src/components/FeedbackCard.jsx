import React from 'react';
import PropTypes from 'prop-types';

/**
 * Feedback Card Component
 * Presents formatted client/sprint feedback.
 */
const FeedbackCard = ({ client, project, sprint, rating, text, date }) => {
  const isPositive = rating >= 4;
  
  return (
    <div className={`p-4 bg-white/5 border border-border rounded-lg border-l-4 ${isPositive ? 'border-l-accent' : 'border-l-red-500'} hover:bg-white/[0.07] transition-colors`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-sm text-gray-200">{client}</h4>
          <p className="text-xs text-gray-500">{project} • {sprint}</p>
        </div>
        <div className="flex flex-col items-end">
          <div className="flex space-x-1" aria-label={`Rating: ${rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} className={`text-xs ${star <= rating ? (isPositive ? 'text-accent' : 'text-amber-400') : 'text-gray-700'}`}>
                ★
              </span>
            ))}
          </div>
          <span className="text-[10px] text-gray-600 mt-1">{date}</span>
        </div>
      </div>
      <p className="text-sm text-gray-400 mt-2 italic leading-relaxed">"{text}"</p>
    </div>
  );
};

FeedbackCard.propTypes = {
  client: PropTypes.string.isRequired,
  project: PropTypes.string.isRequired,
  sprint: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  text: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

export default FeedbackCard;
