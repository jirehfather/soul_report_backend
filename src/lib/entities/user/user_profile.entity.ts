import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v7 } from 'uuid';
import { AbstractBaseTimeEntity } from '../abstracts/abstract_base_time.entity';
import { User } from './user.entity';

@Entity({ tableName: 'user_profiles' })
export class UserProfile extends AbstractBaseTimeEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

  @OneToOne({ entity: () => User, nullable: false })
  user!: User;

  @Property({ length: 50, nullable: true })
  nickname: string | null = null;

  @Property({ type: 'text', nullable: true })
  avatarUrl: string | null = null;

  @Property({ type: 'text', nullable: true })
  bio: string | null = null;

  @Property({ nullable: true })
  phoneNumber: string | null = null;
}
