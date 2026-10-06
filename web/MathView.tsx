import type { Language, Step } from './algorithms';

export default function MathView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const v = step.variables;
  if (v.mode !== 'bits') return <div className="math-view">
    {v.mode === 'sieve' && <div className="bucket-grid sieve-grid" role="list" aria-label={ko ? '소수 체' : 'Prime sieve'}>{(JSON.parse(String(v.isPrime)) as boolean[]).map((candidate, number) => <div role="listitem" key={number} className={`bucket-cell ${!candidate ? 'composite-number' : (JSON.parse(String(v.primes)) as number[]).includes(number) ? 'prime-number' : ''} ${v.current === number ? 'active-bucket' : ''}`} aria-label={`${number}: ${!candidate ? ko ? '제외' : 'excluded' : (JSON.parse(String(v.primes)) as number[]).includes(number) ? ko ? '소수' : 'prime' : ko ? '후보' : 'candidate'}`}><strong>{number}</strong></div>)}</div>}
    {v.mode === 'liu' && <svg className="liu-circle" viewBox="-1.15 -1.15 2.3 2.3" role="img" aria-label={ko ? `단위원과 내접 ${v.sides}각형` : `Unit circle with inscribed ${v.sides}-gon`}><circle r="1" fill="none" stroke="#bac8bf" strokeWidth="0.015" /><polygon points={Array.from({ length: Number(v.sides) }, (_, i) => `${Math.cos(i * 2 * Math.PI / Number(v.sides))},${Math.sin(i * 2 * Math.PI / Number(v.sides))}`).join(' ')} fill="#eaf0e9" stroke="#315f48" strokeWidth="0.012" /><line x1="0" y1="0" x2="1" y2="0" stroke="#bc8a45" strokeWidth="0.012" /><text x="0.42" y="-0.04" fontSize="0.12" fill="#615c50">r = 1</text></svg>}
    {v.mode === 'pascal'  && <div className="string-scroll"><div className="pascal-triangle" role="list" aria-label={ko ? '파스칼 삼각형' : 'Pascal triangle'}>{(JSON.parse(String(v.triangle)) as number[][]).map((row, rowIndex) => <div className="string-row" role="listitem" key={rowIndex} aria-label={`${ko ? '행' : 'Row'} ${rowIndex}`}>{row.map((value, column) => <div className={`string-cell ${step.type !== 'done' && rowIndex === Number(v.row) && column === Number(v.column ?? 0) ? 'current-character' : ''} ${step.type === 'add' && rowIndex === Number(v.row) - 1 && (column === Number(v.column) || column === Number(v.column) - 1) ? 'matched-character' : ''}`} key={column}><strong>{value}</strong></div>)}</div>)}</div></div>}
    <p className="math-expression">{String(v.expression ?? '')}</p>
    <table className="graph-table"><caption>{ko ? '현재 계산 상태' : 'Current computation state'}</caption><thead><tr><th>{ko ? '변수' : 'Variable'}</th><th>{ko ? '값' : 'Value'}</th></tr></thead><tbody>{(JSON.parse(String(v.cells ?? '[]')) as [string, string | number][]).map(([label, value]) => <tr key={label}><th>{label}</th><td>{String(value)}</td></tr>)}</tbody></table>
    {v.mode === 'primality' && <table className="graph-table"><caption>{ko ? '검사한 약수와 나머지' : 'Tested divisors and remainders'}</caption><thead><tr><th>{ko ? '약수 후보' : 'Divisor candidate'}</th><th>{ko ? '나머지' : 'Remainder'}</th></tr></thead><tbody>{(JSON.parse(String(v.checks)) as number[][]).map(([divider, remainder]) => <tr key={divider} className={divider === Number(v.divider) ? 'active-row' : undefined}><td>{divider}</td><td>{remainder}</td></tr>)}</tbody></table>}
    {v.mode === 'fibonacci' && <div className="string-scroll"><div className="string-row" role="list" aria-label={ko ? '현재 피보나치 수열' : 'Current Fibonacci sequence'}>{(JSON.parse(String(v.sequence)) as number[]).map((value, index) => <div key={index} role="listitem" className={`string-cell ${index === Number(v.index ?? v.n) ? 'current-character' : ''}`} style={{ minWidth: `${Math.max(36, String(value).length * 8 + 12)}px` }}><small>{index}</small><strong>{value}</strong></div>)}</div></div>}
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
