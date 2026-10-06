import degreeSource from '../src/algorithms/math/radian/degreeToRadian.js?raw';
import radianSource from '../src/algorithms/math/radian/radianToDegree.js?raw';
import complexSource from '../src/algorithms/math/complex-number/ComplexNumber.js?raw';
import factorsSource from '../src/algorithms/math/prime-factors/primeFactors.js?raw';
import floatSource from '../src/algorithms/math/binary-floating-point/floatAsBinaryString.js?raw';
import decodeSource from '../src/algorithms/math/binary-floating-point/bitsToFloat.js?raw';
import liuSource from '../src/algorithms/math/liu-hui/liuHui.js?raw';
import partitionSource from '../src/algorithms/math/integer-partition/integerPartition.js?raw';
import pascalSource from '../src/algorithms/math/pascal-triangle/pascalTriangleRecursive.js?raw';
import powerTwoSource from '../src/algorithms/math/is-power-of-two/isPowerOfTwo.js?raw';
import sieveSource from '../src/algorithms/math/sieve-of-eratosthenes/sieveOfEratosthenes.js?raw';
import lcmSource from '../src/algorithms/math/least-common-multiple/leastCommonMultiple.js?raw';
import gcdSource from '../src/algorithms/math/euclidean-algorithm/euclideanAlgorithm.js?raw';
import primeSource from '../src/algorithms/math/primality-test/trialDivision.js?raw';
import fibonacciSource from '../src/algorithms/math/fibonacci/fibonacciNth.js?raw';
import factorialSource from '../src/algorithms/math/factorial/factorial.js?raw';
import type { NumericAlgorithm } from './algorithms';
import { algorithmCode } from '../src/visualization/playback';
import traceBits, { traceFactorial, traceFibonacci, tracePrimality, traceGcd, traceLcm, traceSieve, tracePowerTwo, tracePascal, tracePartition, traceLiuHui, traceFloat, traceFactors, traceComplex, traceRadian } from '../src/visualization/math';
import getBitSource from '../src/algorithms/math/bits/getBit.js?raw';
import setBitSource from '../src/algorithms/math/bits/setBit.js?raw';
import clearBitSource from '../src/algorithms/math/bits/clearBit.js?raw';
import updateBitSource from '../src/algorithms/math/bits/updateBit.js?raw';
import multiplySource from '../src/algorithms/math/bits/multiplyByTwo.js?raw';
import divideSource from '../src/algorithms/math/bits/divideByTwo.js?raw';

export const bits: NumericAlgorithm = {
  id: 'bits', category: 'math', usesStart: false,
  name: { ko: '비트 연산', en: 'Bit manipulation' },
  summary: { ko: '같은 입력에 비트 조회·설정·삭제·갱신·이동을 각각 적용합니다. 오른쪽 끝이 비트 0이며 각 결과는 원래 숫자로부터 독립적으로 계산합니다.', en: 'Apply read, set, clear, update and shifts independently to the same input. The rightmost bit is position zero.' },
  source: algorithmCode([getBitSource, setBitSource, clearBitSource, updateBitSource, multiplySource, divideSource].join('\n')),
  example: [13, 2, 1], time: 'O(1)',
  inputLabels: [{ ko: '숫자, 비트 위치, 비트 값', en: 'Number, bit position, bit value' }, { ko: '', en: '' }],
  inputHint: { ko: '숫자 0–255 · 비트 위치 0–7 · 비트 값 0 또는 1 · 예: 13, 2, 1', en: 'Number 0–255 · bit position 0–7 · bit value 0 or 1 · e.g. 13, 2, 1' },
  run: (values) => traceBits(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    switch (step.type) {
      case 'start': return ko ? ['입력 비트 준비', `숫자 ${v.number}의 이진 표현을 확인합니다. 선택한 비트 위치는 ${v.position}, 갱신 값은 ${v.bitValue}입니다.`] : ['Prepare input bits', `Inspect the binary representation of ${v.number}. Selected position: ${v.position}; update value: ${v.bitValue}.`];
      case 'getBit': return ko ? ['비트 조회', `오른쪽으로 ${v.position}칸 이동한 뒤 1과 AND합니다. 선택한 비트는 ${v.result}입니다.`] : ['Read a bit', `Shift right by ${v.position} then AND with one. Selected bit: ${v.result}.`];
      case 'setBit': return ko ? ['비트를 1로 설정', '1을 선택한 위치로 이동해 OR합니다. 다른 비트는 그대로 유지합니다.'] : ['Set a bit', 'Shift one to the selected position and OR it. Preserve all other bits.'];
      case 'clearBit': return ko ? ['비트를 0으로 삭제', '선택한 위치만 0인 마스크와 AND합니다. 다른 비트는 유지합니다.'] : ['Clear a bit', 'AND with a mask that is zero only at the selected position. Preserve the other bits.'];
      case 'updateBit': return ko ? ['비트 값 갱신', `선택한 위치를 먼저 0으로 만든 뒤 ${v.bitValue}를 OR하여 원하는 값으로 갱신합니다.`] : ['Update a bit', `Clear the selected position, then OR in ${v.bitValue}.`];
      case 'multiplyByTwo': return ko ? ['왼쪽으로 한 칸 이동', `왼쪽 이동은 현재 입력 범위에서 2배가 됩니다. ${v.number} × 2 = ${v.result}.`] : ['Shift left once', `In this input range a left shift doubles the number: ${v.number} × 2 = ${v.result}.`];
      case 'divideByTwo': return ko ? ['오른쪽으로 한 칸 이동', `오른쪽 이동은 2로 나눈 정수 몫입니다. ${v.number} ÷ 2 → ${v.result}.`] : ['Shift right once', `A right shift gives integer division by two: ${v.number} ÷ 2 → ${v.result}.`];
      default: return ko ? ['비트 연산 비교 완료', '각 연산은 원래 입력에 독립적으로 적용했습니다. 단계가 이전 단계의 결과를 이어 받는 연산 사슬은 아닙니다.'] : ['Bit operation comparison complete', 'Each operation was applied independently to the original input; these are not chained transformations.'];
    }
  },
};

