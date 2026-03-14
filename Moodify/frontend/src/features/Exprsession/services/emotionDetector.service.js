function getScore(blendshapes, name) {
  const s = blendshapes.find((b) => b.categoryName === name);
  return s ? s.score : 0;
}

function avgScore(blendshapes, leftName, rightName) {
  return (getScore(blendshapes, leftName) + getScore(blendshapes, rightName)) / 2;
}

export function detectEmotion(blendshapes) {
  const smile = avgScore(blendshapes, "mouthSmileLeft", "mouthSmileRight");
  const browDown = avgScore(blendshapes, "browDownLeft", "browDownRight");
  const eyeSquint = avgScore(blendshapes, "eyeSquintLeft", "eyeSquintRight");
  const mouthFrown = avgScore(blendshapes, "mouthFrownLeft", "mouthFrownRight");
  const browInnerUp = getScore(blendshapes, "browInnerUp");
  const browOuterUp = avgScore(blendshapes, "browOuterUpLeft", "browOuterUpRight");
  const lowerLipDown = avgScore(blendshapes, "mouthLowerDownLeft", "mouthLowerDownRight");
  const mouthPucker = getScore(blendshapes, "mouthPucker");
  const jawOpen = getScore(blendshapes, "jawOpen");

  const sadScore =
    mouthFrown * 3.5 +
    browInnerUp * 1.5 +
    browOuterUp * 0.6 +
    lowerLipDown * 1.0 +
    mouthPucker * 0.8 -
    smile * 2.5;

  if (browDown > 0.35 && eyeSquint > 0.3 && smile < 0.15) {
    return { label: "😠 Angry", confidence: Math.min(((browDown + eyeSquint) / 2) * 1.2, 0.99) };
  }

  if (sadScore > 0.2 && smile < 0.25) {
    return { label: "😢 Sad", confidence: Math.min(Math.max(sadScore * 0.85, 0.35), 0.99) };
  }

  if (smile > 0.25 && sadScore < 0.1) {
    return { label: "🙂 Happy", confidence: Math.min(smile * 1.3, 0.99) };
  }

  return { label: "😐 Neutral", confidence: 0.75 };
}
