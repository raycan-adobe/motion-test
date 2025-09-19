const presets = {
  sunset: {
    background: 'linear-gradient(135deg, #ff9a8b 0%, #fecfef 100%)',
    borderColor: '#f3722c',
  },
  forest: {
    background: 'linear-gradient(135deg, #1b4332 0%, #95d5b2 100%)',
    borderColor: '#2d6a4f',
  },
  ocean: {
    background: 'linear-gradient(135deg, #012a4a 0%, #61a5c2 100%)',
    borderColor: '#014f86',
  },
};

const dropZone = document.getElementById('drop-zone');
const draggableItems = Array.from(document.querySelectorAll('.draggable'));
const presetButtons = Array.from(document.querySelectorAll('.preset'));

const logError = (context, error) => {
  console.error(`Something went wrong while ${context}.`, error);
};

const safeListener = (context, handler) => {
  return (event) => {
    try {
      handler(event);
    } catch (error) {
      logError(context, error);
    }
  };
};

const handleDragStart = safeListener('starting a drag', (event) => {
  event.dataTransfer.setData('text/plain', event.target.dataset.color);
  event.dataTransfer.effectAllowed = 'move';
  event.target.classList.add('dragging');
});

const handleDragEnd = safeListener('finishing a drag', (event) => {
  event.target.classList.remove('dragging');
});

const handleDragOver = safeListener('dragging over the canvas', (event) => {
  event.preventDefault();
  event.dataTransfer.dropEffect = 'move';
  dropZone.classList.add('is-target');
});

const handleDragLeave = safeListener('leaving the canvas', () => {
  dropZone.classList.remove('is-target');
});

const createCard = safeListener('creating a card', (event) => {
  const color = event.dataTransfer.getData('text/plain');
  if (!color) {
    throw new Error('The dragged item did not provide a color.');
  }

  const card = document.createElement('div');
  card.className = 'card';
  card.style.backgroundColor = color;
  card.textContent = `Card ${dropZone.querySelectorAll('.card').length + 1}`;
  dropZone.appendChild(card);
  dropZone.classList.remove('is-target');
  togglePlaceholder();
});

const applyPreset = safeListener('applying the preset', (event) => {
  const presetName = event.target.dataset.preset;
  const preset = presets[presetName];

  if (!preset) {
    throw new Error(`Preset "${presetName}" does not exist.`);
  }

  dropZone.style.background = preset.background;
  dropZone.style.borderColor = preset.borderColor;
});

const togglePlaceholder = () => {
  const placeholder = dropZone.querySelector('.placeholder');
  const hasCards = dropZone.querySelectorAll('.card').length > 0;

  if (hasCards && placeholder) {
    placeholder.remove();
  } else if (!hasCards && !placeholder) {
    const newPlaceholder = document.createElement('p');
    newPlaceholder.className = 'placeholder';
    newPlaceholder.textContent = 'Drop cards here';
    dropZone.appendChild(newPlaceholder);
  }
};

dropZone.addEventListener('dragover', handleDragOver);
dropZone.addEventListener('dragleave', handleDragLeave);
dropZone.addEventListener('drop', (event) => {
  event.preventDefault();
  createCard(event);
});

draggableItems.forEach((item) => {
  item.addEventListener('dragstart', handleDragStart);
  item.addEventListener('dragend', handleDragEnd);
});

presetButtons.forEach((button) => {
  button.addEventListener('click', applyPreset);
});

window.addEventListener(
  'error',
  safeListener('handling an unexpected window error', (event) => {
    logError('handling an unexpected window error', event.error);
  })
);

window.addEventListener(
  'unhandledrejection',
  safeListener('handling an unhandled promise rejection', (event) => {
    logError('handling an unhandled promise rejection', event.reason);
  })
);
