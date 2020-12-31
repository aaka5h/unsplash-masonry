function getRefTarget(ref) {
  if (ref) {
    if ('current' in ref) {
      return ref.current;
    } else return ref;
  }
}

export function getDomNode(elementOrRef) {
  const el =
    elementOrRef && elementOrRef.child
      ? elementOrRef.child
      : getRefTarget(elementOrRef);

  if (el && el.nodeType && typeof el.nodeName === 'string') {
    return el;
  }

  return getDomNode(el);
}
