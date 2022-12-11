import * as nanoid from "nanoid";
export function generateId(
  size: number,
  options: { constraint?: number } = { constraint: 0 },
): number {
  const alphabet = "0123456789";
  const nano = nanoid.customAlphabet(alphabet, size);
  return options.constraint + parseInt(nano());
}
