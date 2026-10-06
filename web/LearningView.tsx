import type { Language, Step } from './algorithms';

export default function LearningView({ step, language }: { step: Step; language: Language }) {
  const v = step.variables;
  const ko = language === 'ko';
  const points: number[][] = JSON.parse(String(v.points));
  const labels: number[] = JSON.parse(String(v.labels));
  const query: number[] = JSON.parse(String(v.query));
  const nearest: { index: number; dist: number; label: number }[] = JSON.parse(String(v.nearest));
  const distances: { index: number; dist: number; label: number }[] = JSON.parse(String(v.distances));
  const all = [...points, query];
  const minX = Math.min(...all.map((point) => point[0])) - 1;
  const maxX = Math.max(...all.map((point) => point[0])) + 1;
  const minY = Math.min(...all.map((point) => point[1])) - 1;
  const maxY = Math.max(...all.map((point) => point[1])) + 1;
  const x = (value: number) => 30 + (value - minX) / (maxX - minX) * 300;
  const y = (value: number) => 190 - (value - minY) / (maxY - minY) * 160;
  const colors = ['#39765a', '#a66925', '#587f9d', '#855f97', '#b35e64', '#66763b'];
  return <div className="learning-view"><svg viewBox="0 0 360 220" role="img" aria-label={ko ? '학습 점과 질의 점의 좌표' : 'Training and query coordinates'}>
    <path d="M30 20 V190 H340" fill="none" stroke="#c5d1c6" />
    {nearest.map((point) => <line key={point.index} x1={x(points[point.index][0])} y1={y(points[point.index][1])} x2={x(query[0])} y2={y(query[1])} stroke="#b5cbbd" strokeDasharray="4 3" />)}
    {points.map((point, index) => <g key={index}><circle cx={x(point[0])} cy={y(point[1])} r={Number(v.current) === index && step.type !== 'done' ? 8 : 5} fill={colors[labels[index]]} stroke={Number(v.current) === index && step.type !== 'done' ? '#d49a34' : 'none'} strokeWidth="3" /><text x={x(point[0]) + 9} y={y(point[1]) - 6} fontSize="10" fill="#405649">P{index} · {labels[index]}</text></g>)}
    <text x={x(query[0])} y={y(query[1]) + 5} textAnchor="middle" fontSize="19" fill="#182d24">◆</text>
    <text x={30} y={208} fontSize="10" fill="#617469">x: {minX} … {maxX} · y: {minY} … {maxY}</text>
  </svg><p className="frontier">◆ ({query.join(', ')}) · k = {v.k} <strong data-testid="learning-result">{step.type === 'done' ? `${ko ? '예측 클래스' : 'Predicted class'}: ${v.result}` : ko ? '분류 중' : 'Classifying'}</strong></p><table className="graph-table"><caption>{ko ? '거리와 이웃 선택' : 'Distances and neighbor selection'}</caption><thead><tr><th>{ko ? '점' : 'Point'}</th><th>{ko ? '거리' : 'Distance'}</th><th>{ko ? '라벨' : 'Label'}</th><th>{ko ? '선택' : 'Selected'}</th></tr></thead><tbody>{distances.map((point) => <tr key={point.index} className={Number(v.current) === point.index && step.type !== 'done' ? 'active-row' : ''}><td>P{point.index}</td><td>{point.dist}</td><td>{point.label}</td><td>{nearest.some((item) => item.index === point.index) ? '✓' : '—'}</td></tr>)}</tbody></table><p className="frontier">{ko ? '라벨별 표수' : 'Votes by label'}: {Object.entries(JSON.parse(String(v.counts))).map(([label, count]) => `${label}: ${count}`).join(' · ') || '—'}</p></div>;
}
