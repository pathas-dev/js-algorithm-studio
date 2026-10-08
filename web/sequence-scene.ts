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

export function sequencePorts(capacity: number, stack: boolean) {
  const end = (Math.max(1, capacity) - 1) * (stack ? .95 : 1.1);
  const entry: Point = stack ? [0, end + 1.1, 0] : [end + 1.4, 0, 0];
  const exit: Point = stack ? entry : [-1.4, 0, 0];
  return { entry, exit, end, center: [stack ? 0 : end / 2, stack ? end / 2 : 0, 0] as Point,
    width: stack ? 4.8 : Math.max(6, end + 5), height: stack ? Math.max(5, end + 4) : 5 };
}

export function sequenceScanner(step: Step, previous: Step, progress: number) {
  const length = String(step.variables.pattern ?? '').length;
  const t = Math.max(0, Math.min(1, progress));
  const alignment = Number(previous.variables.alignment ?? 0) + (Number(step.variables.alignment ?? 0) - Number(previous.variables.alignment ?? 0)) * t;
  const reading = length > 0 && step.variables.phase !== 'prefix' && !['start', 'done', 'word-hash'].includes(step.type);
  const comparing = reading && step.type === 'compare' && typeof step.variables.textIndex === 'number';
  return { x: alignment * .9 + (length - 1) * .45, width: length * .9 + .24,
    visible: length > 0, reading, beam: comparing ? Number(step.variables.textIndex) * .9 : undefined };
}

export function sequencePosition(token: SequenceToken | undefined, previous: SequenceToken | undefined, progress: number, capacity?: number): Point {
  const item = token ?? previous!;
  const stack = item.row === 'stack';
  const ports = sequencePorts(capacity ?? (stack ? Math.round(item.position[1] / .95) + 1 : item.index + 1), stack);
  const linear = stack || item.row === 'queue';
  const from = previous?.position ?? (linear ? ports.entry : item.position);
  const to = token?.position ?? (linear ? ports.exit : item.position);
  const t = Math.max(0, Math.min(1, progress));
  return from.map((value, axis) => value + (to[axis] - value) * t) as Point;
}

export function sequenceMotion(step: Step, previous: Step) {
  if (!sequenceSceneSupported(step) || !sequenceSceneSupported(previous)) return false;
  if (step.variables.structure === 'stack' && step.type === 'peek' && step.indices.length > 0) return true;
  const before = sequenceModel(previous).tokens;
  const after = sequenceModel(step).tokens;
  return before.length !== after.length || after.some((token) => {
    const prior = before.find((item) => item.id === token.id);
    return !prior || token.position.some((value, axis) => value !== prior.position[axis]);
  });
}
