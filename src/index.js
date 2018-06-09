import hoist from 'hoist-non-react-statics'
import React, { Component } from 'react'
import ReactDOM from 'react-dom'

export default function shadow(BaseComponent) {
  const componentDidUpdate = BaseComponent.prototype.componentDidUpdate

  BaseComponent.prototype.componentDidUpdate = function () {
    this.props.__emitUpdate__()
    if (typeof componentDidUpdate === 'function')
      componentDidUpdate.apply(this, arguments)
  }

  class NewComponent extends Component {
    static WrappedComponent = BaseComponent.WrappedComponent || BaseComponent

    state = {
      div: null,
      pierce: 1,
    }

    componentDidMount() {
      const shadow = this.element.attachShadow({ mode: 'open' })
      this.setState({ shadow })
    }

    style() {
      if (! this.state.child)
        return null
      switch (typeof this.state.child.style) {
        case 'string':
          return this.state.child.style
        case 'function':
          return this.state.child.style()
        default:
          return null
      }
    }

    setChild = child => {
      if (! this.state.child)
        this.setState({ child })
    }

    childDidUpdate = () => {
      if (this.blockPropagation)
        return
      this.blockPropagation = true
      this.setState(state => ({ pierce: state.pierce + 1 }), () => {
        this.blockPropagation = false
      })
    }

    render() {
      return (
        <React.Fragment>
          <div
            key="shadow-container"
            ref={e => this.element = e}
            style={{ display: 'contents' }}
          />
          {Boolean(this.state.shadow) &&
              ReactDOM.createPortal(
                <React.Fragment>
                  <style>
                    {this.style()}
                  </style>
                  <BaseComponent
                    ref={this.setChild}
                    shadow={this.state.shadow}
                    {...this.props}
                    __emitUpdate__={this.childDidUpdate}
                    __pierceUpdate__={this.state.pierce}
                  />
                </React.Fragment>,
                this.state.shadow,
              )
          }
        </React.Fragment>
      )
    }
  }

  hoist(NewComponent, BaseComponent)

  return NewComponent
}
