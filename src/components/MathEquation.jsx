import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

export function InlineEquation({ children, className = '' }) {
  return (
    <span className={`inline-block ${className}`}>
      <InlineMath math={children} />
    </span>
  );
}

export function DisplayEquation({ children, className = '' }) {
  return (
    <div className={`my-4 overflow-x-auto ${className}`}>
      <BlockMath math={children} />
    </div>
  );
}

// Helper to create colored equations
export function coloredMath(text, color = 'blue') {
  return `\\color{${color}}{${text}}`;
}

export default { InlineEquation, DisplayEquation, coloredMath };
