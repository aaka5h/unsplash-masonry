import React, {useCallback, useEffect} from 'react';
import ReactDOM from 'react-dom';

export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
class Portal extends React.Component {
  portalNode = null;
  container = null;
  defaultNode = null;

  constructor(props) {
    super(props);
    console.log('constructing react portal', this.props);
    this.container = props.container || (canUseDOM && document.body);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.container = this.props.container;
  }

  componentWillUnmount() {
    if (this.defaultNode) {
      document.body.removeChild(this.defaultNode);
    }
    this.defaultNode = null;
  }

  render() {
    if (!canUseDOM) {
      return null;
    }

    // never append directly to body until specified by the container prop
    if (!this.container && !this.defaultNode) {
      this.defaultNode = document.createElement('div');
      this.defaultNode.classList.add('portal-node');
      document.body.appendChild(this.defaultNode);
    }

    return ReactDOM.createPortal(this.props.children, this.container || this.defaultNode);
  }
}

Portal.defaultProps = {
  container: null,
};

function usePortal(props) {
  const { container } = props;

  const rootEl = React.useRef(null);

  useEffect(() => {
    const containerEl = typeof container === 'function' ? container() : container;
    rootEl.current = containerEl;
  }, [rootEl, container]);

  // React.useCallback(() => {}, [container]);

  const Prtl = useCallback(
    (props) =>
      rootEl.current ? <Portal container={rootEl.current}>{props.children}</Portal> : null,
    [rootEl]
  );
  return Prtl;
}

export default Portal;
export { Portal, usePortal };
