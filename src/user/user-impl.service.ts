import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { BaseUser } from './user.model';
import { CreateUserDto } from './user.dto';

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
    if (!!userDto.name) {
    }
    return this.repository.save({
      ...userDto,
      uuid,
    });
  }
}
