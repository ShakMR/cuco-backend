import { Injectable } from '@nestjs/common';

import { SingleProjectResponse } from '../../project/dto/project.dto';
import { Project } from '../../project/model/project.model';
import { SingleUserResponse } from '../../user/user.dto';
import { BaseUser } from '../../user/user.model';
import { ParticipationDto } from '../participation.dto';
import { ParticipationWithUserAndProject } from '../participation.model';

type DependencyTransformer = {
  user: (user: BaseUser) => SingleUserResponse;
  project: (project: Project) => SingleProjectResponse;
};

@Injectable()
export class ParticipationTransformer {
  transform(
    { id, joinedOn, user, project, ...rest }: ParticipationWithUserAndProject,
    depTransformer: DependencyTransformer,
  ): ParticipationDto {
    return {
      ...rest,
      user: depTransformer.user(user),
      project: depTransformer.project(project),
      joinedOn: new Date(joinedOn),
    };
  }
}
