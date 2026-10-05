import { motion } from 'motion/react';
import type { Step, Language } from './algorithms';
import HeapView from './HeapView';
import TreeView from './TreeView';
import TrieView from './TrieView';
import FenwickView from './FenwickView';
import SegmentView from './SegmentView';
import LinkedListView from './LinkedListView';

export default function StructureView({ step, language }: { step: Step; language: Language }) {
  if (step.variables.structure === 'segment-tree') return <SegmentView step={step} language={language} />;
  if (step.variables.structure === 'fenwick') return <FenwickView step={step} language={language} />;
  if (step.variables.structure === 'trie') return <TrieView step={step} language={language} />;
  if (step.variables.structure === 'binary-search-tree') return <TreeView step={step} language={language} />;
  if (step.variables.structure === 'linked-list') return <LinkedListView step={step} language={language} />;
  if (['heap', 'priority-queue'].includes(String(step.variables.structure))) return <><HeapView step={step} language={language} />{'result' in step.variables && <div className="frontier">{language === 'ko' ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(step.variables.result)}</output></div>}</>;
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
