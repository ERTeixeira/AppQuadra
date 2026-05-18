export class Result<T> {
  public isSuccess: boolean;
  public isFailure: boolean;
  public error: any;
  public message: string | undefined;
  public technicalError: string | undefined;
  public errorCode: number | undefined;
  private readonly value: T | undefined;

  private constructor(
    isSuccess: boolean,
    error?: any,
    value?: T,
    message?: string,
    technicalError?: string,
    errorCode?: number,
  ) {
    if (isSuccess && error) {
      throw new Error(
        `Operação inválida: O resultado com sucesso não pode conter mensagem de erro.`,
      );
    }
    if (!isSuccess && !error) {
      throw new Error(`Operação inválida: É necessário uma mensagem de erro.`);
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this.technicalError = technicalError;
    this.message = message;
    this.value = value;
    this.errorCode = errorCode;

    Object.freeze(this);
  }

  public getValue(): T {
    if (!this.isSuccess) {
      throw new Error(`Não é possível retornar esse valor para uma operação com erro.`);
    }

    return this.value as T;
  }

  public formatErrorAndTechnicalError(separator: string = ' - '): string {
    if (this.isSuccess) {
      throw new Error(`Não é possível retornar esse valor para uma operação bem sucedida.`);
    }

    return `${this.error}${this.technicalError ? `${separator}${this.technicalError}` : ''}`;
  }

  public static ok<U>(value?: U, message?: string): Result<U> {
    return new Result<U>(true, null, value, message);
  }

  public static fail<U>(error: any, technicalError?: string, errorCode?: number): Result<U> {
    if (error instanceof Result) {
      errorCode = error.errorCode;
      technicalError = error.technicalError;
      error = error.error;
    }

    return new Result<U>(false, error, undefined, undefined, technicalError, errorCode);
  }

  public static combine(results: Result<any>[]): Result<any> {
    for (const result of results) {
      if (result.isFailure) return result;
    }
    return Result.ok<any>();
  }
}
