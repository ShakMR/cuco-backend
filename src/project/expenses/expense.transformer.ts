import { Transformer } from '../../common/transformers/transformer';
import { ExpenseModel } from './expense.model';
import { ExpenseDto } from './expense.dto';

export class ExpenseTransformer
  implements Transformer<ExpenseModel, ExpenseDto>
{
  transform({ id, currency, paymentType, ...rest }: ExpenseModel): ExpenseDto {
    return {
      ...rest,
      currency: {
        name: currency.name,
      },
      paymentType: {
        name: paymentType.name,
      },
    };
  }
}
