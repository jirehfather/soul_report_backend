import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { v4 } from 'uuid';
import { Role } from '../enums/role.enum';
import { UserStatus } from '../enums/user_status.enum';
import { Church } from './church.entity';
import { UserProfile } from './user_profile.entity';

@Entity({ tableName: 'users' })
export class User {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => Church)
  church!: Church;

  @Property({ unique: true })
  email!: string;

  @Property({ hidden: true })
  passwordHash!: string;

  @Enum({ items: () => Role, default: Role.MEMBER })
  role: Role = Role.MEMBER;

  @Enum({ items: () => UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus = UserStatus.ACTIVE;

  @Property()
  createdAt: Date = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    owner: false,
    nullable: true,
  })
  profile: UserProfile | null = null;
}
