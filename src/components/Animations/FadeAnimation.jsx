import React from 'react';
import {Transition} from 'react-spring/renderprops';

export const FadeAnimation = React.forwardRef((props, ref) => {
  const {
    children,
    show,
    from = { opacity: 0 },
    enter = { opacity: 1 },
    leave = { opacity: 0 },
    ...rest
  } = props;

  return (
    <Transition
      ref={ref}
      items={show}
      from={from}
      enter={enter}
      leave={leave}
      {...rest}
      children={(child) => show && child}
    />
  );
});
