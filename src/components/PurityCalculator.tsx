import React, { useState } from 'react';
import { GOLD_PURITIES } from '../constants';
import { Calculator, ArrowRight, DollarSign, Percent } from 'lucide-react';
import { motion } from 'motion/react';
import { useApp } from '../contexts/AppContext';

import { cn } from '../lib/utils';

export default function PurityCalculator() {
  const { prices, manualPrices, useManualPrices, setUseManualPrices, setManualPrices } = useApp();
  const [weight, setWeight] = useState<number>(0);
  const [purity, setPurity] = useState<number>(0.585); // Default 14K
  const [discount, setDiscount] = useState<number>(10);
  const [premium, setPremium] = useState<number>(20);
  
  const currentPrices = useManualPrices ? manualPrices : prices;
  const spotPrice = currentPrices?.gold || 0;

  const handleManualPriceChange = (val: number) => {
    if (!manualPrices) return;
    setManualPrices({ ...manualPrices, gold: val });
  };

  const pureWeight = weight * purity;
  const alloyWeight = weight - pureWeight;
  
  const meltValue = (pureWeight / 31.1035) * spotPrice; // Convert grams to oz
  const purchasePrice = meltValue * (1 - discount / 100);
  const salePrice = meltValue * (1 + premium / 100);
  const profit = salePrice - purchasePrice;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Purity & Valuation Calculator</h2>
        <p className="text-slate-500">Calculate fine gold content and business margins</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Gold Purity (Karat)</label>
            <select 
              value={purity}
              onChange={(e) => setPurity(Number(e.target.value))}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            >
              {GOLD_PURITIES.map((p) => (
                <option key={p.label} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-700">Total Weight (grams)</label>
            <input 
              type="number"
              value={weight || ''}
              onChange={(e) => setWeight(Number(e.target.value))}
              placeholder="0.00"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Buy Discount (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Sell Premium (%)</label>
              <div className="relative">
                <Percent className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="number"
                  value={premium}
                  onChange={(e) => setPremium(Number(e.target.value))}
                  className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700">Current Spot Price ($/oz)</label>
              <button 
                onClick={() => setUseManualPrices(!useManualPrices)}
                className={cn(
                  "text-[10px] font-bold px-2 py-1 rounded-md transition-colors",
                  useManualPrices ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-500"
                )}
              >
                {useManualPrices ? "MANUAL MODE" : "LIVE MODE"}
              </button>
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="number"
                value={spotPrice}
                onChange={(e) => handleManualPriceChange(Number(e.target.value))}
                readOnly={!useManualPrices}
                className={cn(
                  "w-full p-3 pl-10 border rounded-xl outline-none transition-all",
                  useManualPrices 
                    ? "bg-white border-amber-200 focus:ring-2 focus:ring-amber-500" 
                    : "bg-slate-50 border-slate-200 cursor-not-allowed text-slate-500"
                )}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div 
            layout
            className="bg-amber-50 p-6 rounded-3xl border border-amber-100"
          >
            <h3 className="text-amber-900 font-bold mb-4 flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Composition Results
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-amber-700">Fine Gold Weight:</span>
                <span className="text-xl font-bold text-amber-900">{pureWeight.toFixed(3)}g</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-amber-700">Alloy Weight:</span>
                <span className="text-xl font-bold text-amber-900">{alloyWeight.toFixed(3)}g</span>
              </div>
            </div>
          </motion.div>

          <motion.div 
            layout
            className="bg-slate-900 p-6 rounded-3xl text-white space-y-4"
          >
            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">Valuation Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Melt Value:</span>
                <span className="text-lg font-semibold">${meltValue.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex justify-between items-center">
                <span className="text-emerald-400">Purchase Price (Buy):</span>
                <span className="text-xl font-bold text-emerald-400">${purchasePrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-400">Sale Price (Sell):</span>
                <span className="text-xl font-bold text-blue-400">${salePrice.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-slate-400">Estimated Profit:</span>
                <span className="text-2xl font-bold text-white">${profit.toFixed(2)}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
