# 가중 무작위 선택

[English](README.md) | [한국어](README.ko-KR.md)

가중 무작위 선택은 항목마다 지정한 가중치에 비례하는 확률로 하나를 고릅니다. `[바나나,사과,당근]`에 `[3,7,1]`을 주면 선택 확률은 각각 `3/11`, `7/11`, `1/11`입니다. 가중치는 반드시 합이 1일 필요는 없습니다.

항목을 가중치만큼 복사한 배열에서 선택할 수도 있지만 큰 가중치에서는 메모리가 낭비됩니다. 대신 누적 가중치 `[3,10,11]`을 만들고 총합 범위의 난수를 생성해 해당 구간의 항목을 선택합니다. 8이 나오면 사과 구간에 속합니다.

각 선택에서 난수는 일반적으로 `[0,total)` 범위이며, 0 가중치 항목이 선택되지 않도록 경계 비교를 일관되게 해야 합니다. 음수·비유한 가중치나 총합 0은 유효한 확률 분포가 아닙니다. 유전 알고리즘의 선택, 다음 문자 생성, 서버 부하 분산 등에 활용됩니다.

## 예제·수식·시각 자료

![가중 무작위 선택 자료](images/cover.png)

```javascript
const items =   [ '🍌', '🍎', '🥕' ];
const weights = [  3,    7,    1  ];

function weightedRandom(items, weights) {
  // implementation goes here ...
}

const nextSnackToEat = weightedRandom(items, weights); // Could be '🍎'
```

```javascript
const items =   [ '🍌', '🍎', '🥕' ];
const weights = [  3,    7,    1  ];

// Repeating the items based on weights.
const weightedItems = [
  '🍌', '🍌', '🍌',
  '🍎', '🍎', '🍎', '🍎', '🍎', '🍎', '🍎',
  '🥕',
];

// And now just pick the random item from weightedItems array.
```

```javascript
const weights =           [3, 7,  1 ];
const cumulativeWeights = [3, 10, 11];

// In a pseudo-representation we may think about the cumulativeWeights array like this.
const pseudoCumulativeWeights = [
  1, 2, 3,               // <-- [3] numbers
  4, 5, 6, 7, 8, 9, 10,  // <-- [7] numbers
  11,                    // <-- [1] number
];
```

```javascript
/**
 * Picks the random item based on its weight.
 * The items with higher weight will be picked more often (with a higher probability).
 *
 * For example:
 * - items = ['banana', 'orange', 'apple']
 * - weights = [0, 0.2, 0.8]
 * - weightedRandom(items, weights) in 80% of cases will return 'apple', in 20% of cases will return
 * 'orange' and it will never return 'banana' (because probability of picking the banana is 0%)
 *
 * @param {any[]} items
 * @param {number[]} weights
 * @returns {{item: any, index: number}}
 */
export default function weightedRandom(items, weights) {
  if (items.length !== weights.length) {
    throw new Error('Items and weights must be of the same size');
  }

  if (!items.length) {
    throw new Error('Items must not be empty');
  }

  // Preparing the cumulative weights array.
  // For example:
  // - weights = [1, 4, 3]
  // - cumulativeWeights = [1, 5, 8]
  const cumulativeWeights = [];
  for (let i = 0; i < weights.length; i += 1) {
    cumulativeWeights[i] = weights[i] + (cumulativeWeights[i - 1] || 0);
  }

  // Getting the random number in a range of [0...sum(weights)]
  // For example:
  // - weights = [1, 4, 3]
  // - maxCumulativeWeight = 8
  // - range for the random number is [0...8]
  const maxCumulativeWeight = cumulativeWeights[cumulativeWeights.length - 1];
  const randomNumber = maxCumulativeWeight * Math.random();

  // Picking the random item based on its weight.
  // The items with higher weight will be picked more often.
  for (let itemIndex = 0; itemIndex < items.length; itemIndex += 1) {
    if (cumulativeWeights[itemIndex] >= randomNumber) {
      return {
        item: items[itemIndex],
        index: itemIndex,
      };
    }
  }
}
```

## 구현과 참고 자료

- [Genetic Algorithm](https://en.wikipedia.org/wiki/Genetic_algorithm)
- [Self-Parking Car in 500 Lines of Code](https://trekhleb.dev/blog/2021/self-parking-car-evolution/)
- [Recurrent Neural Networks (RNN)](https://en.wikipedia.org/wiki/Recurrent_neural_network)
- [Recipe Generation using Recurrent Neural Network (RNN)](https://nbviewer.org/github/trekhleb/machine-learning-experiments/blob/master/experiments/recipe_generation_rnn/recipe_generation_rnn.ipynb)
- [Nginx Load Balancing](https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/)
- [weightedRandom.js](weightedRandom.js)
- [weightedRandom.test.js](__test__/weightedRandom.test.js)
