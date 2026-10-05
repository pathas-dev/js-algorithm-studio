import { motion, useReducedMotion } from 'motion/react';
import type { Step } from './algorithms';

export default function ArrayView({ step, language }: { step: Step; language: 'ko' | 'en' }) {
  const reducedMotion = useReducedMotion();
  const max = Math.max(1, ...step.array.map((item) => Math.abs(item.value)));
  return (
    <div className="array-scroll">
      <div className="array-chart" role="list" aria-label={language === 'ko' ? '현재 배열' : 'Current array'} style={{ minWidth: Math.max(260, step.array.length * 30) }}>
        {step.array.map((item, index) => {
          const height = Math.max(3, Math.abs(item.value) / max * 90);
          const barHeight = `calc(var(--array-scale, 90px) * ${height / 90})`;
          const outside = 'low' in step.variables && (index < Number(step.variables.low) || index > Number(step.variables.high));
          const matched = String(step.variables.matches ?? '').split(',').includes(String(index));
          const pivot = step.variables.pivotIndex === index;
          const active = step.indices.includes(index);
          const sorted = index < Number(step.variables.sortedCount ?? 0) || index >= Number(step.variables.sortedFrom ?? step.array.length);
          return (
            <motion.div layout="position" transition={{ duration: reducedMotion ? 0 : 0.24 }} key={item.id} className={`array-item ${outside ? 'outside-range' : ''} ${matched ? 'matched' : ''} ${pivot ? 'pivot' : ''} ${active ? step.type === 'swap' ? 'swapping' : 'comparing' : sorted ? 'settled' : ''}`} role="listitem" aria-label={`${index}: ${item.value}${pivot ? language === 'ko' ? ' · 피벗' : ' · pivot' : ''}`}>
              <span className="bar-label" style={{ top: `calc(var(--array-baseline, 110px) ${item.value >= 0 ? '-' : '+'} ${barHeight} ${item.value >= 0 ? '- 16px' : '+ 4px'})` }}>{item.value}</span>
              <motion.div className="bar" animate={{ height: barHeight, top: item.value >= 0 ? `calc(var(--array-baseline, 110px) - ${barHeight})` : 'var(--array-baseline, 110px)' }} transition={{ duration: reducedMotion ? 0 : 0.24 }} />
              <span className="array-index">{index}{pivot && ' ◆'}</span>
            </motion.div>
          );
        })}
        {!step.array.length && <div className="empty-array">{language === 'ko' ? '빈 배열' : 'Empty array'}</div>}
      </div>
    </div>
  );
}
