type BaseUser = {
  id: number;
  name: string;
  externalId: string;
  email: string;
  createdAt: Date;
};

export type User = BaseUser & {
  type: 'user';
};

export type GhostUser = BaseUser & {
  type: 'ghost';
};
