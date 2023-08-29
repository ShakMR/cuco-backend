import { Passport } from '../passport.model';

export abstract class PassportRepository {
  abstract getByUserId(userId: number): Promise<Passport>;

  abstract create(param: { password: string; salt: string; userId: number });
}
