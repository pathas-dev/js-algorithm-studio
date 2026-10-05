import floydWarshall from '../algorithms/graph/floyd-warshall/floydWarshall';
import bellmanFord from '../algorithms/graph/bellman-ford/bellmanFord';
import dijkstra from '../algorithms/graph/dijkstra/dijkstra';
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

function requireEdges(edges, nodes, directed = false) {
  const keys = edges.map(([a, b]) => (directed ? [a, b] : [a, b].sort((x, y) => x - y)).join('-'));
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

export function requireWeightedEdges(edges, nodes, directed) {
  requireNodes(nodes);
  requireEdges(edges, nodes, directed);
  if (edges.some((edge) => edge.length !== 3
    || !Number.isFinite(edge[2]) || Math.abs(edge[2]) > 999)) throw new Error('weights');
}

export function parseWeightedEdges(text, nodes, directed) {
  requireNodes(nodes);
  if (!text.trim()) return [];
  if (/(?:^|,)\s*(?:,|$)/.test(text)) throw new Error('weights');
  const edges = text.split(/[,\n]+/).map((part) => {
    const match = part.trim().match(
      /^(\d+)\s*-\s*(\d+)\s*:\s*([+-]?(?:\d+(?:\.\d*)?|\.\d+))$/,
    );
    if (!match) throw new Error('weights');
    return match.slice(1).map(Number);
  });
  requireWeightedEdges(edges, nodes, directed);
  return edges;
}

export function traceWeighted(nodes, start, edges, directed, algorithm) {
  requireWeightedEdges(edges, nodes, directed);
  if (!nodes.includes(start)) throw new Error('start');
  const graph = new Graph(directed);
  nodes.forEach((node) => graph.addVertex(new GraphVertex(node)));
  edges.forEach(([a, b, weight]) => {
    graph.addEdge(new GraphEdge(graph.getVertexByKey(a), graph.getVertexByKey(b), weight));
  });
  const items = nodes.map((value, id) => ({ value, id }));
  const steps = [];
  algorithm(graph, graph.getVertexByKey(start), (step) => steps.push({
    ...step,
    array: step.array.map((value) => items.find((item) => item.value === value)),
    edges: edges.map((edge) => [...edge]),
    variables: { ...step.variables, directed, mode: 'weighted' },
  }));
  return steps;
}

export function traceDijkstra(nodes, start, edges, directed = false) {
  if (edges.some((edge) => edge[2] < 0)) throw new Error('negative-weight');
  return traceWeighted(nodes, start, edges, directed, dijkstra);
}

export function traceBellmanFord(nodes, start, edges, directed = true) {
  return traceWeighted(nodes, start, edges, directed, bellmanFord);
}

export function traceFloydWarshall(nodes, edges, directed = true) {
  return traceWeighted(nodes, nodes[0], edges, directed, (graph, start, callback) => {
    return floydWarshall(graph, callback);
  });
}
