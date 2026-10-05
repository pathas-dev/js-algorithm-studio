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
  return <div className="string-view">
    <p>{ko ? 'UTF-16 코드 단위 · 인덱스는 0부터 · ␠는 공백 · 서로게이트는 16진수로 표시' : 'UTF-16 code units · indices start at 0 · ␠ means space · surrogate units appear in hex'}</p>
    <div className="string-scroll"><div style={{ minWidth: Math.max(1, text.length, alignment + pattern.length) * 36 }}>
      <div className="string-row" role="list" aria-label={ko ? '텍스트' : 'Text'}>{text.map((character, index) => <div key={index} role="listitem" className={`string-cell ${step.indices.includes(index) ? 'current-character' : ''} ${match >= 0 && index >= match && index < match + pattern.length ? 'matched-character' : ''}`}><small>{index}</small><strong>{display(character)}</strong></div>)}{!text.length && <span>∅</span>}</div>
      <div className="string-row pattern-row" style={{ marginLeft: alignment * 36 }} role="list" aria-label={ko ? '패턴' : 'Pattern'}>{pattern.map((character, index) => <div key={index} role="listitem" className={`string-cell ${step.variables.wordIndex === index ? 'current-character' : ''}`}><strong>{display(character)}</strong><small>{index}</small></div>)}{!pattern.length && <span>{ko ? '빈 패턴 → 인덱스 0' : 'Empty pattern → index 0'}</span>}</div>
    </div></div>
    {'result' in step.variables && <div className="frontier">{ko ? '검색 결과 · -1은 없음' : 'Search result · -1 means absent'} <output data-testid="string-result">{String(step.variables.result)}</output></div>}
  </div>;
}
