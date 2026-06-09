import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { AppRepository } from './app.repository';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: configService.get<string>('DATABASE_DRIVER') as 'postgres',
        url: configService.get<string>('DATABASE_URL'),
        username: configService.get<string>('DATABASE_USERNAME'),
        password: configService.get<string>('DATABASE_PASSWORD'),
        entities: [Film, Schedule],
        synchronize: true,
      }),
    }),

    TypeOrmModule.forFeature([Film, Schedule]),
  ],
  providers: [AppRepository],
  exports: [TypeOrmModule, AppRepository],
})
export class RepositoryModule {}