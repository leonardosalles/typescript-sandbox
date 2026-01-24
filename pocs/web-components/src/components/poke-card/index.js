import styles from './poke-card.css?inline'

const sheet = new CSSStyleSheet()
sheet.replaceSync(styles)

class PokeCard extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'image']
  }

  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.adoptedStyleSheets = [sheet]
  }

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    const name = this.getAttribute('name') ?? 'Unknown'
    const image = this.getAttribute('image')

    this.shadowRoot.innerHTML = `
      <div class="card">
        ${image ? `<img src="${image}" alt="${name}" />` : ''}
        <div class="name">${name}</div>
      </div>
    `
  }
}

customElements.define('poke-card', PokeCard)
