export abstract class ProjectRepository {
  abstract getAll();

  abstract getById(id: number);
}