export const factorialLesson: NumericAlgorithm = {
  id: 'factorial', category: 'math', usesStart: false,
  name: { ko: '팩토리얼', en: 'Factorial' },
  summary: { ko: '1부터 n까지 차례로 곱합니다. 0!과 1!은 1이며, 누적 곱을 업데이트하는 과정을 확인합니다.', en: 'Multiply integers from 1 through n. Both 0! and 1! are one; inspect each accumulated product.' },
  source: algorithmCode(factorialSource), example: [6], time: 'O(n)',
  inputLabels: [{ ko: 'n', en: 'n' }, { ko: '', en: '' }],
  inputHint: { ko: '정수 하나 · 0–18 · 정확한 JavaScript 정수 범위', en: 'One integer · 0–18 · exact JavaScript integer results' },
  run: (values) => traceFactorial(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['누적 곱 1로 시작', '곱셈의 항등원 1로 시작합니다. n이 0이나 1이면 곱할 값이 없어 그대로 반환합니다.'] : ['Start with product one', 'Start at the multiplicative identity. For n zero or one, return one without multiplying.'];
    if (step.type === 'multiply') return ko ? ['다음 정수 곱하기', `현재 누적 곱에 ${v.i}를 곱했습니다. ${v.expression}.`] : ['Multiply the next integer', `Multiply the accumulated product by ${v.i}: ${v.expression}.`];
    return ko ? ['팩토리얼 완료', `${v.number}! = ${v.result}. 입력 18까지는 JavaScript의 안전한 정수 범위 안에서 정확합니다.`] : ['Factorial ready', `${v.number}! = ${v.result}. Inputs through 18 remain exact safe JavaScript integers.`];
  },
};

export const fibonacciLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'fibonacci',
  name: { ko: '피보나치 수', en: 'Fibonacci number' },
  summary: { ko: 'F(0)=0, F(1)=1에서 시작해 앞의 두 값을 더합니다. 이전 두 값만 유지하는 반복 계산을 확인합니다.', en: 'Start at F(0)=0 and F(1)=1, then add the preceding pair. The iterative calculation keeps only two previous values.' },
  source: algorithmCode(fibonacciSource), example: [10],
  inputHint: { ko: '정수 하나 · 인덱스 n은 0–78 · 정확한 JavaScript 정수 결과', en: 'One integer index n · 0–78 · exact JavaScript integer results' },
  run: (values) => traceFibonacci(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['시작 값 준비', 'F(0)은 0, F(1)은 1입니다. 뒤의 값은 앞의 두 값을 더해 만듭니다.'] : ['Prepare the base values', 'F(0) is zero and F(1) is one. Each later value is the sum of the preceding two.'];
    if (step.type === 'add') return ko ? ['이전 두 값 더하기', `F(${v.index}) = ${v.result}. ${v.expression}. 이전 현재 값을 다음 반복의 이전 값으로 옮깁니다.`] : ['Add the preceding pair', `F(${v.index}) = ${v.result}: ${v.expression}. The former current value becomes the previous value.`];
    return ko ? ['피보나치 수 완료', `F(${v.n}) = ${v.result}. 수열 인덱스는 0부터 시작합니다.`] : ['Fibonacci number ready', `F(${v.n}) = ${v.result}. Sequence indices start at zero.`];
  },
};

