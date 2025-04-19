export abstract class BaseMapper<T, K, R = K> {
  abstract toEntity(dto: K): T;
  abstract toDto(entity: T): R;

  toEntityArray(dtoArray: K[]): T[] {
    return dtoArray.map((dto) => this.toEntity(dto));
  }

  toDtoArray(entityArray: T[]): R[] {
    return entityArray.map((entity) => this.toDto(entity));
  }
}
