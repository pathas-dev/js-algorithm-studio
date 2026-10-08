import PlanetMark from './PlanetMark';
import { useId } from 'react';
import type { Step, Language } from './algorithms';

export default function GraphView({ step, language, weighted = true }: { step: Step; language: Language; weighted?: boolean }) {
  const ko = language === 'ko';
  const statusId = useId();
  const markerId = `${statusId}-arrow`;
  // ponytail: circular layout for at most 12 vertices; add a graph layout library for larger graphs.
  const positions = step.array.map((item, index) => {
    const angle = index / step.array.length * Math.PI * 2 - Math.PI / 2;
    return { ...item, x: 220 + Math.cos(angle) * 150, y: 155 + Math.sin(angle) * 116 };
  });
  const distances: Record<string, number | null> | undefined = step.variables.distances === undefined ? undefined : JSON.parse(String(step.variables.distances));
  const groups: number[][] | undefined = step.variables.groups === undefined ? undefined : JSON.parse(String(step.variables.groups));
  const groupMap = new Map<number, number[]>();
  groups?.forEach(([node, root]) => groupMap.set(root, [...(groupMap.get(root) ?? []), node]));
  const chosen: number[][] = JSON.parse(String(step.variables.chosen ?? '[]'));
  const matrix: (number | null)[][] | undefined = step.variables.matrix === undefined ? undefined : JSON.parse(String(step.variables.matrix));
  const previous: Record<string, number | null> | undefined = step.variables.previous === undefined ? undefined : JSON.parse(String(step.variables.previous));
  const seen = matrix ? step.array.map((item) => String(item.value)) : distances ? Object.keys(distances).filter((key) => distances[key] !== null) : String(step.variables.seen ?? '').split(',');
  const processed = matrix && step.type === 'done' ? seen : String(step.variables.processed ?? '').split(',');
  const dfs = step.variables.mode === 'dfs' || step.variables.mode === 'topological';
  const frontier = String((dfs ? step.variables.stack : step.variables.queue) ?? '');
  return <div className="graph-view">
    <svg viewBox="0 0 440 310" role="img" aria-describedby={statusId} aria-label={ko ? '현재 그래프' : 'Current graph'}>
      <title>{`${ko ? '현재 그래프: ' : 'Current graph: '}${step.array.map((item) => item.value).join(', ')}`}</title>
      <defs><marker id={markerId} viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="#a3b0a7" /></marker></defs>
      {step.edges?.map(([a, b, weight]) => {
        const from = positions.find((node) => node.value === a)!;
        const to = positions.find((node) => node.value === b)!;
        const active = matrix ? (step.variables.current === a && step.variables.via === b) || (step.variables.via === a && step.variables.next === b) || (!step.variables.directed && ((step.variables.current === b && step.variables.via === a) || (step.variables.via === b && step.variables.next === a))) : (step.variables.current === a && step.variables.next === b) || (!step.variables.directed && step.variables.current === b && step.variables.next === a);
        const selected = chosen.some(([c, d]) => (c === a && d === b) || (c === b && d === a));
        const dx = to.x - from.x, dy = to.y - from.y, length = Math.hypot(dx, dy);
        const reciprocal = step.variables.directed && step.edges?.some(([c, d]) => c === b && d === a);
        const bend = reciprocal ? 28 : 0;
        const cx = (from.x + to.x) / 2 - dy / length * bend, cy = (from.y + to.y) / 2 + dx / length * bend;
        return <g key={`${a}-${b}`}><path d={`M ${from.x + dx / length * 22} ${from.y + dy / length * 22} Q ${cx} ${cy} ${to.x - dx / length * 24} ${to.y - dy / length * 24}`} fill="none" stroke={active ? '#d6b476' : selected ? '#8faf9d' : '#526b60'} strokeWidth={active || selected ? 4 : 2} markerEnd={step.variables.directed ? `url(#${markerId})` : undefined} />
          {weighted && weight !== undefined && <text x={(from.x + 2 * cx + to.x) / 4} y={(from.y + 2 * cy + to.y) / 4 - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill="#e2e7d9" stroke="#0b1012" strokeWidth={4} paintOrder="stroke">{weight}</text>}
        </g>;
      })}
      {positions.map((node, index) => {
        const current = step.variables.structure === 'disjoint-set' ? step.indices.includes(index) : step.variables.current === node.value;
        const done = processed.includes(String(node.value));
        const discovered = seen.includes(String(node.value));
        const label = `${node.value}: ${current ? ko ? '현재 정점' : 'current' : done ? ko ? '처리 완료' : 'processed' : discovered ? ko ? '발견' : 'discovered' : ko ? '미발견' : 'undiscovered'}`;
        return <g key={node.id}>
          <PlanetMark cx={node.x} cy={node.y} r={20} fill={current ? '#d6b476' : done ? '#8faf9d' : discovered ? '#8dacc0' : '#82968c'} stroke={step.variables.via === node.value ? "#9b6fa8" : "#526b60"} strokeWidth={3} opacity={!discovered && step.type === 'done' ? .3 : 1} />
          <text x={node.x} y={node.y + 5} textAnchor="middle" fill={!discovered && step.type === 'done' ? '#e2e7d9' : '#0b1012'} fontSize={14} fontWeight={700}>{node.value}</text>
          <title>{label}</title>
        </g>;
      })}
    </svg>
    {('queue' in step.variables || dfs) && <div className="frontier"><span>{groups ? ko ? '남은 간선 · 가중치 오름차순' : 'Remaining edges · increasing weight' : distances ? ko ? '우선순위 큐 · 힙 배열' : 'Priority queue · heap storage' : dfs ? ko ? '재귀 스택 · 아래 → 위' : 'Recursion stack · bottom → top' : ko ? '큐 · 앞 → 뒤' : 'Queue · front → back'}</span><output data-testid="frontier">[{frontier.split(',').filter(Boolean).join(', ')}]</output></div>}
    {groups && <div className="frontier" id={step.variables.structure === 'disjoint-set' ? statusId : undefined}><span>{ko ? '분리 집합 · 대표: 구성원' : 'Disjoint sets · representative: members'}</span><output data-testid="disjoint-groups">{[...groupMap].map(([root, members]) => `${root}: [${members.join(', ')}]`).join(' · ')}</output></div>}
    {distances && <table className="graph-table" data-testid="distance-table"><caption>{step.variables.negativeCycle ? ko ? '음수 사이클 · 잠정 거리 (최단 거리 아님)' : 'Negative cycle · tentative distances (not shortest)' : ko ? '시작점에서의 거리 · ∞는 도달 불가' : 'Distance from start · ∞ means unreachable'}</caption><thead><tr><th>{ko ? '정점' : 'Vertex'}</th><th>{ko ? '거리' : 'Distance'}</th><th>{ko ? '이전 정점' : 'Previous'}</th></tr></thead><tbody>{step.array.map((item) => <tr key={item.id}><td>{item.value}</td><td>{distances[item.value] ?? '∞'}</td><td>{previous?.[item.value] ?? '—'}</td></tr>)}</tbody></table>}
    {matrix && <div className="matrix-scroll" id={statusId}><table className="graph-table" data-testid="distance-matrix"><caption>{step.variables.negativeCycle ? ko ? '음수 사이클 · 잠정 거리 행렬' : 'Negative cycle · tentative matrix' : ko ? '거리 행렬 · 행: 출발 / 열: 도착' : 'Distance matrix · row: source / column: destination'}</caption><thead><tr><th>→</th>{step.array.map((item) => <th key={item.id}>{item.value}</th>)}</tr></thead><tbody>{matrix.map((row, i) => <tr key={i}><th>{step.array[i].value}</th>{row.map((value, j) => <td key={j} className={step.variables.current === step.array[i].value && step.variables.next === step.array[j].value ? 'active-bucket' : undefined}>{value ?? '∞'}</td>)}</tr>)}</tbody></table></div>}
    {'finish' in step.variables && <div className="frontier"><span>{ko ? '종료 스택 · 위 → 아래' : 'Finishing stack · top → bottom'}</span><output>[{String(step.variables.finish).split(',').filter(Boolean).join(', ')}]</output></div>}
    {'discovery' in step.variables && <table className="graph-table" data-testid="low-table"><caption>{ko ? 'DFS 방문 시각 · low' : 'DFS discovery time · low'}</caption><thead><tr><th>{ko ? '정점' : 'Vertex'}</th><th>discovery</th><th>low</th></tr></thead><tbody>{step.array.map((item) => <tr key={item.id}><td>{item.value}</td><td>{JSON.parse(String(step.variables.discovery))[item.value] ?? '—'}</td><td>{JSON.parse(String(step.variables.low))[item.value] ?? '—'}</td></tr>)}</tbody></table>}
    {!matrix && step.variables.structure !== 'disjoint-set' && <div className="graph-status" id={statusId} aria-live="polite">{step.variables.structure === 'graph-structure' ? ko ? `현재 정점: ${seen.join(', ') || '∅'}` : `Current vertices: ${seen.join(', ') || '∅'}` : <>{ko ? '발견: ' : 'Discovered: '}{seen.join(', ')} · {ko ? '처리 완료: ' : 'Processed: '}{processed.filter(Boolean).join(', ') || '∅'}</>}</div>}
  </div>;
}
