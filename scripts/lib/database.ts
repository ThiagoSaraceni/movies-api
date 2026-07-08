import { Sequelize } from 'sequelize';
import * as fs from 'fs';
import * as path from 'path';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

export function loadEnv() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
  } catch {
    // dotenv opcional
  }
}

export async function createSequelize(): Promise<Sequelize> {
  const databaseUrl = process.env.DATABASE_URL;
  const useSsl =
    process.env.DB_SSL === 'true' ||
    databaseUrl?.includes('supabase') ||
    process.env.DB_HOST?.includes('supabase');

  if (databaseUrl) {
    const parsed = new URL(databaseUrl);
    const hostname = parsed.hostname;

    if (hostname.startsWith('db.') && hostname.endsWith('.supabase.co')) {
      throw new Error(
        'Use o pooler do Supabase (porta 6543) no WSL, não db.*.supabase.co',
      );
    }

    let host = process.env.DB_HOST_IPV4 || hostname;
    if (!process.env.DB_HOST_IPV4 && hostname.includes('pooler.supabase.com')) {
      const addresses = await dns.promises.resolve4(hostname);
      host = addresses[0];
      console.log(`[db] ${hostname} → ${host} (IPv4)`);
    }

    return new Sequelize({
      dialect: 'postgres',
      host,
      port: Number(parsed.port) || 5432,
      username: decodeURIComponent(parsed.username),
      password: decodeURIComponent(parsed.password),
      database: parsed.pathname.replace(/^\//, '') || 'postgres',
      logging: false,
      dialectOptions: {
        ssl: useSsl ? { require: true, rejectUnauthorized: false } : false,
      },
    });
  }

  const hostname = process.env.DB_HOST || 'localhost';
  let host = process.env.DB_HOST_IPV4 || hostname;

  if (!process.env.DB_HOST_IPV4 && hostname.includes('pooler.supabase.com')) {
    const addresses = await dns.promises.resolve4(hostname);
    host = addresses[0];
    console.log(`[db] ${hostname} → ${host} (IPv4)`);
  }

  return new Sequelize({
    dialect: 'postgres',
    host,
    port: Number(process.env.DB_PORT) || 8888,
    username: process.env.DB_USER || 'pgadmin',
    password: process.env.DB_PASSWORD || 'pgadmin',
    database: process.env.DB_NAME || 'movies_db',
    logging: false,
    dialectOptions: {
      ssl: useSsl ? { require: true, rejectUnauthorized: false } : false,
    },
  });
}

export async function runSchema(sequelize: Sequelize) {
  const schemaPath = path.resolve(__dirname, '../../supabase/schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf-8');
  await sequelize.query(schema);
}
