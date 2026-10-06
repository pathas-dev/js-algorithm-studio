import bubbleAction from './bubble-action';

/**
 * @param {import('../../web/algorithms').Algorithm} algorithm
 * @param {import('../../web/algorithms').Step} step
 */
export default function stepAction(algorithm, step, language, title, index, length) {
  if (algorithm.id === 'bubble-sort') return bubbleAction(step, language);
  const t = (ko, en) => (language === 'ko' ? ko : en);
  const v = step.variables;
  const { type, indices, array } = step;
  const pair = indices.map((position) => array[position] && array[position].value);
  const relation = (a, b) => {
    if (a < b) return '<';
    if (a > b) return '>';
    return '=';
  };
  let label = t('진행', 'Step');
  let evidence = `${index + 1} / ${length}`;
  let decision = title;

  if (/start|init|buckets/.test(type)) label = t('준비', 'Prepare');
  else if (/compare|inspect|probe|check|test|balance|range|block/.test(type)) label = t('확인', 'Check');
  else if (/swap/.test(type)) label = t('교환', 'Swap');
  else if (/rotation/.test(type)) label = t('회전', 'Rotate');
  else if (/delete|remove|prune/.test(type)) label = t('삭제', 'Remove');
  else if (/push|enqueue|add|insert|append|prepend|makeSet|choose|take/.test(type)) label = t('추가', 'Add');
  else if (/peek|poll|pop|dequeue|find|get|has|query|degree|neighbors|mayContain|suggest/.test(type)) label = t('조회', 'Read');
  else if (/left|right|shift|jump|enter|leave|focus|fallback|return/.test(type)) label = t('이동', 'Move');
  else if (/low|relax|recolor|save|set|count|prefix|place|reverse|union|increase|combine|hash/.test(type)) label = t('갱신', 'Update');
  if (/done|complete|settled|merged|pass|partition/.test(type)) label = t('완료', 'Finish');
  if (/found|match/.test(type)) label = t('일치', 'Match');
  if (['negative-cycle', 'cycle'].includes(type)) label = t('사이클', 'Cycle');

  if (algorithm.category === 'sort') {
    if (pair.length === 2) evidence = `${pair[0]} ${relation(pair[0], pair[1])} ${pair[1]}`;
    else if (v.pivotIndex !== undefined) evidence = `pivot = ${array[Number(v.pivotIndex)] ? array[Number(v.pivotIndex)].value : '∅'}`;
    else if (v.gap !== undefined) evidence = `gap = ${v.gap}`;
    else if (v.bucket !== undefined) evidence = `bucket = ${v.bucket}`;
    else if (v.position !== undefined) evidence = `index = ${v.position}`;
    else if (v.minIndex !== undefined) evidence = `min = ${array[Number(v.minIndex)] ? array[Number(v.minIndex)].value : '∅'}`;
    else if (v.depth !== undefined) evidence = `depth = ${v.depth}`;
    else if (v.heapSize !== undefined) evidence = `heap = ${v.heapSize}`;
    else evidence = `n = ${array.length}`;
    if (type === 'compare' && pair.length === 2) {
      const [a, b] = pair;
      if (algorithm.id === 'selection-sort') decision = a < b ? t('최솟값을 갱신합니다', 'Update the minimum next') : t('현재 최솟값을 유지합니다', 'Keep the current minimum');
      else if (algorithm.id === 'merge-sort') decision = a <= b ? t('왼쪽 값을 먼저 선택합니다', 'Take the left value next') : t('오른쪽 값을 먼저 선택합니다', 'Take the right value next');
      else if (['insertion-sort', 'shell-sort'].includes(algorithm.id)) decision = a > b ? t('작은 값을 왼쪽으로 옮깁니다', 'Move the smaller value left') : t('현재 순서를 유지합니다', 'Keep the current order');
      else if (algorithm.id === 'quick-sort') decision = a < b ? t('왼쪽 분할 구간에 넣습니다', 'Add to the left partition') : t('오른쪽 구간에 남깁니다', 'Keep in the right partition');
    }
  } else if (algorithm.category === 'linked-list') {
    evidence = type === 'visit' ? `N${v.current}` : `n = ${array.length}`;
    if (type === 'visit') label = t('방문', 'Visit');
  } else if (algorithm.category === 'tree') {
    evidence = `n = ${array.length}`;
    if (type === 'edge') evidence = `${v.current} → ${v.next}`;
    else if (type === 'enter' || type === 'leave') evidence = `node = ${v.current}`;
  } else if (algorithm.category === 'sets') {
    evidence = `count = ${v.count === undefined ? array.length : v.count}`;
    if (v.mode === 'combination-sum' && type !== 'done') evidence = `remaining = ${v.remainingSum}`;
    if (v.mode === 'maximum-subarray') evidence = type === 'done' ? `max = ${v.maxSum}` : `sum = ${v.currentSum}`;
    if (v.mode === 'scs') evidence = `length = ${v.count}`;
    if (v.mode === 'lis') {
      evidence = `n = ${array.length}`;
      if (type === 'done') evidence = `length = ${v.result}`;
      else if (type === 'compare' || type === 'update') {
        const previous = array[Number(v.previousElementIndex)].value;
        const current = array[Number(v.currentElementIndex)].value;
        evidence = `${previous} ${relation(previous, current)} ${current}`;
      }
    }
    if (v.mode === 'shuffle' && v.i !== undefined) evidence = type === 'select' ? `[0, ${v.i}] → ${v.randomIndex}` : `${v.i} ↔ ${v.randomIndex}`;
  } else if (algorithm.category === 'math') {
    evidence = typeof v.result === 'number' && Math.abs(v.result) >= 1e6
      ? `≈ ${v.result.toExponential(2)}` : `= ${v.result}`;
    if (v.mode === 'fourier') evidence = v.frequency < 0 ? `N = ${v.N}` : `k = ${v.frequency}`;
    if (v.mode === 'root' && v.result === '—') evidence = `x ≈ ${Number(v.root).toPrecision(5)}`;
    if (v.mode === 'distance' && v.result === '—') evidence = `Σ = ${v.sum}`;
    if (v.mode === 'matrix-product') evidence = type === 'done' ? 'C = A × B' : `C[${v.row < 0 ? '…' : v.row}, ${v.column < 0 ? '…' : v.column}]`;
    if (v.mode === 'power' && v.result === '—') evidence = `p = ${v.power}`;
    if (v.mode === 'complex') evidence = 'z₁, z₂';
    if (v.mode === 'factors') evidence = type === 'done' ? `n = ${v.number}` : `n = ${v.remaining}`;
    if (v.mode === 'partition') evidence = type === 'done' ? `= ${v.result}` : `dp[${v.row}, ${v.column}]`;
    if (v.mode === 'pascal') evidence = `row = ${v.row}`;
    if (v.mode === 'power-two' && v.result === '—') evidence = `n = ${v.current}`;
    if (v.mode === 'sieve') evidence = type === 'done' ? `count = ${v.count}` : `n = ${v.maxNumber}`;
    if (v.mode === 'gcd' && v.result === '—') evidence = `gcd(${v.a}, ${v.b})`;
  } else if (algorithm.category === 'search') {
    let position = v.middleIndex;
    if (position === undefined) position = v.index;
    if (position === undefined && type === 'block') position = v.high;
    if (position !== undefined && array[Number(position)] && ['compare', 'probe', 'block'].includes(type)) {
      const { value } = array[Number(position)];
      evidence = `${v.target} ${relation(Number(v.target), value)} ${value}`;
      if (value === v.target) decision = t('목표 값과 일치합니다', 'The target matches');
      else if (algorithm.id === 'linear-search' || (algorithm.id === 'jump-search' && type === 'compare')) decision = t('다음 위치를 확인합니다', 'Check the next position');
      else if (algorithm.id === 'jump-search' && type === 'block' && value > Number(v.target)) decision = t('현재 블록 안에서 검색합니다', 'Search within the current block');
      else decision = value < Number(v.target) ? t('오른쪽을 탐색합니다', 'Search to the right') : t('왼쪽을 탐색합니다', 'Search to the left');
    } else if (type === 'done') {
      const matches = String(v.matches === undefined ? '' : v.matches).split(',').filter(Boolean);
      evidence = matches.length ? `index = ${matches[0]}` : '−1';
      if (algorithm.id === 'linear-search') evidence = `matches = ${matches.length}`;
      decision = matches.length ? t('일치 위치를 반환합니다', 'Return matching positions') : t('목표 값을 찾지 못했습니다', 'The target was not found');
    } else if (v.low !== undefined && v.high !== undefined) evidence = `[${v.low}, ${v.high}]`;
    else evidence = `target = ${v.target}`;
  } else if (algorithm.category === 'graph') {
    if (v.current !== undefined && v.current !== '' && v.next !== undefined && v.next !== '') evidence = `${v.current} → ${v.next}`;
    else if (v.current !== undefined && v.current !== '') evidence = `node = ${v.current}`;
    else if (v.via !== undefined) evidence = `via = ${v.via}`;
    else if (v.iteration !== undefined) evidence = `round = ${v.iteration}`;
    else if (v.weight !== undefined) evidence = `weight = ${v.weight}`;
    else evidence = `V = ${array.length}`;
    if (algorithm.id === 'travelling-salesman') {
      evidence = type === 'done' ? `cost = ${v.weight}` : `cost = ${v.cost}`;
      if (type === 'compare-tour') {
        evidence = `${v.cost} / ${v.best}`;
        const candidate = v.cost === '∞' ? Infinity : Number(v.cost);
        const best = v.best === '∞' ? Infinity : Number(v.best);
        decision = candidate < best ? t('더 저렴한 순회를 저장합니다', 'Save a cheaper tour next') : t('현재 최저 비용을 유지합니다', 'Keep the current best cost');
      }
    }
    if (type === 'edge' && ['breadth-first-search', 'depth-first-search'].includes(algorithm.id)) {
      const seen = String(v.seen).split(',').includes(String(v.next));
      decision = seen ? t('이미 발견한 정점 · 건너뜁니다', 'Already discovered · skip') : t('새 이웃을 탐색합니다', 'Explore the new neighbor');
    }
    if (type === 'compare' && v.candidate !== undefined && v.distances !== undefined) {
      const distances = JSON.parse(String(v.distances));
      const previous = distances[String(v.next)] === null ? Infinity : distances[String(v.next)];
      const improves = Number(v.candidate) < previous;
      decision = improves ? t('더 짧은 거리로 갱신합니다', 'Update to the shorter distance') : t('기존 거리를 유지합니다', 'Keep the current distance');
    }
  } else if (algorithm.category === 'dp' || v.dpMatrix !== undefined) {
    if (Number(v.row) >= 0 && Number(v.column) >= 0) evidence = `[${v.row}, ${v.column}]`;
    else if (v.length !== undefined) evidence = `length = ${v.length}`;
    else if (typeof v.result === 'number' || typeof v.result === 'boolean') evidence = `result = ${v.result}`;
    else if (v.rows !== undefined && v.columns !== undefined) evidence = `${JSON.parse(String(v.rows)).length} × ${JSON.parse(String(v.columns)).length}`;
    if (type === 'cell-min') decision = t('삭제·삽입·치환 중 최소 비용', 'Minimum edit cost of three');
    if (type === 'cell-max') decision = t('위·왼쪽 중 더 긴 수열', 'Longer of top and left');
    if (type === 'choose-value') decision = Number(v.take) > Number(v.skip) ? t('물건을 선택하는 가치가 큽니다', 'Taking the item is better') : t('물건을 제외해도 최적입니다', 'Skipping is also optimal');
  } else if (algorithm.category === 'string') {
    if (type === 'hash-compare') {
      evidence = `${v.wordHash} ${relation(Number(v.wordHash), Number(v.currentFrameHash))} ${v.currentFrameHash}`;
      decision = v.wordHash === v.currentFrameHash ? t('같은 해시 · 문자열을 검증합니다', 'Equal hashes · verify strings') : t('다른 해시 · 다음 창으로 이동', 'Different hashes · move on');
    } else if (type === 'compare') {
      const text = String(v.text)[Number(v.textIndex)];
      const pattern = String(v.pattern)[Number(v.wordIndex)];
      evidence = `[${v.textIndex}, ${v.wordIndex}]`;
      decision = text === pattern ? t('같은 문자 · 다음 글자 비교', 'Equal characters · advance') : t('다른 문자 · 비교 위치 이동', 'Mismatch · move the comparison');
    } else if (v.prefixIndex !== undefined && v.suffixIndex !== undefined) evidence = `[${v.prefixIndex}, ${v.suffixIndex}]`;
    else if (v.charIndex !== undefined) evidence = `index = ${v.charIndex}`;
    else if (v.textIndex !== undefined && v.wordIndex !== undefined) evidence = `[${v.textIndex}, ${v.wordIndex}]`;
    else if (typeof v.result === 'number') evidence = `index = ${v.result}`;
    else evidence = `offset = ${v.alignment}`;
    if (algorithm.id === 'palindrome') {
      evidence = type === 'done' ? `result = ${v.result}` : `[${v.left}, ${v.right}]`;
      if (type === 'compare') {
        const characters = [...String(v.text)];
        decision = characters[Number(v.left)] === characters[Number(v.right)] ? t('같은 문자 · 안쪽으로 이동합니다', 'Equal characters · move inward') : t('다른 문자 · 회문이 아닙니다', 'Different characters · reject');
      }
    }
    if (algorithm.id === 'hamming-distance') {
      evidence = `distance = ${v.distance}`;
      if (type === 'compare') decision = String(v.text)[Number(v.textIndex)] === String(v.pattern)[Number(v.wordIndex)] ? t('같은 문자 · 거리를 유지합니다', 'Equal characters · keep distance') : t('다른 문자 · 거리를 1 늘립니다', 'Different characters · add one');
    }
    if (type === 'done' && algorithm.id === 'z-search') evidence = `matches = ${String(v.result).split(',').filter(Boolean).length}`;
    if (type === 'verify') decision = v.equal ? t('문자열도 일치 · 검색 완료', 'Strings match · found') : t('해시 충돌 · 일치에서 제외', 'Hash collision · reject');
  } else {
    if (v.row !== undefined && v.column !== undefined) evidence = `[${v.row}, ${v.column}]`;
    else if (v.queryLeft !== undefined && v.queryRight !== undefined) evidence = `[${v.queryLeft}, ${v.queryRight}]`;
    else if (v.left !== undefined && v.right !== undefined) evidence = `[${v.left}, ${v.right}]`;
    else if (v.rotation !== undefined) evidence = `${v.rotation} · ${v.current}`;
    else if (v.charIndex !== undefined) evidence = `char = ${Number(v.charIndex) + 1}`;
    else if (v.keyHash !== undefined) evidence = `bucket = ${v.keyHash}`;
    else if (v.position !== undefined) evidence = `index = ${v.position}`;
    else if (v.i !== undefined) evidence = `i = ${v.i}`;
    else if (typeof v.result === 'boolean' || typeof v.result === 'number' || (v.result !== undefined && ['null', 'undefined'].includes(String(v.result)))) evidence = `result = ${v.result}`;
    else if (v.value !== undefined && v.other !== undefined) evidence = `${v.value} ↔ ${v.other}`;
    else if (typeof v.value === 'number') evidence = `value = ${v.value}`;
    else if (v.current !== undefined && v.current !== '') evidence = `node = ${v.current}`;
    else if (v.word !== undefined) evidence = t(`${Array.from(String(v.word)).length}글자`, `${Array.from(String(v.word)).length} chars`);
    else if (v.heapSize !== undefined) evidence = `heap = ${v.heapSize}`;

    if (['compare-up', 'compare-down'].includes(type) && pair.length === 2) {
      // Heap traces record child,parent upward and parent,child downward.
      let [a, b] = type === 'compare-up' ? [...pair].reverse() : pair;
      if (algorithm.id === 'priority-queue') {
        const priorities = JSON.parse(String(v.priorities));
        a = priorities[String(a)]; b = priorities[String(b)];
      }
      evidence = `${a} ${relation(a, b)} ${b}`;
      const ordered = algorithm.id === 'max-heap' ? a >= b : a <= b;
      decision = ordered ? t('힙 순서를 유지합니다', 'Heap order is correct') : t('부모와 자식을 교환합니다', 'Swap parent and child next');
    }
    if (['inspect-insert', 'inspect-find'].includes(type) && typeof v.current === 'number') {
      evidence = `${v.value} ${relation(Number(v.value), v.current)} ${v.current}`;
      if (Number(v.value) === v.current) decision = type === 'inspect-insert' ? t('중복 값 · 기존 노드를 유지합니다', 'Duplicate · keep the existing node') : t('목표 노드를 찾았습니다', 'The target node was found');
      else decision = Number(v.value) < v.current ? t('왼쪽 자식으로 이동합니다', 'Move to the left child') : t('오른쪽 자식으로 이동합니다', 'Move to the right child');
    }
    if (type === 'balance') { evidence = `b = ${v.balance}`; decision = Math.abs(Number(v.balance)) <= 1 ? t('높이 균형을 유지합니다', 'Height balance is valid') : t('회전으로 균형을 복구합니다', 'Restore balance with a rotation'); }
    if (type === 'mayContain') decision = v.result ? t('존재 가능성 있음 · 확정은 아님', 'Possibly present · not proof') : t('확실히 없는 단어입니다', 'Definitely absent');
    if (type === 'total') decision = t('전체 포함 · 저장된 합 반환', 'Total overlap · use stored sum');
    if (type === 'none') decision = t('겹치지 않음 · 0 반환', 'No overlap · return zero');
    if (type === 'partial') decision = t('부분 포함 · 두 자식 조회', 'Partial overlap · query children');
    if (type === 'done') evidence = typeof v.result === 'number' ? `result = ${v.result}` : `n = ${array.length}`;
  }
  return [label, evidence, decision];
}
