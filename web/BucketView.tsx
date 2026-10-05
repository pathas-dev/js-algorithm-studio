import type { Step, Language } from './algorithms';

export default function BucketView({ step, language }: { step: Step; language: Language }) {
  const ko = language === 'ko';
  const buckets: (number | number[])[] = JSON.parse(String(step.variables.buckets));
  const output: (number | null)[] | undefined = step.variables.output === undefined ? undefined : JSON.parse(String(step.variables.output));
  const cumulative = step.type === 'prefix';
  const offset = ['offset', 'place'].includes(step.type);
  return <div className="bucket-view">
    <p>{'digit' in step.variables ? ko ? `버킷 · 오른쪽 ${step.variables.digit}번째 자릿수` : `Buckets · digit ${step.variables.digit} from the right` : ko ? offset ? '버킷 · 다음 출력 위치' : cumulative ? '버킷 · 누적 빈도' : '버킷 · 빈도' : offset ? 'Buckets · next output position' : cumulative ? 'Buckets · cumulative frequency' : 'Buckets · frequency'}</p>
    <div className="bucket-grid" role="list" aria-label={ko ? '현재 버킷' : 'Current buckets'}>
      {buckets.map((bucket, index) => <div key={index} role="listitem" className={`bucket-cell ${step.variables.bucket === index ? 'active-bucket' : ''}`}>
        <span>{index + Number(step.variables.minimum ?? 0)}</span><strong>{Array.isArray(bucket) ? bucket.join(', ') || '∅' : bucket}</strong>
      </div>)}
    </div>
    {output && <><p>{ko ? '출력 배열 · ∅는 아직 비어 있는 위치' : 'Output · ∅ means an empty position'}</p><div className="bucket-grid" data-testid="bucket-output">
      {output.map((value, index) => <div key={index} className={`bucket-cell ${step.variables.position === index ? 'active-bucket' : ''}`}><span>{index}</span><strong>{value ?? '∅'}</strong></div>)}
    </div></>}
  </div>;
}
