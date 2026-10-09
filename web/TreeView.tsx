import PlanetMark from './PlanetMark';
import { motion } from 'motion/react';
import type { Step, Language } from './algorithms';
import TreeSpaceView from './TreeSpaceView';

type Node = { id: number; value: number; depth: number; left: number; right: number; balance?: number; height?: number; color?: string };

export default function TreeView({ step, language }: { step: Step; language: Language }) {
  const tree: Node[] = JSON.parse(String(step.variables.tree));
  const traversal = step.variables.structure === 'binary-tree';
  const ordered: Node[] = [];
  const orderNodes = (id: number) => {
    const node = tree.find((item) => item.id === id);
    if (!node) return;
    orderNodes(node.left); ordered.push(node); orderNodes(node.right);
  };
  if (traversal && tree.length) orderNodes(tree.find((node) => node.depth === 0)!.id);
  else ordered.push(...[...tree].sort((a, b) => a.value - b.value));
  const seenIds: number[] = JSON.parse(String(step.variables.seenIds ?? '[]'));
  const width = traversal ? Math.max(320, tree.length * 48 + 60) : Math.max(600, tree.length * 50 + 40);
  const avl = step.variables.structure === 'avl-tree';
  const rb = step.variables.structure === 'red-black-tree';
  const nodes = tree.map((node) => ({ ...node, x: 30 + (ordered.findIndex((item) => item.id === node.id) + .5) / Math.max(1, tree.length) * (width - 60), y: 35 + node.depth * (avl || rb ? 75 : 55) }));
  const height = Math.max(110, ...nodes.map((node) => node.y + (avl || rb ? 50 : 35)));
  return <div className="structure-view"><TreeSpaceView step={step} language={language}>
    <p>{traversal ? language === 'ko' ? '레벨 순서 이진 트리 · 주황: 현재 · 초록: 방문한 노드' : 'Level-order binary tree · orange: current · green: visited' : rb ? language === 'ko' ? 'R = 빨강 · B = 검정 · ? = 색 배정 전 · 주황 테두리는 현재 노드 · 빈 자식은 검정' : 'R = red · B = black · ? = uncolored · orange outline marks current node · null children are black' : avl ? language === 'ko' ? 'AVL · b = 왼쪽 높이 − 오른쪽 높이 · 균형 복구 후 |b| ≤ 1' : 'AVL · b = left height − right height · |b| ≤ 1 after repair' : language === 'ko' ? '왼쪽 < 현재 값 < 오른쪽 · ROOT부터 탐색' : 'Left < current value < right · search from ROOT'}</p>
    <div className="tree-scroll">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={traversal ? language === 'ko' ? '순회 중인 이진 트리' : 'Binary tree traversal' : rb ? language === 'ko' ? '현재 레드–블랙 트리' : 'Current red–black tree' : avl ? language === 'ko' ? '현재 AVL 트리' : 'Current AVL tree' : language === 'ko' ? '현재 이진 검색 트리' : 'Current binary search tree'}>
        <title>{String(traversal ? step.variables.order : step.variables.inorder) || '∅'}</title>
        {nodes.flatMap((node) => [node.left, node.right].filter((id) => id >= 0).map((id) => {
          const child = nodes.find((item) => item.id === id)!;
          return <line key={`${node.id}-${id}`} x1={node.x} y1={node.y} x2={child.x} y2={child.y} stroke="#526b60" strokeWidth={2} />;
        }))}
        {nodes.map((node, index) => <motion.g key={node.id} animate={{ x: node.x, y: node.y }} transition={{ duration: .24 }}>
          <PlanetMark r={18} fill={traversal ? step.indices.includes(index) ? '#d6b476' : seenIds.includes(node.id) ? '#8faf9d' : '#82968c' : rb ? node.color === 'red' ? '#b54343' : node.color === 'black' ? '#263d34' : '#a6b4ad' : step.indices.includes(index) ? '#d6b476' : '#8faf9d'} stroke={rb && step.indices.includes(index) ? '#d6b476' : 'none'} strokeWidth={3} />
          <text textAnchor="middle" y={4} fontSize={12} fill={rb ? "white" : "#0b1012"}>{node.value}</text>
          {avl && <text textAnchor="middle" y={32} fontSize={10} fill={Math.abs(node.balance!) > 1 ? '#b45309' : '#a3b0a7'}>b={node.balance} · h={node.height}</text>}
          {rb && <text textAnchor="middle" y={32} fontSize={10} fill="#a3b0a7">{node.color === 'red' ? 'R' : node.color === 'black' ? 'B' : '?'}</text>}
          {node.depth === 0 && <text textAnchor="middle" y={-25} fontSize={9} fill="#a3b0a7">ROOT</text>}
        </motion.g>)}
        {!nodes.length && <text x={width / 2} y={55} textAnchor="middle" fill="#a3b0a7">ROOT = ∅</text>}
      </svg>
    </div>
    </TreeSpaceView>
    {traversal && <div className="frontier">{step.variables.mode === 'tree-bfs' ? language === 'ko' ? '대기 큐 · FRONT → REAR' : 'Queue · FRONT → REAR' : language === 'ko' ? '호출 스택 · 루트 → 현재' : 'Call stack · root → current'} <strong>{step.variables.mode === 'tree-bfs' ? (JSON.parse(String(step.variables.queue)) as number[]).join(' → ') || '∅' : String(step.variables.stack) || '∅'}</strong></div>}
    {'result' in step.variables && <div className="frontier">{traversal ? language === 'ko' ? '방문 순서' : 'Visit order' : language === 'ko' ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(traversal ? step.variables.order : step.variables.result) || '∅'}</output></div>}
  </div>;
}
