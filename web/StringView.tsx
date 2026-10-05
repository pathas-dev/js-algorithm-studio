import type { Step, Language } from './algorithms';

function display(character: string) {
  const code = character.charCodeAt(0);
  if (code >= 0xd800 && code <= 0xdfff) return code.toString(16).toUpperCase();
  return character === ' ' ? '␠' : character === '\t' ? '⇥' : character === '\n' ? '↵' : character;
}

export default function StringView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const text = String(step.variables.text).split('');
  const pattern = String(step.variables.pattern).split('');
  const alignment = Number(step.variables.alignment);
  const match = Number(step.variables.matchIndex ?? -1);
  const building = step.variables.phase === 'prefix';
  const table: number[] = JSON.parse(String(step.variables.table ?? '[]'));
  return <div className="string-view">
    <p>{ko ? 'UTF-16 코드 단위 · 인덱스는 0부터 · ␠는 공백 · 서로게이트는 16진수로 표시' : 'UTF-16 code units · indices start at 0 · ␠ means space · surrogate units appear in hex'}</p>
    {building && <p>{ko ? '패턴 접두사 표 작성 중 · 텍스트 검색 전' : 'Building the pattern prefix table · text search has not started'}</p>}
    <div className="string-scroll"><div style={{ minWidth: Math.max(1, text.length, alignment + pattern.length) * 36 }}>
      <div className="string-row" role="list" aria-label={ko ? '텍스트' : 'Text'}>{text.map((character, index) => <div key={index} role="listitem" className={`string-cell ${step.indices.includes(index) ? 'current-character' : ''} ${match >= 0 && index >= match && index < match + pattern.length ? 'matched-character' : ''}`}><small>{index}</small><strong>{display(character)}</strong></div>)}{!text.length && <span>∅</span>}</div>
      <div className="string-row pattern-row" style={{ marginLeft: alignment * 36 }} role="list" aria-label={ko ? '패턴' : 'Pattern'}>{pattern.map((character, index) => <div key={index} role="listitem" className={`string-cell ${(building ? step.variables.prefixIndex === index || step.variables.suffixIndex === index : step.variables.wordIndex === index) ? 'current-character' : ''}`}><strong>{display(character)}</strong><small>{index}</small></div>)}{!pattern.length && <span>{ko ? '빈 패턴 → 인덱스 0' : 'Empty pattern → index 0'}</span>}</div>
    </div></div>
    {step.variables.mode === 'kmp' && <div className="matrix-scroll"><table className="graph-table" data-testid="prefix-table">
      <caption>{ko ? '접두사 표 · 자신보다 짧은 접두사와 접미사가 같은 최대 길이' : 'Prefix table · longest proper prefix that is also a suffix'}</caption>
      <thead><tr>{pattern.map((c, i) => <th key={i}>{i} · {display(c)}</th>)}</tr></thead>
      <tbody><tr>{pattern.map((_, i) => <td key={i} className={step.variables.lookup === i || (building && step.variables.suffixIndex === i) ? 'active-cell' : ''}>{table[i] ?? '—'}</td>)}</tr></tbody>
    </table></div>}
    {'result' in step.variables && <div className="frontier">{ko ? '검색 결과 · -1은 없음' : 'Search result · -1 means absent'} <output data-testid="string-result">{String(step.variables.result)}</output></div>}
  </div>;
}
