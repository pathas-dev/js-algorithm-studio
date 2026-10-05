import { motion } from 'motion/react';
import type { Step, Language } from './algorithms';

export default function HeapView({ step, language }: { step: Step; language: Language }) {
  const priorityQueue = step.variables.structure === 'priority-queue';
  const priorities: Record<string, number> = priorityQueue ? JSON.parse(String(step.variables.priorities)) : {};
  const start = Number(step.variables.sortedCount);
  const heap = step.array.slice(start, start + Number(step.variables.heapSize));
  const levels = Math.max(1, Math.ceil(Math.log2(heap.length + 1)));
  const nodes = heap.map((item, index) => {
    const level = Math.floor(Math.log2(index + 1));
    const position = index - (2 ** level - 1);
    return { ...item, x: 16 + (position + .5) / 2 ** level * 568, y: 25 + level * 48 };
  });
  return <div className="heap-view">
    <p>{priorityQueue ? step.variables.adjusting ? language === 'ko' ? '힙 조정 중 · 우선순위 순서 복원' : 'Adjusting heap · restoring priority order' : language === 'ko' ? '우선순위 큐 · 작은 p부터 처리' : 'Priority queue · smaller p first' : step.variables.adjusting ? language === 'ko' ? '힙 조정 중 · 부모 ≤ 자식 순서를 복원합니다' : 'Adjusting heap · restoring parent ≤ child' : language === 'ko' ? '최소 힙 · 부모 ≤ 자식' : 'Min heap · parent ≤ child'}</p>
    <svg viewBox={`0 0 600 ${levels * 48 + 10}`} role="img" aria-label={language === 'ko' ? '현재 최소 힙' : 'Current min heap'}>
      <title>{heap.map((item) => item.value).join(', ') || '∅'}</title>
      {nodes.slice(1).map((node, index) => {
        const parent = nodes[Math.floor(index / 2)];
        return <line key={node.id} x1={parent.x} y1={parent.y} x2={node.x} y2={node.y} stroke="#cbd7ce" strokeWidth={2} />;
      })}
      {nodes.map((node, index) => <motion.g key={node.id} animate={{ x: node.x, y: node.y }} transition={{ duration: .24 }}>
        <circle r={13} fill={(['heap', 'priority-queue'].includes(String(step.variables.structure)) ? step.indices.includes(start + index) : index === 0) ? '#d8964a' : '#326f54'} />
        <text textAnchor="middle" y={4} fontSize={11} fill="white">{node.value}</text>
        {priorityQueue && <text textAnchor="middle" y={27} fontSize={9} fill="#305645">p:{priorities[String(node.value)]}</text>}
      </motion.g>)}
      {!nodes.length && <text x={300} y={25} textAnchor="middle">∅</text>}
    </svg>
    <output data-testid="heap-values">[{heap.map((item) => item.value).join(', ')}]</output>
  </div>;
}
