import React, { useState } from 'react';
import { ShoppingBag, Percent, DollarSign, Truck, Building2, HardHat, Gem, Coins } from 'lucide-react';
import { motion } from 'motion/react';

export default function RetailCalculator() {
  const [metalCost, setMetalCost] = useState<number>(0);
  const [stoneCost, setStoneCost] = useState<number>(0);
  const [laborRate, setLaborRate] = useState<number>(50);
  const [laborHours, setLaborHours] = useState<number>(2);
  const [shipping, setShipping] = useState<number>(25);
  const [ccFees, setCcFees] = useState<number>(2.9);
  const [overhead, setOverhead] = useState<number>(15); // % of total cost
  const [capex, setCapex] = useState<number>(0);
  
  const [isMarkup, setIsMarkup] = useState(true); // Toggle between Markup and Margin
  const [markupValue, setMarkupValue] = useState(100); // e.g. 100% markup (keystone)

  const laborCost = laborRate * laborHours;
  const baseCost = metalCost + stoneCost + laborCost + capex;
  const totalCostWithOverhead = baseCost * (1 + overhead / 100) + shipping;
  
  let retailPrice = 0;
  if (isMarkup) {
    retailPrice = totalCostWithOverhead * (1 + markupValue / 100);
  } else {
    // Margin formula: Cost / (1 - Margin%)
    retailPrice = totalCostWithOverhead / (1 - markupValue / 100);
  }

  // CC fees are usually on the final retail price
  const finalPrice = retailPrice / (1 - ccFees / 100);
  const totalFees = finalPrice - retailPrice;
  const netProfit = retailPrice - totalCostWithOverhead;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Retail Pricing Suite</h2>
        <p className="text-slate-500 dark:text-slate-400">Calculate profitable retail prices with all hidden costs accounted for</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Coins className="w-4 h-4" /> Material Costs
                </h3>
                <div className="space-y-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">$</span>
                    <input 
                      type="number"
                      value={metalCost || ''}
                      onChange={(e) => setMetalCost(Number(e.target.value))}
                      placeholder="Metal Cost"
                      className="w-full p-3 pl-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">$</span>
                    <input 
                      type="number"
                      value={stoneCost || ''}
                      onChange={(e) => setStoneCost(Number(e.target.value))}
                      placeholder="Stone Cost"
                      className="w-full p-3 pl-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <HardHat className="w-4 h-4" /> Production & Ops
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Labor Rate ($/hr)</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">$</span>
                        <input 
                          type="number"
                          value={laborRate || ''}
                          onChange={(e) => setLaborRate(Number(e.target.value))}
                          placeholder="Rate"
                          className="w-full p-3 pl-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">Labor Hours</label>
                      <div className="relative">
                        <input 
                          type="number"
                          value={laborHours || ''}
                          onChange={(e) => setLaborHours(Number(e.target.value))}
                          placeholder="Hours"
                          className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase ml-1">CAPEX / Mold Fees</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-sm">$</span>
                      <input 
                        type="number"
                        value={capex || ''}
                        onChange={(e) => setCapex(Number(e.target.value))}
                        placeholder="0.00"
                        className="w-full p-3 pl-8 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Shipping ($)
                </label>
                <input 
                  type="number"
                  value={shipping}
                  onChange={(e) => setShipping(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                  <Building2 className="w-3 h-3" /> Overhead (%)
                </label>
                <input 
                  type="number"
                  value={overhead}
                  onChange={(e) => setOverhead(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase flex items-center gap-1">
                  <Percent className="w-3 h-3" /> CC Fees (%)
                </label>
                <input 
                  type="number"
                  value={ccFees}
                  onChange={(e) => setCcFees(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 dark:bg-emerald-900/20 p-8 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-emerald-900 dark:text-emerald-400 flex items-center gap-2">
                <Percent className="w-5 h-5" /> Profit Strategy
              </h3>
              <div className="flex bg-white dark:bg-slate-800 p-1 rounded-xl border border-emerald-200 dark:border-emerald-900/50">
                <button 
                  onClick={() => setIsMarkup(true)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    isMarkup ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                  )}
                >
                  MARKUP
                </button>
                <button 
                  onClick={() => setIsMarkup(false)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                    !isMarkup ? "bg-emerald-600 text-white shadow-sm" : "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/30"
                  )}
                >
                  MARGIN
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-emerald-800 dark:text-emerald-400/80">
                  Desired {isMarkup ? 'Markup' : 'Margin'} Percentage
                </label>
                <span className="text-2xl font-black text-emerald-900 dark:text-emerald-400">{markupValue}%</span>
              </div>
              <div className="relative pt-2">
                <input 
                  type="range"
                  min="0"
                  max={isMarkup ? 500 : 95}
                  step="5"
                  value={markupValue}
                  onChange={(e) => setMarkupValue(Number(e.target.value))}
                  className="w-full h-2 bg-emerald-200 dark:bg-emerald-900/50 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
                <div className="relative w-full mt-4 h-6">
                  <span className="absolute left-0 text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">Low</span>
                  <button 
                    onClick={() => setMarkupValue(isMarkup ? 100 : 50)}
                    className="absolute top-0 -translate-x-1/2 flex flex-col items-center group"
                    style={{ left: `${isMarkup ? (100/500)*100 : (50/95)*100}%` }}
                  >
                    <div className="w-0.5 h-2 bg-emerald-400 dark:bg-emerald-600 mb-1" />
                    <span className="text-[10px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-tight whitespace-nowrap bg-white dark:bg-slate-800 px-1.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/50 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                      {isMarkup ? 'Keystone (100%)' : 'Standard (50%)'}
                    </span>
                  </button>
                  <span className="absolute right-0 text-[10px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-6 shadow-xl shadow-slate-200 dark:shadow-none">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">Final Retail Price</h3>
            </div>

            <div className="space-y-1">
              <div className="text-5xl font-black text-white">
                ${finalPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-slate-400 text-xs">Includes {ccFees}% CC processing fee</p>
            </div>

            <div className="space-y-4 pt-6 border-t border-slate-800">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Production Cost:</span>
                <span className="font-medium">${totalCostWithOverhead.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Processing Fees:</span>
                <span className="font-medium text-rose-400">-${totalFees.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex justify-between items-center pt-2">
                <span className="text-emerald-400 font-bold">Net Profit:</span>
                <span className="text-2xl font-black text-emerald-400">${netProfit.toFixed(2)}</span>
              </div>
            </div>

            <div className="bg-slate-800/50 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                <span>Profit Margin</span>
                <span>{((netProfit / finalPrice) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, (netProfit / finalPrice) * 100)}%` }} 
                />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">Price Breakdown</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400 flex-1">Materials</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">${(metalCost + stoneCost).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400 flex-1">Labor & Ops</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">${(laborCost + capex).toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-indigo-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400 flex-1">Overhead & Ship</span>
                <span className="text-xs font-bold text-slate-900 dark:text-white">${(shipping + (baseCost * overhead / 100)).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { cn } from '../lib/utils';
