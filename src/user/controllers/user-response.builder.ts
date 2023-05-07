import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseUser } from '../user.model';
import { SingleUserResponse } from '../user.dto';
import { UserTransformer } from './user.transformer';

@Injectable()
export class UserResponseBuilder {
  private readonly mainPath: string;

  constructor(
    private configService: ConfigService,
    private transformer: UserTransformer,
  ) {
    const prefix = configService.get('API_PREFIX');
    this.mainPath = `/${prefix}/users`;
  }

  buildSingleResponse(user: BaseUser): SingleUserResponse {
    return {
      data: this.transformer.transform(user),
      meta: this.buildSingleResponseMeta(user),
    };
  }

  private buildSingleResponseMeta(user: BaseUser) {
    return {
      links: {
        self: `${this.mainPath}/${user.uuid}`,
        list: this.mainPath,
      },
    };
  }
}
