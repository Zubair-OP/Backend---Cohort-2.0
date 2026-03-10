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

  if (browDown > 0.35 && eyeSquint > 0.3) return "😠 Angry";
  if (mouthFrown > 0.15 || (browInnerUp > 0.2 && smile < 0.1)) return "😢 Sad";
  if (smile > 0.2) return "🙂 Happy";
  return "😐 Neutral";
}
