import { motion } from 'motion/react';
import type { Step, Language } from './algorithms';

type Node = { id: number; value: number; depth: number; left: number; right: number };

export default function TreeView({ step, language }: { step: Step; language: Language }) {
  const tree: Node[] = JSON.parse(String(step.variables.tree));
  const ordered = [...tree].sort((a, b) => a.value - b.value);
  const width = Math.max(600, tree.length * 50 + 40);
  const nodes = tree.map((node) => ({ ...node, x: 30 + (ordered.findIndex((item) => item.id === node.id) + .5) / Math.max(1, tree.length) * (width - 60), y: 35 + node.depth * 55 }));
  const height = Math.max(110, ...nodes.map((node) => node.y + 35));
  return <div className="structure-view">
    <p>{language === 'ko' ? '왼쪽 < 현재 값 < 오른쪽 · ROOT부터 탐색' : 'Left < current value < right · search from ROOT'}</p>
    <div className="tree-scroll">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={language === 'ko' ? '현재 이진 검색 트리' : 'Current binary search tree'}>
        <title>{String(step.variables.inorder) || '∅'}</title>
        {nodes.flatMap((node) => [node.left, node.right].filter((id) => id >= 0).map((id) => {
          const child = nodes.find((item) => item.id === id)!;
          return <line key={`${node.id}-${id}`} x1={node.x} y1={node.y} x2={child.x} y2={child.y} stroke="#cbd7ce" strokeWidth={2} />;
        }))}
        {nodes.map((node, index) => <motion.g key={node.id} animate={{ x: node.x, y: node.y }} transition={{ duration: .24 }}>
          <circle r={18} fill={step.indices.includes(index) ? '#d8964a' : '#326f54'} />
          <text textAnchor="middle" y={4} fontSize={12} fill="white">{node.value}</text>
          {node.depth === 0 && <text textAnchor="middle" y={-25} fontSize={9} fill="#617469">ROOT</text>}
        </motion.g>)}
        {!nodes.length && <text x={width / 2} y={55} textAnchor="middle" fill="#617469">ROOT = ∅</text>}
      </svg>
    </div>
    {'result' in step.variables && <div className="frontier">{language === 'ko' ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(step.variables.result)}</output></div>}
  </div>;
}
