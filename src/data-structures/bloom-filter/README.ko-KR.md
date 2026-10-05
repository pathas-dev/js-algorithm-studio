# 블룸 필터

[English](README.md) | [한국어](README.ko-KR.md)

블룸 필터는 원소가 집합에 있는지 적은 메모리로 검사하는 확률적 자료 구조입니다. 결과는 '확실히 없음' 또는 '있을 수 있음'입니다. 거짓 양성은 가능하지만 정상적인 삽입·조회에서 거짓 음성은 없습니다.

0으로 초기화한 비트 배열과 여러 해시 함수를 사용합니다. 삽입 시 각 해시가 가리키는 비트를 1로 바꾸고, 조회 시 동일한 위치 중 하나라도 0이면 원소가 없음을 확정합니다. 모두 1이어도 다른 원소들이 그 비트들을 켰을 수 있으므로 존재를 확정할 수 없습니다.

표준 블룸 필터는 원소 삭제를 지원하지 않습니다. 해시 함수 수를 `k`, 비트 수를 `m`, 삽입 수를 `n`이라 할 때 원문의 거짓 양성 확률 근사는 `(1-e^(-kn/m))^k`입니다. 고정된 해시 수와 입력 해시 비용 가정 아래 연산 수는 일정하지만, 실제 문자열을 해시하는 비용은 입력 길이에 의존합니다.

읽은 글을 걸러내는 서비스처럼 일부 거짓 양성을 허용할 수 있는 용도에 적합합니다.

## 예제·수식·시각 자료

![블룸 필터 자료](https://upload.wikimedia.org/wikipedia/commons/a/ac/Bloom_filter.svg)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Bloom_filter)
- [Bloom Filters by Example](http://llimllib.github.io/bloomfilter-tutorial/)
- [Calculating False Positive Probability](https://hur.st/bloomfilter/?n=4&p=&m=18&k=3)
- [Bloom Filters on Medium](https://blog.medium.com/what-are-bloom-filters-1ec2a50c68ff)
- [Bloom Filters on YouTube](https://www.youtube.com/watch?v=bEmBh1HtYrw)
