// DJ Jippity’s anime.js front-end magic
window.onload = function() {
  // ANIMATE TITLE
  anime({
    targets: '#main-title',
    translateY: [-80, 0],
    opacity: [0, 1],
    scale: [0.7, 1],
    duration: 2000,
    easing: 'easeOutElastic(1, .8)'
  });
  anime({
    targets: '#subtitle',
    opacity: [0, 1],
    delay: 1800,
    duration: 2400,
    translateY: [40, 0],
    easing: 'easeOutQuad'
  });

  // GENERATE 500 FLAMES
  const fireBar = document.querySelector('.fire-bar');
  for (let i = 0; i < 500; i++) {
    const flame = document.createElement('div');
    flame.className = 'flame';
    // Randomize size, opacity, and delay for MAXIMUM CHAOS
    const height = 55 + Math.random() * 40; // 55-95px
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
  anime({
    targets: 'body',
    background: [
      'linear-gradient(135deg, #2d1f33 0%, #ffb347 100%)',
      'linear-gradient(135deg, #ff8800 0%, #2d1f33 100%)',
      'linear-gradient(135deg, #2d1f33 0%, #ffb347 100%)'
    ],
    duration: 2000,
    easing: 'easeInOutSine'
  });
  anime({
    targets: '#main-title',
    scale: [1, 1.2, 1],
    color: ['#fff', '#ffb347', '#fff'],
    duration: 1200,
    easing: 'easeInOutQuad'
  });
});
