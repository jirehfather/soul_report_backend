import { Module } from '@nestjs/common';
import { GroupController } from './controllers/group.controller';

@Module({
  controllers: [GroupController],
})
export class GroupModule {}
