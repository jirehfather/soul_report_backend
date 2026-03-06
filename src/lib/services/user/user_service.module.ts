import { ClassProvider, Module } from '@nestjs/common';
import { UserRepositoryModule } from 'src/lib/entities/user/user_repository.module';
import { UserService, USER_SERVICE } from './user.service';

const userService: ClassProvider = {
  provide: USER_SERVICE,
  useClass: UserService,
};

const services = [userService];

@Module({
  imports: [UserRepositoryModule],
  providers: services,
  exports: services,
})
export class UserServiceModule {}
