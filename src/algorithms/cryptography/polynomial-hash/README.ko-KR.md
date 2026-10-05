# 다항식 롤링 해시

[English](README.md) | [한국어](README.ko-KR.md)

해시 함수는 길이가 다양한 데이터를 고정된 범위의 값으로 대응시킵니다. 서로 다른 입력이 같은 해시를 갖는 충돌이 가능하므로, 해시가 같다는 사실만으로 원래 문자열도 같다고 단정할 수 없습니다.

다항식 해시는 문자 코드를 계수로, 상수 `p`를 밑으로 사용합니다. 예를 들어 `ace`는 `1×26² + 3×26 + 5`로 표현할 수 있습니다. 너무 큰 값을 피하려고 모듈러 `M`을 적용합니다. 호너 방법을 사용하면 각 문자를 읽을 때 `hash = (hash * p + charCode) % M`으로 갱신할 수 있습니다.

롤링 해시는 창을 한 칸 옮길 때 이전 해시에서 빠진 문자와 새로 들어온 문자를 반영해 값을 갱신합니다. 문자 순서까지 반영하며, 매 창을 처음부터 계산하지 않아 라빈–카프 문자열 탐색에 유용합니다. 밑과 모듈러의 선택은 충돌 빈도에 영향을 줍니다.

## 예제·수식·시각 자료

> H(s<sub>0</sub>, s<sub>1</sub>, ..., s<sub>k</sub>) = s<sub>0</sub> * p<sup>k-1</sup> + s<sub>1</sub> * p<sup>k-2</sup> + ... + s<sub>k</sub> * p<sup>0</sup>

> key = 1 * 26<sup>2</sup> + 3 * 26<sup>1</sup> + 5 * 26<sup>0</sup>

> H(s<sub>0</sub>, s<sub>1</sub>, ..., s<sub>k</sub>) = (s<sub>0</sub> * p<sup>k-1</sup> + s<sub>1</sub> * p<sup>k-2</sup> + ... + s<sub>k</sub> * p<sup>0</sup>) mod M

```javascript
function hash(key, arraySize) {
  const base = 13;

  let hash = 0;
  for (let charIndex = 0; charIndex < key.length; charIndex += 1) {
    const charCode = key.charCodeAt(charIndex);
    hash += charCode * (base ** (key.length - charIndex - 1));
  }

  return hash % arraySize;
}
```

> a<sub>4</sub> * x<sup>4</sup> + a<sub>3</sub> * x<sup>3</sup> + a<sub>2</sub> * x<sup>2</sup> + a<sub>1</sub> * x<sup>1</sup> + a<sub>0</sub> = (((a<sub>4</sub> * x + a<sub>3</sub>) * x + a<sub>2</sub>) * x + a<sub>1</sub>) * x + a<sub>0</sub>

> H<sub>i</sub> = (P * H<sub>i-1</sub> + S<sub>i</sub>) mod M

```javascript
function hash(key, arraySize) {
  const base = 13;

  let hash = 0;
  for (let charIndex = 0; charIndex < key.length; charIndex += 1) {
    const charCode = key.charCodeAt(charIndex);
    hash = (hash * base + charCode) % arraySize;
  }

  return hash;
}
```

## 구현과 참고 자료

- [Where to Use Polynomial String Hashing](https://www.mii.lt/olympiads_in_informatics/pdf/INFOL119.pdf)
- [Hashing on uTexas](https://www.cs.utexas.edu/~mitra/csSpring2017/cs313/lectures/hash.html)
- [Hash Function on Wikipedia](https://en.wikipedia.org/wiki/Hash_function)
- [Rolling Hash on Wikipedia](https://en.wikipedia.org/wiki/Rolling_hash)
