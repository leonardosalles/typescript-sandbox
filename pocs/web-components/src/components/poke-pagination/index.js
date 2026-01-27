class PokePagination extends HTMLElement {
  static get observedAttributes() {
    return ['page']
  }

  connectedCallback() {
    this.render()
  }

  attributeChangedCallback() {
    this.render()
  }

  render() {
    const page = Number(this.getAttribute('page')) || 0

    this.innerHTML = `
      <div style="display:flex;gap:8px;justify-content:center;margin:16px 0;">
        <button ${page === 0 ? 'disabled' : ''} data-dir="-1">Prev</button>
        <span>Page ${page + 1}</span>
        <button data-dir="1">Next</button>
      </div>
    `

    this.querySelectorAll('button').forEach(btn => {
      btn.onclick = () => {
        const dir = Number(btn.dataset.dir)
        this.dispatchEvent(
          new CustomEvent('page-change', {
            detail: page + dir,
            bubbles: true,
          })
        )
      }
    })
  }
}

customElements.define('poke-pagination', PokePagination)
