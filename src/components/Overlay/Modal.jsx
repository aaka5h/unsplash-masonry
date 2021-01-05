import ModalTransition from 'components/Animations/ModalTransition';
import Portal from 'components/Portal/Portal';
import { canUseDOM } from 'components/Portal/Portal';
import { usePortal } from 'components/Portal/Portal';
import React, { useCallback } from 'react';

let modalsDiv = null;

if (canUseDOM) {
  modalsDiv = document.createElement('div');
  modalsDiv.classList.add('modal-container');
  document.body.append(modalsDiv);
}
const Modal = React.forwardRef((props, ref) => {
  const {
    as: Component,
    backdrop,
    onBackdropClick,
    open,
    className,
    onClose,
    onEntering,
    onEntered,
    onExit,
    backdropStyles,
    dialogTransitionTimeout,
    transitionOnAppear,
    backdropTransitionTimeout,
    children,
    unmountOnExit,
    ...rest
  } = props;

  const mountModal = open;
  // const ModalPortal = usePortal({ container: modalsDiv });

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
        <div {...backdropProps} aria-hidden className="modal-backdrop"></div>
      </ModalTransition>
    );
  };

  return (
    <Portal container={modalsDiv}>
      <Component className={className}>
        {backdrop && backdropEl()}
        <ModalTransition
          unmountOnExit={unmountOnExit}
          transitionOnAppear={transitionOnAppear}
          timeout={300}
          in={open}
        >
          {children}
        </ModalTransition>
      </Component>
    </Portal>
  );
});

Modal.defaultProps = {
  as: 'div',
  backdrop: true,
  dialogTransitionTimeout: 300,
};

Modal.displayName = 'OverlayModal';
export default Modal;
