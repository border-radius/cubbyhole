import { render } from 'preact'

const App = () => {
  return <h1>Cubbyhole</h1>
}

window.addEventListener('load', () => render(<App />, document.body))
