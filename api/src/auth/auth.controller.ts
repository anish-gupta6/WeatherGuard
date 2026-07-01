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
  async googleAuthRedirect(@Query('code') code: string, @Res({ passthrough: true }) res: Response) {
    if (!code) {
      throw new UnauthorizedException('No authorization code provided');
    }

    try {
      const tokens = await this.authService.loginWithCode(code);

      const frontendUrl = this.configService.get<string>('FRONTEND_URL');
      
      const isProduction = process.env.NODE_ENV === 'production';
      
      res.cookie('access_token', tokens.accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 15 * 60 * 1000, // 15 minutes
      });

      res.cookie('refresh_token', tokens.refreshToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(HttpStatus.FOUND).redirect(`${frontendUrl}/auth-success`);
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
  async refreshTokens(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token missing');
    }

    const tokens = await this.authService.refreshTokens(refreshToken);

    const isProduction = process.env.NODE_ENV === 'production';
      
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return { 
      message: 'Tokens refreshed' 
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = req['user'];
    if (user && user.id) {
      await this.authService.updateRefreshTokenHash(user.id, null);
    }

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return { message: 'Logged out successfully' };
  }
}
