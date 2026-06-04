interface Schedule {
  id: string;
  daytime: Date;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class GetFilmsDto {
  total: number;
  items: {
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
    schedule: Schedule[];
  }[];
}
