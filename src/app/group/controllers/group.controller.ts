import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserContext } from 'src/core/decorators/user_context.decorator';
import { UserContextDto } from 'src/lib/dtos/user_context.dto';

@ApiTags('Group(그룹)')
@Controller('groups')
export class GroupController {
  @Get()
  getGroups(@UserContext() context: UserContextDto) {
    return [];
  }
}
