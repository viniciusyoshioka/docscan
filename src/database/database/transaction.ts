export class Transaction<T = unknown> {


  protected readonly context: T


  constructor(context: T) {
    this.context = context
  }


  get underlyingContext(): T {
    return this.context
  }
}
