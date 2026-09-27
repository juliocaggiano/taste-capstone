export type CreateArtistOption = {
  id: string;
  name: string;
  detail: string;
  aliases?: readonly string[];
  inTaste?: boolean;
};

// These reference identities are searchable in Create only. They are not Taste artwork or profile records.
// Caravaggio: https://www.metmuseum.org/es/essays/caravaggio-michelangelo-merisi-1571-1610-and-his-followers
// Bruegel the Elder: https://www.metmuseum.org/de/essays/pieter-bruegel-the-elder-ca-1525-1569
// Brueghel the Younger: https://www.nga.gov/artists/3627-pieter-brueghel-younger
export const CREATE_REFERENCE_ARTISTS: readonly CreateArtistOption[] = [
  {
    id: "caravaggio",
    name: "Caravaggio",
    detail: "Michelangelo Merisi · 1571–1610",
    aliases: ["Michelangelo Merisi", "Michelangelo Merisi da Caravaggio"],
  },
  {
    id: "pieter-bruegel-elder",
    name: "Pieter Bruegel the Elder",
    detail: "c. 1525–1569",
    aliases: ["Pieter Bruegel", "Pieter Bruegel I", "Pieter Brueghel"],
  },
  {
    id: "pieter-brueghel-younger",
    name: "Pieter Brueghel the Younger",
    detail: "c. 1564–1637/38",
    aliases: ["Pieter Bruegel", "Pieter Bruegel II", "Pieter Brueghel"],
  },
];

function normalize(value: string): string {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase().trim().replace(/\s+/g, " ");
}

export function searchCreateArtists(query: string, artists: readonly CreateArtistOption[], limit = 6): CreateArtistOption[] {
  const normalized = normalize(query);
  if (!normalized) return artists.slice(0, 4);
  const terms = normalized.split(" ");
  return artists
    .filter((artist) => terms.every((term) => normalize([artist.name, artist.detail, ...(artist.aliases ?? [])].join(" ")).includes(term)))
    .sort((a, b) => {
      const aName = normalize(a.name);
      const bName = normalize(b.name);
      const aRank = aName === normalized ? 0 : aName.startsWith(normalized) ? 1 : 2;
      const bRank = bName === normalized ? 0 : bName.startsWith(normalized) ? 1 : 2;
      return aRank - bRank || aName.localeCompare(bName);
    })
    .slice(0, limit);
}
