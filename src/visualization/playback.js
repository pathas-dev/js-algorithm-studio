export const MAX_VALUES = 32;

export function algorithmCode(source) {
  return source.replace(/^import recordStep[^\n]*\n/gm, '').replace(/^\s*(?:this\.)?recordStep\([\s\S]*?\);\n/gm, '');
}

export function parseValues(text) {
  const trimmed = text.trim();
  if (!trimmed) return [];
  if (/(?:^|,)\s*(?:,|$)/.test(trimmed)) throw new Error('invalid');
  const parts = trimmed.split(/[,\s]+/);
  if (parts.length > MAX_VALUES) throw new Error('limit');
  if (parts.some((part) => !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(part))) {
    throw new Error('invalid');
  }
  const values = parts.map(Number);
  if (values.some((value) => !Number.isFinite(value) || Math.abs(value) > 999)) {
    throw new Error('range');
  }
  return values;
}

export function playbackReducer(state, action) {
  switch (action.type) {
    case 'reset':
      return {
        ...state, index: 0, playing: false, length: action.length,
      };
    case 'seek':
      return {
        ...state,
        index: Math.max(0, Math.min(state.length - 1, action.index)),
        playing: false,
      };
    case 'toggle':
      return {
        ...state,
        index: state.index === state.length - 1 ? 0 : state.index,
        playing: !state.playing,
      };
    case 'tick': {
      if (!state.playing) return state;
      const index = Math.min(state.length - 1, state.index + 1);
      return { ...state, index, playing: index < state.length - 1 };
    }
    case 'speed':
      return { ...state, speed: action.speed };
    default:
      return state;
  }
}

export function parseTarget(text) {
  const values = parseValues(text);
  if (values.length !== 1) throw new Error('target');
  return values[0];
}
