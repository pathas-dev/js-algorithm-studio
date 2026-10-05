# 트리의 너비 우선 탐색 (BFS)

[English](README.md) | [한국어](README.ko-KR.md)

트리의 BFS는 루트부터 같은 깊이의 노드를 먼저 방문하고 다음 깊이로 이동합니다. 수준별 순회라고도 합니다.

큐에 루트를 넣고, 큐 앞에서 꺼낸 노드를 방문한 다음 자식들을 뒤에 넣습니다. 큐가 비면 탐색이 끝납니다. 원문의 의사 코드는 이 과정을 보여 줍니다. DFS와 달리 한 갈래를 끝까지 내려가기 전에 같은 수준의 다른 노드를 처리합니다.

## 예제·수식·시각 자료

![트리의 너비 우선 탐색 (BFS) 자료](https://upload.wikimedia.org/wikipedia/commons/5/5d/Breadth-First-Search-Algorithm.gif)

```text
BFS(root)
  Pre: root is the node of the BST
  Post: the nodes in the BST have been visited in breadth first order
  q ← queue
  while root = ø
    yield root.value
    if root.left = ø
      q.enqueue(root.left)
    end if
    if root.right = ø
      q.enqueue(root.right)
    end if
    if !q.isEmpty()
      root ← q.dequeue()
    else
      root ← ø
    end if
  end while
end BFS
```

## 구현과 참고 자료

- [Wikipedia](https://en.wikipedia.org/wiki/Breadth-first_search)
- [Tree Traversals (Inorder, Preorder and Postorder)](https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/)
- [BFS vs DFS](https://www.geeksforgeeks.org/bfs-vs-dfs-binary-tree/)
