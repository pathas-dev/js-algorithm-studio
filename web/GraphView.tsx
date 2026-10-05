import { useId } from 'react';
import { motion } from 'motion/react';
import type { Step, Language } from './algorithms';

export default function GraphView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const statusId = useId();
  const markerId = `${statusId}-arrow`;
  // ponytail: circular layout for at most 12 vertices; add a graph layout library for larger graphs.
  const positions = step.array.map((item, index) => {
    const angle = index / step.array.length * Math.PI * 2 - Math.PI / 2;
    return { ...item, x: 220 + Math.cos(angle) * 150, y: 155 + Math.sin(angle) * 116 };
  });
  const distances: Record<string, number | null> | undefined = step.variables.distances === undefined ? undefined : JSON.parse(String(step.variables.distances));
  const previous: Record<string, number | null> | undefined = step.variables.previous === undefined ? undefined : JSON.parse(String(step.variables.previous));
  const seen = distances ? Object.keys(distances).filter((key) => distances[key] !== null) : String(step.variables.seen ?? '').split(',');
  const processed = String(step.variables.processed ?? '').split(',');
  const dfs = step.variables.mode === 'dfs';
  const frontier = String((dfs ? step.variables.stack : step.variables.queue) ?? '');
  return <div className="graph-view">
    <svg viewBox="0 0 440 310" role="img" aria-describedby={statusId} aria-label={ko ? '현재 그래프' : 'Current graph'}>
      <title>{ko ? '현재 그래프: ' : 'Current graph: '}{step.array.map((item) => item.value).join(', ')}</title>
      <defs><marker id={markerId} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#617469" /></marker></defs>
      {step.edges?.map(([a, b, weight]) => {
        const from = positions.find((node) => node.value === a)!;
        const to = positions.find((node) => node.value === b)!;
        const active = (step.variables.current === a && step.variables.next === b) || (!step.variables.directed && step.variables.current === b && step.variables.next === a);
        const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy);
        const reciprocal = step.variables.directed && step.edges?.some(([c, d]) => c === b && d === a);
        const bend = reciprocal ? 28 : 0;
        const cx = (from.x + to.x) / 2 - dy / length * bend, cy = (from.y + to.y) / 2 + dx / length * bend;
        return <g key={`${a}-${b}`}><path d={`M ${from.x + dx / length * 22} ${from.y + dy / length * 22} Q ${cx} ${cy} ${to.x - dx / length * 24} ${to.y - dy / length * 24}`} fill="none" stroke={active ? '#d8964a' : '#aabdb0'} strokeWidth={active ? 4 : 2} markerEnd={step.variables.directed ? `url(#${markerId})` : undefined} />
          {weight !== undefined && <text x={(from.x + 2 * cx + to.x) / 4} y={(from.y + 2 * cy + to.y) / 4 - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#305645" stroke="#fff" strokeWidth={4} paintOrder="stroke">{weight}</text>}
        </g>;
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
    {('queue' in step.variables || dfs) && <div className="frontier"><span>{distances ? ko ? '우선순위 큐 · 힙 배열' : 'Priority queue · heap storage' : dfs ? ko ? '재귀 스택 · 아래 → 위' : 'Recursion stack · bottom → top' : ko ? '큐 · 앞 → 뒤' : 'Queue · front → back'}</span><output data-testid="frontier">[{frontier.split(',').filter(Boolean).join(', ')}]</output></div>}
    {distances && <table className="graph-table" data-testid="distance-table"><caption>{ko ? '시작점에서의 거리 · ∞는 도달 불가' : 'Distance from start · ∞ means unreachable'}</caption><thead><tr><th>{ko ? '정점' : 'Vertex'}</th><th>{ko ? '거리' : 'Distance'}</th><th>{ko ? '이전 정점' : 'Previous'}</th></tr></thead><tbody>{step.array.map((item) => <tr key={item.id}><td>{item.value}</td><td>{distances[item.value] ?? '∞'}</td><td>{previous?.[item.value] ?? '—'}</td></tr>)}</tbody></table>}
    <div className="graph-status" id={statusId} aria-live="polite">{ko ? '발견: ' : 'Discovered: '}{seen.join(', ')} · {ko ? '처리 완료: ' : 'Processed: '}{processed.filter(Boolean).join(', ') || '∅'}</div>
  </div>;
}
