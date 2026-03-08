import React from 'react';
import { useApp } from '../contexts/AppContext';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Auth() {
  const { login } = useApp();

  const handleGoogleLogin = async () => {
    await login();
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden"
      >
        <div className="p-8 md:p-12">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Welcome to KaratBase
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              Sign in with your Google account to access your professional jewelry tools and inventory.
            </p>
          </div>

          <button 
            onClick={handleGoogleLogin}
            className="w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm group"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Continue with Google
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Secure authentication powered by Firebase.
            </p>
          </div>
        </div>

        <div className="bg-slate-50 dark:bg-slate-800/50 p-6 text-center border-t border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
            By continuing, you agree to KaratBase's Terms of Service and Privacy Policy.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
