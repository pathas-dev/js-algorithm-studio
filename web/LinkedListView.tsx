import PlanetMark from './PlanetMark';
import { motion } from 'motion/react';
import type { Step, Language } from './algorithms';

export default function LinkedListView({ step, language }: { step: Step; language: Language }) {
  const links: number[][] = JSON.parse(String(step.variables.links));
  const traversal = step.variables.mode === 'list-forward' || step.variables.mode === 'list-reverse';
  const seen: number[] = JSON.parse(String(step.variables.seenIds ?? '[]'));
  const deque = step.variables.structure === 'deque';
  const doubly = 'previousLinks' in step.variables;
  const previousLinks: number[][] = doubly ? JSON.parse(String(step.variables.previousLinks)) : [];
  const nodes = step.array.map((item, index) => ({ ...item, x: 64 + index * 94 }));
  const width = Math.max(320, nodes.length * 94 + 34);
  return <div className="structure-view">
    <p>{doubly ? language === 'ko' ? '초록 next · 보라 previous · N 번호는 노드 식별자 · ∅는 null' : 'Green next · purple previous · N labels identify nodes · ∅ means null' : language === 'ko' ? 'next 연결 · N 번호는 노드 식별자 · ∅는 null' : 'next links · N labels identify nodes · ∅ means null'}</p>
    <div className="list-scroll">
      <svg width={width} height={doubly ? 200 : 150} viewBox={`0 0 ${width} ${doubly ? 200 : 150}`} role="img" aria-label={doubly ? language === 'ko' ? '현재 이중 연결 리스트' : 'Current doubly linked list' : language === 'ko' ? '현재 연결 리스트' : 'Current linked list'}>
        <title>{nodes.map((node) => `N${node.id}: ${node.value}`).join(', ') || '∅'}</title>
        <defs><marker id="list-arrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#658873" /></marker></defs>
        {doubly && <defs><marker id="previous-arrow" viewBox="0 0 10 10" refX={9} refY={5} markerWidth={6} markerHeight={6} orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="#8877a2" /></marker></defs>}
        {links.map(([from, to]) => {
          const start = nodes.find((node) => node.id === from)!;
          const end = nodes.find((node) => node.id === to);
          return end ? <path key={from} d={`M${start.x} 89 C${start.x} 130 ${end.x} 130 ${end.x} 89`} stroke="#658873" fill="none" markerEnd="url(#list-arrow)" />
            : <text key={from} x={start.x} y={118} textAnchor="middle" fill="#a3b0a7" fontSize={12}>↓ ∅</text>;
        })}
        {previousLinks.map(([from, to]) => {
          const start = nodes.find((node) => node.id === from)!;
          const end = nodes.find((node) => node.id === to);
          return end ? <path key={from} d={`M${start.x + 10} 89 C${start.x + 10} 175 ${end.x + 10} 175 ${end.x + 10} 89`} stroke="#8877a2" fill="none" markerEnd="url(#previous-arrow)" />
            : <text key={from} x={start.x + 10} y={160} textAnchor="middle" fill="#8877a2" fontSize={12}>↓ ∅</text>;
        })}
        {nodes.map((node, index) => <motion.g key={node.id} animate={{ x: node.x }} transition={{ duration: .24 }}>
          <text y={21} textAnchor="middle" fontSize={10} fill="#a3b0a7">{[step.variables.head === node.id ? deque ? 'FRONT' : 'HEAD' : '', step.variables.tail === node.id ? deque ? 'BACK' : 'TAIL' : ''].filter(Boolean).join(' / ')}</text>
          <PlanetMark cy={60} r={25} fill={step.indices.includes(index) ? '#d6b476' : traversal && seen.includes(node.id) ? '#8faf9d' : '#82968c'} stroke={step.indices.includes(index) ? '#d6b476' : '#526b60'} />
          <text y={50} textAnchor="middle" fontSize={10} fill="#0b1012">N{node.id}</text>
          <text y={74} textAnchor="middle" fontSize={13} fill="#0b1012">{node.value}</text>
        </motion.g>)}
        {!nodes.length && <text x={width / 2} y={72} textAnchor="middle" fill="#a3b0a7">{deque ? 'FRONT = BACK = ∅' : 'HEAD = TAIL = ∅'}</text>}
      </svg>
    </div>
    {step.variables.mode === 'list-reverse' && <div className="frontier">{language === 'ko' ? '호출 스택 · HEAD → 현재' : 'Call stack · HEAD → current'} <strong>{String(step.variables.stack) || '∅'}</strong></div>}
    {'result' in step.variables && <div className="frontier">{traversal ? language === 'ko' ? '방문 순서' : 'Visit order' : language === 'ko' ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(traversal ? step.variables.order : step.variables.result) || '∅'}</output></div>}
  </div>;
}
