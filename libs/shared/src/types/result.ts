/**
 * Tipo genérico de resultado para operações
 */
export class Result<T = any> {
  private constructor(
    public isSuccess: boolean,
    public isFailure: boolean,
    public value?: T,
    public error?: string | any,
  ) {}

  static ok<U>(value?: U): Result<U> {
    return new Result<U>(true, false, value, undefined);
  }

  static fail<U>(error: string | any): Result<U> {
    return new Result<U>(false, true, undefined, error);
  }

  getValue(): T {
    if (this.isSuccess) {
      return this.value!;
    }
    throw new Error(`Called getValue on a failure result: ${this.error}`);
  }

  getError(): string | any {
    if (this.isFailure) {
      return this.error;
    }
    throw new Error('Called getError on a success result');
  }
}
