export type ReferenceStickerAsset = {
  slug: string;
  name: string;
  stats: string;
  team: string;
  src: string;
  filename: string;
};

export const REFERENCE_STICKERS: ReferenceStickerAsset[] = [
  {
    slug: "raquel-aparecida",
    name: "Raquel Aparecida",
    stats: "10-10-2001 | 1,68m | 70 kg",
    team: "Brasil",
    src: "/social-proof/raquel-aparecida.png",
    filename: "raquel-aparecida.png",
  },
  {
    slug: "eu",
    name: "Eu",
    stats: "15-05-1998 | 1,75m | 72 kg",
    team: "Brasil",
    src: "/social-proof/eu.png",
    filename: "eu.png",
  },
  {
    slug: "luiz-felipe",
    name: "Luiz Felipe",
    stats: "09-02-1998 | 1,70m | 70 kg",
    team: "Brasil",
    src: "/social-proof/luiz-felipe.png",
    filename: "luiz-felipe.png",
  },
];
