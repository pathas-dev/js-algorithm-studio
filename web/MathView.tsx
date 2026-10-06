import type { Language, Step } from './algorithms';

export default function MathView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const v = step.variables;
  if (v.mode !== 'bits') return <div className="math-view">
    <p className="math-expression">{String(v.expression ?? '')}</p>
    <table className="graph-table"><caption>{ko ? '현재 계산 상태' : 'Current computation state'}</caption><thead><tr><th>{ko ? '변수' : 'Variable'}</th><th>{ko ? '값' : 'Value'}</th></tr></thead><tbody>{(JSON.parse(String(v.cells ?? '[]')) as [string, string | number][]).map(([label, value]) => <tr key={label}><th>{label}</th><td>{String(value)}</td></tr>)}</tbody></table>
    {'result' in v && <div className="frontier">{ko ? '결과' : 'Result'} <output data-testid="math-result">{String(v.result)}</output></div>}
  </div>;
  const width = Math.max(8, Number(v.number).toString(2).length, Number(v.result).toString(2).length);
  const rows = [[ko ? '입력' : 'Input', Number(v.number)], [ko ? '결과' : 'Result', Number(v.result)]] as const;
  return <div className="math-view">
    <p>{ko ? `비트 ${v.position} 선택 · 오른쪽부터 0 · ${step.type === 'start' || step.type === 'done' ? '원래 입력' : step.type}` : `Selected bit ${v.position} · zero from the right · ${step.type === 'start' || step.type === 'done' ? 'original input' : step.type}`}</p>
    <div className="string-scroll">{rows.map(([label, value]) => <div key={label}>
      <div className="frontier"><span>{label}</span><strong>{value}</strong></div>
      <div className="string-row" role="list" aria-label={label} style={{ minWidth: width * 36 }}>
        {value.toString(2).padStart(width, '0').split('').map((bit, index) => <div role="listitem" key={index} className={`string-cell ${width - index - 1 === Number(v.position) ? 'current-character' : ''}`}><small>{width - index - 1}</small><strong>{bit}</strong></div>)}
      </div>
    </div>)}</div>
    {step.type === 'done' && <table className="graph-table"><caption>{ko ? '같은 입력에 적용한 각 연산의 결과' : 'Independent results for the same input'}</caption><thead><tr><th>{ko ? '연산' : 'Operation'}</th><th>{ko ? '십진수' : 'Decimal'}</th><th>{ko ? '이진수' : 'Binary'}</th></tr></thead><tbody>{Object.entries(JSON.parse(String(v.results))).map(([name, value]) => <tr key={name}><th>{name}</th><td>{Number(value)}</td><td>{Number(value).toString(2)}</td></tr>)}</tbody></table>}
  </div>;
}
