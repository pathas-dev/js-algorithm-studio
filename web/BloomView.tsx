import type { Step, Language } from './algorithms';

export default function BloomView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  return <div className="structure-view">
    <p>{ko ? '16비트 · 3개 해시 · 0이 하나라도 있으면 확실히 없음 · 모두 1이면 있을 수 있음' : '16 bits · 3 hashes · any 0 means definitely absent · all 1 means possibly present'}</p>
    <div className="bloom-bits" role="list" aria-label={ko ? '블룸 필터 비트 배열' : 'Bloom filter bits'}>{step.array.map((item, index) => <div key={item.id} role="listitem" className={`bloom-bit ${item.value ? 'set-bit' : ''} ${step.indices.includes(index) ? 'active-bit' : ''}`}><small>{index}</small><strong>{item.value}</strong></div>)}</div>
    <div className="frontier">{ko ? '학습용 삽입 기록' : 'Teaching insertion record'} <output data-testid="bloom-words">[{String(step.variables.words)}]</output></div>
    <p>{ko ? '삽입 기록은 정답 확인용이며 블룸 필터 자체가 저장하는 정보가 아닙니다.' : 'The insertion record checks ground truth for this lesson; the filter itself does not store it.'}</p>
    {'result' in step.variables && <div className="frontier">mayContain <output data-testid="operation-result">{String(step.variables.result)}</output> · {step.variables.falsePositive ? ko ? '거짓 양성 · 실제로 넣지 않은 단어' : 'False positive · never inserted' : step.variables.result ? ko ? '실제로 삽입한 단어 · 필터의 true만으로는 확정 불가' : 'Actually inserted · true alone cannot prove presence' : ko ? '확실히 없음' : 'Definitely absent'}</div>}
  </div>;
}
