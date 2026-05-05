import { Expose, Type } from 'class-transformer';
import { IDocumentData } from '../interfaces/document-data.interface.js';

/**
 * Classe base para todos os modelos de documento
 * Fornece campos comuns de auditoria e rastreamento
 */
export abstract class DocumentData implements IDocumentData {
  [key: string]: any;

  @Expose()
  id!: string;

  @Expose()
  @Type(() => Date)
  updatedAt!: Date;

  @Expose()
  version?: number;

  @Expose()
  eventId?: string;

  constructor(data: IDocumentData) {
    this.id = '';
    this.updatedAt = new Date();
    this.version = undefined;
    this.eventId = undefined;

    if (data) {
      Object.assign(this, data);
    }
    
    if (!this.updatedAt) {
      this.updatedAt = new Date();
    }
  }
}
