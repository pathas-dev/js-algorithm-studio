import type { Language } from './algorithms';

export const catalogCategories = [
  {
    "id": "sort",
    "name": {
      "ko": "정렬",
      "en": "Sorting"
    }
  },
  {
    "id": "search",
    "name": {
      "ko": "검색",
      "en": "Searching"
    }
  },
  {
    "id": "graph",
    "name": {
      "ko": "그래프",
      "en": "Graphs"
    }
  },
  {
    "id": "structure",
    "name": {
      "ko": "자료 구조",
      "en": "Data structures"
    }
  },
  {
    "id": "string",
    "name": {
      "ko": "문자열",
      "en": "Strings"
    }
  },
  {
    "id": "dp",
    "name": {
      "ko": "동적 계획",
      "en": "Dynamic programming"
    }
  },
  {
    "id": "math",
    "name": {
      "ko": "수학",
      "en": "Mathematics"
    }
  },
  {
    "id": "sets",
    "name": {
      "ko": "집합·조합",
      "en": "Sets & combinations"
    }
  },
  {
    "id": "tree",
    "name": {
      "ko": "트리 탐색",
      "en": "Tree traversal"
    }
  },
  {
    "id": "linked-list",
    "name": {
      "ko": "연결 리스트 탐색",
      "en": "Linked list traversal"
    }
  },
  {
    "id": "cryptography",
    "name": {
      "ko": "암호",
      "en": "Cryptography"
    }
  },
  {
    "id": "ml",
    "name": {
      "ko": "머신 러닝",
      "en": "Machine learning"
    }
  },
  {
    "id": "image-processing",
    "name": {
      "ko": "이미지 처리",
      "en": "Image processing"
    }
  },
  {
    "id": "statistics",
    "name": {
      "ko": "통계",
      "en": "Statistics"
    }
  },
  {
    "id": "other",
    "name": {
      "ko": "기타",
      "en": "Other"
    }
  }
] as const;

type CatalogCategory = typeof catalogCategories[number]['id'];

