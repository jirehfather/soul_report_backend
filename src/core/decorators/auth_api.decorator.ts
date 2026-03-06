import { SetMetadata } from '@nestjs/common';

export const IS_AUTH_API_KEY = 'isAuthApi';
export const AuthApi = () => SetMetadata(IS_AUTH_API_KEY, true);
