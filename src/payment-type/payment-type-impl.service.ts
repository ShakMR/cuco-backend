import { PaymentTypeService } from './payment-type.service';
import { Injectable } from '@nestjs/common';
import { PaymentType } from './payment-type.model';
import { PaymentTypeRepository } from './payment-type.repository';

@Injectable()
export class PaymentTypeImplService extends PaymentTypeService {
  constructor(private repository: PaymentTypeRepository) {
    super();
  }

  getById(id: number): Promise<PaymentType> {
    return this.repository.getById(id);
  }

  findByName(name: string): Promise<PaymentType> {
    return this.repository.findOne({ name });
  }
}
