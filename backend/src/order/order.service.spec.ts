import {
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AppRepository } from '../repository/app.repository';
import { CreateOrderDto } from './dto/order.dto';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;
  let findById: jest.Mock;
  let reservePlace: jest.Mock;
  let order: CreateOrderDto;

  beforeEach(() => {
    findById = jest.fn();
    reservePlace = jest.fn();

    const repository = {
      findById,
      reservePlace,
    };

    service = new OrderService(repository as unknown as AppRepository);
    order = {
      email: 'user@example.com',
      phone: '+79990000000',
      tickets: [
        {
          film: 'film-42',
          session: 'session-7',
          daytime: '2026-06-30T12:00:00.000Z',
          row: 3,
          seat: 8,
          price: 500,
        },
      ],
    };
  });

  it('reserves tickets and returns the order result', async () => {
    findById.mockResolvedValue({
      schedule: [
        {
          id: 'session-7',
          taken: [],
        },
      ],
    });
    reservePlace.mockResolvedValue(true);

    await expect(service.createOrder(order)).resolves.toEqual({
      total: 1,
      items: order.tickets,
    });
    expect(findById).toHaveBeenCalledWith('film-42');
    expect(reservePlace).toHaveBeenCalledWith(
      'film-42',
      'session-7',
      '3:8',
    );
  });

  it('throws when the session does not exist', async () => {
    findById.mockResolvedValue({
      schedule: [],
    });

    await expect(service.createOrder(order)).rejects.toThrow(
      NotFoundException,
    );
    expect(reservePlace).not.toHaveBeenCalled();
  });

  it('throws when the place is already taken', async () => {
    findById.mockResolvedValue({
      schedule: [
        {
          id: 'session-7',
          taken: ['3:8'],
        },
      ],
    });

    await expect(service.createOrder(order)).rejects.toThrow(
      BadRequestException,
    );
    expect(reservePlace).not.toHaveBeenCalled();
  });

  it('throws when the repository cannot reserve the place', async () => {
    findById.mockResolvedValue({
      schedule: [
        {
          id: 'session-7',
          taken: [],
        },
      ],
    });
    reservePlace.mockResolvedValue(false);

    await expect(service.createOrder(order)).rejects.toThrow(
      BadRequestException,
    );
    expect(reservePlace).toHaveBeenCalledWith(
      'film-42',
      'session-7',
      '3:8',
    );
  });
});
