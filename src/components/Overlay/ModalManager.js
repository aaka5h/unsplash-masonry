function calculateScrollBarWidth(container) {
  return window.innerWidth - document.body.clientWidth;
}

export class ModalManager {
  modals = [];
  data = [];
  constructor() {}

  add(modal, container, className) {
    let modalIndex = this.modals.indexOf(modal);
    if (modalIndex !== -1) {
      return modalIndex;
    }

    // saving data prior to applied styles
    const data = {
      container: container,
      classNames: className ? className.split(/\s+/) : [],
      style: {
        overflow: container.style.overflow,
        paddingRight: container.style.paddingRight,
      },
    };
    this.modals.push(modal);
    this.data.push(data);
    // TODO: make account of already applied padding and stuff
    container.style.paddingRight = calculateScrollBarWidth(container) + 'px';
    container.classList.add(className);
    return this.modals.length;
  }

  remove(modal) {
    const modalIndex = this.modals.indexOf(modal);
    if (modalIndex === -1) {
      return;
    }
    const container = this.data[modalIndex].container;
    const classNames = this.data[modalIndex].classNames;
    classNames.forEach((c) => container.classList.remove(c));
    container.style.paddingRight = this.data[modalIndex].style.paddingRight;

    this.modals.splice(modalIndex, 1);
    this.data.splice(modalIndex, 1);
  }
}
