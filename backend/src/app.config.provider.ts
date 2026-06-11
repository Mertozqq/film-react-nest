import { ConfigModule, ConfigService } from '@nestjs/config';

export const configProvider = {
  imports: [ConfigModule.forRoot()],
  provide: 'CONFIG',
  inject: [ConfigService],
  useFactory: async (configService: ConfigService): Promise<AppConfig> => {
    const config = {
      database: {
        driver: configService.get<string>('DATABASE_DRIVER') || 'postgres',
        url:
          configService.get<string>('DATABASE_URL') ||
          'postgres://localhost:5432/prac',
        username: configService.get<string>('DATABASE_USERNAME') || 'prac',
        password: configService.get<string>('DATABASE_PASSWORD') || 'prac',
      },
    };


    return config;
  },
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}
