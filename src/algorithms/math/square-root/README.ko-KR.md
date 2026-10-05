# 뉴턴 방법으로 제곱근 구하기

[English](README.md) | [한국어](README.ko-KR.md)

음이 아닌 수 `S`의 제곱근을 찾는 문제는 `f(x)=x²-S`의 근을 구하는 문제입니다. 뉴턴 방법은 현재 추정값에서의 접선이 가로축과 만나는 위치를 다음 추정값으로 사용합니다.

일반 갱신식은 `x_next=x-f(x)/f'(x)`입니다. 제곱근 문제에서는 `f'(x)=2x`이므로 `x_next=(x+S/x)/2`가 됩니다. 양의 초기 추정값에서 반복하여 충분히 정확한 근사값을 얻습니다.

0은 별도로 처리하고, 반복 중 0으로 나누지 않도록 해야 합니다. 부동소수점 근사는 정확한 실수 계산이 아니므로 오차 기준이나 반복 종료 조건을 함께 고려합니다.

## 예제·수식·시각 자료

![뉴턴 방법으로 제곱근 구하기 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/bff86975b0e7944720b3e635c53c22c032a7a6f1)

![뉴턴 방법으로 제곱근 구하기 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/6cf57722151ef19ba1ca918d702b95c335e21cad)

![뉴턴 방법으로 제곱근 구하기 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/52c50eca0b7c4d64ef2fdca678665b73e944cb84)

![뉴턴 방법으로 제곱근 구하기 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/710c11b9ec4568d1cfff49b7c7d41e0a7829a736)

![뉴턴 방법으로 제곱근 구하기 자료](https://upload.wikimedia.org/wikipedia/commons/e/e0/NewtonIteration_Ani.gif)

![뉴턴 방법으로 제곱근 구하기 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/bff86975b0e7944720b3e635c53c22c032a7a6f1)

![뉴턴 방법으로 제곱근 구하기 자료](https://wikimedia.org/api/rest_v1/media/math/render/svg/6cf57722151ef19ba1ca918d702b95c335e21cad)

```text
x := x - (x² - S) / (2x)
```

## 구현과 참고 자료

- [Methods of computing square roots on Wikipedia](https://en.wikipedia.org/wiki/Methods_of_computing_square_roots)
- [Newton's method on Wikipedia](https://en.wikipedia.org/wiki/Newton%27s_method)
