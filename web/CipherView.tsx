import MathView from './MathView';
import type { Language, Step } from './algorithms';

export default function CipherView({ step, language }: { step: Step; language: Language }) {
  const v = step.variables;
  const ko = language === 'ko';
  const characters = Array.from(String(v.text));
  if (v.mode === 'hill') return <div className="cipher-view"><MathView step={{ ...step, variables: { ...v, mode: 'matrix-product', result: '—' } }} language={language} /><p className="fourier-expression">{ko ? '암호문' : 'Ciphertext'}: <output data-testid="cipher-output">{v.outputText || '—'}</output></p><p className="frontier">A = 0 · Z = 25 · mod 26 {step.type === 'encode' && <strong>{v.item} → {v.remainder}</strong>}</p></div>;
  if (v.mode === 'caesar') {
    const alphabet = Array.from('abcdefghijklmnopqrstuvwxyz');
    return <div className="collection-view cipher-view"><p className="frontier">{ko ? '이동 칸 수' : 'Shift'}: <strong>{v.shift}</strong> · mod 26</p><div className="matrix-scroll"><table className="graph-table"><caption>{ko ? '알파벳 치환표' : 'Alphabet substitution'}</caption><tbody><tr><th>A</th>{alphabet.map((letter) => <td key={letter} className={letter === v.char && step.type !== 'done' ? 'active-cell' : ''}>{letter}</td>)}</tr><tr><th>B</th>{alphabet.map((letter, index) => <td key={letter} className={letter === v.char && step.type !== 'done' ? 'dependency-cell' : ''}>{alphabet[((index + Number(v.shift)) % 26 + 26) % 26]}</td>)}</tr></tbody></table></div><div className="string-row">{String(v.text).split('').map((character, index) => <div key={index} className={`string-cell ${index === Number(v.index) && step.type !== 'done' ? 'current-character' : ''}`}><small>{index}</small><strong>{character === ' ' ? '␣' : character}</strong></div>)}</div><p className="fourier-expression">{ko ? '암호문' : 'Ciphertext'}: <output data-testid="cipher-output">{v.output || '—'}</output></p>{step.type === 'done' && <p className="frontier">{ko ? '복원 · 소문자' : 'Restored · lowercase'}: {v.restored}</p>}</div>;
  }
  if (v.mode === 'rail-fence') {
    const grid: string[][] = JSON.parse(String(v.grid));
    return <div className="collection-view cipher-view"><p className="frontier">{ko ? '지그재그 배치 → 행 순서로 읽기' : 'Zigzag placement → read in row order'} <strong>{v.rails} rails</strong></p><div className="matrix-scroll"><table className="graph-table"><tbody>{grid.map((rail, row) => <tr key={row}><th>R{row + 1}</th>{rail.map((letter, column) => <td key={column} className={row === Number(v.currentRail) && (step.type === 'read' || column === Number(v.column)) ? 'active-cell' : ''}>{letter === ' ' ? '␣' : letter || '·'}</td>)}</tr>)}</tbody></table></div><p className="fourier-expression">{ko ? '암호문' : 'Ciphertext'}: <output data-testid="cipher-output">{v.output || '—'}</output></p>{step.type === 'done' && <p className="frontier">{ko ? '복원 확인' : 'Restored'}: {v.restored}</p>}</div>;
  }
  const rows: [number, string, number][] = JSON.parse(String(v.rows));
  return <div className="collection-view cipher-view">
    <p className="frontier"><span>base = {v.base}</span><span>mod = {v.modulus}</span><strong>{ko ? '현재 해시' : 'Current hash'}: {v.hash}</strong></p>
    <div className="string-row" aria-label={ko ? '입력 문자열과 현재 창' : 'Input text and current window'}>{characters.map((character, index) => <div key={index} className={`string-cell ${index === Number(v.windowStart) + Number(v.charIndex) && step.type === 'hash' ? 'current-character' : index >= Number(v.windowStart) && index < Number(v.windowStart) + Number(v.width) ? 'matched-character' : ''}`}><small>{index}</small><strong>{character === ' ' ? '␣' : character}</strong></div>)}</div>
    <p className="fourier-expression">h = (h × 37 + {ko ? '문자값' : 'character value'}) mod 101</p>
    <table className="graph-table" data-testid="hash-windows"><caption>{ko ? '완료한 창 · 처음부터 계산한 해시와 일치' : 'Completed windows · verified against fresh hashes'}</caption><thead><tr><th>{ko ? '시작 위치' : 'Start'}</th><th>{ko ? '창' : 'Window'}</th><th>hash</th></tr></thead><tbody>{rows.map(([start, word, hash]) => <tr key={start} className={start === Number(v.windowStart) ? 'active-cell' : ''}><td>{start}</td><td>{word}</td><td>{hash}</td></tr>)}</tbody></table>
  </div>;
}
