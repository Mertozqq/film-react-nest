import { Injectable } from '@nestjs/common';
import { FilmsMongoDbRepository } from 'src/films-mongo-db.repository/films-mongo-db.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsMongoDbRepository) {}
  async getFilms() {
    return this.filmsRepository.findAll();
  }
  async getSchedule(id: string) {
    return this.filmsRepository.findScheduleByFilmId(id);
  }
}
