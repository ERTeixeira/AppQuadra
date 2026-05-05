import { applyDecorators, BadRequestException, Injectable, PipeTransform, SetMetadata } from '@nestjs/common';
import { Transform, Type } from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsDateString,
    IsDefined,
    IsEnum,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    isUUID,
    IsUUID,
    Matches,
    Max,
    MaxLength,
    Min,
    MinLength,
    registerDecorator,
    ValidateIf,
    validateSync,
    ValidationArguments,
    ValidationError,
    ValidationOptions,
} from 'class-validator';
import { cnpj, cpf } from 'cpf-cnpj-validator';
import 'reflect-metadata';
import { i18nValidationMessage } from './validation-message';

export const propertyLabelMetadataKey = 'property-label';

export function PropertyLabel(value: string) {
  return function (target: any, propertyKey: string | symbol) {
    const config = { field: propertyKey.toString(), value };
    Reflect.defineMetadata(propertyLabelMetadataKey, config, target, propertyKey);
    const existingProperties: string[] =
      Reflect.getMetadata(propertyLabelMetadataKey, target) || [];
    if (!existingProperties.includes(propertyKey.toString())) {
      existingProperties.push(propertyKey.toString());
    }
    Reflect.defineMetadata(propertyLabelMetadataKey, existingProperties, target);
  };
}

export function getPropertyLabel(instance: any, property: string): string {
  const prototype = Object.getPrototypeOf(instance);
  const metadata = Reflect.getMetadata(propertyLabelMetadataKey, prototype, property);
  if (metadata && metadata.value) {
    return metadata.value;
  }
  return '';
}

export function getValidationErrors(object: any): string[] {
  const errors: ValidationError[] = validateSync(object);
  return errors.flatMap((error: ValidationError) => 
    error.constraints ? Object.values(error.constraints) : []
  );
}

export { cnpj, cpf };

function registerValidateDecorator(
  name: string,
  fnValidate: any,
  object: Record<string, any>,
  propertyName: string | symbol,
  validationOptions?: ValidationOptions,
): void {
  registerDecorator({
    name,
    target: object.constructor,
    propertyName: String(propertyName),
    constraints: [],
    options: validationOptions,
    validator: {
      validate(value: string): boolean {
        return fnValidate(value?.replace(/\D/g, ''));
      },
      defaultMessage(args: ValidationArguments): string {
        return `${args.property} must be a valid number`;
      },
    },
  });
}

@Injectable()
export class ParamIsUuid implements PipeTransform {
  constructor(private readonly paramName: string = '') {}

  transform(value: any) {
    if (!isUUID(value)) {
      throw new BadRequestException(`Parâmetro "${this.paramName}" deve ser um UUID válido.`);
    }
    return value;
  }
}

export function IsCpf(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Record<string, any>, propertyName: string | symbol) {
    registerValidateDecorator('IsCpf', cpf.isValid, object, propertyName, validationOptions);
  };
}

export function IsCnpj(validationOptions?: ValidationOptions): PropertyDecorator {
  return function (object: Record<string, any>, propertyName: string | symbol) {
    registerValidateDecorator('IsCnpj', cnpj.isValid, object, propertyName, validationOptions);
  };
}

function DateInRange(
  min: string = '1900-01-01',
  max: string = '2099-12-31',
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  const todayDate = new Date().toISOString().split('T')[0];
  const resolveDate = (d: string) => (d === 'TODAY' ? todayDate : d);

  return function (object: Record<string, any>, propertyName: string | symbol) {
    registerDecorator({
      name: 'DateInRange',
      target: object.constructor,
      propertyName: String(propertyName),
      constraints: [resolveDate(min), resolveDate(max)],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          if (!value) return true;
          const [resolvedMin, resolvedMax] = args.constraints;
          const date = new Date(value);
          if (isNaN(date.getTime())) return false;
          return (
            date >= new Date(resolvedMin + 'T00:00:00Z') &&
            date <= new Date(resolvedMax + 'T23:59:59Z')
          );
        },
        defaultMessage(args: ValidationArguments) {
          const [resolvedMin, resolvedMax] = args.constraints;
          return `A data deve estar entre ${resolvedMin} e ${resolvedMax}.`;
        },
      },
    });
  };
}

