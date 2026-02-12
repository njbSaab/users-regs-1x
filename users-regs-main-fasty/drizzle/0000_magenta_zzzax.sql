CREATE TABLE "users" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"visitor_id" text NOT NULL,
	"client_ip" "inet",
	"name" text,
	"email" text,
	"browser_data" jsonb,
	"source" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "users_visitor_id_unique" UNIQUE("visitor_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