export const primalityLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'primality-test',
  name: { ko: '소수 판별', en: 'Primality test' },
  summary: { ko: '2를 먼저 확인하고 √n 이하의 홀수 약수만 검사합니다. 나누어떨어지는 수가 있으면 합성수이고, 없으면 소수입니다.', en: 'Check two first, then odd divisors through √n. A divisor rejects primality; no divisor proves it.' },
  source: algorithmCode(primeSource), example: [97], time: 'O(√n)',
  inputHint: { ko: '정수 하나 · -999부터 999까지 · 1 이하의 수는 소수가 아님', en: 'One integer · -999 to 999 · numbers at most one are not prime' },
  run: (values) => tracePrimality(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['소수 조건 확인', '소수는 1보다 큰 정수입니다. 2와 3은 바로 소수로 판단하고, 더 큰 짝수는 제외합니다.'] : ['Check prime conditions', 'Primes are integers greater than one. Accept two and three immediately; reject larger even numbers.'];
    if (step.type === 'check-divisor') return ko ? ['약수와 나머지 확인', `${v.expression}. 0이면 약수이며 소수가 아닙니다. 약수 쌍 중 하나는 √n 이하이므로 그 범위까지만 검사합니다.`] : ['Check a divisor and remainder', `${v.expression}. Zero means a divisor. One member of a divisor pair is at most √n, so checking through that bound suffices.`];
    return ko ? [v.result ? '소수입니다' : '소수가 아닙니다', v.result ? '√n 이하에서 나누어떨어지는 약수를 찾지 못했습니다. 더 큰 약수도 있을 수 없습니다.' : Number(v.number) <= 1 ? '1 이하의 수는 소수가 아닙니다.' : `약수 ${v.divider}로 나누어떨어집니다.`] : [v.result ? 'It is prime' : 'It is not prime', v.result ? 'No divisor was found through √n, so no larger factor pair is possible.' : Number(v.number) <= 1 ? 'Numbers at most one are not prime.' : `Divisible by ${v.divider}.`];
  },
};

export const gcdLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'euclidean-algorithm',
  name: { ko: '유클리드 호제법', en: 'Euclidean algorithm' },
  summary: { ko: 'gcd(a, b)를 gcd(b, a mod b)로 바꿉니다. 두 번째 값이 0이면 첫 번째 값이 최대공약수입니다.', en: 'Replace gcd(a, b) with gcd(b, a mod b). When the second value is zero, the first is the greatest common divisor.' },
  source: algorithmCode(gcdSource), example: [252, 105], time: 'O(log(min(|a|, |b|)))',
  inputLabels: [{ ko: '두 정수 · a, b', en: 'Two integers · a, b' }, { ko: '', en: '' }],
  inputHint: { ko: '정수 두 개 · 각 값 -999부터 999까지 · 절댓값 사용 · 이 구현에서 gcd(0, 0)=0', en: 'Two integers · -999 to 999 each · absolute values · this implementation defines gcd(0, 0)=0' },
  run: (values) => traceGcd(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start' || step.type === 'enter') return ko ? ['두 수의 절댓값 준비', `${v.expression}를 계산합니다. 음수는 절댓값으로 정규화합니다.`] : ['Prepare absolute values', `Compute ${v.expression}. Normalize negative inputs to absolute values.`];
    if (step.type === 'modulo') return ko ? ['나머지로 문제 줄이기', `${v.expression}. 다음 호출은 gcd(${v.b}, ${Number(v.a) % Number(v.b)})입니다. 나머지를 써도 공약수는 변하지 않습니다.`] : ['Reduce using the remainder', `${v.expression}. Recurse with gcd(${v.b}, ${Number(v.a) % Number(v.b)}); common divisors are unchanged.`];
    if (step.type === 'base') return ko ? ['두 번째 값 0 · 재귀 종료', `gcd(${v.a}, 0) = ${v.a}입니다. 이 값을 이전 호출에 돌려줍니다.`] : ['Second value zero · stop recursion', `gcd(${v.a}, 0) = ${v.a}. Return it to the previous call.`];
    if (step.type === 'return') return ko ? ['최대공약수 전달', `재귀 호출의 답 ${v.result}를 그대로 이전 호출에 전달합니다.`] : ['Return the GCD', `Pass the recursive answer ${v.result} back unchanged.`];
    return ko ? ['최대공약수 완료', `${v.expression} = ${v.result}.`] : ['GCD ready', `${v.expression} = ${v.result}.`];
  },
};

