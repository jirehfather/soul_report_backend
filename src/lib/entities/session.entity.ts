import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { v4 } from 'uuid';
import { User } from './user.entity';

@Entity({ tableName: 'sessions' })
export class Session {
  @PrimaryKey({ type: 'uuid' })
  id: string = v4();

  @ManyToOne(() => User)
  user!: User;

  @Property({ unique: true })
  sessionToken!: string;

  @Property({ type: 'text', nullable: true })
  userAgent: string | null = null;

  @Property({ nullable: true })
  ipAddress: string | null = null;

  @Property()
  expiresAt!: Date;

  @Property()
  createdAt: Date = new Date();
}
