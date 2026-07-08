import type { SeedDataset } from '../lib/types';

export const minimalDataset: SeedDataset = {
  label: 'minimal',
  genres: [
    'Action',
    'Adventure',
    'Comedy',
    'Drama',
    'Fantasy',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
  ],
  movies: [
    {
      name: 'The Shawshank Redemption',
      year: 1994,
      duration: 142,
      director: 'Frank Darabont',
      description:
        'Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.',
      img_url: 'https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
      genres: ['Drama'],
    },
    {
      name: 'The Godfather',
      year: 1972,
      duration: 175,
      director: 'Francis Ford Coppola',
      description:
        'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.',
      img_url: 'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg',
      genres: ['Drama', 'Thriller'],
    },
    {
      name: 'The Dark Knight',
      year: 2008,
      duration: 152,
      director: 'Christopher Nolan',
      description:
        'Batman raises the stakes in his war on crime with the help of Lt. Gordon and District Attorney Harvey Dent.',
      img_url: 'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
      genres: ['Action', 'Drama', 'Thriller'],
    },
    {
      name: 'Pulp Fiction',
      year: 1994,
      duration: 154,
      director: 'Quentin Tarantino',
      description:
        'The lives of two mob hitmen, a boxer, and a pair of diner bandits intertwine in four tales of violence and redemption.',
      img_url: 'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg',
      genres: ['Drama', 'Thriller'],
    },
    {
      name: 'Inception',
      year: 2010,
      duration: 148,
      director: 'Christopher Nolan',
      description:
        'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.',
      img_url: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Jge.jpg',
      genres: ['Action', 'Sci-Fi', 'Thriller'],
    },
    {
      name: 'Parasite',
      year: 2019,
      duration: 132,
      director: 'Bong Joon-ho',
      description:
        'Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.',
      img_url: 'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1EAYZzNjSAumHf.jpg',
      genres: ['Drama', 'Thriller'],
    },
    {
      name: 'Spirited Away',
      year: 2001,
      duration: 125,
      director: 'Hayao Miyazaki',
      description:
        "During her family's move to the suburbs, a sullen 10-year-old wanders into a world ruled by gods, witches, and spirits.",
      img_url: 'https://image.tmdb.org/t/p/w500/39wmItIWsg5sZMyRUHLkWBcuVuC.jpg',
      genres: ['Adventure', 'Fantasy'],
    },
    {
      name: 'Get Out',
      year: 2017,
      duration: 104,
      director: 'Jordan Peele',
      description:
        "A young African-American visits his white girlfriend's parents for the weekend, where simmering uneasiness reaches a boiling point.",
      img_url: 'https://image.tmdb.org/t/p/w500/tFXcEccSQMf3lfhfXKSU9iRBpa3.jpg',
      genres: ['Horror', 'Mystery', 'Thriller'],
    },
  ],
  users: [
    {
      email: 'admin@cine-review.com',
      name: 'Admin',
      last_name: 'User',
      password: 'admin12345',
      role: 'admin',
    },
    {
      email: 'maria@cine-review.com',
      name: 'Maria',
      last_name: 'Silva',
      password: 'user12345',
      role: 'user',
    },
    {
      email: 'joao@cine-review.com',
      name: 'João',
      last_name: 'Santos',
      password: 'user12345',
      role: 'user',
    },
  ],
  reviews: [
    {
      userEmail: 'maria@cine-review.com',
      movieName: 'Inception',
      rating: 5,
      review: 'Mind-bending masterpiece. Nolan at his best.',
    },
    {
      userEmail: 'joao@cine-review.com',
      movieName: 'Inception',
      rating: 4,
      review: 'Great concept, a bit confusing on first watch.',
    },
    {
      userEmail: 'maria@cine-review.com',
      movieName: 'Parasite',
      rating: 5,
      review: 'Brilliant social commentary wrapped in thriller.',
    },
    {
      userEmail: 'joao@cine-review.com',
      movieName: 'The Dark Knight',
      rating: 5,
      review: "Heath Ledger's Joker is unforgettable.",
    },
    {
      userEmail: 'admin@cine-review.com',
      movieName: 'The Shawshank Redemption',
      rating: 5,
      review: 'A timeless story about hope and friendship.',
    },
    {
      userEmail: 'maria@cine-review.com',
      movieName: 'Spirited Away',
      rating: 5,
      review: "Miyazaki's imagination knows no bounds.",
    },
  ],
};
