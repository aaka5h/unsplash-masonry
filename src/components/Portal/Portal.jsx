import React from 'react';
import ReactDOM from 'react-dom';

export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement
);
export class Portal extends React.Component {
  portalNode = null;
  container = null;

  constructor(props) {
    super(props);
    this.container = props.container || (canUseDOM && document.body);
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    this.container = this.props.container || document.body;
  }

  componentWillUnmount() {
    if (this.portalNode) {
      this.container.removeChild(this.portalNode);
    }
    this.portalNode = null;
  }

  render() {
    if (!this.portalNode) {
      this.portalNode = document.createElement('div');
      this.portalNode.classList.add('portal-node');
      this.container.appendChild(this.portalNode);
    }

    return ReactDOM.createPortal(this.props.children, this.portalNode);
  }
}

Portal.defaultProps = {
  container: null,
};
