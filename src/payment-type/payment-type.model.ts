export type PaymentType = {
  id: number;
  name?: PaymentTypeName;
};

export enum PaymentTypeName {
  'debit' = 'debit',
  'credit' = 'credit',
}
