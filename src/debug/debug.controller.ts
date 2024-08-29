import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Query } from '@nestjs/common';
import { DebugService, Entities } from './debug.service';
import { AppError } from '../common/exceptions/AppError';

class InvalidEntityError extends AppError {
  statusCode = 400;
}

@Controller()
@ApiTags('debug')
export class DebugController {
  constructor(private debugService: DebugService) {}

  @Get('/debug/:entity')
  async dump(@Param('entity') entity: string) {
    try {
      return {
        data: await this.debugService.dump(entity as unknown as Entities),
      };
    } catch (e) {
      if (e.errorCode) {
        throw new InvalidEntityError('Invalid Entity', 'DEB-001');
      }
      console.log(e);
      throw e;
    }
  }

  @Get('/debug-any')
  async dumpAny(@Query('entity') entity: string) {
    return {
      data: await this.debugService.dump(entity as unknown as Entities),
    };
  }
}
