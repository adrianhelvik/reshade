# Reshade

[![Build Status](https://travis-ci.org/adrianhelvik/reshade.svg?branch=master)](https://travis-ci.org/adrianhelvik/reshade)
[![Coverage Status](https://coveralls.io/repos/github/adrianhelvik/reshade/badge.svg?branch=master)](https://coveralls.io/github/adrianhelvik/reshade?branch=master)

Reshade is a decorator that lets you write isolated styles in 
your React components.

Simply add the decorator, create a style method and you
are good to go!

**This project depends on shadow DOM and display: contents.
You should not use this package unless your target browsers
support these features**

https://caniuse.com/#feat=css-display-contents
https://caniuse.com/#feat=shadowdomv1

Currently this is a good fit for internal applications.

```jsx
import React, { Component } from 'react'
import reshade from 'reshade'

@reshade
class Example extends Component {
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

export default Example
```
