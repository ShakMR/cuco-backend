import { ProjectListDto } from './dto/project-list.dto';
import { Controller, Get } from '@nestjs/common';
import { ProjectService } from './project.service';
import { Transformer } from '../common/transformers/transformer';
import { Project } from './model/project.model';
import { ProjectDto } from './dto/project.dto';

@Controller('projects')
export class ProjectController {
  constructor(
    private service: ProjectService,
    private transformer: Transformer<Project, ProjectDto>,
  ) {}

  @Get()
  async list(): Promise<ProjectListDto> {
    const projects = await this.service.getAll();

    return {
      data: projects.map((item) => this.transformer.transform(item)),
      meta: {},
    };
  }

  // get(
  //   @Param('uuid') uuid: string,
  //   @Query('includeItems') includeItems: boolean,
  // ): ProjectDto {}
}
