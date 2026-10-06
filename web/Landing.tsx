import { useEffect, useState } from 'react';
import './landing.css';

type Language = 'ko' | 'en';
const examples = [
  ['stack', '실행 취소', 'Undo an action', '스택', 'Stack', '가장 최근 작업부터 되돌립니다. 마지막에 넣은 것을 먼저 꺼내는 LIFO 방식입니다.', 'Undo the latest action first. A stack takes out the last item added: LIFO.'],
  ['queue', '순서대로 처리', 'Process in order', '큐', 'Queue', '인쇄 대기열처럼 먼저 들어온 요청부터 처리합니다. 먼저 넣은 것을 먼저 꺼내는 FIFO 방식입니다.', 'Like a print queue, requests are processed in arrival order: first in, first out.'],
  ['trie', '검색어 자동 완성', 'Autocomplete a search', '트라이', 'Trie', '같은 접두사를 공유하는 단어를 모아 입력한 글자로 시작하는 후보를 찾습니다.', 'Group words by shared prefixes to find suggestions starting with the letters typed.'],
  ['dijkstra', '가까운 경로 찾기', 'Find a shorter route', '다익스트라', 'Dijkstra', '도로를 정점과 간선으로 표현하고 이동 비용이 가장 작은 경로를 찾습니다. 음수 비용은 사용할 수 없습니다.', 'Model roads as vertices and edges, then find paths with the lowest cost. Edge costs must be nonnegative.'],
];

