# 유클리드 호제법

[English](README.md) | [한국어](README.ko-KR.md)

유클리드 호제법은 두 정수를 나머지 없이 나누는 가장 큰 수, 즉 최대공약수(GCD)를 구합니다. 큰 수를 두 수의 차로 바꿔도 최대공약수가 같다는 성질을 사용합니다. `252`와 `105`의 최대공약수 21은 `147`과 `105`의 최대공약수와 같습니다.

반복 뺄셈을 나머지 연산으로 묶으면 `gcd(a,b)=gcd(b,a%b)`입니다. 나머지가 0이 되면 마지막으로 0이 아닌 값이 최대공약수입니다. 원문의 직사각형을 정사각형으로 채우는 그림은 이 과정을 기하학적으로 보여 줍니다.

계산 과정을 거꾸로 따라가면 최대공약수를 두 입력의 정수 계수 선형 결합으로 표현할 수 있습니다. 예를 들어 `21=5×105-2×252`이며 이를 베주 항등식이라고 합니다.

## 예제·수식·시각 자료

![유클리드 호제법 자료](https://upload.wikimedia.org/wikipedia/commons/3/37/Euclid%27s_algorithm_Book_VII_Proposition_2_3.png)

![유클리드 호제법 자료](https://upload.wikimedia.org/wikipedia/commons/7/74/24x60.svg)

![유클리드 호제법 자료](https://upload.wikimedia.org/wikipedia/commons/1/1c/Euclidean_algorithm_1071_462.gif)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Euclidean_algorithm)
