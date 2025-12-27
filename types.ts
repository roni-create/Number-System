
// Import React to fix "Cannot find namespace 'React'" error.
import React from 'react';

export enum NumberSystem {
  BINARY = '2',
  OCTAL = '8',
  DECIMAL = '10',
  HEXADECIMAL = '16'
}

export interface Step {
  title: string;
  content: React.ReactNode;
}

export interface CalculationResult {
  finalResult: string;
  steps: Step[];
}
