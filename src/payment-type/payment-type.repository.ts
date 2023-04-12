import { PaymentType } from './payment-type.model';

export abstract class PaymentTypeRepository {
  abstract getById(id: number): Promise<PaymentType>;
}
