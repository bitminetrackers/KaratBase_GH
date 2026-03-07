import React, { useState } from 'react';
import { RING_SIZES, RING_STYLES } from '../constants';
import { Ruler, Circle, Info, Layers } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export default function RingBlankCalculator() {
  const [size, setSize] = useState('7');
  const [style, setStyle] = useState(RING_STYLES[0]);
  const [thickness, setThickness] = useState(1.5);
  const [width, setWidth] = useState(4);
  const [metalDensity, setMetalDensity] = useState(13.5); // 14K Gold approx

  // Formula for ring blank length: (Size Diameter + Thickness) * PI
  // Size 7 diameter is approx 17.3mm. Each half size is approx 0.4mm
  const baseDiameter = 12.5 + (Number(size) * 0.8); // Simplified mapping
  const blankLength = (baseDiameter + thickness) * Math.PI;
  
  // Weight = Length * Width * Thickness * Density / 1000 (if mm)
  const estimatedWeight = (blankLength * width * thickness * metalDensity) / 1000;

  // Scaling for visualization
  const maxDim = Math.max(blankLength, width * 5); // Width is usually much smaller, so we scale it up for visibility
  const scale = 160 / maxDim;
  const displayLength = blankLength * scale;
  const displayWidth = width * scale;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent">Ring Blank Calculator</h2>
        <p className="text-slate-500 dark:text-slate-400">Determine stock size and metal requirements for bands</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-8 h-fit">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Ring Size (US)</label>
                <select 
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-slate-900 dark:text-white"
                >
                  {RING_SIZES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Band Style</label>
                <select 
                  onChange={(e) => setStyle(RING_STYLES.find(s => s.name === e.target.value) || RING_STYLES[0])}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-slate-900 dark:text-white"
                >
                  {RING_STYLES.map(s => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Thickness (mm)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={thickness}
                  onChange={(e) => setThickness(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Width (mm)</label>
                <input 
                  type="number"
                  step="0.1"
                  value={width}
                  onChange={(e) => setWidth(Number(e.target.value))}
                  className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Metal Density (g/cm³)</label>
              <select 
                onChange={(e) => setMetalDensity(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none text-slate-900 dark:text-white"
              >
                <option value="13.5">14K Gold (~13.5)</option>
                <option value="15.5">18K Gold (~15.5)</option>
                <option value="10.5">Sterling Silver (~10.5)</option>
                <option value="21.5">Platinum (~21.5)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center space-y-4">
            <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Visual Reference</div>
            <div className="relative w-full h-32 flex items-center justify-center">
              <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-sm transition-all duration-500">
                {/* Ring Blank Rectangle */}
                <rect 
                  x={100 - (displayLength / 2)} 
                  y={50 - (displayWidth / 2)} 
                  width={displayLength} 
                  height={displayWidth} 
                  fill="#f43f5e" 
                  fillOpacity="0.1"
                  stroke="#f43f5e"
                  strokeWidth="1"
                  rx="1"
                />
                {/* Length Label */}
                <line x1={100 - (displayLength / 2)} y1="35" x2={100 + (displayLength / 2)} y2="35" stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />
                <text x="100" y="30" textAnchor="middle" fontSize="6" fill="#64748b" className="dark:fill-slate-400" fontWeight="bold">{blankLength.toFixed(1)}mm</text>
                
                {/* Width Label */}
                <line x1={100 + (displayLength / 2) + 10} y1={50 - (displayWidth / 2)} x2={100 + (displayLength / 2) + 10} y2={50 + (displayWidth / 2)} stroke="#94a3b8" strokeWidth="0.5" strokeDasharray="2 2" />
                <text x={100 + (displayLength / 2) + 15} y="52" textAnchor="start" fontSize="6" fill="#64748b" className="dark:fill-slate-400" fontWeight="bold">{width.toFixed(1)}mm</text>
              </svg>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 text-center italic">Scale is relative to dimensions</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-rose-600 to-orange-600 p-8 rounded-3xl text-white space-y-8 shadow-xl shadow-rose-100 dark:shadow-none">
            <h3 className="text-rose-200 font-bold uppercase text-xs tracking-widest">Stock Specifications</h3>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Ruler className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-rose-200 uppercase font-bold">Cut Length</div>
                  <div className="text-3xl font-black">{blankLength.toFixed(2)}mm</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                  <Layers className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-rose-200 uppercase font-bold">Estimated Weight</div>
                  <div className="text-3xl font-black">{estimatedWeight.toFixed(2)}g</div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="flex items-center gap-3 text-rose-100 text-sm italic">
                  <Circle className="w-4 h-4" />
                  Recommended stock: {width}mm x {thickness}mm {style.name} wire
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-500" />
              Bench Note
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Calculations include a small allowance for the seam. For {style.name} bands, consider adding 0.5mm to the length if the stock is particularly thick to account for the outside diameter stretch.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
