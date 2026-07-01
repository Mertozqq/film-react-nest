import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let getFilms: jest.Mock;
  let getSchedule: jest.Mock;

  beforeEach(() => {
    getFilms = jest.fn();
    getSchedule = jest.fn();

    const filmsService = {
      getFilms,
      getSchedule,
    };

    controller = new FilmsController(
      filmsService as unknown as FilmsService,
    );
  });

  it('returns films from the service', async () => {
    const result = {
      total: 0,
      items: [],
    };
    getFilms.mockResolvedValue(result);

    await expect(controller.getFilms()).resolves.toBe(result);
    expect(getFilms).toHaveBeenCalledTimes(1);
    expect(getFilms).toHaveBeenCalledWith();
  });

  it('returns a film schedule by id', async () => {
    const result = {
      total: 0,
      items: [],
    };
    getSchedule.mockResolvedValue(result);

    await expect(controller.getFilmById('film-42')).resolves.toBe(result);
    expect(getSchedule).toHaveBeenCalledTimes(1);
    expect(getSchedule).toHaveBeenCalledWith('film-42');
  });
});
