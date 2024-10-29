import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    config({ path: '.env' });
}

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

export const db = drizzle(process.env.DATABASE_URL);
