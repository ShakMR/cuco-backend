import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../user.dto';
import { BaseUser } from '../user.model';
import { UserService } from './user.service';

@Injectable()
export class UserImplService extends UserService {
  constructor(private repository: UserRepository) {
    super();
  }

  getById(id: number) {
    return this.repository.getById(id);
  }

  getByUuid(uuid: string) {
    return this.repository.getByUuid(uuid);
  }

  create(userDto: CreateUserDto): Promise<BaseUser> {
    const uuid = uuidV4();
    return this.repository.save({
      ...userDto,
      uuid,
    });
  }
}
