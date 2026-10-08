import PlanetMark from './PlanetMark';
import type { Language, Step } from './algorithms';

export default function StockView({ step, language }: { step: Step; language: Language }) {
  const v = step.variables; const ko = language === 'ko';
  const max = Math.max(1, ...step.array.map((item) => item.value));
  const x = (index: number) => 30 + index / Math.max(1, step.array.length - 1) * 320;
  const y = (price: number) => 170 - price / max * 140;
  const history: number[][] = JSON.parse(String(v.history));
  return <div className="puzzle-view"><p className="frontier">{ko ? '누적 이익' : 'Accumulated profit'} <strong data-testid="puzzle-result">{v.profit}</strong> · {ko ? '초록: 상승, 회색: 하락·동일' : 'Green: rise, gray: fall/flat'}</p><svg viewBox="0 0 380 205" role="img" aria-label={ko ? '날짜별 가격과 누적한 상승 구간' : 'Daily prices and accumulated rising intervals'}><path d="M30 20v150h325" stroke="#bdcdbf" fill="none" />{step.array.slice(1).map((item, index) => <line key={item.id} x1={x(index)} y1={y(step.array[index].value)} x2={x(index + 1)} y2={y(item.value)} stroke={Number(v.day) === index + 1 ? '#d6a346' : item.value > step.array[index].value ? '#7ba487' : '#c1c9c0'} strokeWidth="3" />)}{step.array.map((item, index) => <g key={item.id}><PlanetMark cx={x(index)} cy={y(item.value)} r="3" fill="#8faf9d" /><text x={x(index)} y={y(item.value) - 10} fontSize="10" textAnchor="middle" fill="#8faf9d">{item.value}</text><text x={x(index)} y="192" fontSize="10" textAnchor="middle" fill="#a3b0a7">{index}</text></g>)}</svg><table className="graph-table"><caption>{ko ? '상승분 누적 · 거래별 수익과 합계가 같음' : 'Accumulated rises · same total as completed trades'}</caption><thead><tr><th>{ko ? '날짜 구간' : 'Days'}</th><th>{ko ? '추가 이익' : 'Added gain'}</th><th>{ko ? '누적' : 'Total'}</th></tr></thead><tbody>{history.map(([day, gain, profit]) => <tr key={day} className={day === Number(v.day) ? 'active-row' : ''}><td>{day - 1} → {day}</td><td>+{gain}</td><td>{profit}</td></tr>)}</tbody></table></div>;
}
