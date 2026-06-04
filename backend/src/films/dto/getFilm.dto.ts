
  interface Schedule {
  id: string,
  daytime: Date,
  hall: number,
  rows: number,
  seats: number,
  price: number,
  taken: string[]
}

export class GetFilmDto {
  _id: string;
  id: string;
  rating: number;
  director: string;
  tags: string[];
  image: string;
  cover: string;
  title: string;
  about: string;
  description: string;
  schedule: Schedule[]
}
