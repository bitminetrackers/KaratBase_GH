import React from 'react';
import { TrendingUp, Clock, RefreshCw, Activity, Layout, Layers, Grid3X3, Ruler, FlaskConical, ShoppingBag, Scale, Gem } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { useApp } from '../contexts/AppContext';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface DashboardProps {
  onNavigate: (tab: any) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const { prices, loading, refreshPrices } = useApp();

  const PriceCard = ({ title, price, symbol, color }: { title: string, price: number | undefined, symbol: string, color: string }) => (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between"
    >
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</span>
        <div className={cn("p-2 rounded-lg bg-opacity-10", color)}>
          <TrendingUp className={cn("w-4 h-4", color.replace('bg-', 'text-'))} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-slate-900 dark:text-white">
          ${price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '---'}
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">per troy oz</div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white">
            Market Intelligence
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Real-time precious metal spot prices and analytics</p>
        </div>
        <button 
          onClick={refreshPrices}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
          {loading ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <PriceCard title="Gold" price={prices?.gold} symbol="Au" color="bg-amber-500" />
        <PriceCard title="Silver" price={prices?.silver} symbol="Ag" color="bg-slate-400" />
        <PriceCard title="Platinum" price={prices?.platinum} symbol="Pt" color="bg-indigo-400" />
        <PriceCard title="Palladium" price={prices?.palladium} symbol="Pd" color="bg-rose-400" />
        <PriceCard title="Rhodium" price={prices?.rhodium} symbol="Rh" color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-amber-500" />
              Gold Price History (30 Days)
            </h3>
            <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Spot Price / USD</div>
          </div>
          
          <div className="h-[300px] w-full">
            {prices?.chartData ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={prices.chartData}>
                  <defs>
                    <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#94a3b8' }}
                    minTickGap={30}
                  />
                  <YAxis 
                    hide 
                    domain={['auto', 'auto']}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '12px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      fontSize: '12px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#f59e0b" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorPrice)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">
                Loading historical data...
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-3xl text-white flex flex-col justify-center">
          <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-6 text-center">Market Sentiment</h3>
          <div className="space-y-8">
            <div className="text-center">
              <div className="text-slate-500 text-xs font-bold uppercase mb-2">Gold/Silver Ratio</div>
              <div className="text-4xl font-black">
                {prices ? (prices.gold / prices.silver).toFixed(2) : '---'}
              </div>
            </div>
            <div className="h-px bg-slate-800" />
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Platinum Premium</div>
                <div className="text-xl font-bold">
                  {prices ? ((prices.platinum / prices.gold - 1) * 100).toFixed(1) : '---'}%
                </div>
              </div>
              <div>
                <div className="text-slate-500 text-[10px] font-bold uppercase mb-1">Volatility Index</div>
                <div className="text-xl font-bold text-emerald-400">Low</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg w-fit">
        <Clock className="w-3 h-3" />
        <span>Last updated: {prices ? new Date(prices.updatedAt).toLocaleTimeString() : 'Never'}</span>
        <span className="mx-2">•</span>
        <span>Data provided by Yahoo Finance</span>
      </div>

      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Layout className="w-5 h-5 text-indigo-500" />
          Active Jeweler Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { id: 'purity', title: "Purity Calculator", desc: "Calculate fine metal content and conversion.", icon: Scale, color: 'text-amber-500' },
            { id: 'weight', title: "Stone Weight Estimator", desc: "Estimate gemstone weight by dimensions.", icon: Gem, color: 'text-indigo-500' },
            { id: 'scrap', title: "Scrap Calculator", desc: "Value your scrap metal based on live spot prices.", icon: Scale, color: 'text-rose-500' },
            { id: 'retail', title: "Retail Calculator", desc: "Professional pricing with labor and markup.", icon: ShoppingBag, color: 'text-emerald-500' },
            { id: 'alloy', title: "Alloy Mixer", icon: FlaskConical, desc: "Create custom gold and platinum recipes.", color: 'text-cyan-500' },
            { id: 'ring', title: "Ring Blank Calculator", icon: Ruler, desc: "Calculate length and weight for ring blanks.", color: 'text-pink-500' },
            { id: 'casting', title: "Casting Grain Calculator", icon: Layers, desc: "Determine metal needed for casting trees.", color: 'text-orange-500' },
            { id: 'setting', title: "Stone Setting Visualizer", icon: Grid3X3, desc: "Plan spacing for channel and pavé settings.", color: 'text-teal-500' },
            { id: 'shop', title: "Gemstone Marketplace", icon: ShoppingBag, desc: "Ethically sourced certified gemstones.", color: 'text-violet-500' }
          ].map((tool, i) => (
            <button 
              key={i} 
              onClick={() => onNavigate(tool.id)}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:border-indigo-200 dark:hover:border-indigo-500/50 hover:bg-white dark:hover:bg-slate-800 transition-all group text-left"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm", tool.color)}>
                  <tool.icon className="w-4 h-4" />
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{tool.title}</div>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">{tool.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
