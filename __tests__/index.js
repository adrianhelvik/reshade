import { Simulate } from 'react-dom/test-utils'
import ReactDOM from 'react-dom'
import { mount } from 'enzyme'
import reshade from '../src'
import React from 'react'

describe('reshade', () => {
  it('mounts', async () => {
    const deferred = defer()

    class MyComponent extends React.Component {
      componentDidMount() {
        deferred.resolve()
      }

      render() {
        return (<code />)
      }
    }

    const wrapper = mount(<MyComponent />)

    await deferred.promise
  })

  it('creates a div with style: { display: contents }', async () => {
    const deferred = defer()

    @reshade
    class MyComponent extends React.Component {
      componentDidMount() {
        deferred.resolve()
      }

      render() {
        return (<code />)
      }
    }

    const wrapper = mount(<MyComponent />)

    await deferred.promise

    const divWrapper = wrapper
      .find('div')

    expect(divWrapper.length).toBe(1)

    const div = divWrapper.instance()

    expect(div.style.display).toBe('contents')
  })

  it('appends a shadow root with { mode: "open" } to the div', async () => {
    const deferred = defer()

    @reshade
    class MyComponent extends React.Component {
      componentDidMount() {
        deferred.resolve()
      }

      render() {
        return (<code />)
      }
    }

    const wrapper = mount(<MyComponent />)

    await deferred.promise

    const div = wrapper
      .find('div')
      .instance()

    expect(div).toBeDefined()

    const mockedShadow = div.querySelector('x-shadow')

    expect(mockedShadow.getAttribute('mode')).toBe('open')
  })

  it('accepts a style function', async () => {
    const deferred = defer()

    const styleText = `
      .foo {
        color: white;
      }
    `

    @reshade
    class MyComponent extends React.Component {
      style() {
        return styleText
      }

      componentDidMount() {
        deferred.resolve()
      }

      render() {
        return (<code />)
      }
    }

    const wrapper = mount(<MyComponent />)

    await deferred.promise

    const style = wrapper
      .find('div')
      .instance()
      .querySelector('x-shadow')
      .querySelector('style')

    expect(style.textContent).toBe(styleText)
  })

  it('accepts a style string', async () => {
    const deferred = defer()

    const styleText = `
      .foo {
        color: white;
      }
    `

    @reshade
    class MyComponent extends React.Component {
      style = styleText

      componentDidMount() {
        deferred.resolve()
      }

      render() {
        return (<code />)
      }
    }

    const wrapper = mount(<MyComponent />)

    await deferred.promise

    const style = wrapper
      .find('div')
      .instance()
      .querySelector('x-shadow')
      .querySelector('style')

    expect(style.textContent).toBe(styleText)
  })

  it('renders the component it is applied to', async () => {
    const deferred = defer()

    @reshade
    class MyComponent extends React.Component {
      componentDidMount() {
        deferred.resolve()
        expect(this.props.someProp).toBe(true)
      }

      render() {
        return (<code />)
      }
    }

    const wrapper = mount(<MyComponent someProp={true} />)

    await deferred.promise

    const element = wrapper
      .find(MyComponent)

    expect(element.length).toBe(1)
  })

  it('unmounts correctly', async () => {
    const mounted = defer()
    const unmounted = defer()

    @reshade
    class MyComponent extends React.Component {
      componentDidMount() {
        mounted.resolve()
      }

      componentWillUnmount() {
        unmounted.resolve()
      }

      render() {
        return (<code />)
      }
    }

    const wrapper = mount(<MyComponent someProp={true} />)

    await mounted.promise

    wrapper.unmount()

    await unmounted.promise
  })

  it('updates when the component is updated', async () => {
    const mounted = defer()
    const clicked = defer()

    @reshade
    class MyComponent extends React.Component {
      state = {
        fontSize: 1,
      }

      style() {
        return `
          code {
            font-size: ${this.state.fontSize}rem;
          }
        `
      }

      componentDidMount() {
        mounted.resolve()
      }

      render() {
        return (
          <div>
            <code>My code</code>
            <button
              className="increment"
              onClick={() => {
                this.setState(state => ({
                  fontSize: state.fontSize + 1
                }), () => {
                  clicked.resolve()
                })
              }}>
              Increase font size
            </button>
          </div>
        )
      }
    }

    const wrapper = mount(<MyComponent someProp={true} />)

    await mounted.promise

    const button = wrapper
      .find('div')
      .instance()
      .querySelector('button')

    Simulate.click(button)

    await clicked.promise

    const style = wrapper
      .find('div')
      .instance()
      .querySelector('style')

    expect(style.textContent).toBe(MyComponent.WrappedComponent.prototype.style.call({
      state: {
        fontSize: 2
      }
    }))
  })

  it('calls componentDidUpdate of the component if provided', async () => {
    const mounted = defer()
    const clicked = defer()
    const updated = defer()

    @reshade
    class MyComponent extends React.Component {
      state = {
        fontSize: 1,
      }

      componentDidUpdate() {
        updated.resolve()
      }

      style() {
        return `
          code {
            font-size: ${this.state.fontSize}rem;
          }
        `
      }

      componentDidMount() {
        mounted.resolve()
      }

      render() {
        return (
          <div>
            <code>My code</code>
            <button
              className="increment"
              onClick={() => {
                this.setState(state => ({
                  fontSize: state.fontSize + 1
                }), () => {
                  clicked.resolve()
                })
              }}>
              Increase font size
            </button>
          </div>
        )
      }
    }

    const wrapper = mount(<MyComponent someProp={true} />)

    await mounted.promise

    const button = wrapper
      .find('div')
      .instance()
      .querySelector('button')

    Simulate.click(button)

    await clicked.promise
    await updated.promise
  })

  it('passes shadow as a prop', () => {
    let shadow

    @reshade
    class MyComponent extends React.Component {
      render() {
        shadow = this.props.shadow
        return null
      }
    }

    mount(<MyComponent />)

    expect(shadow).toBeInstanceOf(HTMLElement)
    expect(shadow.tagName).toBe('X-SHADOW') // Our mocked implementation
  })
})
