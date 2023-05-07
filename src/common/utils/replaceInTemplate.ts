export const replaceInTemplate = (
  template: string,
  keys: Record<string, string | number>,
) => {
  let result = template;
  for (const [key, value] of Object.entries(keys)) {
    result = result.replace(`:${key}:`, `${value}`);
  }
  return result;
}