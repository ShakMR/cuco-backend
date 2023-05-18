import { createMockProject } from '../../__mocks__/project.model';
import { ProjectTransformer } from '../project.transformer';

describe('ProjectTransformer', () => {
  describe('transform', () => {
    it('should transform project', () => {
      const transformer = new ProjectTransformer();

      const { id, expenses, ...project } = createMockProject({});

      const transformedProject = transformer.transform({
        id,
        expenses,
        ...project,
      });

      expect(transformedProject).toEqual({
        ...project,
      });
    });
  });
});
