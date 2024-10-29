CREATE TABLE IF NOT EXISTS "anecdotes" (
	"id" serial PRIMARY KEY NOT NULL,
	"content" text NOT NULL,
	"votes" integer NOT NULL
);
