import { Participation } from '../../db/schemas';

const part: Participation = {
  user_id: 1,
  project_id: 1,
  created_at: new Date().toISOString(),
  share: 50,
  id: 1,
};

export default part;
