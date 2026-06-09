import { Injectable } from '@nestjs/common';
import { AppRepository } from '../repository/app.repository';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: AppRepository) {}
  async getFilms() {
    return this.filmsRepository.findAll();
  }
  async getSchedule(id: string) {
    return this.filmsRepository.findScheduleByFilmId(id);
  }
}
