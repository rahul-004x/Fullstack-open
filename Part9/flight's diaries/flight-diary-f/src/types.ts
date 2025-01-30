export enum Weather {
  Sunny = 'sunny',
  Rainy = 'rainy',
  Cloudy = 'cloudy',
  Stormy = 'stormy'
}

export enum Visibility {
  Great = 'great',
  Good = 'good',
  Ok = 'ok',
  Poor = 'poor'
}

export interface Diaries {
  id: string,
  date: string,
  weather: Weather,
  visibility: Visibility,
  comment?: string,
}

export type DiariesFromValues = Omit<Diaries, 'comment'>;
export type AddDataType = Omit<Diaries, 'id'>;