export const lcmLesson: NumericAlgorithm = {
  ...gcdLesson, id: 'least-common-multiple',
  name: { ko: '최소 공배수', en: 'Least common multiple' },
  summary: { ko: '최대공약수를 구한 뒤 |a ÷ gcd(a,b) × b|를 계산합니다. 0이 포함되면 최소 공배수는 0입니다.', en: 'Find the GCD, then compute |a ÷ gcd(a,b) × b|. If either input is zero, the LCM is zero.' },
  source: algorithmCode(lcmSource + '\n' + gcdSource), example: [12, 18],
  inputHint: { ko: '정수 두 개 · 각 값 -999부터 999까지 · 결과는 0 이상', en: 'Two integers · -999 to 999 each · nonnegative result' },
  run: (values) => traceLcm(values),
  explain(step, language) {
    if (step.variables.phase === 'gcd') return gcdLesson.explain(step, language);
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['최소 공배수 준비', '둘 중 하나라도 0이면 결과는 0입니다. 나머지 경우에는 먼저 최대공약수를 구합니다.'] : ['Prepare LCM', 'If either input is zero, return zero. Otherwise calculate their GCD first.'];
    return ko ? ['최소 공배수 완료', Number(v.result) === 0 ? '입력에 0이 있어 결과도 0입니다.' : `${v.expression}. 최대공약수로 먼저 나누어 공통 인수를 중복 계산하지 않습니다.`] : ['LCM ready', Number(v.result) === 0 ? 'A zero input makes the result zero.' : `${v.expression}. Divide by the GCD first to avoid counting shared factors twice.`];
  },
};

export const sieveLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'sieve-of-eratosthenes',
  name: { ko: '에라토스테네스의 체', en: 'Sieve of Eratosthenes' },
  summary: { ko: '작은 소수부터 배수를 지워 n 이하의 모든 소수를 찾습니다. 흰 칸은 후보, 초록은 확정한 소수, 지운 칸은 소수가 아닙니다.', en: 'Remove multiples of small primes to find all primes through n. White means candidate; green means confirmed prime; crossed-out means not prime.' },
  source: algorithmCode(sieveSource), example: [30], time: 'O(n log log n)',
  inputHint: { ko: '정수 하나 · n은 0–120 · 0과 1은 소수가 아님', en: 'One integer n · 0–120 · zero and one are not prime' },
  run: (values) => traceSieve(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['소수 후보 준비', '0과 1을 제외합니다. 나머지 숫자는 아직 소수 후보이며, 확인 전에는 초록색으로 확정하지 않습니다.'] : ['Prepare prime candidates', 'Exclude zero and one. The remaining numbers are candidates, not confirmed primes yet.'];
    if (step.type === 'choose-prime') return ko ? ['남은 후보를 소수로 확정', `${v.current}는 더 작은 소수의 배수로 지워지지 않았으므로 소수입니다. ${v.current}²부터 배수를 지웁니다.`] : ['Confirm a surviving prime', `${v.current} was not removed by a smaller prime, so it is prime. Mark its multiples starting at ${v.current}².`];
    if (step.type === 'mark-composite') return ko ? ['소수의 배수 지우기', `${v.current} = ${v.prime} × ${Number(v.current) / Number(v.prime)}이므로 합성수입니다. p²보다 작은 배수는 더 작은 소수에서 이미 처리했습니다.`] : ['Remove a prime multiple', `${v.current} = ${v.prime} × ${Number(v.current) / Number(v.prime)} is composite. Multiples below p² were already handled by smaller primes.`];
    return ko ? ['소수 목록 완료', `${v.maxNumber} 이하 소수 ${v.count}개: ${v.result || '∅'}.`] : ['Prime list ready', `${v.count} primes through ${v.maxNumber}: ${v.result || '∅'}.`];
  },
};