/**
 * Decorator para string obrigatória
 * @param propertyLabelKey Chave/rótulo da propriedade
 * @param min Comprimento mínimo (padrão: 1)
 * @param max Comprimento máximo (padrão: 255)
 */
export const StringRequired = (propertyLabelKey: string, min: number = 1, max: number = 255) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    Transform(({ value }) => (typeof value === 'string' ? value.trim() : value)),
    IsDefined({
      message: i18nValidationMessage('shared.validation.isDefined'),
    }),
    IsString({ message: i18nValidationMessage('shared.validation.isString') }),
    IsNotEmpty({
      message: i18nValidationMessage('shared.validation.isNotEmpty'),
    }),
    MinLength(min, {
      message: i18nValidationMessage('shared.validation.minLength'),
    }),
    MaxLength(max, {
      message: i18nValidationMessage('shared.validation.maxLength'),
    }),
  );

/**
 * Decorator para string opcional
 */
export const StringOptional = (propertyLabelKey: string, min: number = 0, max: number = 255) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    Transform(({ value, obj, key }) => {
      if (!(key in obj)) return undefined;
      if (value === null) return null;
      if (value === '' && min > 0) return null;
      if (typeof value === 'string') return value.trim();
      return value;
    }),
    IsOptional(),
    IsString({ message: i18nValidationMessage('shared.validation.isString') }),
    MinLength(min, {
      message: i18nValidationMessage('shared.validation.minLength'),
    }),
    MaxLength(max, {
      message: i18nValidationMessage('shared.validation.maxLength'),
    }),
  );

/**
 * Decorator para UUID obrigatório
 */
export const UuidRequired = (propertyLabelKey: string) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    IsDefined({
      message: i18nValidationMessage('shared.validation.isDefined'),
    }),
    IsUUID('all', {
      message: i18nValidationMessage('shared.validation.isUuid'),
    }),
  );

/**
 * Decorator para array de UUID obrigatório
 */
export const UuidArrayRequired = (propertyLabelKey: string) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    IsDefined({ message: i18nValidationMessage('shared.validation.isDefined') }),
    IsArray(),
    IsUUID('all', { each: true, message: i18nValidationMessage('shared.validation.isUuid') }),
  );

/**
 * Decorator para array de UUID opcional
 */
export const UuidArrayOptional = (propertyLabelKey: string) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    IsOptional(),
    IsArray(),
    IsUUID('all', { each: true, message: i18nValidationMessage('shared.validation.isUuid') }),
  );

/**
 * Decorator para UUID opcional
 */
export const UuidOptional = (propertyLabelKey: string, requireIfPresent = false) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    Transform(({ value, obj, key }) => {
      if (!(key in obj)) return undefined;
      if (value === null || value === '' || value === undefined) return null;
      if (typeof value === 'string') return value.trim();
      return String(value).trim();
    }),
    IsOptional(),

    ...(requireIfPresent
      ? [
          IsOptional(),
          IsNotEmpty({
            message: i18nValidationMessage('shared.validation.isNotEmpty'),
          }),
          IsUUID('all', {
            message: i18nValidationMessage('shared.validation.isUuid'),
          }),
        ]
      : [
          ValidateIf((_, value) => value !== ''),
          IsOptional(),
          IsUUID('all', {
            message: i18nValidationMessage('shared.validation.isUuid'),
          }),
        ]),
  );

/**
 * Decorator para data obrigatória (formato: YYYY-MM-DD)
 */
