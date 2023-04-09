export abstract class DbConnector<T> {
  protected client: T;

  abstract getClient(): T;
}
