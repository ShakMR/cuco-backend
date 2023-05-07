export class AppError extends Error {
  public errorCode: string;
  context: any;

  constructor(message, errorCode) {
    super(message);
    this.errorCode = errorCode;
  }
}
