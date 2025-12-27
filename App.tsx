
import React, { useState, useEffect } from 'react';
import { NumberSystem, CalculationResult } from './types';
import { convert } from './utils/converters';
import { binaryAdd, binarySub, getTwosComplement } from './utils/arithmetic';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'convert' | 'math' | 'twos'>('convert');
  
  // State for Converter
  const [inputValue, setInputValue] = useState('');
  const [fromBase, setFromBase] = useState<NumberSystem>(NumberSystem.DECIMAL);
  const [toBase, setToBase] = useState<NumberSystem>(NumberSystem.BINARY);
  
  // State for Math
  const [mathA, setMathA] = useState('');
  const [mathB, setMathB] = useState('');
  const [mathOp, setMathOp] = useState<'add' | 'sub'>('add');

  // State for 2s Complement
  const [twosInput, setTwosInput] = useState('');
  const [bitMode, setBitMode] = useState<8 | 16>(8);

  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleConvert = () => {
    if (!inputValue) return;
    try {
      const res = convert(inputValue, fromBase, toBase);
      setResult(res);
    } catch (e) {
      alert('ভুল ইনপুট! সঠিক সংখ্যা প্রদান করুন।');
    }
  };

  const handleMath = () => {
    if (!mathA || !mathB) return;
    try {
      const res = mathOp === 'add' ? binaryAdd(mathA, mathB) : binarySub(mathA, mathB);
      setResult(res);
    } catch (e) {
      alert('ভুল বাইনারি ইনপুট!');
    }
  };

  const handleTwos = () => {
    const val = parseInt(twosInput);
    if (isNaN(val)) return;
    const res = getTwosComplement(val, bitMode);
    setResult(res);
  };

  useEffect(() => {
    setResult(null);
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 selection:bg-blue-500/30">
      <header className="max-w-4xl mx-auto mb-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400 bg-clip-text text-transparent mb-4">
          Advanced ICT Number System
        </h1>
        <p className="text-lg text-slate-400 font-medium">সংখ্যা পদ্ধতির রূপান্তর ও গাণিতিক সমস্যার আধুনিক সমাধান</p>
      </header>

      <main className="max-w-4xl mx-auto bg-slate-900/40 backdrop-blur-md border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60">
          <button 
            onClick={() => setActiveTab('convert')}
            className={`flex-1 py-5 text-base font-bold transition-all duration-300 ${activeTab === 'convert' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
          >
            রূপান্তর (Converter)
          </button>
          <button 
            onClick={() => setActiveTab('math')}
            className={`flex-1 py-5 text-base font-bold transition-all duration-300 ${activeTab === 'math' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
          >
            বাইনারি গণিত
          </button>
          <button 
            onClick={() => setActiveTab('twos')}
            className={`flex-1 py-5 text-base font-bold transition-all duration-300 ${activeTab === 'twos' ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-400/5' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
          >
            ২-এর পরিপূরক
          </button>
        </div>

        <div className="p-8">
          {activeTab === 'convert' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">ইনপুট মান</label>
                  <input 
                    type="text" 
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="যেমন: 25.5"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder:text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">থেকে (From)</label>
                  <select 
                    value={fromBase}
                    onChange={(e) => setFromBase(e.target.value as NumberSystem)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value={NumberSystem.DECIMAL}>ডেসিমেল (১০)</option>
                    <option value={NumberSystem.BINARY}>বাইনারি (২)</option>
                    <option value={NumberSystem.OCTAL}>অক্টাল (৮)</option>
                    <option value={NumberSystem.HEXADECIMAL}>হেক্সাডেসিমেল (১৬)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">পর্যন্ত (To)</label>
                  <select 
                    value={toBase}
                    onChange={(e) => setToBase(e.target.value as NumberSystem)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value={NumberSystem.BINARY}>বাইনারি (২)</option>
                    <option value={NumberSystem.OCTAL}>অক্টাল (৮)</option>
                    <option value={NumberSystem.DECIMAL}>ডেসিমেল (১০)</option>
                    <option value={NumberSystem.HEXADECIMAL}>হেক্সাডেসিমেল (১৬)</option>
                  </select>
                </div>
              </div>
              <button 
                onClick={handleConvert}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-900/20 active:scale-[0.98] text-lg"
              >
                রূপান্তর করো
              </button>
            </div>
          )}

          {activeTab === 'math' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">প্রথম বাইনারি সংখ্যা</label>
                  <input 
                    type="text" 
                    value={mathA}
                    onChange={(e) => setMathA(e.target.value)}
                    placeholder="যেমন: 1010"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">দ্বিতীয় বাইনারি সংখ্যা</label>
                  <input 
                    type="text" 
                    value={mathB}
                    onChange={(e) => setMathB(e.target.value)}
                    placeholder="যেমন: 1101"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-700"
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setMathOp('add')}
                  className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all text-lg ${mathOp === 'add' ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/20' : 'border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                >
                  যোগ (+)
                </button>
                <button 
                  onClick={() => setMathOp('sub')}
                  className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all text-lg ${mathOp === 'sub' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/20' : 'border-slate-800 text-slate-500 hover:bg-slate-800 hover:text-slate-300'}`}
                >
                  বিয়োগ (-)
                </button>
              </div>
              <button 
                onClick={handleMath}
                className="w-full bg-white text-slate-950 hover:bg-slate-100 font-bold py-4 rounded-2xl transition-all shadow-xl active:scale-[0.98] text-lg"
              >
                গণনা করো
              </button>
            </div>
          )}

          {activeTab === 'twos' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">ডেসিমেল সংখ্যা</label>
                  <input 
                    type="number" 
                    value={twosInput}
                    onChange={(e) => setTwosInput(e.target.value)}
                    placeholder="যেমন: -5 বা 12"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-4 text-white outline-none focus:ring-2 focus:ring-emerald-500 transition-all placeholder:text-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-400 mb-2">বিট মোড (Bit Register)</label>
                  <div className="flex gap-4">
                    <button 
                      onClick={() => setBitMode(8)}
                      className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${bitMode === 8 ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'border-slate-800 text-slate-500 hover:bg-slate-800'}`}
                    >
                      ৮-বিট
                    </button>
                    <button 
                      onClick={() => setBitMode(16)}
                      className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${bitMode === 16 ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/20' : 'border-slate-800 text-slate-500 hover:bg-slate-800'}`}
                    >
                      ১৬-বিট
                    </button>
                  </div>
                </div>
              </div>
              <button 
                onClick={handleTwos}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-xl active:scale-[0.98] text-lg"
              >
                ২-এর পরিপূরক নির্ণয় করো
              </button>
            </div>
          )}
        </div>

        {/* Result Area */}
        {result && (
          <div className="border-t border-slate-800 p-8 bg-slate-900/90 animate-in fade-in slide-in-from-bottom-6 duration-500">
            <h2 className="text-2xl font-bold mb-6 text-blue-400 border-b border-blue-900/30 pb-2 inline-block">
              সমাধান প্রক্রিয়া (Step-by-step)
            </h2>
            
            <div className="space-y-8">
              {result.steps.map((step, idx) => (
                <div key={idx} className="relative pl-8 border-l-2 border-slate-800">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></div>
                  <h3 className="text-sm font-bold text-blue-400/80 mb-3 uppercase tracking-widest">{step.title}</h3>
                  <div className="text-slate-200 bg-slate-950/40 p-5 rounded-2xl border border-slate-800/50 shadow-inner">
                    {step.content}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 p-8 bg-gradient-to-br from-slate-950 to-slate-900 rounded-3xl border border-blue-900/40 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-colors"></div>
              <p className="text-xs font-bold uppercase text-slate-500 mb-2 tracking-[0.2em]">ফাইনাল রেজাল্ট:</p>
              <div className="text-4xl md:text-5xl font-mono font-bold text-white break-all drop-shadow-sm">
                {result.finalResult}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="max-w-4xl mx-auto mt-12 text-center text-slate-500 text-sm font-medium pb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="w-8 h-[1px] bg-slate-800"></div>
          <p>ICT Number System Software</p>
          <div className="w-8 h-[1px] bg-slate-800"></div>
        </div>
        <p className="opacity-60">&copy; {new Date().getFullYear()} Advanced ICT System - Built for Quality HSC ICT Education</p>
      </footer>
    </div>
  );
};

export default App;
