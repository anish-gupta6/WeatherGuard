import { Module } from '@nestjs/common';
import { CronService } from './cron.service';
import { UsersModule } from '../users/users.module';
import { TelegramModule } from '../telegram/telegram.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [UsersModule, TelegramModule, WeatherModule],
  providers: [CronService],
})
export class CronModule {}
