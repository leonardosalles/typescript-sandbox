import { useMemo, useState } from "react";
import { FixedClock } from "../application/Clock";
import { SequentialGroceryItemIdGenerator } from "../application/GroceryItemIdGenerator";
import { GroceryTodoService } from "../application/GroceryTodoService";
import { CommandHistory } from "../domain/commands/CommandHistory";
import {
  GroceryCategory,
  GroceryItemSnapshot,
  GroceryItemStatus,
} from "../domain/GroceryTypes";
import { weeklyGroceries } from "../fixtures/GroceryFixtures";
import { InMemoryGroceryListRepository } from "../infrastructure/InMemoryGroceryListRepository";

const listId = "LIST-WEEKLY";

type Services = {
  readonly service: GroceryTodoService;
};

function createServices(): Services {
  return {
    service: new GroceryTodoService(
      new InMemoryGroceryListRepository([weeklyGroceries()]),
      new SequentialGroceryItemIdGenerator("WEB"),
      new FixedClock(new Date("2026-06-16T12:00:00.000Z")),
      new CommandHistory(),
    ),
  };
}

function categoryLabel(category: GroceryCategory): string {
  return category.charAt(0).toUpperCase() + category.slice(1);
}

function optionLabel(option: "active" | "all" | GroceryItemStatus): string {
  if (option === "active") {
    return "Active";
  }

  if (option === "all") {
    return "All";
  }

  return option.charAt(0).toUpperCase() + option.slice(1);
}

function statusClasses(status: GroceryItemStatus): string {
  switch (status) {
    case GroceryItemStatus.Done:
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case GroceryItemStatus.Removed:
      return "border-zinc-200 bg-zinc-100 text-zinc-500";
    case GroceryItemStatus.Pending:
      return "border-amber-200 bg-amber-50 text-amber-800";
  }
}

function filterItems(
  items: GroceryItemSnapshot[],
  filter: "active" | "all" | GroceryItemStatus,
): GroceryItemSnapshot[] {
  if (filter === "all") {
    return items;
  }

  if (filter === "active") {
    return items.filter((item) => item.status !== GroceryItemStatus.Removed);
  }

  return items.filter((item) => item.status === filter);
}

