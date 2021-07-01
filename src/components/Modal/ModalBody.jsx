import React from 'react';
import { ModalContext } from './AnimatedModal';

const ModalBody = (props) => {
  const { children, style, ...rest } = props;
  const modalContext = React.useContext(ModalContext);
  const bodyStyles = modalContext.bodyStyles();
  return <div className="modal-body" style={{ ...bodyStyles, ...style }}>{children}</div>;
};

export default ModalBody;
