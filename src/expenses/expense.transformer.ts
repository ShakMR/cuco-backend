import { Substitution, Transformer } from '../common/transformers/transformer';
import { ExpenseDto } from './dto/expense.dto';
import { EnrichedExpenseModel } from './expense.model';


export class ExpenseTransformer
  implements Transformer<EnrichedExpenseModel, ExpenseDto>
{
  transform(
    {
      id: _,
      currency,
      paymentType,
      payer,
      createdAt,
      date,
      ...rest
    }: EnrichedExpenseModel,
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
      date,
      createdAt,
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
