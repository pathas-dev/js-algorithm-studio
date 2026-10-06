import type { Algorithm, NumericAlgorithm } from './algorithms';
import dfsSource from '../src/algorithms/tree/depth-first-search/depthFirstSearch.js?raw';
import traceTreeDfs from '../src/visualization/traversals';
import { algorithmCode } from '../src/visualization/playback';

export const treeDfsLesson: NumericAlgorithm = {
  id: 'tree-depth-first-search', category: 'tree', usesStart: false, singleInput: true,
  name: { ko: '트리 깊이 우선 탐색', en: 'Tree depth-first search' },
  summary: { ko: '루트에서 왼쪽 자식으로 끝까지 내려간 뒤 오른쪽 자식을 탐색합니다. 입력을 레벨 순서로 이진 트리에 배치하고 전위 방문 순서를 기록합니다.', en: 'Descend fully through left children before exploring right children. Arrange input in level order into a binary tree and record preorder visits.' },
  source: algorithmCode(dfsSource), example: [1, 2, 3, 4, 5, 6, 7], time: 'O(n)',
  inputLabels: [{ ko: '노드 값 · 레벨 순서', en: 'Node values · level order' }, { ko: '', en: '' }],
  inputHint: { ko: '숫자 최대 15개 · 배열 i의 자식은 2i+1, 2i+2 · 중복 값 허용 · 검색 트리가 아님', en: 'Up to fifteen values · children of array index i are 2i+1 and 2i+2 · duplicates allowed · not a search tree' },
  run: (values) => traceTreeDfs(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['레벨 순서로 트리 준비', '첫 값은 루트, 다음 두 값은 그 자식입니다. 값의 크기로 재정렬하지 않으며 빈 입력에는 방문할 노드가 없습니다.'] : ['Prepare the tree in level order', 'The first value is root; the next two are its children. Values are not reordered by size; empty input has no nodes.'];
    if (step.type === 'enter') return ko ? ['노드에 들어가며 방문 기록', `${v.current}를 방문했습니다. 자식을 탐색하기 전에 기록하는 전위 순회이며 호출 스택에 이 노드를 추가합니다.`] : ['Record the node on entry', `Visit ${v.current}. This preorder traversal records a node before its children and pushes it onto the call stack.`];
    if (step.type === 'edge') return ko ? ['자식으로 재귀 진입', `${v.current}에서 ${v.next}로 내려갑니다. 왼쪽 하위 트리를 마친 뒤 오른쪽 하위 트리를 탐색합니다.`] : ['Recurse into a child', `Descend from ${v.current} to ${v.next}. Complete the left subtree before exploring the right.`];
    if (step.type === 'leave') return ko ? ['자식 탐색 완료 후 돌아가기', `${v.current}와 그 아래 탐색이 끝났습니다. 호출 스택에서 제거하고 부모 호출로 돌아갑니다. 방문 순서는 바꾸지 않습니다.`] : ['Return after finishing the children', `Finished ${v.current} and its descendants. Pop it from the stack and return to its parent, preserving visit order.`];
    return ko ? ['깊이 우선 전위 탐색 완료', `방문 순서는 ${v.result}입니다. 노드 값이 같아도 서로 다른 위치의 노드는 각각 한 번 방문합니다.`] : ['Depth-first preorder traversal ready', `Visit order: ${v.result}. Equal-valued nodes at different positions are still visited separately.`];
  },
};

export const traversalAlgorithms: Algorithm[] = [treeDfsLesson];
