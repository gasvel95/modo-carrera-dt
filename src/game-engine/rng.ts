export function nextRandom(state: number): [number, number] {
  let value = state >>> 0;
  value ^= value << 13;
  value ^= value >>> 17;
  value ^= value << 5;
  return [(value >>> 0) / 4294967296, value >>> 0];
}

export function randomInt(state: number, min: number, max: number): [number, number] {
  const [value, next] = nextRandom(state);
  return [Math.floor(value * (max - min + 1)) + min, next];
}

