import { Injectable, NotFoundException } from '@nestjs/common';
import { GetFilmDto } from '../films/dto/getFilm.dto'
import { GetFilmsDto } from '../films/dto/getFilms.dto'

import mongoose, { Model, Schema, Mongoose } from 'mongoose';
import { GetScheduleByFilmIdDto } from '../films/dto/getScheduleByFilmId.dto';

const ScheduleSchema = new Schema(
  {
    id: { type: String, required: true },
    daytime: { type: Date, required: true },
    hall: { type: Number, required: true },
    rows: { type: Number, required: true },
    seats: { type: Number, required: true },
    price: { type: Number, required: true },
    taken: { type: [String], default: [] },
  },
  {
    _id: false,
  },
);

export const FilmSchema = new Schema({
  id: { type: String, required: true },
  rating: { type: Number, required: true },
  director: { type: String, required: true },

  tags: { type: [String], default: [] },

  image: { type: String, required: true },
  cover: { type: String, required: true },

  title: { type: String, required: true },
  about: { type: String, required: true },
  description: { type: String, required: true },

  schedule: {
    type: [ScheduleSchema],
    default: [],
  },
});

const Film = mongoose.model('Film', FilmSchema)
export default Film;

@Injectable()
export class FilmsMongoDbRepository {
  constructor () {}
  private getFilmMapperFn(): (film: any) => GetFilmDto {
    return root => {
      const film = root.toObject();

      return {
        _id: film._id.toString(),
        id: film.id,
        rating: film.rating,
        director: film.director,
        tags: film.tags,
        image: film.image,
        cover: film.cover,
        title: film.title,
        about: film.about,
        description: film.description,
        schedule: film.schedule,
        };
    };
  }
  async findAll(): Promise<GetFilmsDto> {
    let items = await Film.find({})
    let total = await Film.countDocuments({})
    
    return {
      total: total,
      items: items.map(this.getFilmMapperFn())
    }
  }
  async findById(id: string): Promise<GetFilmDto> {
    let film = await Film.findOne({ id })
    if (!film) {
      throw new NotFoundException(`Фильм с id ${id} не найден`)
    }
    const mapper = this.getFilmMapperFn();
    return mapper(film)
  }

  async findScheduleByFilmId(id: string): Promise<GetScheduleByFilmIdDto> {
    const film = await this.findById(id);
    const length = film.schedule.length
    return {
      total: length,
      items: film.schedule
    };
  }
  
  async reservePlace(filmId: string, sessionId: string, place: string) {
    const result = await Film.updateOne(
      {
        id: filmId,
        'schedule.id': sessionId,
        'schedule.taken': { $ne: place },
      },
      {
        $push: {
          'schedule.$.taken': place,
        },
      },
    );

    return result.modifiedCount > 0;
  }

}