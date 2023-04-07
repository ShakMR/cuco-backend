import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { MockService } from './mock.service';
import { ProjectTransformer } from './project.transformer';
import { Transformer } from '../common/transformers/transformer';

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [
    {
      provide: ProjectService,
      useClass: MockService,
    },
    {
      provide: Transformer,
      useClass: ProjectTransformer,
    },
  ],
})
export class ProjectModule {}
