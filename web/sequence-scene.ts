import type { Step } from './algorithms';

type Point = [number, number, number];
export type SequenceToken = { id: string; label: string; index: number; row: 'stack' | 'queue' | 'text' | 'pattern'; position: Point; color: string; active: boolean };

export function sequenceSceneSupported(step: Step) {
  return ['stack', 'queue'].includes(String(step.variables.structure))
    || typeof step.variables.text === 'string' && typeof step.variables.pattern === 'string'
      && [undefined, 'kmp', 'rabin'].includes(step.variables.mode as string | undefined);
}

export function display(character: string) {
  if (character.length > 1) return character;
  const code = character.charCodeAt(0);
  if (code >= 0xd800 && code <= 0xdfff) return code.toString(16).toUpperCase();
  return character === ' ' ? '␠' : character === '\t' ? '⇥' : character === '\n' ? '↵' : character;
}

export function sequenceModel(step: Step) {
  const stack = step.variables.structure === 'stack';
  const linear = stack || step.variables.structure === 'queue';
  const tokens: SequenceToken[] = [];
  if (linear) {
    step.array.forEach((item, index) => tokens.push({
      id: `node-${item.id}`, label: String(item.value), index, row: stack ? 'stack' : 'queue',
      position: stack ? [0, (step.array.length - index - 1) * .95, 0] : [index * 1.1, 0, 0],
      active: step.indices.includes(index), color: step.indices.includes(index) ? '#d6b476' : '#82968c',
    }));
  } else {
    const text = String(step.variables.text).split('');
    const pattern = String(step.variables.pattern).split('');
    const alignment = Number(step.variables.alignment);
    const building = step.variables.phase === 'prefix';
    const match = Number(step.variables.matchIndex ?? -1);
    for (const [row, characters] of [['text', text], ['pattern', pattern]] as const) {
      characters.forEach((character, index) => {
        const active = row === 'pattern'
          ? building ? step.variables.prefixIndex === index || step.variables.suffixIndex === index : step.variables.wordIndex === index
          : !building && (step.indices.includes(index) || step.variables.mode === 'rabin' && !['start', 'done'].includes(step.type) && index >= alignment && index < alignment + pattern.length);
        const matched = match >= 0 && (row === 'pattern' || index >= match && index < match + pattern.length);
        tokens.push({ id: `${row}-${index}`, label: display(character), index, row,
          position: [(index + (row === 'pattern' ? alignment : 0)) * .9, row === 'text' ? .9 : -.9, 0],
          active, color: active ? '#d6b476' : matched ? '#8faf9d' : row === 'pattern' ? '#8c8196' : '#82968c' });
      });
    }
  }
  const width = Math.max(6, ...tokens.map((token) => token.position[0] + 3));
  const height = Math.max(5, ...tokens.map((token) => token.position[1] + 3));
  return { tokens, linear, stack, width, height, center: [Math.max(0, ...tokens.map((token) => token.position[0])) / 2, stack ? Math.max(0, (step.array.length - 1) * .95 / 2) : 0, 0] as Point };
}

export function sequencePosition(token: SequenceToken | undefined, previous: SequenceToken | undefined, progress: number): Point {
  const item = token ?? previous!;
  const offset: Point = item.row === 'stack' ? [1.6, 1.1, 0] : [token ? 1.6 : -1.6, .8, 0];
  const from = previous?.position ?? item.position.map((value, axis) => value + offset[axis]);
  const to = token?.position ?? item.position.map((value, axis) => value + offset[axis]);
  const t = Math.max(0, Math.min(1, progress));
  return from.map((value, axis) => value + (to[axis] - value) * t) as Point;
}

export function sequenceMotion(step: Step, previous: Step) {
  if (!sequenceSceneSupported(step) || !sequenceSceneSupported(previous)) return false;
  const before = sequenceModel(previous).tokens;
  const after = sequenceModel(step).tokens;
  return before.length !== after.length || after.some((token) => {
    const prior = before.find((item) => item.id === token.id);
    return !prior || token.position.some((value, axis) => value !== prior.position[axis]);
  });
}
