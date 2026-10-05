import { useId } from 'react';
import { motion } from 'motion/react';
import type { Step, Language } from './algorithms';

export default function GraphView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const statusId = useId();
  // ponytail: circular layout for at most 12 vertices; add a graph layout library for larger graphs.
  const positions = step.array.map((item, index) => {
    const angle = index / step.array.length * Math.PI * 2 - Math.PI / 2;
    return { ...item, x: 220 + Math.cos(angle) * 150, y: 155 + Math.sin(angle) * 116 };
  });
  const seen = String(step.variables.seen ?? '').split(',');
  const processed = String(step.variables.processed ?? '').split(',');
  const dfs = step.variables.mode === 'dfs';
  const frontier = String((dfs ? step.variables.stack : step.variables.queue) ?? '');
  return <div className="graph-view">
    <svg viewBox="0 0 440 310" role="img" aria-describedby={statusId} aria-label={ko ? '현재 그래프' : 'Current graph'}>
      <title>{ko ? '현재 그래프: ' : 'Current graph: '}{step.array.map((item) => item.value).join(', ')}</title>
      {step.edges?.map(([a, b]) => {
        const from = positions.find((node) => node.value === a)!;
        const to = positions.find((node) => node.value === b)!;
        const active = (step.variables.current === a && step.variables.next === b) || (step.variables.current === b && step.variables.next === a);
        return <line key={`${a}-${b}`} x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={active ? '#d8964a' : '#cbd7ce'} strokeWidth={active ? 4 : 2} />;
      })}
      {positions.map((node) => {
        const current = step.variables.current === node.value;
        const done = processed.includes(String(node.value));
        const discovered = seen.includes(String(node.value));
        const label = `${node.value}: ${current ? ko ? '현재 정점' : 'current' : done ? ko ? '처리 완료' : 'processed' : discovered ? ko ? '발견' : 'discovered' : ko ? '미발견' : 'undiscovered'}`;
        return <motion.g key={node.id} animate={{ opacity: !discovered && step.type === 'done' ? .3 : 1 }}>
          <circle cx={node.x} cy={node.y} r={20} fill={current ? '#d8964a' : done ? '#326f54' : discovered ? '#2c7198' : '#e4ece6'} stroke="#fff" strokeWidth={3} />
          <text x={node.x} y={node.y + 5} textAnchor="middle" fill={current ? '#263f32' : discovered ? '#fff' : '#305645'} fontSize={14} fontWeight={700}>{node.value}</text>
          <title>{label}</title>
        </motion.g>;
      })}
    </svg>
    <div className="frontier"><span>{dfs ? ko ? '재귀 스택 · 아래 → 위' : 'Recursion stack · bottom → top' : ko ? '큐 · 앞 → 뒤' : 'Queue · front → back'}</span><output data-testid="frontier">[{frontier.split(',').filter(Boolean).join(', ')}]</output></div>
    <div className="graph-status" id={statusId} aria-live="polite">{ko ? '발견: ' : 'Discovered: '}{seen.join(', ')} · {ko ? '처리 완료: ' : 'Processed: '}{processed.filter(Boolean).join(', ') || '∅'}</div>
  </div>;
}
