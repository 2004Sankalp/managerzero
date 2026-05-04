import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

export default function RoleRoute({ allowedRole, children }) {
  const { role } = useAppContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== allowedRole) {
      if (role === 'manager') navigate('/manager');
      else if (role === 'employee') navigate('/employee');
      else navigate('/login');
    }
  }, [role, allowedRole, navigate]);

  if (role !== allowedRole) return null; // Avoid flashing content before redirect

  return children;
}
