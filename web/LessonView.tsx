import PuzzleView from './PuzzleView';
import WeightedView from './WeightedView';
import SeamView from './SeamView';
import LearningView from './LearningView';
import CipherView from './CipherView';
import LinkedListView from './LinkedListView';
import TreeView from './TreeView';
import CollectionView from './CollectionView';
import MathView from './MathView';
import GraphView from './GraphView';
import BucketView from './BucketView';
import HeapView from './HeapView';
import ArrayView from './ArrayView';
import StructureView from './StructureView';
import StringView from './StringView';
import DpView from './DpView';
import type { Algorithm, Language, Step } from './algorithms';

export default function LessonView({ algorithm, step, language }: { algorithm: Algorithm; step: Step; language: Language }) {
  return <>
    {'buckets' in step.variables && <BucketView step={step} language={language} />}
    {'heapSize' in step.variables && algorithm.category !== 'structure' && <HeapView step={step} language={language} />}
    {algorithm.category === 'other' ? <PuzzleView step={step} language={language} /> : algorithm.category === 'statistics' ? <WeightedView step={step} language={language} /> : algorithm.category === 'image-processing' ? <SeamView step={step} language={language} /> : algorithm.category === 'ml' ? <LearningView step={step} language={language} /> : algorithm.category === 'cryptography' ? <CipherView step={step} language={language} /> : algorithm.category === 'linked-list' ? <LinkedListView step={step} language={language} /> : algorithm.category === 'tree' ? <TreeView step={step} language={language} /> : algorithm.category === 'sets' ? <CollectionView step={step} language={language} /> : algorithm.category === 'dp' || 'dpMatrix' in step.variables ? <DpView step={step} language={language} /> : algorithm.category === 'math' ? <MathView step={step} language={language} /> : algorithm.category === 'string' ? <StringView step={step} language={language} /> : algorithm.category === 'graph' ? <GraphView step={step} language={language} weighted={algorithm.graphWeighted ?? false} /> : algorithm.category === 'structure' ? <StructureView step={step} language={language} /> : <ArrayView step={step} language={language} />}
  </>;
}
