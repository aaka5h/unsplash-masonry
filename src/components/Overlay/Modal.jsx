import ModalTransition from 'components/Animations/ModalTransition';
import Portal from 'components/Portal/Portal';
import { canUseDOM } from 'components/Portal/Portal';
import React, { useCallback } from 'react';
import { getDomNode } from 'utils';
import { ModalManager } from './ModalManager';

let modalsDiv = null;
let modalManager;

function getModalManager() {
  if (!modalManager) modalManager = new ModalManager();
  else return modalManager;
}

function useModalManager() {
  const manager = getModalManager();
  const modal = React.useRef({ modal: null });

  return {
    add: (container, className) => {
      manager.add(modal.current, container, className);
    },
    remove: () => {
      manager.remove(modal.current);
    },
    setDialogRef: React.useCallback(
      (ref) => {
        modal.current.modal = ref;
      },
      [manager]
    ),
  };
}

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
  }

  const mountModal = open || !exited;
  // const ModalPortal = usePortal({ container: modalsDiv });
  const manager = useModalManager();

  const handleOpen = React.useCallback(() => {
    manager.add(document.body, 'modal-open');
  }, [manager]);

  const handleExited = React.useCallback(() => {
    setExited(true);
  }, []);

  const handleClose = React.useCallback(() => {
    manager.remove();
  }, [manager]);

  React.useEffect(() => {
    if (!open) return;
    handleOpen();
  }, [exited, open, handleOpen, handleExited]);

  React.useEffect(() => {
    if (!exited) return;
    handleClose();
  }, [exited]);

  React.useEffect(() => {
    if (!open) return;
    // document.body.classList.add('modal-open');
  }, [open, exited]);
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
      <Component ref={manager.setDialogRef} className={className}>
        {backdrop && backdropEl()}
        <ModalTransition
          unmountOnExit
          transitionOnAppear={transitionOnAppear}
          in={open}
          timeout={dialogTransitionTimeout}
          onExited={handleExited}
          onEntered={onEntered}
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
