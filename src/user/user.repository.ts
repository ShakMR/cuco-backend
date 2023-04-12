import { GhostUser, User } from './user.model';

export abstract class UserRepository {
  abstract getById(id: number): Promise<User | GhostUser>;
}