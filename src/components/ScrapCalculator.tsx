import React, { useState } from 'react';
import { Trash2, Plus, DollarSign, Percent, Gem, Scale } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../contexts/AppContext';
import { cn } from '../lib/utils';

interface ScrapStone {
  id: string;
  weight: number;
  valuePerCt: number;
}

export default function ScrapCalculator() {
  const { prices, manualPrices, useManualPrices, setUseManualPrices, setManualPrices } = useApp();
  const [totalWeight, setTotalWeight] = useState<number>(0);
  const [metalType, setMetalType] = useState('14K Gold');
  const [metalPurity, setMetalPurity] = useState(0.585);
  const [stones, setStones] = useState<ScrapStone[]>([]);
  const [discount, setDiscount] = useState(20);
  const [premium, setPremium] = useState(30);
  
  const currentPrices = useManualPrices ? manualPrices : prices;

  const getSpotPrice = () => {
    if (!currentPrices) return 0;
    if (metalType.includes('Gold')) return currentPrices.gold;
    if (metalType.includes('Silver')) return currentPrices.silver;
    if (metalType.includes('Platinum')) return currentPrices.platinum;
    if (metalType.includes('Palladium')) return currentPrices.palladium;
    return 0;
  };

  const spotPrice = getSpotPrice();

  const handleManualPriceChange = (val: number) => {
    if (!manualPrices) return;
    const newPrices = { ...manualPrices };
    if (metalType.includes('Gold')) newPrices.gold = val;
    else if (metalType.includes('Silver')) newPrices.silver = val;
    else if (metalType.includes('Platinum')) newPrices.platinum = val;
    else if (metalType.includes('Palladium')) newPrices.palladium = val;
    setManualPrices(newPrices);
  };

  const addStone = () => {
    setStones([...stones, { id: Math.random().toString(36).substr(2, 9), weight: 0, valuePerCt: 0 }]);
  };

  const removeStone = (id: string) => {
    setStones(stones.filter(s => s.id !== id));
  };

  const updateStone = (id: string, field: keyof ScrapStone, value: number) => {
    setStones(stones.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const stonesWeightCt = stones.reduce((acc, s) => acc + s.weight, 0);
  const stonesWeightGrams = stonesWeightCt * 0.2;
  const stonesValue = stones.reduce((acc, s) => acc + (s.weight * s.valuePerCt), 0);
  
  const netMetalWeight = Math.max(0, totalWeight - stonesWeightGrams);
  const metalMeltValue = (netMetalWeight * metalPurity / 31.1035) * spotPrice;
  
  const totalMeltValue = metalMeltValue + stonesValue;
  const purchasePrice = totalMeltValue * (1 - discount / 100);
  const salePrice = totalMeltValue * (1 + premium / 100);
  const profit = salePrice - purchasePrice;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">Scrap & Estate Calculator</h2>
        <p className="text-slate-500 dark:text-slate-400">Value complex pieces with mixed metals and stones</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Scale className="w-5 h-5 text-rose-500" />
              Metal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Total Piece Weight (g)</label>
                <input 
                  type="number"
                  value={totalWeight || ''}
                  onChange={(e) => setTotalWeight(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Metal Type</label>
                <select 
                  onChange={(e) => {
                    const val = e.target.value;
                    setMetalType(val);
                    if (val.includes('24K')) setMetalPurity(0.999);
                    else if (val.includes('18K')) setMetalPurity(0.750);
                    else if (val.includes('14K')) setMetalPurity(0.585);
                    else if (val.includes('10K')) setMetalPurity(0.417);
                    else if (val.includes('Platinum')) setMetalPurity(0.950);
                    else if (val.includes('Silver')) setMetalPurity(0.925);
                  }}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none transition-all text-slate-900 dark:text-white"
                >
                  <option>14K Gold (58.5%)</option>
                  <option>18K Gold (75.0%)</option>
                  <option>10K Gold (41.7%)</option>
                  <option>24K Gold (99.9%)</option>
                  <option>Platinum (95.0%)</option>
                  <option>Sterling Silver (92.5%)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Gem className="w-5 h-5 text-blue-500" />
                Stone Breakdown
              </h3>
              <button 
                onClick={addStone}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Stone
              </button>
            </div>

            <div className="space-y-3">
              <AnimatePresence>
                {stones.map((stone) => (
                  <motion.div 
                    key={stone.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800"
                  >
                    <div className="flex-1 grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Weight (ct)</label>
                        <input 
                          type="number"
                          value={stone.weight || ''}
                          onChange={(e) => updateStone(stone.id, 'weight', Number(e.target.value))}
                          className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none text-sm text-slate-900 dark:text-white"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Value ($/ct)</label>
                        <input 
                          type="number"
                          value={stone.valuePerCt || ''}
                          onChange={(e) => updateStone(stone.id, 'valuePerCt', Number(e.target.value))}
                          className="w-full bg-transparent border-b border-slate-200 dark:border-slate-700 focus:border-blue-500 outline-none text-sm text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>
                    <button 
                      onClick={() => removeStone(stone.id)}
                      className="p-2 text-slate-300 dark:text-slate-600 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {stones.length === 0 && (
                <div className="text-center py-8 text-slate-400 dark:text-slate-600 text-sm border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl">
                  No stones added. Click "Add Stone" to include gems in valuation.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-6">
            <h3 className="text-slate-400 font-bold uppercase text-xs tracking-widest">Valuation Summary</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Net Metal Value:</span>
                <span>${metalMeltValue.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Total Stone Value:</span>
                <span>${stonesValue.toFixed(2)}</span>
              </div>
              <div className="h-px bg-slate-800" />
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Total Melt:</span>
                <span className="text-2xl font-bold">${totalMeltValue.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-emerald-400">
                  <span>PURCHASE PRICE ({discount}% OFF)</span>
                  <span>${purchasePrice.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full" style={{ width: `${100 - discount}%` }} />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-blue-400">
                  <span>SALE PRICE (+{premium}% PREM)</span>
                  <span>${salePrice.toFixed(2)}</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-800">
              <div className="text-center">
                <div className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Projected Profit</div>
                <div className="text-4xl font-black text-white">${profit.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Spot Price ($/oz)</label>
                <button 
                  onClick={() => setUseManualPrices(!useManualPrices)}
                  className={cn(
                    "text-[10px] font-bold px-2 py-1 rounded-md transition-colors",
                    useManualPrices ? "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400" : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  )}
                >
                  {useManualPrices ? "MANUAL MODE" : "LIVE MODE"}
                </button>
              </div>
              <input 
                type="number"
                value={spotPrice}
                onChange={(e) => handleManualPriceChange(Number(e.target.value))}
                readOnly={!useManualPrices}
                className={cn(
                  "w-full p-3 border rounded-xl outline-none transition-all",
                  useManualPrices 
                    ? "bg-white dark:bg-slate-800 border-amber-200 dark:border-amber-900/50 focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white" 
                    : "bg-slate-50 dark:bg-slate-800/50 border-slate-200 dark:border-slate-700 cursor-not-allowed text-slate-500 dark:text-slate-400"
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Discount %</label>
                <input 
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-400 dark:text-slate-500 uppercase">Premium %</label>
                <input 
                  type="number"
                  value={premium}
                  onChange={(e) => setPremium(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
