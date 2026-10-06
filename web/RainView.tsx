import type { Language, Step } from './algorithms';

export default function RainView({ step, language }: { step: Step; language: Language }) {
  const v = step.variables; const ko = language === 'ko';
  const water: number[] = JSON.parse(String(v.water));
  const left: number[] = JSON.parse(String(v.left));
  const right: number[] = JSON.parse(String(v.right));
  const max = Math.max(1, ...step.array.map((item) => item.value));
  const scale = 150 / max;
  return <div className="puzzle-view"><p className="frontier">{ko ? '누적 물' : 'Accumulated water'} <strong data-testid="puzzle-result">{v.waterAmount}</strong> · {ko ? '파란 영역 = 물, 초록 영역 = 지형' : 'Blue = water, green = terrain'}</p><svg viewBox={`0 0 ${step.array.length * 28 + 20} 210`} role="img" aria-label={ko ? '지형 위에 고인 빗물' : 'Water trapped above terrain'}>{step.array.map((item, index) => <g key={item.id}><rect x={10 + index * 28} y={170 - item.value * scale} width="26" height={item.value * scale} fill="#8eac97" /><rect x={10 + index * 28} y={170 - (item.value + water[index]) * scale} width="26" height={water[index] * scale} fill="#a7c9dd" /><text x={23 + index * 28} y={160 - (item.value + water[index]) * scale} textAnchor="middle" fontSize="10" fill="#3d5d49">{item.value}</text><text x={23 + index * 28} y="193" textAnchor="middle" fontSize="10" fill={Number(v.current) === index ? '#a56c20' : '#617469'}>{index}</text>{Number(v.current) === index && <path d={`M${14 + index * 28} 200h18`} stroke="#c28d36" strokeWidth="3" />}</g>)}</svg><div className="matrix-scroll"><table className="graph-table"><tbody>{[[ko ? '왼쪽 최대' : 'Left max', left], [ko ? '오른쪽 최대' : 'Right max', right], [ko ? '물 높이' : 'Water', water]].map(([label, values]) => <tr key={String(label)}><th>{String(label)}</th>{(values as number[]).map((value, index) => <td key={index} className={index === Number(v.current) ? 'active-cell' : ''}>{value}</td>)}</tr>)}</tbody></table></div></div>;
}
