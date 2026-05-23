export type PackType = "individual" | "dupla" | "familia";

export type PackConfig = {
  type: PackType;
  title: string;
  shortTitle: string;
  count: number;
  priceCents: number;
  priceLabel: string;
  savingsLabel?: string;
  popular?: boolean;
  stripePriceEnv: string;
  productName: string;
};

export const PACKS: Record<PackType, PackConfig> = {
  individual: {
    type: "individual",
    title: "Pack Individual",
    shortTitle: "Individual",
    count: 1,
    priceCents: 990,
    priceLabel: "R$9,90",
    stripePriceEnv: "STRIPE_PRICE_INDIVIDUAL",
    productName: "Pack Individual — 1 figurinha personalizada Copa 2026",
  },
  dupla: {
    type: "dupla",
    title: "Pack Dupla",
    shortTitle: "Dupla",
    count: 2,
    priceCents: 1690,
    priceLabel: "R$16,90",
    savingsLabel: "economize R$2,90",
    stripePriceEnv: "STRIPE_PRICE_DUPLA",
    productName: "Pack Dupla — 2 figurinhas personalizadas Copa 2026",
  },
  familia: {
    type: "familia",
    title: "Pack Família",
    shortTitle: "Família",
    count: 4,
    priceCents: 2990,
    priceLabel: "R$29,90",
    savingsLabel: "economize R$9,70",
    popular: true,
    stripePriceEnv: "STRIPE_PRICE_FAMILIA",
    productName: "Pack Família — 4 figurinhas personalizadas Copa 2026",
  },
};

export const PACK_LIST = [PACKS.individual, PACKS.dupla, PACKS.familia];

export function normalizePackType(value: string | undefined | null): PackType {
  if (value === "dupla" || value === "familia" || value === "individual") {
    return value;
  }

  return "individual";
}
