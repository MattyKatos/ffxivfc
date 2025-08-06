// DJ Jippity’s anime.js front-end magic
window.onload = function() {
  // ANIMATE TITLE
  anime({
    targets: '#main-title',
    translateY: [-80, 0],
    opacity: [0, 1],
    scale: [0.7, 1],
    duration: 1500,
    easing: 'easeOutElastic(1, .8)'
  });
  anime({
    targets: '#subtitle',
    opacity: [0, 1],
    delay: 1700,
    duration: 1000,
    translateY: [40, 0],
    easing: 'easeOutQuad'
  });

  // GENERATE 500 FLAMES
  const fireBar = document.querySelector('.fire-bar');
  for (let i = 0; i < 500; i++) {
    const flame = document.createElement('div');
    flame.className = 'flame';
    // Randomize size, opacity, and delay for MAXIMUM CHAOS
    const height = 90 + Math.random() * 70; // 90-160px
    const width = 20 + Math.random() * 40;  // 20-60px
    const delay = (Math.random() * 2).toFixed(2) + 's';
    const opacity = (0.65 + Math.random() * 0.35).toFixed(2);
    flame.style.height = height + 'px';
    flame.style.width = width + 'px';
    flame.style.opacity = opacity;
    flame.style.animationDelay = delay;
    flame.style.margin = '0 0.5px';
    fireBar.appendChild(flame);
  }


}


document.getElementById('ignite-btn').addEventListener('click', function() {
  // Animate the title as before
  anime({
    targets: '#main-title',
    scale: [1, 1.2, 1],
    color: ['#fff', '#ffb347', '#fff'],
    duration: 1200,
    easing: 'easeInOutQuad'
  });
  // Fade everything except the title to black
  anime({
    targets: [
      '.container > #subtitle',
      '.container > #ignite-btn',
      '.haze-overlay',
      '.fire-shadow',
      '.fire-bar'
    ],
    opacity: [1, 0],
    duration: 900,
    easing: 'easeInOutQuad'
  });
  // Fade the card background to black and remove glow
  document.querySelector('.container').classList.add('no-glow');
  anime({
    targets: '.container',
    background: ['rgba(34, 17, 51, 0.85)', '#000'],
    duration: 900,
    easing: 'easeInOutQuad'
  });
  // Fade body background to black
  anime({
    targets: 'body',
    background: [
      'linear-gradient(135deg, #2d1f33 0%, #ffb347 100%)',
      '#000'
    ],
    duration: 900,
    easing: 'easeInOutQuad'
  });
  // Redirect after fade
  setTimeout(function() {
    window.location.href = 'https://discord.gg/6T9gtkDH7M';
  }, 1100);
});
