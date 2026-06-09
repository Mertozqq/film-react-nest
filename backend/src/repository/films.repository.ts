import { GetFilmDto } from '../films/dto/getFilm.dto';
import { GetFilmsDto } from '../films/dto/getFilms.dto';
import { GetScheduleByFilmIdDto } from '../films/dto/getScheduleByFilmId.dto';

export interface FilmsRepository {
  findAll(): Promise<GetFilmsDto>;
  findById(id: string): Promise<GetFilmDto>;
  findScheduleByFilmId(id: string): Promise<GetScheduleByFilmIdDto>;
  reservePlace(
    filmId: string,
    sessionId: string,
    place: string,
  ): Promise<boolean>;
}