import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { FilmsMongoDbRepository } from '../films-mongo-db.repository/films-mongo-db.repository';
import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsMongoDbRepository) {}

  async createOrder(order: CreateOrderDto): Promise<OrderResponseDto> {
    const reservedTickets = [];

    for (const ticket of order.tickets) {
      const film = await this.filmsRepository.findById(ticket.film);
      const session = film.schedule.find((item) => item.id === ticket.session);

      if (!session) {
        throw new NotFoundException(`Session ${ticket.session} not found`);
      }

      const place = `${ticket.row}:${ticket.seat}`;

      if (session.taken.includes(place)) {
        throw new BadRequestException(`Place ${place} is already taken`);
      }

      const reserved = await this.filmsRepository.reservePlace(
        ticket.film,
        ticket.session,
        place,
      );

      if (!reserved) {
        throw new BadRequestException(`Place ${place} is already taken`);
      }

      reservedTickets.push(ticket);
    }

    return {
      total: reservedTickets.length,
      items: reservedTickets,
    };
  }
}
