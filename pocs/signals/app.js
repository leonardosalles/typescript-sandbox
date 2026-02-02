const count = new Signal.State(0);

const double = new Signal.Computed(() => {
  return count.get() * 2;
});

const isEven = new Signal.Computed(() => {
  return count.get() % 2 === 0;
});

const countEl = document.getElementById("count");
const doubleEl = document.getElementById("double");
const evenEl = document.getElementById("even");
const btn = document.getElementById("inc");

function render() {
  countEl.textContent = "Count: " + count.get();
  doubleEl.textContent = "Double: " + double.get();

  const even = isEven.get();
  evenEl.textContent = "Is even: " + (even ? "YES" : "NO");
  evenEl.className = "row " + (even ? "even-true" : "even-false");
}

const watcher = new Signal.subtle.Watcher(render);
watcher.watch(count, double, isEven);

render();

btn.addEventListener("click", () => {
  count.set(count.get() + 1);
});
