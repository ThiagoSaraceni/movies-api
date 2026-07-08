import { Sequelize, QueryTypes } from 'sequelize';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import type { SeedDataset } from './types';

export async function runSeed(sequelize: Sequelize, dataset: SeedDataset) {
  await sequelize.authenticate();
  console.log('✓ Conectado ao banco de dados');

  const schemaPath = path.resolve(__dirname, '../../supabase/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  await sequelize.query(schema);
  console.log('✓ Schema aplicado');

  for (const genreName of dataset.genres) {
    await sequelize.query(
      `INSERT INTO genres (name) VALUES (:name) ON CONFLICT (name) DO NOTHING`,
      { replacements: { name: genreName } },
    );
  }
  console.log(`✓ ${dataset.genres.length} gêneros processados`);

  const genreRows = await sequelize.query<{ id: number; name: string }>(
    'SELECT id, name FROM genres',
    { type: QueryTypes.SELECT },
  );
  const genreMap = new Map(genreRows.map((r) => [r.name, r.id]));

  for (const movie of dataset.movies) {
    const existing = await sequelize.query<{ id: number }>(
      'SELECT id FROM movies WHERE name = :name',
      { type: QueryTypes.SELECT, replacements: { name: movie.name } },
    );

    let movieId = existing[0]?.id;

    if (!movieId) {
      const inserted = await sequelize.query<{ id: number }>(
        `INSERT INTO movies (name, year, duration, director, description, img_url, created_at, updated_at)
         VALUES (:name, :year, :duration, :director, :description, :img_url, NOW(), NOW())
         RETURNING id`,
        {
          type: QueryTypes.SELECT,
          replacements: movie,
        },
      );
      movieId = inserted[0]?.id;
    }

    for (const genreName of movie.genres) {
      const genreId = genreMap.get(genreName);
      if (genreId && movieId) {
        await sequelize.query(
          `INSERT INTO movie_genres (movie_id, genre_id) VALUES (:movieId, :genreId) ON CONFLICT DO NOTHING`,
          { replacements: { movieId, genreId } },
        );
      }
    }
  }
  console.log(`✓ ${dataset.movies.length} filmes processados`);

  const userMap = new Map<string, number>();
  for (const user of dataset.users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    const inserted = await sequelize.query<{ id: number }>(
      `INSERT INTO users (email, name, last_name, password, role, created_at, updated_at)
       VALUES (:email, :name, :last_name, :password, :role, NOW(), NOW())
       ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      {
        type: QueryTypes.SELECT,
        replacements: { ...user, password: hashedPassword },
      },
    );

    let userId = inserted[0]?.id;
    if (!userId) {
      const existing = await sequelize.query<{ id: number }>(
        'SELECT id FROM users WHERE email = :email',
        { type: QueryTypes.SELECT, replacements: { email: user.email } },
      );
      userId = existing[0]?.id;
    }
    if (userId) userMap.set(user.email, userId);
  }
  console.log(`✓ ${dataset.users.length} usuários processados`);

  const movieRows = await sequelize.query<{ id: number; name: string }>(
    'SELECT id, name FROM movies',
    { type: QueryTypes.SELECT },
  );
  const movieMap = new Map(movieRows.map((r) => [r.name, r.id]));

  let reviewCount = 0;
  for (const review of dataset.reviews) {
    const userId = userMap.get(review.userEmail);
    const movieId = movieMap.get(review.movieName);
    if (!userId || !movieId) continue;

    await sequelize.query(
      `INSERT INTO movie_reviews (user_id, movie_id, review, rating, created_at, updated_at)
       VALUES (:userId, :movieId, :review, :rating, NOW(), NOW())
       ON CONFLICT (user_id, movie_id) DO UPDATE SET review = EXCLUDED.review, rating = EXCLUDED.rating`,
      {
        replacements: {
          userId,
          movieId,
          review: review.review,
          rating: review.rating,
        },
      },
    );
    reviewCount++;
  }
  console.log(`✓ ${reviewCount} reviews processadas`);

  console.log(`\n--- Seed "${dataset.label}" concluído ---`);
  console.log('Admin: admin@cine-review.com / admin12345');
  console.log('User:  maria@cine-review.com / user12345');
}
