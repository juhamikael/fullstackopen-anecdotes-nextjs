ALTER TABLE "anecdotes" ADD COLUMN "generated_with_ai" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "anecdotes" ADD COLUMN "created_at" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "anecdotes" ADD COLUMN "updated_at" timestamp DEFAULT now() NOT NULL;