export const powerTwoLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'is-power-of-two',
  name: { ko: '2의 거듭제곱 판별', en: 'Power of two test' },
  summary: { ko: '나머지 없이 2로 반복해서 나눠 1에 도달하는지 확인합니다. 1=2⁰은 참이며 0과 음수는 거짓입니다.', en: 'Repeatedly divide by two without a remainder and check whether it reaches one. 1=2⁰ is true; zero and negatives are false.' },
  source: algorithmCode(powerTwoSource), example: [32], time: 'O(log n)',
  inputHint: { ko: '정수 하나 · -999부터 999까지 · 1은 2⁰', en: 'One integer · -999 to 999 · one equals 2⁰' },
  run: (values) => tracePowerTwo(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['양수 조건 확인', '2의 정수 거듭제곱은 양수입니다. 1은 바로 성공하고 0과 음수는 제외합니다.'] : ['Check positivity', 'Integer powers of two are positive. One succeeds immediately; zero and negatives are rejected.'];
    if (step.type === 'check') return ko ? ['2로 나눈 나머지 확인', `${v.current} mod 2 = ${Number(v.current) % 2}. 1이 아닌 홀수가 나오면 2의 거듭제곱이 아닙니다.`] : ['Check the remainder modulo two', `${v.current} mod 2 = ${Number(v.current) % 2}. An odd value other than one rejects a power of two.`];
    if (step.type === 'halve') return ko ? ['나머지 없이 절반으로 줄이기', `${v.expression}. 줄인 값에서 다시 같은 조건을 확인합니다.`] : ['Halve without a remainder', `${v.expression}. Repeat the check on the reduced value.`];
    return ko ? [v.result ? '2의 거듭제곱입니다' : '2의 거듭제곱이 아닙니다', v.result ? '나머지 없이 2로 나누어 1에 도달했습니다.' : Number(v.number) < 1 ? '0과 음수는 2의 정수 거듭제곱이 아닙니다.' : `나누는 도중 홀수 ${v.current}가 나왔습니다.`] : [v.result ? 'It is a power of two' : 'It is not a power of two', v.result ? 'Division by two reached one without remainders.' : Number(v.number) < 1 ? 'Zero and negatives are not integer powers of two.' : `Division reached the odd value ${v.current}.`];
  },
};

export const pascalLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'pascal-triangle',
  name: { ko: '파스칼 삼각형', en: "Pascal's triangle" },
  summary: { ko: '각 칸은 바로 위의 두 칸의 합입니다. 삼각형 바깥은 0으로 취급하므로 양끝은 항상 1입니다.', en: 'Each cell sums the two cells above it. Values outside the triangle are zero, so both edges remain one.' },
  source: algorithmCode(pascalSource), example: [6], time: 'O(n²)',
  inputLabels: [{ ko: '마지막 행 번호 · 0부터', en: 'Last row index · zero based' }, { ko: '', en: '' }],
  inputHint: { ko: '정수 하나 · 행 번호 0–12', en: 'One integer · row index 0–12' },
  run: (values) => tracePascal(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'base') return ko ? ['첫 행은 1', '0번 행의 유일한 값은 1입니다. 재귀 호출이 여기서 끝나고 다음 행을 계산합니다.'] : ['The first row is one', 'Row zero contains one. Recursion stops here, then computes successive rows.'];
    if (step.type === 'add') return ko ? ['위의 두 칸 더하기', `${v.row}번 행, ${v.column}번 칸: ${v.expression}. 삼각형 바깥의 값은 0입니다.`] : ['Add the two cells above', `Row ${v.row}, column ${v.column}: ${v.expression}. Values outside the triangle are zero.`];
    return ko ? ['파스칼 삼각형 완성', `${v.row}번 행은 (a+b)^${v.row}의 이항계수입니다. 양끝은 1이고 좌우가 대칭입니다.`] : ['Pascal triangle ready', `Row ${v.row} contains the binomial coefficients of (a+b)^${v.row}. Both edges are one and the row is symmetric.`];
  },
};

export const partitionLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'integer-partition',
  name: { ko: '정수 분할', en: 'Integer partition' },
  summary: { ko: '양의 정수들의 합으로 n을 만드는 경우의 수입니다. 순서는 구분하지 않고 같은 수를 여러 번 사용할 수 있습니다.', en: 'Count ways to express n as a sum of positive integers. Order does not matter; repeated summands are allowed.' },
  source: algorithmCode(partitionSource), example: [6], time: 'O(n²)',
  inputHint: { ko: '정수 하나 · 0–12 · 0의 분할은 빈 합 한 가지', en: 'One integer · 0–12 · zero has one empty partition' },
  run: (values) => tracePartition(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['빈 합에서 시작', '합 0은 빈 합 한 가지입니다. 사용 가능한 수가 없으면 양의 합은 만들 수 없어 첫 행은 0입니다.'] : ['Start with the empty sum', 'There is one empty sum for zero. With no available positive summands, every positive sum has zero ways.'];
    if (step.type === 'copy') return ko ? ['큰 수는 사용할 수 없음', `합 ${v.column}보다 큰 ${v.row}는 쓸 수 없어 바로 위의 경우의 수를 복사합니다.`] : ['The summand is too large', `${v.row} exceeds the sum ${v.column}, so copy the count from the row above.`];
    if (step.type === 'cell-sum') return ko ? ['포함하지 않은 경우 + 포함한 경우', `${v.row}를 쓰지 않는 위 칸과, 한 번 쓰고 남은 합 ${Number(v.column) - Number(v.row)}을 만드는 같은 행의 칸을 더합니다. 같은 행을 참조하므로 반복 사용도 셉니다.`] : ['Exclude it + include it', `Add the row above (without ${v.row}) and the same row at remainder ${Number(v.column) - Number(v.row)} (including ${v.row}). The same-row reference allows repetitions.`];
    return ko ? ['분할 경우의 수 완성', `${v.row}의 정수 분할은 ${v.result}가지입니다. 덧셈 순서만 다른 표현은 같은 분할입니다.`] : ['Partition count ready', `${v.row} has ${v.result} partitions. Different summand orders count as the same partition.`];
  },
};

