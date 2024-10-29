import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
    config({ path: '.env' });
}

if (!process.env.DATABASE_URL) {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('DATABASE_URL is not set');
    }
    console.warn('DATABASE_URL is not set. Using dummy URL for build process.');
}

export const db = drizzle(process.env.DATABASE_URL!);
