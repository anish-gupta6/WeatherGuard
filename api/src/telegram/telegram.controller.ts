import {
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @Get('bot')
  getBotInfo() {
    const username = this.telegramService.getBotUsername();
    if (!username) {
      throw new NotFoundException('Telegram bot is not configured');
    }
    return { username };
  }
}
