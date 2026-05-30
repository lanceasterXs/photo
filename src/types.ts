export interface PhotoEntry {
  full: string;
  thumb: string;
}

export interface PhotoManifest {
  hero: string[];
  categories: {
    portraits: PhotoEntry[];
    'still-life': PhotoEntry[];
    landscapes: PhotoEntry[];
  };
}

export type Category = 'all' | 'portraits' | 'still-life' | 'landscapes';

export type Theme = 'light' | 'dark';
