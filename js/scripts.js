const pages = document.querySelectorAll('.page');
let current = 0;
let startX = 0;
let opened = false;
let endX = 0;

/* 🔥 TAMBAHAN: lock animasi */
let isAnimating = false;

pages.forEach((page, index) => {
  page.style.zIndex = pages.length - index;
});

/* ── Generate balon random ── */
const balloonColors = [
  { body:'#ff6b9d', knot:'#e05585' },
  { body:'#ffd166', knot:'#e0b040' },
  { body:'#6bcfff', knot:'#40aee0' },
  { body:'#a78bfa', knot:'#7c5cd6' },
  { body:'#51e898', knot:'#2ec070' },
  { body:'#ff9f7f', knot:'#e07050' },
  { body:'#f97316', knot:'#c45a0e' },
];

const scene = document.getElementById('balloonScene');
const sceneW = 350;
const sceneH = 500;
const count = 7;

if(scene){

  for(let i = 0; i < count; i++){
    const color = balloonColors[i % balloonColors.length];
    const randomLeft = 20 + Math.random() * (sceneW - 80);
    const randomBottom = 20 + Math.random() * (sceneH - 160);

    const balloon = document.createElement('div');
    balloon.className = 'balloon';
    balloon.style.cssText = `
      position:absolute;
      left:${randomLeft}px;
      bottom:${randomBottom}px;
      display:flex;
      flex-direction:column;
      align-items:center;
    `;

    balloon.innerHTML = `
      <div class="balloon-body" style="background:${color.body}; box-shadow:inset -8px -6px 0 rgba(0,0,0,0.1);">
        <div class="balloon-shine"></div>
      </div>
      <div class="balloon-knot" style="background:${color.knot};"></div>
      <div class="balloon-string"></div>
    `;

    scene.insertBefore(balloon, scene.querySelector('.cover-text'));

    TweenMax.from(balloon, 1.2, {
      y: 250,
      opacity: 0,
      ease: Elastic.easeOut.config(1, 0.6),
      delay: 0.2 + i * 0.12
    });

    TweenMax.to(balloon, 2 + Math.random(), {
      y: -(12 + Math.random() * 15),
      ease: Power1.easeInOut,
      yoyo: true,
      repeat: -1,
      delay: Math.random()
    });

    TweenMax.to(balloon, 1.6 + Math.random() * 0.8, {
      rotation: -8 + Math.random() * 16,
      transformOrigin: "bottom center",
      ease: Sine.easeInOut,
      yoyo: true,
      repeat: -1,
      delay: Math.random()
    });
  }
}

/* ── SWIPE FIX ── */
function getX(e){
  if(e.touches && e.touches.length > 0){
    return e.touches[0].clientX;
  }
  if(e.changedTouches && e.changedTouches.length > 0){
    return e.changedTouches[0].clientX;
  }
  return e.clientX;
}

/* START */
document.addEventListener("touchstart", e => {
  startX = getX(e);
});

document.addEventListener("mousedown", e => {
  startX = getX(e);
});

/* END */
document.addEventListener("touchend", e => {
  endX = getX(e);
  handleSwipe();
});

document.addEventListener("mouseup", e => {
  endX = getX(e);
  handleSwipe();
});
// Blok seleksi teks
document.addEventListener("selectstart", function (e) {
  e.preventDefault();
});

// Blok klik kanan
document.addEventListener("contextmenu", function (e) {
  e.preventDefault();
});

// Blok drag
document.addEventListener("dragstart", function (e) {
  e.preventDefault();
});

// Blok shortcut copy
document.addEventListener("keydown", function (e) {
  if (
    (e.ctrlKey || e.metaKey) &&
    ["c", "x", "u", "s", "a"].includes(e.key.toLowerCase())
  ) {
    e.preventDefault();
  }
});

/* ── FIXED SWIPE LOGIC ── */
function handleSwipe(){

  if(isAnimating) return; // 🔥 BLOCK kalau animasi

  let diff = startX - endX;

  if(Math.abs(diff) < 60) return; // swipe minimal

  if(diff > 0){
    nextPage();
  } else {
    prevPage();
  }
}

/* ── NEXT PAGE ── */
function nextPage(){

  if(isAnimating) return;
  if(current >= pages.length) return;

  isAnimating = true;

  const book = document.getElementById("book");
  const page = pages[current];

  // 1. ROTATE DULU
  if(current === 0){
    book.classList.add("opened");
  }

  // 2. tunggu rotate dulu baru flip
  setTimeout(() => {

    page.style.zIndex = pages.length + 1;
    page.classList.add('flipped');

    setTimeout(() => {

      current++;

      page.style.zIndex = current;

      isAnimating = false;

      updateBookTilt();

    }, 600); // flip duration

  }, 200); // delay rotate → flip
}

function updateBookTilt(){
  const book = document.getElementById("book");

  if(current > 0){
    book.classList.add("opened");
  } else {
    book.classList.remove("opened");
  }
}

/* ── PREV PAGE ── */
function prevPage(){

  if(isAnimating) return;
  if(current <= 0) return;

  isAnimating = true;

  const book = document.getElementById("book");

  current--;

  const page = pages[current];

  page.style.zIndex = pages.length + 1;
  page.classList.remove('flipped');

  setTimeout(() => {

    if(current === 0){
      book.classList.remove("opened");
    }

    page.style.zIndex = pages.length - current;

    isAnimating = false;

    updateBookTilt();

  }, 600);
}
