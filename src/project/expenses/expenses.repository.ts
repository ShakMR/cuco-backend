export abstract class ExpensesRepository {
  abstract getFromProject(projectId: number);

  abstract getByUuid(uuid: string);
}
