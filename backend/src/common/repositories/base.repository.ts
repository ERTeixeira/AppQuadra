export abstract class BaseRepository<T extends { id: string }> {
  abstract save(record: T): Promise<void>;
  abstract findAll(where?: Partial<T>): Promise<T[]>;
  abstract findById(id: string): Promise<T | null>;
  abstract delete(id: string): Promise<void>;
}
