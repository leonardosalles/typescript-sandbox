# What I learned
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
<img width="600" alt="default" src="https://github.com/user-attachments/assets/2455cf63-4e1f-4fd0-b22c-6c19dce7e6d9" />
<img width="600" alt="blackfriday" src="https://github.com/user-attachments/assets/16ba2541-14d2-4b25-9ea3-a4d8c35f59f4" />
<img width="600" alt="christmas" src="https://github.com/user-attachments/assets/a995736e-36c1-4c1c-84a5-802457c98c62" />
<img width="600" alt="theme-debug" src="https://github.com/user-attachments/assets/831760c4-905e-4e89-92a5-03264ff4625f" />


