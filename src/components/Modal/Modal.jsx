import React, { useMemo } from 'react';
import BaseModal from '../Overlay/Modal';

const ModalContext = React.createContext(null);

const Modal = React.forwardRef((props, ref) => {
  const { children, open, onClose, as: Component, ...rest } = props;
  const modalContextValue = useMemo(
    () => ({
      onModalClose: onClose,
    }),
    [onClose]
  );

  return (
    <ModalContext.Provider value={modalContextValue}>
      <BaseModal open={open} onClose={onClose} ref={ref} {...rest}>
        <Component className='root-modal-1'>{children}</Component>
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
