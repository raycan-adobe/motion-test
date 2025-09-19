import { presets } from "./presets.js";

const presetList = document.getElementById("preset-list");
const template = document.getElementById("preset-template");

if (!template || !presetList) {
  throw new Error("Unable to initialise the preset explorer UI.");
}

const palette = [
  "linear-gradient(135deg, #7b61ff, #4bc2ff)",
  "linear-gradient(135deg, #ff8a5c, #ffd15c)",
  "linear-gradient(135deg, #52ffb8, #48d4ff)",
  "linear-gradient(135deg, #ff61a6, #ffa36f)"
];

presets.forEach((preset, index) => {
  const instance = template.content.firstElementChild.cloneNode(true);
  instance.dataset.presetId = preset.id;

  const nameEl = instance.querySelector(".preset__name");
  const descriptionEl = instance.querySelector(".preset__description");
  const slider = instance.querySelector(".preset__slider");
  const valueEl = instance.querySelector(".preset__value");
  const shape = instance.querySelector(".preset__preview-shape");

  if (!nameEl || !descriptionEl || !slider || !valueEl || !shape) {
    return;
  }

  nameEl.textContent = preset.name;
  descriptionEl.textContent = preset.description;

  const initialDuration = clampDuration(
    preset.baseDuration ?? preset.options?.duration ?? 1600,
    Number(slider.min),
    Number(slider.max)
  );

  slider.value = String(initialDuration);
  valueEl.textContent = formatDuration(initialDuration);

  const colorIndex = index % palette.length;
  shape.style.backgroundImage = palette[colorIndex];

  const timing = buildTimingOptions(preset, initialDuration);
  let animation = shape.animate(preset.keyframes, timing);

  slider.addEventListener("input", (event) => {
    const newDuration = clampDuration(event.target.valueAsNumber, Number(slider.min), Number(slider.max));
    valueEl.textContent = formatDuration(newDuration);

    if (animation && typeof animation.cancel === "function") {
      animation.cancel();
    }

    animation = shape.animate(preset.keyframes, buildTimingOptions(preset, newDuration));
  });

  instance.addEventListener("mouseenter", () => {
    animation.play();
  });

  instance.addEventListener("focusin", () => {
    animation.play();
  });

  presetList.appendChild(instance);
});

function buildTimingOptions(preset, duration) {
  return {
    duration,
    fill: "both",
    iterations: Infinity,
    direction: "alternate",
    easing: "ease-in-out",
    ...(preset.options ?? {}),
    duration
  };
}

function formatDuration(duration) {
  if (duration >= 1000) {
    const seconds = duration / 1000;
    return `${Number(seconds.toFixed(seconds >= 1 ? 1 : 2))}s`;
  }

  return `${duration}ms`;
}

function clampDuration(value, min, max) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}
