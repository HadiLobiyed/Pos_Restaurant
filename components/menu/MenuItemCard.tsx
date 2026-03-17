"use client";

type Item = {
  id: string;
  name: string;
  description: string | null;
  price: { toString(): string };
  image: string | null;
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
  return (
    <div className="overflow-hidden rounded-2xl border border-dark-200/60 bg-white shadow-card transition hover:shadow-elevated">
      <div className="relative aspect-square overflow-hidden bg-dark-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-dark-300">
            •
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="truncate font-semibold text-dark-900">{item.name}</h3>
        {item.description && (
          <p className="mt-0.5 line-clamp-2 text-xs text-dark-500">{item.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-bold text-primary-600">{price.toFixed(2)} €</span>
          <button
            onClick={onAdd}
            disabled={disabled}
            className="rounded-xl bg-primary-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}
