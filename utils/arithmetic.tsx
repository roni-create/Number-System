
import React from 'react';
import { CalculationResult, Step } from '../types';

export const binaryAdd = (a: string, b: string): CalculationResult => {
  const steps: Step[] = [];
  const numA = parseInt(a, 2);
  const numB = parseInt(b, 2);
  const sum = numA + numB;
  const result = sum.toString(2);

  const tableContent = (
    <div className="bg-slate-900 p-4 rounded font-mono">
      <div className="flex justify-end pr-4 text-slate-500 text-xs mb-1">Carry:</div>
      <div className="flex flex-col items-end border-b border-slate-700 pb-2">
        <div className="text-blue-400">{a}</div>
        <div className="text-blue-400">+ {b}</div>
      </div>
      <div className="flex justify-end pt-2 text-green-400 font-bold">
        {result}
      </div>
      <div className="mt-4 text-xs text-slate-400">
        নিয়ম:<br/>
        ০+০ = ০<br/>
        ০+১ = ১<br/>
        ১+০ = ১<br/>
        ১+১ = ১০ (০ লিখে হাতে ১)<br/>
        ১+১+১ = ১১ (১ লিখে হাতে ১)
      </div>
    </div>
  );

  steps.push({ title: 'বাইনারি যোগ প্রক্রিয়া', content: tableContent });

  return { finalResult: result, steps };
};

export const binarySub = (a: string, b: string): CalculationResult => {
  const steps: Step[] = [];
  const numA = parseInt(a, 2);
  const numB = parseInt(b, 2);
  
  // Basic display subtract. Real ICT logic often uses 2's complement for sub, but direct sub is also taught.
  let result = "";
  if (numA < numB) {
     result = "-" + (numB - numA).toString(2);
  } else {
     result = (numA - numB).toString(2);
  }

  const tableContent = (
    <div className="bg-slate-900 p-4 rounded font-mono">
      <div className="flex flex-col items-end border-b border-slate-700 pb-2">
        <div className="text-blue-400">{a}</div>
        <div className="text-blue-400">- {b}</div>
      </div>
      <div className="flex justify-end pt-2 text-green-400 font-bold">
        {result}
      </div>
      <div className="mt-4 text-xs text-slate-400">
        নিয়ম:<br/>
        ০-০ = ০<br/>
        ১-০ = ১<br/>
        ১-১ = ০<br/>
        ০-১ = ১ (ধার ১)
      </div>
    </div>
  );

  steps.push({ title: 'বাইনারি বিয়োগ প্রক্রিয়া', content: tableContent });
  return { finalResult: result, steps };
};

export const getTwosComplement = (decimalVal: number, bits: number = 8): CalculationResult => {
  const steps: Step[] = [];
  
  // 1. Binary representation
  const absVal = Math.abs(decimalVal);
  let binary = absVal.toString(2).padStart(bits, '0');
  
  steps.push({
    title: `বাইনারি মান (${bits}-বিট)`,
    content: <div className="bg-slate-800 p-2 font-mono">{binary.match(/.{1,4}/g)?.join(' ')}</div>
  });

  // 2. 1's Complement
  const onesComplement = binary.split('').map(b => b === '0' ? '1' : '0').join('');
  steps.push({
    title: `১-এর পরিপূরক (বিট উল্টে)`,
    content: <div className="bg-slate-800 p-2 font-mono">{onesComplement.match(/.{1,4}/g)?.join(' ')}</div>
  });

  // 3. 2's Complement (Add 1)
  const twosVal = (parseInt(onesComplement, 2) + 1).toString(2).padStart(bits, '0');
  const finalTwos = twosVal.slice(-bits); // handle overflow

  steps.push({
    title: `২-এর পরিপূরক (১ যোগ করে)`,
    content: (
      <div className="bg-slate-900 p-3 rounded font-mono">
        <div className="text-slate-400">{onesComplement}</div>
        <div className="text-slate-400 border-b border-slate-700 pb-1">+ {" ".repeat(bits - 1)}1</div>
        <div className="text-green-400 pt-1">{finalTwos.match(/.{1,4}/g)?.join(' ')}</div>
      </div>
    )
  });

  return { finalResult: finalTwos, steps };
};
