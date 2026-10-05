import { motion } from 'motion/react';
import type { Step, Language } from './algorithms';
import HeapView from './HeapView';
import TreeView from './TreeView';
import TrieView from './TrieView';
import FenwickView from './FenwickView';
import SegmentView from './SegmentView';
import HashView from './HashView';
import LinkedListView from './LinkedListView';
import GraphView from './GraphView';

export default function StructureView({ step, language }: { step: Step; language: Language }) {
  if (step.variables.structure === 'disjoint-set') {
    const nodes: { value: number; parent: number | null; root: number; size: number }[] = JSON.parse(String(step.variables.setNodes));
    const ko = language === 'ko';
    return <div><p>{ko ? '자식 → 부모 연결 · 초록: 대표 · 파랑: 구성원 · 주황: 검사 중' : 'Child → parent links · green: representative · blue: member · orange: current'}</p><GraphView step={step} language={language} />
      <table className="graph-table" data-testid="set-table"><caption>{ko ? '실제 부모와 대표 · size는 해당 노드 아래 원소 수' : 'Actual parent and representative · size counts the node’s subtree'}</caption><thead><tr><th>{ko ? '값' : 'Value'}</th><th>{ko ? '부모' : 'Parent'}</th><th>{ko ? '대표' : 'Root'}</th><th>size</th></tr></thead><tbody>{nodes.map((node, i) => <tr key={node.value} className={step.indices.includes(i) ? 'active-bucket' : undefined}><td>{node.value}</td><td>{node.parent ?? '∅'}</td><td>{node.root}</td><td>{node.size}</td></tr>)}</tbody></table>
      {'result' in step.variables && <div className="frontier">{ko ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(step.variables.result)}</output></div>}
    </div>;
  }
  if (step.variables.structure === 'hash-table') return <HashView step={step} language={language} />;
  if (step.variables.structure === 'segment-tree') return <SegmentView step={step} language={language} />;
  if (step.variables.structure === 'fenwick') return <FenwickView step={step} language={language} />;
  if (step.variables.structure === 'trie') return <TrieView step={step} language={language} />;
  if ('tree' in step.variables) return <TreeView step={step} language={language} />;
  if ('links' in step.variables) return <LinkedListView step={step} language={language} />;
  if (['heap', 'max-heap', 'priority-queue'].includes(String(step.variables.structure))) return <><HeapView step={step} language={language} />{'result' in step.variables && <div className="frontier">{language === 'ko' ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(step.variables.result)}</output></div>}</>;
  const ko = language === 'ko';
  const stack = step.variables.structure === 'stack';
  return <div className="structure-view">
    <p>{stack ? ko ? 'TOP · 위 → 아래 · 마지막에 넣은 값부터 꺼냅니다' : 'TOP · top → bottom · last in, first out' : ko ? 'FRONT → REAR · 먼저 넣은 값부터 꺼냅니다' : 'FRONT → REAR · first in, first out'}</p>
    <div className={`structure-nodes ${stack ? 'stack-nodes' : ''}`} role="list" aria-label={ko ? '현재 자료 구조' : 'Current data structure'}>
      {step.array.map((item, index) => <motion.div layout="position" key={item.id} className={`structure-node ${step.indices.includes(index) ? 'active-node' : ''}`} role="listitem">
        <span>{index === 0 ? stack ? 'TOP' : step.array.length === 1 ? 'FRONT / REAR' : 'FRONT' : !stack && index === step.array.length - 1 ? 'REAR' : index}</span><strong>{item.value}</strong>
      </motion.div>)}
      {!step.array.length && <div className="empty-array">{ko ? '비어 있음 · 조회·삭제 결과는 null' : 'Empty · peek / removal returns null'}</div>}
    </div>
    {'result' in step.variables && <div className="frontier">{ko ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(step.variables.result)}</output></div>}
  </div>;
}
