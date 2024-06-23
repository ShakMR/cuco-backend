import { Project } from 'src/project/model/project.model';
import { BaseUser } from 'src/user/user.model';

export type Participation = {
  id: number;
  user: Pick<BaseUser, 'id'>;
  project: Pick<Project, 'id'>;
  share: number;
  joinedOn: Date;
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
    joinedOn: Date;
  }[];
};

export type ProjectParticipants = {
  project: Project;
  participants: {
    user: BaseUser;
    share: number;
    joinedOn: Date;
  }[];
};
