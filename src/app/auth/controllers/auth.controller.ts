import {
  Body,
  Controller,
  Delete,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { AuthApi } from 'src/core/decorators/auth_api.decorator';
import {
  SESSION_SERVICE,
  SessionService,
} from 'src/lib/services/session/session.service';
import { USER_SERVICE, UserService } from 'src/lib/services/user/user.service';
import { SignInRequest } from '../requests/sign_in.request';

@ApiTags('AUTH(인증)')
@Controller('auth')
export class AuthController {
  private readonly COOKIE_NAME = 'soulKey';

  constructor(
    @Inject(SESSION_SERVICE) private readonly sessionService: SessionService,
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: '로그인 API' })
  @ApiNoContentResponse({ description: '로그인(세션발급)' })
  @ApiUnauthorizedResponse({ description: '유저 정보가 유효하지 않을 때' })
  @Post('sign-in')
  @AuthApi()
  async signIn(
    @Body() request: SignInRequest,
    @Res() response: Response,
  ): Promise<void> {
    // 유저 유효성 검사
    const user = await this.userService.getByEmail(request.email);
    if (user === null || user.verify(request.password) === false) {
      throw new UnauthorizedException('아이디 혹은 비밀번호를 확인해주세요.');
    }

    // 세션 발급
    const session = request.toSession(user);
    const token = await this.sessionService.createSession(session);

    // 응답
    response.cookie(this.COOKIE_NAME, token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });
    response.status(HttpStatus.NO_CONTENT).send();
  }

  @ApiOperation({ summary: '로그아웃 API' })
  @Delete('sign-out')
  @ApiNoContentResponse({ description: '로그아웃(세션삭제)' })
  @AuthApi()
  async signOut(
    @Req() request: Request,
    @Res() response: Response,
  ): Promise<void> {
    // 쿠키에서 토큰 추출
    const token = request.cookies[this.COOKIE_NAME];
    if (!token) response.status(HttpStatus.NO_CONTENT).send();

    // 세션 삭제
    const session = await this.sessionService.getByToken(token);
    await this.sessionService.remove(session);

    // 응답
    response.clearCookie(this.COOKIE_NAME);
    response.status(HttpStatus.NO_CONTENT).send();
  }
}
