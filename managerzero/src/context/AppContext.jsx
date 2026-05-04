import React, { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AppContext = createContext();

const STORAGE_KEY = 'mz_standup_updates';

const defaultStandups = [
  { name: "Alice", yesterday: "Built API endpoints", today: "Writing unit tests", blockers: "None" },
  { name: "Bob", yesterday: "Database schema", today: "AWS instance debugging", blockers: "Waiting on DevOps access" }
];

function loadStandups() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : defaultStandups;
  } catch {
    return defaultStandups;
  }
}

const MEETING_KEY = 'mz_meeting_results';
const FEEDBACK_KEY = 'mz_feedback_list';

function loadMeetingResults() {
  try {
    const raw = localStorage.getItem(MEETING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export const AppContextProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');
  const [role, setRole] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Cross-tab synced standup state
  const [standupUpdates, _setStandupUpdates] = useState(loadStandups);

  const setStandupUpdates = (updater) => {
    _setStandupUpdates(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  // Cross-tab synced meeting results
  const [meetingResults, _setMeetingResults] = useState(loadMeetingResults);

  const setMeetingResults = (updater) => {
    _setMeetingResults(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try {
        if (next === null) localStorage.removeItem(MEETING_KEY);
        else localStorage.setItem(MEETING_KEY, JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Listen for cross-tab storage events
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try { _setStandupUpdates(JSON.parse(e.newValue)); } catch {}
      }
      if (e.key === MEETING_KEY) {
        try { _setMeetingResults(e.newValue ? JSON.parse(e.newValue) : null); } catch {}
      }
      if (e.key === FEEDBACK_KEY) {
        try { _setFeedbackList(e.newValue ? JSON.parse(e.newValue) : []); } catch {}
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Cross-tab synced feedback list
  const [feedbackList, _setFeedbackList] = useState(() => {
    try {
      const raw = localStorage.getItem(FEEDBACK_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  });

  const setFeedbackList = (updater) => {
    _setFeedbackList(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      try { localStorage.setItem(FEEDBACK_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  };

  const [teamMembers, setTeamMembers] = useState([
    { name: "Alice", role: "Frontend Lead", ticketCount: 2, onLeave: false },
    { name: "Bob", role: "Backend Dev", ticketCount: 4, onLeave: false },
    { name: "Charlie", role: "Fullstack Eng", ticketCount: 3, onLeave: false },
    { name: "Diana", role: "DevOps Eng", ticketCount: 1, onLeave: false }
  ]);

  const [tasks, setTasks] = useState([
    { id: 1, title: "Resolve Auth Auth0 bug", assignee: "Alice", status: "todo", progress: 0, comment: '' },
    { id: 2, title: "Deploy Vercel Environment", assignee: "Bob", status: "in-progress", progress: 50, comment: 'Hanging on DNS propagation' },
    { id: 3, title: "Write Postgres Migrations", assignee: "Charlie", status: "done", progress: 100, comment: '' },
    { id: 4, title: "Set up CI/CD pipeline", assignee: "Diana", status: "todo", progress: 0, comment: '' }
  ]);

  // Tailwind dark mode class injection
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <AppContext.Provider value={{
      theme, toggleTheme,
      role, setRole,
      currentUser, setCurrentUser,
      standupUpdates, setStandupUpdates,
      meetingResults, setMeetingResults,
      feedbackList, setFeedbackList,
      teamMembers, setTeamMembers,
      tasks, setTasks
    }}>
      {children}
    </AppContext.Provider>
  );
};

AppContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
