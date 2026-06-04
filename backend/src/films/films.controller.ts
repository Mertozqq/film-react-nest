import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor (private readonly FilmsService: FilmsService) {}
  @Get('')
  public getFilms() {
    return this.FilmsService.getFilms();
  }

  @Get('/:id/schedule')
  public getFilmById(@Param('id') id: string) {
    return this.FilmsService.getSchedule(id)
  }
}
