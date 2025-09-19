const toolbar = document.querySelector('.toolbar');
const canvas = document.getElementById('canvas');
const shapeDataType = 'application/x-shape-type';

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function enableCanvasShapeDragging(shape) {
  shape.addEventListener('pointerdown', (event) => {
    if (event.button !== 0) {
      return;
    }

    event.preventDefault();
    const canvasRect = canvas.getBoundingClientRect();
    const shapeRect = shape.getBoundingClientRect();
    const offsetX = event.clientX - shapeRect.left;
    const offsetY = event.clientY - shapeRect.top;

    shape.setPointerCapture(event.pointerId);

    const handlePointerMove = (moveEvent) => {
      const currentCanvasRect = canvas.getBoundingClientRect();
      const targetX = moveEvent.clientX - currentCanvasRect.left - offsetX;
      const targetY = moveEvent.clientY - currentCanvasRect.top - offsetY;
      const maxX = currentCanvasRect.width - shape.offsetWidth;
      const maxY = currentCanvasRect.height - shape.offsetHeight;

      shape.style.left = `${clamp(targetX, 0, maxX)}px`;
      shape.style.top = `${clamp(targetY, 0, maxY)}px`;
    };

    const handlePointerUp = (upEvent) => {
      shape.releasePointerCapture(upEvent.pointerId);
      shape.removeEventListener('pointermove', handlePointerMove);
      shape.removeEventListener('pointerup', handlePointerUp);
      shape.removeEventListener('pointercancel', handlePointerUp);
    };

    shape.addEventListener('pointermove', handlePointerMove);
    shape.addEventListener('pointerup', handlePointerUp);
    shape.addEventListener('pointercancel', handlePointerUp);
  });
}

function createShape(type, x, y) {
  const shape = document.createElement('div');
  shape.classList.add('canvas-shape', type);
  shape.setAttribute('role', 'img');
  shape.setAttribute('aria-label', `${type} shape`);
  shape.style.left = '0px';
  shape.style.top = '0px';
  shape.draggable = false;

  canvas.appendChild(shape);

  const shapeRect = shape.getBoundingClientRect();
  const canvasRect = canvas.getBoundingClientRect();
  const centeredLeft = x - shapeRect.width / 2;
  const centeredTop = y - shapeRect.height / 2;

  const maxX = canvasRect.width - shapeRect.width;
  const maxY = canvasRect.height - shapeRect.height;

  shape.style.left = `${clamp(centeredLeft, 0, maxX)}px`;
  shape.style.top = `${clamp(centeredTop, 0, maxY)}px`;

  enableCanvasShapeDragging(shape);
  return shape;
}

function handleToolbarKeydown(event) {
  const target = event.target.closest('.shape-template');
  if (!target) {
    return;
  }

  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    const canvasRect = canvas.getBoundingClientRect();
    createShape(target.dataset.shape, canvasRect.width / 2, canvasRect.height / 2);
  }
}

toolbar.addEventListener('keydown', handleToolbarKeydown);

Array.from(toolbar.querySelectorAll('.shape-template')).forEach((template) => {
  template.addEventListener('dragstart', (event) => {
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData(shapeDataType, template.dataset.shape);
  });
});

canvas.addEventListener('dragover', (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'copy';
});

canvas.addEventListener('drop', (event) => {
  event.preventDefault();
  const type = event.dataTransfer.getData(shapeDataType);
  if (!type) {
    return;
  }

  const canvasRect = canvas.getBoundingClientRect();
  const x = event.clientX - canvasRect.left;
  const y = event.clientY - canvasRect.top;

  createShape(type, x, y);
});
