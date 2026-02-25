import {
  pgTable,
  uuid,
  text,
  boolean,
  integer,
  timestamp,
  foreignKey,
} from "drizzle-orm/pg-core";

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: text("name").notNull(),
    email: text("email"),
    twitterHandle: text("twitter_handle").notNull(),
    twitterId: text("twitter_id").unique().notNull(),
    profileImageUrl: text("profile_image_url").notNull(),
    referralCode: text("referral_code").unique().notNull(),
    referredBy: uuid("referred_by"),
    hasOnboarded: boolean("has_onboarded").default(false).notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.referredBy],
      foreignColumns: [table.id],
    }),
  ],
);

export const rooms = pgTable("rooms", {
  id: uuid("id").primaryKey().defaultRandom(),
  posterId: uuid("poster_id")
    .references(() => users.id)
    .notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  photoUrl: text("photo_url").notNull(),
  neighborhood: text("neighborhood").notNull(),
  priceRange: text("price_range").notNull(),
  roommateCount: integer("roommate_count").notNull(),
  isAvailable: boolean("is_available").default(true).notNull(),
  externalLink: text("external_link"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
