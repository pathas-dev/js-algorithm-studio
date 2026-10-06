import type { Step, Language } from './algorithms';
import { display } from './StringView';

export default function DpView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const v = step.variables;
  const matrix: (number | boolean | null)[][] = JSON.parse(String(v.dpMatrix));
  const rows: string[] = JSON.parse(String(v.rows));
  const columns: string[] = JSON.parse(String(v.columns));
  const dependencies: number[][] = JSON.parse(String(v.dependencies));
  return <div className="dp-view">
    <p>{ko ? '주황색은 현재 셀 · 초록색은 참조 셀 · —는 아직 계산 전' : 'Orange: current cell · green: referenced cell · —: not calculated yet'}</p>
    <div className="matrix-scroll"><table className="graph-table" data-testid="dp-table">
      <caption>{v.mode === 'partition' ? ko ? '열: 목표 합 · 행: 사용 가능한 최대 정수 · 순서 무관' : 'Columns: target sum · rows: maximum available summand · order ignored' : v.mode === 'regex' ? ko ? '열: 패턴 접두사 · 행: 문자열 접두사 · T: 일치 / F: 불일치' : 'Columns: pattern prefixes · rows: string prefixes · T: match / F: mismatch' : v.mode === 'substring' ? ko ? '열: 첫 문자열 · 행: 둘째 문자열 · 유니코드 코드 포인트 · 현재 위치에서 끝나는 연속 길이' : 'Columns: first string · rows: second string · Unicode code points · contiguous length ending here' : v.mode === 'knapsack' ? ko ? '열: 허용 무게 · 행: 정렬된 물건의 접두사 · #은 최초 입력 번호' : 'Columns: capacity · rows: sorted item prefixes · # is the original input number' : ko ? '열: 첫 문자열의 접두사 · 행: 두 번째 문자열의 접두사 · UTF-16 단위' : 'Columns: prefixes of the first string · rows: prefixes of the second · UTF-16 units'}</caption>
      <thead><tr><th scope="col">∅</th>{columns.map((c, i) => <th scope="col" key={i}>{['knapsack', 'partition'].includes(String(v.mode)) ? c : <>{i}<br />{display(c)}</>}</th>)}</tr></thead>
      <tbody>{matrix.map((row, i) => <tr key={i}><th scope="row">{v.mode === 'partition' ? rows[i] : <>{i} · {v.mode === 'knapsack' ? rows[i] : display(rows[i])}</>}</th>{row.map((value, j) => <td key={j} className={v.row === i && v.column === j ? 'active-cell' : dependencies.some(([r, c]) => r === i && c === j) ? 'dependency-cell' : ''} aria-current={v.row === i && v.column === j ? 'step' : undefined}>{typeof value === 'boolean' ? value ? 'T' : 'F' : value ?? '—'}</td>)}</tr>)}</tbody>
    </table></div>
    {v.mode === 'lcs' && <p>{ko ? '역추적으로 복원한 부분 수열' : 'Subsequence recovered by traceback'}: <strong data-testid="dp-sequence">{String(v.sequence) || '∅'}</strong></p>}
    {v.mode === 'edit' && step.type === 'cell-min' && <p data-testid="edit-costs">{ko ? `삭제 ${v.deletion} · 삽입 ${v.insertion} · ${v.indicator === 0 ? '그대로' : '치환'} ${v.substitution}` : `Delete ${v.deletion} · insert ${v.insertion} · ${v.indicator === 0 ? 'keep' : 'substitute'} ${v.substitution}`}</p>}
    {v.mode === 'knapsack' && <p data-testid="knapsack-selection">{ko ? '선택한 물건' : 'Selected items'}: {JSON.parse(String(v.selected)).map((r: number) => rows[r]).join(', ') || '∅'}{'totalWeight' in v && ` · ${ko ? '총 무게' : 'Total weight'} ${v.totalWeight}`}</p>}
    {'result' in v && <div className="frontier">{ko ? '결과' : 'Result'} <output data-testid="dp-result">{String(v.result) || '∅'}</output>{'length' in v && <span>{ko ? '길이' : 'Length'}: {v.length}</span>}</div>}
  </div>;
}
