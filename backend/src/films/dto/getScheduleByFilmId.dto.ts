interface Schedule {
  id: string;
  daytime: Date;
  hall: number;
  rows: number;
  seats: number;
  price: number;
  taken: string[];
}

export class GetScheduleByFilmIdDto {
  total: number;
  items: Schedule[];
}
