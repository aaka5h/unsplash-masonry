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

  const [exited, setExited] = React.useState(!open);

  if (open) {
    if (exited) setExited(false);
  } /* else if (!exited) {
    setExited(true);
  } */
  const mountModal = open || !exited;
  // const ModalPortal = usePortal({ container: modalsDiv });

  React.useEffect(() => {}, [exited]);

  const handleExited = React.useCallback(() => {
    setExited(true);
  }, []);

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
          unmountOnExit
          transitionOnAppear={transitionOnAppear}
          in={open}
          timeout={dialogTransitionTimeout}
          onExited={handleExited}
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
