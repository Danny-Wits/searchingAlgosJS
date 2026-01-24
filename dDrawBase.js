class pRect {
  constructor(x, y, w, h) {
    this.position = createVector(x, y);
    this.w = w;
    this.h = h;
  }
  right() {
    return this.position.x + this.w;
  }
  left() {
    return this.position.x;
  }
  top() {
    return this.position.y;
  }
  bottom() {
    return this.position.y + this.h;
  }
}

function rect_rect(pRect1, pRect2) {
  if (
    pRect2.right() < pRect1.left() ||
    pRect1.right() < pRect2.left() ||
    pRect2.bottom() < pRect1.top() ||
    pRect1.bottom() < pRect2.top()
  ) {
    return false;
  }
  return true;
}
