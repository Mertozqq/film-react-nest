import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Film } from '../films/entities/film.entity';
import { Schedule } from '../films/entities/schedule.entity';
import { GetFilmDto } from '../films/dto/getFilm.dto';
import { GetFilmsDto } from '../films/dto/getFilms.dto';
import { GetScheduleByFilmIdDto } from '../films/dto/getScheduleByFilmId.dto';
import { FilmsRepository } from './films.repository';

@Injectable()
export class AppRepository implements FilmsRepository {
  constructor(
    @InjectRepository(Film)
    private readonly filmsRepository: Repository<Film>,

    @InjectRepository(Schedule)
    private readonly schedulesRepository: Repository<Schedule>,
  ) {}

  async findAll(): Promise<GetFilmsDto> {
    const [films, total] = await this.filmsRepository.findAndCount({
      relations: {
        schedules: true,
      },
    });

    return {
      total,
      items: films.map((film) => this.mapFilm(film)),
    };
  }

  async findById(id: string): Promise<GetFilmDto> {
    const film = await this.filmsRepository.findOne({
      where: { id },
      relations: {
        schedules: true,
      },
    });

    if (!film) {
      throw new NotFoundException(`Фильм с id ${id} не найден`);
    }

    return this.mapFilm(film);
  }

  async findScheduleByFilmId(id: string): Promise<GetScheduleByFilmIdDto> {
    const film = await this.findById(id);

    return {
      total: film.schedule.length,
      items: film.schedule,
    };
  }

  async reservePlace(
    filmId: string,
    sessionId: string,
    place: string,
  ): Promise<boolean> {
    const schedule = await this.schedulesRepository.findOne({
      where: {
        id: sessionId,
        film: {
          id: filmId,
        },
      },
      relations: {
        film: true,
      },
    });

    if (!schedule) {
      return false;
    }

    const taken = this.parseArray(schedule.taken);

    if (taken.includes(place)) {
      return false;
    }

    taken.push(place);
    schedule.taken = taken.join(',');

    await this.schedulesRepository.save(schedule);

    return true;
  }

  private mapFilm(film: Film): GetFilmDto {
    return {
      _id: film.id,
      id: film.id,
      rating: film.rating,
      director: film.director,
      tags: this.parseArray(film.tags),
      image: film.image,
      cover: film.cover,
      title: film.title,
      about: film.about,
      description: film.description,
      schedule: film.schedules.map((schedule) => ({
        id: schedule.id,
        daytime: new Date(schedule.daytime),
        hall: schedule.hall,
        rows: schedule.rows,
        seats: schedule.seats,
        price: schedule.price,
        taken: this.parseArray(schedule.taken),
      })),
    };
  }

  private parseArray(value: string): string[] {
    if (!value) {
      return [];
    }

    return value.split(',').map((item) => item.trim());
  }
}