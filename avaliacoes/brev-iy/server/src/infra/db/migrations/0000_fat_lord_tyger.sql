CREATE TABLE "links" (
	"id" text PRIMARY KEY NOT NULL,
	"link_original" text NOT NULL,
	"link_encurtado" text NOT NULL,
	"criado_em" timestamp DEFAULT now() NOT NULL
);
