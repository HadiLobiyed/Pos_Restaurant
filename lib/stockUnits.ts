export const STOCK_UNITS = ["g", "kg", "L", "ML", "unité"] as const;
export type StockUnit = (typeof STOCK_UNITS)[number];
