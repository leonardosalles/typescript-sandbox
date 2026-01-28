import '../poke-card';
import '../poke-pagination';
import { fetchPokemons } from '../../services/fetch';
import { axiosPokemons } from '../../services/axios';
import css from './poke-list.css?inline';

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

class PokeList extends HTMLElement {
  static get observedAttributes() {
    return ['type'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  page = 0;
  limit = 10;
  totalPages = 0;

  connectedCallback() {
    this.load();

    this.addEventListener('page-change', e => {
      this.page = e.detail;
      this.load();
    });
  }

  async load() {
    this.shadowRoot.innerHTML = `
      <div class="loading">Loading...</div>
    `;

    const type = this.getAttribute('type') || 'fetch';

    const data =
      type === 'axios'
        ? await axiosPokemons(this.page, this.limit)
        : await fetchPokemons(this.page, this.limit);

    this.totalPages = Math.ceil(data.count / this.limit);

    this.shadowRoot.innerHTML = `
      <section class="section">
        <h2 class="title">${type}</h2>

        <div class="grid"></div>

        <poke-pagination
          page="${this.page}"
          total="${this.totalPages}"
          visible="5"
        ></poke-pagination>
      </section>
    `;

    const grid = this.shadowRoot.querySelector('.grid');

    data.results.forEach((p, i) => {
      const id = this.page * this.limit + i + 1;
      const card = document.createElement('poke-card');

      card.setAttribute('name', p.name);
      card.setAttribute(
        'image',
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`,
      );

      grid.appendChild(card);
    });
  }
}

customElements.define('poke-list', PokeList);
