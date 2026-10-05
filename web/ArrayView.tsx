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
          const active = step.indices.includes(index);
          const sorted = index < Number(step.variables.sortedCount ?? 0) || index >= Number(step.variables.sortedFrom ?? step.array.length);
          return (
            <motion.div layout="position" transition={{ duration: reducedMotion ? 0 : 0.24 }} key={item.id} className={`array-item ${active ? step.type === 'swap' ? 'swapping' : 'comparing' : sorted ? 'settled' : ''}`} role="listitem" aria-label={`${index}: ${item.value}`}>
              <span className="bar-label" style={{ top: item.value >= 0 ? 94 - height : 114 + height }}>{item.value}</span>
              <motion.div className="bar" animate={{ height, top: item.value >= 0 ? 110 - height : 110 }} transition={{ duration: reducedMotion ? 0 : 0.24 }} />
              <span className="array-index">{index}</span>
            </motion.div>
          );
        })}
        {!step.array.length && <div className="empty-array">{language === 'ko' ? '빈 배열' : 'Empty array'}</div>}
      </div>
    </div>
  );
}
