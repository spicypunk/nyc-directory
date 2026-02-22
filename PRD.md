# DirectoryNYC — Claude Code Prompt

## Overview
Build an invite-only NYC co-living community directory. Members join via referral links, authenticate with Twitter/X, and can browse housing listings and other members. This is a clone/adaptation of DirectorySF (https://directorysf.com).

## Tech Stack
- **Framework**: Next.js (App Router)
- **Database**: Neon (Postgres) with Drizzle ORM
- **Auth**: NextAuth.js (Auth.js) with Twitter/X provider
- **Hosting**: Vercel
- **Styling**: Tailwind CSS

## Visual Design (match DirectorySF exactly)
- Cream/beige paper-textured background (`#f5f0e1` or similar warm parchment tone)
- Rounded white/off-white cards with subtle shadows
- Dark green accent buttons (the "Contact me" and "Invite" buttons)
- Serif font for the site title ("DirectoryNYC"), clean sans-serif for body text
- Circular profile photos with colored ring borders
- Green dot indicator for availability status on room cards
- Tab navigation bar: `Rooms | Members` (pill-style, outlined when selected)
- Top nav: site title centered, Twitter icon, Invite button, user avatar with dropdown

## Database Schema (Neon/Postgres via Drizzle)

### users
- `id` — UUID, primary key
- `name` — text (display name from Twitter)
- `email` — text, nullable
- `twitter_handle` — text
- `twitter_id` — text, unique
- `profile_image_url` — text (from Twitter)
- `referral_code` — text, unique (auto-generated on account creation, format: numeric string like "700004020638521")
- `referred_by` — UUID, foreign key → users.id, nullable
- `joined_at` — timestamp, default now()

### rooms
- `id` — UUID, primary key
- `poster_id` — UUID, foreign key → users.id
- `title` — text (e.g. "Furnished Room (short-term) | 267 South Van Ness | Available Now")
- `description` — text (longer details about the room)
- `photo_url` — text (room photo, store in Vercel Blob or similar)
- `neighborhood` — text (e.g. "East Village", "Bushwick", "Williamsburg")
- `price_range` — enum or text (options: "< $1500", "$1500 - $1999", "$2000 - $2499", "$2500 - $2999", "$3000+")
- `roommate_count` — integer
- `is_available` — boolean, default true (green dot indicator)
- `external_link` — text, nullable (optional link to Notion page, listing, etc.)
- `created_at` — timestamp
- `updated_at` — timestamp

## Auth & Referral Flow
1. Existing member clicks "Invite" button → generates their unique referral link: `https://<vercel-domain>/?referralCode=<user.referral_code>`
2. New person visits the referral link → referral code is stored in a cookie/session
3. They see a landing/signup page with a "Sign in with Twitter" button
4. After Twitter OAuth, a new user record is created with `referred_by` set to the referrer's user ID (looked up from the referral code)
5. If someone visits the base URL without a referral code and isn't logged in, show a "You need an invite" page
6. Logged-in users access the directory at the base URL

## Pages & Routes

### Navigation Bar (persistent)
- **Header**: "DirectoryNYC" (centered, serif font), Twitter icon (links to community Twitter if applicable), "Invite" button (dark green), user avatar with dropdown (logout option)
- **Tab bar**: `Rooms` | `Members` (pill-style tabs)

### 1. Rooms Page (`/` or `/rooms`) — Default page
- **CTA banner** at top: "🏠 Have a group house, sublet, or vacant room? Add your space to be discovered by people looking for housing" with green "Add my space" button
- **Room cards** in a 3-column responsive grid, grouped by "Updated today", "Updated this week", etc.
- Each room card shows:
  - Circular room photo (left side)
  - Title (room type + address + availability)
  - Green dot if available
  - Poster's name (linked to their Twitter) with small avatar
  - "Contact me" dark green button — on click, shows a small popover with:
    - Copy email icon (copies poster's email to clipboard with toast confirmation)
    - Twitter icon (opens poster's Twitter profile in new tab)
  - External link icon (if `external_link` exists)
  - Description text with "See More" expand link
  - Bottom bar: 📍 Neighborhood, 💰 Price range, 👥 Roommate count

### 2. Members Page (`/members`)
- **Sort dropdown**: "Join date - Descending" (default), also allow ascending, alphabetical
- **Member count**: "X total members" displayed top-right
- **Member cards** in a 2-column responsive grid
- Each member card shows:
  - Circular profile photo (from Twitter)
  - Display name
  - "Referred by [Name]" — referrer name is clickable (could filter or scroll to that member)
  - 📅 Join month/year (e.g. "February 2026")
  - Twitter bird icon (right side) — links to their Twitter profile

### 3. Add Room Form (`/rooms/new` or modal)
- Form fields: title, description, photo upload, neighborhood (dropdown of NYC neighborhoods), price range (dropdown), roommate count, external link (optional)
- Only accessible to logged-in members

### 4. Invite Page / Referral Landing
- If visiting with `?referralCode=...` and not logged in: show a clean page with "You've been invited to DirectoryNYC by [Referrer Name]" and a "Sign in with Twitter" button
- If visiting without referral code and not logged in: show "DirectoryNYC is invite-only. Ask a member for an invite link."

### 5. Profile/Settings (optional, low priority)
- Let users update their email (for the "Contact me" feature)
- Edit/delete their own room listings

## Key Implementation Details

### Referral System
- On user creation, auto-generate a unique `referral_code` (use a numeric string or nanoid)
- The "Invite" button in the nav copies the user's referral link to clipboard with a toast notification
- Track referral chains: each user has a `referred_by` pointing to who invited them

### Auth Guards
- All pages except the referral landing require authentication
- Use NextAuth.js middleware to protect routes
- Store Twitter profile image URL and handle on sign-in

### Room Listing Management
- Members can create, edit, and delete their own listings
- Toggle availability (green dot on/off)
- Sort rooms by most recently updated

### Responsive Design
- Desktop: 3-col grid for rooms, 2-col for members
- Tablet: 2-col for rooms, 1-col for members
- Mobile: 1-col for everything

## NYC-Specific Neighborhoods (for dropdown)
Manhattan: East Village, West Village, Greenwich Village, SoHo, NoHo, Tribeca, Lower East Side, Chinatown, Financial District, Chelsea, Hell's Kitchen, Midtown, Upper East Side, Upper West Side, Harlem, Washington Heights, Inwood, Murray Hill, Gramercy, Flatiron, NoMad, Kips Bay

Brooklyn: Williamsburg, Bushwick, Greenpoint, Park Slope, Crown Heights, Bed-Stuy, DUMBO, Brooklyn Heights, Cobble Hill, Boerum Hill, Prospect Heights, Sunset Park, Bay Ridge, Flatbush, East Flatbush, Bensonhurst, Astoria (Queens but often grouped)

Queens: Astoria, Long Island City, Jackson Heights, Flushing, Sunnyside, Woodside, Ridgewood

Other: Jersey City, Hoboken

## File Structure (suggested)
```
src/
├── app/
│   ├── layout.tsx          # Root layout with nav
│   ├── page.tsx            # Rooms page (default)
│   ├── members/
│   │   └── page.tsx        # Members listing
│   ├── rooms/
│   │   └── new/
│   │       └── page.tsx    # Add room form
│   ├── api/
│   │   ├── auth/
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   ├── rooms/
│   │   │   └── route.ts    # CRUD for rooms
│   │   └── invite/
│   │       └── route.ts    # Generate/validate invite links
│   └── invite/
│       └── page.tsx        # Referral landing page
├── components/
│   ├── Navbar.tsx
│   ├── RoomCard.tsx
│   ├── MemberCard.tsx
│   ├── ContactPopover.tsx
│   └── AddRoomForm.tsx
├── db/
│   ├── schema.ts           # Drizzle schema
│   ├── index.ts            # Neon connection
│   └── migrations/
├── lib/
│   ├── auth.ts             # NextAuth config
│   └── utils.ts
└── middleware.ts            # Auth protection
```

## Environment Variables Needed
```
DATABASE_URL=              # Neon connection string
NEXTAUTH_SECRET=           # Random secret for NextAuth
NEXTAUTH_URL=              # Vercel deployment URL
TWITTER_CLIENT_ID=         # Twitter OAuth 2.0 client ID
TWITTER_CLIENT_SECRET=     # Twitter OAuth 2.0 client secret
```

## Build Order (suggested phases)
1. **Phase 1**: Project setup, database schema, NextAuth with Twitter, basic referral flow
2. **Phase 2**: Members page (list all users with referral info)
3. **Phase 3**: Rooms page (CRUD for room listings, card UI)
4. **Phase 4**: Invite system (generate links, copy to clipboard, landing page)
5. **Phase 5**: Polish (responsive design, paper texture background, animations, toast notifications)
