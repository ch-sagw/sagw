export const measureElementHeight = (el: HTMLElement): number => {
  if (!el) {
    return 0;
  }

  const clone = el.cloneNode(true) as HTMLElement;

  clone.style.visibility = 'hidden';
  clone.style.position = 'absolute';
  clone.style.height = 'auto';
  clone.style.maxHeight = 'none';
  clone.style.opacity = '0';
  clone.style.pointerEvents = 'none';
  document.body.appendChild(clone);

  const height = clone.offsetHeight;

  document.body.removeChild(clone);

  return height;
};