export const DateRequired = (
  propertyLabelKey: string,
  min: string = '1900-01-01',
  max: string = '2099-12-31',
) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),

    Transform(({ value }) => (value === '' || value === undefined ? null : value)),

    IsDefined({
      message: i18nValidationMessage('shared.validation.isDefined'),
    }),

    IsNotEmpty({
      message: i18nValidationMessage('shared.validation.isNotEmpty'),
    }),

    Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: i18nValidationMessage('shared.validation.isDate'),
    }),

    IsDateString(
      {},
      {
        message: i18nValidationMessage('shared.validation.isDate'),
      },
    ),
    DateInRange(min, max, {
      message: i18nValidationMessage('shared.validation.isDateInRange'),
    }),
  );

/**
 * Decorator para data opcional
 */
export const DateOptional = (
  propertyLabelKey: string,
  min: string = '1900-01-01',
  max: string = '2099-12-31',
  requireIfPresent = false,
) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),

    Transform(({ value, obj, key }) => {
      if (!(key in obj)) return undefined;
      if (value === '' || value === null) return null;
      return value;
    }),

    ...(requireIfPresent
      ? [
          IsOptional(),
          IsNotEmpty({
            message: i18nValidationMessage('shared.validation.isNotEmpty'),
          }),
          Matches(/^\d{4}-\d{2}-\d{2}$/, {
            message: i18nValidationMessage('shared.validation.isDate'),
          }),
          IsDateString(
            {},
            {
              message: i18nValidationMessage('shared.validation.isDate'),
            },
          ),
          DateInRange('1900-01-01', '2099-12-31', {
            message: i18nValidationMessage('shared.validation.isDateInRange'),
          }),
        ]
      : [
          IsOptional(),
          Matches(/^\d{4}-\d{2}-\d{2}$/, {
            message: i18nValidationMessage('shared.validation.isDate'),
          }),
          IsDateString(
            {},
            {
              message: i18nValidationMessage('shared.validation.isDate'),
            },
          ),
          DateInRange(min, max, {
            message: i18nValidationMessage('shared.validation.isDateInRange'),
          }),
        ]),
  );

/**
 * Decorator para número inteiro obrigatório
 */
export const IntegerRequired = (
  propertyLabelKey: string,
  min: number = 0,
  max: number = 999999999,
) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    Type(() => Number),
    IsDefined({
      message: i18nValidationMessage('shared.validation.isDefined'),
    }),
    IsInt({
      message: i18nValidationMessage('shared.validation.isNumberInt'),
    }),
    Min(min, {
      message: i18nValidationMessage('shared.validation.min'),
    }),
    Max(max, {
      message: i18nValidationMessage('shared.validation.max'),
    }),
  );

/**
 * Decorator para número inteiro opcional
 */
export const IntegerOptional = (
  propertyLabelKey: string,
  min: number = 0,
  max: number = 999999999,
) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    Transform(({ value, obj, key }) => {
      if (!(key in obj)) return undefined;
      if (value === null) return null;
      if (value === '') return 0;
      const numberValue = Number(value);
      return isNaN(numberValue) ? value : Math.trunc(numberValue);
    }),
    IsOptional(),
    IsInt({
      message: i18nValidationMessage('shared.validation.isNumberInt'),
    }),
    Min(min, {
      message: i18nValidationMessage('shared.validation.min'),
    }),
    Max(max, {
      message: i18nValidationMessage('shared.validation.max'),
    }),
  );

/**
 * Decorator para número decimal obrigatório
 */
export const DecimalRequired = (
  propertyLabelKey: string,
  decimalsPlace: number = 2,
  min: number = 0,
  max: number = 999999999999.99,
) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),

    Transform(({ value }) => {
      if (value === '' || value === null || value === undefined) return null;
      const numberValue = Number(value);
      if (isNaN(numberValue)) return value;
      const factor = Math.pow(10, decimalsPlace);
      return Math.round(numberValue * factor) / factor;
    }),

    IsDefined({
      message: i18nValidationMessage('shared.validation.isDefined'),
    }),
    IsNotEmpty({
      message: i18nValidationMessage('shared.validation.isNotEmpty'),
    }),

    IsNumber(
      {},
      {
        message: i18nValidationMessage('shared.validation.isNumber'),
      },
    ),

    Min(min, {
      message: i18nValidationMessage('shared.validation.min'),
    }),
    Max(max, {
      message: i18nValidationMessage('shared.validation.max'),
    }),
  );

