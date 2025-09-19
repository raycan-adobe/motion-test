const presets = [
  {
    id: "fade-up",
    name: "Fade up",
    description: "A soft entrance that rises gently into place.",
    className: "anim-fade-up",
    loopClass: "loop-fade-up",
    meta: "0.7s • Ease-out",
  },
  {
    id: "bounce",
    name: "Bounce",
    description: "Playful elastic motion with a pronounced overshoot.",
    className: "anim-bounce",
    loopClass: "loop-bounce",
    meta: "0.9s • Bouncy",
  },
  {
    id: "zoom-spin",
    name: "Zoom & spin",
    description: "Dynamic pop-in that rotates into view.",
    className: "anim-zoom-spin",
    loopClass: "loop-zoom-spin",
    meta: "0.8s • Dramatic",
  },
  {
    id: "slide-left",
    name: "Slide left",
    description: "Slides from the left with a subtle ease back.",
    className: "anim-slide-left",
    loopClass: "loop-slide-left",
    meta: "0.65s • Snappy",
  },
  {
    id: "tilt-float",
    name: "Tilt & float",
    description: "3D tilt that settles into a floating hover.",
    className: "anim-tilt-float",
    loopClass: "loop-tilt-float",
    meta: "1.1s • Atmospheric",
  },
];

const presetForm = document.querySelector("#preset-form");
const template = document.querySelector("#preset-template");
const demoShape = document.querySelector("#demo-shape");
const previewTitle = document.querySelector("#preview-title");
const previewDescription = document.querySelector("#preview-description");
const replayButton = document.querySelector("#replay");

let currentPreset = null;
const animationClasses = new Set(presets.map((preset) => preset.className));

function renderPresets() {
  const fragment = document.createDocumentFragment();

  presets.forEach((preset, index) => {
    const node = template.content.firstElementChild.cloneNode(true);
    const input = node.querySelector(".preset-input");
    const name = node.querySelector(".preset-name");
    const meta = node.querySelector(".preset-meta");
    const previewShape = node.querySelector(".preview-shape");

    input.id = `preset-${preset.id}`;
    input.value = preset.id;
    input.setAttribute("aria-describedby", `preset-${preset.id}-meta`);
    if (index === 0) {
      input.checked = true;
    }

    name.textContent = preset.name;
    meta.textContent = preset.meta;
    meta.id = `preset-${preset.id}-meta`;
    previewShape.classList.add(preset.loopClass);

    node.setAttribute("for", input.id);

    input.addEventListener("change", () => {
      if (input.checked) {
        playPreset(preset);
      }
    });

    fragment.appendChild(node);
  });

  presetForm.appendChild(fragment);
}

function playPreset(preset) {
  if (!preset || currentPreset?.id === preset.id) {
    // restart the animation if the same preset is selected
    restartAnimation(demoShape);
  } else {
    previewTitle.textContent = preset.name;
    previewDescription.textContent = preset.description;
    currentPreset = preset;
  }

  demoShape.classList.remove(...animationClasses);
  // Trigger reflow to restart the animation cleanly
  void demoShape.offsetWidth;
  demoShape.classList.add(preset.className);
  demoShape.focus({ preventScroll: true });
}

function restartAnimation(element) {
  element.classList.remove(...animationClasses);
  void element.offsetWidth;
  if (currentPreset) {
    element.classList.add(currentPreset.className);
  }
}

renderPresets();

// Play the first preset on load for instant feedback
if (presets.length) {
  playPreset(presets[0]);
}

replayButton.addEventListener("click", () => {
  restartAnimation(demoShape);
});
