'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

exports.default = shadow;

var _hoistNonReactStatics = require('hoist-non-react-statics');

var _hoistNonReactStatics2 = _interopRequireDefault(_hoistNonReactStatics);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function shadow(BaseComponent) {
  var _class, _temp2;

  var componentDidUpdate = BaseComponent.prototype.componentDidUpdate;

  BaseComponent.prototype.componentDidUpdate = function () {
    this.props.__emitUpdate__();
    if (typeof componentDidUpdate === 'function') componentDidUpdate.apply(this, arguments);
  };

  var NewComponent = (_temp2 = _class = function (_Component) {
    _inherits(NewComponent, _Component);

    function NewComponent() {
      var _ref;

      var _temp, _this, _ret;

      _classCallCheck(this, NewComponent);

      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = NewComponent.__proto__ || Object.getPrototypeOf(NewComponent)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
        div: null,
        pierce: 1
      }, _this.setChild = function (child) {
        if (!_this.state.child) _this.setState({ child: child });
      }, _this.childDidUpdate = function () {
        if (_this.blockPropagation) return;
        _this.blockPropagation = true;
        _this.setState(function (state) {
          return { pierce: state.pierce + 1 };
        }, function () {
          _this.blockPropagation = false;
        });
      }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(NewComponent, [{
      key: 'componentDidMount',
      value: function componentDidMount() {
        var shadow = this.element.attachShadow({ mode: 'open' });
        this.setState({ shadow: shadow });
      }
    }, {
      key: 'style',
      value: function style() {
        if (!this.state.child) return null;
        switch (_typeof(this.state.child.style)) {
          case 'string':
            return this.state.child.style;
          case 'function':
            return this.state.child.style();
          default:
            return null;
        }
      }
    }, {
      key: 'render',
      value: function render() {
        var _this2 = this;

        return _react2.default.createElement(
          _react2.default.Fragment,
          null,
          _react2.default.createElement('div', {
            key: 'shadow-container',
            ref: function ref(e) {
              return _this2.element = e;
            },
            style: { display: 'contents' }
          }),
          Boolean(this.state.shadow) && _reactDom2.default.createPortal(_react2.default.createElement(
            _react2.default.Fragment,
            null,
            _react2.default.createElement(
              'style',
              null,
              this.style()
            ),
            _react2.default.createElement(BaseComponent, Object.assign({
              ref: this.setChild,
              shadow: this.state.shadow
            }, this.props, {
              __emitUpdate__: this.childDidUpdate,
              __pierceUpdate__: this.state.pierce
            }))
          ), this.state.shadow)
        );
      }
    }]);

    return NewComponent;
  }(_react.Component), _class.WrappedComponent = BaseComponent.WrappedComponent || BaseComponent, _temp2);


  (0, _hoistNonReactStatics2.default)(NewComponent, BaseComponent);

  return NewComponent;
}