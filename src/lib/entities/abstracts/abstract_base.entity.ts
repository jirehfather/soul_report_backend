import { PrimaryKey } from '@mikro-orm/core';
import { v7 as UUID } from 'uuid';

export abstract class AbstractBaseEntity {
  @PrimaryKey()
  id: string;

  constructor() {
    this.id = UUID();
  }
}
