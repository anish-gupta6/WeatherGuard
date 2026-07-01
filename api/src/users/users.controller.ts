import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from './schemas/user.schema';
import { WeatherService } from '../weather/weather.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly weatherService: WeatherService,
  ) {}

  @Get('me')
  getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Get('me/weather')
  async getMyWeather(@Request() req) {
    const user = await this.usersService.findById(req.user.id);
    if (!user.city) {
      throw new BadRequestException('City not set');
    }
    return this.weatherService.getWeatherDataForCity(user.city);
  }

  @Put('me/onboarding')
  updateCity(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(req.user.id, { city: updateUserDto.city });
  }

  @Get('pending')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getPendingUsers() {
    return this.usersService.findPending();
  }

  @Get('all')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  getAllUsers() {
    return this.usersService.findAll();
  }

  @Put(':id/status')
  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.SUPER_ADMIN)
  updateStatus(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, { status: updateUserDto.status });
  }

  @Post('admins')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  addAdmin(@Body('email') email: string) {
    if (!email) throw new BadRequestException('Email is required');
    return this.usersService.addAdmin(email);
  }

  @Delete('admins/:id')
  @UseGuards(RolesGuard)
  @Roles(Role.SUPER_ADMIN)
  removeAdmin(@Param('id') id: string) {
    return this.usersService.removeAdmin(id);
  }
}
