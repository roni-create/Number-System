
import React from 'react';
import { NumberSystem, CalculationResult, Step } from '../types';

const getBaseName = (base: string) => {
  switch (base) {
    case '2': return 'বাইনারি';
    case '8': return 'অক্টাল';
    case '10': return 'ডেসিমেল';
    case '16': return 'হেক্সাডেসিমেল';
    default: return '';
  }
};

const hexToBinMap: any = { '0': '0000', '1': '0001', '2': '0010', '3': '0011', '4': '0100', '5': '0101', '6': '0110', '7': '0111', '8': '1000', '9': '1001', 'A': '1010', 'B': '1011', 'C': '1100', 'D': '1101', 'E': '1110', 'F': '1111' };
const octToBinMap: any = { '0': '000', '1': '001', '2': '010', '3': '011', '4': '100', '5': '101', '6': '110', '7': '111' };
const binToOctMap: any = { '000': '0', '001': '1', '010': '2', '011': '3', '100': '4', '101': '5', '110': '6', '111': '7' };
const binToHexMap: any = { '0000': '0', '0001': '1', '0010': '2', '0011': '3', '0100': '4', '0101': '5', '0110': '6', '0111': '7', '1000': '8', '1001': '9', '1010': 'A', '1011': 'B', '1100': 'C', '1101': 'D', '1110': 'E', '1111': 'F' };

