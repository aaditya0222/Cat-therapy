let memeCount = 0;
let preloadedImages = {};
let isMuted = false;

// Cat memes
const catMemes = [
  {
    img: "./images/insp1.jpg",
    text: "Kahi ko ris kahi • You're tougher than this! 💪",
  },
  {
    img: "./images/insp2.jpg",
    text: "When you're just existing and mummy finds fault 🙃 • It happens!",
  },
  {
    img: "./images/insp3.jpg",
    text: "Just nod and say 'hunxa' 😌 • Works most of the time!",
  },
  {
    img: "./images/insp4.jpg",
    text: "Plot twist: You're the strong one 🦁 • Believe it!",
  },
  {
    img: "./images/insp5.jpg",
    text: "Mummy today: 😤 | Mummy tomorrow: 'Kei khane babu?' 🥰",
  },
  {
    img: "./images/insp6.jpg",
    text: "Mummy scolds = Love language 💕 • She cares!",
  },
];

// Sound effects using Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSound(type) {
  if (isMuted) return;

  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  switch (type) {
    case "click":
      // Soft pop sound
      oscillator.frequency.value = 800;
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.1,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      break;

    case "meme":
      // Playful ascending tone
      oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        600,
        audioContext.currentTime + 0.15,
      );
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.15,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.15);
      break;

    case "bonus":
      // Cheerful chime
      oscillator.frequency.setValueAtTime(523, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(659, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(784, audioContext.currentTime + 0.2);
      gainNode.gain.setValueAtTime(0.12, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      break;

    case "complete":
      // Success sound
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(
        800,
        audioContext.currentTime + 0.2,
      );
      gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.2,
      );
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      break;
  }
}

function toggleMute() {
  isMuted = !isMuted;
  const btn = document.getElementById("muteBtn");
  btn.textContent = isMuted ? "🔇" : "🔊";

  // Play a sound when unmuting
  if (!isMuted) {
    playSound("click");
  }
}

// Preload all images when page loads
function preloadImages() {
  catMemes.forEach((meme, index) => {
    const img = new Image();
    img.src = meme.img;
    preloadedImages[index] = img;
  });
}

window.addEventListener("load", preloadImages);

function goToScreen(num) {
  playSound("click");

  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("screen" + num).classList.add("active");

  if (num === 3 && memeCount === 0) {
    showMeme();
  }

  if (num === 6) {
    playSound("complete");
  }

  createFloatingEmoji();
}

function nextMeme() {
  if (memeCount < catMemes.length) {
    playSound("meme");
    showMeme();
  } else {
    goToScreen(4);
  }
  createFloatingEmoji();
}

function showMeme() {
  if (memeCount >= catMemes.length) memeCount = 0;

  const message = catMemes[memeCount];
  const catImg = document.getElementById("catImage");
  const loader = document.getElementById("imageLoader");

  loader.classList.remove("hidden");
  catImg.classList.remove("loaded");

  if (preloadedImages[memeCount] && preloadedImages[memeCount].complete) {
    catImg.src = message.img;
    catImg.classList.add("loaded");
    loader.classList.add("hidden");
  } else {
    const tempImg = new Image();
    tempImg.onload = function () {
      catImg.src = message.img;
      catImg.classList.add("loaded");
      loader.classList.add("hidden");
    };
    tempImg.src = message.img;
  }

  catImg.style.animation = "none";
  setTimeout(() => {
    catImg.style.animation = "slideIn 0.5s ease";
  }, 10);

  document.getElementById("complimentBox").textContent = message.text;

  const inspirationsLeft = catMemes.length - memeCount - 1;
  document.getElementById("counter").textContent =
    inspirationsLeft > 0
      ? `${inspirationsLeft} inspirations left`
      : "Last inspiration!";

  memeCount++;
}

function showBonusScreen() {
  playSound("bonus");
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("screen5").classList.add("active");
  createFloatingEmoji();
}

function createFloatingEmoji() {
  const emojis = ["💛", "✨", "🌟", "😺", "💪", "🌈"];

  const emoji1 = document.createElement("div");
  emoji1.className = "floating-emoji";
  emoji1.textContent = "💫";
  emoji1.style.left = 10 + Math.random() * 20 + "%";
  emoji1.style.top = 50 + Math.random() * 20 - 10 + "%";
  document.body.appendChild(emoji1);
  setTimeout(() => emoji1.remove(), 3000);

  const emoji2 = document.createElement("div");
  emoji2.className = "floating-emoji";
  emoji2.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  emoji2.style.left = 70 + Math.random() * 20 + "%";
  emoji2.style.top = 50 + Math.random() * 20 - 10 + "%";
  document.body.appendChild(emoji2);
  setTimeout(() => emoji2.remove(), 3000);
}
