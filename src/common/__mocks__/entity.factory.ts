export default function entityFactory<Entity>(mockBase: Entity) {
  return (data: Partial<Entity>) => ({ ...mockBase, ...data });
}