export const decimalToOther = (value: string, targetBase: number): CalculationResult => {
  const steps: Step[] = [];
  const parts = value.split('.');
  const integerPart = parseInt(parts[0]);
  const fractionalPart = parts[1] ? parseFloat('0.' + parts[1]) : 0;

  // Integer Conversion
  let tempVajjo = integerPart;
  const intResults: string[] = [];
  const intRows: any[] = [];

  while (tempVajjo > 0) {
    const vagshesh = tempVajjo % targetBase;
    const quotient = Math.floor(tempVajjo / targetBase);
    const vagsheshStr = targetBase === 16 ? vagshesh.toString(16).toUpperCase() : vagshesh.toString();
    
    intRows.push({
      vajok: targetBase,
      vajjo: tempVajjo,
      vagshesh: vagsheshStr
    });
    intResults.push(vagsheshStr);
    tempVajjo = quotient;
  }
  
  if (integerPart === 0) intResults.push('0');

  const intStepsContent = (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left border-collapse border border-slate-700 mt-2">
        <thead className="bg-slate-800">
          <tr>
            <th className="p-2 border border-slate-700">ভাজক</th>
            <th className="p-2 border border-slate-700">ভাজ্য</th>
            <th className="p-2 border border-slate-700">ভাগশেষ</th>
          </tr>
        </thead>
        <tbody>
          {intRows.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-800/50">
              <td className="p-2 border border-slate-700">{row.vajok}</td>
              <td className="p-2 border border-slate-700">{row.vajjo}</td>
              <td className="p-2 border border-slate-700">{row.vagshesh} {idx === 0 ? <span className="text-xs text-blue-400 font-bold ml-2">(LSB)</span> : idx === intRows.length - 1 ? <span className="text-xs text-red-400 font-bold ml-2">(MSB)</span> : ''}</td>
            </tr>
          ))}
          <tr className="bg-slate-800/30">
            <td className="p-2 border border-slate-700">{targetBase}</td>
            <td className="p-2 border border-slate-700">0</td>
            <td className="p-2 border border-slate-700">-</td>
          </tr>
        </tbody>
      </table>
    </div>
  );

  steps.push({ title: 'পূর্ণ সংখ্যার ভাগ প্রক্রিয়া', content: intStepsContent });

  let fracResultStr = '';
  if (fractionalPart > 0) {
    const fracRows: any[] = [];
    let tempFrac = fractionalPart;
    for (let i = 0; i < 5 && tempFrac > 0; i++) {
      const product = tempFrac * targetBase;
      const intBit = Math.floor(product);
      const intBitStr = targetBase === 16 ? intBit.toString(16).toUpperCase() : intBit.toString();
      fracRows.push({
        multi: `${tempFrac.toFixed(4)} × ${targetBase}`,
        integer: intBitStr,
        fraction: (product - intBit).toFixed(4)
      });
      fracResultStr += intBitStr;
      tempFrac = product - intBit;
    }

    const fracStepsContent = (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full text-left border-collapse border border-slate-700">
          <thead className="bg-slate-800">
            <tr>
              <th className="p-2 border border-slate-700">গুণফল (ভগ্ন অংশ × ভিত্তি)</th>
              <th className="p-2 border border-slate-700">পূর্ণ সংখ্যা</th>
              <th className="p-2 border border-slate-700">বাকি ভগ্নাংশ</th>
            </tr>
          </thead>
          <tbody>
            {fracRows.map((row, idx) => (
              <tr key={idx}>
                <td className="p-2 border border-slate-700">{row.multi}</td>
                <td className="p-2 border border-slate-700">{row.integer} {idx === 0 ? <span className="text-xs text-red-400 font-bold ml-2">(MSB)</span> : idx === fracRows.length - 1 ? <span className="text-xs text-blue-400 font-bold ml-2">(LSB)</span> : ''}</td>
                <td className="p-2 border border-slate-700">{row.fraction}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
    steps.push({ title: 'ভগ্নাংশের গুণ প্রক্রিয়া', content: fracStepsContent });
  }

  const resultStr = intResults.reverse().join('') + (fracResultStr ? '.' + fracResultStr : '');
  
  return { finalResult: resultStr, steps };
};

export const otherToDecimal = (value: string, fromBase: number): CalculationResult => {
  const steps: Step[] = [];
  const parts = value.split('.');
  const intPart = parts[0];
  const fracPart = parts[1] || '';

  let total = 0;
  const components: string[] = [];

  for (let i = 0; i < intPart.length; i++) {
    const digitValue = parseInt(intPart[intPart.length - 1 - i], fromBase);
    total += digitValue * Math.pow(fromBase, i);
    components.unshift(`(${intPart[intPart.length - 1 - i]} × ${fromBase}<sup>${i}</sup>)`);
  }

  for (let i = 0; i < fracPart.length; i++) {
    const digitValue = parseInt(fracPart[i], fromBase);
    total += digitValue * Math.pow(fromBase, -(i + 1));
    components.push(`(${fracPart[i]} × ${fromBase}<sup>-${i + 1}</sup>)`);
  }

  steps.push({
    title: 'পাওয়ার ক্যালকুলেশন',
    content: (
      <div className="bg-slate-900 p-4 rounded-md font-mono text-sm overflow-x-auto border border-slate-800">
        <div className="text-blue-300 mb-2" dangerouslySetInnerHTML={{ __html: components.join(' + ') }} />
        <div className="text-white pt-2 border-t border-slate-700 font-bold">= {total}</div>
      </div>
    )
  });

  return { finalResult: total.toString(), steps };
};

export const convert = (value: string, from: NumberSystem, to: NumberSystem): CalculationResult => {
  if (from === NumberSystem.DECIMAL) return decimalToOther(value, parseInt(to));
  if (to === NumberSystem.DECIMAL) return otherToDecimal(value, parseInt(from));

  // Shortcut for Octal to Hexadecimal (Octal -> 3-bit Binary -> 4-bit Regroup -> Hex)
  if (from === NumberSystem.OCTAL && to === NumberSystem.HEXADECIMAL) {
    const steps: Step[] = [];
    const val = value.toUpperCase();
    const parts = val.split('.');
    const intPart = parts[0];
    const fracPart = parts[1] || '';

    // Step 1: Octal to 3-bit Binary
    const intBinaryParts = intPart.split('').map(char => octToBinMap[char] || '000');
    const fracBinaryParts = fracPart.split('').map(char => octToBinMap[char] || '000');

    steps.push({
      title: 'ধাপ ১: অক্টাল থেকে ৩-বিট বাইনারিতে রূপান্তর',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">প্রতিটি অক্টাল ডিজিটের সমতুল্য ৩-বিট বাইনারি মান নিচে বসানো হলো:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {intPart.split('').map((char, i) => (
              <div key={`oct-int-${i}`} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center hover:border-blue-500/40 transition-colors">
                <div className="text-white font-bold text-xl mb-1">{char}</div>
                <div className="text-blue-400 font-mono text-xs font-bold bg-slate-800 py-1 rounded">{octToBinMap[char]}</div>
              </div>
            ))}
            {fracPart && (
              <div className="col-span-full flex items-center justify-center py-2">
                <div className="text-4xl font-bold text-white">.</div>
              </div>
            )}
            {fracPart.split('').map((char, i) => (
              <div key={`oct-frac-${i}`} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center hover:border-blue-500/40 transition-colors">
                <div className="text-white font-bold text-xl mb-1">{char}</div>
                <div className="text-blue-400 font-mono text-xs font-bold bg-slate-800 py-1 rounded">{octToBinMap[char]}</div>
              </div>
            ))}
          </div>
        </div>
      )
    });

    // Step 2: Combine and Regroup for Hex (4-bit)
    const fullIntBin = intBinaryParts.join('');
    const fullFracBin = fracBinaryParts.join('');

    // Pad Integer (left)
    let paddedInt = fullIntBin;
    while (paddedInt.length % 4 !== 0) paddedInt = '0' + paddedInt;
    const intGroups = paddedInt.match(/.{1,4}/g) || [];

    // Pad Fraction (right)
    let paddedFrac = fullFracBin;
    if (paddedFrac) {
      while (paddedFrac.length % 4 !== 0) paddedFrac = paddedFrac + '0';
    }
    const fracGroups = paddedFrac ? paddedFrac.match(/.{1,4}/g) || [] : [];

    steps.push({
      title: 'ধাপ ২: বাইনারি বিটসমূহ ৪-বিট করে গ্রুপিং',
      content: (
        <div className="space-y-6">
          <p className="text-sm text-slate-400">হেক্সাডেসিমেলে রূপান্তরের জন্য বাইনারি বিটগুলোকে রেডিক্স পয়েন্ট (দশমিক) থেকে ৪-বিট করে গ্রুপ করা হলো:</p>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-center shadow-inner">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xl">
              {/* Integer side */}
              <div className="flex flex-col items-center">
                <div className="flex gap-2 text-emerald-400">
                  {intGroups.map((g, i) => (
                    <span key={`group-int-${i}`} className="px-2 bg-slate-900 rounded border border-slate-700/50 shadow-sm underline decoration-slate-700 underline-offset-4">
                      {g}
                    </span>
                  ))}
                </div>
                <div className="w-full text-right mt-2">
                   <span className="text-[10px] text-blue-500 font-bold">← পূর্ণ সংখ্যা গ্রুপিং (ডান থেকে বাম)</span>
                </div>
              </div>

              {fracPart && <span className="text-3xl font-bold text-white px-2">.</span>}

              {/* Fractional side */}
              {fracPart && (
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 text-emerald-400">
                    {fracGroups.map((g, i) => (
                      <span key={`group-frac-${i}`} className="px-2 bg-slate-900 rounded border border-slate-700/50 shadow-sm underline decoration-slate-700 underline-offset-4">
                        {g}
                      </span>
                    ))}
                  </div>
                  <div className="w-full text-left mt-2">
                     <span className="text-[10px] text-blue-500 font-bold">ভগ্নাংশ গ্রুপিং (বাম থেকে ডান) →</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    });

    // Step 3: Mapping to Hex
    const finalIntResult = intGroups.map(g => binToHexMap[g]).join('').replace(/^0+(?!$)/, '');
    const finalFracResult = fracGroups.map(g => binToHexMap[g]).join('');
    const finalResultStr = (finalIntResult || '0') + (finalFracResult ? '.' + finalFracResult : '');

    steps.push({
      title: 'ধাপ ৩: প্রতিটি ৪-বিট গ্রুপের সমতুল্য হেক্সাডেসিমেল মান',
      content: (
        <div className="flex flex-wrap gap-8 items-center justify-center p-6 bg-slate-800/20 rounded-2xl border border-slate-800">
          {intGroups.map((g, i) => (
            <div key={`map-int-${i}`} className="flex flex-col items-center group">
              <div className="text-xs font-mono text-slate-500 mb-1 group-hover:text-emerald-400 transition-colors">{g}</div>
              <div className="text-xl font-bold text-white leading-none mb-2">↓</div>
              <div className="text-3xl font-bold text-blue-400 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">{binToHexMap[g]}</div>
            </div>
          ))}
          {fracPart && <div className="text-5xl font-bold text-white self-end mb-2">.</div>}
          {fracGroups.map((g, i) => (
            <div key={`map-frac-${i}`} className="flex flex-col items-center group">
              <div className="text-xs font-mono text-slate-500 mb-1 group-hover:text-emerald-400 transition-colors">{g}</div>
              <div className="text-xl font-bold text-white leading-none mb-2">↓</div>
              <div className="text-3xl font-bold text-blue-400 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">{binToHexMap[g]}</div>
            </div>
          ))}
        </div>
      )
    });

    return { finalResult: finalResultStr, steps };
  }

  // Direct Hexadecimal to Octal Shortcut (Hex -> 4-bit Binary -> 3-bit Regrouping -> Octal)
  if (from === NumberSystem.HEXADECIMAL && to === NumberSystem.OCTAL) {
    const steps: Step[] = [];
    const val = value.toUpperCase();
    const parts = val.split('.');
    const intPart = parts[0];
    const fracPart = parts[1] || '';

    // Step 1: Hex to 4-bit Binary
    const intBinaryParts = intPart.split('').map(char => hexToBinMap[char] || '0000');
    const fracBinaryParts = fracPart.split('').map(char => hexToBinMap[char] || '0000');

    steps.push({
      title: 'ধাপ ১: হেক্সাডেসিমেল থেকে ৪-বিট বাইনারিতে রূপান্তর',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">হেক্সাডেসিমেল ডিজিটগুলোকে ৪-বিট বাইনারি রেজিস্টারে সাজানো হলো:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {intPart.split('').map((char, i) => (
              <div key={`hex-int-${i}`} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center hover:border-blue-500/40 transition-colors">
                <div className="text-white font-bold text-xl mb-1">{char}</div>
                <div className="text-blue-400 font-mono text-xs font-bold bg-slate-800 py-1 rounded">{hexToBinMap[char]}</div>
              </div>
            ))}
            {fracPart && (
              <div className="col-span-full flex items-center justify-center py-2">
                <div className="text-4xl font-bold text-white">.</div>
              </div>
            )}
            {fracPart.split('').map((char, i) => (
              <div key={`hex-frac-${i}`} className="bg-slate-900/50 p-3 rounded-xl border border-slate-800 text-center hover:border-blue-500/40 transition-colors">
                <div className="text-white font-bold text-xl mb-1">{char}</div>
                <div className="text-blue-400 font-mono text-xs font-bold bg-slate-800 py-1 rounded">{hexToBinMap[char]}</div>
              </div>
            ))}
          </div>
        </div>
      )
    });

    // Step 2: Combine and Regroup for Octal (3-bit)
    const fullIntBin = intBinaryParts.join('');
    const fullFracBin = fracBinaryParts.join('');

    // Pad Integer (left)
    let paddedInt = fullIntBin;
    while (paddedInt.length % 3 !== 0) paddedInt = '0' + paddedInt;
    const intGroups = paddedInt.match(/.{1,3}/g) || [];

    // Pad Fraction (right)
    let paddedFrac = fullFracBin;
    if (paddedFrac) {
      while (paddedFrac.length % 3 !== 0) paddedFrac = paddedFrac + '0';
    }
    const fracGroups = paddedFrac ? paddedFrac.match(/.{1,3}/g) || [] : [];

    steps.push({
      title: 'ধাপ ২: বাইনারি বিটসমূহ ৩-বিট করে গ্রুপিং',
      content: (
        <div className="space-y-6">
          <p className="text-sm text-slate-400">অক্টালে রূপান্তরের জন্য বাইনারি বিটগুলোকে রেডিক্স পয়েন্ট (দশমিক) থেকে ৩-বিট করে গ্রুপ করা হলো:</p>
          <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 font-mono text-center shadow-inner">
            <div className="flex flex-wrap items-center justify-center gap-4 text-xl">
              {/* Integer side */}
              <div className="flex flex-col items-center">
                <div className="flex gap-2 text-emerald-400">
                  {intGroups.map((g, i) => (
                    <span key={`group-int-${i}`} className="px-2 bg-slate-900 rounded border border-slate-700/50 shadow-sm underline decoration-slate-700 underline-offset-4">
                      {g}
                    </span>
                  ))}
                </div>
                <div className="w-full text-right mt-2">
                   <span className="text-[10px] text-blue-500 font-bold">← পূর্ণ সংখ্যা গ্রুপিং (ডান থেকে বাম)</span>
                </div>
              </div>

              {fracPart && <span className="text-3xl font-bold text-white px-2">.</span>}

              {/* Fractional side */}
              {fracPart && (
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 text-emerald-400">
                    {fracGroups.map((g, i) => (
                      <span key={`group-frac-${i}`} className="px-2 bg-slate-900 rounded border border-slate-700/50 shadow-sm underline decoration-slate-700 underline-offset-4">
                        {g}
                      </span>
                    ))}
                  </div>
                  <div className="w-full text-left mt-2">
                     <span className="text-[10px] text-blue-500 font-bold">ভগ্নাংশ গ্রুপিং (বাম থেকে ডান) →</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )
    });

    // Step 3: Mapping to Octal
    const finalIntResult = intGroups.map(g => binToOctMap[g]).join('').replace(/^0+(?!$)/, '');
    const finalFracResult = fracGroups.map(g => binToOctMap[g]).join('');
    const finalResultStr = (finalIntResult || '0') + (finalFracResult ? '.' + finalFracResult : '');

    steps.push({
      title: 'ধাপ ৩: প্রতিটি ৩-বিট গ্রুপের সমতুল্য অক্টাল মান',
      content: (
        <div className="flex flex-wrap gap-8 items-center justify-center p-6 bg-slate-800/20 rounded-2xl border border-slate-800">
          {intGroups.map((g, i) => (
            <div key={`map-int-${i}`} className="flex flex-col items-center group">
              <div className="text-xs font-mono text-slate-500 mb-1 group-hover:text-emerald-400 transition-colors">{g}</div>
              <div className="text-xl font-bold text-white leading-none mb-2">↓</div>
              <div className="text-3xl font-bold text-blue-400 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">{binToOctMap[g]}</div>
            </div>
          ))}
          {fracPart && <div className="text-5xl font-bold text-white self-end mb-2">.</div>}
          {fracGroups.map((g, i) => (
            <div key={`map-frac-${i}`} className="flex flex-col items-center group">
              <div className="text-xs font-mono text-slate-500 mb-1 group-hover:text-emerald-400 transition-colors">{g}</div>
              <div className="text-xl font-bold text-white leading-none mb-2">↓</div>
              <div className="text-3xl font-bold text-blue-400 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">{binToOctMap[g]}</div>
            </div>
          ))}
        </div>
      )
    });

    return { finalResult: finalResultStr, steps };
  }

  // Handle Binary to Octal Shortcut (Grouping logic)
  if (from === NumberSystem.BINARY && to === NumberSystem.OCTAL) {
    const groupSize = 3;
    const targetMap = binToOctMap;
    const parts = value.split('.');
    
    let rawInt = parts[0];
    let paddedInt = rawInt;
    while (paddedInt.length % groupSize !== 0) paddedInt = '0' + paddedInt;
    const intGroups = paddedInt.match(new RegExp(`.{1,${groupSize}}`, 'g')) || [];
    
    let rawFrac = parts[1] || '';
    let paddedFrac = rawFrac;
    if (paddedFrac) {
      while (paddedFrac.length % groupSize !== 0) paddedFrac += '0';
    }
    const fracGroups = paddedFrac ? paddedFrac.match(new RegExp(`.{1,${groupSize}}`, 'g')) || [] : [];
    
    const steps: Step[] = [];
    
    steps.push({
      title: 'ধাপ ১: ৩-বিট করে গ্রুপিং',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">বাইনারি সংখ্যাকে রেডিক্স পয়েন্ট (দশমিক) থেকে পূর্ণ সংখ্যার ক্ষেত্রে বাম দিকে এবং ভগ্নাংশের ক্ষেত্রে ডান দিকে ৩-বিট করে সাজানো হলো:</p>
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono">
            <div className="flex flex-wrap items-center justify-center gap-4 text-lg">
              <div className="flex flex-col items-center">
                <div className="flex gap-2 text-emerald-400">
                  {intGroups.map((group, idx) => (
                    <span key={idx} className="relative px-1 bg-slate-800 rounded group">
                      {group}
                    </span>
                  ))}
                </div>
                <div className="flex w-full justify-end mt-1 px-1">
                  <span className="text-[10px] text-blue-500">← গ্রুপিং দিক</span>
                </div>
              </div>

              {rawFrac && <span className="text-2xl font-bold text-white">.</span>}

              {rawFrac && (
                <div className="flex flex-col items-center">
                  <div className="flex gap-2 text-emerald-400">
                    {fracGroups.map((group, idx) => (
                      <span key={idx} className="relative px-1 bg-slate-800 rounded">
                        {group}
                      </span>
                    ))}
                  </div>
                  <div className="flex w-full justify-start mt-1 px-1">
                    <span className="text-[10px] text-blue-500">গ্রুপিং দিক →</span>
                  </div>
                </div>
              )}
            </div>
            <p className="mt-4 text-[10px] text-slate-500 italic text-center">
              * পূর্ণ সংখ্যায় বামে এবং ভগ্নাংশে ডানে প্রয়োজনে শূন্য (০) যোগ করে ৩-বিট পূর্ণ করা হয়েছে।
            </p>
          </div>
        </div>
      )
    });

    steps.push({
      title: 'ধাপ ২: প্রতিটি ৩-বিট গ্রুপের সমতুল্য মান বসানো',
      content: (
        <div className="flex flex-wrap gap-6 items-center justify-center p-6 bg-slate-800/30 rounded-xl border border-slate-800">
          {intGroups.map((g, i) => (
            <div key={i} className="flex flex-col items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800 min-w-[60px]">
              <div className="text-xs font-mono text-slate-500 mb-1">{g}</div>
              <div className="text-lg font-bold text-white leading-none mb-1">↓</div>
              <div className="text-2xl font-bold text-blue-400">{targetMap[g]}</div>
            </div>
          ))}
          {fracGroups.length > 0 && <div className="text-4xl font-bold text-white mb-2">.</div>}
          {fracGroups.map((g, i) => (
            <div key={i} className="flex flex-col items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800 min-w-[60px]">
              <div className="text-xs font-mono text-slate-500 mb-1">{g}</div>
              <div className="text-lg font-bold text-white leading-none mb-1">↓</div>
              <div className="text-2xl font-bold text-blue-400">{targetMap[g]}</div>
            </div>
          ))}
        </div>
      )
    });

    const finalInt = intGroups.map(g => targetMap[g]).join('').replace(/^0+(?=\d)/, '');
    const finalFrac = fracGroups.map(g => targetMap[g]).join('');
    return { 
      finalResult: (finalInt || '0') + (finalFrac ? '.' + finalFrac : ''), 
      steps 
    };
  }

  // Handle Binary to Hexadecimal Shortcut (4-bit Grouping)
  if (from === NumberSystem.BINARY && to === NumberSystem.HEXADECIMAL) {
    const groupSize = 4;
    const targetMap = binToHexMap;
    const parts = value.split('.');
    
    let paddedInt = parts[0];
    while (paddedInt.length % groupSize !== 0) paddedInt = '0' + paddedInt;
    const intGroups = paddedInt.match(new RegExp(`.{1,${groupSize}}`, 'g')) || [];
    
    let paddedFrac = parts[1] || '';
    if (paddedFrac) {
      while (paddedFrac.length % groupSize !== 0) paddedFrac += '0';
    }
    const fracGroups = paddedFrac ? paddedFrac.match(new RegExp(`.{1,${groupSize}}`, 'g')) || [] : [];
    
    const steps: Step[] = [];
    steps.push({
      title: 'ধাপ ১: ৪-বিট করে গ্রুপিং',
      content: (
        <div className="space-y-6">
          <div className="bg-slate-900 p-4 rounded-xl border border-blue-900/20">
            <div className="text-xs text-slate-500 mb-2 uppercase tracking-tighter text-center">বাইনারি গ্রুপ সমূহ (৪-বিট):</div>
            <div className="flex flex-wrap gap-3 items-center justify-center font-mono text-lg">
              {intGroups.map((g, i) => <span key={i} className="px-2 bg-slate-800 rounded border border-slate-700 text-emerald-400">{g}</span>)}
              {fracGroups.length > 0 && <span className="text-2xl font-bold text-white">.</span>}
              {fracGroups.map((g, i) => <span key={i} className="px-2 bg-slate-800 rounded border border-slate-700 text-emerald-400">{g}</span>)}
            </div>
          </div>

          <div className="flex flex-wrap gap-6 items-center justify-center">
            {intGroups.map((g, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-xs font-mono text-slate-500 mb-1">{g}</div>
                <div className="text-xl font-bold text-white leading-none">↓</div>
                <div className="text-3xl font-bold text-blue-400">{targetMap[g]}</div>
              </div>
            ))}
            {fracGroups.length > 0 && <div className="text-4xl font-bold text-white self-end mb-1">.</div>}
            {fracGroups.map((g, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-xs font-mono text-slate-500 mb-1">{g}</div>
                <div className="text-xl font-bold text-white leading-none">↓</div>
                <div className="text-3xl font-bold text-blue-400">{targetMap[g]}</div>
              </div>
            ))}
          </div>
        </div>
      )
    });

    const finalInt = intGroups.map(g => targetMap[g]).join('').replace(/^0+(?=\d)/, '');
    const finalFrac = fracGroups.map(g => targetMap[g]).join('');
    return { finalResult: (finalInt || '0') + (finalFrac ? '.' + finalFrac : ''), steps };
  }

  // Handle direct Hexadecimal to Binary Shortcut (4-bit grouping)
  if (from === NumberSystem.HEXADECIMAL && to === NumberSystem.BINARY) {
    const bitSize = 4;
    const sourceMap = hexToBinMap;
    const val = value.toUpperCase();
    const parts = val.split('.');
    
    const intChars = parts[0].split('');
    const fracChars = parts[1] ? parts[1].split('') : [];

    const steps: Step[] = [];
    steps.push({
      title: 'ধাপ ১: প্রতিটি ডিজিটকে ৪-বিট বাইনারিতে রূপান্তর',
      content: (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">প্রতিটি হেক্সাডেসিমেল ডিজিটের সমতুল্য ৪-বিট বাইনারি মান নিচে বসানো হলো:</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
            {intChars.map((char, i) => (
              <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center group hover:border-blue-500/50 transition-colors">
                <div className="text-2xl font-bold text-white mb-2">{char}</div>
                <div className="text-blue-400 font-mono text-sm font-bold bg-slate-800 py-1 rounded">{sourceMap[char] || '????'}</div>
              </div>
            ))}
            {fracChars.length > 0 && (
              <>
                <div className="col-span-full flex items-center justify-center my-2">
                   <div className="text-4xl font-bold text-white">.</div>
                </div>
                {fracChars.map((char, i) => (
                  <div key={i} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center group hover:border-blue-500/50 transition-colors">
                    <div className="text-2xl font-bold text-white mb-2">{char}</div>
                    <div className="text-blue-400 font-mono text-sm font-bold bg-slate-800 py-1 rounded">{sourceMap[char] || '????'}</div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )
    });

    const intBin = intChars.map(c => sourceMap[c]).join('');
    const fracBin = fracChars.map(c => sourceMap[c]).join('');
    
    steps.push({
      title: 'ধাপ ২: বিটসমূহ একত্রিত করে ফাইনাল মান নির্ণয়',
      content: (
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 font-mono text-center">
          <div className="flex flex-wrap items-center justify-center gap-2 text-emerald-400 text-lg">
             {intChars.map((c, i) => <span key={i} className="px-1 bg-slate-800 rounded">{sourceMap[c]}</span>)}
             {fracChars.length > 0 && <span className="text-white font-bold">.</span>}
             {fracChars.map((c, i) => <span key={i} className="px-1 bg-slate-800 rounded">{sourceMap[c]}</span>)}
          </div>
          <p className="mt-3 text-xs text-slate-500 italic">হেক্সাডেসিমেল থেকে বাইনারি রূপান্তরের ক্ষেত্রে সবসময় ৪-বিট রেজিস্টার ব্যবহার করতে হয়।</p>
        </div>
      )
    });

    const finalResult = intBin + (fracChars.length > 0 ? '.' + fracBin : '');
    return { finalResult, steps };
  }

  // Handle direct Octal to Binary shortcut
  if (from === NumberSystem.OCTAL && to === NumberSystem.BINARY) {
    const bitSize = 3;
    const sourceMap = octToBinMap;
    const val = value.toUpperCase();
    const parts = val.split('.');
    
    const intChars = parts[0].split('');
    const fracChars = parts[1] ? parts[1].split('') : [];

    const steps: Step[] = [];
    steps.push({
      title: `শর্টকাট পদ্ধতি (${bitSize}-বিট রূপান্তর)`,
      content: (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {intChars.map((char, i) => (
            <div key={i} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
              <div className="text-lg font-bold text-white mb-1">{char}</div>
              <div className="text-blue-400 font-mono text-sm">{sourceMap[char] || '????'}</div>
            </div>
          ))}
          {fracChars.length > 0 && <div className="col-span-full text-center text-3xl font-bold">.</div>}
          {fracChars.map((char, i) => (
            <div key={i} className="bg-slate-900/50 p-3 rounded-lg border border-slate-800 text-center">
              <div className="text-lg font-bold text-white mb-1">{char}</div>
              <div className="text-blue-400 font-mono text-sm">{sourceMap[char] || '????'}</div>
            </div>
          ))}
        </div>
      )
    });

    const finalResult = intChars.map(c => sourceMap[c]).join('') + (fracChars.length > 0 ? '.' + fracChars.map(c => sourceMap[c]).join('') : '');
    return { finalResult, steps };
  }

  // Final generic fallback
  const toDec = otherToDecimal(value, parseInt(from));
  const fromDec = decimalToOther(toDec.finalResult, parseInt(to));
  return {
    finalResult: fromDec.finalResult,
    steps: [
      { title: `${getBaseName(from)} থেকে ডেসিমেল`, content: toDec.steps[0].content },
      { title: `ডেসিমেল থেকে ${getBaseName(to)}`, content: fromDec.steps[0].content }
    ]
  };
};
