# 에라토스테네스의 체

[English](README.md) | [한국어](README.ko-KR.md)

에라토스테네스의 체는 주어진 상한 `n` 이하의 모든 소수를 찾습니다. 0부터 `n`까지의 불리언 배열을 만들고 0과 1은 소수가 아니라고 표시합니다.

2부터 아직 소수 후보인 수 `p`를 선택하고 그 배수들을 제거합니다. 다음에 남은 후보로 옮겨 같은 과정을 반복하면 최종적으로 남은 수들이 소수입니다. `p²`보다 작은 배수는 이미 더 작은 소수 단계에서 제거되므로 `p²`부터 표시할 수 있습니다.

시간 복잡도는 `O(n log log n)`이고 표시 배열에 `O(n)` 공간이 필요합니다. 원문의 애니메이션은 각 소수의 배수가 지워지는 순서를 보여 줍니다.

## 예제·수식·시각 자료

![에라토스테네스의 체 자료](https://upload.wikimedia.org/wikipedia/commons/b/b9/Sieve_of_Eratosthenes_animation.gif)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Sieve_of_Eratosthenes)
