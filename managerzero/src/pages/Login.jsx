import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield, Code, Zap, ArrowLeft } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Login() {
  const navigate = useNavigate();
  const { setRole, setCurrentUser } = useAppContext();

  const handleLogin = (selectedRole, user = null) => {
    setRole(selectedRole);
    if (user) setCurrentUser(user);
    if (selectedRole === 'manager') {
      navigate('/manager');
    } else {
      navigate('/employee');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0A0F] text-black dark:text-white flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-50 dark:opacity-100 mix-blend-multiply dark:mix-blend-normal">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 w-full max-w-4xl">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-12"
        >
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="w-16 h-16 bg-black dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Zap className="w-8 h-8 text-white dark:text-black fill-current" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight mb-4">Select User Context</h1>
          <p className="text-gray-500 dark:text-brand-secondary">Choose a role to simulate the platform experience.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Engineering Manager Logic */}
          <motion.button 
            onClick={() => handleLogin('manager')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="group relative flex flex-col items-start p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/50 hover:bg-white dark:hover:bg-white/5 transition-all text-left overflow-hidden shadow-lg"
          >
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
              <Shield className="w-32 h-32" />
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#0A0A0F] dark:bg-white border border-gray-200 dark:border-white/20 flex items-center justify-center mb-6 z-10">
              <Shield className="w-6 h-6 text-white dark:text-black" />
            </div>
            <h2 className="text-2xl font-bold mb-2 z-10">Engineering Manager</h2>
            <p className="text-gray-500 dark:text-brand-secondary text-sm leading-relaxed z-10">
              Access the AI Chief of Staff dashboard. View team capacity, manage risks, execute aggregate standups, and track sprint sentiment globally.
            </p>
          </motion.button>

          {/* Software Engineer Logic */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="p-8 rounded-3xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-black/50 text-left relative overflow-hidden shadow-lg h-full">
               <div className="absolute top-0 right-0 p-6 opacity-10">
                 <Code className="w-32 h-32" />
               </div>
               <div className="relative z-10">
                 <div className="w-12 h-12 rounded-xl bg-[#0A0A0F] dark:bg-white border border-gray-200 dark:border-white/20 flex items-center justify-center mb-6">
                   <Code className="w-6 h-6 text-white dark:text-black" />
                 </div>
                 <h2 className="text-2xl font-bold mb-2">Software Engineer</h2>
                 <p className="text-gray-500 dark:text-brand-secondary text-sm leading-relaxed mb-6">
                   Select a test user to view mapped action items, post standup updates, and flag blockers.
                 </p>
                 
                 <div className="grid grid-cols-2 gap-3 mt-auto">
                   <button onClick={() => handleLogin('employee', 'Alice')} className="px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">Login as Alice</button>
                   <button onClick={() => handleLogin('employee', 'Bob')} className="px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">Login as Bob</button>
                   <button onClick={() => handleLogin('employee', 'Charlie')} className="px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">Login as Charlie</button>
                   <button onClick={() => handleLogin('employee', 'Diana')} className="px-4 py-3 border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">Login as Diana</button>
                 </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
