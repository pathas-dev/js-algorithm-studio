import { motion } from 'motion/react';
import type { Step, Language } from './algorithms';

type Node = { id: number; character: string; complete: boolean; children: number[]; prefix: string; depth: number };

export default function TrieView({ step, language }: { step: Step; language: Language }) {
  const tree: Node[] = JSON.parse(String(step.variables.trie));
  const positions = new Map<number, number>();
  let leaves = 0;
  const place = (node: Node): number => {
    const children = node.children.map((id) => place(tree.find((item) => item.id === id)!));
    const x = children.length ? children.reduce((sum, value) => sum + value, 0) / children.length : leaves++;
    positions.set(node.id, x);
    return x;
  };
  place(tree[0]);
  const width = Math.max(600, leaves * 55 + 60);
  const nodes = tree.map((node) => ({ ...node, x: 30 + (positions.get(node.id)! + .5) / leaves * (width - 60), y: 38 + node.depth * 52 }));
  const height = Math.max(110, ...nodes.map((node) => node.y + 30));
  return <div className="structure-view">
    <p>{language === 'ko' ? '초록 테두리: 단어 종료 · 주황색: 현재 노드' : 'Green outline: terminal word · orange: current node'}</p>
    <div className="tree-scroll">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={language === 'ko' ? '현재 트라이' : 'Current trie'}>
        <title>{String(step.variables.words) || '∅'}</title>
        {nodes.flatMap((node) => node.children.map((id) => {
          const child = nodes.find((item) => item.id === id)!;
          return <line key={`${node.id}-${id}`} x1={node.x} y1={node.y} x2={child.x} y2={child.y} stroke="#cbd7ce" strokeWidth={2} />;
        }))}
        {nodes.map((node) => <motion.g key={node.id} animate={{ x: node.x, y: node.y }} transition={{ duration: .24 }}>
          <title>{node.depth === 0 ? 'ROOT' : node.prefix}</title>
          <circle r={17} fill={step.variables.activeNode === node.id ? '#d8964a' : '#eaf0e9'} stroke={node.complete ? '#42886c' : '#cddbd1'} strokeWidth={node.complete ? 4 : 1} />
          <text y={4} textAnchor="middle" fontSize={node.depth === 0 ? 8 : 13} fill="#305645">{node.depth === 0 ? 'ROOT' : node.character}</text>
        </motion.g>)}
      </svg>
    </div>
    {'word' in step.variables && <p>{language === 'ko' ? '현재 단어' : 'Current word'}: <strong>{String(step.variables.word)}</strong></p>}
    {'result' in step.variables && <div className="frontier">{language === 'ko' ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(step.variables.result)}</output></div>}
  </div>;
}
