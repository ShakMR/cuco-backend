export type PaymentType = {
  id: number;
  name?: string;
};

export enum PaymentTypeName {
  'debit',
  'credit',
}
