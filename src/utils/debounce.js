export const debounce = function (func, duration) {
  let timer;
  const context = this;
  return function (...args) {
    const later = function () {
      func.apply(context, args);
    };
    if (timer) clearTimeout(timer);
    timer = setTimeout(later, duration || 0);
  };
};
