"use client";

type Item = {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string };
  image: string | null;
  stock?: number | null;
};

export function MenuItemCard({
  item,
  onAdd,
  disabled,
}: {
  item: Item;
  onAdd: () => void;
  disabled?: boolean;
}) {
  const price = Number(item.price);
  const outOfStock = item.stock != null && item.stock <= 0;
  const lowStock = item.stock != null && item.stock > 0 && item.stock <= 5;
  const cannotAdd = disabled || outOfStock;

  return (
    <div
      className={`overflow-hidden rounded-2xl border bg-white shadow-card transition hover:shadow-elevated ${
        outOfStock ? "border-dark-200 opacity-75" : "border-dark-200/60"
      }`}
    >
      <div className="relative aspect-square overflow-hidden bg-dark-100">
        {item.image ? (
          <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-dark-300">•</div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-dark-900/50">
            <span className="rounded-xl bg-red-600 px-3 py-1 text-xs font-bold text-white">Rupture</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate font-semibold text-dark-900">{item.name}</h3>
        {item.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-dark-500">{item.description}</p>
        )}
        {lowStock && (
          <p className="mt-1 text-[11px] font-semibold text-amber-700">Plus que {item.stock} en stock</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-primary-600">{price.toFixed(2)} DA</span>
          <button
            onClick={onAdd}
            disabled={cannotAdd}
            className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {outOfStock ? "Indisponible" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}
