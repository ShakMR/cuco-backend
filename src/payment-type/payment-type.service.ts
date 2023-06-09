import { PaymentType } from './payment-type.model';

export abstract class PaymentTypeService {
  abstract getById(id: number): Promise<PaymentType>;
  abstract findByName(name: string): Promise<PaymentType>;
}
