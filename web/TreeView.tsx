import { motion } from 'motion/react';
import type { Step, Language } from './algorithms';

type Node = { id: number; value: number; depth: number; left: number; right: number; balance?: number; height?: number };

export default function TreeView({ step, language }: { step: Step; language: Language }) {
  const tree: Node[] = JSON.parse(String(step.variables.tree));
  const ordered = [...tree].sort((a, b) => a.value - b.value);
  const width = Math.max(600, tree.length * 50 + 40);
  const avl = step.variables.structure === 'avl-tree';
  const nodes = tree.map((node) => ({ ...node, x: 30 + (ordered.findIndex((item) => item.id === node.id) + .5) / Math.max(1, tree.length) * (width - 60), y: 35 + node.depth * (avl ? 75 : 55) }));
  const height = Math.max(110, ...nodes.map((node) => node.y + (avl ? 50 : 35)));
  return <div className="structure-view">
    <p>{avl ? language === 'ko' ? 'AVL · b = 왼쪽 높이 − 오른쪽 높이 · 균형 복구 후 |b| ≤ 1' : 'AVL · b = left height − right height · |b| ≤ 1 after repair' : language === 'ko' ? '왼쪽 < 현재 값 < 오른쪽 · ROOT부터 탐색' : 'Left < current value < right · search from ROOT'}</p>
    <div className="tree-scroll">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={avl ? language === 'ko' ? '현재 AVL 트리' : 'Current AVL tree' : language === 'ko' ? '현재 이진 검색 트리' : 'Current binary search tree'}>
        <title>{String(step.variables.inorder) || '∅'}</title>
        {nodes.flatMap((node) => [node.left, node.right].filter((id) => id >= 0).map((id) => {
          const child = nodes.find((item) => item.id === id)!;
          return <line key={`${node.id}-${id}`} x1={node.x} y1={node.y} x2={child.x} y2={child.y} stroke="#cbd7ce" strokeWidth={2} />;
        }))}
        {nodes.map((node, index) => <motion.g key={node.id} animate={{ x: node.x, y: node.y }} transition={{ duration: .24 }}>
          <circle r={18} fill={step.indices.includes(index) ? '#d8964a' : '#326f54'} />
          <text textAnchor="middle" y={4} fontSize={12} fill="white">{node.value}</text>
          {avl && <text textAnchor="middle" y={32} fontSize={10} fill={Math.abs(node.balance!) > 1 ? '#b45309' : '#617469'}>b={node.balance} · h={node.height}</text>}
          {node.depth === 0 && <text textAnchor="middle" y={-25} fontSize={9} fill="#617469">ROOT</text>}
        </motion.g>)}
        {!nodes.length && <text x={width / 2} y={55} textAnchor="middle" fill="#617469">ROOT = ∅</text>}
      </svg>
    </div>
    {'result' in step.variables && <div className="frontier">{language === 'ko' ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(step.variables.result)}</output></div>}
  </div>;
}
