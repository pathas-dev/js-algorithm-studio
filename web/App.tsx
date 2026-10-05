import { useEffect, useReducer, useState } from 'react';
import { Badge, Button, Group, NativeSelect, Paper, Text, TextInput, Title } from '@mantine/core';
import { MotionConfig } from 'motion/react';
import { MAX_VALUES, parseValues, playbackReducer } from '../src/visualization/playback';
import { algorithms, bubble, type Language } from './algorithms';
import ArrayView from './ArrayView';
import CodePanel from './CodePanel';

export default function App() {
  const [language, setLanguage] = useState<Language>('ko');
  const ko = language === 'ko';
  const t = (korean: string, english: string) => ko ? korean : english;
  const [algorithm, setAlgorithm] = useState(bubble);
  const [input, setInput] = useState(bubble.example.join(', '));
  const [error, setError] = useState('');
  const [steps, setSteps] = useState(() => bubble.run(bubble.example));
  const [playback, dispatch] = useReducer(playbackReducer, { index: 0, playing: false, length: steps.length, speed: 1 });
  const step = steps[playback.index];
  const [stepTitle, reason] = algorithm.explain(step, language);
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

  function apply(text: string) {
    try {
      const next = algorithm.run(parseValues(text));
      setSteps(next);
      setInput(text);
      setError('');
      dispatch({ type: 'reset', length: next.length });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'invalid');
    }
  }

  function selectAlgorithm(next: typeof bubble) {
    const trace = next.run(next.example);
    setAlgorithm(next);
    setInput(next.example.join(', '));
    setError('');
    setSteps(trace);
    dispatch({ type: 'reset', length: trace.length });
  }

  const errors: Record<string, string> = {
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
            <nav className="catalog" aria-label={t('알고리즘 목록', 'Algorithms')}>
              <Text size="xs" fw={700} c="dimmed" mb="md">{t('정렬', 'SORTING')}</Text>
              {algorithms.map((entry) => <button key={entry.id} className={`algorithm-button ${entry.id === algorithm.id ? 'selected' : ''}`} aria-current={entry.id === algorithm.id ? 'page' : undefined} onClick={() => selectAlgorithm(entry)}>
                <span>{entry.name[language]}</span><span className="algorithm-arrow">↗</span>
              </button>)}
              <Text size="xs" c="dimmed" mt="xl">{t(`현재 지원: ${algorithms.length}개 알고리즘`, `Available: ${algorithms.length} algorithms`)}</Text>
            </nav>
            <div className="lesson">
              <div className="lesson-heading">
                <div><Group gap="sm"><Title order={2}>{algorithm.name[language]}</Title><Badge color="teal" variant="light">{t('기초', 'BEGINNER')}</Badge></Group>
                  <Text size="sm" c="dimmed" mt={6}>{algorithm.summary[language]}</Text>
                </div>
                <Badge variant="outline" color="gray">{algorithm.time}</Badge>
              </div>
              <div className="lesson-panels">
                <div className="visual-column">
                  <Paper withBorder className="canvas-card">
                    <Group justify="space-between"><Text fw={600} size="sm">{t('실행 과정', 'Execution')}</Text><Badge variant="light" color={step.type === 'done' ? 'teal' : 'gray'}>{stepTitle}</Badge></Group>
                    {'depth' in step.variables && <Text size="xs" c="dimmed" mt="sm">{t(`현재 부분 배열 · 재귀 깊이 ${step.variables.depth} · 인덱스는 부분 배열 기준`, `Current subarray · recursion depth ${step.variables.depth} · local indices`)}</Text>}
                    <ArrayView step={step} language={language} />
                    <Group gap="lg" className="legend"><span><i className="dot comparing" />{t('비교', 'Compare')}</span><span><i className="dot swapping" />{t('교환', 'Swap')}</span><span><i className="dot settled" />{t('정렬된 구간', 'Sorted region')}</span></Group>
                    <div className="array-state"><Text size="xs" c="dimmed">{t('현재 배열', 'Current array')}</Text><output data-testid="array-values">[{step.array.map((item) => item.value).join(', ')}]</output></div>
                  </Paper>
                  <Paper withBorder p="lg">
                    <form onSubmit={(event) => { event.preventDefault(); apply(input); }}>
                      <Group align="flex-end" wrap="nowrap"><TextInput className="array-input" label={t('배열 입력', 'Array input')} value={input} onChange={(event) => setInput(event.currentTarget.value)} placeholder="8, 3, 6, 1, 5, 2" error={errors[error]} autoComplete="off" /><Button type="submit">{t('적용', 'Apply')}</Button></Group>
                      {error && <span role="alert" className="sr-only">{errors[error]}</span>}
                    </form>
                    <Group justify="space-between" mt="sm"><Text size="xs" c="dimmed">{t(`최대 ${MAX_VALUES}개 · 음수·중복·소수 지원`, `Up to ${MAX_VALUES} values · negatives, duplicates, decimals`)}</Text><Button variant="subtle" size="compact-xs" onClick={() => apply(Array.from({ length: 8 }, () => Math.floor(Math.random() * 90) + 1).join(', '))}>{t('무작위', 'Randomize')}</Button></Group>
                  </Paper>
                </div>
                <div className="detail-column">
                  <CodePanel source={algorithm.source} activeCode={step.code} language={language} />
                  <Paper withBorder p="lg" className="reason-card">
                    <Text size="xs" c="teal" fw={700} mb="xs">{t('왜 이 코드가 실행될까요?', 'WHY THIS CODE?')}</Text>
                    <Text fw={700} mb="xs">{stepTitle}</Text><Text size="sm" className="step-reason" data-testid="step-reason">{reason}</Text>
                    <Group gap="xs" mt="md">{Object.entries(step.variables).filter(([name]) => ['i', 'j', 'minIndex', 'currentIndex', 'swapped', 'depth', 'middleIndex', 'leftIndex', 'rightIndex', 'lowIndex', 'highIndex', 'partitionIndex', 'pivotIndex'].includes(name)).map(([name, value]) => <Badge key={name} variant="light" color="gray">{name} = {String(value)}</Badge>)}</Group>
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
