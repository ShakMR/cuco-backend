import { Injectable } from '@nestjs/common';
import { v4 as uuidV4 } from 'uuid';

import { UserRepository } from '../repositories/user.repository';
import { CreateUserDto } from '../user.dto';
import { BaseUser } from '../user.model';
import { UserService } from './user.service';
import { EmailAlreadyRegisteredException } from '../exceptions/EmailAlreadyRegisteredException';

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

  async create(userDto: CreateUserDto): Promise<BaseUser> {
    const uuid = uuidV4();
    const existingUser = await this.repository.findOne({
      email: userDto.email,
    });

    if (existingUser !== null) {
      throw new EmailAlreadyRegisteredException({ email: userDto.email });
    }

    return this.repository.save({
      ...userDto,
      uuid,
    });
  }

  findOne(email: string, uuid: string): Promise<BaseUser> {
    return this.repository.findOne({ email, uuid });
  }

  getAllById(ids: number[]): Promise<BaseUser[]> {
    return Promise.all<BaseUser>(ids.map(this.getById.bind(this)));
  }
}
