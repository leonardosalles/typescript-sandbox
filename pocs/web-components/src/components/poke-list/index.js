import '../poke-card'
import { fetchPokemons } from '../../services/fetch'

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

    const data = await fetchPokemons(this.page)

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

    const grid = this.querySelector('div')

    data.results.forEach((p, i) => {
      const id = this.page * 10 + i + 1
      const card = document.createElement('poke-card')
      card.setAttribute('name', p.name)
      card.setAttribute(
        'image',
        `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
      )
      grid.appendChild(card)
    })
  }
}

customElements.define('poke-list', PokeList)
