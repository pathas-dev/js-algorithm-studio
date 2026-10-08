import { motion, useReducedMotion } from 'motion/react';
import type { Step } from './algorithms';
import { lazy, Suspense } from 'react';
import { useSpaceLesson } from './SpaceLesson';
import PlanetMark from './PlanetMark';

const BubbleScene = lazy(() => import('./BubbleScene'));

export default function ArrayView({ step, language, orbital = true, planetary = false }: { step: Step; language: 'ko' | 'en'; orbital?: boolean; planetary?: boolean }) {
  const reducedMotion = useReducedMotion();
  const scene = useSpaceLesson();
  if (orbital && scene && !scene.reduced) return <Suspense fallback={<ArrayView step={step} language={language} orbital={false} />}><BubbleScene step={step} language={language} {...scene} world="space" /></Suspense>;
  const max = Math.max(1, ...step.array.map((item) => Math.abs(item.value)));
  if (scene || planetary) return <div className="array-scroll"><div className="orbital-array" role="list" aria-label={language === 'ko' ? '현재 배열' : 'Current array'}>
    {step.array.map((item, index) => {
      const outside = 'low' in step.variables && (index < Number(step.variables.low) || index > Number(step.variables.high));
      const matched = String(step.variables.matches ?? '').split(',').includes(String(index));
      const pivot = step.variables.pivotIndex === index;
      const active = step.indices.includes(index);
      const sorted = index < Number(step.variables.sortedCount ?? 0) || index >= Number(step.variables.sortedFrom ?? step.array.length);
      return <div key={item.id} className={`orbital-slot ${outside ? 'outside-range' : ''}`} role="listitem" aria-label={`${index}: ${item.value}${pivot ? language === 'ko' ? ' · 피벗' : ' · pivot' : ''}`} style={{ minWidth: Math.max(72, String(item.value).length * 9 + 16) }}><span>{item.value}</span><svg viewBox="-36 -32 72 64" aria-hidden="true"><PlanetMark r={Math.max(7, Math.abs(item.value) / max * 24)} fill={active ? step.type === 'swap' ? '#afa0be' : '#d6b476' : pivot ? '#afa0be' : sorted || matched ? '#8faf9d' : '#82968c'} /></svg><small>[{index}]{pivot && ' ◆'}</small></div>;
    })}
    {!step.array.length && <div className="empty-array">{language === 'ko' ? '빈 배열' : 'Empty array'}</div>}
  </div></div>;
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
