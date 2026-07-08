import { ConfigService } from '@nestjs/config';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

export interface ParsedDatabaseUrl {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
}

export function parseDatabaseUrl(databaseUrl: string): ParsedDatabaseUrl {
  const parsed = new URL(databaseUrl);

  return {
    host: parsed.hostname,
    port: Number(parsed.port) || 5432,
    username: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '') || 'postgres',
  };
}

export function isIpv4Address(host: string): boolean {
  return /^\d+\.\d+\.\d+\.\d+$/.test(host);
}

export function isSupabaseDirectHost(host: string): boolean {
  return host.startsWith('db.') && host.endsWith('.supabase.co');
}

export function assertSupabaseConnectionForWsl(host: string): void {
  if (!isSupabaseDirectHost(host)) return;

  throw new Error(
    [
      'Conexão Direct do Supabase (db.*.supabase.co) usa apenas IPv6.',
      'No WSL isso falha com ENETUNREACH, mesmo que o DBeaver no Windows funcione.',
      '',
      'Use a connection string do POOLER:',
      '  Supabase → Settings → Database → Connection string → Transaction (porta 6543)',
      '',
      'Exemplo:',
      '  DATABASE_URL=postgresql://postgres.[ref]:[senha]@aws-0-[regiao].pooler.supabase.com:6543/postgres',
      '  DB_SSL=true',
    ].join('\n'),
  );
}

export async function resolveConnectionHost(
  hostname: string,
  manualIpv4?: string,
): Promise<string> {
  if (manualIpv4) return manualIpv4;
  if (isIpv4Address(hostname)) return hostname;

  assertSupabaseConnectionForWsl(hostname);

  try {
    const addresses = await dns.promises.resolve4(hostname);
    if (addresses.length) {
      console.log(`[db] ${hostname} → ${addresses[0]} (IPv4)`);
      return addresses[0];
    }
  } catch {
    // segue com hostname original (ex: localhost)
  }

  return hostname;
}

export function isSupabaseHost(hostOrUrl?: string): boolean {
  if (!hostOrUrl) return false;
  return (
    hostOrUrl.includes('supabase.co') || hostOrUrl.includes('pooler.supabase.com')
  );
}

export function getPostgresDialectOptions(
  config: ConfigService | NodeJS.ProcessEnv,
  hostOrUrl?: string,
) {
  const get = (key: string) =>
    config instanceof ConfigService ? config.get<string>(key) : config[key];

  const useSsl = get('DB_SSL') === 'true' || isSupabaseHost(hostOrUrl);

  return {
    ssl: useSsl ? { require: true, rejectUnauthorized: false } : false,
  };
}
