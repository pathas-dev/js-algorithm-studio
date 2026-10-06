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
  {"id": "planned-algorithms-uncategorized-n-queens", "category": "other", "name": {"ko": "N-Queens 문제", "en": "N-Queens Problem"}},
  {"id": "planned-algorithms-uncategorized-knight-tour", "category": "other", "name": {"ko": "기사의 여행 문제", "en": "Knight's Tour"}},
  {"id": "planned-algorithms-uncategorized-recursive-staircase", "category": "other", "name": {"ko": "계단 오르기 경우의 수", "en": "Recursive Staircase Problem"}},
  {"id": "planned-algorithms-uncategorized-best-time-to-buy-sell-stocks", "category": "other", "name": {"ko": "주식 매매 최대 이익", "en": "Best Time to Buy and Sell Stock"}},
  {"id": "planned-algorithms-stack-valid-parentheses", "category": "other", "name": {"ko": "올바른 괄호 검사", "en": "Valid Parentheses Problem"}},
];
