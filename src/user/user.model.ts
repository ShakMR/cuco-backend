export enum UserType {
  user = 'user',
  ghost = 'ghost',
}

export type BaseUser = {
  id: number;
  uuid: string;
  name: string;
  externalId: string;
  email: string;
  createdAt: Date;
  type: UserType;
};

export type User = BaseUser & {
  type: 'user';
};

export type GhostUser = BaseUser & {
  type: 'ghost';
};
