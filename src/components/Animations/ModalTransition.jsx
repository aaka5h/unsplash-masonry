import React from 'react';
import { getDomNode, isFunction } from 'utils';
import PropTypes from 'prop-types';
import { omit } from 'lodash';
import classNames from 'classnames';
import helper from 'utils/dom-helper';

export var STATUS;
(function (STATUS) {
  STATUS[(STATUS['UNMOUNTED'] = 0)] = 'UNMOUNTED';
  STATUS[(STATUS['EXITED'] = 1)] = 'EXITED';
  STATUS[(STATUS['ENTERING'] = 2)] = 'ENTERING';
  STATUS[(STATUS['ENTERED'] = 3)] = 'ENTERED';
  STATUS[(STATUS['EXITING'] = 4)] = 'EXITING';
})(STATUS || (STATUS = {}));

const transitionPropType = {
  in: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
  className: PropTypes.string,
  enteringClass: PropTypes.string,
  enteredClass: PropTypes.string,
  exitingClass: PropTypes.string,
  exitedClass: PropTypes.string,
  transitionOnAppear: PropTypes.bool,
  unmountOnExit: PropTypes.bool,
  onEnter: PropTypes.func,
  onEntering: PropTypes.func,
  onEntered: PropTypes.func,
  onExit: PropTypes.func,
  onExiting: PropTypes.func,
  onExited: PropTypes.func,
  timeout: PropTypes.number,
};

class ModalTransition extends React.Component {
  childRef = null;
  nextCallBack = null;
  currentInstance = null;
  constructor(props) {
    super(props);
    let initialStatus;
    if (props.in) initialStatus = props.transitionOnAppear ? STATUS.EXITED : STATUS.ENTERED;
    else initialStatus = props.unmountOnExit ? STATUS.UNMOUNTED : STATUS.EXITED;
    this.state = {
      status: initialStatus,
    };

    this.childRef = React.createRef();
  }

  componentDidMount() {
    console.log('transition component did mount');
    if (this.props.in && this.props.transitionOnAppear) {
      this.startEnter(this.props);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.in && nextProps.unmountOnExit) {
      if (prevState.status === STATUS.UNMOUNTED) {
        // Start enter transition in componentDidUpdate.
        return { status: STATUS.EXITED };
      }
    }
    return null;
  }
  componentDidUpdate() {
    const { status } = this.state;
    const { unmountOnExit } = this.props;

    if (unmountOnExit && status === STATUS.EXITED) {
      if (this.props.in) {
        this.startEnter(this.props);
      } else {
        if (this.currentInstance) {
          this.setState({ status: STATUS.UNMOUNTED });
        }
      }
      return;
    }

    // if (false) {
    console.log('starting enter or exit');
    if (this.props.in) {
      if (status === STATUS.EXITING || status === STATUS.EXITED) {
        console.log('starting on update');
        this.startEnter(this.props);
      }
    } else if (status === STATUS.ENTERING || status === STATUS.ENTERED) {
      console.log('exiting on update');
      this.startExit(this.props);
    }
    // }
  }

  componentWillUnmount() {
    console.log('transition will unmount');
    this.cancelNextCallback();
    this.currentInstance = null;
  }

  getNode() {
    if (this.childRef.current) {
      return getDomNode(this.childRef.current);
    }
    return getDomNode(this);
  }
  setNextCallback(callback) {
    let active = true;

    this.nextCallBack = (e) => {
      if (!active) return;
      if (e) {
        if (this.currentInstance === e.target) {
          callback(e);
          active = false;
          this.nextCallBack = null;
        }
        return;
      }
      callback(e);
      active = false;
      this.nextCallBack = null;
    };
    this.nextCallBack.cancel = () => {
      this.active = false;
    };

    return this.nextCallBack;
  }

  cancelNextCallback() {
    if (this.nextCallBack !== null) {
      this.nextCallBack.cancel();
      this.nextCallBack = null;
    }
  }
  startEnter(props) {
    const { onEnter, onEntering, onEntered } = this.props;
    console.log('performing enter');
    this.cancelNextCallback();
    // this gives null since there is no node to search if UNMOUNTED
    const node = this.getNode();
    this.currentInstance = node;

    onEnter && onEnter(node);

    this.safeSetState({ status: STATUS.ENTERING }, () => {
      onEntering && onEntering();

      this.onTransitionEnd(node, () => {
        this.safeSetState({ status: STATUS.ENTERED }, () => {
          onEntered && onEntered();
        });
      });
    });
  }
  startExit(props) {
    const { onExit, onExiting, onExited } = this.props;
    console.log('performing exit');
    this.cancelNextCallback();
    const node = this.getNode();
    this.currentInstance = node;

    onExit && onExit(node);

    this.safeSetState({ status: STATUS.EXITING }, () => {
      onExiting && onExiting();
      this.onTransitionEnd(node, () => {
        this.safeSetState({ status: STATUS.EXITED }, () => {
          onExited && onExited();
        });
      });
    });
  }

  onTransitionEnd(node, callback) {
    this.setNextCallback(callback);
    const { timeout } = this.props;
    this.animationListener && this.animationListener.off();
    if (node) {
      // TODO: animation key get depend on browser
      this.animationListener = helper.on(node, 'animationend', this.nextCallBack);
      if (timeout !== null) {
        console.log('transition setting timeout of:', timeout);
        setTimeout(this.nextCallBack, timeout);
      }
    } else {
      setTimeout(callback, 0);
    }
  }

  safeSetState(newState, callback) {
    if (this.currentInstance) this.setState(newState, this.setNextCallback(callback));
  }

  render() {
    const status = this.state.status;
    const { children, className } = this.props;
    console.log('status during render', STATUS[status]);

    if (status === STATUS.UNMOUNTED) {
      return null;
    }
    const childProps = omit(this.props, Object.keys(transitionPropType));

    if (isFunction(children)) {
      childProps.className = classNames(childProps.className, 'animated-class');
      return children(childProps, this.childRef);
    }
    const child = React.Children.only(children);
    // this.childRef.current = document.createElement('div');
    // return children;
    return React.cloneElement(child, {
      ...childProps,
      ref: this.childRef,
      className: classNames(className, child.props.className, 'animated-class'),
    });
  }
}

ModalTransition.defaultProps = {
  transitionOnAppear: true,
  unmountOnExit: true,
  timeout: 300,
};
ModalTransition.propTypes = transitionPropType;
ModalTransition.displayName = 'ModalTransition';
export default ModalTransition;
