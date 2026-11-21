// Moves a soft glow under the pointer by setting --mx / --my on the element.
export function useSpotlight() {
  return {
    onPointerMove(event) {
      if (event.pointerType !== 'mouse') return;
      const el = event.currentTarget;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${event.clientX - r.left}px`);
      el.style.setProperty('--my', `${event.clientY - r.top}px`);
    },
  };
}
