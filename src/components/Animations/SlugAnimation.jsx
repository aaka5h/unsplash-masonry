import React from 'react';
import {animated, Trail} from 'react-spring/renderprops';

export const SlugAnimation = (props) => {
  const {
    children,
    keys,
    as = 'div',
    style,
    from = { opacity: 0, transform: 'translate3d(0,30px,0)' },
    to = { opacity: 1, transform: 'translate3d(0,0,0)' },
    ...rest
  } = props;

  return (
    <Trail
      native
      {...rest}
      keys={keys ? (child) => keys(child.props) : children.map((_, i) => i)}
      items={children}
      from={from}
      to={to}
      children={(child) => child}
    >
      {(child) => (styles) => {
        const Component = animated[as];
        const props = {
          style: {
            willChange: 'opacity, transform',
            ...style,
            ...styles,
          },
        };
        return <Component {...props}>{child}</Component>;
      }}
    </Trail>
  );
};
