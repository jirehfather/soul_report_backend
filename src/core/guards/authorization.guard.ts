import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { isBefore } from 'date-fns';
import { Request, Response } from 'express';
import { UserContextDto } from 'src/lib/dtos/user_context.dto';
import {
  SESSION_SERVICE,
  SessionService,
} from 'src/lib/services/session/session.service';
import { USER_SERVICE, UserService } from 'src/lib/services/user/user.service';
import { IS_AUTH_API_KEY } from '../decorators/auth_api.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private readonly COOKIE_NAME = 'soulKey';
  private readonly logger = new Logger(AuthorizationGuard.name);

  constructor(
    private readonly reflector: Reflector,
    @Inject(SESSION_SERVICE) private readonly sessionService: SessionService,
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();

    // 인증 API 확인
    const isAuthApi =
      this.reflector.get<boolean>(IS_AUTH_API_KEY, context.getHandler()) ??
      false;
    if (isAuthApi === true) return true;

    const exporessRequest = ctx.getRequest<Request>();
    const expressResponse = ctx.getResponse<Response>();

    // 세션 유무 확인
    const token = exporessRequest.cookies[this.COOKIE_NAME] ?? null;
    if (token === null) throw new UnauthorizedException('인증정보가 없습니다');

    // 세션 검증 (존재 여부)
    const session = await this.sessionService.getByToken(token);
    if (token === null) {
      this.clearCookie(expressResponse);
      expressResponse.status(HttpStatus.UNAUTHORIZED).send();
    }

    // 세션 검증 (세션 만료 여부)
    const isAlive = isBefore(new Date(), session!.expiresAt);
    if (!isAlive) {
      await this.sessionService.remove(session);
      this.clearCookie(expressResponse);
      expressResponse.status(HttpStatus.UNAUTHORIZED).send();
    }

    // 유저 검증 (유저 존재 여부)
    const user = await this.userService.getById(session!.user.id);
    if (!user || !user.profile) {
      await this.sessionService.remove(session);
      this.clearCookie(expressResponse);
      expressResponse.status(HttpStatus.NOT_FOUND).send();
    }

    // 유저 정보 컨텍스트에 저장
    const request = ctx.getRequest();
    request.context = new UserContextDto(
      user!.id,
      user!.profile!.nickname ?? '',
    );
    return true;
  }

  private clearCookie(response: Response) {
    response.clearCookie(this.COOKIE_NAME, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
  }
}
