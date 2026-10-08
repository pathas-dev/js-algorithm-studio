import type { Step, Language } from './algorithms';
import PlanetMark from './PlanetMark';

export default function FenwickView({ step, language }: { step: Step; language: Language }) {
  const values: number[] = JSON.parse(String(step.variables.fenwick));
  const ko = language === 'ko';
  return <div className="structure-view">
    <div className="tree-scroll">
      {values.length > 1 && <svg width={Math.max(600, values.length * 34)} height={values.length * 32} role="img" aria-label={ko ? '펜윅 담당 구간의 탑뷰 · 선분은 저장 구간' : 'Top view of Fenwick ranges · segments show stored ranges'}>
        {values.slice(1).map((value, index) => {
          const i = index + 1; const lowbit = i & -i; const y = i * 32;
          return <g key={i}><line x1={(i - lowbit + 1) * 34} y1={y} x2={i * 34} y2={y} stroke="#526b60" strokeWidth="2" /><PlanetMark cx={i * 34} cy={y} r={11} fill={step.variables.i === i ? '#d6b476' : '#82968c'} /><text x={i * 34 + 17} y={y + 4} fontSize="11" fill="#e2e7d9">{`tree[${i}] = ${value} · [${i - lowbit + 1}, ${i}]`}</text></g>;
        })}
      </svg>}
      <table className="graph-table">
        <caption>{ko ? '펜윅 트리 · 1부터 시작하는 인덱스 · tree[0]은 미사용' : 'Fenwick tree · 1-based indices · tree[0] unused'}</caption>
        <thead><tr><th>i</th><th>i & -i</th><th>{ko ? '담당 구간' : 'Stored range'}</th><th>tree[i]</th></tr></thead>
        <tbody>{values.slice(1).map((value, index) => {
          const i = index + 1;
          const lowbit = i & -i;
          return <tr key={i} className={step.variables.i === i ? 'active-row' : ''}><th>{i}</th><td>{lowbit}</td><td>{i - lowbit + 1}–{i}</td><td>{value}</td></tr>;
        })}</tbody>
      </table>
      {values.length === 1 && <p>{ko ? '빈 트리 · 인덱스를 지정하는 연산은 값 입력 후 실행하세요' : 'Empty tree · add input values before indexed operations'}</p>}
    </div>
    {'sum' in step.variables && <div className="frontier">{ko ? '누적 합' : 'Running sum'} <output>{String(step.variables.sum)}</output></div>}
    {'result' in step.variables && <div className="frontier">{ko ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(step.variables.result)}</output></div>}
  </div>;
}
