import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, Status, Role } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { EventsGateway } from '../events/events.gateway';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private eventsGateway: EventsGateway,
  ) {}

  async findOrCreate(profile: any): Promise<User> {
    const email = (profile.emails[0].value as string).toLowerCase();
    let user = await this.userModel.findOne({ oauthId: profile.id });

    if (!user) {
      user = await this.userModel.findOne({ email });
      if (user) {
        user.oauthId = profile.id;
        if (profile.displayName && (user.name === 'Admin' || user.name === 'Super Admin' || !user.name)) {
          user.name = profile.displayName;
        }
        await user.save();
        return user;
      }

      user = new this.userModel({
        oauthId: profile.id,
        email,
        name: profile.displayName,
      });
      await user.save();
      this.eventsGateway.emitUserCreated(user);
    }

    return user;
  }

  async findById(id: string): Promise<User> {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findPending(): Promise<User[]> {
    return this.userModel.find({ status: Status.PENDING }).exec();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }
  
  async findApprovedWithTelegram(): Promise<User[]> {
    return this.userModel.find({
      status: Status.APPROVED,
      role: Role.USER,
      telegramChatId: { $exists: true, $ne: null },
    }).exec();
  }

  async addAdmin(email: string): Promise<User> {
    email = email.toLowerCase();
    const existing = await this.userModel.findOne({ email });
    if (existing) {
      throw new BadRequestException('User already exists. Cannot promote an existing user to admin.');
    }
    const admin = new this.userModel({
      email,
      oauthId: `pending-admin:${email}`,
      name: 'Admin',
      role: Role.ADMIN,
      status: Status.APPROVED,
    });
    await admin.save();
    this.eventsGateway.emitUserCreated(admin);
    return admin;
  }

  async removeAdmin(id: string): Promise<User> {
    const admin = await this.userModel.findById(id);
    if (!admin) {
      throw new NotFoundException('User not found');
    }
    if (admin.role !== Role.ADMIN) {
      throw new BadRequestException('User is not an admin');
    }
    await this.userModel.findByIdAndDelete(id);
    return admin;
  }

  async linkTelegramChat(userId: string, chatId: string): Promise<User> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new BadRequestException('Invalid user link. Use Connect Now from the dashboard.');
    }

    const existing = await this.userModel.findById(userId);
    if (!existing) {
      throw new NotFoundException('User not found');
    }
    if (existing.role === Role.ADMIN) {
      throw new BadRequestException('Admin accounts cannot link Telegram.');
    }

    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { telegramChatId: chatId },
      { returnDocument: 'after' },
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    this.eventsGateway.emitUserUpdated(user);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      returnDocument: 'after',
    });
    if (!user) throw new NotFoundException('User not found');
    
    this.eventsGateway.emitUserUpdated(user);
    
    return user;
  }

  async updateRefreshToken(id: string, hashedToken: string | null): Promise<void> {
    await this.userModel.findByIdAndUpdate(id, { hashedRefreshToken: hashedToken });
  }
}
