import React, { useState, useMemo } from 'react';
import { Calculator, Layout, Maximize2, Settings2, Info, Grid3X3, ArrowRight, Circle, Square, Minus } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

type StoneCut = 'round' | 'princess' | 'oval' | 'baguette';
type ArrangementShape = 'linear' | 'grid' | 'circular';

export default function StoneSettingVisualizer() {
  const [bandWidth, setBandWidth] = useState<number>(6);
  const [bandLength, setBandLength] = useState<number>(40);
  const [stoneSize, setStoneSize] = useState<number>(2);
  const [spacing, setSpacing] = useState<number>(0.5);
  const [marginSide, setMarginSide] = useState<number>(1);
  const [marginUpper, setMarginUpper] = useState<number>(1);
  const [settingType, setSettingType] = useState<'channel' | 'pave' | 'bezel'>('channel');
  const [stoneCut, setStoneCut] = useState<StoneCut>('round');
  const [arrangement, setArrangement] = useState<ArrangementShape>('linear');

  const layout = useMemo(() => {
    const stones: { x: number; y: number; size: number; width: number; height: number }[] = [];
    
    // Dimensions for different cuts
    let sWidth = stoneSize;
    let sHeight = stoneSize;
    if (stoneCut === 'oval') sWidth = stoneSize * 1.4;
    if (stoneCut === 'baguette') sWidth = stoneSize * 1.8;

    if (arrangement === 'linear') {
      const step = sWidth + spacing;
      const availableLength = bandLength - (marginSide * 2);
      const count = Math.floor((availableLength + spacing) / step);
      
      // Centering logic
      const totalStonesLength = count * sWidth + (count - 1) * spacing;
      const startX = (bandLength - totalStonesLength) / 2 + sWidth / 2;
      
      for (let i = 0; i < count; i++) {
        stones.push({
          x: startX + i * step,
          y: bandWidth / 2,
          size: stoneSize,
          width: sWidth,
          height: sHeight
        });
      }
    } else if (arrangement === 'grid') {
      const stepX = sWidth + spacing;
      const stepY = sHeight + spacing;
      const availableLength = bandLength - (marginSide * 2);
      const availableWidth = bandWidth - (marginUpper * 2);
      
      const countX = Math.floor((availableLength + spacing) / stepX);
      const countY = Math.floor((availableWidth + spacing) / stepY);
      
      const totalWidthX = countX * sWidth + (countX - 1) * spacing;
      const totalWidthY = countY * sHeight + (countY - 1) * spacing;
      
      const startX = (bandLength - totalWidthX) / 2 + sWidth / 2;
      const startY = (bandWidth - totalWidthY) / 2 + sHeight / 2;
      
      for (let ix = 0; ix < countX; ix++) {
        for (let iy = 0; iy < countY; iy++) {
          stones.push({
            x: startX + ix * stepX,
            y: startY + iy * stepY,
            size: stoneSize,
            width: sWidth,
            height: sHeight
          });
        }
      }
    } else if (arrangement === 'circular') {
      const radius = (Math.min(bandWidth - (marginUpper * 2), bandLength - (marginSide * 2)) / 2) - (stoneSize / 2);
      const circumference = 2 * Math.PI * radius;
      const step = sWidth + spacing;
      const count = Math.floor(circumference / step);
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 2 * Math.PI;
        stones.push({
          x: bandLength / 2 + radius * Math.cos(angle),
          y: bandWidth / 2 + radius * Math.sin(angle),
          size: stoneSize,
          width: sWidth,
          height: sHeight
        });
      }
    }

    return stones;
  }, [bandWidth, bandLength, stoneSize, spacing, marginSide, marginUpper, stoneCut, arrangement]);

  const GridBackground = () => (
    <div className="absolute inset-0 pointer-events-none opacity-10 overflow-hidden">
      <div 
        className="w-full h-full" 
        style={{ 
          backgroundImage: `radial-gradient(circle, #94a3b8 1px, transparent 1px)`,
          backgroundSize: '10px 10px'
        }} 
      />
    </div>
  );

  const ProtractorBackground = () => (
    <div className="absolute inset-0 pointer-events-none opacity-20 flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(angle => (
          <div 
            key={angle}
            className="absolute h-full w-px bg-slate-500 origin-center"
            style={{ transform: `rotate(${angle}deg)` }}
          />
        ))}
        {[1, 2, 3, 4, 5].map(i => (
          <div 
            key={i}
            className="absolute border border-slate-500 rounded-full"
            style={{ 
              width: `${i * 80}px`, 
              height: `${i * 80}px`,
              opacity: 1 - (i * 0.15)
            }}
          />
        ))}
      </div>
    </div>
  );

  const getStoneStyle = (cut: StoneCut) => {
    switch (cut) {
      case 'round': return 'rounded-full';
      case 'princess': return 'rounded-sm';
      case 'oval': return 'rounded-[50%]';
      case 'baguette': return 'rounded-sm';
      default: return 'rounded-full';
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400">
            Stone Setting Visualizer
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Plan spacing and layout for professional jewelry settings.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
            <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Settings2 className="w-5 h-5 text-emerald-500" />
              Layout Controls
            </h3>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Arrangement</label>
              <div className="grid grid-cols-3 gap-2">
                {(['linear', 'grid', 'circular'] as ArrangementShape[]).map((type) => (
                  <button
                    key={type}
                    onClick={() => setArrangement(type)}
                    className={cn(
                      "py-2 rounded-xl text-xs font-bold capitalize transition-all",
                      arrangement === type 
                        ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/20" 
                        : "bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Stone Cut</label>
              <div className="grid grid-cols-4 gap-2">
                {(['round', 'princess', 'oval', 'baguette'] as StoneCut[]).map((cut) => (
                  <button
                    key={cut}
                    onClick={() => setStoneCut(cut)}
                    className={cn(
                      "py-2 rounded-xl text-[10px] font-bold capitalize transition-all border",
                      stoneCut === cut 
                        ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400" 
                        : "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-slate-200 dark:hover:border-slate-700"
                    )}
                  >
                    {cut}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Stone Size (mm)</label>
              <input 
                type="range" min="1" max="10" step="0.1"
                value={stoneSize} onChange={(e) => setStoneSize(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>1mm</span>
                <span className="text-emerald-600 dark:text-emerald-400">{stoneSize}mm</span>
                <span>10mm</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Stone Spacing (mm)</label>
              <input 
                type="range" min="0" max="2" step="0.05"
                value={spacing} onChange={(e) => setSpacing(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>0mm</span>
                <span className="text-emerald-600 dark:text-emerald-400">{spacing}mm</span>
                <span>2mm</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Side Margin (mm)</label>
              <input 
                type="range" min="0" max="5" step="0.1"
                value={marginSide} onChange={(e) => setMarginSide(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>0mm</span>
                <span className="text-emerald-600 dark:text-emerald-400">{marginSide}mm</span>
                <span>5mm</span>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">Upper/Lower Margin (mm)</label>
              <input 
                type="range" min="0" max="5" step="0.1"
                value={marginUpper} onChange={(e) => setMarginUpper(Number(e.target.value))}
                className="w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              />
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>0mm</span>
                <span className="text-emerald-600 dark:text-emerald-400">{marginUpper}mm</span>
                <span>5mm</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Total Width</label>
                <input 
                  type="number" value={bandWidth} onChange={(e) => setBandWidth(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase">Total Length</label>
                <input 
                  type="number" value={bandLength} onChange={(e) => setBandLength(Number(e.target.value))}
                  className="w-full p-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 p-6 rounded-3xl text-white shadow-xl shadow-emerald-900/10">
            <div className="flex justify-between items-center mb-4">
              <div className="text-xs font-bold uppercase tracking-widest opacity-70">Layout Summary</div>
              <Layout className="w-4 h-4 opacity-70" />
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex-1 flex justify-between items-end">
                <span className="text-sm">Total Stones</span>
                <span className="text-3xl font-black">{layout.length}</span>
              </div>
              <div className="hidden md:block w-px bg-white/20 self-stretch" />
              <div className="flex-1 flex justify-between items-end">
                <span className="text-sm">Total Carat (Est.)</span>
                <span className="text-xl font-bold">{(layout.length * (Math.pow(stoneSize, 3) * 0.006)).toFixed(2)}ct</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 dark:bg-black p-12 rounded-[40px] shadow-2xl min-h-[500px] flex items-center justify-center overflow-hidden relative border border-slate-800">
            <div className="absolute top-6 left-6 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              <Maximize2 className="w-3 h-3" />
              Interactive Preview (Top View)
            </div>

            {arrangement === 'circular' ? <ProtractorBackground /> : <GridBackground />}
            
            <div 
              className="bg-slate-800 dark:bg-slate-900 rounded-sm relative shadow-inner border border-slate-700 transition-all duration-500 z-10"
              style={{ 
                width: `${bandLength * 10}px`, 
                height: `${bandWidth * 10}px`,
                maxWidth: '100%',
                maxHeight: '400px'
              }}
            >
              {/* Margin Indicators */}
              <div 
                className="absolute border border-dashed border-slate-600/30 pointer-events-none" 
                style={{ 
                  left: `${marginSide * 10}px`,
                  right: `${marginSide * 10}px`,
                  top: `${marginUpper * 10}px`,
                  bottom: `${marginUpper * 10}px`
                }} 
              />
              
              {/* Dimension Labels */}
              {layout.length > 0 && (
                <>
                  {/* Left Margin Label */}
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 flex flex-col items-center" style={{ width: `${marginSide * 10}px` }}>
                    <div className="h-px w-full bg-slate-600" />
                    <span className="text-[8px] text-slate-500 mt-1">{marginSide}mm</span>
                  </div>
                  {/* Top Margin Label */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center" style={{ height: `${marginUpper * 10}px` }}>
                    <div className="w-px h-full bg-slate-600" />
                    <span className="text-[8px] text-slate-500 ml-2">{marginUpper}mm</span>
                  </div>
                  {/* Spacing Label (between first two) */}
                  {layout.length > 1 && (
                    <div 
                      className="absolute top-0 flex flex-col items-center" 
                      style={{ 
                        left: `${(layout[0].x + layout[1].x) * 5 - (spacing * 5)}px`,
                        width: `${spacing * 10}px`
                      }}
                    >
                      <div className="h-px w-full bg-emerald-500/30" />
                      <span className="text-[8px] text-emerald-500/50 mt-1">{spacing}mm</span>
                    </div>
                  )}
                </>
              )}

              {layout.map((stone, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.005 }}
                  className={cn(
                    "absolute bg-gradient-to-br from-white to-emerald-100 shadow-[0_0_10px_rgba(255,255,255,0.3)] border border-white/20",
                    getStoneStyle(stoneCut)
                  )}
                  style={{
                    width: `${stone.width * 10}px`,
                    height: `${stone.height * 10}px`,
                    left: `${stone.x * 10 - (stone.width * 5)}px`,
                    top: `${stone.y * 10 - (stone.height * 5)}px`
                  }}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                <Grid3X3 className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Precision Centering</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Stones are automatically distributed to maintain equal margins on all sides.</p>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start gap-4 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                <Info className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-sm">Cut Considerations</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Oval and Baguette cuts require careful orientation. Ensure your channel width matches the stone's short axis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
