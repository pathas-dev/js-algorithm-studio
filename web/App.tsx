import { useEffect, useReducer, useState } from 'react';
import { Badge, Button, Group, NativeSelect, Paper, Popover, Text, Textarea, TextInput, Title } from '@mantine/core';
import { MotionConfig } from 'motion/react';
import { MAX_VALUES, parseTarget, parseValues, playbackReducer } from '../src/visualization/playback';
import { algorithms, bubble, type Algorithm, type Language } from './algorithms';
import stepAction from '../src/visualization/step-action';
import { catalogCategories, plannedAlgorithms } from './catalog';
import { parseWords } from '../src/visualization/trie';
import { parseEdges, parseWeightedEdges } from '../src/visualization/graph';
import GraphView from './GraphView';
import BucketView from './BucketView';
import HeapView from './HeapView';
import ArrayView from './ArrayView';
import StructureView from './StructureView';
import CodePanel from './CodePanel';
import StringView from './StringView';
import DpView from './DpView';

function PlaybackIcon({ name }: { name: 'first' | 'previous' | 'play' | 'pause' | 'replay' | 'next' | 'last' }) {
  const paths = {
    first: 'M5 5v14M18 5l-9 7 9 7Z', previous: 'M15 5l-9 7 9 7',
    play: 'M8 5l11 7-11 7Z', pause: 'M8 5v14M16 5v14',
    replay: 'M4 10a8 8 0 1 1 1 8M4 4v6h6',
    next: 'M9 5l9 7-9 7', last: 'M19 5v14M6 5l9 7-9 7Z',
  };
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name]} /></svg>;
}