export const liuLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'liu-hui',
  name: { ko: '류휘 원주율 근사', en: "Liu Hui's π approximation" },
  summary: { ko: '반지름 1인 원에 내접한 정육각형에서 시작합니다. 피타고라스 정리로 변을 나누고 둘레의 절반으로 π를 근사합니다.', en: 'Start with a regular hexagon inscribed in a unit circle. Bisect sides using Pythagoras and approximate π with half the perimeter.' },
  source: algorithmCode(liuSource), example: [5], time: 'O(k)',
  inputLabels: [{ ko: '근사 단계 · 1은 육각형', en: 'Approximation level · one is a hexagon' }, { ko: '', en: '' }],
  inputHint: { ko: '정수 하나 · 1–7 · 6부터 384개 변', en: 'One integer · 1–7 · six to 384 sides' },
  run: (values) => traceLiuHui(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['정육각형에서 시작', '반지름과 육각형의 변 길이는 모두 1입니다. 둘레 6의 절반인 3으로 시작하며 실제 π보다 작습니다.'] : ['Start with a regular hexagon', 'Radius and hexagon side length are one. Half its perimeter is three, below π.'];
    if (step.type === 'split') return ko ? ['변 수를 두 배로 늘리기', `피타고라스 정리로 새 변 길이를 구했습니다. ${v.sides}개 변의 둘레를 2로 나누면 ${v.result}입니다.`] : ['Double the side count', `Pythagoras gives the new side length. Half the perimeter of ${v.sides} sides is ${v.result}.`];
    return ko ? ['원주율 근사 완료', `${v.sides}개 변으로 π ≈ ${v.result}. 내접 다각형이므로 실제 π보다 작고, 변을 늘리면 오차가 줄어듭니다.`] : ['π approximation ready', `${v.sides} sides give π ≈ ${v.result}. The inscribed polygon gives a lower approximation; more sides reduce the error.`];
  },
};

export const floatLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'binary-floating-point',
  name: { ko: '부동소수점 수의 이진 표현', en: 'Binary floating-point representation' },
  summary: { ko: '입력을 IEEE 754 단정밀도 32비트로 저장한 뒤 다시 해석합니다. 부호 1비트, 지수 8비트, 가수 23비트와 반올림 오차를 확인합니다.', en: 'Store an input as IEEE 754 float32, then decode it. Inspect one sign bit, eight exponent bits, 23 fraction bits and rounding error.' },
  source: algorithmCode(floatSource + '\n' + decodeSource), example: [0.1], time: 'O(32)',
  inputLabels: [{ ko: '실수 하나', en: 'One real number' }, { ko: '', en: '' }],
  inputHint: { ko: '유한한 실수 하나 · -999부터 999까지 · 0.1처럼 반올림을 확인해 보세요', en: 'One finite real number · -999 to 999 · try 0.1 to inspect rounding' },
  run: (values) => traceFloat(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['32비트로 저장', 'DataView로 입력을 단정밀도로 반올림해 저장합니다. JavaScript의 원래 숫자는 64비트이므로 저장 후 값이 달라질 수 있습니다.'] : ['Store in 32 bits', 'DataView rounds the input to single precision. JavaScript numbers are originally 64-bit, so the stored value may differ.'];
    if (step.type === 'sign') return ko ? ['부호 비트 읽기', '첫 비트 0은 양수, 1은 음수입니다. 음의 0도 부호 비트를 유지합니다.'] : ['Read the sign bit', 'Zero means positive; one means negative. Negative zero keeps its sign bit.'];
    if (step.type === 'exponent') return ko ? ['지수 편향 빼기', `저장된 지수는 ${v.exponent}입니다. 일반 값은 편향 127을 빼며, 지수 0은 0 또는 비정규화 수를 나타냅니다.`] : ['Subtract the exponent bias', `Stored exponent: ${v.exponent}. Normal values subtract bias 127; zero indicates zero or a subnormal.`];
    if (step.type === 'fraction') return ko ? ['가수 비트 더하기', `각 비트를 2⁻¹, 2⁻², …에 곱해 더하면 ${v.fraction}입니다. 일반 값은 앞의 숨겨진 1을 더합니다.`] : ['Sum the fraction bits', `Weight bits by 2⁻¹, 2⁻², … to obtain ${v.fraction}. Normal values add an implicit leading one.`];
    return ko ? ['저장된 값 복원', `float32 값은 ${v.result}입니다. 0과 비정규화 수는 숨겨진 1이 없으며 지수 -126을 씁니다. 표의 오차는 저장 값에서 입력을 뺀 값입니다.`] : ['Recover the stored value', `The float32 value is ${v.result}. Zero and subnormals have no implicit one and use exponent −126. Error is stored value minus input.`];
  },
};

