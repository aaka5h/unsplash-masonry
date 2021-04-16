function on(el, e, callback) {
  el.addEventListener(e, callback);
  return {
    off: function () {
      el.removeEventListener(e, callback);
    },
  };
}

export default { on };
