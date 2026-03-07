import React, { useState, useMemo } from 'react';
import { Calculator, ArrowRight, Info, Layers, Scale, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

interface MetalDensity {
  name: string;
  density: number;
}

const METALS: MetalDensity[] = [
  { name: 'Sterling Silver', density: 10.4 },
  { name: '10K Yellow Gold', density: 11.6 },
  { name: '14K Yellow Gold', density: 13.1 },
  { name: '18K Yellow Gold', density: 15.6 },
  { name: '14K White Gold', density: 12.6 },
  { name: '18K White Gold', density: 14.7 },
  { name: 'Platinum 950', density: 21.4 },
  { name: 'Fine Gold', density: 19.3 },
];

export default function CastingGrainCalculator() {
  const [waxWeight, setWaxWeight] = useState<number>(0);
  const [selectedMetal, setSelectedMetal] = useState<MetalDensity>(METALS[2]); // 14K Yellow
  const [buttonWeight, setButtonWeight] = useState<number>(5); // Default 5g button
  const [safetyFactor, setSafetyFactor] = useState<number>(10); // 10% safety

  const results = useMemo(() => {
    const metalWeight = waxWeight * selectedMetal.density;
    const safetyAmount = metalWeight * (safetyFactor / 100);
    const totalNeeded = metalWeight + safetyAmount + buttonWeight;

    return {
      metalWeight,
      safetyAmount,
      totalNeeded
    };
  }, [waxWeight, selectedMetal, buttonWeight, safetyFactor]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Casting Grain Calculator</h2>
          <p className="text-slate-500 mt-2 font-medium">Calculate exact metal needed for casting trees and buttons.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-8">
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">Wax Weight (g)</label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="number"
                    step="0.01"
                    value={waxWeight || ''}
                    onChange={(e) => setWaxWeight(Number(e.target.value))}
                    placeholder="0.00"
                    className="w-full p-3 pl-10 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <p className="text-[10px] text-slate-400 italic">Weight of your wax tree/model including sprue.</p>
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700">Target Metal</label>
                <select 
                  value={selectedMetal.name}
                  onChange={(e) => setSelectedMetal(METALS.find(m => m.name === e.target.value) || METALS[0])}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                >
                  {METALS.map(m => (
                    <option key={m.name} value={m.name}>{m.name} ({m.density} g/cm³)</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700">Button Weight (g)</label>
                  <input 
                    type="number"
                    value={buttonWeight}
                    onChange={(e) => setButtonWeight(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-slate-700">Safety Factor (%)</label>
                  <input 
                    type="number"
                    value={safetyFactor}
                    onChange={(e) => setSafetyFactor(Number(e.target.value))}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
            <h4 className="font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-500" />
              Pro Tip: The Button
            </h4>
            <p className="text-sm text-slate-500 leading-relaxed">
              The button is the reservoir of molten metal at the top of the sprue. It provides pressure and feeds the casting as it shrinks during cooling. Never skimp on the button!
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-amber-600 p-8 rounded-3xl text-white space-y-8 shadow-xl shadow-amber-100">
            <h3 className="text-amber-200 font-bold uppercase text-xs tracking-widest">Casting Requirements</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold">1</div>
                <div className="flex-1">
                  <div className="text-xs text-amber-200 uppercase font-bold">Metal for Model</div>
                  <div className="text-2xl font-black">{results.metalWeight.toFixed(2)}g</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-xl font-bold">2</div>
                <div className="flex-1">
                  <div className="text-xs text-amber-200 uppercase font-bold">Button & Safety</div>
                  <div className="text-2xl font-black">{(results.safetyAmount + buttonWeight).toFixed(2)}g</div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xs text-amber-200 uppercase font-bold">Total Grain Needed</div>
                    <div className="text-5xl font-black">{results.totalNeeded.toFixed(2)}g</div>
                  </div>
                  <Layers className="w-12 h-12 opacity-20" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 p-8 rounded-3xl text-white space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm uppercase tracking-wider">
              <RefreshCw className="w-4 h-4" />
              Quick Conversion
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Troy Ounces</div>
                <div className="text-xl font-bold">{(results.totalNeeded / 31.1035).toFixed(3)} ozt</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl">
                <div className="text-[10px] text-slate-400 uppercase font-bold">Pennyweights</div>
                <div className="text-xl font-bold">{(results.totalNeeded / 1.555).toFixed(2)} dwt</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
