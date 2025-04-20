export abstract class BaseMapper<T, K, L, R = K> {
  abstract toEntity(dto: K | L): T;
  abstract toDto(entity: T): R;

  toEntityArray(dtoArray: (K | L)[]): T[] {
    return dtoArray.map((dto) => this.toEntity(dto));
  }

  toDtoArray(entityArray: T[]): R[] {
    return entityArray.map((entity) => this.toDto(entity));
  }
}
