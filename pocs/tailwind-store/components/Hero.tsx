export default function Hero() {
  return (
    <section className="bg-[rgb(var(--color-surface))]">
      <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold leading-tight">
            Premium Products
            <br />
            Built for Real Life
          </h1>

          <p className="mt-6 text-[rgb(var(--color-text-muted))] max-w-lg">
            High-quality products curated for performance, durability, and
            modern design.
          </p>

          <button
            className="
              mt-8
              bg-[rgb(var(--color-primary))]
              hover:bg-[rgb(var(--color-primary-hover))]
              text-white
              px-6 py-3
              rounded-[var(--radius-md)]
              shadow-[var(--shadow-sm)]
            "
          >
            Shop Now
          </button>
        </div>

        <div className="h-80 bg-[rgb(var(--color-surface-muted))] rounded-[var(--radius-lg)] bg-[url('https://prd.place/400?id=1')] bg-cover bg-center" />
      </div>
    </section>
  );
}
