type StringOrNumber = string | number;

export function createMapWithIndex<T>(
  items: T[],
  key: string,
  secondLevelKey?: string,
): Record<string, T> {
  return items.reduce(
    (acc, item) => {
      let value = item[key];
      if (secondLevelKey) {
        value = value[secondLevelKey];
      }
      acc[value?.toString()] = item;
      return acc;
    },
    {} as Record<string, T>,
  );
}

export function discardKey<T, K extends keyof T>(
  items: T[],
  key: string,
): Omit<T, K>[] {
  return items.map((item) => {
    delete item[key];
    return item as Omit<T, K>;
  });
}

export function mapOverValues<T, K>(
  obj: Record<string, T>,
  mapFunction: (T) => K,
): Record<string, K> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    acc[key] = mapFunction(value);
    return acc;
  }, {});
}
