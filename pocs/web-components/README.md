### What I learned?

- How to build Web Components using Custom Elements
- How to structure components with Shadow DOM
- How to scope styles correctly using CSS inside Shadow DOM
- How to implement pagination logic with custom events
- How to consume APIs using Fetch API vs Axios
- How to configure and use Axios interceptors
- How event bubbling works across Shadow DOM boundaries
- Why the composed flag is required in some CustomEvents

### Tech Details

- Web Components (Custom Elements + Shadow DOM)
- Vanilla JavaScript (ES Modules)
- Vite as bundler
- Axios + Fetch API
- CSS Modules / CSS files injected into Shadow DOM

### Key Modules

#### PokeCard

Reusable card component that receives data via attributes:

`name`

`image`

#### Focus:

- Attribute observation
- Isolated styling with Shadow DOM
- Pure CSS (no framework)

#### PokeList

- Responsible for:
- Fetching Pokémon data
- Rendering a grid of <poke-card>

Managing pagination state

Two data-loading strategies:Fetch API vs Axios (via type="axios")

#### PokePagination

Reusable pagination Web Component with:

- First / Prev / Page numbers / Next / Last
- Emits a custom page-change event

##### Important learning:

- Pagination state is controlled by the parent (poke-list)
- Event-driven communication between components

#### Shadow DOM & Event Composition

`One important issue encountered`

Custom events dispatched from inside Shadow DOM do not escape by default

Even with bubbles: `true`, the event won’t reach parent components

Solution: use `composed`: true

### Final toughts

It reinforced that Web Components are a solid, framework-agnostic solution when you need encapsulation, reusability, and long-term stability.
I’ll definitely reuse this setup as a base for future experiments and component libraries.
