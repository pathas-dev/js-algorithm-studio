import recordGraphStep from '../../../utils/trace/recordGraphStep';

/** Kosaraju: finishing order, transpose, then DFS in decreasing finish order. */
export default function stronglyConnectedComponents(graph, stepCallback) {
  const seen = new Set();
  const finish = [];
  const stack = [];
  const components = [];
  const processed = [];
  let reversed = false;
  const state = (vertex) => ({
    current: vertex ? vertex.getKey() : '',
    reversed,
    seen: [...seen].map((item) => item.getKey()).join(','),
    processed: processed.join(','),
    stack: stack.join(','),
    finish: finish.map((item) => item.getKey()).reverse().join(','),
    components: JSON.stringify(components.map((group) => group.map((item) => item.getKey()))),
    result: components.map((group) => `[${group.map((item) => item.getKey()).join(',')}]`).join(' · ') || '∅',
    order: '',
  });
  recordGraphStep(stepCallback, graph, 'start', () => state(), 'const finish = [];');
  function firstPass(vertex) {
    seen.add(vertex);
    stack.push(vertex.getKey());
    recordGraphStep(stepCallback, graph, 'enter', () => state(vertex), 'seen.add(vertex);');
    vertex.getNeighbors().forEach((next) => {
      if (!seen.has(next)) firstPass(next);
    });
    finish.push(vertex);
    stack.pop();
    recordGraphStep(stepCallback, graph, 'finish', () => state(vertex), 'finish.push(vertex);');
  }
  graph.getAllVertices().forEach((vertex) => {
    if (!seen.has(vertex)) firstPass(vertex);
  });
  graph.reverse();
  reversed = true;
  seen.clear();
  recordGraphStep(stepCallback, graph, 'transpose', () => state(), 'graph.reverse();');
  function secondPass(vertex, group) {
    seen.add(vertex);
    group.push(vertex);
    stack.push(vertex.getKey());
    recordGraphStep(stepCallback, graph, 'collect', () => state(vertex), 'group.push(vertex);');
    vertex.getNeighbors().forEach((next) => {
      if (!seen.has(next)) secondPass(next, group);
    });
    stack.pop();
  }
  while (finish.length) {
    const vertex = finish.pop();
    if (!seen.has(vertex)) {
      const group = [];
      secondPass(vertex, group);
      components.push(group);
      processed.push(...group.map((item) => item.getKey()));
      recordGraphStep(stepCallback, graph, 'component', () => state(vertex), 'components.push(group);');
    }
  }
  recordGraphStep(stepCallback, graph, 'done', () => state(), 'return components;');
  return components;
}
