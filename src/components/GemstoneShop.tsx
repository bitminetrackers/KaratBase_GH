import React, { useState, useEffect } from 'react';
import { Search, Filter, ShoppingCart, Star, ShieldCheck, Truck, Gem, ArrowRight, Plus, X, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp, handleFirestoreError, OperationType } from '../contexts/AppContext';
import { db } from '../firebase';
import { collection, onSnapshot, query, addDoc, serverTimestamp } from 'firebase/firestore';

interface Gemstone {
  id: string;
  name: string;
  type: string;
  carat: number;
  cut: string;
  price: number;
  image: string;
  certified: boolean;
  origin: string;
  stock: number;
  color?: string;
  clarity?: string;
}

export default function GemstoneShop() {
  const { user } = useApp();
  const [gemstones, setGemstones] = useState<Gemstone[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const [newStone, setNewStone] = useState({
    name: '',
    type: 'Diamond',
    carat: 0,
    cut: 'Round',
    price: 0,
    image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=400',
    certified: true,
    origin: 'Unknown',
    stock: 1,
    color: '',
    clarity: ''
  });

  useEffect(() => {
    const q = query(collection(db, 'gemstones'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const stones = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Gemstone[];
      setGemstones(stones);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'gemstones');
    });

    return () => unsubscribe();
  }, []);

  const handleAddStone = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'gemstones'), {
        ...newStone,
        createdAt: serverTimestamp()
      });
      setIsAdding(false);
      setNewStone({
        name: '',
        type: 'Diamond',
        carat: 0,
        cut: 'Round',
        price: 0,
        image: 'https://images.unsplash.com/photo-1551028150-64b9f398f678?auto=format&fit=crop&q=80&w=400',
        certified: true,
        origin: 'Unknown',
        stock: 1,
        color: '',
        clarity: ''
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'gemstones');
    }
  };

  const filteredStones = gemstones.filter(stone => {
    const matchesSearch = stone.name.toLowerCase().includes(search.toLowerCase()) || 
                         stone.type.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === 'All' || stone.type === filter;
    return matchesSearch && matchesFilter;
  });

  const handleCheckout = (stone: Gemstone) => {
    alert(`Redirecting to Stripe Checkout for ${stone.name} ($${stone.price})`);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 dark:from-white dark:via-slate-200 dark:to-white">
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
              className="pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-all w-64 text-slate-900 dark:text-white"
            />
          </div>
          {user?.role === 'admin' && (
            <button 
              onClick={() => setIsAdding(true)}
              className="p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 px-4 font-bold text-sm"
            >
              <Plus className="w-4 h-4" />
              Add Stone
            </button>
          )}
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {['All', 'Diamond', 'Sapphire', 'Emerald', 'Ruby', 'Tanzanite'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              filter === f 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none' 
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:border-indigo-300'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStones.map((stone, i) => (
          <motion.div 
            layout
            key={stone.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all duration-500"
          >
            <div className="relative h-64 overflow-hidden">
              <img 
                src={stone.image} 
                alt={stone.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                {stone.type}
              </div>
              {stone.certified && (
                <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  GIA Certified
                </div>
              )}
            </div>
            
            <div className="p-8 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">{stone.name}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stone.cut} • {stone.carat} Carat</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${stone.price.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Free Shipping</div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3 h-3 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <button 
                  onClick={() => handleCheckout(stone)}
                  className="bg-slate-900 dark:bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-800 dark:hover:bg-indigo-700 transition-all flex items-center gap-2 group/btn"
                >
                  <Zap className="w-4 h-4 fill-current" />
                  Buy with Stripe
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white">Add New Gemstone</h3>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
              <form onSubmit={handleAddStone} className="p-8 space-y-4 max-h-[70vh] overflow-y-auto scrollbar-hide">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Name</label>
                    <input 
                      type="text" 
                      required
                      value={newStone.name}
                      onChange={e => setNewStone({...newStone, name: e.target.value})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Type</label>
                    <select 
                      value={newStone.type}
                      onChange={e => setNewStone({...newStone, type: e.target.value})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    >
                      {['Diamond', 'Sapphire', 'Emerald', 'Ruby', 'Tanzanite'].map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Carat</label>
                    <input 
                      type="number" 
                      step="0.01"
                      required
                      value={newStone.carat}
                      onChange={e => setNewStone({...newStone, carat: Number(e.target.value)})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Price ($)</label>
                    <input 
                      type="number" 
                      required
                      value={newStone.price}
                      onChange={e => setNewStone({...newStone, price: Number(e.target.value)})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Cut</label>
                    <input 
                      type="text" 
                      value={newStone.cut}
                      onChange={e => setNewStone({...newStone, cut: e.target.value})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Origin</label>
                    <input 
                      type="text" 
                      value={newStone.origin}
                      onChange={e => setNewStone({...newStone, origin: e.target.value})}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Image URL</label>
                  <input 
                    type="text" 
                    value={newStone.image}
                    onChange={e => setNewStone({...newStone, image: e.target.value})}
                    className="w-full p-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-none mt-4"
                >
                  Create Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">GIA Certified</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Every stone includes a certificate.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center">
            <Gem className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Ethically Sourced</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Conflict-free and tracked.</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/30 rounded-2xl flex items-center justify-center">
            <Truck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white">Fast Shipping</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">Insured delivery in 3-5 days.</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-700 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl shadow-indigo-500/20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="relative z-10 max-w-2xl">
          <h3 className="text-3xl font-black mb-4">Sell Your Gemstones</h3>
          <p className="text-indigo-100 mb-8 leading-relaxed">
            Are you a miner or a wholesaler? Join KaratBase's verified marketplace and reach thousands of professional jewelers worldwide.
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-indigo-50 transition-colors flex items-center gap-2 shadow-lg">
            Apply as Vendor
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
