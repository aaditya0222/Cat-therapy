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

// Web Audio API
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
  if (isMuted) return;

  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.connect(gain);
  gain.connect(audioContext.destination);
  const now = audioContext.currentTime;

  switch (type) {
    case "click":
      osc.type = "square";
      osc.frequency.setValueAtTime(900, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc.start(now);
      osc.stop(now + 0.08);
      break;
    case "meme":
      osc.type = "sine";
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
      osc.start(now);
      osc.stop(now + 0.15);
      break;
    case "bonus":
      const osc2 = audioContext.createOscillator();
      const gain2 = audioContext.createGain();
      osc.type = "triangle";
      osc2.type = "sine";
      osc.frequency.setValueAtTime(523, now);
      osc.frequency.exponentialRampToValueAtTime(659, now + 0.15);
      osc2.frequency.setValueAtTime(783, now);
      osc2.frequency.exponentialRampToValueAtTime(1046, now + 0.15);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      gain2.gain.setValueAtTime(0.08, now);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc2.connect(gain2);
      gain2.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.3);
      osc2.start(now);
      osc2.stop(now + 0.3);
      break;
    case "complete":
      const osc3 = audioContext.createOscillator();
      const gain3 = audioContext.createGain();
      osc.type = "triangle";
      osc3.type = "sine";
      osc.frequency.setValueAtTime(700, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.25);
      osc3.frequency.setValueAtTime(850, now);
      osc3.frequency.exponentialRampToValueAtTime(1050, now + 0.25);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      gain3.gain.setValueAtTime(0.12, now);
      gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc3.connect(gain3);
      gain3.connect(audioContext.destination);
      osc.start(now);
      osc.stop(now + 0.25);
      osc3.start(now);
      osc3.stop(now + 0.25);
      break;
    case "crack":
      // Cracking glass sound
      osc.type = "square";
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.3);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.start(now);
      osc.stop(now + 0.3);
      break;
  }
}

// Mute toggle
function toggleMute() {
  isMuted = !isMuted;
  document.getElementById("muteBtn").textContent = isMuted ? "🔇" : "🔊";
  if (!isMuted) playSound("click");
}

// Preload images
function preloadImages() {
  catMemes.forEach((m, index) => {
    const img = new Image();
    img.src = m.img;
    preloadedImages[index] = img;
  });

  preloadedImages.happy = new Image();
  preloadedImages.happy.src = "./images/happy.jpg";

  preloadedImages.salute = new Image();
  preloadedImages.salute.src = "./images/cat-salute.gif";

  preloadImages.bonus = new Image();
  preloadImages.bonus.src = "./images/bonus.jpg";
}
window.addEventListener("load", preloadImages);

// Screen navigation
function goToScreen(num) {
  playSound("click");
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("screen" + num).classList.add("active");

  if (num === 3 && memeCount === 0) showMeme();
  if (num === 4) showHappy();
  if (num === 6) showSalute();
  createFloatingEmoji();
}

// Meme functions
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

  const msg = catMemes[memeCount];
  const img = document.getElementById("memeImage");
  const loader = document.getElementById("memeLoader");
  loader.classList.add("hidden"); // preloaded
  img.src = preloadedImages[memeCount].src;
  img.classList.add("loaded");

  img.style.animation = "none";
  setTimeout(() => (img.style.animation = "slideIn 0.5s ease"), 10);

  document.getElementById("memeComplimentBox").textContent = msg.text;

  // Update progress bar
  const currentProgress = memeCount + 1;
  const progressPercent = (currentProgress / catMemes.length) * 100;
  document.getElementById("memeProgressBar").style.width =
    progressPercent + "%";
  document.getElementById("progressCat").style.left = progressPercent + "%";

  // Change cat emoji based on progress
  const progressCat = document.getElementById("progressCat");
  if (currentProgress === 1) {
    progressCat.textContent = "🐱";
  } else if (currentProgress <= 3) {
    progressCat.textContent = "😺";
  } else if (currentProgress < 6) {
    progressCat.textContent = "😸";
  } else {
    progressCat.textContent = "🎉";
    // Celebrate at finish - flag wave
    const flag = document.getElementById("progressFlag");
    flag.classList.add("celebrate");
    setTimeout(() => flag.classList.remove("celebrate"), 600);
  }

  memeCount++;
}

function showHappy() {
  document.getElementById("screen4").classList.add("active");
  const img = document.getElementById("happyImage");
  img.style.animation = "slideIn 0.5s ease";
}

function showSalute() {
  document.getElementById("screen6").classList.add("active");
  const img = document.getElementById("saluteImage");
  img.style.animation = "slideIn 0.5s ease";
  playSound("complete");
}

