import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Gem, 
  Scale, 
  Calculator, 
  ShoppingBag, 
  FlaskConical, 
  Ruler,
  Layers,
  Grid3X3,
  Menu,
  X,
  Sun,
  Moon,
  Store
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

import { useApp } from './contexts/AppContext';

// Components
import Dashboard from './components/Dashboard';
import PurityCalculator from './components/PurityCalculator';
import WeightEstimator from './components/WeightEstimator';
import ScrapCalculator from './components/ScrapCalculator';
import RetailCalculator from './components/RetailCalculator';
import AlloyMixer from './components/AlloyMixer';
import RingBlankCalculator from './components/RingBlankCalculator';
import CastingGrainCalculator from './components/CastingGrainCalculator';
import StoneSettingVisualizer from './components/StoneSettingVisualizer';
import GemstoneShop from './components/GemstoneShop';
import Auth from './components/Auth';

type Tab = 'dashboard' | 'purity' | 'weight' | 'scrap' | 'retail' | 'alloy' | 'ring' | 'casting' | 'setting' | 'shop';

const OvalLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <ellipse cx="12" cy="12" rx="9" ry="6" />
    <path d="M12 6v12M3 12h18" opacity="0.5" />
    <path d="M5.5 8.5l13 7M5.5 15.5l13-7" opacity="0.3" />
  </svg>
);

export default function App() {
  const { user, loading, logout } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'text-blue-500' },
    { id: 'purity', label: 'Purity Calc', icon: Calculator, color: 'text-amber-500' },
    { id: 'weight', label: 'Stone Weight', icon: Gem, color: 'text-indigo-500' },
    { id: 'scrap', label: 'Scrap Calc', icon: Scale, color: 'text-rose-500' },
    { id: 'retail', label: 'Retail Calc', icon: ShoppingBag, color: 'text-emerald-500' },
    { id: 'alloy', label: 'Alloy Mixer', icon: FlaskConical, color: 'text-cyan-500' },
    { id: 'ring', label: 'Ring Blank', icon: Ruler, color: 'text-pink-500' },
    { id: 'casting', label: 'Casting Grain', icon: Layers, color: 'text-orange-500' },
    { id: 'setting', label: 'Stone Setting', icon: Grid3X3, color: 'text-teal-500' },
    { id: 'shop', label: 'Gemstone Shop', icon: Store, color: 'text-violet-500' },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard onNavigate={setActiveTab} />;
      case 'purity': return <PurityCalculator />;
      case 'weight': return <WeightEstimator />;
      case 'scrap': return <ScrapCalculator />;
      case 'retail': return <RetailCalculator />;
      case 'alloy': return <AlloyMixer />;
      case 'ring': return <RingBlankCalculator />;
      case 'casting': return <CastingGrainCalculator />;
      case 'setting': return <StoneSettingVisualizer />;
      case 'shop': return <GemstoneShop />;
      default: return <Dashboard onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className={cn(
      "min-h-screen flex font-sans transition-colors duration-300",
      isDarkMode ? "bg-slate-950 text-slate-100 dark" : "bg-slate-50 text-slate-900"
    )}>
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out border-r",
          isDarkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/20">
              <OvalLogo className="w-5 h-5 text-white" />
            </div>
            {isSidebarOpen && (
              <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">KaratBase</span>
            )}
          </div>

          <nav className="flex-1 px-3 space-y-1 mt-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as Tab)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                  activeTab === item.id 
                    ? (isDarkMode ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/20" : "bg-slate-900 text-white shadow-lg shadow-slate-200")
                    : (isDarkMode ? "text-slate-400 hover:bg-slate-800 hover:text-white" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900")
                )}
              >
                <item.icon className={cn(
                  "w-5 h-5 shrink-0 transition-colors",
                  activeTab === item.id ? "text-white" : item.color
                )} />
                {isSidebarOpen && (
                  <span className="font-semibold text-sm">{item.label}</span>
                )}
                {activeTab === item.id && isSidebarOpen && (
                  <motion.div 
                    layoutId="active-pill"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-slate-50 text-slate-400"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "flex-1 transition-all duration-300",
          isSidebarOpen ? "ml-64" : "ml-20"
        )}
      >
        <header className={cn(
          "h-16 backdrop-blur-md border-b sticky top-0 z-40 px-8 flex items-center justify-between transition-colors",
          isDarkMode ? "bg-slate-950/80 border-slate-800" : "bg-white/80 border-slate-200"
        )}>
          <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
            <span>KaratBase</span>
            <span className="text-slate-200 dark:text-slate-700">/</span>
            <span className={isDarkMode ? "text-white" : "text-slate-900"}>{navItems.find(n => n.id === activeTab)?.label}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={cn(
                "p-2 rounded-lg transition-colors",
                isDarkMode ? "bg-slate-800 text-amber-400 hover:bg-slate-700" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              )}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-right">
              <div className={cn("text-xs font-bold", isDarkMode ? "text-white" : "text-slate-900")}>{user.name}</div>
              <button 
                onClick={logout}
                className="text-[10px] text-indigo-600 dark:text-indigo-400 font-bold hover:text-indigo-700 transition-colors uppercase tracking-widest"
              >
                Sign Out
              </button>
            </div>
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
