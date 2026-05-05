/**
 * Função auxiliar para retornar mensagens de validação
 * Pode ser integrada com i18n conforme necessário
 */
export function i18nValidationMessage(key: string) {
  return (args?: any) => {
    // Implementação básica - pode ser expandida com i18n real
    const messages: Record<string, string> = {
      'shared.validation.isDefined': 'Este campo é obrigatório',
      'shared.validation.isString': 'Este campo deve ser uma string',
      'shared.validation.isNotEmpty': 'Este campo não pode estar vazio',
      'shared.validation.minLength': 'Este campo deve ter no mínimo {min} caracteres',
      'shared.validation.maxLength': 'Este campo deve ter no máximo {max} caracteres',
      'shared.validation.isUuid': 'Este campo deve ser um UUID válido',
      'shared.validation.isEmail': 'Este campo deve ser um email válido',
      'shared.validation.isNumber': 'Este campo deve ser um número',
      'shared.validation.isNumberInt': 'Este campo deve ser um número inteiro',
      'shared.validation.min': 'Este campo deve ser no mínimo {min}',
      'shared.validation.max': 'Este campo deve ser no máximo {max}',
      'shared.validation.isDate': 'Este campo deve ser uma data válida no formato YYYY-MM-DD',
      'shared.validation.isDateInRange': 'A data deve estar entre {min} e {max}',
      'shared.validation.isDateTime': 'Este campo deve ser uma data/hora válida',
      'shared.validation.isBoolean': 'Este campo deve ser um booleano',
      'shared.validation.isEnum': 'Este campo deve ser um valor válido',
      'shared.validation.isCpf': 'CPF inválido',
      'shared.validation.isCnpj': 'CNPJ inválido',
      'shared.validation.textOnlyNumbers': 'Este campo deve conter apenas números',
      'shared.validation.textOnlyUppercaseLettersAndNumbers': 'Este campo deve conter apenas letras maiúsculas e números',
      'shared.validation.atLeastOneItemArray': 'Pelo menos um item deve ser fornecido',
      'shared.validation.cannotClearAllFields': 'Pelo menos um campo deve ser preenchido',
      'shared.validation.atLeastOneField': 'Pelo menos um desses campos deve ser preenchido',
    };

    return messages[key] || key;
  };
}
