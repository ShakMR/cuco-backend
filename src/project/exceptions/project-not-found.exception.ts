import { NotFoundException } from '../../common/exceptions/NotFoundException';

export class ProjectNotFoundException extends NotFoundException<{
  uuid?: string;
  id?: number;
}> {
  constructor(context: { uuid?: string; id?: number }) {
    super('Project', 'ERR-PROJ-001', context);
  }
}
