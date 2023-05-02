import { Project } from '../model/project.model';
import { ProjectDto } from '../dto/project.dto';
import { ListExpenseResponse } from '../../expenses/expense.dto';
import { EnrichedExpenseModel } from '../../expenses/expense.model';
import { Injectable } from '@nestjs/common';

type DependencyTransformers = {
  expenses: (item: EnrichedExpenseModel[], project) => ListExpenseResponse;
};

@Injectable()
export class ProjectTransformer {
  transform(
    item: Project,
    depsTransformers?: DependencyTransformers,
  ): ProjectDto {
    return {
      name: item.name,
      uuid: item.uuid,
      expenses:
        item.expenses && item.expenses.length
          ? depsTransformers.expenses(item.expenses, item)
          : undefined,
      createdAt: item.createdAt,
      isOpen: item.isOpen,
    };
  }

  transformList(
    items: Project[],
    depsTransformers?: DependencyTransformers,
  ): ProjectDto[] {
    return items.map((item) => this.transform(item, depsTransformers));
  }
}
