import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

Enzyme.configure({ adapter: new Adapter() })

global.defer = () => {
  let resolve
  let reject

  const promise = new Promise((_resolve, _reject) => {
    resolve = _resolve
    reject = _reject
  })

  return {
    promise,
    resolve,
    reject,
  }
}

HTMLElement.prototype.attachShadow = function(options = {}) {
  const element = document.createElement('x-shadow')

  for (const key of Object.keys(options)) {
    element.setAttribute(key, options[key])
  }

  this.appendChild(element)

  return element
}