export const factorsLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'prime-factors',
  name: { ko: '소인수분해', en: 'Prime factors' },
  summary: { ko: '2부터 작은 인수로 반복해서 나눕니다. 남은 수의 제곱근까지만 검사하고, 마지막에 남은 소수도 목록에 추가합니다.', en: 'Repeatedly divide by small factors starting at two. Test through the square root of the remaining value, then append the final prime.' },
  source: algorithmCode(factorsSource), example: [84], time: 'O(√n)',
  inputHint: { ko: '양의 정수 하나 · 1–999 · 1에는 소인수가 없음', en: 'One positive integer · 1–999 · one has no prime factors' },
  run: (values) => traceFactors(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['작은 인수부터 확인', '2부터 시작합니다. 입력 1은 소인수가 없어 빈 인수 목록을 반환합니다.'] : ['Start with small factors', 'Start at two. One has no prime factors and returns an empty list.'];
    if (step.type === 'check') return ko ? ['남은 수를 나누는지 확인', `${v.remaining}을 ${v.factor}로 나눠봅니다. 나누어떨어지면 같은 인수로 다시 나누므로 중복 인수도 보존합니다.`] : ['Test divisibility', `Test ${v.remaining} with ${v.factor}. Repeated division by the same factor preserves multiplicity.`];
    if (step.type === 'divide') return ko ? ['인수를 저장하고 몫으로 줄이기', `${v.factor}를 저장했습니다. ${v.expression}. 남은 수가 줄면 검사 범위도 줄어듭니다.`] : ['Save the factor and reduce', `Save ${v.factor}: ${v.expression}. Reducing the remaining value also reduces the search bound.`];
    if (step.type === 'append') return ko ? ['마지막 소수 추가', `남은 ${v.remaining}에는 제곱근 이하의 약수가 없어 소수입니다. 이를 마지막 인수로 추가합니다.`] : ['Append the final prime', `The remaining ${v.remaining} has no divisor through its square root, so append it as a prime.`];
    return ko ? ['소인수분해 완료', `${v.expression}. 입력 1의 인수 목록은 비어 있으며 빈 곱의 값은 1입니다.`] : ['Factorization ready', `${v.expression}. One has an empty factor list; the empty product equals one.`];
  },
};

