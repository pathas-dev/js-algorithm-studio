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
  {"id": "planned-algorithms-tree-breadth-first-search", "category": "tree", "name": {"ko": "트리 너비 우선 탐색", "en": "Tree Breadth-First Search (BFS)"}},
  {"id": "planned-algorithms-uncategorized-hanoi-tower", "category": "other", "name": {"ko": "하노이 탑", "en": "Tower of Hanoi"}},
  {"id": "planned-algorithms-uncategorized-square-matrix-rotation", "category": "other", "name": {"ko": "정방 행렬 회전", "en": "Square Matrix In-Place Rotation"}},
  {"id": "planned-algorithms-uncategorized-jump-game", "category": "other", "name": {"ko": "점프 게임", "en": "Jump Game"}},
  {"id": "planned-algorithms-uncategorized-unique-paths", "category": "other", "name": {"ko": "Unique 경로", "en": "Unique Paths Problem"}},
  {"id": "planned-algorithms-uncategorized-rain-terraces", "category": "other", "name": {"ko": "빗물 담기 문제", "en": "Rain Terraces (Trapping Rain Water) Problem"}},
  {"id": "planned-algorithms-uncategorized-n-queens", "category": "other", "name": {"ko": "N-Queens 문제", "en": "N-Queens Problem"}},
  {"id": "planned-algorithms-uncategorized-knight-tour", "category": "other", "name": {"ko": "기사의 여행 문제", "en": "Knight's Tour"}},
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
