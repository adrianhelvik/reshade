# Reshade

Reshade is a decorator that lets you write isolated styles in 
your React components.

Simply add the decorator, create a style method and you
are good to go!

This project depends on shadow DOM. You should not use shadow
DOM unless you know your target audience supports it.

Currently this is a good fit for internal applications.

```javascript
import React, { Component } from 'react'
import reshade from 'reshade'

@reshade
class Colored extends Component {
  state = {
    fontSize: '1.1rem',
  }

  style() {
    return `
      .container {
        font-size: ${this.state.fontSize};
      }
    `
  }

  setFontSize = e => {
    const fontSize = e.target.innerHTML
    this.setState({ fontSize })
  }

  render() {
    return (
      <div className="container">
        Selected font size: {this.state.fontSize}
        <button onClick={this.setFontSize}>1rem</button>
        <button onClick={this.setFontSize}>2rem</button>
      </div>
    )
  }
}

class App extends Component {
  render() {
    return (
      <div>
        <Colored />
      </div>
    )
  }
}

export default App
```