export function App() {
  const services = useMemo(() => createServices(), []);
  const [version, setVersion] = useState(0);
  const [name, setName] = useState("Milk");
  const [category, setCategory] = useState<GroceryCategory>(
    GroceryCategory.Dairy,
  );
  const [amount, setAmount] = useState("2");
  const [unit, setUnit] = useState("bottles");
  const [includeRemoved, setIncludeRemoved] = useState(false);
  const [filter, setFilter] = useState<"active" | "all" | GroceryItemStatus>(
    "active",
  );
  const [message, setMessage] = useState("Ready to plan groceries");

  const allItems = services.service.listAll(listId, true);
  const visibleItems = filterItems(
    services.service.listAll(
      listId,
      includeRemoved ||
        filter === "all" ||
        filter === GroceryItemStatus.Removed,
    ),
    filter,
  );
  const history = services.service.historySnapshot();
  const totals = allItems.reduce(
    (summary, item) => {
      summary.total += 1;
      summary[item.status] += 1;
      return summary;
    },
    {
      total: 0,
      [GroceryItemStatus.Pending]: 0,
      [GroceryItemStatus.Done]: 0,
      [GroceryItemStatus.Removed]: 0,
    },
  );

  function refresh(messageText: string): void {
    setMessage(messageText);
    setVersion((current) => current + 1);
  }

  function submit(event: React.SubmitEvent<HTMLFormElement>): void {
    event.preventDefault();

    try {
      const item = services.service.addItem({
        listId,
        name,
        category,
        quantityAmount: Number(amount),
        quantityUnit: unit,
      });

      refresh(`Added ${item.name}`);
    } catch (error) {
      refresh(error instanceof Error ? error.message : "Could not add item");
    }
  }

  function markDone(item: GroceryItemSnapshot): void {
    try {
      services.service.markAsDone({ listId, itemId: item.id });
      refresh(`Marked ${item.name} as done`);
    } catch (error) {
      refresh(
        error instanceof Error ? error.message : "Could not mark item as done",
      );
    }
  }

  function removeItem(item: GroceryItemSnapshot): void {
    try {
      services.service.removeItem({ listId, itemId: item.id });
      refresh(`Removed ${item.name}`);
    } catch (error) {
      refresh(error instanceof Error ? error.message : "Could not remove item");
    }
  }

  function undo(): void {
    try {
      refresh(`Undo: ${services.service.undo()}`);
    } catch (error) {
      refresh(error instanceof Error ? error.message : "Could not undo");
    }
  }

  function redo(): void {
    try {
      refresh(`Redo: ${services.service.redo()}`);
    } catch (error) {
      refresh(error instanceof Error ? error.message : "Could not redo");
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-zinc-950">
      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-6 lg:grid-cols-[340px_1fr]">
        <aside className="space-y-4">
          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h1 className="text-xl font-semibold">Grocery Todo List</h1>
            <p className="mt-1 text-sm text-zinc-500">
              OOAD command-history workbench
            </p>
          </section>

          <form
            className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
            onSubmit={submit}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              Add item
            </h2>

            <label className="mt-4 block text-sm font-medium" htmlFor="name">
              Product
            </label>
            <input
              id="name"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950"
              onChange={(event) => setName(event.target.value)}
              value={name}
            />

            <label
              className="mt-4 block text-sm font-medium"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950"
              onChange={(event) =>
                setCategory(event.target.value as GroceryCategory)
              }
              value={category}
            >
              {Object.values(GroceryCategory).map((option) => (
                <option key={option} value={option}>
                  {categoryLabel(option)}
                </option>
              ))}
            </select>

            <div className="mt-4 grid grid-cols-[120px_1fr] gap-3">
              <label className="block text-sm font-medium" htmlFor="amount">
                Amount
                <input
                  id="amount"
                  className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950"
                  min="0"
                  onChange={(event) => setAmount(event.target.value)}
                  step="0.25"
                  type="number"
                  value={amount}
                />
              </label>
              <label className="block text-sm font-medium" htmlFor="unit">
                Unit
                <input
                  id="unit"
                  className="mt-2 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-zinc-950"
                  onChange={(event) => setUnit(event.target.value)}
                  value={unit}
                />
              </label>
            </div>

            <button
              className="mt-5 w-full rounded-md bg-zinc-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
              type="submit"
            >
              Add item
            </button>
          </form>

          <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-zinc-500">
              History
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <button
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold transition hover:border-zinc-950 disabled:cursor-not-allowed disabled:text-zinc-400"
                disabled={history.done === 0}
                onClick={undo}
                type="button"
              >
                Undo
              </button>
              <button
                className="rounded-md border border-zinc-300 px-4 py-2 text-sm font-semibold transition hover:border-zinc-950 disabled:cursor-not-allowed disabled:text-zinc-400"
                disabled={history.redo === 0}
                onClick={redo}
                type="button"
              >
                Redo
              </button>
            </div>
            <p className="mt-3 rounded-md border border-sky-200 bg-sky-50 px-3 py-2 text-sm text-sky-900">
              {message}
            </p>
          </section>
        </aside>

        <section className="rounded-lg border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Weekly groceries</h2>
              <p className="mt-1 text-sm text-zinc-500">
                Add, remove, mark as done, undo, redo, and list all items.
              </p>
            </div>
            <label className="flex items-center gap-2 rounded-md border border-zinc-200 px-3 py-2 text-sm">
              <input
                checked={includeRemoved}
                onChange={(event) => setIncludeRemoved(event.target.checked)}
                type="checkbox"
              />
              List removed
            </label>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-4">
            <Summary label="Pending" value={totals.pending} />
            <Summary label="Done" value={totals.done} />
            <Summary label="Removed" value={totals.removed} />
            <Summary label="Total" value={totals.total} />
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {(
              [
                "active",
                GroceryItemStatus.Pending,
                GroceryItemStatus.Done,
                GroceryItemStatus.Removed,
                "all",
              ] as const
            ).map((option) => (
              <button
                key={`${option}-${version}`}
                className={`rounded-md border px-3 py-2 text-sm font-semibold transition ${
                  filter === option
                    ? "border-zinc-950 bg-zinc-950 text-white"
                    : "border-zinc-200 bg-white hover:border-zinc-400"
                }`}
                onClick={() => setFilter(option)}
                type="button"
              >
                {optionLabel(option)}
              </button>
            ))}
          </div>

          <div className="mt-5 overflow-hidden rounded-lg border border-zinc-200">
            {visibleItems.length === 0 ? (
              <p className="p-6 text-sm text-zinc-500">
                No items for this view
              </p>
            ) : (
              <div className="divide-y divide-zinc-200">
                {visibleItems.map((item) => (
                  <article
                    key={`${item.id}-${item.status}-${version}`}
                    className="grid gap-3 p-4 md:grid-cols-[1fr_auto]"
                  >
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-base font-semibold ${
                            item.status === GroceryItemStatus.Done
                              ? "line-through text-zinc-500"
                              : ""
                          }`}
                        >
                          {item.name}
                        </h3>
                        <span
                          className={`rounded-full border px-2 py-1 text-xs ${statusClasses(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
                        {item.quantity} · {categoryLabel(item.category)} ·{" "}
                        {item.id}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        className="rounded-md border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400"
                        disabled={item.status !== GroceryItemStatus.Pending}
                        onClick={() => markDone(item)}
                        type="button"
                      >
                        Done
                      </button>
                      <button
                        className="rounded-md border border-rose-300 px-3 py-2 text-sm font-semibold text-rose-800 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:border-zinc-200 disabled:text-zinc-400"
                        disabled={item.status === GroceryItemStatus.Removed}
                        onClick={() => removeItem(item)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function Summary({
  label,
  value,
}: {
  readonly label: string;
  readonly value: number;
}) {
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
    </div>
  );
}