export default function Landing() {
  const [language, setLanguage] = useState<Language>(new URLSearchParams(location.search).get('lang') === 'en' ? 'en' : 'ko');
  const [size, setSize] = useState(32);
  const ko = language === 'ko';
  const t = (korean: string, english: string) => ko ? korean : english;
  const lesson = (id: string) => `?lesson=${id}&lang=${language}`;
  useEffect(() => {
    document.documentElement.lang = language;
    document.title = t('Algorithm Studio · 생각을 움직여 보세요', 'Algorithm Studio · See your thinking in motion');
    const url = new URL(location.href);
    if (language === 'en') url.searchParams.set('lang', 'en');
    else url.searchParams.delete('lang');
    history.replaceState(null, '', url);
  }, [language]);
  const models = [
    { notation: 'O(1)', count: 1, name: t('배열의 특정 위치 읽기', 'Read an array index'), note: t('입력이 늘어도 일정', 'Constant as input grows'), color: '#536a5c' },
    { notation: 'O(log n)', count: Math.ceil(Math.log2(size)), name: t('이진 탐색', 'Binary search'), note: t('탐색 범위를 절반씩 줄이기', 'Halve the search space'), color: '#277957' },
    { notation: 'O(n)', count: size, name: t('배열을 한 번 훑기', 'Scan an array once'), note: t('입력 크기에 비례', 'Proportional to input size'), color: '#9a651d' },
    { notation: 'O(n²)', count: size * (size - 1) / 2, name: t('버블 정렬 · 최악의 비교', 'Bubble sort · worst-case comparisons'), note: t('입력이 커질수록 빠르게 증가', 'Grows rapidly with input size'), color: '#ad5437' },
  ];
  return <div className="landing">
    <a className="landing-skip" href="#warmup">{t('워밍업으로 건너뛰기', 'Skip to the warmup')}</a>
    <header className="landing-header">
      <a className="brand" href={language === 'en' ? '?lang=en' : '/'}><img className="brand-mark" src="/favicon.svg" width="32" height="32" alt="" />Algorithm Studio</a>
      <nav aria-label={t('주요 메뉴', 'Main navigation')}>
        <a href="#warmup">Big O</a><a href="#use-cases">{t('어디에 쓰일까?', 'Where is it used?')}</a>
        <button onClick={() => setLanguage(ko ? 'en' : 'ko')}>{ko ? 'English' : '한국어'}</button>
      </nav>
    </header>
    <main>
      <section className="landing-intro" aria-labelledby="intro-title">
        <div className="intro-copy">
          <h1 id="intro-title">{t('외우기 전에,', 'Before you memorize,')}<br /><span>{t('움직여 보세요.', 'see it move.')}</span></h1>
          <p>{t('복잡해 보이는 알고리즘도 작은 선택의 연속입니다. 먼저 감을 잡고, 입력을 바꾸고, 한 단계씩 따라가 보세요.', 'Every algorithm is a sequence of small decisions. Get a feel for the ideas, change the input, and follow each step.')}</p>
          <div className="intro-links"><a className="landing-primary" href={lesson('bubble-sort')}>{t('버블 정렬부터 시작하기', 'Start with bubble sort')}<Arrow /></a><a className="landing-text-link" href="#warmup">{t('가볍게 워밍업', 'Warm up first')}<Arrow /></a></div>
        </div>
        <a className="intro-demo" href={lesson('bubble-sort')} aria-label={t('버블 정렬 시각화 열기', 'Open the bubble sort visualization')}>
          <div className="demo-heading"><span>{t('이웃한 두 값, 한 번의 비교', 'Two neighbors. One comparison.')}</span><span className="demo-code">5 &gt; 2</span></div>
          <div className="demo-bars" aria-hidden="true">{[3, 5, 2, 4, 1, 6].map((value, index) => <div key={index} className={index === 1 || index === 2 ? 'demo-bar comparing' : 'demo-bar'} style={{ height: `${value * 25}px` }}><span>{value}</span></div>)}</div>
          <div className="demo-explanation"><span className="demo-pair">[5, 2] <Arrow /> [2, 5]</span><p>{t('왼쪽 값이 더 크면 자리를 바꿉니다.', 'Swap them when the left value is larger.')}</p></div>
          <div className="demo-bottom"><span>{t('이 작은 선택을 반복하면 정렬이 됩니다.', 'Repeat this small decision to sort the array.')}</span><Arrow /></div>
        </a>
      </section>
      <section className="landing-warmup" id="warmup" aria-labelledby="big-o-title">
        <div className="section-intro"><h2 id="big-o-title">{t('데이터가 늘어나면,', 'As the data grows,')}<br />{t('할 일은 얼마나 늘어날까요?', 'how much more work is there?')}</h2><p>{t('Big O는 입력 크기 n이 커질 때 필요한 시간이나 공간의 증가를 나타내는 상한 표기입니다. 초 단위의 속도가 아니라, 증가하는 모양을 읽습니다.', 'Big O describes an upper bound on how time or space grows with input size n. It describes the pattern of growth, not a speed measured in seconds.')}</p></div>
        <div className="complexity-lab">
          <div className="lab-control"><label htmlFor="input-size">{t('입력 크기', 'Input size')} <strong>n = {size}</strong></label><input id="input-size" type="range" min="1" max="7" value={Math.log2(size)} aria-valuetext={`n = ${size}`} onChange={(event) => setSize(2 ** Number(event.target.value))} /><span>2–128</span></div>
          <div className="complexity-rows">{models.map((model) => <div className="complexity-row" key={model.notation}><div className="complexity-label"><strong>{model.notation}</strong><span>{model.name}</span></div><div className="complexity-meter"><div style={{ transform: `scaleX(${model.count / 8128})`, backgroundColor: model.color }} /></div><output aria-label={`${model.notation} ${t('모형 연산 수', 'model operations')}`}>{model.count.toLocaleString(language)}</output><small>{model.note}</small></div>)}</div>
          <p className="lab-caption">{t('막대는 같은 축의 단순 연산 모형입니다: 1, ⌈log₂ n⌉, n, n(n−1)/2. 실제 실행 시간이나 모든 구현의 정확한 연산 수는 아닙니다.', 'Bars use simple operation models on a shared scale: 1, ⌈log₂ n⌉, n, n(n−1)/2. They are not measured runtimes or exact counts for every implementation.')}</p>
        </div>
        <div className="warmup-notes"><p><strong>{t('조건도 함께 읽기', 'Read the conditions, too')}</strong>{t('이진 탐색은 정렬된 데이터가 필요합니다. 버블 정렬의 O(n²)는 최악의 경우이며, 조기 종료를 쓰면 이미 정렬된 배열은 O(n)입니다.', 'Binary search needs sorted data. Bubble sort is O(n²) in the worst case; early exit makes an already sorted array O(n).')}</p><p><strong>{t('시간과 공간은 다른 질문', 'Time and space ask different questions')}</strong>{t('얼마나 많이 계산하는지, 얼마나 많은 메모리를 쓰는지 구분하세요. 병합 정렬은 보통 O(n log n) 시간과 O(n) 추가 공간을 사용합니다.', 'Distinguish how much computation you do from how much memory you use. Merge sort typically takes O(n log n) time and O(n) auxiliary space.')}</p></div>
      </section>
      <section className="landing-use-cases" id="use-cases" aria-labelledby="uses-title">
        <div className="section-intro"><h2 id="uses-title">{t('이미 매일 쓰고 있는 아이디어.', 'Ideas you already use every day.')}</h2><p>{t('자료 구조는 데이터를 담는 방식, 알고리즘은 문제를 푸는 절차입니다. 익숙한 기능에서 출발하면 둘의 역할이 선명해집니다.', 'A data structure organizes data; an algorithm is a procedure for solving a problem. Familiar features make their roles easier to see.')}</p></div>
        <div className="use-case-list">{examples.map(([id, titleKo, titleEn, nameKo, nameEn, descriptionKo, descriptionEn]) => <a key={id} href={lesson(id)} className="use-case"><h3>{t(titleKo, titleEn)}</h3><p>{t(descriptionKo, descriptionEn)}</p><span>{t(nameKo, nameEn)}<Arrow /></span></a>)}</div>
      </section>
      <section className="landing-start"><div><h2>{t('이제, 한 단계씩 확인해 볼까요?', 'Ready to follow each step?')}</h2><p>{t('재생을 멈추고, 값을 바꾸고, 코드와 움직임을 연결해 보세요.', 'Pause the playback, change a value, and connect the code with the movement.')}</p></div><a className="landing-primary" href={lesson('bubble-sort')}>{t('시각화 열기', 'Open the visualizer')}<Arrow /></a></section>
    </main>
    <footer className="landing-footer"><span>Algorithm Studio</span><span>{t('천천히 살펴보세요. 이해는 속도보다 방향입니다.', 'Take your time. Understanding is about direction, not speed.')}</span></footer>
  </div>;
}
function Arrow() { return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>; }
