import React, { useMemo } from 'react';
import BaseModal from '../Overlay/Modal';
import { useBodyStyles } from './utils';

const ModalContext = React.createContext(null);

const Modal = React.forwardRef((props, ref) => {
  const { children, open, onClose, as: Component, ...rest } = props;
  const dialogRef = React.useRef();

  const modalContextValue = useMemo(
    () => ({
      onModalClose: onClose,
    }),
    [onClose]
  );

  return (
    <ModalContext.Provider value={modalContextValue}>
      <BaseModal open={open} onClose={onClose} ref={ref} {...rest}>
        <div className="modal-wrapper" ref={dialogRef}>
          <Component role="dialog">
            <div className="modal">{children}</div>
          </Component>
        </div>
      </BaseModal>
    </ModalContext.Provider>
  );
});

Modal.defaultProps = {
  backdrop: true,
  as: 'div',
};
Modal.displayName = 'DefaultModal';
export default Modal;
