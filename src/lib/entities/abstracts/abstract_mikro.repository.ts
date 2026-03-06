import {
  EntityName,
  FilterQuery,
  FindOneOptions,
  FindOptions,
} from '@mikro-orm/core';
import { EntityManager, Knex } from '@mikro-orm/postgresql';
import { Injectable, NotFoundException } from '@nestjs/common';
import { AbstractBaseEntity } from './abstract_base.entity';

export interface IMikroRepository<T extends AbstractBaseEntity> {
  save(entity: T | T[]): Promise<T[]>;
  remove(entity: T | T[]): Promise<void>;
  findOneByQuery<Hint extends string = never>(
    where: FilterQuery<T>,
    options?: FindOneOptions<T, Hint>,
  ): Promise<T | null>;
  findOneByQueryOrFail<Hint extends string = never>(
    where: FilterQuery<T>,
    options?: FindOneOptions<T, Hint>,
    message?: string,
  ): Promise<T>;
  findOneById(id: string | null): Promise<T | null>;
  findOneByIdOrFail(id: string, message?: string): Promise<T>;
  findByQuery<Hint extends string = never>(
    where: FilterQuery<T>,
    options?: FindOptions<T, Hint>,
  ): Promise<T[]>;
  findAndCountByQuery<Hint extends string = never>(
    where: FilterQuery<T>,
    options?: FindOptions<T, Hint>,
  ): Promise<[T[], number]>;
  findByIds(ids: string[]): Promise<T[]>;
  isExistByQuery<Hint extends string = never>(
    where: FilterQuery<T>,
    options?: FindOptions<T, Hint>,
  ): Promise<boolean>;
  isExistById(id: string): Promise<boolean>;
}

/**
 * MikroRepository
 * @description: MikroORM Entity가 공통적으로 사용하는 Repository
 * * MikroORM을 사용하는 Entity에서 공통적으로 사용하는 Method를 정의한 Abstract Class
 * * 각 Entity의 Repository는 해당 class를 상속받아 getEntityName 만 구현하여 사용할 수 있도록 한다.
 *
 * ! MikroORM에서 제공하는 RequestContext를 사용하고 있기 때문에 EntityManager에 바로 접근하는 것이 아니라 em.Context()로 접근하여 현재 Context에 맞는 em을 사용할 것
 * ! Property마다 find method를 생성할 수 없기 때문에 findOneByQuery, findByQuery로 각 비지니스 성격에 맞게 Service Layer에서 사용할 것
 * ! Repository에서 데이터를 찾는 것이기 때문에 find 라는 prefix를 사용할 것
 * ! 공통적인 Method를 정의한 것이기 때문에 수정 시 반드시 컨펌을 받을 것
 */
@Injectable()
export abstract class MikroRepository<
  T extends AbstractBaseEntity,
> implements IMikroRepository<T> {
  abstract getEntityName(): EntityName<T>;

  constructor(protected readonly em: EntityManager) {}

  protected getKnex(): Knex {
    return this.em.getKnex();
  }

  async save(entity: T | T[]): Promise<T[]> {
    const entities = Array.isArray(entity) ? entity : [entity];
    await this.em.getContext().persist(entities).flush();
    return entities;
  }

  async remove(entity: T | T[]): Promise<void> {
    await this.em.getContext().remove(entity).flush();
  }

  async findOneByQuery<Hint extends string = never>(
    where: FilterQuery<T>,
    options?: FindOneOptions<T, Hint>,
  ): Promise<T | null> {
    return this.em.getContext().findOne(this.getEntityName(), where, options);
  }

  async findOneByQueryOrFail<Hint extends string = never>(
    where: FilterQuery<T>,
    options?: FindOneOptions<T, Hint> | undefined,
    message?: string,
  ): Promise<T> {
    const target = await this.em
      .getContext()
      .findOne(this.getEntityName(), where, options);
    if (!target) {
      throw new NotFoundException(message || '데이터를 찾을 수 없습니다.');
    }
    return target;
  }

  async findOneById(id: string): Promise<T | null> {
    const filter: FilterQuery<T> = { id } as FilterQuery<T>;
    return await this.em.getContext().findOne(this.getEntityName(), filter);
  }

  async findOneByIdOrFail<Hint extends string = never>(
    id: string,
    message?: string,
  ): Promise<T> {
    const filter: FilterQuery<T> = { id } as FilterQuery<T>;
    const target = await this.em
      .getContext()
      .findOne(this.getEntityName(), filter);
    if (!target) {
      throw new NotFoundException(message || '데이터를 찾을 수 없습니다.');
    }
    return target;
  }

  async findByQuery<Hint extends string = never>(
    where: FilterQuery<T>,
    options?: FindOptions<T, Hint>,
  ): Promise<T[]> {
    return await this.em
      .getContext()
      .find(this.getEntityName(), where, options);
  }

  async findAndCountByQuery<Hint extends string = never>(
    where: FilterQuery<T>,
    options?: FindOptions<T, Hint>,
  ): Promise<[T[], number]> {
    return await this.em
      .getContext()
      .findAndCount(this.getEntityName(), where, options);
  }

  async findByIds(ids: string[]): Promise<T[]> {
    const filter: FilterQuery<T> = {
      id: { $in: ids },
    } as unknown as FilterQuery<T>;
    return await this.em.getContext().find(this.getEntityName(), filter);
  }

  async isExistByQuery<Hint extends string = never>(
    where: FilterQuery<T>,
    options?: FindOptions<T, Hint>,
  ): Promise<boolean> {
    const result = await this.em
      .getContext()
      .count(this.getEntityName(), where, options);
    return result > 0;
  }

  async isExistById(id: string): Promise<boolean> {
    const filter: FilterQuery<T> = { id } as FilterQuery<T>;
    const result = await this.em
      .getContext()
      .count(this.getEntityName(), filter);
    return result > 0;
  }
}
