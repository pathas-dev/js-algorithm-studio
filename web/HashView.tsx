import StorageView from './StorageView';
import { motion } from 'motion/react';
import type { Step, Language } from './algorithms';

export default function HashView({ step, language }: { step: Step; language: Language }) {
  const buckets: { key: string; value: string }[][] = JSON.parse(String(step.variables.hashTable));
  return <div className="structure-view">
    <p>{language === 'ko' ? '버킷별 연결 리스트 · 서로 다른 키도 같은 해시로 충돌할 수 있습니다' : 'Bucket chains · distinct keys may share a hash'}</p>
    <StorageView step={step} language={language}><div className="hash-buckets">{buckets.map((bucket, index) => <div key={index} className={`hash-bucket ${step.variables.keyHash === index ? 'active-node' : ''}`}>
      <span className="hash-index">{index}</span>
      <div className="hash-chain">{bucket.map((entry) => <motion.div layout="position" key={entry.key} className={`hash-entry ${step.type === 'probe' && step.variables.candidate === entry.key ? 'active-node' : ''}`}>
        <strong>{entry.key}</strong><span>{entry.value}</span>
      </motion.div>)}{!bucket.length && <span>∅</span>}</div>
    </div>)}</div></StorageView>
    {'result' in step.variables && <div className="frontier">{language === 'ko' ? '반환 값' : 'Returned value'} <output data-testid="operation-result">{String(step.variables.result)}</output></div>}
  </div>;
}
