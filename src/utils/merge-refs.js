function toFnRef(ref) {
  if (!ref || typeof ref ===  'function') {
    return ref;
  } else {
    return (value) => {
      ref.current = value;
    };
  }
}
export const mergeRefs = function (refA, refB) {
  const a = toFnRef(refA);
  const b = toFnRef(refB);

  return (val) => {
    if (typeof a === 'function') a(val);
    if (typeof b === 'function') b(val);
  };
};
