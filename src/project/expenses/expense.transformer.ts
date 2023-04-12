import { Transformer } from '../../common/transformers/transformer';
import { EnrichedExpenseModel, ExpenseModel } from './expense.model';
import { ExpenseDto } from './expense.dto';

export class ExpenseTransformer
  implements Transformer<ExpenseModel, ExpenseDto>
{
  transform({
    id,
    currency,
    paymentType,
    payer,
    ...rest
  }: EnrichedExpenseModel): ExpenseDto {
    return {
      ...rest,
      currency: {
        name: currency.name,
      },
      paymentType: {
        name: paymentType.name,
      },
      payer: {
        type: payer.type,
        name: payer.name,
      },
    };
  }
}