/**
 * Decorator para número decimal opcional
 */
export const DecimalOptional = (
  propertyLabelKey: string,
  decimalsPlace: number = 2,
  min: number = 0,
  max: number = 999999999999.99,
) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    Transform(({ value }) => {
      if (value === null) return null;
      if (value === '') return 0;
      const numberValue = Number(value);
      if (isNaN(numberValue)) return value;
      const factor = Math.pow(10, decimalsPlace);
      return Math.round(numberValue * factor) / factor;
    }),
    IsOptional(),
    IsNumber(
      {},
      {
        message: i18nValidationMessage('shared.validation.isNumber'),
      },
    ),

    Min(min, {
      message: i18nValidationMessage('shared.validation.min'),
    }),
    Max(max, {
      message: i18nValidationMessage('shared.validation.max'),
    }),
  );

/**
 * Decorator para booleano obrigatório
 */
export const BooleanRequired = (propertyLabelKey: string) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),

    Transform(({ value }) => {
      if (value === '' || value === null || value === undefined) return value;
      if (typeof value === 'boolean') return value;
      if (value === 'true' || value === '1' || value === 1) return true;
      if (value === 'false' || value === '0' || value === 0) return false;
      return value;
    }),

    IsDefined({
      message: i18nValidationMessage('shared.validation.isDefined'),
    }),
    IsNotEmpty({
      message: i18nValidationMessage('shared.validation.isNotEmpty'),
    }),

    IsBoolean({
      message: i18nValidationMessage('shared.validation.isBoolean'),
    }),
  );

/**
 * Decorator para booleano opcional
 */
export const BooleanOptional = (propertyLabelKey: string) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),

    IsOptional(),
    IsBoolean({
      message: i18nValidationMessage('shared.validation.isBoolean'),
    }),
  );

/**
 * Decorator para enum obrigatório
 */
export const EnumRequired = (propertyLabelKey: string, enumType: object) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),

    IsDefined({
      message: i18nValidationMessage('shared.validation.isDefined'),
    }),

    IsEnum(enumType, {
      message: i18nValidationMessage('shared.validation.isEnum'),
    }),
  );

/**
 * Decorator para enum opcional
 */
export const EnumOptional = (propertyLabelKey: string, enumType: object) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),

    IsOptional(),

    IsEnum(enumType, {
      message: i18nValidationMessage('shared.validation.isEnum'),
    }),
  );

/**
 * Decorator para array de enum opcional
 */
export const EnumArrayOptional = (propertyLabelKey: string, enumType: object) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    IsOptional(),
    IsArray(),
    IsEnum(enumType, { each: true, message: i18nValidationMessage('shared.validation.isEnum') }),
  );

/**
 * Decorator para array de enum obrigatório
 */
export const EnumArrayRequired = (propertyLabelKey: string, enumType: object) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    IsDefined({ message: i18nValidationMessage('shared.validation.isDefined') }),
    IsArray(),
    IsEnum(enumType, { each: true, message: i18nValidationMessage('shared.validation.isEnum') }),
  );

/**
 * Decorator para data/hora opcional
 */
export const DateTimeOptional = (propertyLabelKey: string) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),

    Transform(({ value }) => {
      if (value === null) return null;
      if (value === '' || value === undefined) {
        return undefined;
      }
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date;
    }),

    Type(() => Date),

    IsOptional(),

    IsDate({
      message: i18nValidationMessage('shared.validation.isDateTime'),
    }),
  );

/**
 * Decorator para data/hora obrigatória
 */
