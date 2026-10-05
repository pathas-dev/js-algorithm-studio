import type { Step, Language } from './algorithms';
import { display } from './StringView';

export default function DpView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const v = step.variables;
  const matrix: (number | null)[][] = JSON.parse(String(v.dpMatrix));
  const rows: string[] = JSON.parse(String(v.rows));
  const columns: string[] = JSON.parse(String(v.columns));
  const dependencies: number[][] = JSON.parse(String(v.dependencies));
  return <div className="dp-view">
    <p>{ko ? '셀은 두 접두사의 답 · 주황색은 현재 셀 · 초록색은 참조 셀 · —는 아직 계산 전' : 'Cells answer prefix subproblems · orange: current · green: referenced · —: not calculated yet'}</p>
    <div className="matrix-scroll"><table className="graph-table" data-testid="dp-table">
      <caption>{ko ? '열: 첫 문자열의 접두사 · 행: 두 번째 문자열의 접두사 · UTF-16 단위' : 'Columns: prefixes of the first string · rows: prefixes of the second · UTF-16 units'}</caption>
      <thead><tr><th scope="col">∅</th>{columns.map((c, i) => <th scope="col" key={i}>{i}<br />{display(c)}</th>)}</tr></thead>
      <tbody>{matrix.map((row, i) => <tr key={i}><th scope="row">{i} · {display(rows[i])}</th>{row.map((value, j) => <td key={j} className={v.row === i && v.column === j ? 'active-cell' : dependencies.some(([r, c]) => r === i && c === j) ? 'dependency-cell' : ''} aria-current={v.row === i && v.column === j ? 'step' : undefined}>{value ?? '—'}</td>)}</tr>)}</tbody>
    </table></div>
    {v.mode === 'lcs' && <p>{ko ? '역추적으로 복원한 부분 수열' : 'Subsequence recovered by traceback'}: <strong data-testid="dp-sequence">{String(v.sequence) || '∅'}</strong></p>}
    {v.mode === 'edit' && step.type === 'cell-min' && <p data-testid="edit-costs">{ko ? `삭제 ${v.deletion} · 삽입 ${v.insertion} · ${v.indicator === 0 ? '그대로' : '치환'} ${v.substitution}` : `Delete ${v.deletion} · insert ${v.insertion} · ${v.indicator === 0 ? 'keep' : 'substitute'} ${v.substitution}`}</p>}
    {'result' in v && <div className="frontier">{ko ? '결과' : 'Result'} <output data-testid="dp-result">{String(v.result) || '∅'}</output>{'length' in v && <span>{ko ? '길이' : 'Length'}: {v.length}</span>}</div>}
  </div>;
}
