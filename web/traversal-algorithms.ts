import reverseSource from '../src/algorithms/linked-list/reverse-traversal/reverseTraversal.js?raw';
import listSource from '../src/algorithms/linked-list/traversal/traversal.js?raw';
import bfsSource from '../src/algorithms/tree/breadth-first-search/breadthFirstSearch.js?raw';
import type { Algorithm, NumericAlgorithm } from './algorithms';
import dfsSource from '../src/algorithms/tree/depth-first-search/depthFirstSearch.js?raw';
import traceTreeDfs, { traceTreeBfs, traceListForward, traceListReverse } from '../src/visualization/traversals';
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

export const treeBfsLesson: NumericAlgorithm = {
  ...treeDfsLesson, id: 'tree-breadth-first-search',
  name: { ko: '트리 너비 우선 탐색', en: 'Tree breadth-first search' },
  summary: { ko: '루트를 큐에 넣고 앞에서 꺼낸 노드의 왼쪽·오른쪽 자식을 뒤에 넣습니다. 같은 깊이의 노드를 먼저 방문하는 레벨 순회입니다.', en: 'Queue the root, dequeue from the front and append its left and right children. Visit every node at a depth before moving deeper: level-order traversal.' },
  source: algorithmCode(bfsSource),
  run: (values) => traceTreeBfs(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return treeDfsLesson.explain(step, language);
    if (step.type === 'enqueue') return ko ? ['노드를 대기 큐 뒤에 추가', `${v.current}를 큐 뒤에 넣었습니다. 이미 대기 중인 같은 레벨 노드를 먼저 처리한 뒤 이 노드를 방문합니다.`] : ['Append a node to the queue', `Enqueue ${v.current} at the rear. Visit already queued nodes at this level before processing it.`];
    if (step.type === 'dequeue') return ko ? ['대기 큐 앞에서 꺼내기', `${v.current}를 큐 앞에서 꺼냈습니다. 다음 단계에서 방문을 기록하고 자식들을 큐에 넣습니다.`] : ['Remove the queue front', `Dequeue ${v.current}. Next record its visit and enqueue its children.`];
    if (step.type === 'enter') return ko ? ['꺼낸 노드 방문 기록', `${v.current}를 방문했습니다. 큐의 선입선출 순서가 레벨별 방문을 유지합니다.`] : ['Record the dequeued node visit', `Visit ${v.current}. FIFO order keeps visits grouped by level.`];
    if (step.type === 'edge') return ko ? ['존재하는 자식 확인', `${v.current}의 자식 ${v.next}를 확인했습니다. 다음 단계에서 재귀 호출 대신 큐 뒤에 넣습니다.`] : ['Inspect an existing child', `Inspect child ${v.next} of ${v.current}. Enqueue it next rather than recursing.`];
    if (step.type === 'leave') return ko ? ['현재 노드 처리 완료', `${v.current}의 자식들을 큐에 넣었습니다. DFS와 달리 자손 탐색을 기다리지 않고 다음 큐 노드로 넘어갑니다.`] : ['Finish processing this node', `Children of ${v.current} are queued. Unlike DFS, move to the next queued node without waiting for descendants.`];
    return ko ? ['너비 우선 레벨 순회 완료', `방문 순서는 ${v.result}입니다. 대기 큐가 비었으므로 모든 노드를 처리했습니다.`] : ['Breadth-first level traversal ready', `Visit order: ${v.result}. The empty queue means all nodes are processed.`];
  },
};

