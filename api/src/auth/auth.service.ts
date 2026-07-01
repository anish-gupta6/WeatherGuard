import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { OAuth2Client } from 'google-auth-library';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private oauth2Client: OAuth2Client;
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.oauth2Client = new OAuth2Client(
      this.configService.get<string>('GOOGLE_CLIENT_ID'),
      this.configService.get<string>('GOOGLE_CLIENT_SECRET'),
      this.configService.get<string>('GOOGLE_CALLBACK_URL'),
    );
  }

  getGoogleAuthUrl(): string {
    return this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['openid', 'email', 'profile'],
    });
  }

  private async fetchGoogleProfile(tokens: {
    id_token?: string | null;
    access_token?: string | null;
  }): Promise<{ id: string; emails: { value: string }[]; displayName: string }> {
    if (tokens.id_token) {
      const ticket = await this.oauth2Client.verifyIdToken({
        idToken: tokens.id_token,
        audience: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      });
      const payload = ticket.getPayload();
      if (!payload?.sub || !payload.email) {
        throw new UnauthorizedException('Invalid Google token payload');
      }
      return {
        id: payload.sub,
        emails: [{ value: payload.email }],
        displayName: payload.name || payload.email,
      };
    }

    if (tokens.access_token) {
      const { data } = await axios.get<{
        id: string;
        email: string;
        name?: string;
      }>('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      if (!data.id || !data.email) {
        throw new UnauthorizedException('Invalid Google userinfo response');
      }
      return {
        id: data.id,
        emails: [{ value: data.email }],
        displayName: data.name || data.email,
      };
    }

    throw new UnauthorizedException('Invalid Google token response');
  }

  async getGoogleUser(code: string): Promise<any> {
    try {
      const { tokens } = await this.oauth2Client.getToken(code);
      this.oauth2Client.setCredentials(tokens);
      return await this.fetchGoogleProfile(tokens);
    } catch (error) {
      this.logger.error(
        'Google authentication failed',
        error instanceof Error ? error.stack : error,
      );
      throw new UnauthorizedException('Failed to authenticate with Google');
    }
  }

  async getTokens(userId: string, role: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, role },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, role },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async updateRefreshTokenHash(userId: string, refreshToken: string | null) {
    if (refreshToken) {
      const hash = await bcrypt.hash(refreshToken, 10);
      await this.usersService.updateRefreshToken(userId, hash);
    } else {
      await this.usersService.updateRefreshToken(userId, null);
    }
  }

  async loginWithCode(code: string): Promise<{ accessToken: string; refreshToken: string }> {
    const profile = await this.getGoogleUser(code);
    const user = await this.usersService.findOrCreate(profile);
    const tokens = await this.getTokens(user._id.toString(), user.role);
    await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);
    return tokens;
  }

  async refreshTokens(refreshToken: string) {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const userId = payload.sub;

      const user = await this.usersService.findById(userId);
      if (!user || !user.hashedRefreshToken) {
        throw new UnauthorizedException('Access Denied');
      }

      const refreshTokenMatches = await bcrypt.compare(refreshToken, user.hashedRefreshToken);
      if (!refreshTokenMatches) {
        throw new UnauthorizedException('Access Denied');
      }

      const tokens = await this.getTokens(user._id.toString(), user.role);
      await this.updateRefreshTokenHash(user._id.toString(), tokens.refreshToken);
      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
