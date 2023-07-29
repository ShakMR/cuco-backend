import mock = jest.mock;

export default function entityFactory<Entity>(mockBase: Entity) {
  return (data: Partial<Entity>): Entity => ({ ...mockBase, ...data });
}

export function entityArrayFactory<Entity>(mockBase: Entity) {
  const singleFactory = entityFactory(mockBase);
  return (data: Partial<Entity>[]): Entity[] => data.map(singleFactory);
}

export function getFactories<Entity>(mockBase: Entity) {
  return {
    single: entityFactory(mockBase),
    array: entityArrayFactory(mockBase),
  };
}
