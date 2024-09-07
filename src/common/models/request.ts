import { Request } from 'express';
import { BaseUser } from '../../user/user.model';

export type RequestWithUser = Request & { user: BaseUser };
