import { ConfigModule, ConfigService } from '@nestjs/config';
import mongoose from 'mongoose';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<AppConfig> => {
    const config = {
      database: {
        driver: configService.get<string>('DATABASE_DRIVER') || 'mongodb',
        url:
          configService.get<string>('DATABASE_URL') ||
          'mongodb://127.0.0.1:27017/afisha',
      },
    };

    await mongoose.connect(config.database.url);

    return config;
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
