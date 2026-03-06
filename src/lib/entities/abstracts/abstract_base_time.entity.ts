import { Property } from '@mikro-orm/core';
import { AbstractBaseEntity } from './abstract_base.entity';

export class AbstractBaseTimeEntity extends AbstractBaseEntity {
  @Property({
    type: 'timestamp with time zone',
    name: 'created_at',
    onCreate: () => new Date(),
  })
  createdAt: Date = new Date();

  @Property({
    type: 'timestamp with time zone',
    name: 'updated_at',
    onCreate: () => new Date(),
    onUpdate: () => new Date(),
  })
  updatedAt: Date = new Date();
}
