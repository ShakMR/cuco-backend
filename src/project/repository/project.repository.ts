export abstract class ProjectRepository {
  abstract getAll();

  abstract getByUuid(uuid: string);
}
