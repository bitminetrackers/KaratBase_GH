import React, { useState } from 'react';
import { Layers, ArrowRight, Info, Scale, FlaskConical } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function AlloyMixer() {
  const [mode, setMode] = useState<'target' | 'available'>('target');
  const [metalType, setMetalType] = useState('18K Yellow Gold');
  const [targetWeight, setTargetWeight] = useState<number>(0);
  const [availableFine, setAvailableFine] = useState<number>(0);

  // Alloy recipes with silver/copper/nickel/palladium breakdown
  const recipes: Record<string, { fine: number, alloy: number, silverRatio?: number, copperRatio?: number, nickelRatio?: number, palladiumRatio?: number }> = {
    '18K Yellow Gold': { fine: 0.750, alloy: 0.250, silverRatio: 0.5, copperRatio: 0.5 },
    '14K Yellow Gold': { fine: 0.585, alloy: 0.415, silverRatio: 0.5, copperRatio: 0.5 },
    '10K Yellow Gold': { fine: 0.417, alloy: 0.583, silverRatio: 0.5, copperRatio: 0.5 },
    '18K White Gold (Nickel)': { fine: 0.750, alloy: 0.250, nickelRatio: 0.6, silverRatio: 0.2, copperRatio: 0.2 },
    '14K White Gold (Nickel)': { fine: 0.585, alloy: 0.415, nickelRatio: 0.6, silverRatio: 0.2, copperRatio: 0.2 },
    '18K White Gold (Palladium)': { fine: 0.750, alloy: 0.250, palladiumRatio: 1.0 },
    'Sterling Silver': { fine: 0.925, alloy: 0.075, copperRatio: 1.0 },
    '950 Platinum (Iridium)': { fine: 0.950, alloy: 0.050, copperRatio: 0.0 }, // Simplified
    '950 Platinum (Cobalt)': { fine: 0.950, alloy: 0.050, copperRatio: 0.0 }, // Simplified
  };

  const [customMix, setCustomMix] = useState({ gold: 75, silver: 12.5, copper: 12.5, nickel: 0, palladium: 0 });

  const currentRecipe = recipes[metalType];

  let results = {
    fineNeeded: 0,
    alloyNeeded: 0,
    silverNeeded: 0,
    copperNeeded: 0,
    nickelNeeded: 0,
    palladiumNeeded: 0,
    totalWeight: 0
  };

  if (mode === 'target') {
    results.fineNeeded = targetWeight * currentRecipe.fine;
    results.alloyNeeded = targetWeight * currentRecipe.alloy;
    results.totalWeight = targetWeight;
  } else {
    results.fineNeeded = availableFine;
    results.totalWeight = availableFine / currentRecipe.fine;
    results.alloyNeeded = results.totalWeight - availableFine;
  }

  if (currentRecipe.silverRatio !== undefined) results.silverNeeded = results.alloyNeeded * currentRecipe.silverRatio;
  if (currentRecipe.copperRatio !== undefined) results.copperNeeded = results.alloyNeeded * currentRecipe.copperRatio;
  if (currentRecipe.nickelRatio !== undefined) results.nickelNeeded = results.alloyNeeded * currentRecipe.nickelRatio;
  if (currentRecipe.palladiumRatio !== undefined) results.palladiumNeeded = results.alloyNeeded * currentRecipe.palladiumRatio;

  const getAlloyColor = (mix: typeof customMix) => {
    // Very simplified color estimation
    const r = (mix.gold * 255 + mix.copper * 255 + mix.silver * 230 + mix.nickel * 200 + mix.palladium * 200) / 100;
    const g = (mix.gold * 215 + mix.copper * 100 + mix.silver * 230 + mix.nickel * 200 + mix.palladium * 200) / 100;
    const b = (mix.gold * 100 + mix.copper * 80 + mix.silver * 230 + mix.nickel * 200 + mix.palladium * 200) / 100;
    return `rgb(${Math.min(255, r)}, ${Math.min(255, g)}, ${Math.min(255, b)})`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">Alloy Mixing Studio</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Precise measurements for creating custom jewelry alloys</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-8">
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
              <button 
                onClick={() => setMode('target')}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                  mode === 'target' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                Target Weight
              </button>
              <button 
                onClick={() => setMode('available')}
                className={cn(
                  "flex-1 py-3 rounded-xl text-sm font-bold transition-all",
                  mode === 'available' ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                )}
              >
                Available Metal
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Desired Metal Type</label>
                <select 
                  value={metalType}
                  onChange={(e) => setMetalType(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                >
                  {Object.keys(recipes).map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              {mode === 'target' ? (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Final Desired Weight (g)</label>
                  <div className="relative">
                    <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input 
                      type="number"
                      value={targetWeight || ''}
                      onChange={(e) => setTargetWeight(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full p-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Fine Metal You Have (g)</label>
                  <div className="relative">
                    <FlaskConical className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
                    <input 
                      type="number"
                      value={availableFine || ''}
                      onChange={(e) => setAvailableFine(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full p-3 pl-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6 shadow-sm">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-indigo-500" />
              Color Tuner (Visualizer)
            </h3>
            
            <div className="flex gap-6 items-center">
              <div 
                className="w-24 h-24 rounded-full shadow-inner border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-400 dark:text-slate-500 text-center p-2"
                style={{ backgroundColor: getAlloyColor(customMix) }}
              >
                Resulting Color
              </div>
              <div className="flex-1 space-y-3">
                {Object.entries(customMix).map(([metal, value]) => (
                  <div key={metal} className="space-y-1">
                    <div className="flex justify-between text-[10px] font-bold uppercase text-slate-400 dark:text-slate-500">
                      <span>{metal}</span>
                      <span>{value}%</span>
                    </div>
                    <input 
                      type="range"
                      min="0"
                      max="100"
                      value={value}
                      onChange={(e) => {
                        const newVal = Number(e.target.value);
                        setCustomMix(prev => ({ ...prev, [metal]: newVal }));
                      }}
                      className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 italic">
              *Note: Color visualization is an approximation based on typical alloy compositions.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 shadow-sm">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-500" />
              Pro Tip
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Always add your alloy to the molten fine metal. For white gold, ensure your master alloy contains sufficient nickel or palladium for the desired bleach.
            </p>
          </div>

          <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-700 p-8 rounded-3xl text-white space-y-8 shadow-xl shadow-indigo-500/20 dark:shadow-none">
            <h3 className="text-indigo-200 font-bold uppercase text-xs tracking-widest">Mixing Instructions</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold">1</div>
                <div className="flex-1">
                  <div className="text-xs text-indigo-200 uppercase font-bold">Fine Metal Needed</div>
                  <div className="text-2xl font-black">{results.fineNeeded.toFixed(3)}g</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold">2</div>
                <div className="flex-1">
                  <div className="text-xs text-indigo-200 uppercase font-bold">Alloy/Master Needed</div>
                  <div className="text-2xl font-black">{results.alloyNeeded.toFixed(3)}g</div>
                  {(results.silverNeeded > 0 || results.copperNeeded > 0 || results.nickelNeeded > 0 || results.palladiumNeeded > 0) && (
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {results.silverNeeded > 0 && (
                        <div className="bg-white/5 p-2 rounded-lg">
                          <div className="text-[10px] text-indigo-300 uppercase font-bold">Silver</div>
                          <div className="text-sm font-bold">{results.silverNeeded.toFixed(3)}g</div>
                        </div>
                      )}
                      {results.copperNeeded > 0 && (
                        <div className="bg-white/5 p-2 rounded-lg">
                          <div className="text-[10px] text-indigo-300 uppercase font-bold">Copper</div>
                          <div className="text-sm font-bold">{results.copperNeeded.toFixed(3)}g</div>
                        </div>
                      )}
                      {results.nickelNeeded > 0 && (
                        <div className="bg-white/5 p-2 rounded-lg">
                          <div className="text-[10px] text-indigo-300 uppercase font-bold">Nickel</div>
                          <div className="text-sm font-bold">{results.nickelNeeded.toFixed(3)}g</div>
                        </div>
                      )}
                      {results.palladiumNeeded > 0 && (
                        <div className="bg-white/5 p-2 rounded-lg">
                          <div className="text-[10px] text-indigo-300 uppercase font-bold">Palladium</div>
                          <div className="text-sm font-bold">{results.palladiumNeeded.toFixed(3)}g</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-indigo-200 uppercase font-bold">Final {metalType} Weight</div>
                    <div className="text-4xl font-black">{results.totalWeight.toFixed(3)}g</div>
                  </div>
                  <Layers className="w-10 h-10 opacity-20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