export const DateTimeRequired = (propertyLabelKey: string) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),

    Transform(({ value }) => {
      if (value === '' || value === null || value === undefined) {
        return value;
      }
      const date = new Date(value);
      return isNaN(date.getTime()) ? value : date;
    }),

    Type(() => Date),

    IsDefined({
      message: i18nValidationMessage('shared.validation.isDefined'),
    }),

    IsDate({
      message: i18nValidationMessage('shared.validation.isDateTime'),
    }),
  );

/**
 * Decorator para email obrigatório
 */
export const EmailRequired = (propertyLabelKey: string) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),

    Transform(({ value }) => {
      if (value === null || value === undefined) return '';
      return String(value).trim();
    }),

    IsString({
      message: i18nValidationMessage('shared.validation.isString'),
    }),

    MinLength(1, {
      message: i18nValidationMessage('shared.validation.isDefined'),
    }),

    Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: i18nValidationMessage('shared.validation.isEmail'),
    }),
    MaxLength(255, {
      message: i18nValidationMessage('shared.validation.maxLength'),
    }),
  );

/**
 * Decorator para email opcional
 */
export const EmailOptional = (propertyLabelKey: string, requireIfPresent = false) =>
  applyDecorators(
    Transform(({ value, obj, key }) => {
      if (!(key in obj)) return undefined;
      if (value === null) return null;
      if (typeof value === 'string') return value.trim();
      return String(value).trim();
    }),
    IsOptional(),
    ...(requireIfPresent
      ? [
          ValidateIf((obj, value) => value !== undefined),
          IsNotEmpty({
            message: i18nValidationMessage('shared.validation.isNotEmpty'),
          }),
        ]
      : [ValidateIf((_, value) => value !== '')]),
    StringOptional(propertyLabelKey, 3, 255),
    Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: i18nValidationMessage('shared.validation.isEmail'),
    }),
  );

/**
 * Decorator para telefone opcional
 */
export const PhoneOptional = (
  propertyLabelKey: string,
  min: number = 11,
  max: number = 11,
  requireIfPresent = false,
) =>
  applyDecorators(
    PropertyLabel(propertyLabelKey),
    Transform(({ value, obj, key }) => {
      if (!(key in obj)) return undefined;
      if (value === null) return null;
      if (typeof value === 'string') return value.trim();
      return String(value).trim();
    }),
    IsOptional(),
    ...(requireIfPresent
      ? [
          ValidateIf((obj, value) => value !== undefined),
          IsNotEmpty({
            message: i18nValidationMessage('shared.validation.isNotEmpty'),
          }),
        ]
      : []),
    ValidateIf((_, value) => value !== undefined && value !== null && value !== ''),
    IsString({ message: i18nValidationMessage('shared.validation.isString') }),
    MinLength(min, {
      message: i18nValidationMessage('shared.validation.minLength'),
    }),
    MaxLength(max, {
      message: i18nValidationMessage('shared.validation.maxLength'),
    }),
    Matches(/^\d+$/, {
      message: i18nValidationMessage('shared.validation.textOnlyNumbers'),
    }),
  );

/**
 * Decorator para telefone obrigatório
 */
export const PhoneRequired = (propertyLabelKey: string, min: number = 11, max: number = 11) =>
  applyDecorators(
    StringRequired(propertyLabelKey, min, max),
    Matches(/^\d+$/, {
      message: i18nValidationMessage('shared.validation.textOnlyNumbers'),
    }),
  );

/**
 * Decorator para CPF opcional
 */
export const CpfOptional = (
  propertyLabelKey: string = 'shared.campo.cpf',
  requireIfPresent = false,
) =>
  applyDecorators(
    Transform(({ value, obj, key }) => {
      if (!(key in obj)) return undefined;
      if (value === null) return null;
      if (typeof value === 'string') return value.trim();
      return String(value).trim();
    }),
    IsOptional(),
    ...(requireIfPresent
      ? [
          ValidateIf((obj, value) => value !== undefined),
          IsNotEmpty({
            message: i18nValidationMessage('shared.validation.isNotEmpty'),
          }),
        ]
      : [ValidateIf((_, value) => value !== '')]),
    StringOptional(propertyLabelKey, 11, 11),
    Matches(/^$|^\d+$/, {
      message: i18nValidationMessage('shared.validation.textOnlyNumbers'),
    }),
    IsCpf({
      message: i18nValidationMessage('shared.validation.isCpf'),
    }),
  );

