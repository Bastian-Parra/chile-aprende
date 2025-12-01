"use client";

import { useEffect } from "react";
import JSConfetti from "js-confetti";

export default function ConfettiExplosion() {
  useEffect(() => {
    const jsConfetti = new JSConfetti();

    // Explosión principal
    jsConfetti.addConfetti({
      emojis: ["🎉", "✨", "⭐", "🎊"],
      emojiSize: 30,
      confettiNumber: 80,
    });

    // Explosión de partículas normal
    setTimeout(() => {
      jsConfetti.addConfetti({
        confettiColors: ["#00b894", "#55efc4", "#81ecec", "#74b9ff"],
        confettiRadius: 5,
        confettiNumber: 200,
      });
    }, 600);
  }, []);

  return null;
}