export const complexLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'complex-number',
  name: { ko: '복소수', en: 'Complex number' },
  summary: { ko: 'z₁=a+bi와 z₂=c+di의 사칙연산을 독립적으로 비교합니다. 실수부는 가로축, 허수부는 세로축이며 켤레와 극형식도 확인합니다.', en: 'Compare independent arithmetic operations on z₁=a+bi and z₂=c+di. Real parts lie on the horizontal axis, imaginary parts on the vertical; inspect conjugation and polar form too.' },
  source: algorithmCode(complexSource), example: [3, 2, 1, -1], time: 'O(1)',
  inputLabels: [{ ko: 'a, b, c, d · 두 복소수', en: 'a, b, c, d · two complex numbers' }, { ko: '', en: '' }],
  inputHint: { ko: '실수 네 개 · z₁=a+bi, z₂=c+di · 나눗셈을 위해 z₂≠0', en: 'Four real numbers · z₁=a+bi, z₂=c+di · z₂ must be nonzero for division' },
  run: (values) => traceComplex(values),
  explain(step, language) {
    const ko = language === 'ko';
    switch (step.type) {
      case 'start': return ko ? ['두 복소수 준비', '모든 연산은 같은 원래 입력에 독립적으로 적용합니다. 초록 점은 두 입력, 주황 점은 현재 결과입니다.'] : ['Prepare two complex numbers', 'Apply every operation independently to the original inputs. Green points are inputs; orange is the current result.'];
      case 'add': return ko ? ['실수부와 허수부 각각 더하기', '(a+bi)+(c+di)=(a+c)+(b+d)i입니다. 평면에서는 두 벡터를 더합니다.'] : ['Add components', '(a+bi)+(c+di)=(a+c)+(b+d)i. Add the two vectors in the plane.'];
      case 'subtract': return ko ? ['실수부와 허수부 각각 빼기', '(a+bi)−(c+di)=(a−c)+(b−d)i입니다.'] : ['Subtract components', '(a+bi)−(c+di)=(a−c)+(b−d)i.'];
      case 'multiply': return ko ? ['i²=−1을 적용해 곱하기', '(a+bi)(c+di)=(ac−bd)+(ad+bc)i입니다. 크기를 곱하고 각도를 더하는 연산이기도 합니다.'] : ['Multiply using i²=−1', '(a+bi)(c+di)=(ac−bd)+(ad+bc)i. This also multiplies radii and adds angles.'];
      case 'divide': return ko ? ['분모의 켤레로 나누기', '분자와 분모에 c−di를 곱하면 분모가 c²+d²인 실수가 됩니다. 0으로 나누기는 허용하지 않습니다.'] : ['Divide using the conjugate', 'Multiply numerator and denominator by c−di. The denominator becomes the real value c²+d²; division by zero is rejected.'];
      case 'conjugate': return ko ? ['첫 복소수의 켤레', '허수부 부호를 반전합니다. 복소평면에서는 실수축을 기준으로 반사한 점입니다.'] : ['Conjugate the first input', 'Negate the imaginary part. This reflects the point across the real axis.'];
      default: return ko ? ['첫 복소수의 극형식', '크기는 √(a²+b²), 위상은 양의 실수축에서 잰 라디안 각도입니다. 이 구현에서는 0의 위상을 0으로 둡니다. 표시 숫자는 가독성을 위해 6자리로 줄였습니다.'] : ['Polar form of the first input', 'Radius is √(a²+b²); phase is the angle from the positive real axis in radians. This implementation assigns zero phase to zero. Display values use six significant digits.'];
    }
  },
};

export const radianLesson: NumericAlgorithm = {
  ...factorialLesson, id: 'radian',
  name: { ko: '라디안', en: 'Radian' },
  summary: { ko: '반지름과 같은 길이의 호가 만드는 각이 1라디안입니다. 한 바퀴는 360°=2π 라디안이며 도 단위 입력을 변환하고 복원합니다.', en: 'One radian subtends an arc equal to the radius. A full turn is 360°=2π radians; convert a degree input and restore it.' },
  source: algorithmCode(degreeSource + '\n' + radianSource), example: [135], time: 'O(1)',
  inputLabels: [{ ko: '각도 · 도(°)', en: 'Angle · degrees (°)' }, { ko: '', en: '' }],
  inputHint: { ko: '실수 하나 · -999°부터 999°까지 · 음수는 시계 방향', en: 'One real angle · -999° to 999° · negative angles rotate clockwise' },
  run: (values) => traceRadian(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['도 단위 각도 준비', `${v.degree}°입니다. 양수는 반시계 방향, 음수는 시계 방향이며 360°마다 같은 방향으로 돌아옵니다.`] : ['Prepare the angle in degrees', `${v.degree}°. Positive angles are counterclockwise; negative are clockwise. Every 360° returns to the same direction.`];
    if (step.type === 'convert') return ko ? ['도에서 라디안으로 변환', '180°=π 라디안이므로 π/180을 곱합니다. 원 위의 호는 한 바퀴 안에서의 방향을 나타내고 표에는 전체 회전 수를 표시합니다.'] : ['Convert degrees to radians', 'Multiply by π/180 because 180° equals π radians. The arc shows direction within one turn; the table retains total turns.'];
    return ko ? ['라디안에서 도로 복원', '180/π를 곱해 원래 도 단위로 돌아옵니다. 실수 계산의 반올림 때문에 아주 작은 오차가 생길 수 있습니다.'] : ['Restore degrees from radians', 'Multiply by 180/π to restore degrees. Floating-point rounding can cause a tiny error.'];
  },
};

export const mathAlgorithms: NumericAlgorithm[] = [bits, factorialLesson, fibonacciLesson, primalityLesson, gcdLesson, lcmLesson, sieveLesson, powerTwoLesson, pascalLesson, partitionLesson, liuLesson, floatLesson, factorsLesson, complexLesson, radianLesson];
