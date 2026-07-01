import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { UsersService } from '../users/users.service';
import { TelegramService } from '../telegram/telegram.service';
import { WeatherService } from '../weather/weather.service';

@Injectable()
export class CronService implements OnApplicationBootstrap {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private usersService: UsersService,
    private telegramService: TelegramService,
    private weatherService: WeatherService,
  ) {}

  onApplicationBootstrap() {
    void this.dispatchWeatherAlerts('startup');
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleHourlyWeatherAlerts() {
    await this.dispatchWeatherAlerts('hourly');
  }

  private async dispatchWeatherAlerts(trigger: 'startup' | 'hourly') {
    this.logger.log(`Starting weather alerts dispatch (${trigger})...`);

    const users = await this.usersService.findApprovedWithTelegram();
    if (users.length === 0) {
      this.logger.log('No eligible users found for weather alerts.');
      return;
    }

    for (const user of users) {
      if (!user.city || !user.telegramChatId) continue;

      const weatherReport = await this.weatherService.getWeatherForCity(user.city);
      await this.telegramService.sendMessage(
        user.telegramChatId,
        `Hello, ${user.name}!\n\n${weatherReport}`,
      );

      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    this.logger.log(`Finished dispatching weather alerts (${trigger}).`);
  }
}
