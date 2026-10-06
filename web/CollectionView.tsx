import type { Language, Step } from './algorithms';
import ArrayView from './ArrayView';

export default function CollectionView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const v = step.variables;
  if (v.groups === undefined) return <div>{v.mode === 'maximum-subarray' && <div className="frontier"><span>{ko ? '현재 합' : 'Running sum'}: {v.currentSum}</span><strong>{ko ? '최선 합' : 'Best sum'}: {v.maxSum}</strong><span>{ko ? '최선 구간' : 'Best interval'}: {v.maxSum === '−∞' ? '∅' : `[${v.maxStartIndex}, ${v.maxEndIndex}]`}</span></div>}<ArrayView step={step} language={language} />{v.mode === 'lis' && <div className="matrix-scroll"><table className="graph-table" data-testid="lis-lengths"><caption>{ko ? '각 위치에서 끝나는 증가 수열 길이' : 'Increasing subsequence length ending at each position'}</caption><thead><tr><th>{ko ? '위치' : 'Index'}</th>{step.array.map((_, index) => <th key={index}>{index}</th>)}</tr></thead><tbody><tr><th>dp</th>{(JSON.parse(String(v.lengths)) as number[]).map((length, index) => <td key={index} className={index === Number(v.currentElementIndex) && step.type !== 'done' ? 'active-cell' : index === Number(v.previousElementIndex) && step.type !== 'done' ? 'dependency-cell' : ''}>{length}</td>)}</tr></tbody></table></div>}</div>;
  const inputs: (string | number)[][] = JSON.parse(String(v.inputs));
  const groups: (string | number)[][] = JSON.parse(String(v.groups));
  const selection: (string | number)[] = JSON.parse(String(v.selection ?? '[]'));
  const subset = v.mode === 'power-set' || v.mode === 'combination';
  const maskMode = v.mode === 'power-set';
  return <div className="collection-view">
    {v.mode === 'scs' && <p className="fourier-expression">LCS: {(JSON.parse(String(v.lcs)) as string[]).join('') || '∅'} · {ko ? '공통 문자는 한 번만 추가' : 'Include shared characters once'}</p>}
    {v.mode === 'combination'  && <p className="fourier-expression">{ko ? '현재 하위 문제' : 'Current subproblem'} · n = {v.size}, k = {v.k}</p>}
    {v.mode === 'permutation' && <p className="fourier-expression">{ko ? '현재 하위 문제' : 'Current subproblem'} · n = {v.size} / {v.originalSize}</p>}
    {maskMode && step.type !== 'done' && <p className="fourier-expression">mask = {v.mask} · {Number(v.mask).toString(2).padStart(Math.max(1, inputs[0].length), '0')}</p>}
    <div className="collection-inputs">{inputs.map((items, setIndex) => <div key={setIndex}><p>{setIndex === 0 ? 'A' : 'B'}</p><div className="string-row" role="list" aria-label={`${ko ? '집합' : 'Set'} ${setIndex === 0 ? 'A' : 'B'}`}>{items.map((value, index) => <div className={`string-cell ${index === Number(setIndex === 0 ? v.indexA : v.indexB) ? 'current-character' : selection.includes(value) ? 'matched-character' : ''}`} key={index} role="listitem">{maskMode && step.type !== 'done' && <small>{index} · {(Number(v.mask) >> index) & 1}</small>}<strong>{value}</strong></div>)}{!items.length && <span>∅</span>}</div></div>)}</div>
    <p className="frontier">{v.mode === 'scs' ? ko ? '현재 출력 길이' : 'Current output length' : ko ? '생성한 결과' : 'Generated results'} <strong>{v.count}</strong></p>
    <div className="collection-results" role="list" aria-label={v.mode === 'scs' ? ko ? '현재 상위 수열' : 'Current supersequence' : v.mode === 'combination' ? ko ? '현재 하위 문제의 조합' : 'Current subproblem combinations' : v.mode === 'permutation' ? ko ? '현재 하위 문제의 순열' : 'Current subproblem permutations' : subset ? ko ? '생성한 부분집합' : 'Generated subsets' : ko ? '생성한 순서쌍' : 'Generated ordered pairs'}>{groups.map((group, index) => <div role="listitem" key={index} className={step.type !== 'done' && index === groups.length - 1 ? 'active-group' : ''}>{v.mode === 'scs' ? group.join('') || '∅' : subset ? group.length ? `{${group.join(', ')}}` : '∅' : `(${group.join(', ')})`}</div>)}{!groups.length && <span>∅</span>}</div>
  </div>;
}
