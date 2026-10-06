import type { Language, Step } from './algorithms';

export default function SeamView({ step, language }: { step: Step; language: Language }) {
  const v = step.variables; const ko = language === 'ko';
  const image: number[][] = JSON.parse(String(v.image));
  const seam: { x: number; y: number }[] = JSON.parse(String(v.seam));
  const energy: (number | null)[][] = JSON.parse(String(v.energyMap));
  const totals: (number | null)[][] = JSON.parse(String(v.totals));
  const removed = ['remove', 'done'].includes(step.type);
  return <div className="seam-view"><p className="frontier">{ko ? '현재 크기' : 'Current size'} <strong data-testid="image-size">{v.w} × {v.h}</strong> → {v.toWidth} × {v.h}</p><svg viewBox={`0 0 ${image[0].length * 38} ${image.length * 38}`} role="img" aria-label={ko ? '현재 회색조 이미지와 제거할 심' : 'Current grayscale image and seam to remove'}>{image.map((row, y) => row.map((value, x) => <g key={`${x}-${y}`}><rect x={x * 38 + 1} y={y * 38 + 1} width="36" height="36" fill={`rgb(${value},${value},${value})`} stroke={seam.some((pixel) => pixel.x === x && pixel.y === y) ? '#e37458' : x === Number(v.x) && y === Number(v.y) && !removed ? '#dfa33d' : 'none'} strokeWidth="3" /><text x={x * 38 + 19} y={y * 38 + 23} fontSize="10" textAnchor="middle" fill={value > 130 ? '#172d24' : '#fff'}>{value}</text></g>))}</svg>{!removed && [energy, totals].map((matrix, index) => !!matrix.length && <div className="matrix-scroll" key={index}><table className="graph-table"><caption>{index === 0 ? ko ? '픽셀 에너지 · 좌우 RGB 차이' : 'Pixel energy · left/right RGB differences' : ko ? '누적 최소 비용 · DP' : 'Cumulative minimum cost · DP'}</caption><tbody>{matrix.map((row, y) => <tr key={y}>{row.map((value, x) => <td key={x} className={seam.some((pixel) => pixel.x === x && pixel.y === y) ? 'dependency-cell' : x === Number(v.x) && y === Number(v.y) ? 'active-cell' : ''}>{value === null ? '—' : Number(value.toFixed(1))}</td>)}</tr>)}</tbody></table></div>)}</div>;
}
