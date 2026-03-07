import React, { useState } from 'react';
import { STONE_TYPES, STONE_SHAPES } from '../constants';
import { Scale, Ruler, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function WeightEstimator() {
  const [stoneType, setStoneType] = useState(STONE_TYPES[0]);
  const [shape, setShape] = useState(STONE_SHAPES[0]);
  const [length, setLength] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [depth, setDepth] = useState<number>(0);
  const [girdle, setGirdle] = useState<number>(0); // Girdle correction %

  // Formula: L * W * D * Multiplier * Density * (1 + Girdle/100)
  const estimatedWeight = length * width * depth * shape.multiplier * stoneType.density * (1 + girdle / 100);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Stone Weight Estimator</h2>
        <p className="text-slate-500">Professional estimation based on dimensions and density</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Stone Type</label>
              <select 
                onChange={(e) => setStoneType(STONE_TYPES.find(s => s.name === e.target.value) || STONE_TYPES[0])}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {STONE_TYPES.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Shape</label>
              <select 
                onChange={(e) => setShape(STONE_SHAPES.find(s => s.name === e.target.value) || STONE_SHAPES[0])}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {STONE_SHAPES.map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Length (mm)</label>
              <input 
                type="number"
                value={length || ''}
                onChange={(e) => setLength(Number(e.target.value))}
                placeholder="0.0"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Width (mm)</label>
              <input 
                type="number"
                value={width || ''}
                onChange={(e) => setWidth(Number(e.target.value))}
                placeholder="0.0"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700">Depth (mm)</label>
              <input 
                type="number"
                value={depth || ''}
                onChange={(e) => setDepth(Number(e.target.value))}
                placeholder="0.0"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-semibold text-slate-700">Girdle Correction (%)</label>
              <span className="text-xs text-slate-400">Extra thickness adjustment</span>
            </div>
            <input 
              type="range"
              min="0"
              max="10"
              step="0.5"
              value={girdle}
              onChange={(e) => setGirdle(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>Thin (0%)</span>
              <span>{girdle}%</span>
              <span>Thick (10%)</span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <motion.div 
            layout
            className="bg-blue-600 p-10 rounded-3xl text-white flex flex-col items-center justify-center text-center shadow-xl shadow-blue-100"
          >
            <Scale className="w-12 h-12 mb-6 opacity-80" />
            <span className="text-blue-200 uppercase text-xs font-bold tracking-widest mb-2">Estimated Carat Weight</span>
            <div className="text-6xl font-black mb-2">
              {estimatedWeight.toFixed(2)}
              <span className="text-2xl font-medium ml-2">ct</span>
            </div>
            <p className="text-blue-100 text-sm max-w-[200px]">
              Based on {stoneType.name} density ({stoneType.density}) and {shape.name} geometry.
            </p>
          </motion.div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              Formula Details
            </h3>
            <div className="text-sm text-slate-500 space-y-2">
              <p>Weight = L × W × D × Multiplier × Density</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Shape Multiplier: {shape.multiplier}</li>
                <li>Specific Gravity: {stoneType.density}</li>
                <li>Girdle Factor: {1 + girdle/100}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
