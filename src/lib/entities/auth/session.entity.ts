import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { add } from 'date-fns';
import { v4, v7 } from 'uuid';
import { AbstractBaseTimeEntity } from '../abstracts/abstract_base_time.entity';
import { User } from '../user/user.entity';

@Entity({ tableName: 'sessions' })
export class Session extends AbstractBaseTimeEntity {
  @PrimaryKey({ type: 'uuid' })
  id: string = v7();

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

  static create(
    user: User,
    userAgent: string | null,
    ipAddress: string | null,
  ): Session {
    const session = new Session();
    session.user = user;
    session.sessionToken = v4();
    session.userAgent = userAgent;
    session.ipAddress = ipAddress;
    session.expiresAt = add(new Date(), { hours: 2 });
    return session;
  }
}
