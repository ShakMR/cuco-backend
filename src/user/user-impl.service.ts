import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserImplService extends UserService {
  constructor(private repository: UserRepository) {
    super();
  }
  getById(id: number) {
    return this.repository.getById(id);
  }
}