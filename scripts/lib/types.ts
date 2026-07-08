export interface SeedMovie {
  name: string;
  year: number;
  duration: number;
  director: string;
  description: string;
  img_url: string;
  genres: string[];
}

export interface SeedUser {
  email: string;
  name: string;
  last_name: string;
  password: string;
  role: 'user' | 'admin';
}

export interface SeedReview {
  userEmail: string;
  movieName: string;
  rating: number;
  review: string;
}

export interface SeedDataset {
  label: string;
  genres: string[];
  movies: SeedMovie[];
  users: SeedUser[];
  reviews: SeedReview[];
}
