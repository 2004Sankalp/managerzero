import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Check, RotateCcw, X } from 'lucide-react';

/**
 * Action Item with role-aware interaction:
 * - Employee: can toggle Done / Undone freely
 * - Manager: read-only checkbox, but can "Undo" a completed task with a reason
 */
const ActionItem = ({ task, assignee, due, isOverdue = false, completed = false, onToggle, onManagerUndo, isManager = false }) => {
  const [showUndoInput, setShowUndoInput] = useState(false);
  const [undoReason, setUndoReason] = useState('');

  const handleUndoSubmit = () => {
    if (!undoReason.trim()) return;
    onManagerUndo?.(undoReason.trim());
    setUndoReason('');
    setShowUndoInput(false);
  };

  return (
    <div className={`py-3 border-b border-border last:border-0 px-2 rounded-lg transition-colors ${completed ? 'opacity-80' : 'hover:bg-white/5'}`}>
      <div className="flex items-center space-x-3">
        {/* Checkbox — manager sees read-only, employee can click */}
        <button
          onClick={!isManager ? onToggle : undefined}
          disabled={isManager}
          aria-label={isManager ? 'Task completion status' : `Mark "${task}" as ${completed ? 'incomplete' : 'complete'}`}
          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all flex-shrink-0
            ${completed
              ? 'bg-accent border-accent text-white'
              : 'border-gray-500/50 text-transparent'}
            ${isManager ? 'cursor-default' : 'hover:border-accent cursor-pointer'}`}
        >
          <Check strokeWidth={3} className="w-3.5 h-3.5" />
        </button>

        <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between min-w-0">
          <span className={`text-sm truncate transition-all ${completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>
            {task}
          </span>

          <div className="flex items-center space-x-2 mt-1 sm:mt-0 flex-shrink-0">
            {completed && (
              <span className="text-xs text-green-400 font-bold flex items-center gap-1">
                <Check className="w-3 h-3" /> Done
              </span>
            )}
            {/* Manager Undo button — only on completed tasks */}
            {isManager && completed && !showUndoInput && (
              <button
                onClick={() => setShowUndoInput(true)}
                className="text-xs text-amber-400 hover:text-amber-300 border border-amber-400/30 hover:border-amber-400 rounded px-2 py-0.5 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Undo
              </button>
            )}
            <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-xs text-gray-400">
              {assignee}
            </span>
            <span className={`text-xs w-16 text-right ${isOverdue && !completed ? 'text-red-400 font-medium' : 'text-gray-500'}`}>
              {due}
            </span>
          </div>
        </div>
      </div>

      {/* Inline reason input for manager undo */}
      {showUndoInput && (
        <div className="mt-3 ml-8 flex gap-2 items-center animate-fade-in">
          <input
            type="text"
            id={`undo-reason-${task.replace(/\s+/g, '-')}`}
            name={`undo-reason-${task.replace(/\s+/g, '-')}`}
            placeholder="Reason for reopening..."
            value={undoReason}
            onChange={e => setUndoReason(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleUndoSubmit(); if (e.key === 'Escape') setShowUndoInput(false); }}
            className="flex-1 bg-black/20 border border-amber-400/30 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
            autoFocus
          />
          <button
            onClick={handleUndoSubmit}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-colors"
          >
            Submit
          </button>
          <button
            onClick={() => { setShowUndoInput(false); setUndoReason(''); }}
            className="p-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Show rejection reason on the item */}
      {completed === false && task && assignee && (
        <>{/* placeholder for rejection note injected from parent */}</>
      )}
    </div>
  );
};

ActionItem.propTypes = {
  task: PropTypes.string.isRequired,
  assignee: PropTypes.string.isRequired,
  due: PropTypes.string.isRequired,
  isOverdue: PropTypes.bool,
  completed: PropTypes.bool,
  onToggle: PropTypes.func,
  onManagerUndo: PropTypes.func,
  isManager: PropTypes.bool,
};

export default ActionItem;
