# 플로이드–워셜 알고리즘

[English](README.md) | [한국어](README.ko-KR.md)

플로이드–워셜 알고리즘은 모든 정점 쌍 사이의 최단 거리를 한 번에 구합니다. 음수 간선을 허용하지만, 유한한 최단 거리를 구하려면 관련 경로에 음수 사이클이 없어야 합니다.

중간 정점으로 사용할 수 있는 집합을 하나씩 늘립니다. 정점 `k`를 허용할 때 `distance[i][j]`와 `distance[i][k] + distance[k][j]` 중 작은 값을 선택합니다. 이전에 구한 최단 거리로 새로운 거리를 만드는 동적 계획법입니다.

시간은 `O(|V|³)`이고 거리 행렬 공간은 `O(|V|²)`입니다. 원문의 표에서 `i`는 행, `j`는 열, `k`는 허용한 중간 정점의 단계이며 `∞`는 아직 경로가 없음을 뜻합니다. 경로 자체를 복원하려면 거리 외에 다음 정점 등의 정보를 기록해야 합니다.

## 예제·수식·시각 자료

![플로이드–워셜 알고리즘 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/f9b75e25063384ccca499c56f9a279abf661ad3b)

![플로이드–워셜 알고리즘 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/34ac7c89bbb18df3fd660225fd38997079e5e513)

![플로이드–워셜 알고리즘 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/0326d6c14def89269c029da59eba012d0f2edc9d)

![플로이드–워셜 알고리즘 자료](https://upload.wikimedia.org/wikipedia/commons/2/2e/Floyd-Warshall_example.svg)

|       | 1   | 2   | 3   | 4   |
|:-----:|:---:|:---:|:---:|:---:|
| **1** |	0   |	∞   |	−2  | ∞   |
| **2** |	4   |	0   |	3	  | ∞   |
| **3** |	∞   |	∞   |	0	  | 2   |
| **4** |	∞   |	−1  | ∞   | 0   |

|       | 1   | 2   | 3   | 4   |
|:-----:|:---:|:---:|:---:|:---:|
| **1** | 0   | ∞   | −2  | ∞   |
| **2** | 4   | 0   |  2  | ∞   |
| **3** | ∞   | ∞   |  0  | 2   |
| **4** | ∞   | −   |  ∞  | 0   |

|       | 1   | 2   | 3   | 4   |
|:-----:|:---:|:---:|:---:|:---:|
| **1** |	0   |	∞   |	−2  | ∞   |
| **2** |	4   |	0   | 2	  | ∞   |
| **3** |	∞   |	∞	  | 0	  | 2   |
| **4** |	3   |	−1  | 1   | 0   |

|       | 1   | 2   | 3   | 4   |
|:-----:|:---:|:---:|:---:|:---:|
| **1** |	0   |	∞   |	−2  | 0   |
| **2** |	4   |	0   |	2	  | 4   |
| **3** |	∞   |	∞   |	0	  | 2   |
| **4** |	3   |	−1  | 1   | 0   |

|       | 1   | 2   | 3   | 4   |
|:-----:|:---:|:---:|:---:|:---:|
| **1** |	0   |	−1  | −2  | 0   |
| **2** |	4   |	0	  | 2	  | 4   |
| **3** |	5   |	1	  | 0	  | 2   |
| **4** |	3   |	−1  | 1   | 0   |

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm)
- [YouTube (by Abdul Bari)](https://www.youtube.com/watch?v=oNI0rf2P9gE&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=74)
- [YouTube (by Tushar Roy)](https://www.youtube.com/watch?v=LwJdNfdLF9s&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8&index=75)


## 구현 참고

선택적인 두 번째 `stepCallback` 인수로 실행 스냅샷을 기록할 수 있습니다. 반환 값의 `negativeCycle`은 거리 행렬의 음수 대각선으로 검사합니다. 이 값이 참이면 행렬 전체를 확정된 최단 거리 결과로 해석하면 안 됩니다.