export const listForwardLesson: NumericAlgorithm = {
  ...treeDfsLesson, id: 'linked-list-traversal', category: 'linked-list',
  name: { ko: '연결 리스트 순회', en: 'Linked list traversal' },
  summary: { ko: 'HEAD에서 시작해 현재 노드의 값을 방문하고 next로 이동합니다. TAIL의 next가 null이면 종료하며 리스트의 연결은 바꾸지 않습니다.', en: 'Start at HEAD, visit the current value and follow next. Stop at the null link after TAIL without changing list connections.' },
  source: algorithmCode(listSource), example: [10, 20, 30, 40], time: 'O(n)',
  inputLabels: [{ ko: '노드 값 · HEAD부터', en: 'Node values · from HEAD' }, { ko: '', en: '' }],
  inputHint: { ko: '숫자 최대 12개 · 중복·빈 입력 허용 · N 번호는 노드 식별자', en: 'At most twelve values · duplicates and empty input allowed · N labels identify nodes' },
  run: (values) => traceListForward(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['현재 포인터를 HEAD에 두기', '입력 순서대로 실제 연결 리스트를 만듭니다. HEAD가 null인 빈 리스트라면 반복문에 들어가지 않습니다.'] : ['Initialize the current pointer to HEAD', 'Build an actual linked list in input order. A null HEAD skips the loop for empty input.'];
    if (step.type === 'visit') return ko ? ['현재 노드 값 방문', `N${v.current} 값을 방문했습니다. 다음 반복에서 next를 따라 다음 노드로 이동합니다. 같은 값도 다른 노드면 각각 방문합니다.`] : ['Visit the current node value', `Visit N${v.current}. Follow next for the next iteration. Equal values in different nodes are visited separately.`];
    return ko ? ['null에 도달 · 순회 완료', `방문 순서는 ${v.result}입니다. 원래 next 연결을 보존했고 추가 메모리는 포인터 하나만 필요합니다.`] : ['Reached null · traversal ready', `Visit order: ${v.result}. Original links remain intact; traversal itself needs only one pointer.`];
  },
};

export const listReverseLesson: NumericAlgorithm = {
  ...listForwardLesson, id: 'linked-list-reverse-traversal',
  name: { ko: '연결 리스트 역순 순회', en: 'Reversed linked list traversal' },
  summary: { ko: 'next를 따라 끝까지 재귀 호출한 뒤, 돌아오며 값을 방문합니다. 연결은 그대로 유지하고 방문 순서만 TAIL에서 HEAD 방향으로 기록합니다.', en: 'Recurse through next to the end, then visit on return. Preserve the links and record visits from TAIL toward HEAD.' },
  source: algorithmCode(reverseSource),
  inputHint: { ko: '숫자 최대 12개 · 중복·빈 입력 허용 · 재귀 스택 O(n)', en: 'At most twelve values · duplicates and empty input allowed · recursion stack O(n)' },
  run: (values) => traceListReverse(values),
  explain(step, language) {
    const ko = language === 'ko'; const v = step.variables;
    if (step.type === 'start') return ko ? ['HEAD에서 재귀 순회 시작', '다음 노드를 먼저 탐색하고 그 호출이 끝나면 현재 값을 방문하는 순서입니다. 호출마다 현재 노드를 기억하는 스택이 필요합니다.'] : ['Begin recursion from HEAD', 'Explore the next node first, then visit the current value when that call returns. Each call remembers its node on the stack.'];
    if (step.type === 'enter') return ko ? ['현재 노드를 기억하고 next로 내려가기', `N${v.current}를 호출 스택에 넣었습니다. 아직 값을 방문하지 않고 다음 노드로 재귀 호출합니다.`] : ['Remember this node and descend through next', `Push N${v.current} onto the call stack. Recurse into the next node before visiting this value.`];
    if (step.type === 'base') return ko ? ['null 도달 · 재귀 종료', '마지막 next가 null이므로 더 내려갈 수 없습니다. 대기 중인 마지막 노드 호출로 돌아가며 역순 방문을 시작합니다.'] : ['Reached null · stop recursion', 'The final next is null. Return to the last waiting node call and start visiting in reverse order.'];
    if (step.type === 'visit') return ko ? ['돌아오면서 현재 값 방문', `다음 노드의 호출이 끝나 N${v.current} 값을 방문했습니다. TAIL부터 HEAD까지 거꾸로 기록되지만 next 연결은 유지합니다.`] : ['Visit the value on return', `The next-node call finished, so visit N${v.current}. Record TAIL to HEAD while preserving next links.`];
    if (step.type === 'leave') return ko ? ['현재 호출을 끝내고 이전 호출로 복귀', `N${v.current}를 스택에서 제거했습니다. 이전 호출이 기다리던 값의 방문을 이어갑니다.`] : ['Finish this call and return to the previous one', `Pop N${v.current}. Continue with the value waiting in the previous call.`];
    return ko ? ['역순 방문 완료', `방문 순서는 ${v.result}이며 호출 스택은 비었습니다. 재귀 스택을 제외한 원래 리스트 연결은 유지됩니다.`] : ['Reverse traversal ready', `Visit order: ${v.result}; the stack is empty. Original list connections are preserved.`];
  },
};

export const traversalAlgorithms: Algorithm[] = [treeDfsLesson, treeBfsLesson, listForwardLesson, listReverseLesson];
