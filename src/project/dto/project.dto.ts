export interface ProjectDto {
  name: string;
  uuid: string;
  expenses?: any[]; // TODO change this to proper type.
  createdAt: Date;
}
