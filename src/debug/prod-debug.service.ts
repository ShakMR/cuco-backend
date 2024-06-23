import { Injectable } from '@nestjs/common';

@Injectable()
export class ProdDebugService {
  public dump(entity?: any): any {
    return {
      [entity]: [],
    };
  }
}
