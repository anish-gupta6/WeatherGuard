import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface WeatherData {
  city: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  description: string;
  icon: string;
}

@Injectable()
export class WeatherService {
  private readonly apiKey: string;
  private readonly logger = new Logger(WeatherService.name);

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('OPENWEATHER_API_KEY') || '';
  }

  async getWeatherDataForCity(city: string): Promise<WeatherData> {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${this.apiKey}&units=metric`,
    );
    const data = response.data;
    return {
      city: data.name,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
    };
  }

  async getWeatherForCity(city: string): Promise<string> {
    try {
      const data = await this.getWeatherDataForCity(city);
      return `🌡️ <b>${data.city} Weather</b>\nTemp: ${data.temp}°C\nConditions: ${data.description}`;
    } catch (error) {
      this.logger.error(`Failed to fetch weather for city: ${city}`, error.message);
      return `⚠️ Unable to fetch weather for ${city} at this time.`;
    }
  }
}
