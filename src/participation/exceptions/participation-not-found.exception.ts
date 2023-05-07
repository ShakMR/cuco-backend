import { NotFoundException } from '../../common/exceptions/NotFoundException';

type Context = { userUuid: string; projectUuid: string };

export class ParticipationNotFoundException extends NotFoundException<Context> {
  constructor(context: Context) {
    super('Participation', 'ERR-PART-001', context);
  }
}
