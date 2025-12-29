import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model } from 'mongoose';
import { CreateTelegramUserDto } from './dto/create-telegram-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async findOrCreateTelegramUser(dto: CreateTelegramUserDto): Promise<User> {
    const { telegramId, firstName, username } = dto;

    const user = await this.userModel.findOne({ telegramId });

    if (user) {
      user.firstName = firstName ?? user.firstName;
      user.username = username ?? user.username;

      return user.save();
    }

    return this.userModel.create({
      telegramId,
      firstName,
      username,
    });
  }

  async findById(userId: string): Promise<User | null> {
    return this.userModel.findById(userId);
  }
}
