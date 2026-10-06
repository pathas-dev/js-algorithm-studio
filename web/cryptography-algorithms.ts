import source from '../src/algorithms/cryptography/polynomial-hash/PolynomialHash.js?raw';
import tracePolynomialHash from '../src/visualization/cryptography';
import { algorithmCode } from '../src/visualization/playback';
import type { Algorithm, TextAlgorithm } from './algorithms';

const polynomialHash: TextAlgorithm = {
  id: 'polynomial-hash', category: 'cryptography', inputMode: 'text', example: ['banana', '3'],
  name: { ko: '다항식 롤링 해시', en: 'Polynomial rolling hash' }, time: 'O(nw)',
  summary: { ko: '첫 창의 해시를 계산하고, 맨 앞 문자를 빼고 새 문자를 더해 다음 창의 해시를 구합니다. 이 구현은 매 이동마다 앞자리 배수를 계산하므로 창 길이 w에 비례합니다.', en: 'Hash the first window, then remove its leading character and append the next one. This implementation recalculates the leading multiplier per move, taking O(w) per window.' },
  inputLabels: [{ ko: '문자열', en: 'Text' }, { ko: '창 길이', en: 'Window length' }],
  inputHint: { ko: '문자 1–24개 · 창 길이 1–12, 문자열 길이 이하 · base 37, mod 101', en: '1–24 characters · window 1–12, no longer than text · base 37, mod 101' },
  source: algorithmCode(source), run: tracePolynomialHash,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['첫 창의 해시를 0에서 시작', '문자값을 하나씩 더하며 37을 곱하고 101로 나눈 나머지를 보관합니다.'] : ['Start the first hash at zero', 'Multiply by 37, add each character value, and keep the remainder modulo 101.'];
    if (step.type === 'hash') return ko ? ['문자값을 누적하고 나머지 계산', `현재 문자값 ${v.value}를 반영한 해시는 ${v.hash}입니다. 문자값은 원본 구현의 변환 규칙을 따릅니다.`] : ['Accumulate a character and reduce modulo', `Including character value ${v.value} gives hash ${v.hash}. Character values follow the original implementation’s conversion rule.`];
    if (step.type === 'remove') return ko ? ['앞 문자의 자리 기여분 제거', '앞 문자값 × 37^(창 길이−1)을 101로 줄여 뺍니다. 음수가 되지 않도록 먼저 101을 더합니다.'] : ['Remove the leading contribution', 'Subtract the leading value times 37^(window length−1), reduced modulo 101. Add 101 first to keep the result nonnegative.'];
    if (step.type === 'shift') return ko ? ['남은 문자의 자리를 한 칸 이동', '37을 곱해 새 마지막 문자가 들어갈 자리를 만듭니다.'] : ['Shift the remaining character places', 'Multiply by 37 to make room for a new final character.'];
    if (step.type === 'append') return ko ? ['새 마지막 문자 추가', `새 문자값 ${v.value}를 더하고 나머지를 구했습니다. 다음 창의 해시는 ${v.hash}입니다.`] : ['Append the new final character', `Add value ${v.value} and reduce modulo. The next window hash is ${v.hash}.`];
    if (step.type === 'window') return ko ? ['현재 창의 해시 확정', `“${v.windowText}”의 해시는 ${v.hash}입니다. 처음부터 계산한 값과도 일치합니다. 같은 해시라도 서로 다른 문자열일 수 있습니다.`] : ['Record this window hash', `“${v.windowText}” hashes to ${v.hash}, matching a fresh calculation. Different strings can share a hash.`];
    return ko ? ['모든 창의 해시 계산 완료', `창별 해시: ${v.result}. 이동 시 문자열 전체를 다시 읽지 않지만, 앞자리 배수 계산에는 O(w)가 필요합니다.`] : ['All window hashes ready', `Window hashes: ${v.result}. Rolling avoids rereading all characters, but calculating the leading multiplier still takes O(w).`];
  },
};

export const cryptographyAlgorithms: Algorithm[] = [polynomialHash];
