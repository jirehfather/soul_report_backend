import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 } from 'uuid';
import { AbstractBaseTimeEntity } from '../abstracts/abstract_base_time.entity';

@Entity({ tableName: 'churches' })
export class Church extends AbstractBaseTimeEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @Property()
  name!: string;

  @Property({ type: 'text', nullable: true })
  address: string | null = null;

  @Property({ nullable: true })
  phoneNumber: string | null = null;

  @Property({ default: true })
  isActive: boolean = true;
}
