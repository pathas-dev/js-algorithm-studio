# 레벤슈타인 거리

[English](README.md) | [한국어](README.ko-KR.md)

레벤슈타인 거리는 한 문자열을 다른 문자열로 바꾸는 데 필요한 최소 단일 문자 편집 횟수입니다. 허용하는 편집은 삽입·삭제·치환입니다. `kitten`을 `sitting`으로 바꾸려면 `k→s`, `e→i`, 마지막 `g` 삽입의 세 번이 필요합니다.

동적 계획법에서는 `dp[i][j]`에 첫 문자열의 앞 `i`글자와 둘째 문자열의 앞 `j`글자 사이의 최소 편집 횟수를 저장합니다. 빈 문자열과의 거리는 다른 문자열의 길이입니다. 각 칸은 삭제·삽입·치환 또는 일치의 비용 중 최솟값으로 계산합니다. 대응 문자가 같으면 대각선 비용에 0을, 다르면 1을 더합니다.

원문의 `ME→MY` 예제는 `E`를 `Y`로 치환하는 한 번의 편집입니다. 작은 부분 문제의 결과를 표에 저장해 반복 계산을 줄이는 방식은 더 긴 `Saturday→Sunday`에도 적용됩니다. 맞춤법 검사, OCR 보정, 유사 문자열 탐색 등에 활용됩니다.

## 예제·수식·시각 자료

![레벤슈타인 거리 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/4cf357d8f2135035207088d2c7b890fb4b64e410)

![레벤슈타인 거리 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/f0a48ecfc9852c042382fdc33c19e11a16948e85)

![레벤슈타인 거리 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/52512ede08444b13838c570ba4a3fc71d54dbce9)

![레벤슈타인 거리 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/231fda9ee578f0328c5ca28088d01928bb0aaaec)

![레벤슈타인 거리 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/bdc0315678caad28648aafedb6ebafb16bd1655c)

![레벤슈타인 거리 자료](https://cdn-images-1.medium.com/max/1600/1*aTunSUoy0BJyYBVn4tWGrA.png)

![레벤슈타인 거리 자료](https://cdn-images-1.medium.com/max/1600/1*w8UB4DSvBnAK6mBXRGQDjw.png)

![레벤슈타인 거리 자료](https://cdn-images-1.medium.com/max/1600/1*8jD0qvr5B9PwRFM_9z7q9A.png)

![레벤슈타인 거리 자료](https://cdn-images-1.medium.com/max/2600/1*497gMaFErzJpCXG7kS_7dw.png)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Levenshtein_distance)
- [YouTube](https://www.youtube.com/watch?v=We3YDTzNXEk&list=PLLXdhg_r2hKA7DPDsunoDZ-Z769jWn4R8)
- [ITNext](https://itnext.io/dynamic-programming-vs-divide-and-conquer-2fea680becbe)
