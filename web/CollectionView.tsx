import type { Language, Step } from './algorithms';
import ArrayView from './ArrayView';

export default function CollectionView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const v = step.variables;
  if (v.groups === undefined) return <ArrayView step={step} language={language} />;
  const inputs: (string | number)[][] = JSON.parse(String(v.inputs));
  const groups: (string | number)[][] = JSON.parse(String(v.groups));
  return <div className="collection-view">
    <div className="collection-inputs">{inputs.map((items, setIndex) => <div key={setIndex}><p>{setIndex === 0 ? 'A' : 'B'}</p><div className="string-row" role="list" aria-label={`${ko ? '집합' : 'Set'} ${setIndex === 0 ? 'A' : 'B'}`}>{items.map((value, index) => <div className={`string-cell ${index === Number(setIndex === 0 ? v.indexA : v.indexB) ? 'current-character' : ''}`} key={index} role="listitem"><strong>{value}</strong></div>)}{!items.length && <span>∅</span>}</div></div>)}</div>
    <p className="frontier">{ko ? '생성한 결과' : 'Generated results'} <strong>{v.count}</strong></p>
    <div className="collection-results" role="list" aria-label={ko ? '생성한 순서쌍' : 'Generated ordered pairs'}>{groups.map((group, index) => <div role="listitem" key={index} className={step.type !== 'done' && index === groups.length - 1 ? 'active-group' : ''}>{`(${group.join(', ')})`}</div>)}{!groups.length && <span>∅</span>}</div>
  </div>;
}
