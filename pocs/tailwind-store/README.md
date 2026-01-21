## What I learned

- @theme is parsed at build time
- Runtime overrides are pure CSS
- Missing tokens fail silently
- Tailwind does not validate CSS variables
- JIT only cares about class usage, not token values
- Understand how Tailwind v4 design tokens behave at runtime.

#### What this project does

- Multi theme via CSS variables
- Stress testing with rapid switches
- Debug page for runtime inspection
- Failure scenarios

#### Conclusion about Tailwind

- data-theme is stable and predictable
- CSS variables are cheap to update
- Visual bugs usually come from class misuse, not tokens

# Idiomatic Theme Strategies

### Strategy A — data-theme attribute (used)

Pros:

- Semantic
- Easy to inspect
- Minimal DOM mutation

Cons:

- CSS specificity needs care

### Strategy B — class-based theme

html.theme-halloween strategy

Pros:

- Familiar to most devs

Cons:

- Class explosion
- Harder to compose

### Conclusion

data-theme scales better for seasonal themes and different kinds of systems.

### Screenshots
