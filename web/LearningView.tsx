import type { Language, Step } from './algorithms';

export default function LearningView({ step, language }: { step: Step; language: Language }) {
  const v = step.variables;
  const ko = language === 'ko';
  const points: number[][] = JSON.parse(String(v.points));
  const labels: number[] = JSON.parse(String(v.labels));
  const means = v.mode === 'kmeans';
  const query: number[] = JSON.parse(String(v.query ?? '[]'));
  const centers: number[][] = JSON.parse(String(v.centers ?? '[]'));
  const nearest: { index: number; dist: number; label: number }[] = JSON.parse(String(v.nearest ?? '[]'));
  const distances: { index: number; dist: number; label: number }[] = JSON.parse(String(means ? '[]' : v.distances));
  const all = means ? [...points, ...centers] : [...points, query];
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
    {points.map((point, index) => <g key={index}><circle cx={x(point[0])} cy={y(point[1])} r={Number(v.current) === index && step.type !== 'done' ? 8 : 5} fill={labels[index] < 0 ? '#b4bdb5' : colors[labels[index]]} stroke={Number(v.current) === index && step.type !== 'done' ? '#d49a34' : 'none'} strokeWidth="3" /><text x={x(point[0]) + 9} y={y(point[1]) - 6} fontSize="10" fill="#405649">P{index} · {labels[index] < 0 ? '—' : labels[index]}</text></g>)}
    {centers.map((center, index) => <g key={index}><path d={`M${x(center[0]) - 7} ${y(center[1])}h14 M${x(center[0])} ${y(center[1]) - 7}v14`} stroke={colors[index]} strokeWidth="3" /><text x={x(center[0]) - 10} y={y(center[1]) + 18} fontSize="11" fill={colors[index]}>C{index}</text></g>)}
    {!means && <><text x={x(query[0])} y={y(query[1]) + 5} textAnchor="middle" fontSize="19" fill="#182d24">◆</text></>}
    <text x={30} y={208} fontSize="10" fill="#617469">x: {minX} … {maxX} · y: {minY} … {maxY}</text>
  </svg>{means ? <><p className="frontier">{ko ? '회차' : 'Iteration'} {v.iteration} · k = {v.k} <strong data-testid="learning-result">{step.type === 'done' ? String(v.result) : ko ? '배정 → 평균 갱신' : 'Assign → update means'}</strong></p><table className="graph-table"><caption>{ko ? '군집 중심 · + 표시' : 'Cluster centers · + markers'}</caption><thead><tr><th>C</th><th>x</th><th>y</th></tr></thead><tbody>{centers.map((center, index) => <tr key={index} className={index === Number(v.cluster) ? 'active-row' : ''}><td>C{index}</td><td>{center[0]}</td><td>{center[1]}</td></tr>)}</tbody></table>{step.type === 'assign' && <p className="frontier">P{v.current} → {ko ? '중심 거리' : 'Distances to centers'}: {(JSON.parse(String(v.distances)) as number[][])[Number(v.current)].join(' · ')}</p>}<p className="frontier">{ko ? '점별 군집 · 입력 순서' : 'Point assignments · input order'}: [{labels.join(', ')}]</p></> : <><p className="frontier">◆ ({query.join(', ')}) · k = {v.k} <strong data-testid="learning-result">{step.type === 'done' ? `${ko ? '예측 클래스' : 'Predicted class'}: ${v.result}` : ko ? '분류 중' : 'Classifying'}</strong></p><table className="graph-table"><caption>{ko ? '거리와 이웃 선택' : 'Distances and neighbor selection'}</caption><thead><tr><th>{ko ? '점' : 'Point'}</th><th>{ko ? '거리' : 'Distance'}</th><th>{ko ? '라벨' : 'Label'}</th><th>{ko ? '선택' : 'Selected'}</th></tr></thead><tbody>{distances.map((point) => <tr key={point.index} className={Number(v.current) === point.index && step.type !== 'done' ? 'active-row' : ''}><td>P{point.index}</td><td>{point.dist}</td><td>{point.label}</td><td>{nearest.some((item) => item.index === point.index) ? '✓' : '—'}</td></tr>)}</tbody></table><p className="frontier">{ko ? '라벨별 표수' : 'Votes by label'}: {Object.entries(JSON.parse(String(v.counts))).map(([label, count]) => `${label}: ${count}`).join(' · ') || '—'}</p></>}</div>;
}
