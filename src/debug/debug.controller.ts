import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { DebugService } from './debug.service';

@Controller()
@ApiTags('debug')
export class DebugController {
  constructor(private debugService: DebugService) {}

  @Get('/debug/:entity')
  async dump(@Param('entity') entity: 'user' | 'project' | 'expenses') {
    return {
      data: await this.debugService.dump(entity),
    };
  }
}
