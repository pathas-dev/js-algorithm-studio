import { lazy, Suspense, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';
import { bubble } from './algorithms';
import useBubblePlayback from './useBubblePlayback';
import { useSceneVisibility } from './use-scene-visibility';
const BubbleScene = lazy(() => import('./BubbleScene'));
const ComplexityScene = lazy(() => import('./ComplexityScene'));
const preview = bubble.run([3, 5, 2, 4, 1, 6]);
import SpaceSky from './SpaceSky';
import './landing.css';

type Language = 'ko' | 'en';
const examples = [
  ['stack', '방금 한 일부터 되돌리기', 'Undo the thing you just did', '스택', 'Stack', '가장 최근에 넣은 것부터 꺼냅니다. 방금 한 일을 되돌릴 때도, 쌓인 접시를 꺼낼 때도.', 'Take out what you added last. It works for undoing an action, or taking a plate from a stack.'],
  ['queue', '먼저 온 사람부터', 'First to arrive, first to leave', '큐', 'Queue', '먼저 들어온 요청부터 처리합니다. 인쇄 대기열도 이런 식으로 조용히 차례를 기다립니다.', 'Process requests in arrival order. A print queue waits its turn in much the same way.'],
  ['trie', '말문이 같은 단어들', 'Words that start alike', '트라이', 'Trie', '같은 글자로 시작하는 단어들이 가지를 나눠 씁니다. 몇 글자만 적어도 후보가 보이는 이유.', 'Words share branches when they start with the same letters. A few letters are enough to find some suggestions.'],
  ['dijkstra', '덜 돌아가는 쪽으로', 'Take fewer detours', '다익스트라', 'Dijkstra', '이동 비용이 작은 길부터 살펴봅니다. 음수 비용이 없을 때, 시작점에서 가장 적은 비용으로 가는 길을 찾습니다.', 'Start with lower-cost routes. With nonnegative edge costs, find the cheapest paths from a starting point.'],
];

export default function Landing() {
  const [language, setLanguage] = useState<Language>(new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'ko');
  const [size, setSize] = useState(32);
  const reduced = Boolean(useReducedMotion());
  const { sceneRef, visible } = useSceneVisibility(!reduced);
  const { playback, dispatch, clock: previewClock } = useBubblePlayback(preview, visible && !reduced, !reduced);
  const step = preview[playback.index];
  const previous = preview[Math.max(0, playback.index - 1)];
  const pair = step.indices.map((index) => (step.type === 'swap' ? previous : step).array[index].value);
  const ko = language === 'ko';
  const t = (korean: string, english: string) => ko ? korean : english;
  const lesson = (id: string) => `?lesson=${id}&lang=${language}`;
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('이젠 아무래도 좋을 알고리즘', 'Algorithms, for what it’s worth');
    const url = new URL(location.href);
    if (language === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    history.replaceState(null, '', url);
  }, [language]);
  const models = [
    { notation: 'O(1)', count: 1, name: t('배열의 특정 위치 읽기', 'Read an array index'), note: t('입력이 늘어도 일정', 'Constant as input grows'), color: '#a9c4b5' },
    { notation: 'O(log n)', count: Math.ceil(Math.log2(size)), name: t('이진 탐색', 'Binary search'), note: t('탐색 범위를 절반씩 줄이기', 'Halve the search space'), color: '#9bb7a5' },
    { notation: 'O(n)', count: size, name: t('배열을 한 번 훑기', 'Scan an array once'), note: t('입력 크기에 비례', 'Proportional to input size'), color: '#d6b476' },
    { notation: 'O(n²)', count: size * (size - 1) / 2, name: t('버블 정렬 · 최악의 비교', 'Bubble sort · worst-case comparisons'), note: t('입력이 커질수록 빠르게 증가', 'Grows rapidly with input size'), color: '#afa0be' },
  ];
  return <div className="landing space-landing">
    <SpaceSky />
    <a className="landing-skip" href="#warmup">{t('구경할 거리로 건너뛰기', 'Skip to things to explore')}</a>
    <header className="landing-header">
      <a className="brand" href={language === 'en' ? '?lang=en' : '/'}><img className="brand-mark" src="/favicon.svg" width="32" height="32" alt="" />{t('이젠 아무래도 좋을 알고리즘', 'Algorithms, for what it’s worth')}</a>
      <nav aria-label={t('주요 메뉴', 'Main navigation')}>
        <a href="#warmup">Big O</a><a href="#use-cases">{t('익숙한 것들', 'Familiar things')}</a>
        <button onClick={() => setLanguage(ko ? 'en' : 'ko')}>{ko ? 'English' : '한국어'}</button>
      </nav>
    </header>
    <main>
      <section className="landing-intro" aria-labelledby="intro-title">
        <div className="intro-copy">
          <h1 id="intro-title">{t('이젠 아무래도 좋을', 'Algorithms,')}<br /><span>{t('알고리즘', 'for what it’s worth.')}</span></h1>
          <p>{t('AI가 짜준다는데. 면접이 아니라면 외울 일도 없는데. 그래도 숫자가 제자리를 찾아가는 건 조금 볼 만합니다.', 'AI can write it. You might never need to memorize it. Still, there’s something nice about numbers finding their places.')}</p>
          <div className="intro-links"><a className="landing-primary" href={lesson('bubble-sort')}>{t('그냥 구경하기', 'Just watch')}<Arrow /></a><a className="landing-text-link" href="#warmup">{t('얼마나 바쁜지 보기', 'See how much work it is')}<Arrow /></a></div>
        </div>
        <div className="intro-demo">
          <div className="demo-heading"><span>{t('이웃 궤도를 살펴보는 중', 'Observing neighboring orbits')}</span>{!reduced && <button className="demo-pause" onClick={() => dispatch({ type: 'toggle' })}>{playback.playing ? t('정렬 멈추기', 'Pause sorting') : t('정렬 이어보기', 'Resume sorting')}</button>}</div>
          <a className="demo-open" href={lesson('bubble-sort')} aria-label={t('버블 정렬 시각화 열기', 'Open the bubble sort visualization')}>
            <div ref={sceneRef} className="demo-scene" data-playing={visible && playback.playing} aria-hidden="true"><Suspense fallback={<div className="demo-loading" />}><BubbleScene index={playback.index} step={step} previous={previous} clock={previewClock} language={language} reduced={reduced} view="3d" world="space" /></Suspense></div>
            <div className="demo-explanation"><span className="demo-pair">{pair.length === 2 ? step.type === 'swap' ? <><span>[{pair.join(', ')}]</span><Arrow /><span>[{[...pair].reverse().join(', ')}]</span></> : `${pair[0]} ${pair[0] > pair[1] ? '>' : '≤'} ${pair[1]}` : `[${step.array.map((item) => item.value).join(', ')}]`}</span><p>{bubble.explain(step, language)[0]}</p></div>
            <div className="demo-bottom"><span>{t('이러다 보면, 제자리에 갑니다.', 'Keep at it. They find their places.')}</span><Arrow /></div>
          </a>
        </div>
      </section>
      <section className="landing-warmup" id="warmup" aria-labelledby="big-o-title">
        <div className="section-intro"><h2 id="big-o-title">{t('입력이 늘어나면,', 'When there’s more input,')}<br />{t('바빠지는 방식도 제각각.', 'everyone gets busy differently.')}</h2><p>{t('입력이 늘면 별도 모입니다. 별 하나는 모형 연산 한 번입니다. Big O는 입력이 커질 때 시간이나 공간이 늘어나는 상한 표기입니다. 초 단위의 속도는 아니고요.', 'As input grows, stars gather. One star is one model operation. Big O is an upper bound on how time or space grows with input size. It isn’t a speed in seconds.')}</p></div>
        <div className="complexity-lab">
          <div className="lab-control"><label htmlFor="input-size">{t('입력 크기', 'Input size')} <strong>n = {size}</strong></label><input id="input-size" type="range" min="1" max="7" value={Math.log2(size)} aria-valuetext={`n = ${size}`} onChange={(event) => setSize(2 ** Number(event.target.value))} /><span>2–128</span></div>
          <div className="complexity-rows">{models.map((model) => <div className="complexity-row" key={model.notation}><div className="complexity-label"><strong>{model.notation}</strong><output aria-label={`${model.notation} ${t('모형 연산 수', 'model operations')}`}>{model.count.toLocaleString(language)}</output></div><Suspense fallback={<div className="complexity-stage" />}><ComplexityScene count={model.count} color={model.color} reduced={reduced} /></Suspense><span className="complexity-name">{model.name}</span><small>{model.note}</small></div>)}</div>
          <p className="lab-caption">{t('같은 크기의 별 하나는 모형 연산 한 번입니다: 1, ⌈log₂ n⌉, n, n(n−1)/2. 실제 실행 시간이나 모든 구현의 정확한 연산 수는 아닙니다.', 'Each identically sized star represents one model operation: 1, ⌈log₂ n⌉, n, n(n−1)/2. They are not measured runtimes or exact counts for every implementation.')}</p>
        </div>
        <div className="warmup-notes"><p><strong>{t('몇 가지 사정은 있습니다', 'There are a few conditions')}</strong>{t('이진 탐색은 정렬된 데이터가 필요합니다. 버블 정렬의 O(n²)는 최악의 경우이며, 조기 종료를 쓰면 이미 정렬된 배열은 O(n)입니다.', 'Binary search needs sorted data. Bubble sort is O(n²) in the worst case; early exit makes an already sorted array O(n).')}</p><p><strong>{t('걸리는 품과 차지하는 자리', 'The work it takes, the room it uses')}</strong>{t('계산이 적다고 자리도 적게 쓰는 건 아닙니다. 병합 정렬은 보통 O(n log n) 시간과 O(n) 추가 공간을 사용합니다.', 'Less computation doesn’t always mean less room. Merge sort typically uses O(n log n) time and O(n) auxiliary space.')}</p></div>
      </section>
      <section className="landing-use-cases" id="use-cases" aria-labelledby="uses-title">
        <div className="section-intro"><h2 id="uses-title">{t('이름은 몰라도, 익숙한 일들.', 'Familiar things, unfamiliar names.')}</h2><p>{t('되돌리기, 줄 서기, 검색어 추천, 길 찾기. 데이터를 담고 다루는 방식이 익숙한 기능 뒤에서 일을 하고 있습니다.', 'Undoing, waiting in line, suggesting a word, finding a route. Familiar features have ways of storing and handling data quietly working behind them.')}</p></div>
        <div className="use-case-list">{examples.map(([id, titleKo, titleEn, nameKo, nameEn, descriptionKo, descriptionEn]) => <a key={id} href={lesson(id)} className="use-case"><h3>{t(titleKo, titleEn)}</h3><p>{t(descriptionKo, descriptionEn)}</p><span>{t(nameKo, nameEn)}<Arrow /></span></a>)}</div>
      </section>
      <section className="landing-start"><div><h2>{t('알아도 되고, 구경만 해도 됩니다.', 'Understand it, or just enjoy watching.')}</h2><p>{t('멈춰도 되고, 숫자를 바꿔도 됩니다. 코드는 궁금해졌을 때 펼쳐보면 되고요.', 'Pause it. Change a number. Open the code if you get curious.')}</p></div><a className="landing-primary" href={lesson('bubble-sort')}>{t('조금 더 구경하기', 'Watch a little more')}<Arrow /></a></section>
    </main>
    <footer className="landing-footer"><span>{t('이젠 아무래도 좋을 알고리즘', 'Algorithms, for what it’s worth')}</span><span>{t('아무것도 외우지 않았어도, 잘 구경했습니다.', 'Nothing memorized. Time well spent.')}</span></footer>
  </div>;
}
function Arrow() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>; }
