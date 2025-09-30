import confetti from 'canvas-confetti';

// Trigger confetti celebration
export const triggerConfetti = () => {
  const count = 200;
  const defaults = {
    origin: { y: 0.7 },
    zIndex: 9999,
  };

  function fire(particleRatio: number, opts: confetti.Options) {
    confetti({
      ...defaults,
      ...opts,
      particleCount: Math.floor(count * particleRatio),
    });
  }

  // Fire multiple bursts for a celebration effect
  fire(0.25, {
    spread: 26,
    startVelocity: 55,
  });

  fire(0.2, {
    spread: 60,
  });

  fire(0.35, {
    spread: 100,
    decay: 0.91,
    scalar: 0.8,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 25,
    decay: 0.92,
    scalar: 1.2,
  });

  fire(0.1, {
    spread: 120,
    startVelocity: 45,
  });
};

// Trigger confetti from sides
export const triggerSideConfetti = () => {
  const end = Date.now() + 2 * 1000; // 2 seconds
  const colors = ['#FF6B6B', '#4ECDC4', '#51CF66', '#FFD93D'];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: colors,
      zIndex: 9999,
    });

    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: colors,
      zIndex: 9999,
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  };

  frame();
};

// Trigger simple confetti burst
export const triggerSimpleConfetti = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#FF6B6B', '#4ECDC4', '#51CF66', '#FFD93D', '#FF8787'],
    zIndex: 9999,
  });
};

// Trigger tomato splatter effect with red particles
export const triggerTomatoSplatter = () => {
  const tomatoColors = ['#ff4444', '#cc0000', '#ff6666', '#990000', '#ff2222'];

  // Central explosion
  confetti({
    particleCount: 100,
    spread: 360,
    origin: { x: 0.6, y: 0.5 },
    colors: tomatoColors,
    gravity: 1,
    drift: 0,
    ticks: 200,
    scalar: 0.8,
    zIndex: 9998,
  });

  // Juice spray effect
  confetti({
    particleCount: 50,
    angle: 45,
    spread: 45,
    origin: { x: 0.6, y: 0.5 },
    colors: tomatoColors,
    gravity: 0.8,
    drift: -0.2,
    ticks: 150,
    scalar: 0.6,
    zIndex: 9998,
  });

  confetti({
    particleCount: 50,
    angle: 135,
    spread: 45,
    origin: { x: 0.6, y: 0.5 },
    colors: tomatoColors,
    gravity: 0.8,
    drift: 0.2,
    ticks: 150,
    scalar: 0.6,
    zIndex: 9998,
  });

  // Dripping effect
  setTimeout(() => {
    confetti({
      particleCount: 30,
      angle: 90,
      spread: 30,
      origin: { x: 0.6, y: 0.5 },
      colors: tomatoColors,
      gravity: 2,
      drift: 0,
      ticks: 300,
      scalar: 0.4,
      zIndex: 9998,
    });
  }, 200);
};
