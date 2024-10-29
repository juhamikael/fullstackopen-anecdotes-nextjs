import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const anecdotesTable = pgTable('anecdotes', {
    id: serial('id').primaryKey(),
    content: text('content').notNull(),
    topic: text('topic').notNull(),
    votes: integer('votes').notNull(),
    generatedWithAI: boolean('generated_with_ai').notNull().default(false),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type InsertAnecdote = typeof anecdotesTable.$inferInsert;
export type SelectAnecdote = typeof anecdotesTable.$inferSelect;