function showBonus() {
  document.getElementById("screen5").classList.add("active");
  const img = document.getElementById("bonus");
  img.style.animation = "slideIn 0.5s ease";
  playSound("meme");
}

// Bonus screen
function showBonusScreen() {
  playSound("bonus");
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("screen5").classList.add("active");
  createFloatingEmoji();
}

// Floating emojis
function createFloatingEmoji() {
  const emojis = ["💛", "✨", "🌟", "😺", "💪", "🌈"];
  const e1 = document.createElement("div");
  e1.className = "floating-emoji";
  e1.textContent = "💫";
  e1.style.left = 10 + Math.random() * 20 + "%";
  e1.style.top = 50 + Math.random() * 20 - 10 + "%";
  document.body.appendChild(e1);
  setTimeout(() => e1.remove(), 3000);

  const e2 = document.createElement("div");
  e2.className = "floating-emoji";
  e2.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  e2.style.left = 70 + Math.random() * 20 + "%";
  e2.style.top = 50 + Math.random() * 20 - 10 + "%";
  document.body.appendChild(e2);
  setTimeout(() => e2.remove(), 3000);
}

// Reset app
function resetApp() {
  memeCount = 0;
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById("screen1").classList.add("active");
  playSound("complete");
}

// ENHANCED CRACK AND FALL - Everything falls apart!
function crackAndEnd() {
  playSound("crack"); // Cracking sound

  const container = document.getElementById("container");
  const blackout = document.getElementById("blackout");

  // Lock scroll
  document.body.classList.add("crack-mode");

  // Step 1: Shake the whole container
  container.classList.add("crack");

  // Step 2: Break everything into pieces after shake
  setTimeout(() => {
    container.classList.remove("crack");
    breakIntoElements();
  }, 600);

  // Step 3: Fade to black
  setTimeout(() => {
    blackout.style.opacity = "1";
  }, 2000);
}

function breakIntoElements() {
  const container = document.getElementById("container");
  const elements = container.querySelectorAll(
    "h2, p, button, img, .compliment-box, .image-container",
  );

  // Convert container to relative positioning context
  container.style.position = "relative";
  container.style.overflow = "visible";

  elements.forEach((element, index) => {
    // Skip if already processed
    if (element.classList.contains("falling-element")) return;

    // Get element's current position and computed styles
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);

    // Create a clone
    const clone = element.cloneNode(true);
    clone.classList.add("falling-element");

    // Copy ALL computed styles to make it look identical
    clone.style.position = "fixed";
    clone.style.left = rect.left + "px";
    clone.style.top = rect.top + "px";
    clone.style.width = rect.width + "px";
    clone.style.height = rect.height + "px";
    clone.style.margin = "0";
    clone.style.zIndex = "10000";

    // Preserve visual styling
    clone.style.background = computedStyle.background;
    clone.style.backgroundColor = computedStyle.backgroundColor;
    clone.style.backgroundImage = computedStyle.backgroundImage;
    clone.style.color = computedStyle.color;
    clone.style.fontSize = computedStyle.fontSize;
    clone.style.fontWeight = computedStyle.fontWeight;
    clone.style.borderRadius = computedStyle.borderRadius;
    clone.style.border = computedStyle.border;
    clone.style.boxShadow = computedStyle.boxShadow;
    clone.style.padding = computedStyle.padding;
    clone.style.textAlign = computedStyle.textAlign;
    clone.style.lineHeight = computedStyle.lineHeight;
    clone.style.fontFamily = computedStyle.fontFamily;

    // For images, ensure they're visible
    if (element.tagName === "IMG") {
      clone.style.objectFit = computedStyle.objectFit;
      clone.style.display = "block";
    }

    // Random fall parameters
    const randomDelay = Math.random() * 300; // 0-300ms delay
    const randomRotation = (Math.random() - 0.5) * 720; // -360 to 360 degrees
    const randomX = (Math.random() - 0.5) * 200; // Horizontal drift

    // Add to body
    document.body.appendChild(clone);

    // Hide original
    element.style.opacity = "0";

    // Start falling animation with delay
    setTimeout(() => {
      clone.style.transition = `all ${1.5 + Math.random() * 0.5}s cubic-bezier(0.4, 0, 0.6, 1)`;
      clone.style.transform = `translateY(${window.innerHeight + 200}px) translateX(${randomX}px) rotate(${randomRotation}deg) scale(0.8)`;
      clone.style.opacity = "0";
      clone.style.filter = "blur(3px)";
    }, randomDelay);

    // Clean up after animation
    setTimeout(() => {
      clone.remove();
    }, 2500 + randomDelay);
  });

  // Hide the original container after elements start falling
  setTimeout(() => {
    container.style.opacity = "0";
  }, 400);
}
