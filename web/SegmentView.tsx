import type { Step, Language } from './algorithms';

type Node = { position: number; left: number; right: number; value: number | null };

export default function SegmentView({ step, language }: { step: Step; language: Language }) {
  const tree: Node[] = JSON.parse(String(step.variables.segments));
  const width = Math.max(600, step.array.length * 44 + 60);
  const nodes = tree.map((node) => ({ ...node, x: 30 + (node.left + node.right + 1) / (2 * step.array.length) * (width - 60), y: 30 + Math.floor(Math.log2(node.position + 1)) * 62 }));
  const height = Math.max(110, ...nodes.map((node) => node.y + 42));
  return <div className="structure-view">
    <p>{language === 'ko' ? '구간 합 · 각 노드 아래는 [왼쪽, 오른쪽] 인덱스' : 'Range sums · [left, right] indices below each node'}</p>
    <div className="tree-scroll">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={language === 'ko' ? '현재 구간 트리' : 'Current segment tree'}>
        <title>{nodes.map((node) => `[${node.left},${node.right}]:${node.value ?? '∅'}`).join(', ')}</title>
        {nodes.filter((node) => node.position > 0).map((node) => {
          const parent = nodes.find((item) => item.position === Math.floor((node.position - 1) / 2))!;
          return <line key={node.position} x1={parent.x} y1={parent.y} x2={node.x} y2={node.y} stroke="#cbd7ce" strokeWidth={2} />;
        })}
        {nodes.map((node) => <g key={node.position} transform={`translate(${node.x},${node.y})`} opacity={step.type === 'none' && step.variables.position === node.position ? .4 : 1}>
          <circle r={17} fill={step.variables.position === node.position ? '#d8964a' : node.value === null ? '#a9bcb0' : '#326f54'} />
          <text y={4} textAnchor="middle" fontSize={11} fill="white">{node.value ?? '∅'}</text>
          <text y={33} textAnchor="middle" fontSize={9} fill="#617469">[{node.left}, {node.right}]</text>
        </g>)}
        {!nodes.length && <text x={width / 2} y={50} textAnchor="middle" fill="#617469">∅</text>}
      </svg>
    </div>
    {'result' in step.variables && <div className="frontier">{language === 'ko' ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(step.variables.result)}</output></div>}
  </div>;
}
