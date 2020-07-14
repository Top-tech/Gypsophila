/** @docs-private */
export function getGypInputUnsupportedTypeError(type: string): Error {
  return Error(`Input type "${type}" isn't supported by gyp-input.`);
}
