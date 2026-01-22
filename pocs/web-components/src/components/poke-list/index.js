import '../poke-card'

class PokeList extends HTMLElement {
  static get observedAttributes() {
    return ['type']
  }

  page = 0

  connectedCallback() {
    this.load()
    this.addEventListener('page-change', e => {
      this.page = e.detail
      this.load()
    })
  }

  async load() {
    this.innerHTML = `<p>Loading...</p>`

    const type = this.getAttribute('type')

    this.innerHTML = `
      <h2 style="margin:16px 0;text-transform:uppercase">
        ${type}
      </h2>

      <div style="
        display:grid;
        grid-template-columns:repeat(auto-fill,160px);
        gap:12px;
      "></div>
    `
  }
}

customElements.define('poke-list', PokeList)
