import React from 'react';

const ObserverContext = React.createContext();

const defaultOptions = {};

const useIntersectionObserver = ({ root, thresholds = 0, rootMargin }) => {
  const [observer, setObserver] = React.useState(null);
  const [els, setEls] = React.useState(new Map());

  const observeElement = React.useCallback(
    (element, callback) => {
      let callbacks = els.get(element) || [];
      if (!els.has(element)) {
        els.set(element, callbacks);
      }
      callbacks.push(callback);
      observer && observer.observe(element);

      return function unobserve() {
        callbacks.splice(callbacks.indexOf(callback), 1);
        if (callbacks.length === 0) {
          els.delete(element);
          observer && observer.unobserve(element);
        }
      };
    },
    [els, observer]
  );
  React.useEffect(
    () => {
      // TODO: clean previous intersection observer after new intersection observer is created
      const o = new IntersectionObserver(
        (entries, ob) => {
          entries.forEach((entry) => {
            const inView =
              entry.isIntersecting && thresholds.some((t) => t <= entry.intersectionRatio);
            const arr = els.get(entry.target);
            arr &&
              arr.forEach((cb) => {
                cb(inView, entry);
              });
          });
        },
        { root, threshold: thresholds, rootMargin }
      );
      setObserver(o);
    },
    // Settings array as dependency to deps causes re-render
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [Array.isArray(thresholds) ? thresholds.toString() : thresholds, root, rootMargin, els]
  );

  return { observeElement, elements: els, observer };
};

const useObserver = ({ initialInView }) => {
  const { observeElement } = React.useContext(ObserverContext);
  if (!observeElement) {
    throw new Error('No intersection observer found at root');
  }

  const unobserve = React.useRef();
  const [inView, setInView] = React.useState(initialInView);
  const [entry, setEntry] = React.useState(null);

  const setRef = React.useCallback(
    (node) => {
      if (unobserve.current !== undefined) {
        unobserve.current();
        unobserve.current = undefined;
      }
      if (node) {
        unobserve.current = observeElement(node, (iv, entry) => {
          setInView(iv);
          setEntry(entry);
        });
      }
    },
    [observeElement]
  );
  return [setRef, inView, entry];
};

const IntersectionObserverComponent = function (props) {
  const { options = { thresholds: [0] }, children } = props;
  const o = useIntersectionObserver(options);
  return <ObserverContext.Provider value={o}>{children}</ObserverContext.Provider>;
};
export default IntersectionObserverComponent;

export class ObserverComponent extends React.Component {
  static contextType = ObserverContext;
  state = {
    inView: false,
  };
  _unobserveCb = null;
  node = null;

  constructor(props) {
    super(props);
    this.state = {
      inView: true,
      entry: null,
    };
  }
  unobserve() {
    if (this._unobserveCb) {
      this._unobserveCb();
      this._unobserveCb = null;
    }
  }
  manageNode = (node, context) => {
    if (this.node) {
      this.unobserve();
      if (!node) {
        this.setState({ inView: false });
      }
    }
    this.node = node ? node : null;
    this.observeNode(node, context);
  };

  observeNode(node, context) {
    if (!this.node) return;
    const { observeElement, observer } = context;
    observeElement(node, (iv, entry) => {
      this.setState({ inView: iv, entry });
    });
  }

  componentWillUnmount() {
    this.unobserve();
  }

  manageRef = (context) => {
    return (node) => {
      this.manageNode(node, context);
    };
  };

  render() {
    const { inView, entry } = this.state;
    if (typeof this.props.children !== 'function') {
      throw new Error('child should be a render prop');
    }
    return (
      <ObserverContext.Consumer>
        {(val) => {
          return this.props.children({ inView, entry, ref: this.manageRef(val) });
        }}
      </ObserverContext.Consumer>
    );
  }
}

export const ObserverComponent2 = (props) => {
  const { children, initialInView } = props;
  const [ref, inView, entry] = useObserver({ initialInView });

  return children({ inView, entry, ref });
};
