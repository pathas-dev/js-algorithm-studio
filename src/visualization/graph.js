import Graph from '../data-structures/graph/Graph';
import GraphVertex from '../data-structures/graph/GraphVertex';
import GraphEdge from '../data-structures/graph/GraphEdge';
import depthFirstSearch from '../algorithms/graph/depth-first-search/depthFirstSearch';
import breadthFirstSearch from '../algorithms/graph/breadth-first-search/breadthFirstSearch';

export function requireNodes(nodes) {
  if (!nodes.length || nodes.length > 12 || new Set(nodes).size !== nodes.length
    || nodes.some((node) => !Number.isInteger(node) || node < 1 || node > 12)) {
    throw new Error('nodes');
  }
}

function requireEdges(edges, nodes) {
  const keys = edges.map(([a, b]) => [a, b].sort((x, y) => x - y).join('-'));
  if (edges.length > 24 || new Set(keys).size !== edges.length
    || edges.some(([a, b]) => a === b || !nodes.includes(a) || !nodes.includes(b))) {
    throw new Error('edges');
  }
}

export function parseEdges(text, nodes) {
  requireNodes(nodes);
  if (!text.trim()) return [];
  if (/(?:^|,)\s*(?:,|$)/.test(text)) throw new Error('edges');
  const edges = text.split(/[,\n]+/).map((part) => {
    const match = part.trim().match(/^(\d+)\s*-\s*(\d+)$/);
    if (!match) throw new Error('edges');
    return [Number(match[1]), Number(match[2])];
  });
  requireEdges(edges, nodes);
  return edges;
}

function traceGraph(nodes, start, edges, mode) {
  requireNodes(nodes);
  requireEdges(edges, nodes);
  if (!nodes.includes(start)) throw new Error('start');
  const graph = new Graph();
  const vertices = nodes.map((node) => new GraphVertex(node));
  vertices.forEach((vertex) => graph.addVertex(vertex));
  edges.forEach(([a, b]) => {
    graph.addEdge(new GraphEdge(graph.getVertexByKey(a), graph.getVertexByKey(b)));
  });
  const items = nodes.map((value, id) => ({ value, id }));
  const seen = new Set([start]);
  const order = [];
  const processed = [];
  const stack = [];
  const steps = [];
  const traverse = mode === 'dfs' ? depthFirstSearch : breadthFirstSearch;
  traverse(graph, graph.getVertexByKey(start), {
    allowTraversal: ({ nextVertex }) => {
      const key = nextVertex.getKey();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    },
    enterVertex: ({ currentVertex }) => {
      order.push(currentVertex.getKey());
      if (mode === 'dfs') stack.push(currentVertex.getKey());
    },
    leaveVertex: ({ currentVertex }) => {
      processed.push(currentVertex.getKey());
      if (mode === 'dfs') stack.pop();
    },
    stepCallback: (step) => steps.push({
      ...step,
      array: [...items],
      edges: edges.map((edge) => [...edge]),
      variables: {
        ...step.variables,
        mode,
        stack: stack.join(','),
        seen: [...seen].join(','),
        order: order.join(','),
        processed: processed.join(','),
      },
    }),
  });
  return steps;
}

export function traceBfs(nodes, start, edges) {
  return traceGraph(nodes, start, edges, 'bfs');
}

export function traceDfs(nodes, start, edges) {
  return traceGraph(nodes, start, edges, 'dfs');
}