// Planned visualizations from README.ko-KR.md; these entries have no runnable lesson.
export const plannedAlgorithms: { id: string; category: CatalogCategory; name: Record<Language, string> }[] = [
  {"id": "planned-algorithms-math-bits", "category": "math", "name": {"ko": "비트 연산", "en": "Bit Manipulation"}},
  {"id": "planned-algorithms-math-factorial", "category": "math", "name": {"ko": "팩토리얼", "en": "Factorial"}},
  {"id": "planned-algorithms-math-fibonacci", "category": "math", "name": {"ko": "피보나치 수", "en": "Fibonacci Number"}},
  {"id": "planned-algorithms-math-primality-test", "category": "math", "name": {"ko": "소수 판별", "en": "Primality Test"}},
  {"id": "planned-algorithms-math-euclidean-algorithm", "category": "math", "name": {"ko": "유클리드 호제법", "en": "Euclidean algorithm"}},
  {"id": "planned-algorithms-math-least-common-multiple", "category": "math", "name": {"ko": "최소 공배수", "en": "Least common multiple"}},
  {"id": "planned-algorithms-math-sieve-of-eratosthenes", "category": "math", "name": {"ko": "에라토스테네스의 체", "en": "Sieve of Eratosthenes"}},
  {"id": "planned-algorithms-math-is-power-of-two", "category": "math", "name": {"ko": "2의 거듭제곱 판별법", "en": "Is a power of two"}},
  {"id": "planned-algorithms-math-pascal-triangle", "category": "math", "name": {"ko": "파스칼 삼각형", "en": "Pascal's Triangle"}},
  {"id": "planned-algorithms-math-integer-partition", "category": "math", "name": {"ko": "자연수 분할", "en": "Integer Partition"}},
  {"id": "planned-algorithms-math-liu-hui", "category": "math", "name": {"ko": "리우 후이 π 알고리즘", "en": "Liu Hui's π Algorithm"}},
  {"id": "planned-algorithms-sets-cartesian-product", "category": "sets", "name": {"ko": "카티지언 프로덕트", "en": "Cartesian Product"}},
  {"id": "planned-algorithms-sets-fisher-yates", "category": "sets", "name": {"ko": "Fisher–Yates 셔플", "en": "Fisher–Yates shuffle"}},
  {"id": "planned-algorithms-sets-power-set", "category": "sets", "name": {"ko": "멱집합", "en": "Power Set"}},
  {"id": "planned-algorithms-sets-permutations", "category": "sets", "name": {"ko": "순열", "en": "Permutations"}},
  {"id": "planned-algorithms-sets-combinations", "category": "sets", "name": {"ko": "조합", "en": "Combinations"}},
  {"id": "planned-algorithms-sets-longest-increasing-subsequence", "category": "sets", "name": {"ko": "최장 증가 수열", "en": "Longest Increasing Subsequence"}},
  {"id": "planned-algorithms-sets-shortest-common-supersequence", "category": "sets", "name": {"ko": "최단 공통 상위 수열", "en": "Shortest Common Supersequence"}},
  {"id": "planned-algorithms-sets-maximum-subarray", "category": "sets", "name": {"ko": "최대 구간합", "en": "Maximum subarray problem"}},
  {"id": "planned-algorithms-sets-combination-sum", "category": "sets", "name": {"ko": "조합 합", "en": "Combination Sum Problem"}},
  {"id": "planned-algorithms-string-hamming-distance", "category": "string", "name": {"ko": "해밍 거리", "en": "Hamming Distance"}},
  {"id": "planned-algorithms-string-longest-common-substring", "category": "string", "name": {"ko": "최장 공통 부분 문자열", "en": "Longest Common Substring Problem"}},
  {"id": "planned-algorithms-string-regular-expression-matching", "category": "string", "name": {"ko": "정규 표현식 매칭", "en": "Regular Expression Matching"}},
  {"id": "planned-algorithms-tree-depth-first-search", "category": "tree", "name": {"ko": "트리 깊이 우선 탐색", "en": "Tree Depth-First Search (DFS)"}},
  {"id": "planned-algorithms-tree-breadth-first-search", "category": "tree", "name": {"ko": "트리 너비 우선 탐색", "en": "Tree Breadth-First Search (BFS)"}},
  {"id": "planned-algorithms-graph-strongly-connected-components", "category": "graph", "name": {"ko": "강결합 컴포넌트", "en": "Strongly Connected Component"}},
  {"id": "planned-algorithms-graph-travelling-salesman", "category": "graph", "name": {"ko": "외판원 문제", "en": "Travelling Salesman Problem"}},
  {"id": "planned-algorithms-uncategorized-hanoi-tower", "category": "other", "name": {"ko": "하노이 탑", "en": "Tower of Hanoi"}},
  {"id": "planned-algorithms-uncategorized-square-matrix-rotation", "category": "other", "name": {"ko": "정방 행렬 회전", "en": "Square Matrix In-Place Rotation"}},
  {"id": "planned-algorithms-uncategorized-jump-game", "category": "other", "name": {"ko": "점프 게임", "en": "Jump Game"}},
  {"id": "planned-algorithms-uncategorized-unique-paths", "category": "other", "name": {"ko": "Unique 경로", "en": "Unique Paths Problem"}},
  {"id": "planned-algorithms-uncategorized-rain-terraces", "category": "other", "name": {"ko": "빗물 담기 문제", "en": "Rain Terraces (Trapping Rain Water) Problem"}},
  {"id": "planned-algorithms-uncategorized-n-queens", "category": "other", "name": {"ko": "N-Queens 문제", "en": "N-Queens Problem"}},
  {"id": "planned-algorithms-uncategorized-knight-tour", "category": "other", "name": {"ko": "기사의 여행 문제", "en": "Knight's Tour"}},
  {"id": "planned-data-structures-deque", "category": "structure", "name": {"ko": "덱 (양방향 큐)", "en": "Deque (Double-Ended Queue)"}},
  {"id": "planned-data-structures-lru-cache", "category": "structure", "name": {"ko": "LRU 캐시 알고리즘", "en": "Least Recently Used (LRU) Cache"}},
  {"id": "planned-algorithms-math-binary-floating-point", "category": "math", "name": {"ko": "부동소수점 수의 이진 표현", "en": "Binary representation of floating-point numbers"}},
  {"id": "planned-algorithms-math-prime-factors", "category": "math", "name": {"ko": "소인수분해", "en": "Prime Factors"}},
  {"id": "planned-algorithms-math-complex-number", "category": "math", "name": {"ko": "복소수", "en": "Complex Number"}},
  {"id": "planned-algorithms-math-radian", "category": "math", "name": {"ko": "라디안", "en": "Radian"}},
  {"id": "planned-algorithms-math-fast-powering", "category": "math", "name": {"ko": "빠른 거듭제곱", "en": "Fast Powering Algorithm"}},
  {"id": "planned-algorithms-math-horner-method", "category": "math", "name": {"ko": "호너 방법", "en": "Horner's Method"}},
  {"id": "planned-algorithms-math-matrix", "category": "math", "name": {"ko": "행렬", "en": "Matrices"}},
  {"id": "planned-algorithms-math-euclidean-distance", "category": "math", "name": {"ko": "유클리드 거리", "en": "Euclidean Distance"}},
  {"id": "planned-algorithms-math-square-root", "category": "math", "name": {"ko": "뉴턴 방법으로 제곱근 구하기", "en": "Square Root (Newton's Method)"}},
  {"id": "planned-algorithms-math-fourier-transform", "category": "math", "name": {"ko": "푸리에 변환", "en": "Fourier Transform"}},
  {"id": "planned-algorithms-string-palindrome", "category": "string", "name": {"ko": "회문 검사", "en": "Palindrome Check"}},
  {"id": "planned-algorithms-linked-list-traversal", "category": "linked-list", "name": {"ko": "연결 리스트 순회", "en": "Linked List Traversal"}},
  {"id": "planned-algorithms-linked-list-reverse-traversal", "category": "linked-list", "name": {"ko": "연결 리스트 역순 순회", "en": "Reversed Linked List Traversal"}},
  {"id": "planned-algorithms-cryptography-polynomial-hash", "category": "cryptography", "name": {"ko": "다항식 롤링 해시", "en": "Polynomial Rolling Hash"}},
  {"id": "planned-algorithms-cryptography-rail-fence-cipher", "category": "cryptography", "name": {"ko": "레일 펜스 암호", "en": "Rail Fence Cipher"}},
  {"id": "planned-algorithms-cryptography-caesar-cipher", "category": "cryptography", "name": {"ko": "시저 암호", "en": "Caesar Cipher Algorithm"}},
  {"id": "planned-algorithms-cryptography-hill-cipher", "category": "cryptography", "name": {"ko": "힐 암호", "en": "Hill Cipher"}},
  {"id": "planned-algorithms-ml-knn", "category": "ml", "name": {"ko": "K 최근접 이웃 (K-NN)", "en": "k-Nearest Neighbors Algorithm"}},
  {"id": "planned-algorithms-ml-k-means", "category": "ml", "name": {"ko": "K 평균 군집화", "en": "k-Means Algorithm"}},
  {"id": "planned-algorithms-image-processing-seam-carving", "category": "image-processing", "name": {"ko": "내용을 보존하는 이미지 크기 조절 (심 카빙)", "en": "Content-aware image resizing in JavaScript"}},
  {"id": "planned-algorithms-statistics-weighted-random", "category": "statistics", "name": {"ko": "가중 무작위 선택", "en": "Weighted Random"}},
  {"id": "planned-algorithms-uncategorized-recursive-staircase", "category": "other", "name": {"ko": "계단 오르기 경우의 수", "en": "Recursive Staircase Problem"}},
  {"id": "planned-algorithms-uncategorized-best-time-to-buy-sell-stocks", "category": "other", "name": {"ko": "주식 매매 최대 이익", "en": "Best Time to Buy and Sell Stock"}},
  {"id": "planned-algorithms-stack-valid-parentheses", "category": "other", "name": {"ko": "올바른 괄호 검사", "en": "Valid Parentheses Problem"}},
];
