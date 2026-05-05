/**
 * @quadra/shared
 *
 * Estrutura organizacional:
 * - /database      - Interfaces, modelos e tipos para persistência (DocumentData, IDocumentData)
 * - /decorators    - Validation decorators (validação de DTOs)
 * - /interfaces    - Interfaces genéricas e reutilizáveis
 * - /models        - Modelos base e abstratos
 * - /types         - Tipos utilitários (Result, etc)
 * - /constants     - Constantes compartilhadas
 */

// Database module
export * from './database/interfaces/document-data.interface.js';
export * from './database/models/document-data.js';

// Decorators module
export * from './decorators/validation-message.js';
export * from './decorators/validation.decorators.js';

// Types
export * from './types.js';
export * from './types/result.js';

// Constants
export * from './constants.js';

