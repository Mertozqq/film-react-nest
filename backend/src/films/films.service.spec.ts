import { AppRepository } from '../repository/app.repository';
import { FilmsService } from './films.service';

describe('FilmsService', () => {
  let service: FilmsService;
  let findAll: jest.Mock;
  let findScheduleByFilmId: jest.Mock;

  beforeEach(() => {
    findAll = jest.fn();
    findScheduleByFilmId = jest.fn();

    const repository = {
      findAll,
      findScheduleByFilmId,
    };

    service = new FilmsService(repository as unknown as AppRepository);
  });

  it('returns all films from the repository', async () => {
    const result = {
      total: 0,
      items: [],
    };
    findAll.mockResolvedValue(result);

    await expect(service.getFilms()).resolves.toBe(result);
    expect(findAll).toHaveBeenCalledTimes(1);
    expect(findAll).toHaveBeenCalledWith();
  });

  it('returns a film schedule by id from the repository', async () => {
    const result = {
      total: 0,
      items: [],
    };
    findScheduleByFilmId.mockResolvedValue(result);

    await expect(service.getSchedule('film-42')).resolves.toBe(result);
    expect(findScheduleByFilmId).toHaveBeenCalledTimes(1);
    expect(findScheduleByFilmId).toHaveBeenCalledWith('film-42');
  });
});
