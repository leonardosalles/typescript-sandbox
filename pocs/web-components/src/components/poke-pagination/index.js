import css from './poke-pagination.css?inline';

const sheet = new CSSStyleSheet();
sheet.replaceSync(css);

class PokePagination extends HTMLElement {
  static get observedAttributes() {
    return ['page', 'total', 'visible'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.adoptedStyleSheets = [sheet];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    this.render();
  }

  get page() {
    return Number(this.getAttribute('page')) || 0;
  }

  get total() {
    return Number(this.getAttribute('total')) || 1;
  }

  get visible() {
    return Number(this.getAttribute('visible')) || 5;
  }

  render() {
    const page = this.page;
    const total = this.total;
    const visible = this.visible;

    const start = Math.max(0, page - Math.floor(visible / 2));
    const end = Math.min(total - 1, start + visible - 1);

    const pages = [];
    for (let i = start; i <= end; i++) pages.push(i);

    this.shadowRoot.innerHTML = `
      <div class="pagination">
        <button ${page === 0 ? 'disabled' : ''} data-page="0">
          First
        </button>

        <button ${page === 0 ? 'disabled' : ''} data-page="${page - 1}">
          Prev
        </button>

        ${pages
    .map(
      p => `
          <button
            class="${p === page ? 'active' : ''}"
            data-page="${p}"
          >
            ${p + 1}
          </button>
        `,
    )
    .join('')}

        <button ${page === total - 1 ? 'disabled' : ''} data-page="${page + 1}">
          Next
        </button>

        <button ${page === total - 1 ? 'disabled' : ''} data-page="${total - 1}">
          Last
        </button>
      </div>
    `;

    this.shadowRoot.querySelectorAll('button[data-page]').forEach(btn => {
      btn.onclick = () => {
        const nextPage = Number(btn.dataset.page);

        if (nextPage !== page) {
          this.dispatchEvent(
            new CustomEvent('page-change', {
              detail: nextPage,
              bubbles: true,
              composed: true,
            }),
          );
        }
      };
    });

    this.addEventListener('page-change', e => {
      console.log('Page change received:', e.detail);
    });
  }
}

customElements.define('poke-pagination', PokePagination);
