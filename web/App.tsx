import { useEffect, useReducer, useState } from 'react';
import { Badge, Button, Group, NativeSelect, Paper, Text, TextInput, Title } from '@mantine/core';
import { MotionConfig } from 'motion/react';
import { MAX_VALUES, parseTarget, parseValues, playbackReducer } from '../src/visualization/playback';
import { algorithms, bubble, type Algorithm, type Language } from './algorithms';
import { parseWords } from '../src/visualization/trie';
import { parseEdges, parseWeightedEdges } from '../src/visualization/graph';
import GraphView from './GraphView';
import BucketView from './BucketView';
import HeapView from './HeapView';
import ArrayView from './ArrayView';
import StructureView from './StructureView';
import CodePanel from './CodePanel';

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
  const [steps, setSteps] = useState(() => bubble.run(bubble.example));
  const [playback, dispatch] = useReducer(playbackReducer, { index: 0, playing: false, length: steps.length, speed: 1 });
  const step = steps[playback.index];
  const [stepTitle, reason] = algorithm.explain(step, language);
  const distanceSummary = 'distances' in step.variables ? Object.entries(JSON.parse(String(step.variables.distances))).map(([node, distance]) => `${node}: ${distance ?? '∞'}`).join(', ') : undefined;
  const seek = (index: number) => dispatch({ type: 'seek', index });

  useEffect(() => { document.documentElement.lang = language; }, [language]);
  useEffect(() => {
    if (!playback.playing) return;
    const timer = window.setTimeout(() => dispatch({ type: 'tick' }), 700 / playback.speed);
    return () => window.clearTimeout(timer);
  }, [playback.playing, playback.index, playback.speed]);
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.target instanceof HTMLElement && event.target.closest('input, textarea, select, button, a, [role="combobox"]')) return;
      if (event.key === 'ArrowLeft') seek(playback.index - 1);
      else if (event.key === 'ArrowRight') seek(playback.index + 1);
      else if (event.key === 'Home') seek(0);
      else if (event.key === 'End') seek(steps.length - 1);
      else if (event.key === ' ') dispatch({ type: 'toggle' });
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [playback.index, steps.length]);

  function apply(text: string, operations = operationInput) {
    try {
      let target;
      if (algorithm.category !== 'sort' && algorithm.usesStart !== false) {
        try { target = parseTarget(targetInput); } catch { throw new Error('target'); }
      }
      let next;
      if (algorithm.inputMode === 'words') {
        next = algorithm.run(parseWords(text), undefined, undefined, undefined, operations);
      } else {
        const values = parseValues(text);
        const edges = algorithm.category === 'graph' ? algorithm.graphWeighted ? parseWeightedEdges(edgeInput, values, directed) : parseEdges(edgeInput, values, directed) : undefined;
        next = algorithm.run(values, target, edges, directed, operations);
      }
      setSteps(next);
      setInput(text);
      setError('');
      dispatch({ type: 'reset', length: next.length });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'invalid');
    }
  }

  function selectAlgorithm(next: Algorithm) {
    const trace = next.inputMode === 'words' ? next.run(next.example, undefined, undefined, undefined, next.operations) : next.run(next.example, next.target, next.graphEdges, next.graphDirected);
    setAlgorithm(next);
    setOperationInput(next.operations ?? '');
    setTargetInput(String(next.target ?? 3));
    setDirected(next.graphDirected ?? false);
    setEdgeInput(next.graphEdges?.map((edge) => `${edge[0]}-${edge[1]}${next.graphWeighted ? `:${edge[2]}` : ''}`).join(', ') ?? '');
    setInput(next.example.join(', '));
    setError('');
    setSteps(trace);
    dispatch({ type: 'reset', length: trace.length });
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
    'empty-array': t('구간 트리에는 값을 최소 1개 입력하세요.', 'The segment tree requires at least one input value.'),
    positions: t('유효한 정수 인덱스를 입력하세요. 펜윅 트리는 1부터, 구간 트리는 0부터 시작합니다.', 'Enter a valid integer index. Fenwick indices start at 1; segment indices start at 0.'),
    'range-order': t('구간의 왼쪽 인덱스는 오른쪽 이하여야 합니다.', 'The left range index must not exceed the right index.'),
    'tree-limit': t('트리는 최대 12개의 서로 다른 노드를 표시합니다.', 'The tree supports at most 12 distinct nodes.'),
    'set-limit': t('분리 집합은 최대 12개의 서로 다른 값을 표시합니다.', 'Disjoint sets support at most 12 distinct values.'),
    'duplicate-values': t('우선순위 큐의 값은 서로 달라야 합니다. 같은 값을 두 번 넣을 수 없습니다.', 'Priority queue values must be distinct; do not add the same value twice.'),
    'missing-value': t('연산에 필요한 값이 현재 자료 구조에 없습니다.', 'An item required by the operation is absent from the current structure.'),
    words: algorithm.id === 'hash-table' ? t('키와 값은 각각 16글자 이내여야 합니다. 초기 키는 쉼표 또는 공백으로 구분하세요.', 'Keys and values must have at most 16 code points. Separate initial keys with commas or spaces.') : t('단어는 쉼표 또는 공백으로 구분하고, 각 단어는 최대 16글자까지 입력하세요. 빈 항목은 허용하지 않습니다.', 'Separate words with commas or spaces; use at most 16 code points per word, without empty entries.'),
    'word-limit': algorithm.id === 'hash-table' ? t('최대 12개의 키를 저장할 수 있습니다.', 'Store at most 12 keys.') : t('현재 저장된 단어는 최대 12개까지 허용합니다.', 'Store at most 12 words.'),
    'trie-limit': t('트라이에는 최대 80개의 글자 노드를 표시합니다. 단어 수나 길이를 줄이세요.', 'The trie supports at most 80 character nodes. Use fewer or shorter words.'),
    operations: algorithm.id === 'hash-table' ? t('set 키 값, get 키, delete 키, has 키 형식을 사용하세요. 연산은 쉼표로 구분합니다.', 'Use set key value, get key, delete key or has key; separate commands with commas.') : algorithm.inputMode === 'words' ? t('add · delete · find · suggest 뒤에 단어 하나를 입력하세요. 연산은 쉼표로 구분합니다.', 'Use add, delete, find or suggest followed by one word; separate commands with commas.') : t('연산 형식이 잘못됐습니다. 아래 예시의 연산을 쉼표로 구분해 입력하세요. 값은 -999부터 999까지입니다.', 'Invalid operations. Separate the supported commands below with commas; values must be between -999 and 999.'),
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

  return (
    <MotionConfig reducedMotion="user">
      <div className="studio">
        <header className="studio-header">
          <a className="brand" href="/"><span className="brand-mark">◈</span> Algorithm Studio</a>
          <Group gap="md"><Text size="sm" c="dimmed" className="header-note">{t('작은 단계가 만드는 큰 이해', 'Small steps. Clear understanding.')}</Text>
            <Button variant="default" size="xs" onClick={() => setLanguage(ko ? 'en' : 'ko')}>{ko ? 'English' : '한국어'}</Button>
          </Group>
        </header>
        <main>
          <div className="intro">
            <Text className="eyebrow">{t('알고리즘을 탐색하는 공간', 'YOUR ALGORITHM WORKSPACE')}</Text>
            <Title order={1}>{t('움직임으로 보고, 코드로 이해하세요.', 'See the logic. Understand the why.')}</Title>
            <Text c="dimmed" mt="sm">{t('시간을 앞뒤로 움직이며, 한 번의 비교부터 마지막 결과까지 살펴보세요.', 'Move through time, from the first comparison to the final result.')}</Text>
          </div>
          <div className="workspace">
            <NativeSelect className="mobile-catalog" label={t('알고리즘 선택', 'Choose an algorithm')} value={algorithm.id} data={algorithms.map((entry) => ({ value: entry.id, label: entry.name[language] }))} onChange={(event) => {
              const next = algorithms.find((entry) => entry.id === event.currentTarget.value);
              if (next) selectAlgorithm(next);
            }} />
            <nav className="catalog" aria-label={t('알고리즘 목록', 'Algorithms')}>
              {(['sort', 'search', 'graph', 'structure'] as const).map((category) => <div key={category} className="catalog-group">
                <Text size="xs" fw={700} c="dimmed" mb="sm" mt="md" className="catalog-label">{category === 'sort' ? t('정렬', 'SORTING') : category === 'search' ? t('검색', 'SEARCHING') : category === 'graph' ? t('그래프', 'GRAPHS') : t('자료 구조', 'DATA STRUCTURES')}</Text>
                {algorithms.filter((entry) => entry.category === category).map((entry) => <button key={entry.id} className={`algorithm-button ${entry.id === algorithm.id ? 'selected' : ''}`} aria-current={entry.id === algorithm.id ? 'page' : undefined} onClick={() => selectAlgorithm(entry)}>
                  <span>{entry.name[language]}</span><span className="algorithm-arrow">↗</span>
                </button>)}
              </div>)}
              <Text size="xs" c="dimmed" mt="xl">{t(`현재 지원: ${algorithms.length}개 알고리즘`, `Available: ${algorithms.length} algorithms`)}</Text>
            </nav>
            <div className="lesson">
              <div className="lesson-heading">
                <div><Group gap="sm"><Title order={2}>{algorithm.name[language]}</Title><Badge color="teal" variant="light">{algorithm.category === 'sort' ? t('정렬', 'SORTING') : algorithm.category === 'search' ? t('검색', 'SEARCHING') : algorithm.category === 'graph' ? t('그래프', 'GRAPHS') : t('자료 구조', 'DATA STRUCTURES')}</Badge></Group>
                  <Text size="sm" c="dimmed" mt={6}>{algorithm.summary[language]}</Text>
                </div>
                <Badge variant="outline" color="gray">{typeof algorithm.time === 'string' ? algorithm.time : algorithm.time[language]}</Badge>
              </div>
              <div className="lesson-panels">
                <div className="visual-column">
                  <Paper withBorder className="canvas-card">
                    <Group justify="space-between"><Text fw={600} size="sm">{t('실행 과정', 'Execution')}</Text><Badge variant="light" color={step.type === 'done' ? 'teal' : 'gray'}>{stepTitle}</Badge></Group>
                    {algorithm.category === 'sort' && 'depth' in step.variables && <Text size="xs" c="dimmed" mt="sm">{t(`현재 부분 배열 · 재귀 깊이 ${step.variables.depth} · 인덱스는 부분 배열 기준`, `Current subarray · recursion depth ${step.variables.depth} · local indices`)}</Text>}
                    {'buckets' in step.variables && <BucketView step={step} language={language} />}
                    {'heapSize' in step.variables && algorithm.category !== 'structure' && <HeapView step={step} language={language} />}
                    {algorithm.category === 'graph' ? <GraphView step={step} language={language} /> : algorithm.category === 'structure' ? <StructureView step={step} language={language} /> : <ArrayView step={step} language={language} />}
                    <Group gap="lg" className="legend">{algorithm.category === 'graph' ? <><span><i className="dot comparing" />{t('현재 정점', 'Current')}</span><span><i className="dot matched" />{t('발견', 'Discovered')}</span><span><i className="dot settled" />{t('처리 완료', 'Processed')}</span></> : algorithm.category === 'structure' ? <><span><i className="dot comparing" />{t('선택·확인', 'Select / inspect')}</span></> : algorithm.category === 'search' ? <><span><i className="dot comparing" />{t('확인 중', 'Inspect')}</span><span><i className="dot matched" />{t('일치', 'Match')}</span></> : ['heap-sort', 'counting-sort', 'radix-sort'].includes(algorithm.id) ? <><span><i className="dot comparing" />{t('선택·확인', 'Select / inspect')}</span><span><i className="dot settled" />{t('정렬된 결과', 'Sorted output')}</span></> : <><span><i className="dot comparing" />{t('비교', 'Compare')}</span><span><i className="dot swapping" />{t('교환', 'Swap')}</span><span><i className="dot settled" />{t('정렬된 구간', 'Sorted region')}</span></>}</Group>
                    <div className="array-state"><Text size="xs" c="dimmed">{distanceSummary !== undefined ? t('현재 거리', 'Current distances') : 'chosen' in step.variables ? t('선택한 간선', 'Selected edges') : step.variables.mode === 'topological' ? step.type === 'done' ? t('위상 순서', 'Topological order') : t('완료 스택 · 위 → 아래', 'Completion stack · top → bottom') : 'matrix' in step.variables ? t('경유 정점', 'Intermediate vertex') : algorithm.category === 'graph' ? t('방문 순서', 'Visit order') : 'hashTable' in step.variables ? t('저장된 키', 'Stored keys') : 'trie' in step.variables ? t('저장된 단어', 'Stored words') : 'tree' in step.variables ? t('중위 순회 · 왼쪽 → 루트 → 오른쪽', 'Inorder · left → root → right') : step.variables.structure === 'stack' ? t('현재 노드 · TOP → 아래', 'Current nodes · TOP → bottom') : step.variables.structure === 'queue' ? t('현재 노드 · FRONT → REAR', 'Current nodes · FRONT → REAR') : step.variables.structure === 'linked-list' ? t('노드 표시 순서 · 연결은 화살표 참고', 'Displayed nodes · follow arrows for links') : algorithm.category === 'structure' ? t('현재 입력·저장 값', 'Current input / stored values') : t('현재 배열', 'Current array')}</Text><output data-testid="array-values">[{distanceSummary ?? ('chosen' in step.variables ? JSON.parse(String(step.variables.chosen)).map((edge: number[]) => edge.join('–')).join(', ') : 'matrix' in step.variables ? step.variables.via ?? '—' : algorithm.category === 'graph' ? step.variables.order : 'hashTable' in step.variables ? step.variables.keys : 'trie' in step.variables ? step.variables.words : 'tree' in step.variables ? step.variables.inorder : step.array.map((item) => item.value).join(', '))}]</output></div>
                  </Paper>
                  <Paper withBorder p="lg">
                    <form onSubmit={(event) => { event.preventDefault(); apply(input); }}>
                      {algorithm.category !== 'sort' && algorithm.usesStart !== false && <TextInput label={algorithm.category === 'graph' ? t('시작 정점', 'Start vertex') : t('목표 값', 'Target value')} value={targetInput} onChange={(event) => setTargetInput(event.currentTarget.value)} error={['target', 'start'].includes(error) ? errors[error] : undefined} autoComplete="off" mb="sm" />}
                      {algorithm.category === 'structure' && <TextInput label={t('연산 입력', 'Operations')} value={operationInput} onChange={(event) => setOperationInput(event.currentTarget.value)} description={algorithm.operationHint} error={['operations', 'operations-limit', 'capacity', 'duplicate-values', 'missing-value', 'positions', 'range-order'].includes(error) ? errors[error] : undefined} autoComplete="off" mb="sm" />}
                      {algorithm.graphWeighted && !algorithm.fixedDirection && <NativeSelect label={t('간선 방향', 'Edge direction')} value={directed ? 'directed' : 'undirected'} data={[{ value: 'undirected', label: t('무방향', 'Undirected') }, { value: 'directed', label: t('방향 · 첫 정점 → 두 번째 정점', 'Directed · first → second') }]} onChange={(event) => setDirected(event.currentTarget.value === 'directed')} mb="sm" />}
                      {algorithm.category === 'graph' && <TextInput label={t('간선 입력', 'Edges')} value={edgeInput} onChange={(event) => setEdgeInput(event.currentTarget.value)} error={['edges', 'weights', 'negative-weight', 'negative-cycle', 'cycle', 'operations', 'operations-limit', 'capacity', 'duplicate-values', 'missing-value', 'positions', 'range-order'].includes(error) ? errors[error] : undefined} placeholder={algorithm.graphWeighted ? "1-2:7, 1-3:2" : "1-2, 1-3, 2-4"} autoComplete="off" mb="sm" />}
                      <Group align="flex-end" wrap="nowrap"><TextInput className="array-input" label={algorithm.category === 'graph' ? t('정점 입력', 'Vertices') : algorithm.id === 'hash-table' ? t('초기 키 입력', 'Initial keys') : algorithm.inputMode === 'words' ? t('초기 단어 입력', 'Initial words') : algorithm.category === 'structure' ? t('초기 값 입력', 'Initial values') : t('배열 입력', 'Array input')} value={input} onChange={(event) => setInput(event.currentTarget.value)} placeholder={algorithm.inputMode === 'words' ? 'car, cat, 가방, 가게' : '8, 3, 6, 1, 5, 2'} error={!['target', 'start', 'edges', 'weights', 'negative-weight', 'negative-cycle', 'cycle', 'operations', 'operations-limit', 'capacity', 'duplicate-values', 'missing-value', 'positions', 'range-order'].includes(error) ? errors[error] : undefined} autoComplete="off" /><Button type="submit">{t('적용', 'Apply')}</Button></Group>
                      {error && <span role="alert" className="sr-only">{errors[error]}</span>}
                    </form>
                    {algorithm.requiresSorted && <Text size="xs" c="teal" mt="xs">{t('오름차순 배열이 필요합니다. 인덱스는 입력 배열 기준입니다.', 'Requires an ascending array. Indices refer to the input array.')}</Text>}
                    <Group justify="space-between" mt="sm"><Text size="xs" c="dimmed">{algorithm.category === 'graph' ? t(`${step.variables.directed ? '방향' : '무방향'} 그래프 · 1–12 정점 · 최대 24개 간선`, `${step.variables.directed ? 'Directed' : 'Undirected'} graph · 1–12 vertices · up to 24 edges`) : algorithm.inputHint?.[language] ?? t(`최대 ${MAX_VALUES}개 · 음수·중복·소수 지원`, `Up to ${MAX_VALUES} values · negatives, duplicates, decimals`)}</Text>{algorithm.category !== 'graph' && algorithm.inputMode !== 'words' && <Button variant="subtle" size="compact-xs" onClick={randomize}>{t('무작위', 'Randomize')}</Button>}</Group>
                  </Paper>
                </div>
                <div className="detail-column">
                  <CodePanel source={algorithm.source} activeCode={step.code} language={language} />
                  <Paper withBorder p="lg" className="reason-card">
                    <Text size="xs" c="teal" fw={700} mb="xs">{t('왜 이 코드가 실행될까요?', 'WHY THIS CODE?')}</Text>
                    <Text fw={700} mb="xs">{stepTitle}</Text><Text size="sm" className="step-reason" data-testid="step-reason">{reason}</Text>
                    <Group gap="xs" mt="md">{Object.entries(step.variables).filter(([name]) => ['key', 'keyHash', 'hash', 'queryLeft', 'queryRight', 'leftResult', 'rightResult', 'left', 'lowbit', 'sum', 'right', 'operation', 'word', 'character', 'charIndex', 'value', 'priority', 'result', 'weight', 'via', 'candidate', 'iteration', 'rangeDelta', 'valueDelta', 'indexDelta', 'jumpSize', 'digit', 'bucket', 'position', 'minimum', 'heapSize', 'gap', 'gapShiftedIndex', 'i', 'j', 'minIndex', 'currentIndex', 'swapped', 'depth', 'middleIndex', 'leftIndex', 'rightIndex', 'lowIndex', 'highIndex', 'partitionIndex', 'pivotIndex', 'target', 'index', 'matches', 'low', 'high', 'current', 'next', 'parent', 'previous'].includes(name)).map(([name, value]) => <Badge key={name} variant="light" color="gray">{name} = {String(value)}</Badge>)}</Group>
                  </Paper>
                </div>
              </div>
              <Paper withBorder className="playback-card">
                <Group justify="space-between" mb="md"><Group gap="xs">
                  <Button variant="default" size="compact-sm" onClick={() => seek(0)} disabled={playback.index === 0}>{t('처음', 'First')}</Button>
                  <Button variant="default" size="compact-sm" onClick={() => seek(playback.index - 1)} disabled={playback.index === 0}>{t('이전', 'Previous')}</Button>
                  <Button size="compact-sm" className="play-button" onClick={() => dispatch({ type: 'toggle' })}>{playback.playing ? t('일시정지', 'Pause') : playback.index === steps.length - 1 ? t('다시 재생', 'Replay') : t('재생', 'Play')}</Button>
                  <Button variant="default" size="compact-sm" onClick={() => seek(playback.index + 1)} disabled={playback.index === steps.length - 1}>{t('다음', 'Next')}</Button>
                  <Button variant="default" size="compact-sm" onClick={() => seek(steps.length - 1)} disabled={playback.index === steps.length - 1}>{t('마지막', 'Last')}</Button>
                </Group><NativeSelect aria-label={t('재생 속도', 'Playback speed')} size="xs" value={String(playback.speed)} data={['0.5', '1', '2', '4'].map((value) => ({ value, label: `${value}×` }))} onChange={(event) => dispatch({ type: 'speed', speed: Number(event.currentTarget.value) })} /></Group>
                <input className="timeline" type="range" min={0} max={steps.length - 1} value={playback.index} onChange={(event) => seek(Number(event.currentTarget.value))} aria-label={t('단계 타임라인', 'Step timeline')} aria-valuetext={`${playback.index + 1} / ${steps.length}: ${stepTitle}`} />
                <Group justify="space-between" mt="xs"><Text size="xs" c="dimmed" data-testid="step-counter">{t('단계', 'Step')} {playback.index + 1} / {steps.length}</Text><Text size="xs" c="dimmed">{t('← → 단계 이동 · Space 재생', '← → step · Space play')}</Text></Group>
              </Paper>
            </div>
          </div>
        </main>
        <footer className="studio-footer">{t('천천히 살펴보세요. 이해는 속도보다 방향입니다.', 'Take your time. Understanding comes one step at a time.')}</footer>
      </div>
    </MotionConfig>
  );
}
