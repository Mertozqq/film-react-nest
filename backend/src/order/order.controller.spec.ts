import { CreateOrderDto } from './dto/order.dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let createOrder: jest.Mock;

  beforeEach(() => {
    createOrder = jest.fn();

    const orderService = {
      createOrder,
    };

    controller = new OrderController(orderService as unknown as OrderService);
  });

  it('passes an order to the service and returns its result', async () => {
    const order: CreateOrderDto = {
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
    const result = {
      total: 1,
      items: order.tickets,
    };
    createOrder.mockResolvedValue(result);

    await expect(controller.create(order)).resolves.toBe(result);
    expect(createOrder).toHaveBeenCalledTimes(1);
    expect(createOrder).toHaveBeenCalledWith(order);
  });
});