/**
 * Decorator para CPF obrigatório
 */
export const CpfRequired = (propertyLabelKey: string = 'shared.campo.cpf') =>
  applyDecorators(
    StringRequired(propertyLabelKey, 11, 11),
    Matches(/^\d+$/, {
      message: i18nValidationMessage('shared.validation.textOnlyNumbers'),
    }),
    IsCpf({
      message: i18nValidationMessage('shared.validation.isCpf'),
    }),
  );

/**
 * Decorator para CNPJ opcional
 */
export const CnpjOptional = (
  propertyLabelKey: string = 'shared.campo.cnpj',
  requireIfPresent = false,
) =>
  applyDecorators(
    Transform(({ value, obj, key }) => {
      if (!(key in obj)) return undefined;
      if (value === null) return null;
      if (typeof value === 'string') return value.trim();
      return String(value).trim();
    }),
    IsOptional(),
    ...(requireIfPresent
      ? [
          ValidateIf((obj, value) => value !== undefined),
          IsNotEmpty({
            message: i18nValidationMessage('shared.validation.isNotEmpty'),
          }),
        ]
      : [ValidateIf((_, value) => value !== '')]),
    StringOptional(propertyLabelKey, 14, 14),
    Matches(/^$|^\d+$/, {
      message: i18nValidationMessage('shared.validation.textOnlyNumbers'),
    }),
    IsCnpj({
      message: i18nValidationMessage('shared.validation.isCnpj'),
    }),
  );

/**
 * Decorator para CNPJ obrigatório
 */
export const CnpjRequired = (propertyLabelKey: string = 'shared.campo.cnpj') =>
  applyDecorators(
    StringRequired(propertyLabelKey, 14, 14),
    Matches(/^\d+$/, {
      message: i18nValidationMessage('shared.validation.textOnlyNumbers'),
    }),
    IsCnpj({
      message: i18nValidationMessage('shared.validation.isCnpj'),
    }),
  );

/**
 * Decorator para passaporte obrigatório
 */
export const PassportRequired = (propertyLabelKey: string, min: number = 4, max: number = 15) =>
  applyDecorators(
    StringRequired(propertyLabelKey, min, max),
    Matches(/^$|^[A-Z0-9]+$/, {
      message: i18nValidationMessage('shared.validation.textOnlyUppercaseLettersAndNumbers'),
    }),
  );

/**
 * Decorator para passaporte opcional
 */
export const PassportOptional = (
  propertyLabelKey: string,
  requireIfPresent = false,
  min: number = 4,
  max: number = 15,
) =>
  applyDecorators(
    Transform(({ value, obj, key }) => {
      if (!(key in obj)) return undefined;
      if (value === null) return null;
      if (typeof value === 'string') return value.trim();
      return String(value).trim();
    }),
    IsOptional(),
    ...(requireIfPresent
      ? [
          ValidateIf((obj, value) => value !== undefined),
          IsNotEmpty({
            message: i18nValidationMessage('shared.validation.isNotEmpty'),
          }),
        ]
      : [ValidateIf((_, value) => value !== '')]),
    StringOptional(propertyLabelKey, min, max),
    Matches(/^$|^[A-Z0-9]+$/, {
      message: i18nValidationMessage('shared.validation.textOnlyUppercaseLettersAndNumbers'),
    }),
  );

export const IS_ROLE_KEY = 'isRole';

