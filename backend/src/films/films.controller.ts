import { Controller, Get, Inject, Param } from '@nestjs/common';

import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(
    @Inject(FilmsService) private readonly filmsService: FilmsService,
  ) {}
  @Get('')
  public getFilms() {
    return this.filmsService.getFilms();
  }

  @Get('/:id/schedule')
  public getFilmById(@Param('id') id: string) {
    return this.filmsService.getSchedule(id);
  }
}
