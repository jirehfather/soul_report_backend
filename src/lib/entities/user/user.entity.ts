import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/lib/enums/role.enum';
import { UserStatus } from 'src/lib/enums/user_status.enum';
import { v7 } from 'uuid';
import { AbstractBaseTimeEntity } from '../abstracts/abstract_base_time.entity';
import { Church } from '../church/church.entity';
import { UserProfile } from './user_profile.entity';

@Entity({ tableName: 'users' })
export class User extends AbstractBaseTimeEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

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

  @OneToOne(() => UserProfile, (profile) => profile.user, {
    owner: false,
    nullable: true,
  })
  profile: UserProfile | null = null;

  verify(password: string): boolean {
    return bcrypt.compareSync(password, this.passwordHash);
  }
}
