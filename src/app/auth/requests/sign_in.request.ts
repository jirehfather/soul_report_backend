import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Session } from 'src/lib/entities/auth/session.entity';
import { User } from 'src/lib/entities/user/user.entity';

export class SignInRequest {
  @ApiProperty({ type: String, nullable: false, description: '아이디' })
  @IsNotEmpty()
  @IsString()
  readonly email: string;

  @ApiProperty({ type: String, nullable: false, description: '비밀번호' })
  @IsNotEmpty()
  @IsString()
  readonly password: string;

  toSession(user: User): Session {
    return Session.create(user, 'userAgent', 'ipAddress');
  }
}
