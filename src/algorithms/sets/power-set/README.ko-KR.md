# 멱집합

[English](README.md) | [한국어](README.ko-KR.md)

집합 `S`의 멱집합 `P(S)`는 빈 집합과 `S` 자신을 포함한 모든 부분집합의 집합입니다. 원소가 `n`개이면 각 원소를 포함하거나 제외하는 두 가지 선택이 있어 부분집합은 `2^n`개입니다.

비트 방식은 `0`부터 `2^n-1`까지의 비트를 원소의 포함 여부로 해석합니다. 백트래킹은 원소를 추가하고 결과를 기록한 뒤 되돌려 다른 선택을 탐색합니다. 확장 방식은 빈 부분집합에서 시작해 각 기존 부분집합에 새 원소를 추가한 사본을 만들어 붙입니다.

`[1,2,3]`에서는 각 원소를 처리할 때 결과 수가 1, 2, 4, 8개로 늘어납니다. 전체 결과 자체가 지수적으로 커지므로 입력 크기에 주의해야 합니다.

## 예제·수식·시각 자료

```text
{
  {}, // (also denoted empty set ∅ or the null set)
  {x},
  {y},
  {z},
  {x, y},
  {x, z},
  {y, z},
  {x, y, z}
}
```

![멱집합 자료](https://www.mathsisfun.com/sets/images/power-set.svg)

![멱집합 자료](https://upload.wikimedia.org/wikipedia/commons/e/ea/Hasse_diagram_of_powerset_of_3.svg)

|       | `abc` | 부분집합        |
| :---: | :---: | :-----------: |
| `0`   | `000` | `{}`          |
| `1`   | `001` | `{c}`         |
| `2`   | `010` | `{b}`         |
| `3`   | `011` | `{c, b}`      |
| `4`   | `100` | `{a}`         |
| `5`   | `101` | `{a, c}`      |
| `6`   | `110` | `{a, b}`      |
| `7`   | `111` | `{a, b, c}`   |

```text
powerSets = [[]]
```

```text
originalSet = [1, 2, 3]
```

```text
[[]] ← 1 = [[], [1]]
```

```text
[[], [1]] ← 2 = [[], [1], [2], [1, 2]]
```

```
[[], [1], [2], [1, 2]] ← 3 = [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]]
```

## 구현과 참고 자료

- [bwPowerSet.js](./bwPowerSet.js)
- [btPowerSet.js](./btPowerSet.js)
- [caPowerSet.js](./caPowerSet.js)
- [Wikipedia](https://en.wikipedia.org/wiki/Power_set)
- [Math is Fun](https://www.mathsisfun.com/sets/power-set.html)
