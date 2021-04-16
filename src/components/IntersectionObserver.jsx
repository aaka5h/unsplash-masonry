import React from 'react';

const ObserverContext = React.createContext();

const defaultOptions = {};

const onEventCallback = (entries, observer) => {};

const useIntersectionObserver = (options) => {
  const [observer, setObserver] = React.useState(null);
  const [els, setEls] = React.useState(new Set());

  const observeElement = React.useCallback(
    (element) => {
      els.add();
    },
    [els]
  );

  const unobserveElement = React.useCallback((element) => {
    console.log('hello world');
  }, []);

  React.useEffect(() => {
    const o = new IntersectionObserver(onEventCallback, options);
    setObserver(o);
  }, [options]);
  return [observeElement, unobserveElement];
};

const useObserver = (ref, callback) => {
  const [observeElement, unobserveElement] = React.useContext(ObserverContext);
  observeElement(ref.current);
  React.useEffect(() => {
    return () => {
      // cleanup event
      unobserveElement(ref);
    };
  });
};

const IntersectionObserverComponent = function (props) {
  const { options, children } = props;
  const o = useIntersectionObserver(options);
  return <ObserverContext.Provider value={o}>{children}</ObserverContext.Provider>;
};
export default IntersectionObserverComponent;
