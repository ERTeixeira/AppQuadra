/**
 * Interface base para dados de documento
 * Implementada por todas as entidades do sistema
 */
export interface IDocumentData {
  id?: string;
  [key: string]: any;
}
