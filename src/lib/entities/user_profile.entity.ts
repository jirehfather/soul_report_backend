import { Entity, OneToOne, Property } from '@mikro-orm/core';
import { User } from './user.entity';

@Entity({ tableName: 'user_profiles' })
export class UserProfile {
  @OneToOne({ primary: true, entity: () => User })
  user!: User;

  @Property({ length: 50, nullable: true })
  nickname: string | null = null;

  @Property({ type: 'text', nullable: true })
  avatarUrl: string | null = null;

  @Property({ type: 'text', nullable: true })
  bio: string | null = null;

  @Property({ nullable: true })
  phoneNumber: string | null = null;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
