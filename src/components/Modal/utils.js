import React from 'react';
import { debounce } from 'utils';
import helper from 'utils/dom-helper';

export const useBodyStyles = (ref, { overflow }) => {
  const [bodyStyles, setBodyStyles] = React.useState({});
  const windowResizeListener = React.useRef();

  const updateBodyStyles = React.useCallback(() => {
    const dialog = ref.current;
    const styles = {
      overflow: 'auto',
    };
    if (dialog) {
      const contentEl = dialog.querySelector('.dialog-content');
      const dialogBody = dialog.querySelector('.modal-body');
      const scrollHeight = dialogBody.scrollHeight;

      // const contentHeight = contentEl.offsetHeight;
      const bodyHeight = window.innerHeight;
      const maxHeight = scrollHeight >= bodyHeight ? bodyHeight : scrollHeight;
      styles.maxHeight = maxHeight;
    }

    console.log('updated body styles', styles);
    setBodyStyles(styles);
  }, [ref]);

  const onChangeBodyStyles = React.useCallback(() => {
    console.log('on change body styles', overflow);
    if (overflow) {
      updateBodyStyles();
      windowResizeListener.current = helper.on(window, 'resize', updateBodyStyles);
    }
  }, [updateBodyStyles, overflow, windowResizeListener]);

  console.log('applied body styles', bodyStyles);
  return [overflow ? bodyStyles : {}, onChangeBodyStyles];
};
