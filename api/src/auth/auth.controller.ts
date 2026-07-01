import { Controller, Get, Logger, Query, Res, Req, Post, UnauthorizedException, HttpCode, HttpStatus, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) { }

  @Get('google')
  async googleAuth(@Res() res: Response) {
    const url = this.authService.getGoogleAuthUrl();
    res.redirect(url);
  }

  @Get('google/callback')
  async googleAuthRedirect(@Query('code') code: string, @Res() res: Response) {
    if (!code) {
      throw new UnauthorizedException('No authorization code provided');
    }

    try {
      const tokens = await this.authService.loginWithCode(code);

      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      res.redirect(`${frontendUrl}/auth-success?accessToken=${tokens.accessToken}&refreshToken=${tokens.refreshToken}`);
    } catch (error) {
      this.logger.error(
        'OAuth callback failed',
        error instanceof Error ? error.stack : error,
      );
      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      res.status(HttpStatus.FOUND).redirect(`${frontendUrl}/login?error=auth_failed`);
    }
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshTokens(@Body('refreshToken') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    return { 
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: 'Tokens refreshed' 
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request) {
    const user = req['user'];
    if (user && user.id) {
      await this.authService.updateRefreshTokenHash(user.id, null);
    }

    return { message: 'Logged out successfully' };
  }
}
