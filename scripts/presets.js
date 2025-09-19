export const presets = [
  {
    id: "bounce",
    name: "Bounce",
    description: "A playful bounce with exaggerated ease to showcase squash and stretch.",
    baseDuration: 1600,
    keyframes: [
      { transform: "translateY(-32px) scaleX(1.05) scaleY(0.95)" },
      { transform: "translateY(0) scale(1)", offset: 0.45 },
      { transform: "translateY(-12px) scaleX(0.95) scaleY(1.05)", offset: 0.65 },
      { transform: "translateY(0) scale(1)" }
    ],
    options: {
      easing: "cubic-bezier(0.28, 0.84, 0.42, 1)",
      iterations: Infinity,
      direction: "alternate"
    }
  },
  {
    id: "pulse",
    name: "Pulse",
    description: "A breathing pulse that smoothly scales the element in and out.",
    baseDuration: 1800,
    keyframes: [
      { transform: "scale(1)", opacity: 0.65 },
      { transform: "scale(1.15)", opacity: 1, offset: 0.55 },
      { transform: "scale(1)", opacity: 0.65 }
    ],
    options: {
      easing: "ease-in-out",
      iterations: Infinity,
      direction: "alternate"
    }
  },
  {
    id: "slide",
    name: "Slide + Fade",
    description: "Slides the element across the stage while fading in and out for emphasis.",
    baseDuration: 1400,
    keyframes: [
      { transform: "translateX(-32px)", opacity: 0.1 },
      { transform: "translateX(0)", opacity: 1, offset: 0.4 },
      { transform: "translateX(32px)", opacity: 0.1 }
    ],
    options: {
      easing: "cubic-bezier(0.4, 0, 0.2, 1)",
      iterations: Infinity,
      direction: "alternate"
    }
  },
  {
    id: "spin",
    name: "Spin",
    description: "Rotates the element while gently bobbing to highlight continuous motion.",
    baseDuration: 2000,
    keyframes: [
      { transform: "rotate(0deg) translateY(-6px)" },
      { transform: "rotate(180deg) translateY(6px)", offset: 0.5 },
      { transform: "rotate(360deg) translateY(-6px)" }
    ],
    options: {
      easing: "linear",
      iterations: Infinity
    }
  }
];
