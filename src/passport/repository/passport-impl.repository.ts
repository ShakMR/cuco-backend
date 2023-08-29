import { PassportRepository } from './passport.repository';
import { DbClient } from '../../db/db-client';
import { PassportSchema, PassportTable } from '../../db/schemas';
import { Passport } from '../passport.model';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PassportImplRepository extends PassportRepository {
  constructor(private db: DbClient<PassportSchema>) {
    super();
    this.db.init(PassportTable);
  }

  static map({ password, salt, id }: PassportSchema): Passport {
    return {
      id,
      password,
      salt,
    };
  }

  async getByUserId(userId: number): Promise<Passport> {
    const passport = await this.db.getBy({ user_id: userId });
    return PassportImplRepository.map(passport);
  }

  async create({
    userId,
    ...params
  }: {
    password: string;
    salt: string;
    userId: number;
  }) {
    const passport = await this.db.save({
      ...params,
      user_id: userId,
    });
    return PassportImplRepository.map(passport);
  }
}
