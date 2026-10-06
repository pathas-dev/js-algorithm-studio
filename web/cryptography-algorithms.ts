import caesarSource from '../src/algorithms/cryptography/caesar-cipher/caesarCipher.js?raw';
import railSource from '../src/algorithms/cryptography/rail-fence-cipher/railFenceCipher.js?raw';
import source from '../src/algorithms/cryptography/polynomial-hash/PolynomialHash.js?raw';
import tracePolynomialHash, { traceRailFence, traceCaesar } from '../src/visualization/cryptography';
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

const railFence: TextAlgorithm = {
  id: 'rail-fence-cipher', category: 'cryptography', inputMode: 'text', example: ['WEAREDISCOVERED', '3'],
  name: { ko: '레일 펜스 암호', en: 'Rail fence cipher' }, time: 'O(n² + nr)',
  summary: { ko: '문자를 지그재그로 레일에 배치한 뒤 위에서 아래로 행을 읽습니다. 문자 자체는 그대로 두고 순서만 바꾸는 전치 암호입니다.', en: 'Place characters along zigzag rails, then read rows from top to bottom. This transposition cipher changes order while preserving characters.' },
  inputLabels: [{ ko: '평문', en: 'Plaintext' }, { ko: '레일 수', en: 'Rails' }],
  inputHint: { ko: '문자 1–24개 · 레일 2–6개 · 공백·이모지 보존 · 원본 재귀 구현의 배열 복사 비용 포함', en: '1–24 characters · 2–6 rails · spaces and emoji preserved · includes array-copy costs of the recursive implementation' },
  source: algorithmCode(railSource), run: traceRailFence,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['맨 위 레일에서 아래 방향으로 시작', '첫 문자를 첫 레일에 놓습니다. 맨 위와 맨 아래에서 진행 방향을 바꿉니다.'] : ['Start on the top rail, moving down', 'Place the first character on the first rail. Reverse direction at the top and bottom.'];
    if (step.type === 'place') return ko ? ['현재 레일에 문자 배치', `위치 ${v.column}의 “${v.letter}”를 레일 ${Number(v.currentRail) + 1}에 놓습니다. 다음 문자는 지그재그 경로의 다음 레일로 이동합니다.`] : ['Place a character on this rail', `Place “${v.letter}” from position ${v.column} on rail ${Number(v.currentRail) + 1}. Move along the zigzag for the next character.`];
    if (step.type === 'read') return ko ? ['레일을 왼쪽부터 이어 읽기', `레일 ${Number(v.currentRail) + 1}까지 이어 읽은 암호문은 “${v.output}”입니다. 세로 방향의 빈 칸은 건너뜁니다.`] : ['Read a rail from left to right', `Reading through rail ${Number(v.currentRail) + 1} gives “${v.output}”. Skip empty positions.`];
    return ko ? ['암호문 완성 · 원본으로 복원 확인', `암호문은 “${v.result}”이며 원본 복호화 함수로 “${v.restored}”가 복원됩니다. 레일 수를 알면 지그재그 경로를 다시 따라갈 수 있습니다.`] : ['Ciphertext ready · round trip verified', `Ciphertext: “${v.result}”. The original decoder restores “${v.restored}” by following the same rail count and zigzag path.`];
  },
};

const caesar: TextAlgorithm = {
  id: 'caesar-cipher', category: 'cryptography', inputMode: 'text', example: ['Hello, xyz!', '3'],
  name: { ko: '시저 암호', en: 'Caesar cipher' }, time: 'O(n + 26)',
  summary: { ko: '영문자를 소문자로 바꾼 뒤 알파벳에서 지정한 칸만큼 이동합니다. z를 넘으면 a로 돌아오며 알파벳 밖의 문자는 그대로 보존합니다.', en: 'Lowercase the input and shift English letters along the alphabet. Wrap past z to a and preserve characters outside the alphabet.' },
  inputLabels: [{ ko: '평문', en: 'Plaintext' }, { ko: '이동 칸 수', en: 'Shift' }],
  inputHint: { ko: '최대 24 UTF-16 칸 · 정수 이동 −100–100 · 출력 소문자 · 음수 이동 가능', en: 'At most 24 UTF-16 units · integer shift −100–100 · lowercase output · negative shifts allowed' },
  source: algorithmCode(caesarSource), run: traceCaesar,
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['알파벳 치환표 준비', `각 영문자를 ${v.shift}칸 이동하는 표를 만듭니다. 원본 함수는 입력을 소문자로 정규화합니다.`] : ['Prepare the substitution alphabet', `Build a mapping that shifts each letter by ${v.shift}. The original function lowercases the input.`];
    if (step.type === 'substitute') return ko ? ['현재 문자를 치환', `“${v.char}” → “${v.encrypted}”. 영문자는 (위치 + 이동) mod 26으로 바꾸고, 공백·숫자·기호 등은 그대로 둡니다.`] : ['Substitute this character', `“${v.char}” → “${v.encrypted}”. English letters use (index + shift) mod 26; spaces, digits and symbols stay unchanged.`];
    return ko ? ['치환 완료 · 반대 이동으로 복원', `암호문은 “${v.result}”, 반대 방향으로 이동한 복원 결과는 “${v.restored}”입니다. 소문자 정규화로 원래 대소문자는 복원되지 않습니다.`] : ['Substitution ready · reverse shift restores text', `Ciphertext: “${v.result}”; reverse shift gives “${v.restored}”. Lowercasing means original letter case is not recovered.`];
  },
};

export const cryptographyAlgorithms: Algorithm[] = [polynomialHash, railFence, caesar];
