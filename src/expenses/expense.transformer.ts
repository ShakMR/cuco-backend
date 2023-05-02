import { Substitution, Transformer } from '../common/transformers/transformer';
import { EnrichedExpenseModel } from './expense.model';
import { ExpenseDto } from './expense.dto';

export class ExpenseTransformer
  implements Transformer<EnrichedExpenseModel, ExpenseDto>
{
  transform(
    { id, currency, paymentType, payer, ...rest }: EnrichedExpenseModel,
    substitutions: Substitution<EnrichedExpenseModel> = {},
  ): ExpenseDto {
    const expense = {
      ...rest,
      currency: {
        name: currency.name,
      },
      paymentType: {
        name: paymentType.name,
      },
      payer: {
        uuid: payer.uuid,
        type: payer.type,
        name: payer.name,
      },
    };

    for (const substitutionKey in substitutions) {
      expense[substitutionKey] = substitutions[substitutionKey];
    }

    return expense;
  }
}
