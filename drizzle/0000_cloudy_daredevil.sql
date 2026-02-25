CREATE TABLE "rooms" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"poster_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"photo_url" text NOT NULL,
	"neighborhood" text NOT NULL,
	"price_range" text NOT NULL,
	"roommate_count" integer NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"external_link" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"twitter_handle" text NOT NULL,
	"twitter_id" text NOT NULL,
	"profile_image_url" text NOT NULL,
	"referral_code" text NOT NULL,
	"referred_by" uuid,
	"has_onboarded" boolean DEFAULT false NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_twitter_id_unique" UNIQUE("twitter_id"),
	CONSTRAINT "users_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_poster_id_users_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_referred_by_users_id_fk" FOREIGN KEY ("referred_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;