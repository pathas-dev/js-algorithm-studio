/** @param {import('../../web/algorithms').Step} step */
export default function bubbleAction(step, language) {
  const t = (ko, en) => (language === 'ko' ? ko : en);
  const { array, variables } = step;
  switch (step.type) {
    case 'start':
      return [t('준비', 'Prepare'), t(`${array.length}개 값`, `${array.length} values`), t('복사본에서 정렬 시작', 'Sort a copy of the input')];
    case 'compare': {
      const [a, b] = step.indices.map((index) => array[index].value);
      let relation = '=';
      if (a > b) relation = '>';
      if (a < b) relation = '<';
      return [t('비교', 'Compare'), `${a} ${relation} ${b}`, a > b ? t('두 값을 교환합니다', 'Swap the pair next') : t('현재 순서를 유지합니다', 'Keep the current order')];
    }
    case 'swap': {
      // Swap snapshots already contain the new order.
      const [a, b] = step.indices.map((index) => array[index].value);
      return [t('교환', 'Swap'), `${a} < ${b}`, t('작은 값이 왼쪽으로', 'Smaller value moves left')];
    }
    case 'pass':
      return [t('순회 완료', 'Pass complete'), t(`${variables.i}번째 순회`, `Pass ${variables.i}`), variables.swapped ? t('뒤쪽 한 자리를 확정합니다', 'Settle one position at the end') : t('교환 없음 · 조기 종료', 'No swaps · finish early')];
    default:
      return [t('완료', 'Sorted'), t(`${array.length}개 값`, `${array.length} values`), array.length ? t('오름차순 정렬 완료', 'Ascending order complete') : t('빈 배열 · 비교할 값 없음', 'Empty array · nothing to compare')];
  }
}
