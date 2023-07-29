import { fixDay } from '../../common/__mocks__/date';
import { getFactories } from '../../common/__mocks__/entity.factory';
import { Participation as ParticipationSchema } from '../../db/schemas';
import { createMockProject } from '../../project/__mocks__/project.model';
import { createMockUser } from '../../user/__mocks__/user';
import { Participation } from '../participation.model';

const mockParticipation: Participation = {
  id: 1234,
  user: { id: 1 },
  project: { id: 1 },
  share: 50,
  createdAt: fixDay,
};

export default mockParticipation;

const internalFactories = getFactories(mockParticipation);

export const createMockParticipation = internalFactories.single;
export const createArrayOfMockParticipation = internalFactories.array;

const mockDBParticipation: ParticipationSchema = {
  id: 1234,
  user_id: 1,
  project_id: 1,
  share: 50,
  created_at: fixDay.toISOString(),
};

const dbFactories = getFactories(mockDBParticipation);
export const createMockDBParticipation = dbFactories.single;
export const createArrayOfMockDBParticipation = dbFactories.array;
