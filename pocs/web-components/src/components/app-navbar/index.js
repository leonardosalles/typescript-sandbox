import css from './app-navbar.css?inline'

const sheet = new CSSStyleSheet()
sheet.replaceSync(css)

class AppNavbar extends HTMLElement {
  constructor() {
    super()
    this.attachShadow({ mode: 'open' })
    this.shadowRoot.adoptedStyleSheets = [sheet]
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <nav>
        Poke POC — Fetch vs Axios
      </nav>
    `
  }
}

customElements.define('app-navbar', AppNavbar)
