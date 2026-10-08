import PlanetMark from './PlanetMark';
import type { Language, Step } from './algorithms';

export default function FourierView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const v = step.variables;
  const samples: number[] = JSON.parse(String(v.input));
  const coefficients: number[][] = JSON.parse(String(v.coefficients));
  const magnitudes = samples.map((_, k) => coefficients[k] ? Math.hypot(...coefficients[k]) : 0);
  if (step.type === 'contribution') magnitudes[Number(v.frequency)] = Math.hypot(Number(v.partialRe), Number(v.partialIm)) / samples.length;
  const sampleScale = Math.max(1, ...samples.map(Math.abs));
  const magnitudeScale = sampleScale;
  const restored: number[] = JSON.parse(String(v.restored ?? '[]'));
  return <div className="fourier-view">
    <p className="fourier-expression">{String(v.expression)}</p>
    <div className="fourier-charts">
      <figure><figcaption>{ko ? '시간 신호 · 샘플 t' : 'Time signal · sample t'}</figcaption><svg viewBox="0 0 320 100" role="img" aria-label={ko ? '입력 샘플 신호' : 'Input sample signal'}><line x1="10" y1="45" x2="310" y2="45" stroke="#526b60" /><polyline fill="none" stroke="#8faf9d" strokeWidth="2" points={samples.map((value, index) => `${20 + index * 280 / Math.max(1, samples.length - 1)},${45 - value / sampleScale * 30}`).join(' ')} />{samples.map((value, index) => <g key={index}><PlanetMark cx={20 + index * 280 / Math.max(1, samples.length - 1)} cy={45 - value / sampleScale * 30} r="4" fill={index === Number(v.timer) ? '#d6b476' : '#8faf9d'} /><text x={20 + index * 280 / Math.max(1, samples.length - 1)} y="94" textAnchor="middle" fontSize="11" fill="#a3b0a7">{index}</text></g>)}</svg></figure>
      <figure><figcaption>{ko ? '주파수 성분 크기 · 빈 k' : 'Coefficient magnitude · bin k'}</figcaption><svg viewBox="0 0 320 100" role="img" aria-label={ko ? '양쪽 주파수 스펙트럼' : 'Two-sided frequency spectrum'}><line x1="10" y1="78" x2="310" y2="78" stroke="#526b60" />{magnitudes.map((value, k) => <g key={k}><line x1={12 + (k + .5) * 296 / samples.length} y1="78" x2={12 + (k + .5) * 296 / samples.length} y2={78 - value / magnitudeScale * 60} stroke={k === Number(v.frequency) ? '#d6b476' : '#8faf9d'} strokeWidth="2" /><PlanetMark cx={12 + (k + .5) * 296 / samples.length} cy={78 - value / magnitudeScale * 60} r={4} fill={k === Number(v.frequency) ? '#d6b476' : '#8faf9d'} /><text x={12 + (k + 0.5) * 296 / samples.length} y="94" textAnchor="middle" fontSize="11" fill="#a3b0a7">{k}</text></g>)}</svg></figure>
    </div>
    <table className="graph-table"><caption>{ko ? '완성된 정규화 복소 계수' : 'Completed normalized complex coefficients'}</caption><thead><tr><th>k</th><th>Re</th><th>Im</th><th>|F[k]|</th></tr></thead><tbody>{coefficients.map(([re, im], k) => <tr key={k} className={k === Number(v.frequency) ? 'active-row' : undefined}><th>{k}</th><td>{Number(re.toPrecision(5))}</td><td>{Number(im.toPrecision(5))}</td><td>{Number(Math.hypot(re, im).toPrecision(5))}</td></tr>)}</tbody></table>
    {step.type === 'inverse' && <div className="frontier">{ko ? '복원 신호' : 'Reconstructed signal'} <output data-testid="fourier-restored">{restored.map((value) => Number(value.toPrecision(6))).join(', ')}</output></div>}
  </div>;
}
