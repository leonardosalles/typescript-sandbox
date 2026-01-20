type Props = {
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function ProductCard({
  name,
  description,
  price,
  image,
}: Props) {
  return (
    <article
      className="
        bg-[rgb(var(--color-surface))]
        border border-[rgb(var(--color-border))]
        rounded-[var(--radius-lg)]
        shadow-[var(--shadow-sm)]
        hover:shadow-[var(--shadow-md)]
        transition
      "
    >
      <div
        className="h-48 bg-[rgb(var(--color-surface-muted))] rounded-t-[var(--radius-lg)]"
        style={{
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="p-5">
        <h3 className="font-semibold text-lg">{name}</h3>
        <p className="text-sm text-[rgb(var(--color-text-muted))] mt-2">
          {description}
        </p>

        <div className="mt-4 flex justify-between items-center">
          <span className="text-lg font-bold text-[rgb(var(--color-primary))]">
            ${price}
          </span>

          <button className="text-sm text-[rgb(var(--color-primary))] hover:underline">
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
}
