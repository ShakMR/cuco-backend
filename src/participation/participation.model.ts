import { Project } from 'src/project/model/project.model';
import { BaseUser } from 'src/user/user.model';

export type Participation = {
  id: number;
  user: Pick<BaseUser, 'id'>;
  project: Pick<Project, 'id'>;
  createdAt: Date;
};

export type ParticipationWithUserAndProject = Participation & {
  user: BaseUser;
  project: Project;
};
