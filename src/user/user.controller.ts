import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateTelegramUserDto } from './dto/create-telegram-user.dto';
import { User } from './schemas/user.schema';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createOrUpdateTelegramUser(
    @Body() createUserDto: CreateTelegramUserDto,
  ): Promise<User> {
    return this.userService.findOrCreateTelegramUser(createUserDto);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id);
  }
}