export default function App() {
  const [language, setLanguage] = useState<Language>('ko');
  const ko = language === 'ko';
  const t = (korean: string, english: string) => ko ? korean : english;
  const [algorithm, setAlgorithm] = useState<Algorithm>(bubble);
  const [input, setInput] = useState(bubble.example.join(', '));
  const [operationInput, setOperationInput] = useState('');
  const [targetInput, setTargetInput] = useState('3');
  const [directed, setDirected] = useState(false);
  const [edgeInput, setEdgeInput] = useState('');
  const [error, setError] = useState('');
  const [editingInput, setEditingInput] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);
  const [steps, setSteps] = useState(() => bubble.run(bubble.example));
  const [playback, dispatch] = useReducer(playbackReducer, { index: 0, playing: false, length: steps.length, speed: 1 });
  const step = steps[playback.index];
  const isSort = algorithm.category === 'sort';
  const arrayLesson = isSort || algorithm.category === 'search';
  const partialArray = isSort && 'depth' in step.variables;
  const [savedInput, setSavedInput] = useState<{ input: string; target: string; operations: string; edges: string; directed: boolean } | null>(null);
  const [stepTitle, reason] = algorithm.explain(step, language);
  const action = stepAction(algorithm, step, language, stepTitle, playback.index, steps.length);
  const distanceSummary = 'distances' in step.variables ? Object.entries(JSON.parse(String(step.variables.distances))).map(([node, distance]) => `${node}: ${distance ?? '∞'}`).join(', ') : undefined;
  const seek = (index: number) => { setWhyOpen(false); dispatch({ type: 'seek', index }); };
  const togglePlayback = () => { setWhyOpen(false); dispatch({ type: 'toggle' }); };

  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useEffect(() => {
    if (!playback.playing) return;
    const timer = window.setTimeout(() => dispatch({ type: 'tick' }), 950 / playback.speed);
    return () => window.clearTimeout(timer);
  }, [playback.playing, playback.index, playback.speed]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (editingInput || whyOpen) return;
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, a, [role="combobox"]')) return;
      if (event.key === 'ArrowLeft') seek(playback.index - 1);
      else if (event.key === 'ArrowRight') seek(playback.index + 1);
      else if (event.key === 'Home') seek(0);
      else if (event.key === 'End') seek(steps.length - 1);
      else if (event.key === ' ') togglePlayback();
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playback.index, steps.length, editingInput, whyOpen]);

  function apply(text: string, operations = operationInput) {
    try {
      let target;
      if (algorithm.category !== 'sort' && algorithm.usesStart !== false) {
        try { target = parseTarget(targetInput); } catch { throw new Error('target'); }
      }
      let next;
      if (algorithm.inputMode === 'text') {
        next = algorithm.run([text, targetInput]);
      } else if (algorithm.inputMode === 'words') {
        next = algorithm.run(parseWords(text), undefined, undefined, undefined, operations);
      } else {
        const values = parseValues(text);
        const edges = algorithm.category === 'graph' ? algorithm.graphWeighted ? parseWeightedEdges(edgeInput, values, directed) : parseEdges(edgeInput, values, directed) : undefined;
        next = algorithm.run(values, target, edges, directed, operations);
      }
      setSteps(next);
      setInput(text);
      setError('');
      setEditingInput(false);
      dispatch({ type: 'reset', length: next.length });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'invalid');
    }
  }

  function selectAlgorithm(next: Algorithm) {
    const trace = next.inputMode === 'text' || next.inputMode === 'words' ? next.run(next.example, undefined, undefined, undefined, next.operations) : next.run(next.example, next.target, next.graphEdges, next.graphDirected);
    setAlgorithm(next);
    setWhyOpen(false);
    setEditingInput(false);
    setOperationInput(next.operations ?? '');
    setTargetInput(next.inputMode === 'text' ? next.example[1] : String(next.target ?? 3));
    setDirected(next.graphDirected ?? false);
    setEdgeInput(next.graphEdges?.map((edge) => `${edge[0]}-${edge[1]}${next.graphWeighted ? `:${edge[2]}` : ''}`).join(', ') ?? '');
    setInput(next.inputMode === 'text' ? next.example[0] : next.example.join(', '));
    setError('');
    setSteps(trace);
    dispatch({ type: 'reset', length: trace.length });
  }

  function editInput() {
    seek(playback.index);
    setSavedInput({ input, target: targetInput, operations: operationInput, edges: edgeInput, directed });
    if (arrayLesson) setInput((partialArray ? steps[0].array : step.array).map((item) => item.value).join(', '));
    setError('');
    setEditingInput(true);
  }

  function cancelInput() {
    if (savedInput) {
      setInput(savedInput.input);
      setTargetInput(savedInput.target);
      setOperationInput(savedInput.operations);
      setEdgeInput(savedInput.edges);
      setDirected(savedInput.directed);
    }
    setError('');
    setEditingInput(false);
  }

  function randomize() {
    const values = [...new Set(Array.from({ length: 8 }, () => Math.floor(Math.random() * (algorithm.randomMax ?? 90)) + 1))];
    if (algorithm.requiresSorted) values.sort((a, b) => a - b);
    if (algorithm.category === 'structure') {
      setOperationInput('');
      apply(values.join(', '), '');
    } else apply(values.join(', '));
  }

  const errors: Record<string, string> = {
    'knapsack-input': t('물건은 무게:가치 형식으로 쉼표로 구분하세요. 최대 8개 · 무게 1~24 · 가치 0~999 · 허용 무게는 정수 0~24입니다.', 'Separate up to 8 weight:value items with commas. Weight 1–24 · value 0–999 · capacity integer 0–24.'),
    'empty-array': t('구간 트리에는 값을 최소 1개 입력하세요.', 'The segment tree requires at least one input value.'),
    positions: t('유효한 정수 인덱스를 입력하세요. 펜윅 트리는 1부터, 구간 트리는 0부터 시작합니다.', 'Enter a valid integer index. Fenwick indices start at 1; segment indices start at 0.'),
    'range-order': t('구간의 왼쪽 인덱스는 오른쪽 이하여야 합니다.', 'The left range index must not exceed the right index.'),
    'tree-limit': t('트리는 최대 12개의 서로 다른 노드를 표시합니다.', 'The tree supports at most 12 distinct nodes.'),
    'set-limit': t('분리 집합은 최대 12개의 서로 다른 값을 표시합니다.', 'Disjoint sets support at most 12 distinct values.'),
    'graph-self-loop': t('그래프 구조에서는 자기 자신으로 연결할 수 없습니다.', 'Self-loops are not supported in the graph structure lesson.'),
    'duplicate-edge': t('두 정점 사이에 이미 간선이 있습니다.', 'An edge already connects these vertices.'),
    'edge-limit': t('간선은 최대 24개까지 저장할 수 있습니다.', 'Store at most 24 edges.'),
    'missing-edge': t('삭제할 간선이 현재 그래프에 없습니다.', 'The edge to delete is absent from the graph.'),
    'duplicate-values': t('우선순위 큐의 값은 서로 달라야 합니다. 같은 값을 두 번 넣을 수 없습니다.', 'Priority queue values must be distinct; do not add the same value twice.'),
    'missing-value': t('연산에 필요한 값이 현재 자료 구조에 없습니다.', 'An item required by the operation is absent from the current structure.'),
    words: algorithm.id === 'hash-table' ? t('키와 값은 각각 16글자 이내여야 합니다. 초기 키는 쉼표 또는 공백으로 구분하세요.', 'Keys and values must have at most 16 code points. Separate initial keys with commas or spaces.') : t('단어는 쉼표 또는 공백으로 구분하고, 각 단어는 최대 16글자까지 입력하세요. 빈 항목은 허용하지 않습니다.', 'Separate words with commas or spaces; use at most 16 code points per word, without empty entries.'),
    'word-limit': algorithm.id === 'hash-table' ? t('최대 12개의 키를 저장할 수 있습니다.', 'Store at most 12 keys.') : t('현재 저장된 단어는 최대 12개까지 허용합니다.', 'Store at most 12 words.'),
    'trie-limit': t('트라이에는 최대 80개의 글자 노드를 표시합니다. 단어 수나 길이를 줄이세요.', 'The trie supports at most 80 character nodes. Use fewer or shorter words.'),
    operations: t('연산 형식이 잘못됐습니다. 아래 연산 예시를 사용하고 쉼표로 구분하세요.', 'Invalid operations. Use the supported examples below and separate commands with commas.'),
    'dp-strings': t('각 문자열은 최대 12개의 UTF-16 코드 단위까지 입력하세요.', 'Each string supports up to 12 UTF-16 code units.'),
    strings: t('UTF-16 코드 단위 기준으로 텍스트는 48개, 패턴은 16개까지 입력하세요.', 'Use at most 48 text and 16 pattern UTF-16 code units.'),
    'operations-limit': t('연산은 최대 64개까지 입력할 수 있습니다.', 'Use at most 64 operations.'),
    capacity: t('연산 중 저장된 값이 32개를 초과할 수 없습니다. 삭제 연산을 먼저 넣으세요.', 'The structure may hold at most 32 values. Remove values before adding more.'),
    cycle: t('방향 사이클이 있어 위상 정렬할 수 없습니다. 사이클을 만드는 간선을 제거하세요.', 'A directed cycle prevents topological ordering. Remove an edge from the cycle.'),
    'negative-weight': t('다익스트라에는 음수 가중치를 사용할 수 없습니다.', 'Dijkstra requires nonnegative weights.'),
    weights: t('가중치 간선은 1-2:7 형식으로 입력하세요. 가중치는 -999부터 999까지입니다.', 'Use weighted edges such as 1-2:7, with weights between -999 and 999.'),
    nonnegative: t('기수 정렬에는 0 이상의 정수만 입력할 수 있습니다.', 'Radix sort requires nonnegative integers.'),
    integers: t('이 알고리즘에는 정수만 입력할 수 있습니다.', 'This algorithm requires integers.'),
    buckets: t('최댓값과 최솟값의 차이는 63 이하여야 합니다. 최대 64개 버킷을 표시합니다.', 'The maximum minus minimum must be at most 63, giving at most 64 buckets.'),
    nodes: t('정점은 1부터 12 사이의 서로 다른 정수여야 합니다. 최대 12개, 최소 1개를 입력하세요.', 'Use 1–12 distinct integer vertices, labeled between 1 and 12.'),
    edges: t('간선은 1-2, 2-3 형식으로 입력하세요. 존재하는 정점끼리 연결하며 중복·자기 연결 없이 최대 24개까지 허용합니다.', 'Use edges such as 1-2, 2-3 between existing vertices. At most 24 edges; no duplicates or self-loops.'),
    start: t('시작 정점은 입력한 정점 중 하나여야 합니다.', 'The start vertex must be one of the input vertices.'),
    sorted: t('오름차순으로 정렬된 배열을 입력하세요.', 'Enter an array sorted in ascending order.'),
    target: t('목표 값으로 -999부터 999 사이의 숫자 하나를 입력하세요.', 'Enter one target number between -999 and 999.'),
    invalid: t('쉼표 또는 공백으로 구분한 숫자를 입력하세요. 빈 항목은 허용하지 않습니다.', 'Enter numbers separated by commas or spaces, without empty entries.'),
    limit: t(`최대 ${MAX_VALUES}개까지 입력할 수 있습니다.`, `Use at most ${MAX_VALUES} values.`),
    range: t('각 값은 -999부터 999 사이여야 합니다.', 'Each value must be between -999 and 999.'),
  };

  const inputLabel = algorithm.inputLabels?.[0][language] ?? (algorithm.inputMode === 'text' ? t('텍스트 입력', 'Text') : algorithm.category === 'graph' ? t('정점 입력', 'Vertices') : algorithm.id === 'hash-table' ? t('초기 키 입력', 'Initial keys') : algorithm.inputMode === 'words' ? t('초기 단어 입력', 'Initial words') : algorithm.category === 'structure' ? t('초기 값 입력', 'Initial values') : t('배열 입력', 'Array input'));

  return (
    <MotionConfig reducedMotion="user">
      <div className="studio">
        <header className="studio-header">
          <a className="brand" href="/"><img className="brand-mark" src="/favicon.svg" width="32" height="32" alt="" /> Algorithm Studio</a>
          <Group gap="md"><Text size="sm" c="dimmed" className="header-note">{t('작은 단계가 만드는 큰 이해', 'Small steps. Clear understanding.')}</Text>
            <Button variant="default" size="xs" onClick={() => { setWhyOpen(false); setLanguage(ko ? 'en' : 'ko'); }}>{ko ? 'English' : '한국어'}</Button>
          </Group>
        </header>
        <main>
          <div className="workspace">
            <NativeSelect className="mobile-catalog" label={t('알고리즘 선택', 'Choose an algorithm')} value={algorithm.id} data={catalogCategories.map((category) => ({ group: category.name[language], items: [...algorithms.filter((entry) => entry.category === category.id).map((entry) => ({ value: entry.id, label: entry.name[language] })), ...plannedAlgorithms.filter((entry) => entry.category === category.id).map((entry) => ({ value: entry.id, label: `${entry.name[language]} · ${t('준비 중', 'Coming soon')}`, disabled: true }))] }))} onChange={(event) => {
              const next = algorithms.find((entry) => entry.id === event.currentTarget.value);
              if (next) selectAlgorithm(next);
            }} />
            <nav className="catalog" aria-label={t('알고리즘 목록', 'Algorithms')}>
              {catalogCategories.map((category) => <div key={category.id} className="catalog-group">
                <Text size="xs" fw={700} c="dimmed" mb="sm" mt="md" className="catalog-label">{category.name[language]}</Text>
                {algorithms.filter((entry) => entry.category === category.id).map((entry) => <button key={entry.id} className={`algorithm-button ${entry.id === algorithm.id ? 'selected' : ''}`} aria-current={entry.id === algorithm.id ? 'page' : undefined} onClick={() => selectAlgorithm(entry)}>
                  <span>{entry.name[language]}</span><span className="algorithm-arrow">↗</span>
                </button>)}
                {plannedAlgorithms.filter((entry) => entry.category === category.id).map((entry) => <button key={entry.id} className="algorithm-button" disabled><span>{entry.name[language]}</span><span className="planned-status">{t('준비 중', 'Coming soon')}</span></button>)}
              </div>)}
              <Text size="xs" c="dimmed" mt="xl">{t(`현재 지원: ${algorithms.length}개 알고리즘`, `Available: ${algorithms.length} algorithms`)}</Text>
            </nav>
            <div className="lesson">
              <div className="lesson-heading">
                <div><Group gap="sm"><Title order={1}>{algorithm.name[language]}</Title><Badge color="teal" variant="light">{algorithm.category === 'sort' ? t('정렬', 'SORTING') : algorithm.category === 'search' ? t('검색', 'SEARCHING') : algorithm.category === 'graph' ? t('그래프', 'GRAPHS') : algorithm.category === 'string' ? t('문자열', 'STRINGS') : algorithm.category === 'dp' ? t('동적 계획', 'DYNAMIC PROGRAMMING') : t('자료 구조', 'DATA STRUCTURES')}</Badge></Group>
                  <Text size="sm" c="dimmed" mt={6}>{algorithm.summary[language]}</Text>
                </div>
                <Badge variant="outline" color="gray">{typeof algorithm.time === 'string' ? algorithm.time : algorithm.time[language]}</Badge>
              </div>
              <Paper withBorder className="playback-card" aria-label={t('재생 컨트롤', 'Playback controls')}>
                <fieldset className="playback-toolbar" disabled={editingInput}>
                  <div className="transport">
                    <Button variant="subtle" className="transport-button" aria-label={t('처음', 'First')} title={t('처음으로 · Home', 'First step · Home')} onClick={() => seek(0)} disabled={playback.index === 0}><PlaybackIcon name="first" /></Button>
                    <Button variant="subtle" className="transport-button" aria-label={t('이전', 'Previous')} title={t('이전 단계 · ←', 'Previous step · ←')} onClick={() => seek(playback.index - 1)} disabled={playback.index === 0}><PlaybackIcon name="previous" /></Button>
                    <Button className="play-button" onClick={togglePlayback} title={t('재생 / 일시정지 · Space', 'Play / pause · Space')} leftSection={<PlaybackIcon name={playback.playing ? 'pause' : playback.index === steps.length - 1 ? 'replay' : 'play'} />}>{playback.playing ? t('일시정지', 'Pause') : playback.index === steps.length - 1 ? t('다시 재생', 'Replay') : t('재생', 'Play')}</Button>
                    <Button variant="subtle" className="transport-button" aria-label={t('다음', 'Next')} title={t('다음 단계 · →', 'Next step · →')} onClick={() => seek(playback.index + 1)} disabled={playback.index === steps.length - 1}><PlaybackIcon name="next" /></Button>
                    <Button variant="subtle" className="transport-button" aria-label={t('마지막', 'Last')} title={t('마지막으로 · End', 'Last step · End')} onClick={() => seek(steps.length - 1)} disabled={playback.index === steps.length - 1}><PlaybackIcon name="last" /></Button>
                  </div>
                  <input className="timeline" type="range" min={0} max={steps.length - 1} value={playback.index} onChange={(event) => seek(Number(event.currentTarget.value))} aria-label={t('단계 타임라인', 'Step timeline')} aria-valuetext={`${playback.index + 1} / ${steps.length}: ${stepTitle}`} />
                  <div className="playback-meta">
                    <Text size="sm" className="step-counter" data-testid="step-counter">{t('단계', 'Step')} <strong>{playback.index + 1}</strong><span> / {steps.length}</span></Text>
                    <NativeSelect aria-label={t('재생 속도', 'Playback speed')} size="sm" value={String(playback.speed)} data={['0.5', '1', '2', '4'].map((value) => ({ value, label: `${value}×` }))} onChange={(event) => dispatch({ type: 'speed', speed: Number(event.currentTarget.value) })} />
                  </div>
                </fieldset>
              </Paper>
              <section className="step-action" data-step={step.type} aria-label={t('단계 해설', 'Step explanation')}>
            <Text className="action-name" fw={700}>{action[0]}</Text>
            <output className="action-evidence">{action[1]}</output>
            <div className="action-decision"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 12h16m-6-6 6 6-6 6" /></svg><Text data-testid="step-action">{action[2]}</Text></div>
            <Popover opened={whyOpen} onChange={setWhyOpen} position="bottom-end" width={380} trapFocus returnFocus withArrow shadow="md">
              <Popover.Target><Button className="why-button" variant="subtle" aria-expanded={whyOpen} aria-label={t('왜? 단계 해설 열기', 'Why? Open step explanation')} onClick={() => { dispatch({ type: 'seek', index: playback.index }); setWhyOpen(!whyOpen); }}>{t('왜?', 'Why?')}</Button></Popover.Target>
              <Popover.Dropdown className="step-why" role="dialog" aria-label={t('상세 단계 해설', 'Detailed step explanation')}>
                <Group justify="space-between"><Text fw={700}>{stepTitle}</Text><Button variant="subtle" size="xs" onClick={() => setWhyOpen(false)}>{t('닫기', 'Close')}</Button></Group>
                <Text className="step-reason" data-testid="step-reason">{reason}</Text>
                <Group gap="xs" mt="sm">{Object.entries(step.variables).filter(([name]) => ['i', 'j', 'swapped', 'index', 'position', 'current', 'next', 'value', 'target', 'result', 'priority', 'gap', 'depth', 'bucket', 'digit', 'minIndex', 'middleIndex', 'low', 'high', 'lowIndex', 'highIndex', 'pivotIndex', 'candidate', 'weight', 'via', 'iteration', 'operation', 'word', 'character', 'charIndex', 'key', 'keyHash', 'hash', 'queryLeft', 'queryRight', 'left', 'right', 'sum', 'lowbit', 'row', 'column', 'textIndex', 'wordIndex', 'alignment', 'prefixIndex', 'suffixIndex', 'balance', 'rotation'].includes(name)).map(([name, value]) => <Badge key={name} variant="light" color="teal">{name} = {String(value)}</Badge>)}</Group>
              </Popover.Dropdown>
            </Popover>
              </section>
              <div className="lesson-panels">
                  <Paper withBorder className="canvas-card">
                    <Group justify="space-between"><Text fw={600} size="sm">{t('실행 과정', 'Execution')}</Text><Badge variant="light" color={step.type === 'done' ? 'teal' : 'gray'}>{stepTitle}</Badge></Group>
                    <div className="lesson-visual">
                    {partialArray && <Text size="xs" c="dimmed" mt="sm">{t(`현재 부분 배열 · 재귀 깊이 ${step.variables.depth} · 인덱스는 부분 배열 기준`, `Current subarray · recursion depth ${step.variables.depth} · local indices`)}</Text>}
                    {'buckets' in step.variables && <BucketView step={step} language={language} />}
                    {'heapSize' in step.variables && algorithm.category !== 'structure' && <HeapView step={step} language={language} />}
                    {algorithm.category === 'dp' ? <DpView step={step} language={language} /> : algorithm.category === 'string' ? <StringView step={step} language={language} /> : algorithm.category === 'graph' ? <GraphView step={step} language={language} /> : algorithm.category === 'structure' ? <StructureView step={step} language={language} /> : <ArrayView step={step} language={language} />}
                    <Group gap="lg" className="legend">{algorithm.category === 'dp' ? <><span><i className="dot comparing" />{t('현재 셀', 'Current cell')}</span><span><i className="dot matched" />{t('참조 셀', 'Referenced cell')}</span></> : algorithm.category === 'graph' ? <><span><i className="dot comparing" />{t('현재 정점', 'Current')}</span><span><i className="dot matched" />{t('발견', 'Discovered')}</span><span><i className="dot settled" />{t('처리 완료', 'Processed')}</span></> : algorithm.category === 'structure' ? <><span><i className="dot comparing" />{t('선택·확인', 'Select / inspect')}</span></> : ['search', 'string'].includes(algorithm.category) ? <><span><i className="dot comparing" />{t('확인 중', 'Inspect')}</span><span><i className="dot matched" />{t('일치', 'Match')}</span></> : ['heap-sort', 'counting-sort', 'radix-sort'].includes(algorithm.id) ? <><span><i className="dot comparing" />{t('선택·확인', 'Select / inspect')}</span><span><i className="dot settled" />{t('정렬된 결과', 'Sorted output')}</span></> : <><span><i className="dot comparing" />{t('비교', 'Compare')}</span><span><i className="dot swapping" />{t('교환', 'Swap')}</span><span><i className="dot settled" />{t('정렬된 구간', 'Sorted region')}</span></>}</Group>
                    {!arrayLesson && <div className="array-state"><Text size="xs" c="dimmed">{algorithm.category === 'dp' ? t('결과', 'Result') : algorithm.category === 'string' ? t('검색 결과', 'Search result') : distanceSummary !== undefined ? t('현재 거리', 'Current distances') : 'chosen' in step.variables ? t('선택한 간선', 'Selected edges') : step.variables.mode === 'topological' ? step.type === 'done' ? t('위상 순서', 'Topological order') : t('완료 스택 · 위 → 아래', 'Completion stack · top → bottom') : 'matrix' in step.variables ? t('경유 정점', 'Intermediate vertex') : algorithm.category === 'graph' ? t('방문 순서', 'Visit order') : 'hashTable' in step.variables ? t('저장된 키', 'Stored keys') : 'trie' in step.variables ? t('저장된 단어', 'Stored words') : 'tree' in step.variables ? t('중위 순회 · 왼쪽 → 루트 → 오른쪽', 'Inorder · left → root → right') : step.variables.structure === 'stack' ? t('현재 노드 · TOP → 아래', 'Current nodes · TOP → bottom') : step.variables.structure === 'queue' ? t('현재 노드 · FRONT → REAR', 'Current nodes · FRONT → REAR') : step.variables.structure === 'linked-list' ? t('노드 표시 순서 · 연결은 화살표 참고', 'Displayed nodes · follow arrows for links') : algorithm.category === 'structure' ? t('현재 입력·저장 값', 'Current input / stored values') : t('현재 배열', 'Current array')}</Text><output data-testid="array-values">[{['string', 'dp'].includes(algorithm.category) ? step.variables.result ?? '—' : distanceSummary ?? ('chosen' in step.variables ? JSON.parse(String(step.variables.chosen)).map((edge: number[]) => edge.join('–')).join(', ') : 'matrix' in step.variables ? step.variables.via ?? '—' : algorithm.category === 'graph' ? step.variables.order : 'hashTable' in step.variables ? step.variables.keys : 'trie' in step.variables ? step.variables.words : 'tree' in step.variables ? step.variables.inorder : step.array.map((item) => item.value).join(', '))}]</output></div>}
                    </div>
                    <div className="inline-input-editor">
                      <Group justify="space-between" gap="sm">
                        <Text size="xs" c="dimmed">{arrayLesson ? partialArray ? t('현재 부분 배열', 'Current subarray') : t('현재 배열', 'Current array') : t('실행 입력', 'Run input')}</Text>
                        {algorithm.category !== 'graph' && algorithm.inputMode !== 'words' && algorithm.inputMode !== 'text' && <Button variant="subtle" size="compact-sm" onClick={randomize} disabled={editingInput}>{t('무작위', 'Randomize')}</Button>}
                      </Group>
                      {editingInput ? <form className="input-form" onSubmit={(event) => { event.preventDefault(); apply(input); }} onKeyDown={(event) => { if (event.key === 'Escape') { event.preventDefault(); cancelInput(); } }}>
                        <div className="input-fields">
                          <TextInput className="array-input primary-input" size="md" label={arrayLesson ? partialArray ? t('전체 입력 배열', 'Full input array') : t('현재 배열', 'Current array') : inputLabel} value={input} onChange={(event) => setInput(event.currentTarget.value)} error={!['target', 'start', 'edges', 'weights', 'negative-weight', 'negative-cycle', 'cycle', 'operations', 'operations-limit', 'capacity', 'duplicate-values', 'missing-value', 'positions', 'range-order'].includes(error) ? errors[error] : undefined} autoFocus autoComplete="off" />
                          {algorithm.inputMode === 'text' && <TextInput size="md" label={algorithm.inputLabels?.[1][language] ?? t('패턴 입력', 'Pattern')} value={targetInput} onChange={(event) => setTargetInput(event.currentTarget.value)} autoComplete="off" />}
                          {!isSort && algorithm.inputMode !== 'text' && algorithm.usesStart !== false && <TextInput size="md" label={algorithm.category === 'graph' ? t('시작 정점', 'Start vertex') : t('목표 값', 'Target value')} value={targetInput} onChange={(event) => setTargetInput(event.currentTarget.value)} error={['target', 'start'].includes(error) ? errors[error] : undefined} autoComplete="off" />}
                          {algorithm.graphWeighted && !algorithm.fixedDirection && <NativeSelect size="md" label={t('간선 방향', 'Edge direction')} value={directed ? 'directed' : 'undirected'} data={[{ value: 'undirected', label: t('무방향', 'Undirected') }, { value: 'directed', label: t('방향 · 첫 정점 → 두 번째 정점', 'Directed · first → second') }]} onChange={(event) => setDirected(event.currentTarget.value === 'directed')} />}
                          {algorithm.category === 'graph' && <TextInput className="wide-input" size="md" label={t('간선 입력', 'Edges')} value={edgeInput} onChange={(event) => setEdgeInput(event.currentTarget.value)} error={['edges', 'weights', 'negative-weight', 'negative-cycle', 'cycle'].includes(error) ? errors[error] : undefined} placeholder={algorithm.graphWeighted ? '1-2:7, 1-3:2' : '1-2, 1-3, 2-4'} autoComplete="off" />}
                          {algorithm.category === 'structure' && <Textarea className="wide-input" label={t('연산 입력', 'Operations')} value={operationInput} onChange={(event) => setOperationInput(event.currentTarget.value)} description={algorithm.operationHint} error={['operations', 'operations-limit', 'capacity', 'duplicate-values', 'missing-value', 'positions', 'range-order'].includes(error) ? errors[error] : undefined} autosize minRows={2} maxRows={4} />}
                        </div>
                        <Text size="xs" c="dimmed" mt="xs">{partialArray && t('전체 입력 배열 수정 · ', 'Editing the full input array · ')}{algorithm.category === 'graph' ? t(`${directed ? '방향' : '무방향'} 그래프 · 1–12 정점 · 최대 24개 간선`, `${directed ? 'Directed' : 'Undirected'} graph · 1–12 vertices · up to 24 edges`) : algorithm.inputHint?.[language] ?? t(`최대 ${MAX_VALUES}개 · 음수·중복·소수 지원`, `Up to ${MAX_VALUES} values · negatives, duplicates, decimals`)}</Text>
                        {algorithm.requiresSorted && <Text size="xs" c="teal" mt="xs">{t('오름차순 배열이 필요합니다. 인덱스는 입력 배열 기준입니다.', 'Requires an ascending array. Indices refer to the input array.')}</Text>}
                        {error && <span role="alert" className="sr-only">{errors[error]}</span>}
                        <div className="input-actions"><Text size="xs" c="dimmed">{t('Esc 취소', 'Esc to cancel')}</Text><Button variant="subtle" onClick={cancelInput}>{t('취소', 'Cancel')}</Button><Button type="submit" variant="light" className="apply-button">{t('적용', 'Apply')}</Button></div>
                      </form> : <button className="editable-array" aria-label={arrayLesson ? t('현재 배열 수정', 'Edit current array') : t('입력 수정', 'Edit input')} onClick={editInput}>
                        <div className="input-preview"><output data-testid={arrayLesson ? 'array-values' : undefined}>{arrayLesson ? `[${step.array.map((item) => item.value).join(', ')}]` : input || '∅'}</output>
                          {!isSort && <span className="input-preview-detail">{algorithm.inputMode === 'text' ? `${algorithm.inputLabels?.[1][language] ?? t('패턴', 'Pattern')}: ${targetInput || '∅'}` : algorithm.category === 'structure' ? `${t('연산', 'Operations')}: ${operationInput || '∅'}` : algorithm.category === 'graph' ? `${t('간선', 'Edges')}: ${edgeInput || '∅'}${algorithm.usesStart !== false ? ` · ${t('시작', 'Start')}: ${targetInput}` : ''}` : `${t('목표', 'Target')}: ${targetInput}`}</span>}
                        </div><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m15 5 4 4M4 20l4-1L20 7a2.8 2.8 0 0 0-4-4L4 15Z" /></svg><span>{t('수정', 'Edit')}</span>
                      </button>}
                    </div>
                  </Paper>
                <CodePanel source={algorithm.source} activeCode={step.code} language={language} />
              </div>

            </div>
          </div>
        </main>
        <footer className="studio-footer">{t('천천히 살펴보세요. 이해는 속도보다 방향입니다.', 'Take your time. Understanding comes one step at a time.')}</footer>
      </div>
    </MotionConfig>
  );
}
