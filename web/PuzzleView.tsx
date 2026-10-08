import { lazy, Suspense } from 'react';
import ParenthesesView from './ParenthesesView';
import StockView from './StockView';
import ChessView from './ChessView';
import RainView from './RainView';
import DpView from './DpView';
import ArrayView from './ArrayView';
import type { Language, Step } from './algorithms';

const HanoiScene = lazy(() => import('./HanoiScene'));

export default function PuzzleView({ step, language }: { step: Step; language: Language }) {
  const v = step.variables; const ko = language === 'ko';
  if (['queens', 'knight'].includes(String(v.mode))) return <ChessView step={step} language={language} />;
  if (v.mode === 'parentheses') return <ParenthesesView step={step} language={language} />;
  if (v.mode === 'stocks') return <StockView step={step} language={language} />;
  if (v.mode === 'stairs') return <div><p className="frontier">{ko ? '마지막 1칸 이동 + 마지막 2칸 이동' : 'Ending in one step + ending in two steps'}<strong data-testid="puzzle-result">{v.result ?? '—'}</strong></p><div className="matrix-scroll"><table className="graph-table"><caption>{ko ? '계단별 도달 순서의 수' : 'Ordered ways to reach each stair'}</caption><thead><tr><th>n</th>{(JSON.parse(String(v.ways)) as number[]).map((_, index) => <th key={index}>{index}</th>)}</tr></thead><tbody><tr><th>{ko ? '경우' : 'Ways'}</th>{(JSON.parse(String(v.ways)) as number[]).map((value, index) => <td key={index} className={index === Number(v.current) ? 'active-cell' : step.type === 'cell-sum' && [Number(v.current) - 1, Number(v.current) - 2].includes(index) ? 'dependency-cell' : ''}>{step.type === 'start' || step.type !== 'done' && index > Math.max(2, Number(v.current)) ? '—' : value}</td>)}</tr></tbody></table></div></div>;
  if (v.mode === 'rain') return <RainView step={step} language={language} />;
  if (v.mode === 'paths') return <DpView step={step} language={language} />;
  if (v.mode === 'jump') return <div><p className="frontier">{ko ? '가장 왼쪽 좋은 위치' : 'Leftmost good position'} <strong>{v.leftGoodPosition}</strong>{'maxCurrentJumpLength' in v && <span>{ko ? '현재 최대 도착 위치' : 'Current maximum reach'}: {v.maxCurrentJumpLength}</span>}</p><ArrayView step={step} language={language} />{step.type === 'done' && <p className="frontier" data-testid="puzzle-result">{v.result ? ko ? '도달 가능' : 'Reachable' : ko ? '도달 불가' : 'Unreachable'}</p>}</div>;
  if (v.mode === 'rotation') return <div className="matrix-product">{[v.input, v.matrix].map((encoded, side) => <div key={side}><p>{side === 0 ? ko ? '원본' : 'Original' : ko ? '교환 중 → 90°' : 'Swapping → 90°'}</p><table className="graph-table" data-testid={side ? 'rotation-result' : undefined}><tbody>{(JSON.parse(String(encoded)) as number[][]).map((row, y) => <tr key={y}>{row.map((value, x) => <td key={x} className={side && step.type !== 'done' && ((y === Number(v.row) && x === Number(v.column)) || (y === Number(v.otherRow) && x === Number(v.otherColumn))) ? 'active-cell' : ''}>{value}</td>)}</tr>)}</tbody></table></div>)}</div>;
  const poles: number[][] = JSON.parse(String(v.poles));
  return <div className="puzzle-view"><p className="frontier">{ko ? '이동 횟수' : 'Moves'} <strong data-testid="puzzle-result">{v.moves} / {2 ** Number(v.n) - 1}</strong>{step.type === 'move' && <span>{'ABC'[Number(v.from)]} → {'ABC'[Number(v.to)]} · {ko ? '원판' : 'Disc'} {v.disc}</span>}</p><Suspense fallback={<div className="hanoi-stations">{poles.map((pole, index) => <div key={index}><strong>{'ABC'[index]}</strong><output>[{pole.join(', ')}]</output></div>)}</div>}><HanoiScene step={step} language={language} /></Suspense></div>;
}
