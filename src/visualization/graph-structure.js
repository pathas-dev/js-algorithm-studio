import Graph from '../data-structures/graph/Graph';
import GraphVertex from '../data-structures/graph/GraphVertex';
import GraphEdge from '../data-structures/graph/GraphEdge';
import { requireNodes } from './graph';
import { parseOperations } from './structures';

export default function traceGraphStructure(values, operations = '') {
  if (values.length) requireNodes(values);
  const commands = parseOperations(operations, {
    addVertex: 1, addEdge: 2, deleteEdge: 2, neighbors: 1, degree: 1,
  });
  const graph = new Graph();
  const steps = [];
  let context = {};
  const snapshot = (type, code, variables = {}) => {
    const vertices = graph.getAllVertices();
    steps.push({
      type,
      code,
      array: vertices.map((vertex) => ({ value: vertex.value, id: vertex.value })),
      indices: vertices.map((vertex, index) => (vertex.value === context.value ? index : -1))
        .filter((index) => index >= 0),
      edges: graph.getAllEdges().map((edge) => [edge.startVertex.value, edge.endVertex.value]),
      variables: {
        ...context,
        structure: 'graph-structure',
        directed: false,
        current: context.value,
        next: context.other,
        seen: vertices.map((vertex) => vertex.value).join(','),
        adjacency: JSON.stringify(vertices.map((vertex) => ({
          value: vertex.value,
          neighbors: vertex.getNeighbors().map((node) => node.value),
          degree: vertex.getDegree(),
        }))),
        ...variables,
      },
    });
  };
  snapshot('start', 'this.vertices = {};');
  const run = ({ name, value, argument }, phase) => {
    context = { operation: name, value, phase };
    if (argument !== undefined) context.other = argument;
    if (name === 'addVertex') {
      requireNodes([...graph.getAllVertices().map((vertex) => vertex.value), value]);
      graph.addVertex(new GraphVertex(value));
      snapshot(name, 'this.vertices[key] = newVertex;');
      return;
    }
    const vertex = graph.getVertexByKey(value);
    if (!vertex) throw new Error('missing-value');
    if (name === 'neighbors') {
      const result = graph.getNeighbors(vertex).map((node) => node.value).join(', ');
      snapshot(name, 'return vertex.getNeighbors();', { result: `[${result}]` });
    } else if (name === 'degree') {
      snapshot(name, 'return this.edges.toArray().length;', { result: vertex.getDegree() });
    } else {
      const other = graph.getVertexByKey(argument);
      if (!other) throw new Error('missing-value');
      if (value === argument) throw new Error('graph-self-loop');
      const edge = graph.findEdge(vertex, other);
      if (name === 'addEdge') {
        if (edge) throw new Error('duplicate-edge');
        if (graph.getAllEdges().length >= 24) throw new Error('edge-limit');
        graph.addEdge(new GraphEdge(vertex, other));
        snapshot(name, 'this.edges[edge.getKey()] = edge;');
      } else {
        if (!edge) throw new Error('missing-edge');
        graph.deleteEdge(edge);
        snapshot(name, 'delete this.edges[edge.getKey()];');
      }
    }
  };
  values.forEach((value) => run({ name: 'addVertex', value }, 'input'));
  commands.forEach((command) => run(command, 'commands'));
  context = {};
  graph.toString();
  snapshot('done', 'return Object.keys(this.vertices).toString();');
  return steps;
}
