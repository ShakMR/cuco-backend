import { PaymentType } from './payment-type.model';

export abstract class PaymentTypeRepository {
  abstract getById(id: number): Promise<PaymentType>;
  abstract findOne(filter: { name: string }): Promise<PaymentType>;
}
