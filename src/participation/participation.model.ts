import { Project } from 'src/project/model/project.model';
import { BaseUser } from 'src/user/user.model';

export type Participation = {
  id: number;
  user: Pick<BaseUser, 'id'>;
  project: Pick<Project, 'id'>;
  share: number;
  createdAt: Date;
};

export type ParticipationWithUserAndProject = Participation & {
  user: BaseUser;
  project: Project;
};

export type UserParticipation = {
  user: BaseUser;
  participation: {
    project: Project;
    share: number;
  }[];
};
