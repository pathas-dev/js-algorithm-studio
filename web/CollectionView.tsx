import type { Language, Step } from './algorithms';
import ArrayView from './ArrayView';

export default function CollectionView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const v = step.variables;
  if (v.groups === undefined) return <ArrayView step={step} language={language} />;
  const inputs: (string | number)[][] = JSON.parse(String(v.inputs));
  const groups: (string | number)[][] = JSON.parse(String(v.groups));
  const selection: (string | number)[] = JSON.parse(String(v.selection ?? '[]'));
  const subset = v.mode === 'power-set' || v.mode === 'combination';
  const maskMode = v.mode === 'power-set';
  return <div className="collection-view">
    {v.mode === 'combination' && <p className="fourier-expression">{ko ? '현재 하위 문제' : 'Current subproblem'} · n = {v.size}, k = {v.k}</p>}
    {v.mode === 'permutation' && <p className="fourier-expression">{ko ? '현재 하위 문제' : 'Current subproblem'} · n = {v.size} / {v.originalSize}</p>}
    {maskMode && step.type !== 'done' && <p className="fourier-expression">mask = {v.mask} · {Number(v.mask).toString(2).padStart(Math.max(1, inputs[0].length), '0')}</p>}
    <div className="collection-inputs">{inputs.map((items, setIndex) => <div key={setIndex}><p>{setIndex === 0 ? 'A' : 'B'}</p><div className="string-row" role="list" aria-label={`${ko ? '집합' : 'Set'} ${setIndex === 0 ? 'A' : 'B'}`}>{items.map((value, index) => <div className={`string-cell ${index === Number(setIndex === 0 ? v.indexA : v.indexB) ? 'current-character' : selection.includes(value) ? 'matched-character' : ''}`} key={index} role="listitem">{maskMode && step.type !== 'done' && <small>{index} · {(Number(v.mask) >> index) & 1}</small>}<strong>{value}</strong></div>)}{!items.length && <span>∅</span>}</div></div>)}</div>
    <p className="frontier">{ko ? '생성한 결과' : 'Generated results'} <strong>{v.count}</strong></p>
    <div className="collection-results" role="list" aria-label={v.mode === 'combination' ? ko ? '현재 하위 문제의 조합' : 'Current subproblem combinations' : v.mode === 'permutation' ? ko ? '현재 하위 문제의 순열' : 'Current subproblem permutations' : subset ? ko ? '생성한 부분집합' : 'Generated subsets' : ko ? '생성한 순서쌍' : 'Generated ordered pairs'}>{groups.map((group, index) => <div role="listitem" key={index} className={step.type !== 'done' && index === groups.length - 1 ? 'active-group' : ''}>{subset ? group.length ? `{${group.join(', ')}}` : '∅' : `(${group.join(', ')})`}</div>)}{!groups.length && <span>∅</span>}</div>
  </div>;
}
