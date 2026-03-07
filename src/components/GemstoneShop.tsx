import React, { useState } from 'react';
import { ShoppingCart, Gem, Search, Filter, ArrowRight, Star, ShieldCheck, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface Gemstone {
  id: string;
  name: string;
  cut: string;
  carat: number;
  price: number;
  image: string;
  color: string;
  clarity: string;
  origin: string;
}

const GEMSTONES: Gemstone[] = [
  {
    id: '1',
    name: 'Royal Blue Sapphire',
    cut: 'Oval',
    carat: 2.45,
    price: 3200,
    image: 'https://images.unsplash.com/photo-1588444839799-eb64299bba24?w=400&h=400&fit=crop',
    color: 'Deep Blue',
    clarity: 'VVS1',
    origin: 'Sri Lanka'
  },
  {
    id: '2',
    name: 'Colombian Emerald',
    cut: 'Emerald',
    carat: 1.82,
    price: 4500,
    image: 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?w=400&h=400&fit=crop',
    color: 'Vivid Green',
    clarity: 'VS2',
    origin: 'Colombia'
  },
  {
    id: '3',
    name: 'Pigeon Blood Ruby',
    cut: 'Round',
    carat: 1.15,
    price: 5800,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=400&fit=crop',
    color: 'Deep Red',
    clarity: 'IF',
    origin: 'Burma'
  },
  {
    id: '4',
    name: 'Paraiba Tourmaline',
    cut: 'Pear',
    carat: 0.95,
    price: 8900,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400&h=400&fit=crop',
    color: 'Neon Blue',
    clarity: 'VVS2',
    origin: 'Brazil'
  },
  {
    id: '5',
    name: 'Pink Diamond',
    cut: 'Radiant',
    carat: 0.52,
    price: 12500,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
    color: 'Fancy Pink',
    clarity: 'VS1',
    origin: 'Argyle'
  },
  {
    id: '6',
    name: 'Golden Citrine',
    cut: 'Cushion',
    carat: 5.20,
    price: 450,
    image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop',
    color: 'Honey Gold',
    clarity: 'VVS1',
    origin: 'Brazil'
  }
];

export default function GemstoneShop() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filteredGems = GEMSTONES.filter(gem => 
    (filter === 'All' || gem.cut === filter) &&
    gem.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleCheckout = (gem: Gemstone) => {
    // In a real app, you'd call your backend to create a Stripe session
    // const response = await fetch('/api/create-checkout-session', { ... });
    // const { url } = await response.json();
    // window.location.href = url;
    
    alert(`Redirecting to Stripe Checkout for ${gem.name} ($${gem.price})`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
            Gemstone Marketplace
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">
            Sourced directly from mines. Certified and ethically tracked.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search stones..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-64"
            />
          </div>
          <button className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 hover:text-indigo-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGems.map((gem, i) => (
          <motion.div
            key={gem.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500"
          >
            <div className="aspect-square overflow-hidden relative">
              <img 
                src={gem.image} 
                alt={gem.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest shadow-sm">
                {gem.cut}
              </div>
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex gap-2">
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm">
                    {gem.origin}
                  </span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-tighter bg-white/20 px-2 py-1 rounded-md backdrop-blur-sm">
                    {gem.clarity}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {gem.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{gem.carat} Carats • {gem.color}</p>
                </div>
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  ${gem.price.toLocaleString()}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  onClick={() => handleCheckout(gem)}
                  className="flex-1 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  Buy with Stripe
                </button>
                <button className="w-12 h-12 bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 rounded-2xl flex items-center justify-center transition-colors">
                  <ShoppingCart className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-[40px] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-black mb-4">Sell Your Gemstones</h3>
          <p className="text-indigo-100 mb-8 leading-relaxed">
            Are you a miner or a wholesaler? Join KaratBase's verified marketplace and reach thousands of professional jewelers worldwide.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2">
            Apply as Vendor
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm dark:text-white">GIA Certified</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">All stones include digital certs.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm dark:text-white">Ethically Sourced</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Conflict-free guaranteed.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center shrink-0">
            <Zap className="w-6 h-6 text-indigo-500" />
          </div>
          <div>
            <h4 className="font-bold text-sm dark:text-white">Fast Shipping</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Insured 2-day delivery.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
