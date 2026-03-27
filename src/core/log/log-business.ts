export const joinMessages =
  (separator = ". ") =>
  (...args: (string | number | null | undefined)[]): string =>
    args.filter((m) => m != null && m.toString().length > 0).join(separator);
