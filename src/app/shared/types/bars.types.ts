export interface Bar {
  t: string; // timestamp ISO string
  o: number; // open
  h: number; // high
  l: number; // low
  c: number; // close
  v: number; // volume
}

export type TimeUnit = 'minute' | 'hour' | 'day' | 'year';

export type BarsModeType = 'countBack' | 'dateRange' | 'timeBack';
