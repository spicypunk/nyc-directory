export const NEIGHBORHOODS = {
  Manhattan: [
    "East Village",
    "West Village",
    "Greenwich Village",
    "SoHo",
    "NoHo",
    "Tribeca",
    "Lower East Side",
    "Chinatown",
    "Financial District",
    "Chelsea",
    "Hell's Kitchen",
    "Midtown",
    "Upper East Side",
    "Upper West Side",
    "Harlem",
    "Washington Heights",
    "Inwood",
    "Murray Hill",
    "Gramercy",
    "Flatiron",
    "NoMad",
    "Kips Bay",
  ],
  Brooklyn: [
    "Williamsburg",
    "Bushwick",
    "Greenpoint",
    "Park Slope",
    "Crown Heights",
    "Bed-Stuy",
    "DUMBO",
    "Brooklyn Heights",
    "Cobble Hill",
    "Boerum Hill",
    "Prospect Heights",
    "Sunset Park",
    "Bay Ridge",
    "Flatbush",
    "East Flatbush",
    "Bensonhurst",
  ],
  Queens: [
    "Astoria",
    "Long Island City",
    "Jackson Heights",
    "Flushing",
    "Sunnyside",
    "Woodside",
    "Ridgewood",
  ],
  Other: ["Jersey City", "Hoboken"],
} as const;

export type Borough = keyof typeof NEIGHBORHOODS;

export type Neighborhood =
  (typeof NEIGHBORHOODS)[Borough][number];

/** Flat list of all neighborhoods */
export const ALL_NEIGHBORHOODS = Object.values(NEIGHBORHOODS).flat();
