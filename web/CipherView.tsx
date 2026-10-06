import type { Language, Step } from './algorithms';

export default function CipherView({ step, language }: { step: Step; language: Language }) {
  const v = step.variables;
  const ko = language === 'ko';
  const characters = Array.from(String(v.text));
  const rows: [number, string, number][] = JSON.parse(String(v.rows));
  return <div className="collection-view">
    <p className="frontier"><span>base = {v.base}</span><span>mod = {v.modulus}</span><strong>{ko ? '현재 해시' : 'Current hash'}: {v.hash}</strong></p>
    <div className="string-row" aria-label={ko ? '입력 문자열과 현재 창' : 'Input text and current window'}>{characters.map((character, index) => <div key={index} className={`string-cell ${index === Number(v.windowStart) + Number(v.charIndex) && step.type === 'hash' ? 'current-character' : index >= Number(v.windowStart) && index < Number(v.windowStart) + Number(v.width) ? 'matched-character' : ''}`}><small>{index}</small><strong>{character === ' ' ? '␣' : character}</strong></div>)}</div>
    <p className="fourier-expression">h = (h × 37 + {ko ? '문자값' : 'character value'}) mod 101</p>
    <table className="graph-table" data-testid="hash-windows"><caption>{ko ? '완료한 창 · 처음부터 계산한 해시와 일치' : 'Completed windows · verified against fresh hashes'}</caption><thead><tr><th>{ko ? '시작 위치' : 'Start'}</th><th>{ko ? '창' : 'Window'}</th><th>hash</th></tr></thead><tbody>{rows.map(([start, word, hash]) => <tr key={start} className={start === Number(v.windowStart) ? 'active-cell' : ''}><td>{start}</td><td>{word}</td><td>{hash}</td></tr>)}</tbody></table>
  </div>;
}
