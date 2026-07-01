import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { UsersService } from '../users/users.service';

@Injectable()
export class TelegramService implements OnApplicationBootstrap, OnModuleDestroy {
  private bot: Telegraf | null = null;
  private botUsername: string | null = null;
  private readonly logger = new Logger(TelegramService.name);

  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (token) {
      this.bot = new Telegraf(token);
    } else {
      this.logger.warn('TELEGRAM_BOT_TOKEN not set; Telegram bot disabled.');
    }
  }

  getBotUsername(): string | null {
    return this.botUsername;
  }

  onApplicationBootstrap() {
    if (!this.bot) return;

    this.bot.start(async (ctx) => {
      const payload = ctx.startPayload?.trim();
      const chatId = ctx.chat?.id?.toString();

      if (!chatId) {
        return ctx.reply('Unable to read your Telegram chat ID. Please try again.');
      }

      if (!payload) {
        return ctx.reply(
          'Welcome! Please use the "Connect Now" link from your WeatherGuard dashboard to link this chat.',
        );
      }

      try {
        const user = await this.usersService.linkTelegramChat(payload, chatId);
        await ctx.reply(
          'Success! Your WeatherGuard account has been linked to Telegram. You will now receive your weather alerts here.',
        );
      } catch (error) {
        this.logger.error(
          `Failed to link Telegram for user ${payload}`,
          error instanceof Error ? error.stack : error,
        );
        await ctx.reply(
          'Error linking your account. Open WeatherGuard, click "Connect Now", then press Start in this chat.',
        );
      }
    });

    void this.initializeBot();
  }

  private async initializeBot() {
    if (!this.bot) return;

    try {
      await this.bot.telegram.deleteWebhook({ drop_pending_updates: true });
      void this.bot.launch();
      const me = await this.bot.telegram.getMe();
      this.botUsername = me.username ?? null;
      this.logger.log(
        `Telegram bot initialized${this.botUsername ? ` as @${this.botUsername}` : ''}.`,
      );
    } catch (error) {
      this.logger.error(
        'Failed to initialize Telegram bot',
        error instanceof Error ? error.stack : error,
      );
    }
  }

  async onModuleDestroy() {
    if (this.bot) {
      await this.bot.stop();
    }
  }

  async sendMessage(chatId: string, message: string) {
    if (!this.bot) return;

    try {
      await this.bot.telegram.sendMessage(chatId, message, {
        parse_mode: 'HTML',
      });
    } catch (error) {
      this.logger.error(
        `Failed to send message to ${chatId}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }
}
