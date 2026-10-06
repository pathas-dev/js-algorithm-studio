import source from '../src/algorithms/image-processing/seam-carving/resizeImageWidth.js?raw';
import traceSeam from '../src/visualization/image-processing';
import { algorithmCode } from '../src/visualization/playback';
import type { Algorithm, TextAlgorithm } from './algorithms';

const seam: TextAlgorithm = {
  id: 'seam-carving', category: 'image-processing', inputMode: 'text',
  example: ['[[20,20,20,200,210,220],[20,20,20,200,210,220],[20,20,20,200,210,220],[20,20,20,200,210,220]]', '4'],
  name: { ko: '심 카빙', en: 'Seam carving' }, time: 'O(rwh)',
  summary: { ko: '작은 회색조 이미지에서 가로 이웃과의 색 차이로 에너지를 계산합니다. 위에서 아래로 이어지는 최소 에너지 경로를 DP로 찾고 한 행에 한 픽셀씩 지워 폭을 줄입니다.', en: 'Calculate horizontal-neighbor color energy on a small grayscale image. Dynamic programming finds a minimum-energy vertical path; removing one pixel per row reduces width.' },
  inputLabels: [{ ko: '회색조 이미지 · JSON 행렬', en: 'Grayscale image · JSON matrix' }, { ko: '목표 폭', en: 'Target width' }],
  inputHint: { ko: '1–6행 × 1–8열 · 정수 밝기 0–255 · 목표 폭 1–현재 폭 · 세로 심 제거', en: '1–6 rows × 1–8 columns · brightness integers 0–255 · target width 1–current width · vertical seam removal' },
  source: algorithmCode(source), run: traceSeam,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['이미지의 폭을 줄일 준비', `현재 ${v.w}×${v.h} 이미지를 폭 ${v.toWidth}로 줄입니다. 픽셀 번호가 아닌 밝기 값이며 어두울수록 값이 작습니다.`] : ['Prepare to reduce image width', `Shrink the ${v.w}×${v.h} image to width ${v.toWidth}. Cell values are brightness, with lower values darker.`];
    if (step.type === 'energy') return ko ? ['가로 이웃과의 밝기 차이 계산', `(${v.x}, ${v.y})의 좌우 색 차이 제곱합에 제곱근을 취합니다. 가장자리에는 존재하는 이웃만 사용하며 세로 차이는 이 구현에 포함되지 않습니다.`] : ['Measure horizontal color differences', `At (${v.x}, ${v.y}), take the square root of squared left/right color differences. Edges use existing neighbors only; this implementation omits vertical differences.`];
    if (step.type === 'first-row') return ko ? ['첫 행은 자기 에너지가 누적 비용', '위에서 시작하므로 첫 행까지의 최솟값은 해당 픽셀의 에너지입니다.'] : ['Initialize top-row cumulative costs', 'A path starts at the top, so each first-row cost equals its own energy.'];
    if (step.type === 'cost') return ko ? ['위의 세 이웃 중 최소 비용 연결', `(${v.x}, ${v.y})의 에너지에 위쪽 열 ${v.minPrevX}까지의 최소 비용을 더합니다. 이동은 왼쪽 위·위·오른쪽 위에서만 허용됩니다.`] : ['Connect the cheapest of three upper neighbors', `Add this pixel’s energy to the cost at upper column ${v.minPrevX}. Allowed predecessors are upper-left, above and upper-right.`];
    if (step.type === 'seam') return ko ? ['최소 비용 끝점에서 경로 역추적', `이전 픽셀 포인터를 따라 아래에서 위로 심을 복원합니다. 전체 심 에너지는 ${Number(v.minSeamEnergy).toFixed(2)}입니다.`] : ['Backtrack from the cheapest bottom endpoint', `Follow predecessor pointers upward to reconstruct the seam. Total seam energy: ${Number(v.minSeamEnergy).toFixed(2)}.`];
    if (step.type === 'remove') return ko ? ['심을 지우고 오른쪽 픽셀 당기기', `${v.removed}개의 세로 심을 제거해 현재 폭은 ${v.w}입니다. 다음 심은 바뀐 이미지의 에너지를 새로 계산해 선택합니다.`] : ['Remove the seam and shift right-side pixels left', `Removed ${v.removed} vertical seams; width is now ${v.w}. Recompute energies on the changed image before selecting another seam.`];
    return ko ? ['목표 폭으로 축소 완료', `결과 크기는 ${v.result}입니다. 이 예제는 픽셀 행렬과 실제 이미지 처리 함수를 사용하며, 단순히 전체 열을 삭제하는 방식이 아닙니다.`] : ['Target width reached', `Result size: ${v.result}. This example uses pixel matrices and the actual image-processing function, removing paths rather than whole columns.`];
  },
};

export const imageAlgorithms: Algorithm[] = [seam];
