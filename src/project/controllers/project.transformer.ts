import { Injectable } from '@nestjs/common';

import { ProjectDto } from '../dto/project.dto';
import { Project } from '../model/project.model';

@Injectable()
export class ProjectTransformer {
  transform(item: Project): ProjectDto {
    return {
      name: item.name,
      uuid: item.uuid,
      shortName: item.shortName,
      createdAt: item.createdAt,
      isOpen: item.isOpen,
    };
  }
}
