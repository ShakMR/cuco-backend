export type Substitution<T> = Partial<T>;

export abstract class Transformer<T, K = T, Extra = null> {
  abstract transform(item: T, extraData?: Extra): K;
}