/**
 * Decorator para definir roles de acesso às APIs
 * Qual App tem acesso às apis de uma controller, por exemplo?
 *
 * ATENÇÃO PARA AS RÉPLICAS: A Controller origem não possui, normalmente, acesso pelos Apps que possuem a réplica.
 * Assim também para as Controllers de Réplica, ou seja, não possuem acesso pelo App que possui a Controller de origem.
 *
 * ATENÇÃO PARA AS PERMISSÕES: Essa configuração é usada também para listar nas configurações de permissão de acesso "Portal"
 * as permissões equivalentes, separadas por App. Por isso, é importante verificar se os Apps estão compatíveis com a
 * controller efetivamente.
 *
 * @param roles Array de roles permitidas
 */
export const Role = (roles: string[]) => SetMetadata(IS_ROLE_KEY, roles);

/**
 * Decorator customizado para validar que pelo menos um array de uma lista de propriedades existe e não está vazio
 * @param properties - Array com os nomes das propriedades a serem validadas
 * @param translationKey - (opcional) Chave de tradução para a mensagem de erro
 * @example
 * ```typescript
 * @AtLeastOneItemArray(['items1', 'items2', 'items3'], 'proposta.validacao.peloMenosUmTipoItem')
 * items1?: Item[];
 * ```
 */
export function AtLeastOneItemArray(
  properties: string[],
  translationKey: string = 'shared.validation.atLeastOneItemArray',
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneItemArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties.join(', ')],
      options: validationOptions,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const obj = args.object as any;

          return properties.some(
            (prop: string) => Array.isArray(obj[prop]) && obj[prop].length > 0,
          );
        },
        defaultMessage(args: ValidationArguments) {
          return i18nValidationMessage(translationKey)(args);
        },
      },
    });
  };
}

/**
 * Decorator customizado para validar que se algum campo foi enviado, pelo menos um não pode ser limpo/vazio
 * Ideal para operações de UPDATE onde os campos são opcionais, mas não podem ser todos limpos simultaneamente
 * @param properties - Array com os nomes das propriedades a serem validadas
 * @param translationKey - Chave de tradução para a mensagem de erro
 * @example
 * ```typescript
 * @CannotClearAllFields(['items1', 'items2', 'items3'])
 * items1?: Item[];
 * ```
 */
export function CannotClearAllFields(
  properties: string[],
  translationKey: string = 'shared.validation.cannotClearAllFields',
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'cannotClearAllFields',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties.join(', ')],
      options: validationOptions,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const obj = args.object as any;

          const propriedadesEnviadas = properties.filter((prop: string) =>
            obj.hasOwnProperty(prop),
          );

          if (propriedadesEnviadas.length === 0) {
            return true;
          }

          const updateParcial = propriedadesEnviadas.length < properties.length;
          if (updateParcial) {
            return true;
          }

          return properties.some((prop: string) => {
            const value = obj[prop];

            if (Array.isArray(value)) {
              return value.length > 0;
            }

            return value !== null && value !== undefined && value !== '';
          });
        },
        defaultMessage(args: ValidationArguments) {
          return i18nValidationMessage(translationKey)(args);
        },
      },
    });
  };
}

/**
 * Decorator customizado para validar que pelo menos um campo de uma lista de propriedades tem valor
 * Diferente do AtLeastOneItemArray, este decorator funciona com campos simples (não arrays)
 * @param properties - Array com os nomes das propriedades a serem validadas
 * @param translationKey - Chave de tradução para a mensagem de erro
 * @example
 * ```typescript
 * @AtLeastOneField(['cpf', 'passaporte'], 'conta.validacao.cpfOuPassaporteObrigatorio')
 * cpf?: string;
 * ```
 */
export function AtLeastOneField(
  properties: string[],
  translationKey: string = 'shared.validation.atLeastOneField',
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'atLeastOneField',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [properties.join(', ')],
      options: validationOptions,
      validator: {
        validate(_value: any, args: ValidationArguments) {
          const obj = args.object as any;

          return properties.some((prop: string) => {
            const value = obj[prop];

            if (typeof value === 'string') {
              return value.trim() !== '';
            }

            return value !== null && value !== undefined;
          });
        },
        defaultMessage(args: ValidationArguments) {
          return i18nValidationMessage(translationKey)(args);
        },
      },
    });
  };
}
