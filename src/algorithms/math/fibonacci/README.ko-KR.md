# 피보나치 수

[English](README.md) | [한국어](README.ko-KR.md)

피보나치 수열은 첫 두 항을 0과 1로 두고 이후 각 항을 앞의 두 항의 합으로 정의합니다. 수열은 `0,1,1,2,3,5,8,13,21,34,55,89,144,…`로 이어집니다.

재귀 관계는 `F(n)=F(n-1)+F(n-2)`입니다. 단순 재귀는 같은 값을 반복 계산하므로, 반복문으로 앞의 두 값만 유지하거나 계산 결과를 저장하면 중복을 줄일 수 있습니다.

원문 그림은 연속된 피보나치 수를 변 길이로 하는 정사각형 타일과, 그 안의 원호로 만든 피보나치 나선을 보여 줍니다. 이 나선은 황금 나선의 근사입니다.

## 예제·수식·시각 자료

![피보나치 수 자료](https://upload.wikimedia.org/wikipedia/commons/d/db/34%2A21-FibonacciBlocks.png)

![피보나치 수 자료](https://upload.wikimedia.org/wikipedia/commons/2/2e/FibonacciSpiral.svg)

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Fibonacci_number)
