import ModalTransition from 'components/Animations/ModalTransition';
import { Portal } from 'components/Portal/Portal';
import React, { useCallback } from 'react';
const Modal = React.forwardRef((props, ref) => {
  const {
    backdrop,
    onBackdropClick,
    as: Component,
    open,
    onClose,
    onEntering,
    onEntered,
    onExit,
    backdropStyles,
    children,
  } = props;

  const mountModal = open;

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target !== e.currentTarget) {
        return;
      }
      onBackdropClick && onBackdropClick();

      if (backdrop === true) {
        onClose && onClose();
      }
    },
    [backdrop, onBackdropClick, onClose]
  );

  if (!mountModal) {
    return null;
  }
  const backdropEl = () => {
    const backdropProps = {
      onClick: handleBackdropClick,
      style: backdropStyles,
    };
    return (
      <ModalTransition in={open}>
        <div {...backdropProps} aria-hidden className="modal-backdrop">
        </div>
      </ModalTransition>
    );
  };

  return (
    <Portal>
      <Component role="dialog" ref={ref}>
        {backdrop && backdropEl()}
        <ModalTransition in={open}>
          <div className="modal-wrapper original">
            <div className="modal">{children}</div>
          </div>
        </ModalTransition>
      </Component>
    </Portal>
  );
});

Modal.defaultProps = {
  as: 'div',
  backdrop: true,
};

Modal.displayName = 'OverlayModal';
export default Modal;
